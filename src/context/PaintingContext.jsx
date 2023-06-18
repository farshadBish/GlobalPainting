import { createContext, useState } from "react"
import PropTypes from 'prop-types'




export const StateContext = createContext();
export const SetStateContext = createContext();

export const PaintingProvider = ({children}) => {

    const [paintingAttribute, setPaintingAttribute] = useState({
        color : localStorage.getItem('attributes') ? JSON.parse(localStorage.getItem('attributes')).color : '#000000',
        lineWidth: localStorage.getItem('attributes') ? JSON.parse(localStorage.getItem('attributes')).lineWidth : 8,
        backgroundImage:''
    })



  return (
    <StateContext.Provider value={paintingAttribute}>
        <SetStateContext.Provider value={setPaintingAttribute}>
        {children}
        </SetStateContext.Provider>
    </StateContext.Provider>
  )
}
PaintingProvider.propTypes = {
    children : PropTypes.node
  }