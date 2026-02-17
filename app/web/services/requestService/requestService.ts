// Copyright (c) 2026-02-16
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { decrypt, encrypt } from "@/app/web/lib/encrypt";
import { appConfig } from "../../config/appConfig";
import { deobfuscateKey } from "../../utils/obfuscate";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface RequestOptions {
  method: HttpMethod;
  body?: unknown;
  params?: Record<string, any>;
}

class RequestService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = deobfuscateKey(appConfig.API);
  }

  private async request<TResponse>(
    url: string,
    options: RequestOptions,
  ): Promise<TResponse> {
    const encryptedPayload = options.body ? encrypt(options.body) : null;

    const response = await fetch(`${this.baseUrl}${url}`, {
      method: options.method,
      headers: {
        "Content-Type": "application/json",
      },
      body: encryptedPayload
        ? JSON.stringify({ payload: encryptedPayload })
        : undefined,
    });

    const data = await response.json();

    if (!response.ok)
      throw new Error(data.error || `Erro na requisição: ${response.status}`);

    if (data?.payload) return decrypt(data.payload) as TResponse;

    return data as TResponse;
  }

  getAll<TResponse>(url: string, filters?: Record<string, any>) {
    const query = filters ? `?${new URLSearchParams(filters).toString()}` : "";
    return this.request<TResponse>(`${url}${query}`, { method: "GET" });
  }

  getById<TResponse>(url: string, id: string) {
    return this.request<TResponse>(`${url}/${id}`, { method: "GET" });
  }

  post<TBody, TResponse>(url: string, data: TBody) {
    return this.request<TResponse>(url, { method: "POST", body: data });
  }

  update<TBody, TResponse>(url: string, id: string, data: TBody) {
    return this.request<TResponse>(`${url}/${id}`, {
      method: "PUT",
      body: data,
    });
  }

  patch<TBody, TResponse>(url: string, id: string, data: TBody) {
    return this.request<TResponse>(`${url}/${id}`, {
      method: "PATCH",
      body: data,
    });
  }

  delete<TResponse>(url: string, id: string) {
    return this.request<TResponse>(`${url}/${id}`, { method: "DELETE" });
  }
}

export const requestService = new RequestService();
