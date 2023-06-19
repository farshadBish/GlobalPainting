import { createContext, useCallback, useEffect, useMemo, useRef, useState } from "react"
import PropTypes from 'prop-types'
import { socket } from '../socket.js';



export const StateContext = createContext();
export const SetStateContext = createContext();
export const UpdatingEmitContext = createContext();
export const UpdatingPaintContext = createContext();
export const SetUpdatingPaintContext = createContext();
export const SetCanvasReferenceContext = createContext();
export const ClearingFunctionContext = createContext();

export const PaintingProvider = ({children}) => {
    const [paintUpdater,setPaintUpdater] = useState([])
    const canvasReference = useRef(null);
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [paintingAttribute, setPaintingAttribute] = useState({
        color : '#000000',
        lineWidth: 8,
        backgroundImage:''
    })

    const clearingCanvasEvent = useCallback(() => {
      canvasReference.current.clearRect(0, 0, canvasReference.canvas.width, canvasReference.canvas.height);
      canvasReference.current.beginPath()
    },[])
    
    const clearingCanvas = useCallback((e) => {
      e.preventDefault();
      canvasReference.current.clearRect(0, 0, canvasReference.canvas.width, canvasReference.canvas.height);
      canvasReference.current.beginPath()
      socket.emit('clear')
        },[])

    useEffect(() => {
      function onConnect() {
        setIsConnected(true);
        console.log(isConnected);
      }
      
      function onDisconnect() {
        setIsConnected(false);
      }
      socket.on('connect', onConnect);
      socket.on('disconnect', onDisconnect);
      socket.on('update',(paint)=>{setPaintUpdater(paint)})
      socket.on('clear',()=>clearingCanvasEvent())
      
  
      return () => {
        socket.off('connect', onConnect);
        socket.off('disconnect', onDisconnect);
      };
    }, []);

    const updatePaint = useCallback((data)=>{
        socket.emit('get-pub',data)
    },[])

    const value = useMemo(()=>({

    }),[])
  return (
    <ClearingFunctionContext.Provider value={clearingCanvas}>
    <SetCanvasReferenceContext.Provider value={canvasReference}>
    <SetUpdatingPaintContext.Provider value={setPaintUpdater}>
    <UpdatingPaintContext.Provider value={paintUpdater}>
    <UpdatingEmitContext.Provider value={updatePaint}>
    <StateContext.Provider value={paintingAttribute}>
        <SetStateContext.Provider value={setPaintingAttribute}>
        {children}
        </SetStateContext.Provider>
    </StateContext.Provider>
    </UpdatingEmitContext.Provider>
    </UpdatingPaintContext.Provider>
    </SetUpdatingPaintContext.Provider>
    </SetCanvasReferenceContext.Provider>
    </ClearingFunctionContext.Provider>
  )
}
PaintingProvider.propTypes = {
    children : PropTypes.node
  }