
const express = require("express");

const router = express.Router();

const {
    register,
    login,
    googleLogin,
    chooseRole,
    getProfile
} = require("../controllers/authController");

const verifyToken =
    require("../middlewares/authMiddleware");

// ======================================================
// REGISTER
// ======================================================

router.post(
    "/register",
    register
);

// ======================================================
// EMAIL / PASSWORD LOGIN
// ======================================================

router.post(
    "/login",
    login
);

// ======================================================
// GOOGLE LOGIN
// ======================================================

router.post(
    "/google",
    googleLogin
);

// ======================================================
// CHOOSE ROLE
// ======================================================
//
// Admin-listed emails can choose:
// ADMIN or CUSTOMER.
//
// Normal users can only choose CUSTOMER.
//

router.post(
    "/choose-role",
    verifyToken,
    chooseRole
);

// ======================================================
// GET CURRENT USER PROFILE
// ======================================================

router.get(
    "/profile",
    verifyToken,
    getProfile
);

// ======================================================
// EXPORT
// ======================================================

module.exports = router;

