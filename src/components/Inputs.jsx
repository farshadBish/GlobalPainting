import { useContext, useEffect, useState } from "react"
import { ClearingFunctionContext, SetStateContext, StateContext } from "../context/PaintingContext";
import thinIcon from '../assets/icons8-squiggly-line-small.png'
import midIcon from '../assets/icons8-squiggly-line-big.png'
import thickIcon from '../assets/icons8-squiggly-line-md.png'

const Inputs = () => {

    const statesOfDrawAttributes = useContext(StateContext);
    const setStatesOfDrawAttributes = useContext(SetStateContext);
    const setCanvasClear = useContext(ClearingFunctionContext);

    const [LocalAttribute,setLocalAttribute] = useState({
        color : '#000000',
        lineWidth: 8,
    });

    const [kesho,setKesho] = useState(true)

    useEffect(()=>{
        localStorage.setItem('attributes',JSON.stringify(LocalAttribute))
        setStatesOfDrawAttributes({...statesOfDrawAttributes, color : LocalAttribute.color , lineWidth: LocalAttribute.lineWidth})
    },[LocalAttribute]);


    // useEffect(()=>{

    // },[localStorage.getItem('attributes')])

  return (
    <>
    {kesho ? <div className="fixed bottom-0 h-16 rounded-md flex w-full md:w-[35rem] justify-between items-end bg-white pb-2 inputsContainer">
        <div className="rotateAnimationBack absolute top-0 flex justify-center w-full pt-0.5 mt-[-0.95rem]">
        <lord-icon
    src="https://cdn.lordicon.com/albqovim.json"
    trigger="hover"
    colors="primary:#e88c30"
    onClick={()=>{setKesho(false)}}
    style={{width:"32px",cursor:"pointer"}}>
</lord-icon></div>
        <div className=" opacity-100 insideContainer flex w-full justify-between items-end pt-4 px-4">
        <div className="flex items-center justify-center gap-2">
            <img src={thinIcon}  onClick={() => LocalAttribute && setLocalAttribute({ ...LocalAttribute,lineWidth : 8})} className="text-white hoverAnimation" height={39} width={39} alt="where am i" />
            <img src={midIcon}   onClick={() => LocalAttribute && setLocalAttribute({ ...LocalAttribute,lineWidth : 16})} className="text-white hoverAnimation" height={39} width={39} alt="where am i" />
            <img src={thickIcon} onClick={() => LocalAttribute && setLocalAttribute({ ...LocalAttribute,lineWidth : 32})} className="text-white hoverAnimation" height={39} width={39} alt="where am i" />
        </div>
        <div className="flex items-center justify-center gap-2 ">
            <span className=" hoverAnimation"><div onClick={() => LocalAttribute && setLocalAttribute({ ...LocalAttribute,color : '#ffffff'})} className="w-[32px] h-[32px] rounded-full bg-white border-2 border-black"></div></span>
            <span className=" hoverAnimation"><div onClick={() => LocalAttribute && setLocalAttribute({ ...LocalAttribute,color : '#000000'})} className="w-[32px] h-[32px] rounded-full bg-black"></div></span>
            <span className=" hoverAnimation"><div onClick={() => LocalAttribute && setLocalAttribute({ ...LocalAttribute,color : '#1E40AF'})} className="w-[32px] h-[32px] rounded-full bg-blue-800"></div></span>
            <span className=" hoverAnimation"><div onClick={() => LocalAttribute && setLocalAttribute({ ...LocalAttribute,color : '#EAB308'})} className="w-[32px] h-[32px] rounded-full bg-yellow-500"></div></span>
            <span className=" hoverAnimation"><div onClick={() => LocalAttribute && setLocalAttribute({ ...LocalAttribute,color : '#15803D'})} className="w-[32px] h-[32px] rounded-full bg-green-700"></div></span>
            <span className=" hoverAnimation"><div onClick={() => LocalAttribute && setLocalAttribute({ ...LocalAttribute,color : '#991B1B'})} className="w-[32px] h-[32px] rounded-full bg-red-800"></div></span>
        </div>
        <div className="flex hoverAnimationForReset">
<lord-icon
    src="https://cdn.lordicon.com/bdlkcgcr.json"
    trigger="click"
    colors="outline:#121331,primary:#ebe6ef"
    style={{width:"40px",height:"40px"}}
    onClick={setCanvasClear}
    >
</lord-icon>    
</div>
        </div>
    </div> :<div className="fixed bottom-0 h-0 rounded-md flex w-full md:w-[35rem] justify-between items-end bg-white pb-5 inputsContainer">
        <div className=" rotateAnimation z-10 absolute top-0 flex justify-center w-full mt-[-0.72rem]">
        <lord-icon
    src="https://cdn.lordicon.com/albqovim.json"
    trigger="hover"
    colors="primary:#e88c30"
    onClick={()=>{setKesho(true)}}
    style={{width:"32px",cursor:"pointer"}}>
</lord-icon>

</div>
<div className=" z-0 opacity-0 flex w-full justify-between items-end pt-4 px-4">
        <div className="hidden items-center justify-center gap-2">
            <img src={thinIcon}  onClick={() => LocalAttribute && setLocalAttribute({ ...LocalAttribute,lineWidth : 8})} className="text-white hoverAnimation" height={39} width={39} alt="where am i" />
            <img src={midIcon}   onClick={() => LocalAttribute && setLocalAttribute({ ...LocalAttribute,lineWidth : 16})} className="text-white hoverAnimation" height={39} width={39} alt="where am i" />
            <img src={thickIcon} onClick={() => LocalAttribute && setLocalAttribute({ ...LocalAttribute,lineWidth : 32})} className="text-white hoverAnimation" height={39} width={39} alt="where am i" />
        </div>
        <div className="hidden items-center justify-center gap-2 ">
            <span className=" hoverAnimation"><div onClick={() => LocalAttribute && setLocalAttribute({ ...LocalAttribute,color : '#ffffff'})} className="w-[32px] h-[32px] rounded-full bg-white border-2 border-black"></div></span>
            <span className=" hoverAnimation"><div onClick={() => LocalAttribute && setLocalAttribute({ ...LocalAttribute,color : '#000000'})} className="w-[32px] h-[32px] rounded-full bg-black"></div></span>
            <span className=" hoverAnimation"><div onClick={() => LocalAttribute && setLocalAttribute({ ...LocalAttribute,color : '#1E40AF'})} className="w-[32px] h-[32px] rounded-full bg-blue-800"></div></span>
            <span className=" hoverAnimation"><div onClick={() => LocalAttribute && setLocalAttribute({ ...LocalAttribute,color : '#EAB308'})} className="w-[32px] h-[32px] rounded-full bg-yellow-500"></div></span>
            <span className=" hoverAnimation"><div onClick={() => LocalAttribute && setLocalAttribute({ ...LocalAttribute,color : '#15803D'})} className="w-[32px] h-[32px] rounded-full bg-green-700"></div></span>
            <span className=" hoverAnimation"><div onClick={() => LocalAttribute && setLocalAttribute({ ...LocalAttribute,color : '#991B1B'})} className="w-[32px] h-[32px] rounded-full bg-red-800"></div></span>
        </div>
        <div className="hidden hoverAnimationForReset">
<lord-icon
    src="https://cdn.lordicon.com/bdlkcgcr.json"
    trigger="click"
    colors="outline:#121331,primary:#ebe6ef"
    style={{width:"40px",height:"40px"}}
    onClick={setCanvasClear}
    >
</lord-icon>    
</div>
        </div>
    </div>}
    </>
  )
}

export default Inputs