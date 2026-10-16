import os
import subprocess
import json
import unittest

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

class TestReaInspector(unittest.TestCase):
    def test_rea_doctor(self):
        """Verify REA Doctor diagnostics suite passes with HEALTHY status."""
        doctor_path = os.path.join(BASE_DIR, "rea-inspector", "lib", "doctor.js").replace("\\", "/")
        script = f"console.log(JSON.stringify(require('{doctor_path}').runDoctor()))"
        res = subprocess.run(["node", "-e", script], capture_output=True, text=True, cwd=BASE_DIR)
        self.assertEqual(res.returncode, 0, f"Node script failed: {res.stderr}")
        data = json.loads(res.stdout)
        self.assertIn(data.get("overallStatus"), ["PASS", "HEALTHY", "OK"])

if __name__ == "__main__":
    unittest.main()
