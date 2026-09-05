import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import CustomerDashboard from "./pages/CustomerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import SelectRole from "./pages/SelectRole";
import RoleSelection from "./pages/RoleSelection";

import logoImg from "./assets/logo.png";

import heroCleaning from "./assets/hero-cleaning.jpg";
import homeCleaning from "./assets/home-cleaning.jpg";
import officeCleaning from "./assets/office-cleaning.jpg";
import carpetCleaning from "./assets/carpet-cleaning.jpg";
import windowCleaning from "./assets/window-cleaning.jpg";

import selam from "./assets/selam.png";
import dawit from "./assets/dawit.png";
import lidya from "./assets/lidya.png";

/* =========================================================
   INLINE SVG ICONS
========================================================= */

const PhoneIcon = () => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-5 w-5"
        aria-hidden="true"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 6.75c0 8.284 6.716 14 14 14h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.967-.852-1.093l-4.423-1.106a1.125 1.125 0 0 0-1.173.417l-.97 1.182a1.125 1.125 0 0 1-1.21.35 12.035 12.035 0 0 1-7.577-7.577 1.125 1.125 0 0 1 .35-1.21l1.182-.97c.354-.29.51-.763.417-1.173L6.409 2.602A1.125 1.125 0 0 0 5.316 1.75H3.75A2.25 2.25 0 0 0 1.5 4v2.75h.75Z"
        />
    </svg>
);

const EmailIcon = () => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-5 w-5"
        aria-hidden="true"
    >
        <rect
            width="19.5"
            height="15.5"
            x="2.25"
            y="4.25"
            rx="2"
        />
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m3 6 7.77 5.828a2 2 0 0 0 2.46 0L21 6"
        />
    </svg>
);

const LocationIcon = () => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-5 w-5"
        aria-hidden="true"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
        />
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
        />
    </svg>
);

/* =========================================================
   SOCIAL SVG ICONS
========================================================= */

const TelegramIcon = () => (
    <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-5 w-5"
        aria-hidden="true"
    >
        <path d="M21.9 4.2 18.6 20c-.25 1.12-.91 1.4-1.84.87l-5.08-3.74-2.45 2.36c-.27.27-.5.5-1.02.5l.36-5.17 9.42-8.51c.41-.36-.09-.56-.64-.2L5.69 13.65.67 12.08c-1.09-.34-1.11-1.09.23-1.59L20.53 2.9c.92-.34 1.72.22 1.37 1.3Z" />
    </svg>
);

const FacebookIcon = () => (
    <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-5 w-5"
        aria-hidden="true"
    >
        <path d="M13.5 22v-8h2.75l.5-3h-3.25V9.05c0-.87.24-1.47 1.5-1.47h1.6V4.9c-.28-.04-1.24-.12-2.36-.12-2.34 0-3.94 1.43-3.94 4.05V11H7.65v3h2.65v8h3.2Z" />
    </svg>
);

const InstagramIcon = () => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-5 w-5"
        aria-hidden="true"
    >
        <rect
            width="18"
            height="18"
            x="3"
            y="3"
            rx="5"
        />
        <circle
            cx="12"
            cy="12"
            r="4"
        />
        <circle
            cx="17.5"
            cy="6.5"
            r="1"
            fill="currentColor"
            stroke="none"
        />
    </svg>
);

const LinkedInIcon = () => (
    <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-5 w-5"
        aria-hidden="true"
    >
        <path d="M6.5 8.25A1.75 1.75 0 1 1 6.5 4.75a1.75 1.75 0 0 1 0 3.5ZM5 9.75h3v9.5H5v-9.5Zm4.75 0h2.88v1.3h.04c.4-.75 1.38-1.55 2.84-1.55 3.04 0 3.6 2 3.6 4.6v5.15h-3v-4.57c0-1.09-.02-2.5-1.53-2.5-1.53 0-1.76 1.2-1.76 2.42v4.65h-3v-9.5Z" />
    </svg>
);

/* =========================================================
   CONTACT DATA
========================================================= */

