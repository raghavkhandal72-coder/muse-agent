<p align="center">
  <a href="https://github.com/raghavkhandal72-coder/muse-agent">
    <img src="logo.png" width="120" height="120" alt="Muse AI Agent Logo" />
  </a>
</p>

<h1 align="center">Muse AI Agent (muse-agent)</h1>

<p align="center">
  <b>The Autonomous Hybrid Desktop & Mobile Agent Runtime</b><br>
  <i>Built with Computer-Use (CUA), Multi-Agent Swarm Orchestrator, 17+ Connectors & Native Android Companion</i>
</p>

<p align="center">
  <a href="https://github.com/raghavkhandal72-coder/muse-agent/stargazers"><img src="https://img.shields.io/github/stars/raghavkhandal72-coder/muse-agent?style=for-the-badge&logo=github&color=gold" alt="GitHub Stars" /></a>
  <a href="https://github.com/raghavkhandal72-coder/muse-agent/network/members"><img src="https://img.shields.io/github/forks/raghavkhandal72-coder/muse-agent?style=for-the-badge&logo=github&color=blue" alt="GitHub Forks" /></a>
  <a href="https://github.com/raghavkhandal72-coder/muse-agent/actions"><img src="https://img.shields.io/github/actions/workflow/status/raghavkhandal72-coder/muse-agent/ci.yml?branch=main&style=for-the-badge&logo=githubactions&logoColor=white&label=CI%20BUILD" alt="CI Status" /></a>
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge" alt="MIT License" /></a>
  <a href="https://www.python.org/"><img src="https://img.shields.io/badge/Python-3.10%20%7C%203.11%20%7C%203.12-blue?style=for-the-badge&logo=python&logoColor=white" alt="Python Version" /></a>
  <a href="https://developer.android.com/"><img src="https://img.shields.io/badge/Android-APK%20Companion-brightgreen?style=for-the-badge&logo=android&logoColor=white" alt="Android Companion" /></a>
  <a href="https://modelcontextprotocol.io/"><img src="https://img.shields.io/badge/MCP-Standard%20Compatible-purple?style=for-the-badge" alt="MCP Compatible" /></a>
</p>

<p align="center">
  <a href="#-quickstart">⚡ Quickstart</a> &bull;
  <a href="#-key-features">✨ Key Features</a> &bull;
  <a href="#-system-architecture">🏗️ Architecture</a> &bull;
  <a href="#-multi-agent-swarm-orchestrator">🤖 Swarm Orchestrator</a> &bull;
  <a href="#-desktop-computer-use-agent-cua">🖥️ Desktop CUA</a> &bull;
  <a href="#-android-companion-apk--termux-bridge">📱 Mobile Companion</a> &bull;
  <a href="#-17-production-connectors">🔌 Connectors</a> &bull;
  <a href="#-contributing">🤝 Contributing</a>
</p>

<p align="center">
  <img src="assets/muse_interface.png" width="920" alt="Muse AI Agent Desktop Live Interface" />
</p>

---

## 🌟 Overview

