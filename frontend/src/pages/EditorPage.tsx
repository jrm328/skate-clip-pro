import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import axios from 'axios'
import Timeline from '../components/Timeline'
import { trimMp4 } from '../utils/ffmpeg'
import { videoFrameToDataURL } from '../utils/frame'


type Event = { t: number; label: 'score_burst' | 'multiplier' | 'bail' | 'trick'; value: string }

export default function EditorPage() {
    const { state } = useLocation() as { state: { file: File, duration: number } }
    const videoRef = useRef<HTMLVideoElement | null>(null)

    const [events, setEvents] = useState<Event[]>([])
    const [range, setRange] = useState<{ start: number, end: number }>({ start: 0, end: Math.min(15, state?.duration || 60) })

    const [exportUrl, setExportUrl] = useState<string>("")
    const [exportName, setExportName] = useState<string>("")
    const [busy, setBusy] = useState<boolean>(false)
    const [progress, setProgress] = useState<number>(0)

    const src = useMemo(() => state?.file ? URL.createObjectURL(state.file) : "", [state])

    useEffect(() => {
        const run = async () => {
            const duration_sec = state?.duration ?? 60
            const r = await axios.post('http://127.0.0.1:8000/ocr/analyze', { duration_sec })
            setEvents(r.data.events)
            if (r.data.events?.length) {
                const t = r.data.events[0].t
                setRange({ start: Math.max(0, t - 5), end: Math.min(duration_sec, t + 10) })
            }
        }
        run().catch(console.error)
    }, [state])

    async function onTrim() {
        if (!state?.file) return
        setBusy(true); setProgress(0); setExportUrl("")
        try {
            const { url, fileName } = await trimMp4(state.file, range.start, range.end, (p) => setProgress(p))
            setExportUrl(url)
            setExportName(fileName)
        } catch (e) {
            console.error(e)
            alert("Trim failed. Check the console for details.")
        } finally {
            setBusy(false)
        }
    }

    async function analyzeCurrentFrame() {
        if (!videoRef.current) return
        const image_b64 = videoFrameToDataURL(videoRef.current)
        const r = await axios.post('http://127.0.0.1:8000/ocr/frame', { image_b64 })
        console.log('OCR:', r.data.results)
        alert(JSON.stringify(r.data.results, null, 2)) // simple UI for now
    }


    return (
        <div className="grid gap-6">
            <video ref={videoRef} src={src} controls className="w-full max-w-3xl rounded-2xl border border-white/10" />
            <Timeline duration={state.duration} events={events} range={range} onRangeChange={setRange} />

            <div className="flex items-center gap-4">
                <button
                    onClick={onTrim}
                    disabled={busy}
                    className="px-4 py-2 rounded-xl bg-white text-black disabled:opacity-50"
                >
                    {busy ? `Trimming… ${Math.round(progress * 100)}%` : 'Trim (FFmpeg.wasm)'}
                </button>

                <span className="text-sm opacity-70">
                    Range: {range.start.toFixed(2)}s → {range.end.toFixed(2)}s
                </span>
            </div>

            <div className="flex items-center gap-4">
                <button
                    onClick={onTrim}
                    disabled={busy}
                    className="px-4 py-2 rounded-xl bg-white text-black disabled:opacity-50"
                >
                    {busy ? `Trimming… ${Math.round(progress * 100)}%` : 'Trim (FFmpeg.wasm)'}
                </button>

                <button
                    onClick={analyzeCurrentFrame}
                    className="px-4 py-2 rounded-xl bg-white/10"
                >
                    Analyze Frame
                </button>

                <span className="text-sm opacity-70">
                    Range: {range.start.toFixed(2)}s → {range.end.toFixed(2)}s
                </span>
            </div>


            {exportUrl && (
                <div className="space-y-3">
                    <video src={exportUrl} controls className="w-full max-w-3xl rounded-2xl border border-white/10" />
                    <a
                        href={exportUrl}
                        download={exportName || 'trim.mp4'}
                        className="inline-block px-4 py-2 rounded-xl bg-message text-black font-medium"
                    >
                        Download {exportName || 'trim.mp4'}
                    </a>
                </div>
            )}
        </div>
    )
}
