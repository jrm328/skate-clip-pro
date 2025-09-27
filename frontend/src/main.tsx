import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import UploadPage from './pages/UploadPage'
import EditorPage from './pages/EditorPage'

function App() {
    return (
        <div className="min-h-screen bg-black text-white">
            <header className="p-4 border-b border-white/10 flex items-center justify-between">
                <Link to="/" className="font-bold text-xl">Skate. Clip Flip Pro</Link>
                <nav className="text-sm opacity-80">MVP Demo</nav>
            </header>
            <main className="p-6">
                <Routes>
                    <Route path="/" element={<UploadPage />} />
                    <Route path="/editor" element={<EditorPage />} />
                </Routes>
            </main>
        </div>
    )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
    <BrowserRouter><App /></BrowserRouter>
)
