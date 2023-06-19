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
      <Inputs/>
      <div className='app gap-2 px-20'>
        <TopNavbar/> 
        <Blank/>
      </div>
      </main>
  )
}

export default App
