// Everyone draws on a board of this size, scaled to fit their screen, so a
// drawing lands in the same place on every device
export const BOARD_WIDTH = 1280
export const BOARD_HEIGHT = 720
export const DEFAULT_LINE_WIDTH = 8

// How often points of a stroke in progress are sent to the server
const SEND_INTERVAL_MS = 40
// Pointer moves closer than this to the last point are skipped; they only add jitter
const MIN_DISTANCE = 2
// The pen trails the pointer by this many screen pixels and only moves once the pointer
// gets farther away, which irons out hand tremor and the 1px steps of a mouse
const LAZY_RADIUS = 10
// A stroke from someone else not extended for this long is treated as finished
// (its author probably disconnected mid-stroke)
const REMOTE_IDLE_MS = 5000

// One decimal is plenty of precision and keeps the payload small
const round = (value) => Math.round(value * 10) / 10
// Identifies where a stroke starts (index 0) or ends (index -2), to link batches of a stroke
const pointKey = ({ points, color, lineWidth }, index) =>
  `${points.at(index)},${points.at(index + 1)},${color},${lineWidth}`

/**
 * Turns server points into strokes ({ color, lineWidth, points: [x0, y0, x1, y1, ...] }).
 * A stroke starts at beginPath, or wherever the list starts, and ends at closePath.
 */
export function toStrokes(points) {
  const strokes = []
  let stroke = null
  for (const { x, y, color, lineWidth = DEFAULT_LINE_WIDTH, beginPath, closePath } of points) {
    if (!stroke || beginPath || color !== stroke.color || lineWidth !== stroke.lineWidth) {
      stroke = { color, lineWidth, points: [], begun: beginPath, closed: false }
      strokes.push(stroke)
    }
    stroke.points.push(x, y)
    if (closePath) {
      stroke.closed = true
      stroke = null
    }
  }
  return strokes
}

// Draws a stroke as one smooth path: quadratic curves through the midpoints
// between points, so corners between pointer samples are rounded off
function drawStroke(ctx, { points, color, lineWidth }) {
  ctx.strokeStyle = ctx.fillStyle = color
  ctx.lineWidth = lineWidth
  ctx.beginPath()
  const moved = points.some((value, i) => value !== points[i % 2])
  if (!moved) {
    // A dot, so a tap without movement still shows up
    ctx.arc(points[0], points[1], lineWidth / 2, 0, Math.PI * 2)
    ctx.fill()
    return
  }
  ctx.moveTo(points[0], points[1])
  for (let i = 2; i < points.length - 2; i += 2) {
    const x = points[i]
    const y = points[i + 1]
    ctx.quadraticCurveTo(x, y, (x + points[i + 2]) / 2, (y + points[i + 3]) / 2)
  }
  ctx.lineTo(points.at(-2), points.at(-1))
  ctx.stroke()
}

/**
 * Owns the canvas: local drawing, rendering, and batching points for the server.
 * Kept outside React so pointer moves never cause a re-render.
 *
 * Finished strokes are drawn once onto the base canvas. Strokes still being drawn
 * live on the overlay canvas, which is cleared and redrawn each frame; drawing
 * them piece by piece instead would stack their anti-aliased edges and look jagged.
 */
export class Painter {
  brush = { color: '#000000', lineWidth: DEFAULT_LINE_WIDTH }
  // Finished strokes, in the order they finished (the order the server saves them)
  strokes = []
  // Finished strokes not yet drawn on the base canvas
  toBake = []
  // Strokes still being drawn, by anyone
  active = new Set()
  // Other people's unfinished strokes, by where they end, so the next batch can continue them
  openRemote = new Map()
  fullRedraw = true
  frame = 0
  seq = 0
  // The stroke the local pointer is drawing
  current = null
  pointerId = null
  rect = null
  // Where the pen is, unrounded (see LAZY_RADIUS)
  pen = null
  outbox = []
  lastSent = null
  sendTimer = 0

