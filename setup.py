from setuptools import setup, find_packages

setup(
    name="muse-agent",
    version="1.0.0",
    packages=find_packages(),
    py_modules=["cli", "main", "tools", "settings_manager", "tunnel_manager"],
    entry_points={
        "console_scripts": [
            "muse=cli:main",
            "muse-agent=cli:main",
            "muse-server=cli:server_cmd",
        ],
    },
)
