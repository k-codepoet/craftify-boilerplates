"""File shared event handler."""

import os
import httpx
from slack_bolt import App

from src.processors import process_file, ProcessorInput
from src.lib.guards import should_skip_file


def register_file_handler(app: App) -> None:
    """Register file_shared event handler."""

    @app.event("file_shared")
    def handle_file_shared(event: dict, client, logger, context) -> None:
        """Handle file_shared event.

        Triggered when a file is uploaded to a channel where the bot is present.
        Downloads the file, processes it, and sends the result back.
        """
        try:
            file_id = event.get("file_id")
            channel_id = event.get("channel_id")

            # Get file info
            file_info = client.files_info(file=file_id)

            if not file_info.get("ok"):
                logger.error("Failed to get file info")
                return

            file = file_info.get("file", {})

            # Check skip conditions
            skip_result = should_skip_file(
                file_user_id=file.get("user"),
                bot_user_id=context.get("bot_user_id"),
                filename=file.get("name"),
                file_size=file.get("size"),
                mimetype=file.get("mimetype"),
            )

            if skip_result["skip"]:
                logger.debug(f"Skipping file: {skip_result['reason']}")
                return

            # Skip if no private URL
            url_private = file.get("url_private")
            if not url_private:
                logger.warning("File has no private URL, skipping")
                return

            # Download file content
            token = os.environ["SLACK_BOT_TOKEN"]
            with httpx.Client() as http:
                response = http.get(
                    url_private,
                    headers={"Authorization": f"Bearer {token}"},
                )

                if response.status_code != 200:
                    logger.error(f"Failed to download file: {response.status_code}")
                    return

                content = response.content

            # Get thread_ts from file shares
            shares = file.get("shares", {})
            channel_shares = (
                shares.get("public", {}).get(channel_id, [])
                or shares.get("private", {}).get(channel_id, [])
            )
            thread_ts = channel_shares[0]["ts"] if channel_shares else None

            # Prepare processor input
            filename = file.get("name", "unknown")
            extension = filename.rsplit(".", 1)[-1].lower() if "." in filename else ""

            processor_input = ProcessorInput(
                filename=filename,
                mimetype=file.get("mimetype", "application/octet-stream"),
                extension=extension,
                content=content,
                user_id=event.get("user_id", ""),
                channel_id=channel_id,
                thread_ts=thread_ts,
            )

            # Process the file
            output = process_file(processor_input)

            if output is None:
                # No processor found
                return

            # Send response back to Slack
            if output.file:
                # Upload processed file
                upload_kwargs = {
                    "channels": channel_id,
                    "content": output.file["content"],
                    "filename": output.file["filename"],
                    "title": output.file.get("title"),
                    "initial_comment": output.text,
                }
                if output.reply_in_thread and thread_ts:
                    upload_kwargs["thread_ts"] = thread_ts

                client.files_upload_v2(**upload_kwargs)

            elif output.text:
                # Just send text message
                msg_kwargs = {
                    "channel": channel_id,
                    "text": output.text,
                }
                if output.reply_in_thread and thread_ts:
                    msg_kwargs["thread_ts"] = thread_ts

                client.chat_postMessage(**msg_kwargs)

            logger.info(f"Processed file: {filename}")

        except Exception as e:
            logger.error(f"Error processing file: {e}")
