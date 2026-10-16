# GEMINI.md - Google Gemini & Antigravity Agent Guidelines

# Muse AI Agent - Agent Contribution Guidelines

## Architecture Overview
- `main.py`: Core HTTP server (port 8765) and WebSocket gateway. Handles LLM provider routing (NVIDIA NIM, Google Gemini, AIMLAPI, and Ollama offline fallback), connector states, and frontend routes.
- `tools.py`: CUA (Computer-Use Agent) desktop perception and action engine (PyAutoGUI, Pillow, OCR), filesystem tools, MCP router (`mcp_call_tool`), and Termux shell bridge.
- `muse_master_brain.py`: Multi-agent swarm orchestrator (11 execution modes: CrewAI, LangGraph, AutoGen, STORM, NotebookLM, etc.).
- `settings_manager.py`: Local-first encrypted settings and secrets vault (`data/.vault_master.key`).
- `tunnel_manager.py`: Zero-config Cloudflare daemon managing public HTTPS tunnels (`*.trycloudflare.com`).
- `rea-inspector/`: Reverse Engineer Anything (REA) tools and diagnostics suite.
- `skills/`: Standard agent skills (`reverse-engineer-anything/SKILL.md`, `muse-computer-use/SKILL.md`).

## Critical Rules for AI Agents
1. **Never commit secrets**: Do not commit API keys, `.env`, or `data/settings.json`. Keys must be read from environment variables or encrypted vault.
2. **Offline resilience**: Always support local fallback to Ollama (`http://127.0.0.1:11434`) when cloud inference APIs are unavailable.
3. **Cross-platform**: Support Windows, Linux, and Android Termux. Use `os.path` or `pathlib.Path` instead of hardcoded backslashes.
4. **Validation**: Test changes using:
   - `python -m py_compile main.py tools.py settings_manager.py tunnel_manager.py`
   - `python main.py --headless` (ensure port 8765 binds without errors)
   - `node -e "console.log(require('./rea-inspector/lib/doctor').runDoctor())"`


## Gemini Specifics
- Utilize skills in skills/ for specialized reverse-engineering and CUA tasks.
- Follow clean Python 3.10+ typing.