export type NormalizedErrorKind =
  | 'auth'
  | 'network'
  | 'validation'
  | 'server'
  | 'timeout'
  | 'cancellation'
  | 'unknown';

export interface RequestChainEntry {
  attempt: number;
  method?: string;
  url?: string;
  status?: number;
  elapsedMs?: number;
  at?: string;
  note?: string;
}

export interface NormalizedError {
  kind: NormalizedErrorKind;
  message: string;
  status?: number;
  code?: string;
  requestId?: string;
  endpoint?: string;
  safeHeaders?: Record<string, string>;
  details?: unknown;
  isRetryable: boolean;
  originalName?: string;
  /** Number of retry attempts that preceded the final failure. Optional. */
  retryCount?: number;
  /** 0-indexed final attempt that produced this error. Optional. */
  finalAttemptIndex?: number;
  /** Chronological list of attempts (URL/method/status/elapsed) for the failed operation. */
  requestChain?: RequestChainEntry[];
  /** Redacted stack trace, if available. */
  stackTrace?: string;
}

export interface NormalizeErrorOptions {
  fallbackMessage?: string;
  requestId?: string;
  endpoint?: string;
  status?: number;
  safeHeaders?: Record<string, string>;
}