  constructor(canvas, overlay, send) {
    this.canvas = canvas
    this.overlay = overlay
    this.ctx = canvas.getContext('2d')
    this.overlayCtx = overlay.getContext('2d')
    this.send = send
    this.resizeObserver = new ResizeObserver(() => this.resize())
    this.resizeObserver.observe(canvas)
    canvas.addEventListener('pointerdown', this.onPointerDown)
    canvas.addEventListener('pointermove', this.onPointerMove)
    canvas.addEventListener('pointerup', this.onPointerUp)
    canvas.addEventListener('pointercancel', this.onPointerUp)
    canvas.addEventListener('lostpointercapture', this.onPointerUp)
  }

  destroy() {
    this.resizeObserver.disconnect()
    this.canvas.removeEventListener('pointerdown', this.onPointerDown)
    this.canvas.removeEventListener('pointermove', this.onPointerMove)
    this.canvas.removeEventListener('pointerup', this.onPointerUp)
    this.canvas.removeEventListener('pointercancel', this.onPointerUp)
    this.canvas.removeEventListener('lostpointercapture', this.onPointerUp)
    cancelAnimationFrame(this.frame)
    this.flush()
  }

  setBrush(brush) {
    this.brush = brush
  }

  /** Strokes finished after this point are kept by a later load(). */
  checkpoint() {
    return this.seq
  }

  /** Replaces the canvas with the saved one, keeping strokes finished since `since`. */
  load(points, since) {
    const live = this.strokes.filter((stroke) => stroke.seq >= since)
    this.strokes = [...toStrokes(points), ...live]
    this.fullRedraw = true
    this.schedule()
  }

  /** Points drawn by someone else. */
  receive(points) {
    if (!Array.isArray(points)) return
    const now = performance.now()
    for (const stroke of toStrokes(points)) {
      // Each batch repeats the point the previous one ended on, which links them into one stroke
      const open = !stroke.begun && this.openRemote.get(pointKey(stroke, 0))
      let target = stroke
      if (open) {
        this.openRemote.delete(pointKey(open, -2))
        open.points.push(...stroke.points.slice(2))
        target = open
      } else {
        this.active.add(stroke)
      }
      target.updatedAt = now
      if (stroke.closed) {
        this.finish(target)
      } else {
        this.openRemote.set(pointKey(target, -2), target)
      }
    }
    for (const [key, stroke] of this.openRemote) {
      if (now - stroke.updatedAt > REMOTE_IDLE_MS) {
        this.openRemote.delete(key)
        this.finish(stroke)
      }
    }
    this.schedule()
  }

  clear() {
    this.strokes = []
    this.toBake = []
    this.active.clear()
    this.openRemote.clear()
    if (this.current) {
      // Keep drawing from where the pointer is
      this.current.points = this.current.points.slice(-2)
      this.active.add(this.current)
    }
    this.fullRedraw = true
    this.schedule()
  }

  resize() {
    this.rect = this.canvas.getBoundingClientRect()
    const ratio = window.devicePixelRatio || 1
    const width = Math.round(this.rect.width * ratio)
    if (!width) return
    const height = Math.round(width * BOARD_HEIGHT / BOARD_WIDTH)
    const scale = width / BOARD_WIDTH
    for (const ctx of [this.ctx, this.overlayCtx]) {
      // Setting the size wipes the canvas and resets the context
      ctx.canvas.width = width
      ctx.canvas.height = height
      ctx.setTransform(scale, 0, 0, scale, 0, 0)
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
    }
    // Redraw now rather than next frame, so the board never flashes empty
    this.fullRedraw = true
    this.render()
  }

  finish(stroke) {
    this.active.delete(stroke)
    stroke.seq = this.seq++
    this.strokes.push(stroke)
    this.toBake.push(stroke)
  }

  schedule() {
    this.frame ||= requestAnimationFrame(() => {
      this.frame = 0
      this.render()
    })
  }

