import { useEffect, useImperativeHandle, useRef } from 'react'
import { BOARD_HEIGHT, BOARD_WIDTH, Painter } from '../painter'
import { fetchCanvas, socket } from '../socket'

// Height taken by the navbar, gaps and toolbar; the board shrinks to fit what is left
const CHROME_HEIGHT = '11.5rem'

const Board = ({ brush, ref }) => {
  const canvasRef = useRef(null)
  const overlayRef = useRef(null)
  const painterRef = useRef(null)

  useImperativeHandle(ref, () => ({
    clear() {
      painterRef.current?.clear()
      socket.emit('clear')
    },
  }), [])

  useEffect(() => {
    const painter = new Painter(canvasRef.current, overlayRef.current, (points) => socket.emit('get-pub', points))
    painterRef.current = painter
    const controller = new AbortController()

    // Runs again after a reconnect, to catch up on what was drawn meanwhile
    const load = () => {
      const since = painter.checkpoint()
      fetchCanvas(controller.signal)
        .then((points) => painter.load(points, since))
        .catch((error) => {
          if (error.name !== 'AbortError') console.error(error)
        })
    }
    const onUpdate = (points) => painter.receive(points)
    const onClear = () => painter.clear()

    load()
    socket.on('update', onUpdate)
    socket.on('clear', onClear)
    socket.io.on('reconnect', load)
    return () => {
      controller.abort()
      socket.off('update', onUpdate)
      socket.off('clear', onClear)
      socket.io.off('reconnect', load)
      painter.destroy()
      painterRef.current = null
    }
  }, [])

  useEffect(() => {
    painterRef.current.setBrush(brush)
  }, [brush])

  return (
    <div className="flex w-full flex-1 items-center justify-center">
      <div
        className="relative w-full rounded-xs bg-white shadow-2xl"
        style={{
          aspectRatio: `${BOARD_WIDTH} / ${BOARD_HEIGHT}`,
          maxWidth: `calc((100dvh - ${CHROME_HEIGHT}) * ${BOARD_WIDTH / BOARD_HEIGHT})`,
        }}
      >
        <canvas ref={canvasRef} className="absolute inset-0 size-full cursor-crosshair touch-none select-none" />
        {/* Strokes still being drawn */}
        <canvas ref={overlayRef} className="pointer-events-none absolute inset-0 size-full" />
      </div>
    </div>
  )
}

export default Board
