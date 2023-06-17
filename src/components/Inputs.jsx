import { useEffect, useState } from "react"

const Inputs = () => {
    const [color,setColor] = useState('#000000');
    const [number,setNumber] = useState(8)
    useEffect(()=>{
        console.log(color);
    },[color])
  return (
    <div className="bg-cyan-800 z-20 w-2/12 absolute right-0 top-52 flex h-96 items-center rounded-s-full">
    <div className="w-full h-full flex flex-col justify-center gap-2 items-center">
        <div className="flex flex-col gap-2 w-full justify-center items-center">
        <label htmlFor="colorInput" className="text-yellow-50">
            Color:
        </label>
        <input className=" w-10" name="color" type="color" value={color} onChange={(e)=>{setColor(e.target.value)}}id="color" />
        </div>
        <div className="flex flex-col gap-2 items-center w-full justify-center">
        <label htmlFor="colorInput" className="text-yellow-50">
            Stroke:
        </label>
        <input className="pl-2 w-10" name="number" type="number" value={number} onChange={(e)=>{setNumber(e.target.value)}}id="number" />
        </div>

    </div>
    </div>
  )
}

export default Inputs