import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function UploadPage() {
    const nav = useNavigate()
    const [file, setFile] = useState<File | null>(null)
    const [err, setErr] = useState("")

    const onSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0]
        if (!f) return
        if (!f.type.includes('video')) { setErr('Please select a video file'); return }
        setErr("")
        setFile(f)
    }

    const go = async () => {
        if (!file) return
        const url = URL.createObjectURL(file)
        const v = document.createElement('video')
        v.preload = 'metadata'
        v.src = url
        await new Promise(res => v.onloadedmetadata = () => res(null))
        nav('/editor', { state: { file, duration: v.duration || 60 } })
    }

    return (
        <div className="max-w-xl space-y-4">
            <h1 className="text-2xl font-bold">Upload a Skate clip</h1>
            <input type="file" accept="video/*" onChange={onSelect} />
            {err && <p className="text-red-400 text-sm">{err}</p>}
            {file && <p className="text-sm opacity-80">Selected: {file.name}</p>}
            <button onClick={go} className="px-4 py-2 rounded-xl bg-white text-black disabled:opacity-50" disabled={!file}>
                Continue → Editor
            </button>
        </div>
    )
}