import { useEffect } from "react";
import {
    useNavigate
} from "react-router-dom";

import {
    useAuth
} from "../context/AuthContext";


function RoleRedirect() {

    const {
        user,
        loading
    } = useAuth();


    const navigate =
        useNavigate();


    // ==================================================
    // AUTOMATIC ROLE ROUTING
    // ==================================================

    useEffect(() => {

        if (loading) {
            return;
        }


        if (!user) {

            navigate(
                "/login",
                {
                    replace: true
                }
            );

            return;
        }


        // ==============================================
        // MENTOR
        // ==============================================

        if (
            user.role === "mentor_admin"
        ) {

            navigate(
                "/admin/dashboard",
                {
                    replace: true
                }
            );

            return;
        }


        // ==============================================
        // CUSTOMER
        // ==============================================

        if (
            user.role === "customer"
        ) {

            navigate(
                "/customer/dashboard",
                {
                    replace: true
                }
            );

            return;
        }


        // ==============================================
        // OLD ADMIN ROLE
        // ==============================================

        if (
            user.role === "admin"
        ) {

            navigate(
                "/admin/dashboard",
                {
                    replace: true
                }
            );

            return;
        }


        // ==============================================
        // TEAM ADMIN
        // ==============================================
        // Stay on this page.
        // Team members choose where to go.

        if (
            user.role === "team_admin"
        ) {

            return;

        }


        // ==============================================
        // UNKNOWN ROLE
        // ==============================================

        navigate(
            "/customer/dashboard",
            {
                replace: true
            }
        );

    }, [
        user,
        loading,
        navigate
    ]);


    // ==================================================
    // LOADING
    // ==================================================

    if (loading) {

        return (

            <div className="flex min-h-screen items-center justify-center bg-gray-950">

                <div className="text-center">

                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-white/20 border-t-blue-500" />

                    <p className="mt-4 text-gray-400">
                        Checking your account...
                    </p>

                </div>

            </div>

        );

    }


    if (!user) {
        return null;
    }


    // ==================================================
    // ONLY TEAM ADMIN GETS SELECTION SCREEN
    // ==================================================

    if (
        user.role !== "team_admin"
    ) {

        return null;

    }


    // ==================================================
    // NAVIGATION BUTTONS
    // ==================================================

    const goToAdmin = () => {

        navigate(
            "/admin/dashboard"
        );

    };


    const goToCustomer = () => {

        navigate(
            "/customer/dashboard"
        );

    };


    // ==================================================
    // UI
    // ==================================================

    return (

        <div className="flex min-h-screen items-center justify-center bg-[#171614] px-5">

            <div className="w-full max-w-2xl">

                <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-md sm:p-10">


                    {/* USER */}

                    <div className="text-center">

                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-600 text-3xl font-black text-white">

                            {(
                                user.full_name ||
                                user.name ||
                                user.email ||
                                "U"
                            )
                                .charAt(0)
                                .toUpperCase()}

                        </div>


                        <p className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-blue-400">

                            Welcome back

                        </p>


                        <h1 className="mt-3 text-3xl font-black text-white sm:text-4xl">

                            {user.full_name ||
                                user.name ||
                                "Team Member"}

                        </h1>


                        <p className="mt-3 text-gray-400">

                            Choose how you want to continue.

                        </p>

                    </div>


                    {/* OPTIONS */}

                    <div className="mt-10 grid gap-5 sm:grid-cols-2">


                        {/* ADMIN */}

                        <button
                            type="button"
                            onClick={goToAdmin}
                            className="group rounded-3xl bg-blue-600 p-7 text-left transition duration-300 hover:-translate-y-1 hover:bg-blue-700 hover:shadow-2xl hover:shadow-blue-600/20"
                        >

                            <div className="text-4xl">
                                🛠️
                            </div>


                            <h2 className="mt-5 text-xl font-black text-white">

                                Admin Dashboard

                            </h2>


                            <p className="mt-2 text-sm leading-6 text-blue-100">

                                Manage customer bookings,
                                services, and cleaning
                                activities.

                            </p>


                            <div className="mt-6 font-bold text-white">

                                Go to Admin Dashboard →

                            </div>

                        </button>


                        {/* CUSTOMER */}

                        <button
                            type="button"
                            onClick={goToCustomer}
                            className="group rounded-3xl border border-white/10 bg-white/5 p-7 text-left transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10"
                        >

                            <div className="text-4xl">
                                🏠
                            </div>


                            <h2 className="mt-5 text-xl font-black text-white">

                                Customer Dashboard

                            </h2>


                            <p className="mt-2 text-sm leading-6 text-gray-400">

                                Browse services and
                                manage your cleaning
                                bookings.

                            </p>


                            <div className="mt-6 font-bold text-gray-300">

                                Go to Customer Dashboard →

                            </div>

                        </button>

                    </div>

                </div>

            </div>

        </div>

    );
}


export default RoleRedirect;