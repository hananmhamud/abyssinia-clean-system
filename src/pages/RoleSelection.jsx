import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logoImg from "../assets/logo.png";

function RoleSelection() {
    const navigate = useNavigate();
    const { user, loading, setUser } = useAuth();

    // =========================================================
    // SECURITY CHECK
    // =========================================================
    useEffect(() => {
        if (loading) return;

        if (!user) {
            navigate("/login", { replace: true });
            return;
        }

        if (user.isAdmin !== true) {
            navigate("/customer-dashboard", { replace: true });
        }
    }, [user, loading, navigate]);

    // =========================================================
    // SELECT ADMIN
    // =========================================================
    const goToAdmin = () => {
        if (!user?.isAdmin) {
            navigate("/customer-dashboard", { replace: true });
            return;
        }

        const updatedUser = {
            ...user,
            role: "admin",
            isAdmin: true,
        };

        localStorage.setItem("user", JSON.stringify(updatedUser));

        if (typeof setUser === "function") {
            setUser(updatedUser);
        }

        navigate("/admin-dashboard", { replace: true });
    };

    // =========================================================
    // SELECT CUSTOMER
    // =========================================================
    const goToCustomer = () => {
        if (!user) {
            navigate("/login", { replace: true });
            return;
        }

        const updatedUser = {
            ...user,
            role: "customer",
            isAdmin: user.isAdmin === true,
        };

        localStorage.setItem("user", JSON.stringify(updatedUser));

        if (typeof setUser === "function") {
            setUser(updatedUser);
        }

        navigate("/customer-dashboard", { replace: true });
    };

    // =========================================================
    // LOADING
    // =========================================================
    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#d9ecea]">
                <div className="text-center">
                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-white/50 border-t-emerald-600" />

                    <p className="mt-5 text-sm font-medium text-gray-600">
                        Checking your account...
                    </p>
                </div>
            </div>
        );
    }

    // =========================================================
    // UNAUTHORIZED USERS
    // =========================================================
    if (!user || user.isAdmin !== true) {
        return null;
    }

    // =========================================================
    // PAGE
    // =========================================================
    return (
        <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#d9ecea] via-[#e5f4f2] to-[#cfe9e5] text-gray-900">

            {/* =====================================================
                BACKGROUND ATMOSPHERE
            ===================================================== */}

            {/* Large soft glow - top left */}
            <div className="pointer-events-none absolute -left-40 -top-40 h-[420px] w-[420px] rounded-full bg-white/50 blur-3xl" />

            {/* Large soft glow - right */}
            <div className="pointer-events-none absolute -right-40 top-20 h-[400px] w-[400px] rounded-full bg-emerald-200/30 blur-3xl" />

            {/* Bottom glow */}
            <div className="pointer-events-none absolute -bottom-48 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-white/40 blur-3xl" />

            {/* =====================================================
                TECHNOLOGY CIRCUIT DECORATION
            ===================================================== */}
            <div className="pointer-events-none absolute inset-0 opacity-30">

                {/* LEFT CIRCUITS */}
                <svg
                    className="absolute left-0 top-16 h-[300px] w-[45%]"
                    viewBox="0 0 500 300"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M0 70H90L125 105H215"
                        stroke="#62aaa4"
                        strokeWidth="1"
                    />

                    <path
                        d="M0 105H55L95 145H190L225 110H315"
                        stroke="#62aaa4"
                        strokeWidth="1"
                    />

                    <path
                        d="M20 165H115L150 130H250L285 95H380"
                        stroke="#62aaa4"
                        strokeWidth="1"
                    />

                    <path
                        d="M5 205H75L115 165H210L245 130H330"
                        stroke="#62aaa4"
                        strokeWidth="1"
                    />

                    <path
                        d="M70 240H155L195 200H300"
                        stroke="#62aaa4"
                        strokeWidth="1"
                    />

                    <circle cx="90" cy="70" r="2" fill="#62aaa4" />
                    <circle cx="55" cy="105" r="2" fill="#62aaa4" />
                    <circle cx="20" cy="165" r="2" fill="#62aaa4" />
                    <circle cx="75" cy="205" r="2" fill="#62aaa4" />
                    <circle cx="155" cy="240" r="2" fill="#62aaa4" />

                    <circle cx="215" cy="105" r="2" fill="#62aaa4" />
                    <circle cx="315" cy="110" r="2" fill="#62aaa4" />
                    <circle cx="380" cy="95" r="2" fill="#62aaa4" />
                </svg>

                {/* RIGHT CIRCUITS */}
                <svg
                    className="absolute right-0 top-16 h-[300px] w-[45%]"
                    viewBox="0 0 500 300"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M500 70H410L375 105H285"
                        stroke="#62aaa4"
                        strokeWidth="1"
                    />

                    <path
                        d="M500 105H445L405 145H310L275 110H185"
                        stroke="#62aaa4"
                        strokeWidth="1"
                    />

                    <path
                        d="M480 165H385L350 130H250L215 95H120"
                        stroke="#62aaa4"
                        strokeWidth="1"
                    />

                    <path
                        d="M495 205H425L385 165H290L255 130H170"
                        stroke="#62aaa4"
                        strokeWidth="1"
                    />

                    <path
                        d="M430 240H345L305 200H200"
                        stroke="#62aaa4"
                        strokeWidth="1"
                    />

                    <circle cx="410" cy="70" r="2" fill="#62aaa4" />
                    <circle cx="445" cy="105" r="2" fill="#62aaa4" />
                    <circle cx="480" cy="165" r="2" fill="#62aaa4" />
                    <circle cx="425" cy="205" r="2" fill="#62aaa4" />
                    <circle cx="345" cy="240" r="2" fill="#62aaa4" />

                    <circle cx="285" cy="105" r="2" fill="#62aaa4" />
                    <circle cx="185" cy="110" r="2" fill="#62aaa4" />
                    <circle cx="120" cy="95" r="2" fill="#62aaa4" />
                </svg>
            </div>

            {/* =====================================================
                LARGE GLASS SPHERE
            ===================================================== */}
            <div className="pointer-events-none absolute left-1/2 top-[48%] h-[430px] w-[430px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/40 bg-white/20 shadow-[inset_0_0_70px_rgba(255,255,255,0.35),0_20px_80px_rgba(91,150,145,0.12)] backdrop-blur-[3px] sm:h-[500px] sm:w-[500px]">

                {/* Inner glow */}
                <div className="absolute inset-8 rounded-full bg-gradient-to-br from-white/25 via-transparent to-emerald-200/20 blur-2xl" />

                {/* Glass reflection */}
                <div className="absolute left-12 top-16 h-16 w-16 rounded-full bg-white/40 blur-md" />

                <div className="absolute left-20 top-28 h-10 w-10 rounded-full bg-white/30 blur-md" />

                <div className="absolute right-16 top-24 h-12 w-12 rounded-full bg-white/40 blur-md" />

            </div>

            {/* =====================================================
                MAIN CONTENT
            ===================================================== */}
            <div className="relative z-10 flex min-h-screen items-center justify-center px-5 py-10 sm:px-8">

                <div className="w-full max-w-4xl">

                    {/* =================================================
                        BRAND HEADER
                    ================================================= */}
                    <div className="text-center">

                        {/* Logo */}
                        <div className="group mx-auto flex h-16 w-full items-center justify-center">

                            <img
                                src={logoImg}
                                alt="Abyssinia Clean Logo"
                                className="h-12 w-auto object-contain bg-transparent mix-blend-multiply scale-110 origin-center transition-transform duration-300 group-hover:scale-115"
                            />

                        </div>

                        {/* Brand Name */}
                        <div className="mt-1 flex items-center justify-center gap-1.5">

                            <span className="text-3xl font-black tracking-tight text-[#10b981]">
                                Abyssinia
                            </span>

                            <span className="text-3xl font-extrabold tracking-tight text-gray-900">
                                Clean
                            </span>

                        </div>

                        {/* =================================================
                            USER INFORMATION
                        ================================================= */}
                        <div className="mt-3">

                            <h1 className="text-xl font-bold tracking-tight text-gray-900">
                                {user.full_name || user.name || "Hanan Mahmud"}
                            </h1>

                            <p className="mt-0.5 text-sm font-medium text-gray-700">
                                {user.email || "hananbereka2025@gmail.com"}
                            </p>

                            <span className="mt-2 inline-block rounded-md border border-emerald-600/20 bg-emerald-600/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-700">
                                ADMIN
                            </span>

                        </div>

                        {/* =================================================
                            WORKSPACE HEADING
                        ================================================= */}
                        <div className="mt-5">

                            <h2 className="text-xl font-black tracking-tight text-gray-900">
                                Select workspace
                            </h2>

                            <p className="mt-0.5 text-sm text-gray-700">
                                Choose the workspace you want to access
                            </p>

                        </div>

                    </div>

                    {/* =================================================
                        WORKSPACE CARDS
                    ================================================= */}
                    <div className="mx-auto mt-6 grid w-full max-w-3xl gap-5 sm:grid-cols-2">

                        {/* =================================================
                            CUSTOMER PORTAL
                        ================================================= */}
                        <button
                            type="button"
                            onClick={goToCustomer}
                            className="group relative flex min-h-[235px] w-full flex-col justify-between overflow-hidden rounded-2xl border border-white/60 bg-white/35 p-5 text-left shadow-[0_12px_35px_rgba(59,130,246,0.12)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-blue-400/50 hover:bg-white/55 hover:shadow-[0_18px_45px_rgba(59,130,246,0.20)] focus:outline-none focus:ring-2 focus:ring-blue-400/30"
                        >

                            {/* Blue glow */}
                            <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-blue-300/20 blur-2xl transition-all duration-500 group-hover:bg-blue-400/30" />

                            {/* Customer icon */}
                            <div className="relative">

                                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-blue-300/50 bg-blue-100/60 text-blue-700 shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-blue-100">

                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.8"
                                        stroke="currentColor"
                                        className="h-6 w-6"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.25a7.5 7.5 0 0 1 15 0"
                                        />
                                    </svg>

                                </div>

                            </div>

                            {/* Customer content */}
                            <div className="relative mt-5">

                                <span className="inline-block rounded-md bg-blue-100/80 px-2 py-1 text-[9px] font-bold uppercase tracking-widest text-blue-800">
                                    Customer
                                </span>

                                <h3 className="mt-2 text-lg font-black tracking-tight text-gray-950 transition-colors duration-300 group-hover:text-blue-800">
                                    Customer Portal
                                </h3>

                                <p className="mt-1.5 text-xs leading-relaxed text-gray-700">
                                    Book cleaning services, track your requests,
                                    manage your addresses, and view your service
                                    history.
                                </p>

                            </div>

                            {/* Customer CTA */}
                            <div className="relative mt-5">

                                <span className="flex w-full items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/20 transition-all duration-300 group-hover:from-blue-700 group-hover:to-blue-600 group-hover:shadow-lg group-hover:shadow-blue-500/30">
                                    Continue to Customer Dashboard
                                    <span className="ml-2 text-sm">
                                        →
                                    </span>
                                </span>

                            </div>

                        </button>

                        {/* =================================================
                            ADMINISTRATIVE COMMAND
                        ================================================= */}
                        <button
                            type="button"
                            onClick={goToAdmin}
                            className="group relative flex min-h-[235px] w-full flex-col justify-between overflow-hidden rounded-2xl border border-white/60 bg-white/35 p-5 text-left shadow-[0_12px_35px_rgba(16,185,129,0.12)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400/60 hover:bg-white/55 hover:shadow-[0_18px_45px_rgba(16,185,129,0.20)] focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                        >

                            {/* Green glow */}
                            <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-emerald-300/20 blur-2xl transition-all duration-500 group-hover:bg-emerald-400/30" />

                            {/* Admin icon */}
                            <div className="relative">

                                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-emerald-300/50 bg-emerald-100/60 text-emerald-700 shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-emerald-100 group-hover:shadow-md group-hover:shadow-emerald-400/20">

                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.8"
                                        stroke="currentColor"
                                        className="h-6 w-6"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M9 12.75 11.25 15 15 9.75M21 12c0 4.97-3.04 9.22-7.36 11-1.05.43-2.23.43-3.28 0C6.04 21.22 3 16.97 3 12V5.25a1.5 1.5 0 0 1 1.5-1.5h15a1.5 1.5 0 0 1 1.5 1.5V12Z"
                                        />
                                    </svg>

                                </div>

                            </div>

                            {/* Admin content */}
                            <div className="relative mt-5">

                                <span className="inline-block rounded-md bg-emerald-100/80 px-2 py-1 text-[9px] font-bold uppercase tracking-widest text-emerald-800">
                                    Admin
                                </span>

                                <h3 className="mt-2 text-lg font-black tracking-tight text-gray-950 transition-colors duration-300 group-hover:text-emerald-800">
                                    Administrative Command
                                </h3>

                                <p className="mt-1.5 text-xs leading-relaxed text-gray-700">
                                    Manage bookings, customers, services,
                                    cleaners, payments, and the entire cleaning
                                    service system.
                                </p>

                            </div>

                            {/* Admin CTA */}
                            <div className="relative mt-5">

                                <span className="flex w-full items-center justify-center rounded-full bg-gradient-to-r from-emerald-600 to-emerald-500 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-500/20 transition-all duration-300 group-hover:from-emerald-700 group-hover:to-emerald-600 group-hover:shadow-lg group-hover:shadow-emerald-500/30">
                                    Continue to Admin Dashboard
                                    <span className="ml-2 text-sm">
                                        →
                                    </span>
                                </span>

                            </div>

                        </button>

                    </div>

                    {/* =================================================
                        FOOTER
                    ================================================= */}
                    <div className="mt-6 text-center">

                        <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-gray-500">
                            Abyssinia Clean
                        </p>

                        <p className="mt-1 text-[9px] text-gray-400">
                            Professional Cleaning Services
                        </p>

                    </div>

                </div>
            </div>
        </div>
    );
}

export default RoleSelection;