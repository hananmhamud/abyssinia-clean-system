
const express = require("express");

const router = express.Router();

const {
    createReceipt,
    getAllReceipts,
    getReceiptById,
    getMyReceipts,
    deleteReceipt
} = require("../controllers/receiptController");

const authMiddleware =
    require("../middlewares/authMiddleware");

// ======================================================
// RECEIPT ROUTES
// ======================================================

// CUSTOMER
// Get current customer's receipts
router.get(
    "/my",
    authMiddleware,
    getMyReceipts
);


// ADMIN
// Get all receipts
router.get(
    "/",
    authMiddleware,
    getAllReceipts
);


// ADMIN
// Generate receipt for a paid payment
router.post(
    "/payment/:paymentId",
    authMiddleware,
    createReceipt
);


// ADMIN OR CUSTOMER OWNER
// Get one receipt
router.get(
    "/:id",
    authMiddleware,
    getReceiptById
);


// ADMIN
// Delete receipt
router.delete(
    "/:id",
    authMiddleware,
    deleteReceipt
);


module.exports = router;

