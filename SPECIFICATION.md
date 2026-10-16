# Meta Muse Specification & Gateway Protocol

## 1. Overview
Meta Muse utilizes a hybrid client-server architecture:
- **Client (Frontend):** React SPA bundled inside `hatch/index.html` with Tailwind/CSS modules, Optimistic typography, and embedded Hatch audio/video assets.
- **Gateway (Backend):** Python asynchronous HTTP server (`main.py`) running on `127.0.0.1:8765`, handling WebSocket RPC, REST API fallback, and desktop automation.

## 2. Key Gateway Endpoints

### 2.1 Ideas Discovery Feed
- `GET /api/idea-cards`
  - Returns `sections` and `ideas` adhering to `extractV2ExploreIdeas` format.
  - Sections include: `Featured Hero`, `Productivity & Writing`, `Desktop Automation & CUA`.
- `GET /api/idea-cards/{id}`
  - Returns detailed card state including executable prompts and connected tool requirements.
- `POST /api/idea-cards/{id}/execute`
  - Triggers the execution of the idea card. Returns `{ "status": "accepted", "id": id }`.

### 2.2 Chat & Streaming Inference
- `POST /api/chat`
  - Accepts `{ "messages": [...], "model": "..." }`.
  - Executes tool calling loop, CUA computer use actions, and returns multi-turn conversational answers.

### 2.3 System & CUA Endpoints
- `GET /api/screenshot` — Raw PNG of live desktop display.
- `POST /api/click` — Move and click mouse.
- `POST /api/type` — Keyboard input text.
- `GET /api/apps` — Enumeration of active desktop windows.

## 3. WebSocket RPC Protocol
The gateway connects to the frontend over `ws://127.0.0.1:8765/ws`.
Supported RPC methods:
- `api.idea-cards.list`
- `api.idea-cards.detail`
- `api.idea-cards.execute`
- `artifacts.snapshot`
- `settings.sync`
