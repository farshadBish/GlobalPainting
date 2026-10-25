import { useRef } from 'react'
import './App.css'
import Board from './components/Board'
import Toolbar from './components/Toolbar'
import TopNavbar from './components/TopNavbar'
import { useBrush } from './useBrush'

function App() {
  const [brush, setBrush] = useBrush()
  const boardRef = useRef(null)

  return (
    <>
      <div className="backdrop" />
      <main className="mx-auto flex min-h-dvh max-w-7xl flex-col items-center gap-3 px-4 pt-3 pb-36 sm:px-8 sm:pb-24 lg:px-20">
        <TopNavbar />
        <Board ref={boardRef} brush={brush} />
        <Toolbar brush={brush} onChange={setBrush} onClear={() => boardRef.current.clear()} />
      </main>
    </>
  )
}

export default App
