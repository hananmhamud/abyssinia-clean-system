
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function SelectRole() {

    const navigate = useNavigate();

    const {
        user,
        setUser,
    } = useAuth();

    /* =====================================================
       SECURITY CHECK
    ===================================================== */

    useEffect(() => {

        const token =
            localStorage.getItem("token");

        const storedUser =
            JSON.parse(
                localStorage.getItem("user") ||
                "null"
            );

        const currentUser =
            user || storedUser;

        /*
         * No login -> back to login.
         */

        if (!token || !currentUser) {

            navigate(
                "/login",
                { replace: true }
            );

            return;
        }

        /*
         * Normal customer should never
         * manually access role selection.
         */

        if (currentUser.isAdmin !== true) {

            navigate(
                "/customer-dashboard",
                { replace: true }
            );
        }

    }, [navigate, user]);

    /* =====================================================
       ADMIN PANEL
    ===================================================== */

    const goToAdmin = () => {

        const currentUser =
            user ||
            JSON.parse(
                localStorage.getItem("user") ||
                "null"
            );

        if (!currentUser?.isAdmin) {

            navigate(
                "/customer-dashboard",
                { replace: true }
            );

            return;
        }

        const updatedUser = {
            ...currentUser,
            role: "admin",
            selectedRole: "admin",
            isAdmin: true,
        };

        localStorage.setItem(
            "user",
            JSON.stringify(updatedUser)
        );

        setUser(updatedUser);

        navigate(
            "/admin-dashboard",
            { replace: true }
        );
    };

    /* =====================================================
       CUSTOMER PANEL
    ===================================================== */

    const goToCustomer = () => {

        const currentUser =
            user ||
            JSON.parse(
                localStorage.getItem("user") ||
                "null"
            );

        if (!currentUser) {

            navigate(
                "/login",
                { replace: true }
            );

            return;
        }

        const updatedUser = {
            ...currentUser,
            role: "customer",
            selectedRole: "customer",
            isAdmin: currentUser.isAdmin === true,
        };

        localStorage.setItem(
            "user",
            JSON.stringify(updatedUser)
        );

        setUser(updatedUser);

        navigate(
            "/customer-dashboard",
            { replace: true }
        );
    };

    /* =====================================================
       PAGE
    ===================================================== */

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#171614] px-5 text-white">

            <div className="w-full max-w-2xl">

                {/* HEADER */}

                <div className="text-center">

                    <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#c5a46d]">
                        Abyssinia Clean
                    </p>

                    <h1 className="mt-4 text-4xl font-black sm:text-5xl">
                        Choose how to continue
                    </h1>

                    <p className="mx-auto mt-4 max-w-xl text-gray-400">
                        Your account has administrator access.
                        Choose whether you want to enter the
                        administration panel or customer panel.
                    </p>

                </div>

                {/* OPTIONS */}

                <div className="mt-12 grid gap-6 md:grid-cols-2">

                    {/* ADMIN */}

                    <button
                        type="button"
                        onClick={goToAdmin}
                        className="group rounded-[2rem] border border-[#c5a46d]/30 bg-[#c5a46d]/10 p-8 text-left transition duration-300 hover:-translate-y-1 hover:border-[#c5a46d] hover:bg-[#c5a46d]/20"
                    >

                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#c5a46d]/20 text-3xl">
                            🛡️
                        </div>

                        <h2 className="mt-6 text-2xl font-black">
                            Admin Dashboard
                        </h2>

                        <p className="mt-3 leading-7 text-gray-400">
                            Manage bookings, customers,
                            services, and the cleaning
                            service system.
                        </p>

                        <div className="mt-7 font-bold text-[#c5a46d]">
                            Go to Admin Dashboard →
                        </div>

                    </button>

                    {/* CUSTOMER */}

                    <button
                        type="button"
                        onClick={goToCustomer}
                        className="group rounded-[2rem] border border-white/10 bg-white/5 p-8 text-left transition duration-300 hover:-translate-y-1 hover:border-white/30 hover:bg-white/10"
                    >

                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-3xl">
                            👤
                        </div>

                        <h2 className="mt-6 text-2xl font-black">
                            Customer Dashboard
                        </h2>

                        <p className="mt-3 leading-7 text-gray-400">
                            Book cleaning services,
                            view your bookings, and
                            manage your customer account.
                        </p>

                        <div className="mt-7 font-bold text-white">
                            Go to Customer Dashboard →
                        </div>

                    </button>

                </div>

                <p className="mt-8 text-center text-xs text-gray-600">
                    You can choose either panel whenever you sign in.
                </p>

            </div>

        </div>
    );
}

export default SelectRole;

