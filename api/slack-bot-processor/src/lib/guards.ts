/**
 * Guards - 이벤트 처리 전 스킵 조건 체크
 *
 * 재귀 호출, 불필요한 처리 등을 방지하는 조건들을 한 곳에서 관리
 */

export interface FileGuardContext {
  /** 파일을 업로드한 사용자 ID */
  fileUserId?: string
  /** 현재 봇 ID */
  botUserId?: string
  /** 파일명 */
  filename?: string
  /** 파일 MIME type */
  mimetype?: string
  /** 파일 크기 (bytes) */
  fileSize?: number
}

export interface SkipResult {
  skip: boolean
  reason?: string
}

type GuardFn = (ctx: FileGuardContext) => SkipResult

/**
 * 개별 가드 함수들
 */
const guards: GuardFn[] = [
  // 봇이 업로드한 파일 무시 (무한루프 방지)
  (ctx) => {
    if (ctx.fileUserId && ctx.botUserId && ctx.fileUserId === ctx.botUserId) {
      return { skip: true, reason: 'File uploaded by bot itself' }
    }
    return { skip: false }
  },

  // 처리 결과 파일 패턴 무시 (예: -resized, -processed 등)
  (ctx) => {
    const skipPatterns = ['-resized', '-processed', '-thumbnail', '-converted']
    if (ctx.filename && skipPatterns.some((p) => ctx.filename!.includes(p))) {
      return { skip: true, reason: `Filename contains skip pattern: ${ctx.filename}` }
    }
    return { skip: false }
  },

  // 너무 큰 파일 무시 (기본 50MB)
  (ctx) => {
    const maxSize = parseInt(process.env.MAX_FILE_SIZE || '52428800', 10) // 50MB
    if (ctx.fileSize && ctx.fileSize > maxSize) {
      return { skip: true, reason: `File too large: ${ctx.fileSize} bytes` }
    }
    return { skip: false }
  },
]

/**
 * 파일 처리를 스킵해야 하는지 체크
 *
 * @example
 * ```ts
 * const result = shouldSkipFile({
 *   fileUserId: file.user,
 *   botUserId: context.botUserId,
 *   filename: file.name,
 *   fileSize: file.size,
 * })
 *
 * if (result.skip) {
 *   logger.debug(`Skipping: ${result.reason}`)
 *   return
 * }
 * ```
 */
export function shouldSkipFile(ctx: FileGuardContext): SkipResult {
  for (const guard of guards) {
    const result = guard(ctx)
    if (result.skip) {
      return result
    }
  }
  return { skip: false }
}

/**
 * 커스텀 가드 추가
 *
 * @example
 * ```ts
 * addGuard((ctx) => {
 *   if (ctx.mimetype?.startsWith('video/')) {
 *     return { skip: true, reason: 'Video files not supported' }
 *   }
 *   return { skip: false }
 * })
 * ```
 */
export function addGuard(guard: GuardFn): void {
  guards.push(guard)
}
