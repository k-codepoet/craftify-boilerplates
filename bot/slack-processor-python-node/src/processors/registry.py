"""Processor registry - maps file types to processors."""

from .types import ProcessorEntry, ProcessorInput, ProcessorOutput, Processor

# Global registry
_processors: list[ProcessorEntry] = []


def register_processor(
    extensions: list[str],
    description: str,
    mimetypes: list[str] | None = None,
) -> Callable[[Processor], Processor]:
    """Decorator to register a processor.

    Usage:
        @register_processor(extensions=["jpg", "png"], description="Resize images")
        def process_image(input: ProcessorInput) -> ProcessorOutput:
            ...
    """

    def decorator(func: Processor) -> Processor:
        entry = ProcessorEntry(
            extensions=extensions,
            mimetypes=mimetypes or [],
            process=func,
            description=description,
        )
        _processors.append(entry)
        print(f"[Processor] Registered: {description} ({', '.join(extensions)})")
        return func

    return decorator


def find_processor(filename: str, mimetype: str) -> ProcessorEntry | None:
    """Find processor for a given file."""
    ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else ""

    for p in _processors:
        if ext in p.extensions or mimetype in p.mimetypes:
            return p

    return None


def process_file(input: ProcessorInput) -> ProcessorOutput | None:
    """Process a file through the appropriate processor."""
    processor = find_processor(input.filename, input.mimetype)

    if processor is None:
        print(f"[Processor] No processor found for: {input.filename}")
        return None

    print(f"[Processor] Processing {input.filename} with: {processor.description}")
    return processor.process(input)


def get_supported_types() -> str:
    """Get list of supported file types for help message."""
    lines = [f"• {', '.join(p.extensions)}: {p.description}" for p in _processors]
    return "\n".join(lines)
