import { useContext,useEffect, useState } from "react"
import { useRef } from "react"
import { SetCanvasReferenceContext, SetUpdatingPaintContext, StateContext, UpdatingEmitContext, UpdatingPaintContext } from "../context/PaintingContext";

const Blank = () => {

  const statesOfDrawAttributes = useContext(StateContext);
  const emitDrawing = useContext(UpdatingEmitContext);
  const drawingUpdater = useContext(UpdatingPaintContext);
  const setDrawingUpdater = useContext(SetUpdatingPaintContext);
  const setCanvasRef = useContext(SetCanvasReferenceContext);
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing,setIsDrawing] = useState(false);
  const [history,setHistory] = useState([]);

  const fetchHistory = async () => {
    try {
      let response = await fetch(`http://localhost:3000`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
        },
      })
      let data = await response.json();
      setHistory(data)
    } catch (error) {
      console.log(error);
    }
  }

  function resizeCanvas(canvas) {
    const { width, height } = canvas.getBoundingClientRect()
    
    if (canvas.width !== width || canvas.height !== height) {
      const { devicePixelRatio:ratio=1 } = window
      const context = canvas.getContext('2d')
      canvas.width = width*ratio
      canvas.height = height*ratio
      context.scale(ratio, ratio)
      return true
    }

    return false
  }

  useEffect( () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    resizeCanvas(canvas);
    context.lineCap = "round";
    contextRef.current = context;
    fetchHistory();
    setCanvasRef.current = context;
    setCanvasRef.canvas = canvas;
  }, [])

  useEffect(()=>{
    contextRef.current.beginPath()
    history.forEach(element => {
      contextRef.current.moveTo(element.x - 1,element.y - 1);
      contextRef.current.strokeStyle = element.color
      contextRef.current.lineWidth = element.lineWidth;
      contextRef.current.lineTo(element.x,element.y );
      contextRef.current.stroke();
    });
    console.log(drawingUpdater.length);
    drawingUpdater.forEach(element => {
      contextRef.current.moveTo(element.x - 1,element.y - 1);
      contextRef.current.strokeStyle = element.color
      contextRef.current.lineWidth = element.lineWidth;
      contextRef.current.lineTo(element.x,element.y );
      contextRef.current.stroke();
    });
    contextRef.current.closePath();
    if(history.length !== 0){
      setHistory([])
    }
    if(drawingUpdater.length !== 0){
      setDrawingUpdater([])
    }
  },[history,drawingUpdater])


  const startDrawing = (event) => {
    const {offsetX, offsetY} = event.nativeEvent;
    contextRef.current.beginPath()
    contextRef.current.moveTo(offsetX,offsetY)
    setIsDrawing(true)

  }
  let paintArray = [];

  const endDrawing= () => {
    if(paintArray.length !== 0){
      emitDrawing(paintArray)
      paintArray = [];
    }
      // console.log('paint: ',paint,'history: ',history,'drawingUpdater: ',drawingUpdater,'emitDrawing',emitDrawing);
    contextRef.current.closePath();
    setIsDrawing(false);
  }

  const draw = ({nativeEvent}) => {
    if(!isDrawing){
      return 
    }
    const {offsetX , offsetY} = nativeEvent;
    contextRef.current.lineTo(offsetX,offsetY);
    contextRef.current.lineWidth = Number(statesOfDrawAttributes.lineWidth);
    contextRef.current.strokeStyle = statesOfDrawAttributes.color;
    contextRef.current.lineCap = "round";
    contextRef.current.stroke();
    paintArray.push({
      x : offsetX,
      y : offsetY,
      color : statesOfDrawAttributes.color,
      lineWidth : Number(statesOfDrawAttributes.lineWidth)
    })

  }

  const drawMobile = (event) => {
    const elem = document.getElementById("paintingZone")
    const elemz = elem.getBoundingClientRect()
    const offsetX = event.touches[0].clientX;
    const offsetY = event.touches[0].clientY - elemz.top;
    contextRef.current.lineTo(offsetX,offsetY);
    contextRef.current.strokeStyle = statesOfDrawAttributes.color;
    contextRef.current.lineCap = "round";
    contextRef.current.stroke();
    paintArray.push({
      x : offsetX,
      y : offsetY,
      color : statesOfDrawAttributes.color,
      lineWidth : Number(statesOfDrawAttributes.lineWidth)
    })
  }

  return (
    <div className=" w-full h-[65vh]">
    <canvas 
    className="bg-white w-full h-full rounded-sm shadow-2xl"
    id="paintingZone"
    style={{touchAction:'none'}}
    onMouseDown={startDrawing}  
    onTouchStart={startDrawing}
    onMouseUp={endDrawing}
    onTouchEnd={endDrawing}
    onMouseMove={draw}
    onTouchMove={(e)=>drawMobile(e)}
    ref={canvasRef}
    ></canvas>
        </div>
  )
}

export default Blank