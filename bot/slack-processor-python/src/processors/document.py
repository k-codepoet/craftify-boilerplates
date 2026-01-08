"""Document processors - extract text from PDF and DOCX."""

from io import BytesIO

from pypdf import PdfReader
from docx import Document

from .registry import register_processor
from .types import ProcessorInput, ProcessorOutput


@register_processor(
    extensions=["pdf"],
    mimetypes=["application/pdf"],
    description="Extract text from PDF files",
)
def process_pdf(input: ProcessorInput) -> ProcessorOutput:
    """Extract text from PDF."""
    reader = PdfReader(BytesIO(input.content))

    text_parts = []
    for page in reader.pages:
        text_parts.append(page.extract_text() or "")

    full_text = "\n".join(text_parts)
    preview = full_text[:1000]
    truncated = "...(truncated)" if len(full_text) > 1000 else ""

    return ProcessorOutput(
        text=f"*PDF Extracted: {input.filename}*\nPages: {len(reader.pages)}\n\n```\n{preview}{truncated}\n```",
        reply_in_thread=True,
    )


@register_processor(
    extensions=["docx"],
    mimetypes=["application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
    description="Extract text from Word documents",
)
def process_docx(input: ProcessorInput) -> ProcessorOutput:
    """Extract text from DOCX."""
    doc = Document(BytesIO(input.content))

    text_parts = [para.text for para in doc.paragraphs]
    full_text = "\n".join(text_parts)

    preview = full_text[:1000]
    truncated = "...(truncated)" if len(full_text) > 1000 else ""

    return ProcessorOutput(
        text=f"*Document Extracted: {input.filename}*\n\n```\n{preview}{truncated}\n```",
        reply_in_thread=True,
    )
