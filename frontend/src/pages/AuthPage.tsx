import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/auth/LoginForm";
import SignupForm from "../components/auth/SignupForm";
import useAuthStore from "../stores/authStore";

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const navigate = useNavigate();
    const { isAuthenticated } = useAuthStore();

    useEffect(() => {
        // Redirect if already authenticated
        if (isAuthenticated) {
            navigate("/dashboard");
        }
    }, [isAuthenticated, navigate]);

    const switchToSignup = () => setIsLogin(false);
    const switchToLogin = () => setIsLogin(true);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md">
                {isLogin ? (
                    <LoginForm onSwitchToSignup={switchToSignup} />
                ) : (
                    <SignupForm onSwitchToLogin={switchToLogin} />
                )}
            </div>
        </div>
    );
};

export default AuthPage;
