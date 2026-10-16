import os
import sys
import unittest

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

class TestMuseAgentCore(unittest.TestCase):
    def test_imports(self):
        """Verify all primary modules import cleanly without side-effects."""
        import tools
        import settings_manager
        import tunnel_manager
        import cli
        self.assertIsNotNone(tools)
        self.assertIsNotNone(settings_manager)
        self.assertIsNotNone(tunnel_manager)
        self.assertEqual(cli.VERSION, "1.0.0")

    def test_settings_manager_system_info(self):
        """Verify settings_manager retrieves system info and default settings."""
        import settings_manager
        info = settings_manager.get_system_info()
        self.assertIsInstance(info, dict)
        self.assertTrue("version" in info or "vault" in info)
        settings = settings_manager.load_settings()
        self.assertIsInstance(settings, dict)

    def test_tools_schema_registration(self):
        """Verify critical tools are registered in TOOL_SCHEMAS."""
        import tools
        self.assertTrue(hasattr(tools, "TOOL_SCHEMAS"))
        self.assertIsInstance(tools.TOOL_SCHEMAS, list)
        tool_names = [
            t.get("function", {}).get("name") if "function" in t else t.get("name")
            for t in tools.TOOL_SCHEMAS
            if isinstance(t, dict)
        ]
        self.assertTrue(len(tool_names) > 0)
        self.assertIn("cua_launch_app", tool_names)

if __name__ == "__main__":
    unittest.main()
