
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Register() {
    const navigate = useNavigate();
    const { register } = useAuth();

    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        phone: "",
        password: "",
        address: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const result = await register(formData);

            if (result?.user?.isAdmin === true) {
                navigate("/select-role");
            } else {
                navigate("/customer-dashboard");
            }
        } catch (err) {
            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Registration failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 px-5 py-12">
            <div className="mx-auto max-w-md">

                {/* LOGO */}
                <div className="mb-8 text-center">
                    <Link
                        to="/"
                        className="text-3xl font-black tracking-tight"
                    >
                        <span className="text-blue-600">
                            Abyssinia
                        </span>{" "}
                        <span className="text-gray-950">
                            Clean
                        </span>
                    </Link>

                    <h1 className="mt-8 text-3xl font-black text-gray-950">
                        Create your account
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Join Abyssinia Clean today.
                    </p>
                </div>

                {/* FORM */}
                <div className="rounded-3xl border border-gray-100 bg-white p-7 shadow-xl">

                    {error && (
                        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                            {error}
                        </div>
                    )}

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >

                        {/* FULL NAME */}
                        <div>
                            <label className="mb-2 block text-sm font-bold text-gray-700">
                                Full Name
                            </label>

                            <input
                                type="text"
                                name="full_name"
                                value={formData.full_name}
                                onChange={handleChange}
                                required
                                placeholder="Your full name"
                                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        {/* EMAIL */}
                        <div>
                            <label className="mb-2 block text-sm font-bold text-gray-700">
                                Email Address
                            </label>

                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="you@example.com"
                                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        {/* PHONE */}
                        <div>
                            <label className="mb-2 block text-sm font-bold text-gray-700">
                                Phone Number
                            </label>

                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="09xxxxxxxx"
                                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        {/* ADDRESS */}
                        <div>
                            <label className="mb-2 block text-sm font-bold text-gray-700">
                                Address
                            </label>

                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Your address"
                                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        {/* PASSWORD */}
                        <div>
                            <label className="mb-2 block text-sm font-bold text-gray-700">
                                Password
                            </label>

                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                minLength={6}
                                placeholder="Create a password"
                                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        {/* SUBMIT */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-xl bg-blue-600 px-5 py-3.5 font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading
                                ? "Creating Account..."
                                : "Create Account"}
                        </button>
                    </form>

                    {/* LOGIN LINK */}
                    <div className="mt-6 text-center text-sm text-gray-500">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="font-bold text-blue-600 hover:text-blue-700"
                        >
                            Sign in
                        </Link>
                    </div>

                    {/* BACK HOME */}
                    <div className="mt-4 text-center">
                        <Link
                            to="/"
                            className="text-sm font-semibold text-gray-500 hover:text-blue-600"
                        >
                            ← Back to home
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Register;

