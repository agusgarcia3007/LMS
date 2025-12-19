export function createRequest(
  path: string,
  options?: RequestInit & { headers?: Record<string, string> }
): Request {
  const url = `http://localhost${path}`;
  return new Request(url, options);
}

export function jsonRequest(
  path: string,
  body: object,
  options?: { method?: string; headers?: Record<string, string> }
): Request {
  return createRequest(path, {
    method: options?.method || "POST",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    body: JSON.stringify(body),
  });
}

export function getRequest(
  path: string,
  headers?: Record<string, string>
): Request {
  return createRequest(path, {
    method: "GET",
    headers,
  });
}

export async function parseJsonResponse<T = any>(response: Response): Promise<T> {
  return response.json() as Promise<T>;
}
