import { useEffect } from "react"
import { useRef } from "react"

const Blank = () => {

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth * 2;
    canvas.height = window.innerHeight * 2;
    canvas.style.width = `${window.innerHeight}px`;
    canvas.style.width = `${window.innerWidth}px`
  }, [])
  

  const canvasRef = useRef(null)

  const startDrawing = () => {

  }
  const endDrawing= () => {

  }
  const draw = () => {

  }

  return (

    <canvas 
    className="w-10/12 bg-white h-96 rounded-sm shadow-2xl"
    onMouseDown={startDrawing}
    onMouseUp={endDrawing}
    onMouseMove={draw}
    ref={canvasRef}
    ></canvas>
  )
}

export default Blank