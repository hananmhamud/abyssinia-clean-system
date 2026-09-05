import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({
children,
allowedRoles
}) {


const {
    user,
    loading
} = useAuth();

if (loading) {

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <div className="text-center">

                <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

                <p className="mt-4 font-semibold text-gray-600">
                    Loading...
                </p>

            </div>
        </div>
    );
}

if (!user) {

    return (
        <Navigate
            to="/login"
            replace
        />
    );
}

if (
    allowedRoles &&
    !allowedRoles.includes(
        user.role
    )
) {

    if (
        user.role === "customer"
    ) {

        return (
            <Navigate
                to="/customer/dashboard"
                replace
            />
        );
    }

    if (
        user.role === "admin" ||
        user.role === "team_admin" ||
        user.role === "mentor_admin"
    ) {

        return (
            <Navigate
                to="/admin/dashboard"
                replace
            />
        );
    }

    return (
        <Navigate
            to="/"
            replace
        />
    );
}

return children;


}

export default ProtectedRoute;
