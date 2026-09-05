
const db = require("../config/db");

// ======================================================
// MYSQL PROMISE CONNECTION
// ======================================================

const promiseDb =
    typeof db.promise === "function"
        ? db.promise()
        : db;


// ======================================================
// HELPERS
// ======================================================

const isAdmin = (req) => {
    return (
        req.user &&
        (
            req.user.isAdmin === true ||
            req.user.role === "admin"
        )
    );
};


// Generate a unique receipt number
const generateReceiptNumber = () => {
    const timestamp = Date.now();
    const random = Math.floor(1000 + Math.random() * 9000);

    return `AC-${timestamp}-${random}`;
};


// ======================================================
// CREATE RECEIPT
// ADMIN ONLY
// POST /api/receipts/payment/:paymentId
// ======================================================

const createReceipt = async (req, res) => {
    try {
        if (!isAdmin(req)) {
            return res.status(403).json({
                success: false,
                message: "Admin access required"
            });
        }

        const { paymentId } = req.params;

        if (!paymentId) {
            return res.status(400).json({
                success: false,
                message: "Payment ID is required"
            });
        }

        // ----------------------------------------------
        // Find payment
        // ----------------------------------------------

        const [payments] = await promiseDb.query(
            `
            SELECT
                id,
                booking_id,
                amount,
                payment_method,
                payment_status,
                payment_date
            FROM payments
            WHERE id = ?
            LIMIT 1
            `,
            [paymentId]
        );

        if (payments.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Payment not found"
            });
        }

        const payment = payments[0];

        // ----------------------------------------------
        // Receipt only for paid payments
        // ----------------------------------------------

        if (payment.payment_status !== "paid") {
            return res.status(400).json({
                success: false,
                message:
                    "A receipt can only be generated for a paid payment"
            });
        }

        // ----------------------------------------------
        // Check duplicate receipt
        // ----------------------------------------------

        const [existingReceipts] = await promiseDb.query(
            `
            SELECT
                id,
                payment_id,
                booking_id,
                receipt_number,
                issued_at
            FROM receipts
            WHERE payment_id = ?
            LIMIT 1
            `,
            [paymentId]
        );

        if (existingReceipts.length > 0) {
            return res.status(409).json({
                success: false,
                message: "A receipt already exists for this payment",
                receipt: existingReceipts[0]
            });
        }

        // ----------------------------------------------
        // Verify booking exists
        // ----------------------------------------------

        const [bookings] = await promiseDb.query(
            `
            SELECT
                id,
                customer_id,
                service_id,
                booking_date,
                booking_time,
                address,
                status
            FROM bookings
            WHERE id = ?
            LIMIT 1
            `,
            [payment.booking_id]
        );

        if (bookings.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Associated booking not found"
            });
        }

        const booking = bookings[0];

        // ----------------------------------------------
        // Generate receipt number
        // ----------------------------------------------

        const receiptNumber = generateReceiptNumber();

        // ----------------------------------------------
        // Insert receipt
        // ----------------------------------------------

        const [result] = await promiseDb.query(
            `
            INSERT INTO receipts
            (
                payment_id,
                booking_id,
                receipt_number
            )
            VALUES (?, ?, ?)
            `,
            [
                payment.id,
                booking.id,
                receiptNumber
            ]
        );

        // ----------------------------------------------
        // Get created receipt
        // ----------------------------------------------

        const [receipts] = await promiseDb.query(
            `
            SELECT
                id,
                payment_id,
                booking_id,
                receipt_number,
                issued_at
            FROM receipts
            WHERE id = ?
            LIMIT 1
            `,
            [result.insertId]
        );

        return res.status(201).json({
            success: true,
            message: "Receipt generated successfully",
            receipt: receipts[0]
        });

    } catch (error) {
        console.error("Create receipt error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error generating receipt"
        });
    }
};


// ======================================================
// GET ALL RECEIPTS
// ADMIN ONLY
// GET /api/receipts
// ======================================================

