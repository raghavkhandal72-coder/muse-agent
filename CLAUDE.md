# CLAUDE.md - Guide for Claude Code & AI Contributors

This guide provides instructions, architectural context, and development guidelines for **Claude Code** (`claude`), Anthropic AI models, and automated contributor agents working on **Muse AI Agent** (`muse-agent`).

---

## 🏛️ Project Architecture Overview

Muse AI Agent is an autonomous, hybrid desktop-and-mobile agent runtime created by [Raghav Khandal (@raghavkhandal72-coder)](https://github.com/raghavkhandal72-coder).

### Key Files & Modules
- **`main.py`**: Core HTTP (`ThreadingHTTPServer` on port 8765) and WebSocket gateway. Implements multi-provider LLM routing (NVIDIA NIM, Google Gemini, AIMLAPI, and local Ollama fallback), connector callback endpoints (`/api/connectors/*`), and telemetry.
- **`tools.py`**: Tool execution registry including Computer-Use Agent (CUA) automation (PyAutoGUI, Pillow screenshot buffer, OCR coordinates), filesystem operations, MCP tool router (`mcp_call_tool`), and Termux shell bridge.
- **`muse_master_brain.py`**: Multi-agent swarm orchestrator exposing 11 specialized execution modes (`crewai_swarm`, `langgraph_workflow`, `autogen_debate`, `storm_research`, `notebooklm_audio`, `system_design_101`, `youtube_automation`, etc.).
- **`settings_manager.py`**: Local-first preference manager and AES-256 encrypted secrets vault (`data/.vault_master.key`).
- **`tunnel_manager.py`**: Zero-config daemon spawning Cloudflare Tunnels for public HTTPS access (`*.trycloudflare.com`).
- **`rea-inspector/`**: Reverse Engineer Anything (REA) inspection suite matching `morluto/rea` specifications.
- **`skills/`**: Standard AI coding agent skill manifests (`reverse-engineer-anything/SKILL.md`, `muse-computer-use/SKILL.md`).

---

## ⚡ Essential Commands for Claude Code

### Environment & Installation
```bash
# Install core Python dependencies
pip install -r requirements.txt
```

### Running Muse Agent
```bash
# Headless Server mode (Recommended for automated testing & CI)
python main.py --headless

# Desktop GUI mode
python main.py
```

### Automated Health Checks & Validation
```bash
# 1. Syntax & compilation check
python -m py_compile main.py tools.py settings_manager.py tunnel_manager.py

# 2. Module import & tools verification
python -c "import tools; print('Tools module loaded successfully')"
python -c "import settings_manager; print('Settings manager loaded successfully')"

# 3. REA System & Cryptography Doctor
node -e "console.log(require('./rea-inspector/lib/doctor').runDoctor())"
```

---

## 🛡️ Critical Guidelines & Constraints

1. **Strict Secrets Policy**:
   - **NEVER** hardcode API keys, tokens, or personal paths in code.
   - All keys must load dynamically via `os.environ.get()` or `.env`.
   - `data/settings.json`, `.env`, and `data/.vault_master.key` are strictly ignored by `.gitignore`. Do **not** remove them from `.gitignore`.
2. **Local-First & Offline Resilience**:
   - Always ensure cloud LLM routing has a circuit-breaker fallback to local Ollama (`http://127.0.0.1:11434`).
   - Do not require mandatory external cloud services for core functionality.
3. **Cross-Platform Compatibility**:
   - Muse runs on Windows, Linux, and Android (Termux). Avoid Windows-only path separators; always use `os.path` or `pathlib.Path`.
4. **Tool Registration**:
   - When adding a new tool to `tools.py`, always define its parameter schema and register it in both `TOOLS_SCHEMA` and the dispatch dictionary.

---

## 🤖 Contributing via Claude Code Workflow

When asked to implement a new feature, fix a bug, or add a connector:
1. **Analyze**: Inspect relevant modules using file-reading and grep tools.
2. **Branch**: Create a descriptive feature branch: `git checkout -b feature/claude-<topic>`.
3. **Implement**: Keep edits focused, preserving existing comments and error handlers.
4. **Verify**: Run `python -m py_compile` and execute `python main.py --headless` for 3 seconds to ensure port 8765 binds cleanly.
5. **Commit**: Use Conventional Commits formatting:
   `git commit -m 'feat(connector): add Discord webhook connector'`
   `git commit -m 'fix(cua): improve coordinate scaling on high-DPI displays'`
