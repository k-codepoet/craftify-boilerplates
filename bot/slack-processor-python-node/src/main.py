"""Slack Bot Processor - Main entry point."""

import os
from dotenv import load_dotenv
from slack_bolt import App
from slack_bolt.adapter.socket_mode import SocketModeHandler

from src.handlers import register_file_handler, register_message_handlers

# Load environment variables
load_dotenv()

# Validate required env vars
required_vars = ["SLACK_BOT_TOKEN", "SLACK_APP_TOKEN", "SLACK_SIGNING_SECRET"]
for var in required_vars:
    if not os.environ.get(var):
        print(f"Missing required environment variable: {var}")
        print("Copy .env.example to .env and fill in your Slack credentials")
        exit(1)

# Initialize Bolt app
app = App(
    token=os.environ["SLACK_BOT_TOKEN"],
    signing_secret=os.environ["SLACK_SIGNING_SECRET"],
)

# Register handlers
register_file_handler(app)
register_message_handlers(app)


def main() -> None:
    """Start the bot in Socket Mode."""
    print("⚡️ Slack Bot Processor is running!")
    print("   Mode: Socket Mode (no public URL required)")

    handler = SocketModeHandler(app, os.environ["SLACK_APP_TOKEN"])
    handler.start()


if __name__ == "__main__":
    main()
