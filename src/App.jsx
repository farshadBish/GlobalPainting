import './App.css'
import Blank from './components/Blank'
import TopNavbar from './components/TopNavbar'

function App() {
  return (
    <main>
    <div className="main">
    <div className="gradient"/>
  </div>
      <div className='app gap-2 mx-auto bor box-content'>
        <TopNavbar/> 
        <Blank/> 
      </div>
      </main>
  )
}

export default App