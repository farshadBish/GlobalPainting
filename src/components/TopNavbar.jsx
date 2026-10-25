import { useSyncExternalStore } from 'react'
import { socket } from '../socket'

function subscribe(onChange) {
  socket.on('connect', onChange)
  socket.on('disconnect', onChange)
  return () => {
    socket.off('connect', onChange)
    socket.off('disconnect', onChange)
  }
}

const TopNavbar = () => {
  const connected = useSyncExternalStore(subscribe, () => socket.connected)

  return (
    <header className="flex w-full items-center justify-between gap-3 rounded-md bg-white px-3 py-2 shadow-2xl">
      <div className="flex items-center gap-2">
        <svg viewBox="0 0 24 24" className="size-9 shrink-0" aria-hidden="true">
          <path
            d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.93 0 1.65-.75 1.65-1.69 0-.44-.18-.83-.44-1.12-.29-.29-.44-.65-.44-1.13a1.64 1.64 0 0 1 1.67-1.67h2c3.05 0 5.55-2.5 5.55-5.55C21.97 6.01 17.46 2 12 2z"
            fill="#fde68a"
            stroke="#121331"
            strokeWidth="1.5"
          />
          <circle cx="7" cy="12" r="1.6" fill="#991b1b" />
          <circle cx="9" cy="7.5" r="1.6" fill="#eab308" />
          <circle cx="14" cy="6.5" r="1.6" fill="#15803d" />
          <circle cx="17.5" cy="10" r="1.6" fill="#1e40af" />
        </svg>
        <h1 className="font-inter text-lg font-bold">Global Paint</h1>
      </div>
      <h2 className="hidden font-satoshi text-lg font-bold md:block">
        <span className="font-extrabold text-blue-400">Paint</span> whatever you want!
      </h2>
      <span className="flex items-center gap-1.5 text-sm font-medium text-slate-600">
        <span className={`size-2.5 rounded-full ${connected ? 'bg-green-500' : 'bg-slate-400'}`} />
        {connected ? 'Live' : 'Offline'}
      </span>
    </header>
  )
}

export default TopNavbar
