import { encrypt } from "@/app/web/lib/encrypt";

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface RequestOptions {
  method: HttpMethod;
  body?: unknown;
  params?: Record<string, any>;
}

class RequestService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.API_URL ?? '';
  }

  private async request<T>(
    url: string,
    options: RequestOptions
  ): Promise<T> {
    const encryptedPayload = options.body
      ? encrypt(options.body)
      : null;

    const response = await fetch(`${this.baseUrl}${url}`, {
      method: options.method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: encryptedPayload
        ? JSON.stringify({ payload: encryptedPayload })
        : undefined,
    });

    if (!response.ok) {
      throw new Error('Erro na requisição');
    }

    return response.json();
  }

  getAll<T>(url: string, filters?: Record<string, any>) {
    const query = filters
      ? `?${new URLSearchParams(filters).toString()}`
      : '';

    return this.request<T>(`${url}${query}`, {
      method: 'GET',
      params: filters,
    });
  }

  getById<T>(url: string, id: string) {
    return this.request<T>(`${url}${id}`, {
      method: 'GET',
    });
  }

  create<T>(url: string, data: T) {
    return this.request<T>(url, {
      method: 'POST',
      body: data,
    });
  }

  update<T>(url: string, id: string, data: T) {
    return this.request<T>(`${url}/${id}`, {
      method: 'PUT',
      body: data,
    });
  }

  patch<T>(url: string, id: string, data: T) {
    return this.request<T>(`${url}/${id}`, {
      method: 'PATCH',
      body: data,
    });
  }

  delete<T>(url: string, id: string) {
    return this.request<T>(`${url}/${id}`, {
      method: 'DELETE',
    });
  }
}

export const requestService = new RequestService();