**Muse AI Agent** is an open-source, hybrid desktop-and-mobile autonomous agent runtime created by [Raghav Khandal (@raghavkhandal72-coder)](https://github.com/raghavkhandal72-coder).

Unlike conventional chat interfaces, Muse acts as an **autonomous operating system agent**:
- It can see your screen, click UI elements, run shell scripts, and control your desktop.
- It operates seamlessly across both your **Windows PC** and your **Android Phone** via local Wi-Fi or secure Cloudflare Tunnels.
- It features an intelligent **Multi-Agent Swarm Orchestrator** capable of executing 11 specialized workflows (CrewAI swarms, LangGraph state machines, AutoGen debates, Stanford STORM deep research, ByteByteGo system design, and YouTube automation).
- All personal memories, secrets, and goals remain **100% local and encrypted** on your own hardware.

---

## ⚡ Quickstart

Get Muse running on your local machine in under 60 seconds:

```bash
# 1. Clone the repository
git clone https://github.com/raghavkhandal72-coder/muse-agent.git
cd muse-agent

# 2. Install dependencies
pip install -r requirements.txt

# 3. Configure environment (optional: works offline with Ollama by default)
cp .env.example .env

# 4. Launch Muse Agent (Desktop UI + Server on port 8765)
python main.py
```

> **Headless / Server Mode**: To run without the desktop GUI (ideal for servers, Termux, or Docker containers):
> ```bash
> python main.py --headless
> ```

---

## ✨ Key Features

| Capability | Description |
| :--- | :--- |
| 🖥️ **Computer-Use Agent (CUA)** | Autonomous desktop perception & control using PyAutoGUI, Pillow screenshot capture, active window inspection, and OCR coordinate targeting. |
| 🤖 **Multi-Agent Swarm Engine** | Integrated swarm orchestrator (`muse_master_brain.py`) with 11 pre-configured engines and plugin hooks for 20 external frameworks. |
| 📱 **Android Companion APK** | Native companion app (`com.muse.agent`, debloated to 13.5 MB) bridging Android TTS, speech recognition, Termux shell execution, and wireless ADB/Shizuku. |
| 🌐 **Zero-Config Cloudflare Tunnel** | Built-in tunnel manager (`tunnel_manager.py`) automatically provides a secure public `https://*.trycloudflare.com` URL for out-of-home remote control. |
| 🔒 **Local-First Encrypted Vault** | Symmetrically encrypted credentials (`data/.vault_master.key`) and SQLite databases for long-term semantic memory and goals. |
| ⚡ **Hybrid Cloud + Offline LLM** | Intelligent fallback across NVIDIA NIM (Llama 3.2 11B Vision), Google Gemini, AIMLAPI, and local Ollama (`http://127.0.0.1:11434`). |

---

## 🏗️ System Architecture

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

## 🤖 Multi-Agent Swarm Orchestrator

Muse includes 11 specialized autonomous orchestration engines accessible via `/api/brain/orchestrate`:

| Engine ID | Engine Name | Workflow & Output |
| :--- | :--- | :--- |
| `crewai_swarm` | CrewAI Multi-Agent Swarm | 3-agent pipeline (Researcher, Principal Engineer, QA Lead) generating verified async tasks. |
| `langgraph_workflow` | LangGraph State Machine | Cyclic state graph with deterministic guardrails and checkpoint verification. |
| `autogen_debate` | AutoGen Debate Arena | Multi-agent debate between Architect, Critic, and Dev synthesizing resilient implementations. |
| `storm_research` | Stanford STORM Academic | Multi-perspective retrieval compiling fully cited Wikipedia-style technical whitepapers. |
| `notebooklm_audio` | NotebookLM Audio Podcast | 2-host conversational script (Alex & Sam) synthesized for native mobile Android TTS. |
| `system_design_101` | ByteByteGo System Design | Distributed microservice blueprints, edge-pairing, and circuit-breaker specs. |
| `youtube_automation` | YouTube Video Pipeline | High-CTR titles, 60-second Shorts scripts with B-roll/audio timecodes, and SEO tags. |
| `claude_seo_marketing` | Claude SEO & Marketing Engine | Content gap analysis, long-tail keyword clusters, and meta-strategy blueprints. |
| `ecc_performance` | ECC Performance Benchmark | Low-latency latency profiler, token-throughput harness, and hardware optimization. |
| `munder_difflin_office` | Munder-Difflin Office Sandbox | Simulation of multi-department enterprise workflows and role-based tasks. |
| `fonoster_sip_voice` | Fonoster SIP Voice Telephony | Programmable IVR call trees, audio streaming, and automated voice agent routing. |

---

## 🖥️ Desktop Computer-Use Agent (CUA)

The desktop automation engine in `tools.py` provides natural language desktop execution:

```python
# Example: Executing actions through the CUA Tool Engine
from tools import cua_click_coordinate, desktop_capture_screenshot, cua_type_text

# Capture screen perception
screenshot = desktop_capture_screenshot()

# Target UI element and interact
cua_click_coordinate(x=960, y=540)
cua_type_text(text="Hello from Muse Agent!")
```

Supported desktop capabilities:
- **`desktop_capture_screenshot`**: High-resolution screen buffer with bounding-box coordinate mapping.
- **`cua_click_coordinate`** & **`cua_type_text`**: Mouse clicking, smooth drag, text typing, and hotkey triggering (`Ctrl+C`, `Alt+Tab`, etc.).
- **`active_window_inspect`**: Discovers window handles, titles, and foreground applications.
- **`routine_execute_chain`**: Multi-step chained action workflows executed with automated error-recovery.

---

## 📱 Android Companion APK & Termux Bridge

Muse pairs with an Android device (`com.muse.agent`, 13.5 MB):

1. **Wake-Word Voice Agent**: Hands-free voice recognition with native Android Text-to-Speech (TTS).
2. **Termux Shell Dispatch**: Executes system scripts directly in Termux using `com.termux.RUN_COMMAND`.
3. **Wireless ADB / Shizuku**: Tap, swipe, open apps, and automate Android UI elements wirelessly.
4. **Three Connection Modes**:
   - 🏠 **Local LAN**: Instant connection over home Wi-Fi (`http://192.168.x.x:8765`).
   - ☁️ **Cloudflare Tunnel**: Encrypted HTTPS access anywhere in the world.
   - 📴 **Offline Mode**: Operates completely local with cached workflows.

---

## 🔌 17 Production Connectors

Muse includes built-in consent and OAuth RPC callback handlers for 17 popular services:

| Connector | Category | Protocol / Capabilities | Status |
| :--- | :--- | :--- | :---: |
| **GitHub** | Developer | Repository management, commits, issues, PR review | 🟢 Active |
| **Gmail** | Productivity | Read, search, draft, and send emails via OAuth2 | 🟢 Active |
| **Google Drive** | Storage | File upload, search, document syncing | 🟢 Active |
| **Google Calendar** | Productivity | Event scheduling, reminders, availability checking | 🟢 Active |
| **WhatsApp** | Messaging | Web/Noise protocol session login and message dispatch | 🟢 Active |
| **Telegram** | Messaging | Bot API, channel monitoring, interactive replies | 🟢 Active |
| **Slack** | Collaboration | Webhook & Bot user messaging, thread management | 🟢 Active |
| **Discord** | Community | Webhook automation, server alerts, command triggers | 🟢 Active |
| **Spotify** | Entertainment | Playback control, playlist management, search | 🟢 Active |
| **Notion** | Knowledge | Database queries, page creation, notes sync | 🟢 Active |
| **Trello** | Task Management | Board management, card updates, workflow movement | 🟢 Active |
| **Jira** | Project Management | Issue tracking, sprint updates, ticket creation | 🟢 Active |
| **Linear** | Engineering | Issue tracking, cycle management, developer triage | 🟢 Active |
| **Asana** | Productivity | Task assignments, project tracking, milestone updates | 🟢 Active |
| **Todoist** | Personal Tasks | Daily checklist sync, priority setting, reminders | 🟢 Active |
| **Dropbox** | Cloud Storage | Secure file upload and public link generation | 🟢 Active |
| **OneDrive** | Cloud Storage | Microsoft 365 cloud file sync and document access | 🟢 Active |

---

## 🛡️ Security & Privacy

Muse is built from the ground up on **Local-First Privacy**:
- 🔒 **No Cloud Lock-in**: All API keys, credentials, and settings are stored locally in `data/settings.json` and encrypted via `data/.vault_master.key`.
- 🛡️ **Zero Tracking**: No telemetry or user prompts are ever sent to third parties without explicit provider configuration.
- 📋 Read our [Security Policy](SECURITY.md) to report vulnerabilities responsibly.

---

## 🤝 Contributing

Contributions are warmly welcomed! Please read our [Contributing Guidelines](CONTRIBUTING.md) to get started.

1. Fork the Project (`https://github.com/raghavkhandal72-coder/muse-agent/fork`)
2. Create your Feature Branch (`git checkout -b feature/AmazingConnector`)
3. Commit your Changes (`git commit -m 'feat: add AmazingConnector'`)
4. Push to the Branch (`git push origin feature/AmazingConnector`)
5. Open a Pull Request

---

## 📜 Citation

If you use Muse Agent in your academic research, projects, or applications, please cite:

```bibtex
@software{khandal2026muse,
  author = {Khandal, Raghav},
  title = {Muse AI Agent: Autonomous Hybrid Desktop and Mobile Agent Runtime},
  url = {https://github.com/raghavkhandal72-coder/muse-agent},
  version = {1.0.0},
  year = {2026}
}
```

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) or [`LICENSE.md`](LICENSE.md) for full details.

---

<p align="center">
  <b>Created with ❤️ by <a href="https://github.com/raghavkhandal72-coder">Raghav Khandal (@raghavkhandal72-coder)</a></b><br>
  <i>⭐ If you find Muse Agent useful, please give it a star on GitHub! ⭐</i>
</p>