
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { OAuth2Client } = require("google-auth-library");

const db = require("../config/db");

// ======================================================
// MYSQL PROMISE CONNECTION
// ======================================================
const promiseDb =
    typeof db.promise === "function"
        ? db.promise()
        : db;

// ======================================================
// GOOGLE CLIENT
// ======================================================
// GOOGLE_CLIENT_ID must exist in your .env file.
//
// .env:
// GOOGLE_CLIENT_ID=859047448532-554o4hnr48huk24q367eakb7a7knlb4i.apps.googleusercontent.com
// ======================================================
const googleClient = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID
);

// ======================================================
// ADMIN EMAILS
// ======================================================
// These users have BOTH:
//
// ADMIN privilege
// CUSTOMER privilege
//
// They can switch between admin and customer mode.
// ======================================================
const adminEmails = [
    "hananbereka2025@gmail.com",
    "team_member1@gmail.com",
    "team_member2@gmail.com",
    "team_member3@gmail.com",
    "mentor@gmail.com"
];

// ======================================================
// NORMALIZE EMAIL
// ======================================================
const normalizeEmail = (email) => {
    if (!email) {
        return "";
    }

    return email.toLowerCase().trim();
};

// ======================================================
// CHECK ADMIN EMAIL
// ======================================================
const isAdminEmail = (email) => {
    const normalizedEmail = normalizeEmail(email);

    if (!normalizedEmail) {
        return false;
    }

    return adminEmails.includes(normalizedEmail);
};

// ======================================================
// GET DEFAULT ROLE
// ======================================================
const getRole = (email) => {
    return isAdminEmail(email)
        ? "admin"
        : "customer";
};

// ======================================================
// GET AVAILABLE ROLES
// ======================================================
const getAvailableRoles = (email) => {
    return isAdminEmail(email)
        ? ["admin", "customer"]
        : ["customer"];
};

// ======================================================
// CREATE JWT
// ======================================================
const createToken = (user, selectedRole = null) => {
    const email = normalizeEmail(user.email);

    const admin = isAdminEmail(email);

    // --------------------------------------------------
    // ADMIN:
    // Can use admin OR customer mode.
    //
    // CUSTOMER:
    // Can ONLY use customer mode.
    // --------------------------------------------------
    let currentRole;

    if (admin) {
        currentRole =
            selectedRole === "customer"
                ? "customer"
                : "admin";
    } else {
        currentRole = "customer";
    }

    return jwt.sign(
        {
            id: user.id,
            email,

            // Current active mode
            role: currentRole,

            // Permanent authorization
            isAdmin: admin,

            // Available privileges
            roles: admin
                ? ["admin", "customer"]
                : ["customer"]
        },

        process.env.JWT_SECRET || "secret_key",

        {
            expiresIn: "1d"
        }
    );
};

// ======================================================
// BUILD USER RESPONSE
// ======================================================
const buildUserResponse = (
    user,
    selectedRole = null
) => {
    const email = normalizeEmail(user.email);

    const admin = isAdminEmail(email);

    let activeRole;

    if (admin) {
        activeRole =
            selectedRole === "customer"
                ? "customer"
                : "admin";
    } else {
        activeRole = "customer";
    }

    return {
        id: user.id,

        full_name: user.full_name,

        email,

        phone: user.phone || null,

        address: user.address || null,

        // TRUE for authorized admin emails
        isAdmin: admin,

        // Admin = both privileges
        roles: admin
            ? ["admin", "customer"]
            : ["customer"],

        // Current mode
        role: activeRole
    };
};

