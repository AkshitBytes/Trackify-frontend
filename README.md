# Trackify Frontend

React + TypeScript frontend for Trackify (DSA Progress Tracker).

It provides:
- auth flow (signup/login)
- dashboard with progress stats
- nested topic/pattern tracking UI
- drag-and-drop status management
- search and light-theme UI
- confetti celebrations on completion milestones

## Tech stack

- React 19
- TypeScript
- Vite
- React Router
- Axios
- Lucide Icons
- canvas-confetti

## Folder structure

```text
frontend/
  src/
    api/            # axios client
    components/     # reusable UI pieces
    context/        # auth context
    pages/          # route pages
    App.tsx
    main.tsx
    index.css
```

## Prerequisites

- Node.js 18+
- npm 9+
- Backend running at `http://localhost:5000`

## Installation

```bash
cd frontend
npm install
```

## Scripts

```bash
npm run dev      # start dev server
npm run build    # production build
npm run preview  # preview production build
npm run lint     # lint source files
```

## Local development

1. Start backend first:

```bash
cd ../backend
npm run dev
```

2. Start frontend:

```bash
cd ../frontend
npm run dev
```

3. Open:
- `http://localhost:5173`

## Frontend architecture notes

- Auth state is managed in `src/context/AuthContext.tsx`.
- API requests are centralized in `src/api/axios.ts`.
- Dashboard uses:
  - `StatsPanel` for summary stats
  - `ProgressRing` for progress + confetti
  - `DragDropBoard` for topic/pattern/status interaction
- Questions are rendered under:
  - Topic -> Pattern -> Status columns
  - statuses: `todo`, `in-progress`, `done`, `revision`

## Confetti behavior

- Main progress ring uses fireworks style confetti at 100%.
- Topic rings use compact celebratory confetti at 100%.
- Powered by `canvas-confetti`.

## Build and deploy notes

- Create a production build using:

```bash
npm run build
```

- Output is generated in `frontend/dist`.

## Troubleshooting

- If API calls fail, verify backend is running and CORS allows `5173`.
- If auth fails after code changes, clear local storage token and login again.
- If TypeScript errors mention confetti types, ensure:
  - `canvas-confetti`
  - `@types/canvas-confetti`
  are installed.
