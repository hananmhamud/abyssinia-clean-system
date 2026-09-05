
import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

const AuthContext = createContext(null);

/* =========================================================
   AUTH PROVIDER
========================================================= */

export function AuthProvider({ children }) {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    /* =====================================================
       LOAD USER FROM LOCAL STORAGE
    ===================================================== */

    useEffect(() => {

        try {

            const storedToken =
                localStorage.getItem("token");

            const storedUser =
                localStorage.getItem("user");

            if (storedToken && storedUser) {

                const parsedUser =
                    JSON.parse(storedUser);

                setUser(parsedUser);

            }

        } catch (error) {

            console.error(
                "Error loading saved user:",
                error
            );

            localStorage.removeItem("token");
            localStorage.removeItem("user");

            setUser(null);

        } finally {

            setLoading(false);

        }

    }, []);

    /* =====================================================
       LOGIN
    ===================================================== */

    const login = (token, userData) => {

        if (!token || !userData) {
            throw new Error(
                "Invalid login information."
            );
        }

        /*
         * Make sure isAdmin is always a real boolean.
         */

        const normalizedUser = {
            ...userData,
            isAdmin:
                userData.isAdmin === true ||
                userData.isAdmin === "true",
        };

        localStorage.setItem(
            "token",
            token
        );

        localStorage.setItem(
            "user",
            JSON.stringify(normalizedUser)
        );

        setUser(normalizedUser);

        return normalizedUser;
    };

    /* =====================================================
       LOGOUT
    ===================================================== */

    const logout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setUser(null);

    };

    /* =====================================================
       UPDATE USER
    ===================================================== */

    const updateUser = (updates) => {

        setUser((previousUser) => {

            if (!previousUser) {
                return previousUser;
            }

            const updatedUser = {
                ...previousUser,
                ...updates,
            };

            localStorage.setItem(
                "user",
                JSON.stringify(updatedUser)
            );

            return updatedUser;
        });

    };

    /* =====================================================
       CONTEXT
    ===================================================== */

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                loading,
                login,
                logout,
                updateUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

/* =========================================================
   useAuth
========================================================= */

export function useAuth() {

    const context =
        useContext(AuthContext);

    if (!context) {

        throw new Error(
            "useAuth must be used inside AuthProvider."
        );

    }

    return context;
}

export default AuthContext;

