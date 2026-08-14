import './App.css'
import { Outlet } from 'react-router-dom'
import Navbar from './components/shared/Navbar'

function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="app-content">
        <Outlet />
      </main>
    </div>
  )
}

export default App
