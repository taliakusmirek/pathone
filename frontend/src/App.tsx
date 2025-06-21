import React, { useEffect } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LandingPage from "./pages/LandingPage";
import EligibilityForm from "./pages/EligibilityForm";
import EligibilityResult from "./pages/EligibilityResult";
import Paywall from "./pages/Paywall";
import DocumentIntake from "./pages/DocumentIntake";
import SecondOpinion from "./pages/SecondOpinion";
import Dashboard from "./pages/Dashboard";
import AuthPage from "./pages/AuthPage";
import useAuthStore from "./stores/authStore";

// Create a client for React Query
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: false,
        },
    },
});

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated } = useAuthStore();

    if (!isAuthenticated) {
        return <Navigate to="/auth" replace />;
    }

    return <>{children}</>;
};

function App() {
    const { initializeAuth } = useAuthStore();

    useEffect(() => {
        // Initialize auth state from localStorage on app start
        initializeAuth();
    }, [initializeAuth]);

    return (
        <QueryClientProvider client={queryClient}>
            <Router>
                <div className="App min-h-screen bg-gray-50">
                    <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/auth" element={<AuthPage />} />
                        <Route
                            path="/eligibility"
                            element={
                                <ProtectedRoute>
                                    <EligibilityForm />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/result"
                            element={
                                <ProtectedRoute>
                                    <EligibilityResult />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/paywall"
                            element={
                                <ProtectedRoute>
                                    <Paywall />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/documents"
                            element={
                                <ProtectedRoute>
                                    <DocumentIntake />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/second-opinion"
                            element={
                                <ProtectedRoute>
                                    <SecondOpinion />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/dashboard"
                            element={
                                <ProtectedRoute>
                                    <Dashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </div>
            </Router>
        </QueryClientProvider>
    );
}

export default App;
