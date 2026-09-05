
const express = require("express");

const router = express.Router();

const {
    getAllPayments,
    getPaymentById,
    getMyPayments,
    createPayment,
    updatePayment,
    markPaymentAsPaid,
    deletePayment,
    getPaymentSummary
} = require("../controllers/paymentController");

const authMiddleware =
    require("../middlewares/authMiddleware");


// ======================================================
// CUSTOMER PAYMENT ROUTES
// ======================================================

// Get payments belonging to logged-in customer
router.get(
    "/my",
    authMiddleware,
    getMyPayments
);


// Create a payment
router.post(
    "/",
    authMiddleware,
    createPayment
);


// ======================================================
// ADMIN PAYMENT ROUTES
// ======================================================

// Get payment summary
// IMPORTANT: Must come before /:id
router.get(
    "/summary",
    authMiddleware,
    getPaymentSummary
);


// Get all payments
router.get(
    "/",
    authMiddleware,
    getAllPayments
);


// ======================================================
// PAYMENT BY ID
// ======================================================

// Get one payment
router.get(
    "/:id",
    authMiddleware,
    getPaymentById
);


// Update payment
router.put(
    "/:id",
    authMiddleware,
    updatePayment
);


// Mark payment as paid
router.patch(
    "/:id/paid",
    authMiddleware,
    markPaymentAsPaid
);


// Delete payment
router.delete(
    "/:id",
    authMiddleware,
    deletePayment
);


// ======================================================
// EXPORT
// ======================================================

module.exports = router;

