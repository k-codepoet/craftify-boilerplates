"""Processor type definitions."""

from dataclasses import dataclass, field
from typing import TypedDict, Callable


@dataclass
class ProcessorInput:
    """Input data for file processors."""

    filename: str
    mimetype: str
    extension: str
    content: bytes
    user_id: str
    channel_id: str
    thread_ts: str | None = None


class FileOutput(TypedDict, total=False):
    """File to upload back to Slack."""

    content: bytes
    filename: str
    title: str | None


@dataclass
class ProcessorOutput:
    """Output from file processors."""

    text: str | None = None
    file: FileOutput | None = None
    reply_in_thread: bool = True


# Type alias for processor functions
Processor = Callable[[ProcessorInput], ProcessorOutput | None]


@dataclass
class ProcessorEntry:
    """Processor registry entry."""

    extensions: list[str]
    mimetypes: list[str]
    process: Processor
    description: str
