import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import axios, { AxiosError } from "axios";
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

// Sui client (keeping existing functionality)
const client = new SuiClient({ url: getFullnodeUrl("testnet") });

export async function fetchSharedObject(objectId: string) {
  const obj = await client.getObject({
    id: objectId,
    options: {
      showContent: true,
      showType: true,
      showOwner: true,
      showPreviousTransaction: true,
      showStorageRebate: true,
      showDisplay: true,
    },
  });
  return obj;
}

// ==================== API Middleware Setup ====================

const BASE_URL = "http://127.0.0.1:8100/api";

// Create axios instance with base configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Response interceptor - handle errors globally
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    // Handle common error cases
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const data = error.response.data as { message?: string };

      switch (status) {
        case 401:
          // Unauthorized - redirecting to login page
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
          break;
        case 403:
          // Forbidden
          console.error("Access forbidden");
          break;
        case 404:
          // Not found
          console.error("Resource not found");
          break;
        case 500:
          // Server error
          console.error("Server error");
          break;
        default:
          console.error("API Error:", data?.message || error.message);
      }
    } else if (error.request) {
      // Request made but no response received
      console.error("Network error - no response received");
    } else {
      // Something else happened
      console.error("Error:", error.message);
    }

    return Promise.reject(error);
  }
);

// ==================== API Helper Functions ====================

/**
 * Generic GET request
 */
export async function apiGet<T = unknown>(
  endpoint: string,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await apiClient.get<T>(endpoint, config);
  return response.data;
}

/**
 * Generic POST request
 */
export async function apiPost<T = unknown>(
  endpoint: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await apiClient.post<T>(endpoint, data, config);
  return response.data;
}

/**
 * Generic PUT request
 */
export async function apiPut<T = unknown>(
  endpoint: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await apiClient.put<T>(endpoint, data, config);
  return response.data;
}

/**
 * Generic PATCH request
 */
export async function apiPatch<T = unknown>(
  endpoint: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await apiClient.patch<T>(endpoint, data, config);
  return response.data;
}

/**
 * Generic DELETE request
 */
export async function apiDelete<T = unknown>(
  endpoint: string,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await apiClient.delete<T>(endpoint, config);
  return response.data;
}

// Export the axios instance for advanced use cases
export { apiClient };

// Export types for use in components
export type ApiError = AxiosError;
export type ApiResponse<T> = AxiosResponse<T>;
