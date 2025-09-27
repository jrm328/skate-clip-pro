# Frontend

This is a lightweight scaffold. Initialize with **Vite + React + TypeScript**.

## Init
```bash
npm create vite@latest . -- --template react-ts
npm install
npm install --save @ffmpeg/ffmpeg @ffmpeg/util
npm install --save-dev tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Copy/keep:
- `tailwind.config.js`, `postcss.config.js`, `src/index.css`
- `src/components/Timeline.tsx`
- `src/utils/ffmpeg.ts`

Run:
```bash
npm run dev
```