// ======================================================
// REGISTER
// ======================================================
const register = async (req, res) => {
    try {
        const {
            full_name,
            email,
            password,
            phone,
            address
        } = req.body;

        // --------------------------------------------------
        // VALIDATION
        // --------------------------------------------------
        if (
            !full_name ||
            !email ||
            !password
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Full name, email and password are required"
            });
        }

        const normalizedEmail =
            normalizeEmail(email);

        // --------------------------------------------------
        // CHECK EXISTING USER
        // --------------------------------------------------
        const [existingUsers] =
            await promiseDb.query(
                `
                SELECT id
                FROM users
                WHERE email = ?
                LIMIT 1
                `,
                [normalizedEmail]
            );

        if (existingUsers.length > 0) {
            return res.status(409).json({
                success: false,
                message:
                    "User with this email already exists"
            });
        }

        // --------------------------------------------------
        // DETERMINE ROLE
        // --------------------------------------------------
        const role =
            getRole(normalizedEmail);

        // --------------------------------------------------
        // HASH PASSWORD
        // --------------------------------------------------
        const hashedPassword =
            await bcrypt.hash(
                password,
                10
            );

        // --------------------------------------------------
        // INSERT USER
        // --------------------------------------------------
        const [result] =
            await promiseDb.query(
                `
                INSERT INTO users
                (
                    full_name,
                    email,
                    phone,
                    password,
                    role,
                    address
                )
                VALUES (?, ?, ?, ?, ?, ?)
                `,
                [
                    full_name,
                    normalizedEmail,
                    phone || null,
                    hashedPassword,
                    role,
                    address || null
                ]
            );

        // --------------------------------------------------
        // CREATE USER OBJECT
        // --------------------------------------------------
        const user = {
            id: result.insertId,
            full_name,
            email: normalizedEmail,
            phone: phone || null,
            address: address || null,
            role
        };

        // --------------------------------------------------
        // CREATE TOKEN
        // --------------------------------------------------
        const token =
            createToken(user);

        return res.status(201).json({
            success: true,

            message:
                "Registration successful",

            token,

            user:
                buildUserResponse(user)
        });

    } catch (error) {

        console.error(
            "Registration error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Server error during registration"
        });
    }
};

// ======================================================
// EMAIL / PASSWORD LOGIN
// ======================================================
const login = async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body;

        // --------------------------------------------------
        // VALIDATION
        // --------------------------------------------------
        if (
            !email ||
            !password
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Email and password are required"
            });
        }

        const normalizedEmail =
            normalizeEmail(email);

        // --------------------------------------------------
        // FIND USER
        // --------------------------------------------------
        const [users] =
            await promiseDb.query(
                `
                SELECT *
                FROM users
                WHERE email = ?
                LIMIT 1
                `,
                [normalizedEmail]
            );

        if (
            !users ||
            users.length === 0
        ) {
            return res.status(401).json({
                success: false,
                message:
                    "Invalid email or password"
            });
        }

        const user =
            users[0];

        // --------------------------------------------------
        // GOOGLE-ONLY ACCOUNT
        // --------------------------------------------------
        if (!user.password) {
            return res.status(401).json({
                success: false,
                message:
                    "This account does not use password login. Please use Google Sign-In."
            });
        }

        // --------------------------------------------------
        // CHECK PASSWORD
        // --------------------------------------------------
        const passwordMatch =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message:
                    "Invalid email or password"
            });
        }

        // --------------------------------------------------
        // SECURITY:
        // ADMIN EMAILS ARE ALWAYS ADMIN AUTHORIZED.
        // --------------------------------------------------
        const authorizedRole =
            getRole(normalizedEmail);

        // --------------------------------------------------
        // SYNCHRONIZE DATABASE ROLE
        // --------------------------------------------------
        if (
            user.role !== authorizedRole
        ) {
            await promiseDb.query(
                `
                UPDATE users
                SET role = ?
                WHERE id = ?
                `,
                [
                    authorizedRole,
                    user.id
                ]
            );

            user.role =
                authorizedRole;
        }

        // --------------------------------------------------
        // CREATE TOKEN
        // --------------------------------------------------
        const token =
            createToken(user);

        return res.status(200).json({
            success: true,

            message:
                "Login successful",

            token,

            user:
                buildUserResponse(user)
        });

    } catch (error) {

        console.error(
            "Login error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Server error during login"
        });
    }
};

