# Meta Muse Architecture

```
                  +-----------------------------------+
                  |      Meta Muse User Interface     |
                  |     (React SPA in hatch/index)    |
                  +-----------------+-----------------+
                                    |
                    HTTP REST & WS  |  RPC Protocol
                                    v
                  +-----------------------------------+
                  |      Muse Gateway Server          |
                  |         (main.py :8765)           |
                  +--------+-----------------+--------+
                           |                 |
             +-------------+                 +-------------+
             v                                             v
+------------------------+                     +------------------------+
|   CUA & Tools Engine   |                     |  LLM Inference Engine  |
|      (tools.py)        |                     |   (NVIDIA NIM / Local) |
+-----------+------------+                     +------------------------+
            |
            +--> Mouse / Keyboard Orchestration (PyAutoGUI)
            +--> Screen Buffer & OCR (Pillow, Windows GDI)
            +--> System Shell & Process Management
            +--> Multi-Platform Connectors (Gmail, GitHub, etc.)
```

## Core Modules
1. **`main.py`:** Initializes the HTTP & WebSocket server, handles tokenless local auth, serves Hatch static assets, injects the native bridge script, and coordinates background workers.
2. **`tools.py`:** Implements real-world skills, OCR, desktop capture, application switcher, and file managers.
3. **`settings_manager.py`:** Persists model selection, temperature, and tool permissions in local JSON.
4. **`tunnel_manager.py`:** Optional Cloudflare daemon for zero-configuration secure remote access.
