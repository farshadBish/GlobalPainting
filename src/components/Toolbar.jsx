import { useState } from 'react'
import thinIcon from '../assets/icons8-squiggly-line-small.png'
import midIcon from '../assets/icons8-squiggly-line-big.png'
import thickIcon from '../assets/icons8-squiggly-line-md.png'

// paint-mate accepts line widths up to 30
const WIDTHS = [
  { lineWidth: 8, icon: thinIcon, label: 'Thin' },
  { lineWidth: 16, icon: midIcon, label: 'Medium' },
  { lineWidth: 30, icon: thickIcon, label: 'Thick' },
]

const COLORS = [
  { color: '#ffffff', label: 'White' },
  { color: '#000000', label: 'Black' },
  { color: '#1e40af', label: 'Blue' },
  { color: '#eab308', label: 'Yellow' },
  { color: '#15803d', label: 'Green' },
  { color: '#991b1b', label: 'Red' },
]

const Toolbar = ({ brush, onChange, onClear }) => {
  const [open, setOpen] = useState(true)

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-20 mx-auto w-full transition-transform duration-500 md:w-140 ${open ? '' : 'translate-y-full'}`}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label={open ? 'Hide toolbar' : 'Show toolbar'}
        aria-expanded={open}
        className="absolute bottom-full left-1/2 flex h-7 w-12 -translate-x-1/2 cursor-pointer items-center justify-center rounded-t-lg bg-white text-[#e88c30]"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`size-5 transition-transform duration-500 ${open ? '' : 'rotate-180'}`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      <div
        inert={!open}
        className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 rounded-t-md bg-white px-4 py-2 shadow-2xl sm:justify-between"
      >
        <div className="flex items-center gap-1">
          {WIDTHS.map(({ lineWidth, icon, label }) => (
            <button
              key={lineWidth}
              type="button"
              title={label}
              aria-label={`${label} brush`}
              aria-pressed={brush.lineWidth === lineWidth}
              onClick={() => onChange({ ...brush, lineWidth })}
              className="tool"
            >
              <img src={icon} alt="" width={36} height={36} />
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1">
          {COLORS.map(({ color, label }) => (
            <button
              key={color}
              type="button"
              title={label}
              aria-label={label}
              aria-pressed={brush.color === color}
              onClick={() => onChange({ ...brush, color })}
              className="tool"
            >
              <span
                className="block size-7 rounded-full border-2"
                style={{ backgroundColor: color, borderColor: color === '#ffffff' ? '#000000' : color }}
              />
            </button>
          ))}
        </div>

        <button type="button" title="Clear the board for everyone" aria-label="Clear board" onClick={onClear} className="tool">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="#121331"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-8"
          >
            <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M10 11v6M14 11v6" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default Toolbar
