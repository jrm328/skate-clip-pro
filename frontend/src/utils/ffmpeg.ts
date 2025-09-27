// frontend/src/utils/ffmpeg.ts
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile } from '@ffmpeg/util'

let ffmpeg: FFmpeg | null = null

export async function getFFmpeg(onProgress?: (p: number) => void) {
    if (!ffmpeg) {
        ffmpeg = new FFmpeg()
        if (onProgress) {
            ffmpeg.on('progress', ({ progress }) => onProgress(progress))
        }
        // Load the WebAssembly core. Default pulls from a CDN; works in dev.
        await ffmpeg.load()
    }
    return ffmpeg
}

/**
 * Trim an MP4 entirely in the browser using FFmpeg.wasm.
 * @param file Input video File/Blob
 * @param start Start time (seconds)
 * @param end End time (seconds)
 * @returns { url: string, blob: Blob, fileName: string }
 */
export async function trimMp4(
    file: File | Blob,
    start: number,
    end: number,
    onProgress?: (p: number) => void
) {
    const ff = await getFFmpeg(onProgress)

    // Simple unique names to avoid clashes if trimming multiple times
    const inName = 'input.mp4'
    const outName = 'out.mp4'

    // Write input to FFmpeg FS
    await ff.writeFile(inName, await fetchFile(file))

    // Run trim: -ss before -i is faster (keyframe-seeking); -to is end timestamp
    // -c copy is fastest but requires cut on keyframes. If output is black/odd,
    // switch to re-encode: ['-ss', s, '-to', e, '-i', in, '-c:v','libx264','-c:a','aac', out]
    const s = Math.max(0, start).toString()
    const e = Math.max(start, end).toString()

    try {
        await ff.exec(['-ss', s, '-to', e, '-i', inName, '-c', 'copy', outName])
    } catch {
        // Fallback to re-encode if stream copy fails
        await ff.exec(['-ss', s, '-to', e, '-i', inName, '-c:v', 'libx264', '-c:a', 'aac', outName])
    }

    const data = await ff.readFile(outName) // Uint8Array
    const blob = new Blob([data], { type: 'video/mp4' })
    const url = URL.createObjectURL(blob)
    const fileName = `trim_${s.replace('.', '-')}_${e.replace('.', '-')}.mp4`

    // Optional cleanup (not strictly necessary in dev)
    //try { await ff.unlink(inName) } catch { }
    //try { await ff.unlink(outName) } catch { }

    return { url, blob, fileName }
}
