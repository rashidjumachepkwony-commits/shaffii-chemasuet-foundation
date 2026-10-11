import type { ApiResponse, PaginatedResponse } from "@/types";

function normalizeApiBase(raw: string | undefined): string {
  const fallback = "/api";
  const value = (raw || "").trim();
  if (!value) return fallback;

  // Strip trailing slashes so "…/api/" and "…/" behave identically.
  const trimmed = value.replace(/\/+$/, "");

  // Never double the suffix — VITE_API_URL may already include "/api".
  return /\/api$/i.test(trimmed) ? trimmed : `${trimmed}/api`;
}

const API_BASE = normalizeApiBase(import.meta.env.VITE_API_URL);

export { API_BASE };

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

let getToken: (() => Promise<string | null>) | null = null;

export function setTokenProvider(fn: () => Promise<string | null>) {
  getToken = fn;
}

type RefreshHandler = () => Promise<boolean> | boolean;

let onUnauthorized: RefreshHandler | null = null;

const AUTH_WHITELIST = [
  "/auth/login",
  "/auth/register",
  "/auth/refresh",
  "/auth/reset-password",
];

export function setUnauthorizedHandler(handler: RefreshHandler | null) {
  onUnauthorized = handler;
}

function isAuthRequest(path: string) {
  return AUTH_WHITELIST.some((route) => path.startsWith(route));
}

async function getHeaders(): Promise<HeadersInit> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (getToken) {
    const token = await getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }
  return headers;
}

function extractErrorMessage(data: unknown, response: Response): string {
  const errorResponse = data as ApiResponse;
  if (
    (errorResponse?.error || errorResponse?.message) &&
    typeof errorResponse.error === "string"
  ) {
    return errorResponse.error;
  }
  if (typeof errorResponse?.message === "string") {
    return errorResponse.message;
  }
  return `Request failed with status ${response.status}`;
}

async function readResponse(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    return response.json();
  }
  return response.text();
}

export async function apiRequest<T = unknown>(
  path: string,
  options: RequestInit = {},
  isRetry = false
): Promise<T> {
  const url = `${API_BASE}${path}`;
  const headers = await getHeaders();
  let response: Response;

  try {
    response = await fetch(url, {
      ...options,
      headers: { ...headers, ...(options.headers as HeadersInit) },
    });
  } catch (err) {
    throw new ApiError(
      "Unable to reach the server. Check your network connection or CORS configuration.",
      0,
      "NETWORK_ERROR"
    );
  }

  const data = await readResponse(response);

  if (
    response.status === 401 &&
    !isRetry &&
    !isAuthRequest(path) &&
    onUnauthorized
  ) {
    const refreshed = await onUnauthorized();
    if (refreshed) {
      return apiRequest<T>(path, options, true);
    }
  }

  if (!response.ok) {
    throw new ApiError(
      extractErrorMessage(data, response),
      response.status,
      (data as ApiResponse)?.error
    );
  }

  return data as T;
}

export async function apiGet<T = unknown>(
  path: string,
  params?: Record<string, string | number | boolean | undefined>
): Promise<T> {
  const query = params
    ? "?" +
      new URLSearchParams(
        Object.entries(params)
          .filter(([, v]) => v !== undefined && v !== "")
          .map(([k, v]) => [k, String(v)])
      ).toString()
    : "";
  return apiRequest<T>(`${path}${query}`);
}

export async function apiPost<T = unknown>(
  path: string,
  body?: unknown
): Promise<T> {
  return apiRequest<T>(path, {
    method: "POST",
    body: body ? JSON.stringify(body) : undefined,
  });
}

export async function apiPut<T = unknown>(
  path: string,
  body?: unknown
): Promise<T> {
  return apiRequest<T>(path, {
    method: "PUT",
    body: body ? JSON.stringify(body) : undefined,
  });
}

export async function apiPatch<T = unknown>(
  path: string,
  body?: unknown
): Promise<T> {
  return apiRequest<T>(path, {
    method: "PATCH",
    body: body ? JSON.stringify(body) : undefined,
  });
}

export async function apiDelete<T = unknown>(path: string): Promise<T> {
  return apiRequest<T>(path, { method: "DELETE" });
}

export function isPaginatedResponse<T>(
  data: unknown
): data is PaginatedResponse<T> {
  return (
    typeof data === "object" &&
    data !== null &&
    "meta" in data &&
    typeof (data as ApiResponse).success === "boolean"
  );
}

export function extractData<T>(response: ApiResponse<T> | T): T {
  if (typeof response === "object" && response !== null && "data" in response) {
    return (response as ApiResponse<T>).data as T;
  }
  return response as T;
}
