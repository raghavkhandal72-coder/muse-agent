# Muse Agent - Developer Automation Makefile

.PHONY: help test run server doctor docker clean lint format

help:
	@echo "Muse Agent - Commands:"
	@echo "  make test      Run automated unit tests and REA diagnostics"
	@echo "  make run       Run Muse Agent CLI in interactive mode"
	@echo "  make server    Start Muse headless HTTP/WebSocket backend"
	@echo "  make doctor    Run environment & hardware diagnostics"
	@echo "  make docker    Build and launch Docker container suite"
	@echo "  make clean     Clean temporary caches and logs"

test:
	python scripts/test_runner.py

run:
	python cli.py run

server:
	python main.py --headless

doctor:
	python cli.py doctor

docker:
	docker compose up --build -d

clean:
	find . -type d -name "__pycache__" -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete
