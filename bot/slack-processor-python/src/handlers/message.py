"""Message event handlers."""

from slack_bolt import App

from src.processors import get_supported_types


def register_message_handlers(app: App) -> None:
    """Register message-related handlers."""

    @app.event("app_mention")
    def handle_mention(event: dict, client, logger) -> None:
        """Respond to app mentions with help info."""
        try:
            supported = get_supported_types()
            client.chat_postMessage(
                channel=event["channel"],
                thread_ts=event.get("ts"),
                text=f"Hi! I'm a file processor bot. Upload a file and I'll process it.\n\n*Supported file types:*\n{supported}",
            )
        except Exception as e:
            logger.error(f"Error responding to mention: {e}")

    @app.message("help|도움|지원")
    def handle_help(message: dict, client, logger) -> None:
        """Respond to help requests."""
        try:
            supported = get_supported_types()
            client.chat_postMessage(
                channel=message["channel"],
                thread_ts=message.get("ts"),
                text=f"*Supported file types:*\n{supported}\n\nJust upload a file and I'll process it automatically!",
            )
        except Exception as e:
            logger.error(f"Error sending help: {e}")
