import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

function App(){
  return (
    <div className="min-h-screen p-6">
      <h1 className="text-3xl font-bold">Skate Clip Pro</h1>
      <p className="opacity-80 mt-2">Frontend scaffold ready. Initialize with Vite React TS to fully enable dev.</p>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />)
