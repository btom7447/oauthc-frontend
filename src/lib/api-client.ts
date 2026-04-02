const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

// ─── Token storage ───────────────────────────────────────────────────────────

const TOKEN_KEY = "oauthc_token";
const REFRESH_KEY = "oauthc_refresh_token";

export const tokens = {
  getAccess: () => (typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null),
  getRefresh: () => (typeof window !== "undefined" ? localStorage.getItem(REFRESH_KEY) : null),
  set: (access: string, refresh: string) => {
    localStorage.setItem(TOKEN_KEY, access);
    localStorage.setItem(REFRESH_KEY, refresh);
  },
  clear: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};

// ─── Types ───────────────────────────────────────────────────────────────────

type ApiOptions = {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
  auth?: boolean; // default true for non-public routes
};

type ApiResponse<T = unknown> = {
  ok: boolean;
  status: number;
  data?: T;
  meta?: { total: number; page: number; limit: number; totalPages: number; unreadCount?: number };
  error?: string;
};

// ─── Refresh logic ───────────────────────────────────────────────────────────

let refreshPromise: Promise<boolean> | null = null;

async function refreshAccessToken(): Promise<boolean> {
  const refreshToken = tokens.getRefresh();
  if (!refreshToken) return false;

  try {
    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) {
      tokens.clear();
      return false;
    }

    const json = await res.json();
    tokens.set(json.data.token, json.data.refreshToken);
    return true;
  } catch {
    tokens.clear();
    return false;
  }
}

// ─── Core fetch ──────────────────────────────────────────────────────────────

async function request<T = unknown>(endpoint: string, options: ApiOptions = {}): Promise<ApiResponse<T>> {
  const { method = "GET", body, headers = {}, auth = true } = options;

  const buildHeaders = (): Record<string, string> => {
    const h: Record<string, string> = { "Content-Type": "application/json", ...headers };
    if (auth) {
      const token = tokens.getAccess();
      if (token) h["Authorization"] = `Bearer ${token}`;
    }
    return h;
  };

  const doFetch = async (): Promise<Response> => {
    return fetch(`${BASE_URL}${endpoint}`, {
      method,
      headers: buildHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });
  };

  let res = await doFetch();

  // If 401 and we have a refresh token, try refreshing once
  if (res.status === 401 && auth && tokens.getRefresh()) {
    // Deduplicate concurrent refresh attempts
    if (!refreshPromise) {
      refreshPromise = refreshAccessToken().finally(() => { refreshPromise = null; });
    }
    const refreshed = await refreshPromise;

    if (refreshed) {
      res = await doFetch();
    } else {
      // Refresh failed — force logout
      tokens.clear();
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("auth:logout"));
      }
      return { ok: false, status: 401, error: "Session expired. Please log in again." };
    }
  }

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    return { ok: false, status: res.status, error: json.error || "Something went wrong" };
  }

  return { ok: true, status: res.status, data: json.data, meta: json.meta };
}

// ─── Public API ──────────────────────────────────────────────────────────────

export const api = {
  get: <T = unknown>(endpoint: string, opts?: Omit<ApiOptions, "method" | "body">) =>
    request<T>(endpoint, { ...opts, method: "GET" }),

  post: <T = unknown>(endpoint: string, body?: unknown, opts?: Omit<ApiOptions, "method" | "body">) =>
    request<T>(endpoint, { ...opts, method: "POST", body }),

  patch: <T = unknown>(endpoint: string, body?: unknown, opts?: Omit<ApiOptions, "method" | "body">) =>
    request<T>(endpoint, { ...opts, method: "PATCH", body }),

  put: <T = unknown>(endpoint: string, body?: unknown, opts?: Omit<ApiOptions, "method" | "body">) =>
    request<T>(endpoint, { ...opts, method: "PUT", body }),

  del: <T = unknown>(endpoint: string, opts?: Omit<ApiOptions, "method" | "body">) =>
    request<T>(endpoint, { ...opts, method: "DELETE" }),
};
