# Muse AI Agent (muse-agent)

[![GitHub Profile](https://img.shields.io/badge/GitHub-raghavkhandal72--coder-blue?logo=github)](https://github.com/raghavkhandal72-coder)
[![Repository](https://img.shields.io/badge/Repo-muse--agent-success?logo=github)](https://github.com/raghavkhandal72-coder/muse-agent)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.10+](https://img.shields.io/badge/Python-3.10%2B-blue.svg?logo=python)](https://www.python.org/)
[![Android APK](https://img.shields.io/badge/Android-APK%20Companion-brightgreen.svg?logo=android)](https://developer.android.com/)
[![MCP Compatible](https://img.shields.io/badge/MCP-Compatible-purple.svg)](https://modelcontextprotocol.io/)

Muse AI Agent is an open-source, hybrid desktop-and-mobile autonomous agent runtime created by [Raghav Khandal (@raghavkhandal72-coder)](https://github.com/raghavkhandal72-coder). It combines a multi-agent swarm orchestrator (`muse_master_brain.py`), a full desktop Computer-Use Agent (`tools.py`), a 17-service connector catalog, encrypted local SQLite persistence (`settings_manager.py`), and a native Android WebView/Termux companion APK (`com.muse.agent`) bridged over local Wi-Fi or Cloudflare Tunnels on port 8765.

---

## Key Highlights

* **Hybrid Cloud + Offline Local Inference**: Routes requests across NVIDIA NIM (`meta/llama-3.2-11b-vision-instruct` with key-pool rotation), Google Gemini, and AIMLAPI, with automatic circuit-breaker fallback to local Ollama (`http://127.0.0.1:11434`) when offline.
* **Multi-Agent Swarm Orchestrator**: Built-in orchestration modes for CrewAI, LangGraph, AutoGen, Stanford STORM, NotebookLM Audio, SystemDesign-101, YouTube Automation, Claude SEO & Marketing, ECC Performance Harness, Munder-Difflin Sandbox Office, and Fonoster SIP Voice, plus support for 20 external agent plugin repositories.
* **Desktop Computer-Use Agent (CUA)**: Captures live desktop screenshots, inspects active windows, clicks coordinates, types text, presses hotkeys, and launches applications directly from natural language prompts.
* **Android Companion APK & Termux Bridge**: Includes a native Android wrapper (`MuseBridge` / `AndroidBridge`) supporting wake-word voice recognition, native Android Text-to-Speech (TTS), background shell execution via `com.termux.RUN_COMMAND`, wireless ADB/Shizuku device control, and instant switching between Desktop LAN (`:8765`), Cloudflare HTTPS Tunnels, and Offline UI modes.
* **Local-First Memory & Encrypted Vault**: Stores long-term semantic memories, user goals, and activity logs in local SQLite databases alongside a symmetric-key encrypted secrets vault (`data/.vault_master.key`).

---

## System Architecture

```mermaid
flowchart TD
    subgraph MobileClients [Mobile and Web Clients]
        APK[Android Companion APK]
        WebUI[Desktop Web UI]
        Termux[Termux Bridge and ADB]
    end

    subgraph GatewayLayer [Transport and Gateway Layer]
        LAN[Local Wi-Fi Subnet - Port 8765]
        CF[Cloudflare Tunnel HTTPS]
        Server[MuseAgentHandler - Port 8765]
    end

    subgraph CoreEngine [Muse Core Engine]
        Brain[Master Brain Orchestrator]
        Tools[Desktop CUA and MCP Tools]
        Vault[Encrypted Settings Vault]
        SQLite[(Local SQLite Database)]
    end

    subgraph InferenceProviders [Hybrid Model Inference]
        NIM[NVIDIA NIM Vision API]
        Gemini[Google Gemini API]
        AIML[AIMLAPI Provider]
        Ollama[Local Ollama Fallback]
    end

    APK --> LAN
    APK --> CF
    APK --> Termux
    WebUI --> Server
    LAN --> Server
    CF --> Server
    Server --> Brain
    Server --> Tools
    Server --> Vault
    Brain --> SQLite
    Tools --> Termux
    Server --> NIM
    Server --> Gemini
    Server --> AIML
    Server -.-> Ollama
```

---

## Core Repository Modules

| File / Component | Primary Responsibility |
| :--- | :--- |
| `assets/engine/main.py` | Multi-threaded HTTP/API server (`MuseAgentHandler` on port 8765), multi-provider LLM router with key rotation, connector state manager, and live telemetry/vision endpoints. |
| `assets/engine/muse_master_brain.py` | Multi-agent swarm orchestrator (`execute_brain_orchestration`) and optional FastAPI router (`/api/brain/orchestrate`, `/api/brain/engines`) integrating 20 plugin frameworks. |
| `assets/engine/tools.py` | Tool execution registry covering Computer-Use Agent (CUA) desktop automation, filesystem ops, web search, Model Context Protocol (`mcp_call_tool`), Termux shell (`termux_execute_command`), ADB/Shizuku (`adb_execute_action`), and chained routines (`routine_execute_chain`). |
| `assets/engine/settings_manager.py` | Schema-validated user preference manager (`data/settings.json`), Second Brain backup utility, and `LocalEncryptedVault` (`data/.vault_master.key`). |
| `assets/engine/tunnel_manager.py` | Singleton `RemoteTunnelManager` that spawns `cloudflared tunnel --url http://127.0.0.1:8765` and caches the public `*.trycloudflare.com` URL in `data/remote_tunnel.json`. |
| `com.muse.agent.MainActivity` | Native Android WebView host exposing `@JavascriptInterface` bridges (`MuseBridge`, `AndroidBridge`, `MuseHost`, `MuseJS`) for TTS, speech recognition, Termux command dispatch, clipboard, file downloads, and server switching. |

---

## Multi-Agent Swarm Orchestrator & 20 Plugin Integrations

`muse_master_brain.py` and `main.py` dynamically register 20 agent and skill repositories placed under the `plugins/` directory and expose 11 specialized orchestration modes via `/api/brain/orchestrate`.

### Built-In Master Brain Modes

| Engine ID (`mode`) | Engine Name | Execution Pipeline & Output |
| :--- | :--- | :--- |
| `crewai_swarm` | CrewAI Multi-Agent Swarm | Spawns a 3-role collective (Lead Researcher, Principal Engineer, QA & Synthesis Lead) to research, implement asynchronous `TaskOrchestrator` pipelines, and verify edge cases. |
| `langgraph_workflow` | LangGraph State Machine | Constructs a cyclic `StateGraph` (`START` -> `ANALYSIS_NODE` -> `EXECUTION_ENGINE` -> `VERIFY_CHECKPOINT` -> `END`) with deterministic guardrail evaluation. |
| `autogen_debate` | AutoGen Debate Engine | Runs a 3-agent conversational arena (Architect, Critic, Developer) to reach consensus and synthesize fault-tolerant code (`execute_resilient_task`). |
| `storm_research` | Stanford STORM Academic Engine | Performs perspective-guided retrieval across Academic, Industry, and Systems viewpoints to compile cited Wikipedia-style technical whitepapers. |
| `notebooklm_audio` | NotebookLM Audio Deep-Dive | Synthesizes a 2-host conversational podcast script (Alex & Sam) formatted for real-time mobile playback via `AndroidBridge` Text-to-Speech. |
| `system_design_101` | ByteByteGo System Design 101 | Generates distributed microservice blueprints, Mermaid architecture diagrams, and edge-pairing/circuit-breaker specifications. |
| `youtube_automation` | YouTube Automation Pipeline | Produces high-CTR title variants, 60-second Shorts scripts with B-roll/audio timecodes, and SEO tag bundles. |
| `seo_marketing` | Claude SEO & Growth Studio | Drafts OpenGraph meta tags, 7-part X/Twitter launch threads, and LinkedIn product announcements. |
| `fonoster_voice` | Fonoster Voice Gateway | Dispatches programmable SIP voice calls and interactive voice response (IVR) flows via `fonoster_telephony_bridge`. |
| `ecc_harness` | ECC Performance Harness | Applies instinct induction, context compression (pruning memory payloads to 38%), and prompt-injection tool guardrails. |
| `munder_difflin` | Munder-Difflin Sandbox Office | Allocates virtual regional office roles (Branch Director, Security & QA, Senior Dev, UX & Docs) in an isolated runtime. |

### Supported `plugins/` Repositories

Place any of the following 20 repositories inside `assets/engine/plugins/<repo_name>` to auto-register them onto `sys.path` at startup:
* `crewAI`
* `langgraph`
* `autogen`
* `hermes-agent`
* `grok-build`
* `replica-skill`
* `open-dots`
* `scientific-agent-skills`
* `storm`
* `system-design-101`
* `notebooklm-py`
* `marketing-skills`
* `youtube-automation-agent`
* `claude-seo`
* `agentic-awesome-skills`
* `open-design`
* `munder-difflin`
* `ECC`
* `fonoster`
* `LibreChat` (plus `claude-code-best-practice`)

---

## Native Connector Catalog & Tool Suite

Muse includes 17 pre-configured connectors (`MUSE_CONNECTORS_CATALOG`) and a comprehensive local tool registry in `tools.py`.

### 17 Built-In Connectors

| Connector ID | Name | Category | Multi-Account | Capabilities |
| :--- | :--- | :--- | :---: | :--- |
| `fonoster_voice` | Fonoster Programmable Voice & SIP | Communication | Yes | Outbound AI phone calls, IVR menus, and inbound VoIP routing (`fonoster_call`). |
| `custom_mcp` | Custom Webhook / MCP Server | Business | Yes | Connects external Model Context Protocol (MCP) JSON-RPC 2.0 servers (`mcp_call_tool`). |
| `termux_shell` | Termux & Local Shell | Business | No | Executes shell commands in Android Termux or the local OS terminal (`termux_execute_command`). |
| `adb_shizuku` | ADB & Shizuku Control | Business | No | Non-root Android system control (battery, packages, keyevent, tap, text, screenshot) via `adb_execute_action`. |
| `github` | GitHub | Business | Yes | Repository metadata inspection, commit history, file tree listing, search, and git clone (`connector_github_action`). |
| `workflow_routines` | Multi-Step Workflow Routines | Productivity | No | Chains multiple tools sequentially with `{prev_output}` context forwarding (`routine_execute_chain`). |
| `google_drive` | Google Drive | Productivity | Yes | Searches and manages cloud files and folders (`connector_google_drive_search`). |
| `gmail` | Gmail | Productivity | Yes | Composes and drafts emails (`connector_gmail_compose`). |
| `google_calendar` | Google Calendar | Productivity | Yes | Schedules events and meetings (`connector_google_calendar_create`). |
| `google_docs` | Google Docs | Productivity | Yes | Creates cloud documents (`connector_google_docs_create`). |
| `google_sheets` | Google Sheets | Productivity | Yes | Creates and queries cloud spreadsheets (`connector_google_sheets_create`). |
| `notion` | Notion | Productivity | No | Opens and syncs workspaces, notes, and wikis (`connector_notion_open`). |
| `calendly` | Calendly | Productivity | No | Opens scheduling and booking links (`connector_calendly_open`). |
| `slack` | Slack | Social | Yes | Opens team workspaces and channels (`connector_slack_open`). |
| `whatsapp` | WhatsApp | Social | No | Sends messages via WhatsApp Web / deep links (`connector_whatsapp_send`). |
| `spotify` | Spotify | Social | No | Searches tracks and triggers playback (`connector_spotify_play`). |
| `instagram` | Instagram | Social | No | Opens profiles, searches media, and initiates DMs (`connector_instagram_action`). |

### Computer-Use Agent (CUA) & Core System Tools

* **Screen & Window Automation**: `cua_get_screen_info()`, `cua_take_screenshot()`, `cua_click_mouse(x, y, button, double_click)`, `cua_type_text(text)`, `cua_press_key(key)`, `cua_launch_app(app_name)`, `cua_list_open_windows()`
* **Filesystem & Process Execution**: `fs_read_file(path, max_chars=10000)`, `fs_write_file(path, content)`, `fs_list_directory(path=".")`, `run_command(command, timeout=25)`, `create_task_plan(title, steps, status)`
* **Web Retrieval**: `web_search(query, count=5)`, `read_url(url, max_chars=8000)`

---

## Getting Started

### 1. Prerequisites
* **Python**: 3.10 or newer
* **Python Packages**: `psutil`, `fastapi` (optional), `cryptography` (optional), `pyautogui` / `pillow` (for desktop CUA actions)
* **Optional Local LLM**: [Ollama](https://ollama.com/) running locally on port 11434
* **Optional Remote Tunnel**: [cloudflared](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/) binary for global HTTPS pairing

### 2. Clone the Repository
```bash
git clone https://github.com/raghavkhandal72-coder/muse-agent.git
cd muse-agent
```

### 3. Environment Configuration (`.env`)
Create a `.env` file in `assets/engine/` (never commit real API keys to version control):
```env
# Primary Cloud Inference (NVIDIA NIM)
NVIDIA_API_KEY=nvapi-your-key-here

# Secondary Cloud Providers
GEMINI_API_KEY=your-gemini-api-key-here
AIMLAPI_KEY=your-aimlapi-key-here

# Server & Tunnel Configuration
MUSE_PORT=8765
CLOUDFLARED_BIN=cloudflared
```

### 4. Run the Desktop Engine
```bash
cd assets/engine
python3 main.py
```
On startup, `main.py` initializes the SQLite databases under `assets/engine/data/`, starts `MuseAgentHandler` on `http://0.0.0.0:8765`, optionally opens a Cloudflare Quick Tunnel via `RemoteTunnelManager`, and launches the web interface at `http://127.0.0.1:8765`.

---

## Local Termux, ADB & PC Bridge Setup

Muse is designed to operate seamlessly across an Android phone and a desktop PC:

### Mode A: Android APK <-> Desktop PC over Local Wi-Fi (`:8765`)
1. Connect your desktop PC and Android phone to the same local Wi-Fi network.
2. Start the desktop server (`python3 assets/engine/main.py`) on port 8765.
3. In the desktop UI, click **Companion QR / Pair Mobile** (`showPairQrModal()`) to view your LAN origin (`http://192.168.x.x:8765`).
4. Open the Muse AI Android app, long-press the header or open the Server & Mode dialog (`showServerConfigDialog`), and enter your PC's LAN URL (`http://192.168.x.x:8765`).

### Mode B: Global Remote Access via Cloudflare Tunnel
1. Ensure `cloudflared` is installed and accessible on your host machine.
2. When `main.py` starts `RemoteTunnelManager.start_tunnel(8765)`, it prints the active `https://<subdomain>.trycloudflare.com` URL to the console and saves it to `data/remote_tunnel.json`.
3. Paste that `https://*.trycloudflare.com` URL into the Android app's server configuration dialog to control your desktop agent from any mobile network.

### Mode C: On-Device Termux Execution (`com.termux.RUN_COMMAND`)
To let the Android APK execute local shell commands or run the Python engine directly inside Termux on your phone:
1. Install [Termux](https://termux.dev/) on your Android device.
2. Enable external command execution inside Termux by running:
   ```bash
   mkdir -p ~/.termux
   echo "allow-external-apps = true" >> ~/.termux/termux.properties
   termux-reload-settings
   ```
3. Grant the Muse AI Android app the `com.termux.permission.RUN_COMMAND` permission in Android Settings -> Apps -> Muse AI -> Permissions.
4. Both the WebView bridge (`MuseBridge.runTermuxCommand(cmd)`) and the backend tool (`termux_execute_command`) can now dispatch background scripts via `com.termux.app.RunCommandService`.

---

## REST API & JavaScript Bridge Reference

### Key HTTP Endpoints (`:8765`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/brain/orchestrate` | Executes a multi-agent workflow (`{"task": "...", "mode": "crewai_swarm"}`). |
| `GET` | `/api/brain/engines` | Lists all 11 supported Master Brain orchestration modes. |
| `POST` | `/api/vision/capture-screen` | Captures the host PC screen and runs vision analysis (`{"prompt": "..."}`). |
| `POST` | `/api/goals/manage` | Adds or lists goals in the SQLite vault (`{"action": "add", "title": "..."}`). |
| `GET` | `/api/telemetry` | Returns real-time host CPU and RAM utilization percentages (`{"cpu": ..., "ram": ...}`). |

### Android WebView `@JavascriptInterface` (`MuseBridge` / `AndroidBridge`)

The Android APK injects `window.MuseBridge` and `window.AndroidBridge` into the WebView with the following methods:
* `speakText(text)` / `speak(text)` -- Synthesizes speech using native Android TextToSpeech.
* `startVoiceRecognition(lang)` -- Launches native Android speech recognition and invokes `window.onVoiceRecognized(transcript)`.
* `runTermuxCommand(command)` -- Sends an intent to `com.termux.app.RunCommandService`.
* `configureServer()` / `showServerConfigDialog()` -- Opens the native Android dialog to switch between Live Desktop PC, Cloudflare Tunnel, or Offline Mode.
* `copyToClipboard(text)`, `shareText(text)`, `makePhoneCall(number)`, `downloadToGallery(url)`, `vibrate(ms)` -- Native Android device utilities.

---

## User Settings Schema (`data/settings.json`)

Managed via `settings_manager.py`, all settings are validated against `ALLOWED_KEYS`:

| Key | Default | Allowed Values | Description |
| :--- | :--- | :--- | :--- |
| `theme` | `"dark"` | `"dark"`, `"light"`, `"system"` | UI theme mode. |
| `reply_lang` | `"hinglish"` | `"hinglish"`, `"hindi"`, `"english"`, `"en"`, `"hi"` | Default assistant response language. |
| `style` | `"balanced"` | `"concise"`, `"detailed"`, `"code-first"`, `"balanced"` | Response verbosity and formatting style. |
| `voice_lang` | `"en-IN"` | Any BCP-47 locale tag | Speech recognition and TTS language. |
| `voice_speed` | `"normal"` | `"slow"`, `"normal"`, `"fast"`, or 0.1-3.0 | Speech synthesis rate. |
| `write_files` | `"ask"` | `"off"`, `"ask"`, `"allow"`, `true`, `false` | Permission gate for filesystem writes. |
| `skill_mode` | `"selected"` | `"selected"`, `"all"`, `"auto"`, `"always"`, `"manual"` | Plugin/skill routing policy. |
| `log_keep` | `"90"` | Integer/string days | Retention window before `prune_activity_logs(days)` trims old logs. |

---

## Security & Pre-Release Notes

* **Never hardcode API keys**: Always load `NVIDIA_API_KEY`, `GEMINI_API_KEY`, and `AIMLAPI_KEY` from environment variables or store them via `LocalEncryptedVault.store_secret(key, value)` in `settings_manager.py`.
* **Command & File Guardrails**: Keep `write_files` set to `"ask"` in untrusted environments, and review shell commands before execution when `run_command` or `termux_execute_command` is enabled.

---

## License

Distributed under the MIT License. See [LICENSE](file:///E:/muse/LICENSE) for full terms.
