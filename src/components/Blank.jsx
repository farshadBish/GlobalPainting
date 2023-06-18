import { useContext,useEffect, useState } from "react"
import { useRef } from "react"
import { StateContext } from "../context/PaintingContext";

const Blank = () => {

  const statesOfDrawAttributes = useContext(StateContext);

  const canvasRef = useRef(null)
  const contextRef = useRef(null)
  const [isDrawing,setIsDrawing] = useState(false);
  const [history,setHistory] = useState([])
  const [paint,setPaint] = useState([])

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
    // context.fillRect(1000, 1000, context.canvas.width, context.canvas.height)
    // canvas.style.height = `69.6vh`;
    // canvas.style.width = `60vw`;
    // context.scale(2,2);
    context.lineCap = "round";
    contextRef.current = context;
    fetchHistory();

  }, [])
  // useEffect(()=>{
  // },[paint])
  useEffect(()=>{
    history.forEach(element => {
      contextRef.current.strokeStyle = element.color
      contextRef.current.lineWidth = element.lineWidth;
      contextRef.current.lineTo(element.x,element.y );
      contextRef.current.stroke();
    });
  },[history])


  // setInterval(async () => {
  //      setPaint([])
  //      console.log("done");
  // }, 500);
  const startDrawing = (event) => {
    const {offsetX, offsetY} = event.nativeEvent;
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
    console.log(Number(statesOfDrawAttributes.lineWidth),"this is linewidth");
    contextRef.current.lineWidth = Number(statesOfDrawAttributes.lineWidth);
    contextRef.current.strokeStyle = statesOfDrawAttributes.color;
    contextRef.current.stroke();
    setPaint([...paint , {
      x : offsetX,
      y : offsetY,
      color : statesOfDrawAttributes.color,
      lineWidth : statesOfDrawAttributes.lineWidth
    }]);
  }

  const drawMobile = (event) => {
    const elem = document.getElementById("paintingZone")
    const elemz = elem.getBoundingClientRect()
    const offsetX = event.touches[0].clientX;
    const offsetY = event.touches[0].clientY - elemz.top;
    contextRef.current.lineTo(offsetX,offsetY);
    contextRef.current.strokeStyle = statesOfDrawAttributes.color;
    contextRef.current.stroke();
    // dot(offsetX,offsetY);
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