// import { useEffect, useState } from 'react';
import './App.css'
import Blank from './components/Blank'
import Inputs from './components/Inputs'
import TopNavbar from './components/TopNavbar'
// import { socket } from './socket';

function App() {
  return (
    <main>
    <div className="main">
    <div className="gradient"/>
  </div>
      <div className='app gap-2 px-20 pb-16'>
        <TopNavbar/> 
        <Blank/>
      <Inputs/>
      </div>
      </main>
  )
}

export default App