// ======================================================
// GOOGLE LOGIN
// ======================================================
// SECURE FLOW:
//
// Frontend sends:
//
// {
//     credential: "GOOGLE_ID_TOKEN"
// }
//
// Backend verifies the credential with Google.
// ======================================================
const googleLogin = async (req, res) => {
    try {

        const {
            credential
        } = req.body;

        // --------------------------------------------------
        // CHECK CREDENTIAL
        // --------------------------------------------------
        if (!credential) {
            return res.status(400).json({
                success: false,
                message:
                    "Google credential is required"
            });
        }

        // --------------------------------------------------
        // CHECK GOOGLE CLIENT ID
        // --------------------------------------------------
        if (
            !process.env.GOOGLE_CLIENT_ID
        ) {
            console.error(
                "GOOGLE_CLIENT_ID is missing from .env"
            );

            return res.status(500).json({
                success: false,
                message:
                    "Google authentication is not configured on the server"
            });
        }

        // --------------------------------------------------
        // VERIFY GOOGLE ID TOKEN
        // --------------------------------------------------
        const ticket =
            await googleClient.verifyIdToken({
                idToken: credential,

                audience:
                    process.env.GOOGLE_CLIENT_ID
            });

        // --------------------------------------------------
        // GET GOOGLE PAYLOAD
        // --------------------------------------------------
        const payload =
            ticket.getPayload();

        if (
            !payload ||
            !payload.email
        ) {
            return res.status(401).json({
                success: false,
                message:
                    "Invalid Google account information"
            });
        }

        // --------------------------------------------------
        // GOOGLE EMAIL
        // --------------------------------------------------
        const normalizedEmail =
            normalizeEmail(
                payload.email
            );

        // --------------------------------------------------
        // GOOGLE NAME
        // --------------------------------------------------
        const full_name =
            payload.name ||
            "Google User";

        // --------------------------------------------------
        // OPTIONAL:
        // GOOGLE EMAIL MUST BE VERIFIED
        // --------------------------------------------------
        if (
            payload.email_verified === false
        ) {
            return res.status(401).json({
                success: false,
                message:
                    "Google email is not verified"
            });
        }

        // --------------------------------------------------
        // FIND USER IN MYSQL
        // --------------------------------------------------
        const [users] =
            await promiseDb.query(
                `
                SELECT *
                FROM users
                WHERE email = ?
                LIMIT 1
                `,
                [normalizedEmail]
            );

        let user;

        // ==================================================
        // CREATE NEW GOOGLE USER
        // ==================================================
        if (
            !users ||
            users.length === 0
        ) {

            // Determine role from authorized email list
            const defaultRole =
                getRole(
                    normalizedEmail
                );

            const [result] =
                await promiseDb.query(
                    `
                    INSERT INTO users
                    (
                        full_name,
                        email,
                        role
                    )
                    VALUES (?, ?, ?)
                    `,
                    [
                        full_name,
                        normalizedEmail,
                        defaultRole
                    ]
                );

            user = {
                id: result.insertId,

                full_name,

                email:
                    normalizedEmail,

                role:
                    defaultRole
            };

        }

        // ==================================================
        // EXISTING USER
        // ==================================================
        else {

            user =
                users[0];

            // ------------------------------------------------
            // If this email is authorized as admin,
            // make sure DB role is admin.
            // ------------------------------------------------
            if (
                isAdminEmail(
                    normalizedEmail
                ) &&
                user.role !== "admin"
            ) {

                await promiseDb.query(
                    `
                    UPDATE users
                    SET role = 'admin'
                    WHERE id = ?
                    `,
                    [user.id]
                );

                user.role =
                    "admin";
            }

            // ------------------------------------------------
            // If NOT an admin email,
            // don't allow database role to remain admin.
            // ------------------------------------------------
            if (
                !isAdminEmail(
                    normalizedEmail
                ) &&
                user.role !== "customer"
            ) {

                await promiseDb.query(
                    `
                    UPDATE users
                    SET role = 'customer'
                    WHERE id = ?
                    `,
                    [user.id]
                );

                user.role =
                    "customer";
            }
        }

        // --------------------------------------------------
        // CREATE OUR APPLICATION JWT
        // --------------------------------------------------
        const token =
            createToken(user);

        // --------------------------------------------------
        // RETURN USER
        // --------------------------------------------------
        return res.status(200).json({
            success: true,

            message:
                "Google login successful",

            token,

            user:
                buildUserResponse(user)
        });

    } catch (error) {

        console.error(
            "Google login error:",
            error.message
        );

        return res.status(401).json({
            success: false,
            message:
                "Google authentication failed"
        });
    }
};

