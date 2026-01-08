"""Guards - 이벤트 처리 전 스킵 조건 체크.

재귀 호출, 불필요한 처리 등을 방지하는 조건들을 한 곳에서 관리.
"""

import os
from typing import TypedDict, Callable


class SkipResult(TypedDict):
    skip: bool
    reason: str | None


GuardFn = Callable[..., SkipResult]

# Global guard list
_guards: list[GuardFn] = []


def _guard_bot_upload(
    file_user_id: str | None = None,
    bot_user_id: str | None = None,
    **_,
) -> SkipResult:
    """봇이 업로드한 파일 무시 (무한루프 방지)."""
    if file_user_id and bot_user_id and file_user_id == bot_user_id:
        return {"skip": True, "reason": "File uploaded by bot itself"}
    return {"skip": False, "reason": None}


def _guard_filename_pattern(
    filename: str | None = None,
    **_,
) -> SkipResult:
    """처리 결과 파일 패턴 무시."""
    skip_patterns = ["-resized", "-processed", "-thumbnail", "-converted"]
    if filename and any(p in filename for p in skip_patterns):
        return {"skip": True, "reason": f"Filename contains skip pattern: {filename}"}
    return {"skip": False, "reason": None}


def _guard_file_size(
    file_size: int | None = None,
    **_,
) -> SkipResult:
    """너무 큰 파일 무시."""
    max_size = int(os.environ.get("MAX_FILE_SIZE", 52428800))  # 50MB
    if file_size and file_size > max_size:
        return {"skip": True, "reason": f"File too large: {file_size} bytes"}
    return {"skip": False, "reason": None}


# Register default guards
_guards = [_guard_bot_upload, _guard_filename_pattern, _guard_file_size]


def should_skip_file(
    file_user_id: str | None = None,
    bot_user_id: str | None = None,
    filename: str | None = None,
    file_size: int | None = None,
    mimetype: str | None = None,
) -> SkipResult:
    """파일 처리를 스킵해야 하는지 체크.

    Example:
        result = should_skip_file(
            file_user_id=file.get("user"),
            bot_user_id=context.get("bot_user_id"),
            filename=file.get("name"),
            file_size=file.get("size"),
        )

        if result["skip"]:
            logger.debug(f"Skipping: {result['reason']}")
            return
    """
    kwargs = {
        "file_user_id": file_user_id,
        "bot_user_id": bot_user_id,
        "filename": filename,
        "file_size": file_size,
        "mimetype": mimetype,
    }

    for guard in _guards:
        result = guard(**kwargs)
        if result["skip"]:
            return result

    return {"skip": False, "reason": None}


def add_guard(guard: GuardFn) -> None:
    """커스텀 가드 추가.

    Example:
        def guard_video(mimetype: str | None = None, **_) -> SkipResult:
            if mimetype and mimetype.startswith("video/"):
                return {"skip": True, "reason": "Video files not supported"}
            return {"skip": False, "reason": None}

        add_guard(guard_video)
    """
    _guards.append(guard)
