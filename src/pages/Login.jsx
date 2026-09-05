import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import logoImg from "../assets/logo.png";

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const googleButtonRef = useRef(null);
    const googleInitialized = useRef(false);

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [googleReady, setGoogleReady] = useState(false);
    const [error, setError] = useState("");

    // Google Client ID
    const GOOGLE_CLIENT_ID =
        "859047448532-554o4hnr48huk24q367eakb7a7knlb4i.apps.googleusercontent.com";

    // ============================================================
    // INPUT CHANGE
    // ============================================================

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    // ============================================================
    // REDIRECT AFTER LOGIN
    // ============================================================

    const redirectAfterLogin = (user) => {
        if (user?.isAdmin === true) {
            navigate("/role-selection");
        } else {
            navigate("/customer-dashboard");
        }
    };

    // ============================================================
    // NORMAL EMAIL/PASSWORD LOGIN
    // ============================================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await axios.post(
                "http://localhost:5000/api/auth/login",
                {
                    email: formData.email,
                    password: formData.password,
                }
            );

            if (response.data?.token && response.data?.user) {
                login(
                    response.data.token,
                    response.data.user
                );

                redirectAfterLogin(response.data.user);
            } else {
                throw new Error(
                    "Invalid login response from server."
                );
            }
        } catch (err) {
            console.error("LOGIN ERROR:", err);

            const message =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                err?.message ||
                "Server error during login.";

            setError(message);
        } finally {
            setLoading(false);
        }
    };

    // ============================================================
    // GOOGLE LOGIN
    // ============================================================

    const handleGoogleResponse = async (credentialResponse) => {
        setError("");
        setGoogleLoading(true);

        try {
            // Make sure Google actually returned a credential
            if (!credentialResponse?.credential) {
                throw new Error(
                    "Google did not return a credential."
                );
            }

            console.log("Google credential received.");

            // IMPORTANT:
            // Send the ORIGINAL Google credential to the backend.
            //
            // Do NOT decode the credential in the browser.
            // The backend will verify it securely with Google.

            const response = await axios.post(
                "http://localhost:5000/api/auth/google",
                {
                    credential: credentialResponse.credential,
                }
            );

            // Check backend response
            if (
                response.data?.token &&
                response.data?.user
            ) {
                console.log(
                    "Google login successful:",
                    response.data.user
                );

                // Save JWT + user information
                login(
                    response.data.token,
                    response.data.user
                );

                // Redirect according to user's privileges
                redirectAfterLogin(
                    response.data.user
                );
            } else {
                throw new Error(
                    "Invalid Google login response from server."
                );
            }
        } catch (err) {
            console.error(
                "GOOGLE LOGIN ERROR:",
                err
            );

            const message =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                err?.message ||
                "Google login failed.";

            setError(message);
        } finally {
            setGoogleLoading(false);
        }
    };

    // ============================================================
    // INITIALIZE GOOGLE SIGN-IN
    // ============================================================

    useEffect(() => {
        let intervalId;
        let attempts = 0;

        const MAX_ATTEMPTS = 30;

        const initializeGoogle = () => {
            // Already initialized
            if (googleInitialized.current) {
                return true;
            }

            // Google library not loaded yet
            if (
                typeof window === "undefined" ||
                !window.google ||
                !window.google.accounts ||
                !window.google.accounts.id
            ) {
                return false;
            }

            // Google button container not ready
            if (!googleButtonRef.current) {
                return false;
            }

            try {
                // Initialize Google Identity Services
                window.google.accounts.id.initialize({
                    client_id: GOOGLE_CLIENT_ID,

                    callback: handleGoogleResponse,

                    auto_select: false,

                    cancel_on_tap_outside: true,
                });

                // Clear old button if necessary
                googleButtonRef.current.innerHTML = "";

                // Render Google button
                window.google.accounts.id.renderButton(
                    googleButtonRef.current,
                    {
                        theme: "outline",
                        size: "large",
                        text: "signin_with",
                        width: "100%",
                    }
                );

                googleInitialized.current = true;

                setGoogleReady(true);

                console.log(
                    "Google Sign-In initialized successfully."
                );

                return true;
            } catch (initErr) {
                console.error(
                    "Google Init Error:",
                    initErr
                );

                return false;
            }
        };

        // Try immediately
        if (!initializeGoogle()) {
            // If Google script has not loaded yet,
            // keep checking every 500ms.
            intervalId = setInterval(() => {
                attempts += 1;

                const isReady =
                    initializeGoogle();

                if (
                    isReady ||
                    attempts >= MAX_ATTEMPTS
                ) {
                    clearInterval(intervalId);

                    if (
                        !isReady &&
                        !googleInitialized.current
                    ) {
                        setError(
                            "Google Sign-In could not be loaded. Please refresh the page."
                        );
                    }
                }
            }, 500);
        }

        // Cleanup
        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, []);

    // ============================================================
    // UI
    // ============================================================

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">

            <div className="w-full max-w-md">

                {/* =================================================
                    LOGIN CARD
                ================================================== */}

                <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 px-6 py-8 sm:px-8">

                    {/* =================================================
                        LOGO + BRAND
                    ================================================== */}

                    <div className="flex flex-col items-center justify-center mb-6">

                        <img
                            src={logoImg}
                            alt="Abyssinia Clean Logo"
                            className="h-16 w-auto object-contain bg-transparent"
                        />

                        <h1 className="mt-2 text-xl font-bold">
                            <span className="text-green-600">
                                Abyssinia
                            </span>{" "}
                            <span className="text-black">
                                Clean
                            </span>
                        </h1>

                        <p className="mt-2 text-sm text-gray-500">
                            Welcome back
                        </p>
                    </div>

                    {/* =================================================
                        ERROR MESSAGE
                    ================================================== */}

                    {error && (
                        <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    {/* =================================================
                        LOGIN FORM
                    ================================================== */}

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-6"
                    >

                        {/* Email */}

                        <div>

                            <label
                                htmlFor="email"
                                className="mb-2 block text-sm font-semibold text-gray-600"
                            >
                                Email Address
                            </label>

                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                autoComplete="email"
                                placeholder="you@example.com"
                                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3.5 text-gray-900 placeholder-gray-400 outline-none transition-all duration-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                            />

                        </div>

                        {/* Password */}

                        <div>

                            <label
                                htmlFor="password"
                                className="mb-2 block text-sm font-semibold text-gray-600"
                            >
                                Password
                            </label>

                            <input
                                id="password"
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                autoComplete="current-password"
                                placeholder="Enter your password"
                                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3.5 text-gray-900 placeholder-gray-400 outline-none transition-all duration-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                            />

                        </div>

                        {/* Sign In */}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-2xl bg-emerald-600 py-3.5 font-bold text-white shadow-lg shadow-emerald-600/10 transition-all duration-300 hover:bg-emerald-700 hover:shadow-emerald-600/20 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading
                                ? "Signing In..."
                                : "Sign In"}
                        </button>

                    </form>

                    {/* =================================================
                        DIVIDER
                    ================================================== */}

                    <div className="my-7 flex items-center gap-4">

                        <div className="h-px flex-1 bg-gray-200"></div>

                        <span className="text-xs font-semibold text-gray-400">
                            OR
                        </span>

                        <div className="h-px flex-1 bg-gray-200"></div>

                    </div>

                    {/* =================================================
                        GOOGLE LOGIN
                    ================================================== */}

                    <div className="space-y-3">

                        <div
                            ref={googleButtonRef}
                            className="flex min-h-[44px] w-full justify-center"
                        ></div>

                        {(googleLoading ||
                            !googleReady) && (
                            <p className="text-center text-xs font-medium text-gray-500">
                                {googleLoading
                                    ? "Signing in with Google..."
                                    : "Loading Google Sign-In..."}
                            </p>
                        )}

                    </div>

                    {/* =================================================
                        REGISTER LINK
                    ================================================== */}

                    <p className="mt-7 text-center text-sm text-gray-500">

                        Don't have an account?{" "}

                        <Link
                            to="/register"
                            className="font-bold text-emerald-600 transition-colors duration-200 hover:text-emerald-700"
                        >
                            Create one
                        </Link>

                    </p>

                </div>

                {/* =================================================
                    FOOTER
                ================================================== */}

                <p className="mt-6 text-center text-xs text-gray-400">
                    © 2026 Abyssinia Clean. All rights reserved.
                </p>

            </div>

        </div>
    );
}

export default Login;