import './App.css'
import { Outlet } from 'react-router-dom'
import Navbar from './components/shared/Navbar'
import CarbonFootprintDisplay from './components/CarbonFootprintDisplay'

function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <CarbonFootprintDisplay />
    </div>
  )
}

export default App
