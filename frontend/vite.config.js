import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    optimizeDeps: {
        // FFmpeg uses a worker import that confuses Vite’s optimizer.
        exclude: ['@ffmpeg/ffmpeg', '@ffmpeg/util']
    }
})
