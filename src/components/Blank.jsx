import { useEffect, useState } from "react"
import { useRef } from "react"

const Blank = () => {

  const canvasRef = useRef(null)
  const contextRef = useRef(null)
  const [isDrawing,setIsDrawing] = useState(false)

  useEffect(() => {
    const canvasZone = document.getElementById("paintingZone")
    console.log(canvasZone);
    const canvas = canvasRef.current;
    canvas.width = canvasZone.width;
    canvas.height = canvasZone.height;
    console.log("canvas width : ",canvas.width);
    // canvas.style.height = `69.6vh`;
    // canvas.style.width = `60vw`;
    const context = canvas.getContext("2d");
    // context.scale(2,2);
    context.lineCap = "round";
    context.strokeStyle = "black";
    context.lineWidth = 5;
    contextRef.current = context;
  }, [])
  


  const startDrawing = ({nativeEvent}) => {
    const {offsetX, offsetY} = nativeEvent;
    contextRef.current.beginPath()
    contextRef.current.moveTo(offsetX,offsetY)
    setIsDrawing(true)
  }
  const endDrawing= () => {
    contextRef.current.closePath();
    setIsDrawing(false);

  }
  const draw = ({nativeEvent}) => {
    if(!isDrawing){
      return 
    }
    const {offsetX , offsetY} = nativeEvent;
    contextRef.current.lineTo(offsetX,offsetY);
    contextRef.current.stroke();
  }

  return (
    <div className="">
    <canvas 
    className="bg-white rounded-sm shadow-2xl"
    id="paintingZone"
    width={1050}
    height={500}
    onMouseDown={startDrawing}
    onMouseUp={endDrawing}
    onMouseMove={draw}
    ref={canvasRef}
    ></canvas>
        </div>
  )
}

export default Blank