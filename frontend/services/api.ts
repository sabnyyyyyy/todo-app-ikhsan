export const API_BASE_URL = "https://dummyjson.com";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface ApiClientOptions extends RequestInit {
  // Lama cache (detik) di server Next.js. false = cache selamanya, 0 = tanpa cache.
  revalidate?: number | false;
}

export async function apiClient<T>(
  endpoint: string,
  { revalidate, headers, ...init }: ApiClientOptions = {},
): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...init,
      headers: { "Content-Type": "application/json", ...headers },
      ...(revalidate !== undefined && { next: { revalidate } }),
    });
  } catch (error) {
    console.error(`Network error saat mengakses ${endpoint}`, error);
    throw new ApiError("Tidak dapat terhubung ke server API.", 503);
  }

  if (!response.ok) {
    throw new ApiError(
      `Request ke ${endpoint} gagal (${response.status} ${response.statusText})`,
      response.status,
    );
  }

  return (await response.json()) as T;
}
