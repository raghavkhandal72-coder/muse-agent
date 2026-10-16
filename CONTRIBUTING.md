# Contributing to Muse AI Agent

Thank you for contributing to Muse AI Agent ([github.com/raghavkhandal72-coder/muse-agent](https://github.com/raghavkhandal72-coder/muse-agent))! This guide covers local development setup, how to add new multi-agent orchestration modes and connectors, and mandatory security checks before opening a Pull Request.

---

## Development Setup

1. **Fork and clone the repository**:
   ```bash
   git clone https://github.com/raghavkhandal72-coder/muse-agent.git
   cd muse-agent
   ```

2. **Create a virtual environment and install dependencies**:
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate # On Windows: .venv\Scripts\activate
   pip install psutil fastapi uvicorn cryptography pillow pyautogui
   ```

3. **Configure environment variables**: Copy `.env.example` (or create `.env` inside `assets/engine/`) and add your own API keys:
   ```env
   NVIDIA_API_KEY=nvapi-your-own-key
   GEMINI_API_KEY=your-own-gemini-key
   AIMLAPI_KEY=your-own-aimlapi-key
   ```

4. **Start the engine in development mode**:
   ```bash
   cd assets/engine
   python3 main.py
   ```
   Verify that `http://127.0.0.1:8765/api/telemetry` and `http://127.0.0.1:8765/api/brain/engines` return valid JSON responses.

---

## Extending Muse

### 1. Adding a New Master Brain Orchestration Mode (`muse_master_brain.py`)
To integrate a new multi-agent framework or specialized workflow:
1. Register the plugin directory (if applicable) in `AGENT_REPOS` (`assets/engine/main.py`) and `REPOS` (`assets/engine/muse_master_brain.py`).
2. Add an orchestration branch inside `execute_brain_orchestration(payload: dict)` in `assets/engine/muse_master_brain.py`:
   ```python
   elif mode in ("my_new_mode", "custom_swarm"):
       active_engine = "My Custom Swarm Engine"
       execution_log.append("Initializing custom workflow...")
       result_text = f"## Custom Output for: {task}\n..."
   ```
3. Register the engine metadata in `get_supported_engines()` so the UI and `/api/brain/engines` endpoint discover it automatically:
   ```python
   {"id": "my_new_mode", "name": "My Custom Swarm", "description": "Short summary of what this engine does"}
   ```

### 2. Adding a New Connector or Tool (`tools.py` & `main.py`)
To add a new service connector or Computer-Use Agent (CUA) tool:
1. Implement the tool function in `assets/engine/tools.py` with clear type hints and a structured dictionary return (`{"status": "success", ...}` or `{"status": "error", "message": ...}`).
2. Register the dispatch branch in `execute_tool(name: str, args: dict)` inside `assets/engine/tools.py`.
3. Add catalog metadata (if it is a user-facing connector) to `MUSE_CONNECTORS_CATALOG` in `assets/engine/main.py`:
   ```python
   {
       "id": "my_connector",
       "name": "My Service",
       "description": "What this connector automates.",
       "icon": "my_connector",
       "iconKey": "my_connector",
       "iconUrl": "/assets/connectors/icon_custom.png",
       "icon_url": "/assets/connectors/icon_custom.png",
       "state": "connected",
       "connected": True,
       "category": "productivity", # communication | business | productivity | social
       "supports_multiple_accounts": False,
       "is_custom": True
   }
   ```

### 3. Adding a User Setting (`settings_manager.py`)
All user preferences stored in `data/settings.json` must be registered in both `ALLOWED_KEYS` (with a type tuple and validation lambda) and `DEFAULTS` inside `assets/engine/settings_manager.py`. Any key not present in `ALLOWED_KEYS` will raise a `ValueError` on `update_setting()`.

---

## Mandatory Pre-Commit Security & Hygiene Checklist

Before submitting a Pull Request to [raghavkhandal72-coder/muse-agent](https://github.com/raghavkhandal72-coder/muse-agent) or building a release APK, verify every item below:

| Check | Requirement |
| :--- | :--- |
| **No Hardcoded Secrets** | Never commit `nvapi-*`, `AIza*`, `AQ.*`, `sk-*`, or `AIMLAPI` keys in `main.py` or any other file. All keys must read from `os.environ` or `LocalEncryptedVault`. |
| **No Local Machine Paths** | Do not hardcode user-specific Windows/Linux paths (such as `C:\Users\...` or `E:\...`) in `main.py` or `tunnel_manager.py`. Always resolve paths relative to `Path(__file__).resolve().parent` or via environment variables. |
| **No Private LAN IPs in Defaults** | Do not hardcode personal LAN IPs (such as `192.168.29.140`) as static fallbacks in `MainActivity.java`; use `127.0.0.1:8765` or dynamic Wi-Fi subnet discovery. |
| **No Runtime Databases or Keys** | Ensure `data/*.db`, `data/settings.json`, `data/.vault_master.key`, and `data/remote_tunnel.json` are listed in `.gitignore`. |
| **No Proprietary Assets or Zero-Padded Binaries** | Do not commit third-party proprietary HTML/fonts or large zero-padded placeholder files (`meta_muse_engine_weights.bin`) into the Git tree. |

---

## Pull Request Process

1. Fork [https://github.com/raghavkhandal72-coder/muse-agent](https://github.com/raghavkhandal72-coder/muse-agent) and create a descriptive feature branch (`git checkout -b feat/add-linear-connector` or `fix/remove-hardcoded-paths`).
2. Test both online cloud inference and offline fallback behavior (`http://127.0.0.1:11434`).
3. Ensure no secrets or local paths appear in `git diff`.
4. Open a Pull Request against `main` describing the problem solved, modules touched (`main.py`, `muse_master_brain.py`, `tools.py`, `settings_manager.py`, or Android wrapper), and verification steps.


---

## 🤖 Contributing with Claude Code (Anthropic)

Muse Agent is fully optimized for **Claude Code** (`claude`), Anthropic's agentic coding assistant.

### Quick Setup with Claude Code:
1. Open your terminal in the repository root:
   ```bash
   cd muse-agent
   claude
   ```
2. Claude Code will automatically detect and load [`CLAUDE.md`](CLAUDE.md).
3. You can give Claude instructions such as:
   - *"Add a new connector for Discord in tools.py"*
   - *"Write a unit test for the REA Inspector suite"*
   - *"Optimize the Computer-Use Agent screen capture pipeline"*

Claude will follow the project architecture, run verification checks, and prepare production-ready commits.
