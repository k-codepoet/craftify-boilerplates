from .types import ProcessorInput, ProcessorOutput
from .registry import register_processor, process_file, get_supported_types

# Import processors to register them
from . import image
from . import document

__all__ = [
    "ProcessorInput",
    "ProcessorOutput",
    "register_processor",
    "process_file",
    "get_supported_types",
]