  render() {
    if (this.fullRedraw) {
      this.fullRedraw = false
      this.ctx.clearRect(0, 0, BOARD_WIDTH, BOARD_HEIGHT)
      for (const stroke of this.strokes) drawStroke(this.ctx, stroke)
    } else {
      for (const stroke of this.toBake) drawStroke(this.ctx, stroke)
    }
    this.toBake = []
    this.overlayCtx.clearRect(0, 0, BOARD_WIDTH, BOARD_HEIGHT)
    for (const stroke of this.active) drawStroke(this.overlayCtx, stroke)
  }

  toBoard(event) {
    const { left, top, width, height } = this.rect
    return [(event.clientX - left) * BOARD_WIDTH / width, (event.clientY - top) * BOARD_HEIGHT / height]
  }

  onPointerDown = (e) => {
    if (this.current || !e.isPrimary || e.button !== 0) return
    e.preventDefault()
    // Keeps the stroke going when the pointer leaves the canvas
    this.canvas.setPointerCapture(e.pointerId)
    this.pointerId = e.pointerId
    this.rect = this.canvas.getBoundingClientRect()
    this.pen = this.toBoard(e)
    const [x, y] = this.pen.map(round)
    this.current = { ...this.brush, points: [x, y] }
    this.active.add(this.current)
    this.schedule()
    this.queue({ x, y, beginPath: true, closePath: false })
  }

  onPointerMove = (e) => {
    if (e.pointerId !== this.pointerId) return
    const { points } = this.current
    const radius = LAZY_RADIUS * BOARD_WIDTH / this.rect.width
    // Fast moves deliver several positions per event; using all of them keeps curves smooth
    const events = e.getCoalescedEvents?.() ?? []
    for (const event of events.length ? events : [e]) {
      const [px, py] = this.toBoard(event)
      const [penX, penY] = this.pen
      const distance = Math.hypot(px - penX, py - penY)
      if (distance <= radius) continue
      // Pull the pen towards the pointer until it is `radius` away
      const pull = (distance - radius) / distance
      this.pen = [penX + (px - penX) * pull, penY + (py - penY) * pull]
      const [x, y] = this.pen.map(round)
      if (Math.hypot(x - points.at(-2), y - points.at(-1)) < MIN_DISTANCE) continue
      points.push(x, y)
      this.queue({ x, y, beginPath: false, closePath: false })
    }
    this.schedule()
  }

  onPointerUp = (e) => {
    if (e.pointerId !== this.pointerId) return
    const { points } = this.current
    // The pen trails the pointer, so finish the stroke where the pointer was released
    const [x, y] = e.type === 'pointerup' ? this.toBoard(e).map(round) : points.slice(-2)
    const last = this.outbox.at(-1)
    if (x !== points.at(-2) || y !== points.at(-1)) {
      points.push(x, y)
      this.queue({ x, y, beginPath: false, closePath: true })
    } else if (last) {
      last.closePath = true
    } else {
      this.queue({ x, y, beginPath: false, closePath: true })
    }
    this.finish(this.current)
    this.current = null
    this.pointerId = null
    this.flush()
    this.schedule()
  }

  queue(point) {
    const { color, lineWidth } = this.current
    this.outbox.push({ ...point, color, lineWidth })
    this.sendTimer ||= setTimeout(this.flush, SEND_INTERVAL_MS)
  }

  flush = () => {
    clearTimeout(this.sendTimer)
    this.sendTimer = 0
    if (!this.outbox.length) return
    const batch = this.outbox
    this.outbox = []
    // Updates reach others without saying who sent them, so each batch repeats
    // the point it continues from; receivers use it to join the batches back up
    if (!batch[0].beginPath && this.lastSent) {
      batch.unshift({ ...this.lastSent, beginPath: false, closePath: false })
    }
    const last = batch.at(-1)
    this.lastSent = last.closePath ? null : last
    this.send(batch)
  }
}
