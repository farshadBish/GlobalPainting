import { useContext, useEffect, useState } from "react"
import { ClearingFunctionContext, SetStateContext, StateContext } from "../context/PaintingContext";

const Inputs = () => {

    const statesOfDrawAttributes = useContext(StateContext);
    const setStatesOfDrawAttributes = useContext(SetStateContext);
    const setCanvasClear = useContext(ClearingFunctionContext);

    const [LocalAttribute,setLocalAttribute] = useState({
        color : '#000000',
        lineWidth: 8,
    });


    useEffect(()=>{
        localStorage.setItem('attributes',JSON.stringify(LocalAttribute))
        setStatesOfDrawAttributes({...statesOfDrawAttributes, color : LocalAttribute.color , lineWidth: LocalAttribute.lineWidth})
    },[LocalAttribute]);


    // useEffect(()=>{

    // },[localStorage.getItem('attributes')])

  return (
    <div className=" absolute h-screen w-screen flex justify-end items-center">
    <div className="bg-cyan-800 z-20 w-2/12 h-96 flex items-center rounded-s-full">
    <div className="w-full h-full flex flex-col justify-center gap-2 items-center">
        <div className="flex flex-col gap-2 w-full justify-center items-center">
        <label htmlFor="colorInput" className="text-yellow-50">
            Color:
        </label>
        <input className=" w-10" name="color" type="color" value={LocalAttribute.color} onChange={(e)=>{setLocalAttribute({...LocalAttribute, color: e.target.value})}}id="color" />
        </div>
        <div className="flex flex-col gap-2 items-center w-full justify-center">
        <label htmlFor="colorInput" className="text-yellow-50">
            Stroke:
        </label>
        <input className="pl-2 w-10" name="number" type="number" value={LocalAttribute.lineWidth} onChange={(e)=>{setLocalAttribute({...LocalAttribute, lineWidth: e.target.value})}}id="number" />
        </div>
        <div className="flex flex-col gap-2 items-center w-full justify-center">
       <button onClick={(e)=>setCanvasClear(e)} className=" border-2 p-2 bg-black text-white rounded-xl">Refresh</button>
        </div>

    </div>
    </div>
    </div>
  )
}

export default Inputs