// import { useEffect, useState } from 'react';
import './App.css'
import Blank from './components/Blank'
import Inputs from './components/Inputs'
import TopNavbar from './components/TopNavbar'
// import { socket } from './socket';

function App() {
  // const [isConnected, setIsConnected] = useState(socket.connected);
  // const [fooEvents, setFooEvents] = useState([]);

  // useEffect(()=>{
  //   function onConnect() {
  //     setIsConnected(true);
  //   }

  //   function onDisconnect() {
  //     setIsConnected(false);
  //   }
  //   function onFooEvent(value) {
  //     setFooEvents(previous => [...previous, value]);
  //   }
  //   socket.on('connect', onConnect);
  //   socket.on('foo', onFooEvent);
  //   // socket.emit('get-pub','kire khar')
  //   socket.on('disconnect', onDisconnect);
  //   return () => {
  //     socket.off('connect', onConnect);
  //     socket.off('disconnect', onDisconnect);
  //     socket.off('foo', onFooEvent);
  //   };
  // },[]);

  // useEffect(()=>{
  //   fooEvents.map((event,i)=>{
  //     console.log('event: ',event,'index: ',i);
  //   })
  // },[fooEvents])

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
