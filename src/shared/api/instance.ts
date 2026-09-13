export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

function extractErrorMessage(body: string, status: number): string {
  if (!body) return `Ошибка запроса (${status})`;
  try {
    const parsed = JSON.parse(body) as { error?: unknown };
    if (Array.isArray(parsed.error)) {
      const messages = parsed.error
        .map((issue) => (issue as { message?: string } | null)?.message)
        .filter((m): m is string => Boolean(m));
      if (messages.length) return messages.join(" ");
    }
    if (typeof parsed.error === "string" && parsed.error) return parsed.error;
  } catch {
    // не JSON — используем raw-текст
  }
  return body;
}

export async function fetcher<T, TQuery extends object = object>(
  input: string,
  init?: RequestInit & { query?: TQuery },
): Promise<T> {
  const url = new URL(input, window.location.origin);
  for (const [k, v] of Object.entries(init?.query ?? {})) {
    if (v !== undefined) url.searchParams.set(k, String(v));
  }

  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new ApiError(res.status, extractErrorMessage(body, res.status));
  }
  return res.json() as T;
}