// ======================================================
// CHOOSE / SWITCH ROLE
// ======================================================
const chooseRole = async (req, res) => {
    try {

        const {
            role
        } = req.body;

        // --------------------------------------------------
        // VALIDATE ROLE
        // --------------------------------------------------
        if (
            !role ||
            (
                role !== "admin" &&
                role !== "customer"
            )
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Valid role (admin or customer) is required"
            });
        }

        // --------------------------------------------------
        // EMAIL FROM VERIFIED APPLICATION JWT
        // --------------------------------------------------
        const email =
            normalizeEmail(
                req.user.email
            );

        // --------------------------------------------------
        // CHECK ADMIN STATUS
        // --------------------------------------------------
        const admin =
            isAdminEmail(email);

        // --------------------------------------------------
        // CUSTOMER CANNOT BECOME ADMIN
        // --------------------------------------------------
        if (
            role === "admin" &&
            !admin
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "You do not have permission to access the admin role"
            });
        }

        // --------------------------------------------------
        // FIND USER
        // --------------------------------------------------
        const [users] =
            await promiseDb.query(
                `
                SELECT *
                FROM users
                WHERE email = ?
                LIMIT 1
                `,
                [email]
            );

        if (
            !users ||
            users.length === 0
        ) {
            return res.status(404).json({
                success: false,
                message:
                    "User not found"
            });
        }

        const user =
            users[0];

        // --------------------------------------------------
        // UPDATE CURRENT ACTIVE ROLE
        // --------------------------------------------------
        await promiseDb.query(
            `
            UPDATE users
            SET role = ?
            WHERE id = ?
            `,
            [
                role,
                user.id
            ]
        );

        user.role =
            role;

        // --------------------------------------------------
        // CREATE NEW TOKEN
        // --------------------------------------------------
        const newToken =
            createToken(
                user,
                role
            );

        return res.status(200).json({
            success: true,

            message:
                `Role switched to ${role} successfully`,

            token:
                newToken,

            user:
                buildUserResponse(
                    user,
                    role
                )
        });

    } catch (error) {

        console.error(
            "Choose role error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Server error during role selection"
        });
    }
};

// ======================================================
// GET CURRENT USER PROFILE
// ======================================================
const getProfile = async (req, res) => {
    try {

        // --------------------------------------------------
        // FIND USER BY VERIFIED JWT ID
        // --------------------------------------------------
        const [users] =
            await promiseDb.query(
                `
                SELECT
                    id,
                    full_name,
                    email,
                    phone,
                    address,
                    role
                FROM users
                WHERE id = ?
                LIMIT 1
                `,
                [req.user.id]
            );

        if (
            !users ||
            users.length === 0
        ) {
            return res.status(404).json({
                success: false,
                message:
                    "User not found"
            });
        }

        const user =
            users[0];

        // --------------------------------------------------
        // BUILD SECURE RESPONSE
        // --------------------------------------------------
        return res.status(200).json({
            success: true,

            user:
                buildUserResponse(
                    user,
                    user.role
                )
        });

    } catch (error) {

        console.error(
            "Get profile error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Server error fetching profile"
        });
    }
};

// ======================================================
// EXPORTS
// ======================================================
module.exports = {
    register,
    login,
    googleLogin,
    chooseRole,
    getProfile
};

