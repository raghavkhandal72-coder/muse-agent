# Meta Muse Autonomous Skills Manifest

## 1. Computer Use & Desktop Automation
- `desktop_screenshot`: Multi-monitor desktop capture with coordinate mapping.
- `desktop_click`: Left, right, double-click, and drag-and-drop.
- `desktop_type`: Natural human typing with configurable delay.
- `desktop_press_hotkey`: Keyboard shortcut dispatching (`ctrl`, `alt`, `shift`, `win`).
- `desktop_active_apps`: Active process inspection and window title filtering.

## 2. File & Workspace Management
- `filesystem_read_file`: Read contents of local files safely.
- `filesystem_write_file`: Write and update files.
- `filesystem_list_directory`: Explore project directories and file trees.

## 3. Web & Developer Tools
- `system_execute_shell`: Sandboxed command-line execution for development tasks.
- `connector_github_get_repo`: Fetch repo metadata, branches, and readme.
- `connector_github_list_commits`: Inspect commit history.

## 4. Communication & Productivity
- `connector_gmail_search`: Search user emails.
- `connector_gmail_compose`: Draft and send email messages.
- `connector_google_calendar_list_events`: Fetch schedule and upcoming meetings.


## 5. Model Context Protocol (MCP) & Webhooks
- `mcp_call_tool`: Connect and dispatch JSON-RPC methods to any local or remote MCP server.
- Supports dynamic schema resolution, tool registration, and bidirectional events.

## 6. Android System & Termux Automation
- `termux_execute_command`: Direct execution of commands inside Android Termux environment.
- `adb_execute_action`: Wireless ADB and Shizuku control for taps, inputs, battery info, and screenshots.

## 7. Multi-Step Chained Routines
- `routine_execute_chain`: Sequential execution of complex workflows passing previous step output as context to subsequent steps.
