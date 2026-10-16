# Security Policy — Muse AI Agent

## Credential & Vault Architecture
- **Environment Variables First**: `main.py` loads `NVIDIA_API_KEY`, `GEMINI_API_KEY`, and `AIMLAPI_KEY` from `.env` or system environment variables. Never commit `.env` files.
- **Local Encrypted Vault**: Secrets saved via `LocalEncryptedVault` in `settings_manager.py` use `data/.vault_master.key` (excluded via `.gitignore`).

## Reporting a Vulnerability
Please report security issues via [GitHub Security Advisories](https://github.com/raghavkhandal72-coder/muse-agent/security/advisories/new).
