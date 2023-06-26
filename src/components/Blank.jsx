/* eslint-disable no-undef */
import { useCallback, useContext,useEffect, useState } from "react"
import { useRef } from "react"
import { SetCanvasReferenceContext, SetUpdatingPaintContext, StateContext, UpdatingEmitContext, UpdatingPaintContext } from "../context/PaintingContext";
import config from '../config.json';
import { socket } from '../socket.js';


const Blank = () => {
   const statesOfDrawAttributes = useContext(StateContext);
  // const emitDrawing = useContext(UpdatingEmitContext);
  const drawingUpdater = useContext(UpdatingPaintContext);
  const setDrawingUpdater = useContext(SetUpdatingPaintContext);
  const setCanvasRef = useContext(SetCanvasReferenceContext);
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing,setIsDrawing] = useState(false);
  const [history,setHistory] = useState([]);

  const fetchHistory = async () => {
    try {
      const {BASE_URL}=config
      let response = await fetch(BASE_URL, {
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
  var current = {
  };
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
    contextRef.current = canvas.getContext("2d");
    contextRef.current.lineCap = "round";
    canvas && resizeCanvas(canvas);
    fetchHistory();
    setCanvasRef.current = canvas.getContext("2d");
    setCanvasRef.canvas = canvas;
  }, [])

  const drawLine = useCallback((x0, y0, x1, y1, emit) => {
    contextRef.current.beginPath();
    contextRef.current.moveTo(x0, y0);
    contextRef.current.lineTo(x1, y1);
    contextRef.current.strokeStyle = statesOfDrawAttributes.color;
    contextRef.current.lineWidth = Number(statesOfDrawAttributes.lineWidth);
    contextRef.current.stroke();
    contextRef.current.closePath();
  
    if (!emit) { return; }
    var w = canvasRef.width;
    var h = canvasRef.height;
  
    socket.emit('get-pub', {
      x0: x0 / w,
      y0: y0 / h,
      x1: x1 / w,
      y1: y1 / h,
      color: statesOfDrawAttributes.color,
      lineWidth : Number(statesOfDrawAttributes.lineWidth),
    });
  },[statesOfDrawAttributes])

  useEffect(()=>{
    history.forEach(element => {
      if(element.beginPath === true){
        contextRef.current.beginPath();
        contextRef.current.moveTo(element.x,element.y);
      }
      contextRef.current.lineCap = "round";
      contextRef.current.strokeStyle = element.color
      contextRef.current.lineWidth = element.lineWidth;
      contextRef.current.lineTo(element.x,element.y );
      contextRef.current.stroke();
      if(element.closePath === true){
        contextRef.current.closePath()
      }
    });
    var w = canvasRef.current.width;
    var h = canvasRef.current.height;
    drawLine(drawingUpdater.x0 * w, drawingUpdater.y0 * h, drawingUpdater.x1 * w, drawingUpdater.y1 * h, drawingUpdater.color);

    // contextRef.current.closePath();
    if(history.length !== 0){
      setHistory([])
    }
    if(drawingUpdater.length !== 0){
      setDrawingUpdater([])
    }
  },[history,drawingUpdater])


  const startDrawing = (e) => {
    setIsDrawing(true);
    current.x = e.clientX||e.touches[0].clientX;
    current.y = e.clientY||e.touches[0].clientY;
  }
  const endDrawing= (e) => {
    if (!isDrawing) { return; }
    setIsDrawing(false);
    drawLine(current.x, current.y, e.clientX||e.touches[0].clientX, e.clientY||e.touches[0].clientY, true);
  }
  function throttle(callback, delay) {
    var previousCall = new Date().getTime();
    return function() {
      var time = new Date().getTime();

      if ((time - previousCall) >= delay) {
        previousCall = time;
        callback.apply(null, arguments);
      }
    };
  }
  const draw = (e) => {
    if(!isDrawing){
      return 
    }
    drawLine(current.x, current.y, e.clientX||e.touches[0].clientX, e.clientY||e.touches[0].clientY, true);
    current.x = e.clientX||e.touches[0].clientX;
    current.y = e.clientY||e.touches[0].clientY;
  }

  return (
    <div className=" w-full h-[75vh]">
    <canvas 
    className="bg-white w-full h-full rounded-sm shadow-2xl"
    id="paintingZone"
    style={{touchAction:'none'}}
    onMouseDown={(e)=>startDrawing(e)}  
    onTouchStart={(e)=>startDrawing(e)}
    onMouseUp={(e)=>endDrawing(e)}
    onTouchEnd={(e)=>endDrawing(e)}
    onMouseOut={(e)=>endDrawing(e)}
    onTouchCancel={(e)=>endDrawing(e)}
    onMouseMove={(e)=>throttle(draw(e),10)}
    onTouchMove={(e)=>throttle(draw(e),10)}
    ref={canvasRef}
    ></canvas>
        </div>
  )
}

export default Blank