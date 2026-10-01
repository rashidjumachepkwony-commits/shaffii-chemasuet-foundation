export type LogLevel = "debug" | "info" | "warn" | "error";

interface LogEntry {
  level: LogLevel;
  message: string;
  data?: Record<string, unknown>;
  timestamp: string;
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

let currentLogLevel: LogLevel = "info";

export function setLogLevel(level: LogLevel) {
  currentLogLevel = level;
}

export function log(level: LogLevel, entry: { msg: string; [key: string]: unknown }) {
  if (LOG_LEVELS[level] < LOG_LEVELS[currentLogLevel]) {
    return;
  }

  const logEntry: LogEntry = {
    level,
    message: entry.msg,
    data: entry,
    timestamp: new Date().toISOString(),
  };

  const SAFE_KEYS = [
    "msg", "userId", "role", "action", "path", "ip",
    "table", "recordId", "error", "stack",
  ];

  const sanitizedData: Record<string, unknown> = {};
  for (const key of SAFE_KEYS) {
    if (key in entry) {
      const value = entry[key];
      if (typeof value !== "object" || value === null) {
        sanitizedData[key] = value;
      }
    }
  }

  if (level === "error" || level === "warn") {
    console.error(JSON.stringify({ level, message: logEntry.message, ...sanitizedData }));
  } else {
    console.log(JSON.stringify({ level, message: logEntry.message, ...sanitizedData }));
  }
}

export function logRequest(method: string, path: string, status: number, duration: number) {
  log("info", {
    msg: "Request completed",
    method,
    path,
    status,
    duration,
  });
}

export function sanitizeForLog(obj: Record<string, unknown>): Record<string, unknown> {
  const SENSITIVE_KEYS = [
    "password", "token", "secret", "key", "authorization",
    "access_token", "refresh_token", "service_role_key",
  ];

  const result: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (SENSITIVE_KEYS.includes(k.toLowerCase())) {
      result[k] = "[REDACTED]";
    } else if (typeof v === "object" && v !== null && !Array.isArray(v)) {
      result[k] = sanitizeForLog(v as Record<string, unknown>);
    } else {
      result[k] = v;
    }
  }
  return result;
}
