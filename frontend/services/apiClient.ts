/// <reference types="vite/client" />
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem("token");
    const headers = new Headers(options.headers || {});
    
    if (token) {
        headers.set("Authorization", `Bearer ${token}`);
    }
    
    // Default to JSON if not specified and body exists and is not FormData
    if (options.body && typeof options.body === "string" && !headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers
    });
    
    if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("agriSenseAuth");
        window.location.href = "/";
    }
    
    return response;
}

export const apiClient = {
    get: async (endpoint: string) => {
        const response = await fetchWithAuth(endpoint, { method: "GET" });
        return response.json();
    },
    post: async (endpoint: string, body: any, customHeaders = {}) => {
        const response = await fetchWithAuth(endpoint, {
            method: "POST",
            headers: customHeaders,
            body: typeof body === "string" ? body : JSON.stringify(body)
        });
        return response.json();
    },
    put: async (endpoint: string, body: any) => {
        const response = await fetchWithAuth(endpoint, {
            method: "PUT",
            body: JSON.stringify(body)
        });
        return response.json();
    },
    delete: async (endpoint: string) => {
        const response = await fetchWithAuth(endpoint, {
            method: "DELETE"
        });
        return response.json();
    }
};
