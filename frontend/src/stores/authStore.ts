import { create } from "zustand";
import { authAPI } from "../services/api";

interface User {
    id: number;
    email: string;
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

    signup: async (email, password) => {
        set({ isLoading: true, error: null });

        try {
            const response = await authAPI.signup(email, password);
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
            // TODO: Verify token with backend or decode to get user info
            set({ isAuthenticated: true });
        }
    },
}));

export default useAuthStore;