const contactDetails = [
    {
        title: "Phone Hotline",
        value: "+251 emergency services 23 4567",
        description: "Available Monday–Saturday",
        icon: PhoneIcon,
    },
    {
        title: "Email Support",
        value: "info@abyssiniaclean.com",
        description: "We usually respond within 24 hours",
        icon: EmailIcon,
    },
    {
        title: "Office Headquarters",
        value: "Bole Road, Addis Ababa, Ethiopia",
        description: "Addis Ababa, Ethiopia",
        icon: LocationIcon,
    },
];

/* =========================================================
   FOOTER SOCIAL DATA
========================================================= */

const socialLinks = [
    {
        name: "Telegram",
        icon: TelegramIcon,
        href: "https://t.me",
    },
    {
        name: "Facebook",
        icon: FacebookIcon,
        href: "https://facebook.com",
    },
    {
        name: "Instagram",
        icon: InstagramIcon,
        href: "https://instagram.com",
    },
    {
        name: "LinkedIn",
        icon: LinkedInIcon,
        href: "https://linkedin.com",
    },
];

/* =========================================================
   NAVBAR
========================================================= */

function Navbar() {
    const { user, loading, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const handleDashboard = () => {
        if (!user) {
            navigate("/login");
            return;
        }

        /*
         * Admin/team/mentor users do NOT automatically enter
         * the admin dashboard.
         *
         * They first choose their workspace from SelectRole.
         */

        if (user.isAdmin === true) {
            navigate("/select-role");
            return;
        }

        navigate("/customer-dashboard");
    };

    return (
        <nav className="fixed left-0 right-0 top-0 z-50 border-b border-gray-100 bg-white/95 shadow-sm backdrop-blur-md">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-6 lg:px-8">

                {/* =====================================================
                    BRAND LOGO
                ====================================================== */}

                <Link
                    to="/"
                    className="group flex items-center gap-4"
                    aria-label="Abyssinia Clean Home"
                >
                    {/* Transparent logo image */}
                    <img
                        src={logoImg}
                        alt="Abyssinia Clean logo"
                        className="h-12 w-auto object-contain bg-transparent transition-transform duration-300 group-hover:scale-105"
                    />

                    {/* Brand typography */}
                    <div className="hidden leading-none sm:block">
                        <span className="text-2xl font-black tracking-tight text-emerald-600">
                            Abyssinia
                        </span>

                        <span className="ml-1 text-2xl font-extrabold tracking-tight text-gray-900">
                            Clean
                        </span>
                    </div>
                </Link>

                {/* =====================================================
                    DESKTOP NAVIGATION
                ====================================================== */}

                <div className="hidden items-center gap-7 md:flex">

                    <a
                        href="/#home"
                        className="font-semibold text-emerald-600 transition hover:text-emerald-700"
                    >
                        Home
                    </a>

                    <a
                        href="/#services"
                        className="font-medium text-gray-600 transition hover:text-emerald-600"
                    >
                        Services
                    </a>

                    <a
                        href="/#about"
                        className="font-medium text-gray-600 transition hover:text-emerald-600"
                    >
                        About
                    </a>

                    <a
                        href="/#reviews"
                        className="font-medium text-gray-600 transition hover:text-emerald-600"
                    >
                        Reviews
                    </a>

                    <a
                        href="/#contact"
                        className="font-medium text-gray-600 transition hover:text-emerald-600"
                    >
                        Contact
                    </a>

                    {/* =================================================
                        AUTHENTICATED USER
                    ================================================== */}

                    {loading ? (
                        <div className="h-9 w-20 animate-pulse rounded-full bg-gray-100" />
                    ) : user ? (
                        <div className="flex items-center gap-3">

                            {/* User Profile */}
                            <button
                                type="button"
                                onClick={handleDashboard}
                                className="flex items-center gap-3 rounded-full border border-gray-200 bg-white px-3 py-2 transition hover:border-emerald-300 hover:bg-emerald-50"
                            >
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 font-bold text-white">
                                    {(
                                        user.full_name ||
                                        user.name ||
                                        user.email ||
                                        "U"
                                    )
                                        .charAt(0)
                                        .toUpperCase()}
                                </div>

                                <div className="hidden text-left lg:block">
                                    <p className="max-w-[140px] truncate text-sm font-bold text-gray-900">
                                        {user.full_name ||
                                            user.name ||
                                            user.email?.split("@")[0] ||
                                            "User"}
                                    </p>

                                    <p className="text-xs capitalize text-gray-500">
                                        {user.isAdmin
                                            ? "Admin Access"
                                            : "Customer"}
                                    </p>
                                </div>
                            </button>

                            {/* Dashboard */}
                            <button
                                type="button"
                                onClick={handleDashboard}
                                className="rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700"
                            >
                                Dashboard
                            </button>

                            {/* Logout */}
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="rounded-full border border-gray-200 px-5 py-2.5 text-sm font-bold text-gray-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">

                            {/* Sign In */}
                            <Link
                                to="/login"
                                className="rounded-full border border-gray-200 px-5 py-2.5 text-sm font-bold text-gray-800 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-600"
                            >
                                Sign In
                            </Link>

                            {/* Book Now */}
                            <Link
                                to="/login"
                                className="rounded-full bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700"
                            >
                                Book Now
                            </Link>
                        </div>
                    )}
                </div>

                {/* =====================================================
                    MOBILE AUTH CONTROLS
                ====================================================== */}

                <div className="flex items-center gap-2 md:hidden">

                    {loading ? (
                        <div className="h-9 w-16 animate-pulse rounded-full bg-gray-100" />
                    ) : user ? (
                        <>
                            <button
                                type="button"
                                onClick={handleDashboard}
                                className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 font-bold text-white"
                                aria-label="Open dashboard"
                            >
                                {(
                                    user.full_name ||
                                    user.name ||
                                    user.email ||
                                    "U"
                                )
                                    .charAt(0)
                                    .toUpperCase()}
                            </button>

                            <button
                                type="button"
                                onClick={handleLogout}
                                className="rounded-full border border-gray-200 px-3 py-2 text-xs font-bold text-gray-700"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link
                            to="/login"
                            className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-emerald-700"
                        >
                            Sign In
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}

/* =========================================================
   HOME
========================================================= */

function Home() {
    const services = [
        {
            title: "Home Cleaning",
            description:
                "Complete cleaning for bedrooms, living rooms, kitchens, and bathrooms.",
            price: "From Br 500",
            image: homeCleaning,
        },
        {
            title: "Office Cleaning",
            description:
                "Keep your workplace clean, organized, and professional for your team.",
            price: "From Br 1,000",
            image: officeCleaning,
        },
        {
            title: "Carpet Cleaning",
            description:
                "Deep carpet cleaning that removes dirt, stains, and unpleasant odors.",
            price: "From Br 400",
            image: carpetCleaning,
        },
        {
            title: "Window Cleaning",
            description:
                "Crystal-clear windows that make your home or office brighter and fresher.",
            price: "From Br 300",
            image: windowCleaning,
        },
    ];

    const reviews = [
        {
            name: "Selam Tesfaye",
            role: "Home Cleaning Customer",
            image: selam,
            review:
                "Abyssinia Clean did an amazing job! My house looks completely fresh and clean. The team was professional, friendly, and arrived on time.",
        },
        {
            name: "Dawit Bekele",
            role: "Office Cleaning Customer",
            image: dawit,
            review:
                "Excellent service from start to finish. They worked quickly and left our office looking clean, organized, and professional.",
        },
        {
            name: "Lidya Abebe",
            role: "Carpet Cleaning Customer",
            image: lidya,
            review:
                "Very affordable and professional service. My carpets look fresh and clean again. I will definitely use Abyssinia Clean again!",
        },
    ];

    return (
        <div className="min-h-screen bg-white text-gray-900">

            <Navbar />

            {/* =========================================================
                HERO
            ========================================================== */}

            <section
                id="home"
                className="relative flex min-h-screen items-center overflow-hidden"
            >
                <img
                    src={heroCleaning}
                    alt="Professional cleaning service"
                    className="absolute inset-0 h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-black/55" />

                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20" />

                <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-20 pt-32 sm:px-6 lg:px-8">

                    <div className="max-w-4xl">

                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-md">

                            <span className="h-2 w-2 rounded-full bg-emerald-400" />

                            Proudly Serving Addis Ababa, Ethiopia
                        </div>

                        <h1 className="text-5xl font-black leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-8xl">

                            A Cleaner Home,

                            <span className="mt-3 block text-emerald-400">
                                A Happier Life.
                            </span>
                        </h1>

                        <p className="mt-7 max-w-2xl text-lg leading-8 text-gray-200 sm:text-xl">
                            Reliable cleaning services for homes, offices, and businesses
                            across Addis Ababa. We take care of the details, so you don't
                            have to.
                        </p>

                        <div className="mt-9 flex flex-col gap-4 sm:flex-row">

                            <Link
                                to="/login"
                                className="rounded-full bg-emerald-600 px-8 py-4 text-center font-bold text-white shadow-xl shadow-emerald-600/20 transition-all duration-300 hover:bg-emerald-700"
                            >
                                Book a Cleaning →
                            </Link>

                            <a
                                href="#services"
                                className="rounded-full border border-white/40 bg-white/10 px-8 py-4 text-center font-bold text-white backdrop-blur-md transition-all duration-300 hover:bg-white hover:text-gray-950"
                            >
                                Explore Services
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* =========================================================
                SERVICES
            ========================================================== */}

            <section
                id="services"
                className="bg-white py-24"
            >
                <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

                    <div className="mx-auto max-w-2xl text-center">

                        <p className="font-bold uppercase tracking-[0.2em] text-emerald-600">
                            What We Offer
                        </p>

                        <h2 className="mt-3 text-4xl font-black tracking-tight text-gray-950 sm:text-5xl">

                            Cleaning Services

                            <span className="block text-emerald-600">
                                You Can Trust
                            </span>
                        </h2>

                        <p className="mt-5 text-lg leading-8 text-gray-600">
                            Professional cleaning solutions designed to keep your home,
                            workplace, and business fresh and comfortable.
                        </p>
                    </div>

                    <div className="mt-14 grid gap-7 sm:grid-cols-2 lg:grid-cols-4">

                        {services.map((service) => (
                            <div
                                key={service.title}
                                className="group overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-md transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
                            >
                                <div className="relative h-56 overflow-hidden">

                                    <img
                                        src={service.image}
                                        alt={service.title}
                                        className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                                    />

                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                </div>

                                <div className="p-6">

                                    <h3 className="text-xl font-bold">
                                        {service.title}
                                    </h3>

                                    <p className="mt-3 min-h-[72px] text-sm leading-6 text-gray-600">
                                        {service.description}
                                    </p>

                                    <div className="mt-5 flex items-center justify-between">

                                        <p className="font-bold text-emerald-600">
                                            {service.price}
                                        </p>

                                        <Link
                                            to="/login"
                                            className="rounded-full bg-gray-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600"
                                        >
                                            Book
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* =========================================================
                ABOUT
            ========================================================== */}

            <section
                id="about"
                className="bg-gray-950 py-24"
            >
                <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

                    <div className="grid items-center gap-14 lg:grid-cols-2">

                        <div className="overflow-hidden rounded-[2rem]">

                            <img
                                src={homeCleaning}
                                alt="Clean home"
                                className="h-[420px] w-full object-cover sm:h-[500px]"
                            />
                        </div>

                        <div className="text-white">

                            <p className="font-bold uppercase tracking-[0.2em] text-emerald-400">
                                About Abyssinia Clean
                            </p>

                            <h2 className="mt-4 text-4xl font-black leading-tight sm:text-5xl">

                                We Make Cleaning

                                <span className="block text-emerald-400">
                                    Simple & Stress-Free
                                </span>
                            </h2>

                            <p className="mt-7 leading-8 text-gray-400">
                                Abyssinia Clean is a professional cleaning service dedicated
                                to helping families and businesses enjoy clean, healthy, and
                                comfortable spaces across Addis Ababa.
                            </p>

                            <p className="mt-4 leading-8 text-gray-400">
                                Our trained professionals use reliable cleaning methods and
                                quality products to deliver excellent results every time.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* =========================================================
                REVIEWS
            ========================================================== */}

            <section
                id="reviews"
                className="bg-white py-24"
            >
                <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

                    <div className="mx-auto max-w-2xl text-center">

                        <p className="font-bold uppercase tracking-[0.2em] text-emerald-600">
                            Customer Reviews
                        </p>

                        <h2 className="mt-3 text-4xl font-black text-gray-950 sm:text-5xl">
                            What Our Customers Say
                        </h2>
                    </div>

                    <div className="mt-14 grid gap-7 lg:grid-cols-3">

                        {reviews.map((review) => (
                            <div
                                key={review.name}
                                className="rounded-3xl border border-gray-100 bg-white p-7 shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                            >

                                <div className="flex gap-1 text-lg text-yellow-400">
                                    ★★★★★
                                </div>

                                <p className="mt-5 leading-7 text-gray-600">
                                    "{review.review}"
                                </p>

                                <div className="mt-7 flex items-center gap-4">

                                    <img
                                        src={review.image}
                                        alt={review.name}
                                        className="h-14 w-14 rounded-full object-cover"
                                    />

                                    <div>

                                        <h3 className="font-bold text-gray-950">
                                            {review.name}
                                        </h3>

                                        <p className="text-sm text-gray-500">
                                            {review.role}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* =========================================================
                CONTACT WORKSPACE
            ========================================================== */}

            <section
                id="contact"
                className="border-t border-gray-100 bg-slate-50 py-24"
            >
                <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

                    {/* Contact Header */}
                    <div className="mb-16 max-w-3xl">

                        <span className="inline-flex items-center rounded-full bg-emerald-50 px-4 py-1 text-xs font-bold uppercase tracking-widest text-emerald-600">
                            Get In Touch
                        </span>

                        <h2 className="mt-4 text-4xl font-black tracking-tight text-gray-950 sm:text-5xl">

                            Let's make your space

                            <span className="block text-emerald-600">
                                cleaner together.
                            </span>
                        </h2>

                        <p className="mt-4 text-base leading-relaxed text-gray-600">
                            Have a question, need a quote, or ready to schedule professional
                            cleaning? Our team is ready to help.
                        </p>
                    </div>

                    {/* =================================================
                        ASYMMETRIC CONTACT GRID
                    ================================================== */}

                    <div className="grid gap-10 lg:grid-cols-12 lg:items-stretch">

                        {/* =================================================
                            LEFT CONTACT INFORMATION
                        ================================================== */}

                        <div className="flex flex-col justify-between rounded-3xl border border-gray-200 bg-white p-8 shadow-sm lg:col-span-5">

                            <div className="flex flex-col gap-6">

                                {contactDetails.map((detail) => {
                                    const Icon = detail.icon;

                                    return (
                                        <div
                                            key={detail.title}
                                            className="flex items-start gap-4 rounded-2xl p-3 transition hover:bg-slate-50"
                                        >

                                            {/* Icon */}
                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-600">
                                                <Icon />
                                            </div>

                                            {/* Information */}
                                            <div className="min-w-0 text-left">

                                                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                                    {detail.title}
                                                </p>

                                                <p className="mt-1 break-words text-sm font-black text-gray-900">
                                                    {detail.value}
                                                </p>

                                                <p className="mt-1 text-xs text-gray-500">
                                                    {detail.description}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Contact CTA */}
                            <Link
                                to="/login"
                                className="mt-8 block rounded-2xl bg-emerald-600 px-6 py-4 text-center text-sm font-black text-white shadow-xl shadow-emerald-600/10 transition-all duration-300 hover:bg-emerald-700 hover:-translate-y-0.5"
                            >
                                Book a Cleaning Now →
                            </Link>
                        </div>

                        {/* =================================================
                            RIGHT GOOGLE MAP
                        ================================================== */}

                        <div className="lg:col-span-7">

                            <div className="relative h-80 w-full overflow-hidden rounded-3xl border border-gray-200 bg-white p-2 shadow-sm">

                                <iframe
                                    title="Abyssinia Clean Headquarters - Bole Addis Ababa"
                                    src="https://www.google.com/maps?q=9.0051833,38.7844005&z=15&output=embed"
                                    className="h-full w-full rounded-2xl border-0"
                                    loading="lazy"
                                    allowFullScreen
                                    referrerPolicy="no-referrer-when-downgrade"
                                />
                            </div>

                            {/* Map information */}
                            <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

                                <div className="flex items-start gap-4">

                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
                                        <LocationIcon />
                                    </div>

                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                                            Headquarters
                                        </p>

                                        <h3 className="mt-1 font-black text-gray-900">
                                            Bole Road, Addis Ababa
                                        </h3>

                                        <p className="mt-1 text-sm text-gray-500">
                                            Addis Ababa, Ethiopia
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

/* =========================================================
   CORPORATE FOOTER
========================================================= */

function Footer() {
    return (
        <footer className="border-t border-white/5 bg-gray-950 py-16 text-white">

            <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

                {/* =====================================================
                    FOOTER MAIN GRID
                ====================================================== */}

                <div className="flex flex-col items-start justify-between gap-10 border-b border-white/10 pb-10 md:flex-row md:items-center">

                    {/* =================================================
                        FOOTER BRAND
                    ================================================== */}

                    <div className="flex items-center gap-5">

                        {/* Logo */}
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center">
                            <img
                                src={logoImg}
                                alt="Abyssinia Clean logo"
                                className="h-14 w-auto object-contain bg-transparent transition-transform duration-300 hover:scale-105"
                            />
                        </div>

                        {/* Brand text */}
                        <div>

                            <p className="text-2xl font-black tracking-tight">

                                <span className="text-emerald-400">
                                    Abyssinia
                                </span>

                                <span className="ml-1 text-slate-200">
                                    Clean
                                </span>
                            </p>

                            <p className="mt-2 max-w-sm text-sm leading-6 text-gray-400">
                                Professional cleaning services for homes, offices,
                                and businesses across Addis Ababa.
                            </p>
                        </div>
                    </div>

                    {/* =================================================
                        SOCIAL ICONS ONLY
                    ================================================== */}

                    <div className="flex items-center gap-3">

                        {socialLinks.map((social) => {
                            const SocialIcon = social.icon;

                            return (
                                <a
                                    key={social.name}
                                    href={social.href}
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label={social.name}
                                    title={social.name}
                                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-gray-300 transition duration-300 hover:border-emerald-600 hover:bg-emerald-600 hover:text-white hover:-translate-y-1"
                                >
                                    <SocialIcon />
                                </a>
                            );
                        })}
                    </div>
                </div>

                {/* =====================================================
                    FOOTER LOWER BASELINE
                ====================================================== */}

                <div className="flex flex-col items-center justify-between gap-4 pt-8 text-center text-xs text-gray-500 sm:flex-row sm:text-left">

                    <p>
                        © 2026 Abyssinia Clean. All rights reserved.
                    </p>

                    <p className="text-gray-600">
                        Professional Cleaning Services · Addis Ababa, Ethiopia
                    </p>
                </div>
            </div>
        </footer>
    );
}

/* =========================================================
   MAIN APP ROUTING FRAMEWORK
========================================================= */

function App() {
    return (
        <div className="min-h-screen bg-white font-sans antialiased text-gray-900">

            <Routes>

                {/* =====================================================
                    HOME ROUTE
                ====================================================== */}

                <Route
                    path="/"
                    element={
                        <>
                            <Home />
                            <Footer />
                        </>
                    }
                />

                {/* =====================================================
                    AUTH ROUTES
                ====================================================== */}

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                {/* =====================================================
                    ROLE SELECTION
                ====================================================== */}

                <Route
                    path="/role-selection"
                    element={
                        <ProtectedRoute>
                            <RoleSelection />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/select-role"
                    element={
                        <ProtectedRoute>
                            <SelectRole />
                        </ProtectedRoute>
                    }
                />

                {/* =====================================================
                    CUSTOMER DASHBOARD
                ====================================================== */}

                <Route
                    path="/customer-dashboard"
                    element={
                        <ProtectedRoute>
                            <CustomerDashboard />
                        </ProtectedRoute>
                    }
                />

                {/* =====================================================
                    ADMIN DASHBOARD
                ====================================================== */}

                <Route
                    path="/admin-dashboard"
                    element={
                        <ProtectedRoute>
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />

            </Routes>
        </div>
    );
}

export default App;