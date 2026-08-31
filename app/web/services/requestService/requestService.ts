// Copyright (c) 2026-02-16
// Contabilidade H. Alvarenga LTDA
// Developed by Adriano Trentin Jr.
// All rights reserved.

import { decrypt, encrypt } from "@/app/web/lib/encrypt";
import { appConfig } from "../../config/appConfig";
import { deobfuscateKey } from "../../utils/obfuscate";
import { toQuery } from "../../utils/parseQueryParams";

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
    let body: BodyInit | undefined;
    let headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (options.body instanceof FormData) {
      const formData = options.body;

      const payload = formData.get("payload");

      if (typeof payload !== "string") {
        throw new Error("Payload ausente no FormData");
      }

      const encryptedPayload = encrypt(JSON.parse(payload));

      const multipartData = new FormData();

      multipartData.append("payload", JSON.stringify(encryptedPayload));

      const file = formData.get("file");

      if (file instanceof File) {
        multipartData.append("file", file);
      }

      body = multipartData;

      // Não definir Content-Type manualmente.
      headers = {};
    } else {
      const encryptedPayload = options.body ? encrypt(options.body) : null;

      body = encryptedPayload
        ? JSON.stringify({
            payload: encryptedPayload,
          })
        : undefined;
    }

    const response = await fetch(`${this.baseUrl}${url}`, {
      method: options.method,
      headers,
      body,
    });

    const text = await response.text();
    const data = text ? JSON.parse(text) : undefined;

    if (!response.ok) {
      throw new Error(data?.error || `Erro na requisição: ${response.status}`);
    }

    if (data?.payload) {
      return decrypt(data.payload) as TResponse;
    }

    return data as TResponse;
  }

  getAll<TBody, TResponse>(url: string, filters?: TBody) {
    const query = toQuery(filters ?? {});

    const fullUrl = query ? `${url}?${query}` : url;

    return this.request<TResponse>(fullUrl, { method: "GET" });
  }

  getById<TResponse>(url: string, id: string) {
    return this.request<TResponse>(`${url}/${id}`, { method: "GET" });
  }

  get<TResponse>(url: string) {
    return this.request<TResponse>(`${url}`, { method: "GET" });
  }

  getByFilters<TBody, TResponse>(url: string, filters: TBody) {
    const query = filters ? `?${new URLSearchParams(filters).toString()}` : "";
    return this.request<TResponse>(`${url}`, { method: "GET" });
  }

  post<TBody, TResponse>(url: string, data?: TBody) {
    return this.request<TResponse>(url, { method: "POST", body: data });
  }

  update<TBody, TResponse>(url: string, data: TBody) {
    return this.request<TResponse>(`${url}`, {
      method: "PUT",
      body: data,
    });
  }

  patch<TBody, TResponse>(url: string, data: TBody) {
    return this.request<TResponse>(`${url}`, {
      method: "PATCH",
      body: data,
    });
  }

  delete<TResponse>(url: string, id: string) {
    return this.request<TResponse>(`${url}`, {
      method: "DELETE",
      body: { id },
    });
  }
}

export const requestService = new RequestService();
