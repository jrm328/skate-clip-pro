import React, { useRef, useEffect } from 'react'
type Event = { t: number; label: string; value: string }

export default function Timeline({
    duration, events, range, onRangeChange
}: {
    duration: number,
    events: Event[],
    range: { start: number, end: number },
    onRangeChange: (r: { start: number, end: number }) => void
}) {
    const barRef = useRef<HTMLDivElement | null>(null)
    const pct = (t: number) => `${(t / duration) * 100}%`

    useEffect(() => {
        const el = barRef.current; if (!el) return
        let dragging: 'start' | 'end' | null = null
        const down = (e: MouseEvent) => {
            const target = e.target as HTMLElement
            if (target.dataset.handle === 'start') dragging = 'start'
            if (target.dataset.handle === 'end') dragging = 'end'
        }
        const move = (e: MouseEvent) => {
            if (!dragging) return
            const rect = el.getBoundingClientRect()
            const x = Math.min(Math.max(e.clientX - rect.left, 0), rect.width)
            const t = (x / rect.width) * duration
            if (dragging === 'start') onRangeChange({ start: Math.min(t, range.end - 0.1), end: range.end })
            if (dragging === 'end') onRangeChange({ start: range.start, end: Math.max(t, range.start + 0.1) })
        }
        const up = () => dragging = null
        el.addEventListener('mousedown', down)
        window.addEventListener('mousemove', move)
        window.addEventListener('mouseup', up)
        return () => { el.removeEventListener('mousedown', down); window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up) }
    }, [duration, range, onRangeChange])

    return (
        <div className="w-full max-w-3xl">
            <div ref={barRef} className="relative h-12 bg-neutral-900 rounded-2xl overflow-hidden border border-white/10">
                <div className="absolute top-0 bottom-0 bg-white/10" style={{ left: pct(range.start), width: `calc(${pct(range.end)} - ${pct(range.start)})` }} />
                <div className="absolute top-0 bottom-0 w-1 bg-accent cursor-ew-resize" style={{ left: pct(range.start) }} data-handle="start" />
                <div className="absolute top-0 bottom-0 w-1 bg-accent cursor-ew-resize" style={{ left: pct(range.end) }} data-handle="end" />
                {events.map((e, i) => (
                    <div key={i} title={`${e.label}: ${e.value}`} className="absolute top-0 bottom-0 w-px bg-message opacity-80" style={{ left: pct(e.t) }} />
                ))}
            </div>
            <div className="flex gap-4 text-xs opacity-70 mt-1">
                <span>Duration: {duration.toFixed(1)}s</span>
                <span>Events: {events.length}</span>
            </div>
        </div>
    )
}
