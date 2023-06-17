import './App.css'
import Blank from './components/Blank'
import Inputs from './components/Inputs'
import TopNavbar from './components/TopNavbar'

function App() {
  return (
    <main>
    <div className="main">
    <div className="gradient"/>
  </div>
      <div className='app gap-2 px-20'>
        <TopNavbar/> 
        <Blank/>
      </div>
        <Inputs/>
      </main>
  )
}

export default App
