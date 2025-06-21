import React, { useState } from "react";
import useAuthStore from "../../stores/authStore";

interface LoginFormProps {
    onSwitchToSignup: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToSignup }) => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const { login, isLoading, error, clearError } = useAuthStore();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Clear error when user starts typing
        if (error) {
            clearError();
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const result = await login(formData.email, formData.password);

        if (result.success) {
            // Redirect will be handled by parent component or router
            console.log("Login successful:", result.user);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <div className="bg-white shadow-lg rounded-lg p-8">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">
                        Welcome Back
                    </h2>
                    <p className="text-gray-600 mt-2">
                        Sign in to your account
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-red-600 text-sm">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter your email"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter your password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <div className="flex items-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Signing in...
                            </div>
                        ) : (
                            "Sign In"
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Don't have an account?{" "}
                        <button
                            onClick={onSwitchToSignup}
                            className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:underline"
                        >
                            Sign up here
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
