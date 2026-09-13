export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
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
  if (!res.ok) throw new ApiError(res.status, await res.text());
  return res.json() as T;
}
