# Muse AI Agent v1.0.0 — Initial Open-Source Release Notes

* **Repository**: [https://github.com/raghavkhandal72-coder/muse-agent](https://github.com/raghavkhandal72-coder/muse-agent)
* **Maintainer**: [@raghavkhandal72-coder](https://github.com/raghavkhandal72-coder)
* **Release Tag**: `v1.0.0`
* **Release Title**: `Muse AI Agent v1.0.0 — Hybrid Multi-Agent Swarm, Computer-Use Engine & Android Companion`

---

## What's New in v1.0.0

We are open-sourcing Muse AI Agent, a full-stack autonomous AI agent platform that pairs a local Python desktop engine (`:8765`) with a native Android companion APK and Termux/ADB execution bridge.

### 1. Multi-Agent Swarm Orchestrator (`muse_master_brain.py`)
* **11 Built-In Orchestration Modes**: Out-of-the-box pipelines for CrewAI Swarm (`crewai_swarm`), LangGraph StateGraph (`langgraph_workflow`), AutoGen Consensus Debate (`autogen_debate`), Stanford STORM Academic Research (`storm_research`), NotebookLM 2-Host Audio Deep-Dive (`notebooklm_audio`), ByteByteGo SystemDesign-101 (`system_design_101`), YouTube Shorts Automation (`youtube_automation`), Claude SEO & Growth Studio (`seo_marketing`), Fonoster SIP Voice (`fonoster_voice`), ECC Agent Performance Harness (`ecc_harness`), and Munder-Difflin Virtual Office (`munder_difflin`).
* **20 Plugin Ecosystems Supported**: Automatic `sys.path` registration for 20 open-source agent and skill frameworks under `assets/engine/plugins/`.

### 2. Hybrid Cloud + Offline Inference Router (`main.py`)
* **Multi-Provider Cloud Routing**: Supports NVIDIA NIM (`meta/llama-3.2-11b-vision-instruct` with automatic key-pool rotation), Google Gemini (`generateContent`), and AIMLAPI (`chat/completions`).
* **Offline Local Fallback**: Seamless circuit-breaker fallback to local Ollama (`http://127.0.0.1:11434`) when internet connectivity drops.

### 3. Computer-Use Agent (CUA) & 17 Native Connectors (`tools.py`)
* **Live Screen Vision & Desktop Control**: Full mouse, keyboard, window inspection, app launching, and live screen vision analysis (`/api/vision/capture-screen`).
* **17 Pre-Configured Connectors**: Built-in catalog (`MUSE_CONNECTORS_CATALOG`) spanning Fonoster Voice, Custom MCP Servers (JSON-RPC 2.0 `tools/call`), Termux Shell, ADB & Shizuku Control, Multi-Step Workflow Routines, GitHub, Google Drive, Gmail, Google Calendar, Google Docs, Google Sheets, Notion, Calendly, Slack, WhatsApp, Spotify, and Instagram.

### 4. Local-First Memory, Goals Vault & Encrypted Secrets (`settings_manager.py`)
* **Persistent SQLite Storage**: Local memories and goals tables (`/api/goals/manage`) plus automatic Second Brain JSON backup (`backup_second_brain()`).
* **Encrypted Local Vault**: `LocalEncryptedVault` (`data/.vault_master.key`) for storing local credentials alongside schema-validated user settings (`data/settings.json`).

### 5. Android Companion APK & Remote Tunneling (`com.muse.agent` & `tunnel_manager.py`)
* **Native MuseBridge WebView Interface**: Supports voice input (`startVoiceRecognition`), native Android TTS (`speakText`), background Termux command execution (`com.termux.RUN_COMMAND`), clipboard/share intents, and one-tap server switching.
* **Zero-Config Remote Access**: `RemoteTunnelManager` integrates with `cloudflared` to provision `https://*.trycloudflare.com` tunnels automatically on port 8765.

---

## Quick Install & Pairing

```bash
git clone https://github.com/raghavkhandal72-coder/muse-agent.git
cd muse-agent/assets/engine
python3 main.py
```
Download the attached `Muse_Agent.apk` from the [GitHub Releases page](https://github.com/raghavkhandal72-coder/muse-agent/releases) to pair your Android phone over local Wi-Fi (`:8765`) or Cloudflare Tunnel.

---

## Pre-Release Sanitization Checklist (Complete Before Tagging v1.0.0)

Before attaching `Muse_Agent.apk` to your GitHub Release or pushing the repository history to `github.com/raghavkhandal72-coder/muse-agent`, verify these 5 cleanup steps:
1. **Strip Hardcoded API Keys**: Fallbacks for `NVIDIA_KEY`, `NVIDIA_KEYS_POOL`, `GEMINI_KEY`, and `AIMLAPI_KEY` are stripped from git and strictly read from `.env` or `os.environ`.
2. **Replace Hardcoded Windows Paths**: Paths are anchored relative to `Path(__file__).resolve().parent`.
3. **Remove Hardcoded LAN IP in Android Defaults**: Mobile app defaults to `127.0.0.1:8765` and uses dynamic LAN QR pairing.
4. **Remove Proprietary Files & Zero-Padded Binaries**: Debloated APK from 62.7 MB down to 13.57 MB, stripped all Meta Platforms copyright markers.
5. **Add `.gitignore` and `.env.example`**: Secrets and runtime local database files are excluded from version control.
