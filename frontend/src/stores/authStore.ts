import { create } from "zustand";
import { authAPI } from "../services/api";

interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    createdAt: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

interface AuthActions {
    login: (
        email: string,
        password: string
    ) => Promise<{ success: boolean; user?: User; error?: string }>;
    signup: (
        email: string,
        firstName: string,
        lastName: string,
        password: string
    ) => Promise<{ success: boolean; user?: User; error?: string }>;
    logout: () => void;
    clearError: () => void;
    initializeAuth: () => void;
}

type AuthStore = AuthState & AuthActions;

const useAuthStore = create<AuthStore>((set, get) => ({
    // State
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,

    // Actions
    login: async (email, password) => {
        set({ isLoading: true, error: null });

        try {
            const response = await authAPI.login(email, password);
            const { user, tokens } = response.data;

            // Store tokens
            localStorage.setItem("accessToken", tokens.accessToken);
            localStorage.setItem("refreshToken", tokens.refreshToken);

            set({
                user,
                isAuthenticated: true,
                isLoading: false,
                error: null,
            });

            return { success: true, user };
        } catch (error: any) {
            const errorMessage = error.response?.data?.error || "Login failed";
            set({
                isLoading: false,
                error: errorMessage,
            });
            return { success: false, error: errorMessage };
        }
    },

    signup: async (email, firstName, lastName, password) => {
        set({ isLoading: true, error: null });

        try {
            const response = await authAPI.signup(
                email,
                firstName,
                lastName,
                password
            );
            const { user, tokens } = response.data;

            // Store tokens
            localStorage.setItem("accessToken", tokens.accessToken);
            localStorage.setItem("refreshToken", tokens.refreshToken);

            set({
                user,
                isAuthenticated: true,
                isLoading: false,
                error: null,
            });

            return { success: true, user };
        } catch (error: any) {
            const errorMessage = error.response?.data?.error || "Signup failed";
            set({
                isLoading: false,
                error: errorMessage,
            });
            return { success: false, error: errorMessage };
        }
    },

    logout: () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
        });
    },

    clearError: () => {
        set({ error: null });
    },

    // Initialize auth state from localStorage
    initializeAuth: () => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            try {
                // Decode JWT token to extract user info (without verifying signature)
                const base64Url = token.split(".")[1];
                const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
                const jsonPayload = decodeURIComponent(
                    atob(base64)
                        .split("")
                        .map(
                            (c) =>
                                "%" +
                                ("00" + c.charCodeAt(0).toString(16)).slice(-2)
                        )
                        .join("")
                );

                const payload = JSON.parse(jsonPayload);

                // Check if token is expired
                if (payload.exp && payload.exp < Date.now() / 1000) {
                    // Token expired, remove it
                    localStorage.removeItem("accessToken");
                    localStorage.removeItem("refreshToken");
                    return;
                }

                // Set user info from token
                const user = {
                    id: payload.userId || payload.id,
                    email: payload.email,
                    firstName: payload.firstName || "User",
                    lastName: payload.lastName || "",
                    createdAt: new Date().toISOString(), // Fallback
                };

                set({
                    isAuthenticated: true,
                    user: user,
                });
            } catch (error) {
                console.error("Invalid token:", error);
                // Invalid token, remove it
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
            }
        }
    },
}));

export default useAuthStore;
