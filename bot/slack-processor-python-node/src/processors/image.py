"""Image processor - resize, crop, convert images."""

from io import BytesIO
from PIL import Image

from .registry import register_processor
from .types import ProcessorInput, ProcessorOutput


@register_processor(
    extensions=["jpg", "jpeg", "png", "webp", "gif"],
    mimetypes=["image/jpeg", "image/png", "image/webp", "image/gif"],
    description="Resize and optimize images",
)
def process_image(input: ProcessorInput) -> ProcessorOutput:
    """Resize image to max 800px width."""
    # Open image
    img = Image.open(BytesIO(input.content))
    original_size = img.size

    # Resize if wider than 800px
    max_width = 800
    if img.width > max_width:
        ratio = max_width / img.width
        new_size = (max_width, int(img.height * ratio))
        img = img.resize(new_size, Image.Resampling.LANCZOS)

    # Save to bytes
    output_buffer = BytesIO()
    img_format = "PNG" if input.extension == "png" else "JPEG"
    img.save(output_buffer, format=img_format, quality=85)
    output_buffer.seek(0)

    # Generate output filename
    base_name = input.filename.rsplit(".", 1)[0]
    new_filename = f"{base_name}-resized.{input.extension}"

    return ProcessorOutput(
        text=f"Processed image: {input.filename}\nOriginal: {original_size[0]}x{original_size[1]}\nResized to max {max_width}px width",
        file={
            "content": output_buffer.read(),
            "filename": new_filename,
            "title": f"Resized: {input.filename}",
        },
        reply_in_thread=True,
    )
