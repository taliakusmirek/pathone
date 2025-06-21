import axios, { AxiosResponse } from "axios";

// API Response types
interface User {
    id: number;
    email: string;
    createdAt: string;
}

interface AuthTokens {
    accessToken: string;
    refreshToken: string;
    expiresIn: string;
}

interface AuthResponse {
    message: string;
    user: User;
    tokens: AuthTokens;
}

interface RefreshResponse {
    message: string;
    tokens: AuthTokens;
}

const API_BASE_URL =
    process.env.REACT_APP_API_URL || "http://localhost:4000/api";

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem("refreshToken");
                if (refreshToken) {
                    const response = await api.post("/auth/refresh", {
                        refreshToken,
                    });

                    const { accessToken, refreshToken: newRefreshToken } =
                        response.data.tokens;

                    localStorage.setItem("accessToken", accessToken);
                    localStorage.setItem("refreshToken", newRefreshToken);

                    // Retry original request with new token
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    return api(originalRequest);
                }
            } catch (refreshError) {
                // Refresh failed, redirect to login
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
);

// Auth API methods
export const authAPI = {
    signup: (
        email: string,
        password: string
    ): Promise<AxiosResponse<AuthResponse>> =>
        api.post("/auth/signup", { email, password }),

    login: (
        email: string,
        password: string
    ): Promise<AxiosResponse<AuthResponse>> =>
        api.post("/auth/login", { email, password }),

    refresh: (refreshToken: string): Promise<AxiosResponse<RefreshResponse>> =>
        api.post("/auth/refresh", { refreshToken }),

    me: (): Promise<AxiosResponse<{ user: User }>> => api.get("/auth/me"),
};

export default api;