const getAllReceipts = async (req, res) => {
    try {
        if (!isAdmin(req)) {
            return res.status(403).json({
                success: false,
                message: "Admin access required"
            });
        }

        const [receipts] = await promiseDb.query(
            `
            SELECT
                r.id,
                r.payment_id,
                r.booking_id,
                r.receipt_number,
                r.issued_at,
                p.amount,
                p.payment_method,
                p.payment_status
            FROM receipts r
            INNER JOIN payments p
                ON r.payment_id = p.id
            ORDER BY r.id DESC
            `
        );

        return res.status(200).json({
            success: true,
            count: receipts.length,
            receipts
        });

    } catch (error) {
        console.error("Get all receipts error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error fetching receipts"
        });
    }
};


// ======================================================
// GET RECEIPT BY ID
// ADMIN OR CUSTOMER OWNER
// GET /api/receipts/:id
// ======================================================

const getReceiptById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Receipt ID is required"
            });
        }

        const [receipts] = await promiseDb.query(
            `
            SELECT
                r.id,
                r.payment_id,
                r.booking_id,
                r.receipt_number,
                r.issued_at,

                p.amount,
                p.payment_method,
                p.payment_status,
                p.payment_date,

                b.customer_id,
                b.service_id,
                b.booking_date,
                b.booking_time,
                b.address,
                b.service_type,
                b.status AS booking_status

            FROM receipts r

            INNER JOIN payments p
                ON r.payment_id = p.id

            INNER JOIN bookings b
                ON r.booking_id = b.id

            WHERE r.id = ?
            LIMIT 1
            `,
            [id]
        );

        if (receipts.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Receipt not found"
            });
        }

        const receipt = receipts[0];

        // Admin can view any receipt
        if (isAdmin(req)) {
            return res.status(200).json({
                success: true,
                receipt
            });
        }

        // Customer can only view their own receipt
        if (
            !req.user ||
            Number(receipt.customer_id) !== Number(req.user.id)
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "You do not have permission to view this receipt"
            });
        }

        return res.status(200).json({
            success: true,
            receipt
        });

    } catch (error) {
        console.error("Get receipt error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error fetching receipt"
        });
    }
};


// ======================================================
// GET MY RECEIPTS
// CUSTOMER
// GET /api/receipts/my
// ======================================================

const getMyReceipts = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        const [receipts] = await promiseDb.query(
            `
            SELECT
                r.id,
                r.payment_id,
                r.booking_id,
                r.receipt_number,
                r.issued_at,

                p.amount,
                p.payment_method,
                p.payment_status,
                p.payment_date

            FROM receipts r

            INNER JOIN payments p
                ON r.payment_id = p.id

            INNER JOIN bookings b
                ON r.booking_id = b.id

            WHERE b.customer_id = ?

            ORDER BY r.id DESC
            `,
            [req.user.id]
        );

        return res.status(200).json({
            success: true,
            count: receipts.length,
            receipts
        });

    } catch (error) {
        console.error("Get my receipts error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error fetching your receipts"
        });
    }
};


// ======================================================
// DELETE RECEIPT
// ADMIN ONLY
// DELETE /api/receipts/:id
// ======================================================

const deleteReceipt = async (req, res) => {
    try {
        if (!isAdmin(req)) {
            return res.status(403).json({
                success: false,
                message: "Admin access required"
            });
        }

        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Receipt ID is required"
            });
        }

        const [receipts] = await promiseDb.query(
            `
            SELECT id
            FROM receipts
            WHERE id = ?
            LIMIT 1
            `,
            [id]
        );

        if (receipts.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Receipt not found"
            });
        }

        await promiseDb.query(
            `
            DELETE FROM receipts
            WHERE id = ?
            `,
            [id]
        );

        return res.status(200).json({
            success: true,
            message: "Receipt deleted successfully"
        });

    } catch (error) {
        console.error("Delete receipt error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error deleting receipt"
        });
    }
};


// ======================================================
// EXPORTS
// ======================================================

module.exports = {
    createReceipt,
    getAllReceipts,
    getReceiptById,
    getMyReceipts,
    deleteReceipt
};

