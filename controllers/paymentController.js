
const db = require("../config/db");

// ======================================================
// MYSQL PROMISE CONNECTION
// ======================================================

const promiseDb =
    typeof db.promise === "function"
        ? db.promise()
        : db;


// ======================================================
// PAYMENT OPTIONS
// ======================================================

const allowedPaymentMethods = [
    "cash",
    "telebirr",
    "cbe",
    "chapa"
];

const allowedPaymentStatuses = [
    "pending",
    "paid",
    "failed"
];


// ======================================================
// HELPERS
// ======================================================

const normalizePaymentMethod = (method) => {
    if (!method) return "cash";

    return String(method)
        .trim()
        .toLowerCase();
};


const normalizePaymentStatus = (status) => {
    if (!status) return "pending";

    return String(status)
        .trim()
        .toLowerCase();
};


const isAdmin = (req) => {
    return (
        req.user &&
        (
            req.user.isAdmin === true ||
            req.user.role === "admin"
        )
    );
};


// ======================================================
// GET ALL PAYMENTS
// ADMIN ONLY
// GET /api/payments
// ======================================================

const getAllPayments = async (req, res) => {
    try {
        if (!isAdmin(req)) {
            return res.status(403).json({
                success: false,
                message: "Admin access required"
            });
        }

        const [payments] = await promiseDb.query(`
            SELECT
                p.id,
                p.booking_id,
                p.amount,
                p.payment_method,
                p.payment_status,
                p.payment_date
            FROM payments p
            ORDER BY p.id DESC
        `);

        return res.status(200).json({
            success: true,
            count: payments.length,
            payments
        });

    } catch (error) {
        console.error("Get all payments error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error fetching payments"
        });
    }
};


// ======================================================
// GET PAYMENT BY ID
// ADMIN OR OWNER
// GET /api/payments/:id
// ======================================================

const getPaymentById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Payment ID is required"
            });
        }

        const [payments] = await promiseDb.query(`
            SELECT
                p.id,
                p.booking_id,
                p.amount,
                p.payment_method,
                p.payment_status,
                p.payment_date
            FROM payments p
            WHERE p.id = ?
            LIMIT 1
        `, [id]);

        if (payments.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Payment not found"
            });
        }

        const payment = payments[0];

        // ------------------------------------------------
        // ADMIN CAN VIEW ANY PAYMENT
        // ------------------------------------------------

        if (isAdmin(req)) {
            return res.status(200).json({
                success: true,
                payment
            });
        }

        // ------------------------------------------------
        // CUSTOMER OWNERSHIP CHECK
        // ------------------------------------------------

        const [bookings] = await promiseDb.query(`
            SELECT customer_id
            FROM bookings
            WHERE id = ?
            LIMIT 1
        `, [payment.booking_id]);

        if (bookings.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Associated booking not found"
            });
        }

        if (
            Number(bookings[0].customer_id) !==
            Number(req.user.id)
        ) {
            return res.status(403).json({
                success: false,
                message: "You do not have permission to view this payment"
            });
        }

        return res.status(200).json({
            success: true,
            payment
        });

    } catch (error) {
        console.error("Get payment error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error fetching payment"
        });
    }
};


// ======================================================
// GET CURRENT CUSTOMER PAYMENTS
// GET /api/payments/my
// ======================================================

const getMyPayments = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        const [payments] = await promiseDb.query(`
            SELECT
                p.id,
                p.booking_id,
                p.amount,
                p.payment_method,
                p.payment_status,
                p.payment_date
            FROM payments p
            INNER JOIN bookings b
                ON p.booking_id = b.id
            WHERE b.customer_id = ?
            ORDER BY p.id DESC
        `, [req.user.id]);

        return res.status(200).json({
            success: true,
            count: payments.length,
            payments
        });

    } catch (error) {
        console.error("Get my payments error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error fetching your payments"
        });
    }
};


// ======================================================
// CREATE PAYMENT
// CUSTOMER OR ADMIN
// POST /api/payments
// ======================================================

const createPayment = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        const {
            booking_id,
            amount,
            payment_method
        } = req.body;

        // ------------------------------------------------
        // VALIDATE BOOKING ID
        // ------------------------------------------------

        if (!booking_id) {
            return res.status(400).json({
                success: false,
                message: "Booking ID is required"
            });
        }

        // ------------------------------------------------
        // VALIDATE AMOUNT
        // ------------------------------------------------

        if (
            amount === undefined ||
            amount === null ||
            Number.isNaN(Number(amount)) ||
            Number(amount) <= 0
        ) {
            return res.status(400).json({
                success: false,
                message: "A valid payment amount is required"
            });
        }

        // ------------------------------------------------
        // VALIDATE PAYMENT METHOD
        // ------------------------------------------------

        const method =
            normalizePaymentMethod(payment_method);

        if (!allowedPaymentMethods.includes(method)) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid payment method. Use cash, telebirr, cbe, or chapa."
            });
        }

        // ------------------------------------------------
        // CHECK BOOKING
        // ------------------------------------------------

        const [bookings] = await promiseDb.query(`
            SELECT
                id,
                customer_id,
                service_id,
                booking_date,
                booking_time,
                status
            FROM bookings
            WHERE id = ?
            LIMIT 1
        `, [booking_id]);

        if (bookings.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        const booking = bookings[0];

        // ------------------------------------------------
        // CUSTOMER OWNERSHIP
        // ------------------------------------------------

        if (
            !isAdmin(req) &&
            Number(booking.customer_id) !==
            Number(req.user.id)
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "You can only pay for your own booking"
            });
        }

        // ------------------------------------------------
        // CHECK IF ALREADY PAID
        // ------------------------------------------------

        const [paidPayments] = await promiseDb.query(`
            SELECT id
            FROM payments
            WHERE booking_id = ?
            AND payment_status = 'paid'
            LIMIT 1
        `, [booking_id]);

        if (paidPayments.length > 0) {
            return res.status(409).json({
                success: false,
                message: "This booking has already been paid"
            });
        }

        // ------------------------------------------------
        // CREATE PAYMENT
        // ------------------------------------------------

        const [result] = await promiseDb.query(`
            INSERT INTO payments
            (
                booking_id,
                amount,
                payment_method,
                payment_status
            )
            VALUES (?, ?, ?, 'pending')
        `, [
            booking_id,
            Number(amount),
            method
        ]);

        // ------------------------------------------------
        // FETCH CREATED PAYMENT
        // ------------------------------------------------

        const [payments] = await promiseDb.query(`
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
        `, [result.insertId]);

        return res.status(201).json({
            success: true,
            message: "Payment created successfully",
            payment: payments[0]
        });

    } catch (error) {
        console.error("Create payment error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error creating payment"
        });
    }
};


// ======================================================
// UPDATE PAYMENT
// ADMIN ONLY
// PUT /api/payments/:id
// ======================================================

const updatePayment = async (req, res) => {
    try {
        if (!isAdmin(req)) {
            return res.status(403).json({
                success: false,
                message: "Admin access required"
            });
        }

        const { id } = req.params;

        const {
            amount,
            payment_method,
            payment_status
        } = req.body;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Payment ID is required"
            });
        }

        // ------------------------------------------------
        // FIND PAYMENT
        // ------------------------------------------------

        const [existing] = await promiseDb.query(`
            SELECT *
            FROM payments
            WHERE id = ?
            LIMIT 1
        `, [id]);

        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Payment not found"
            });
        }

        const payment = existing[0];

        // ------------------------------------------------
        // AMOUNT
        // ------------------------------------------------

        let newAmount = payment.amount;

        if (amount !== undefined) {
            if (
                Number.isNaN(Number(amount)) ||
                Number(amount) <= 0
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Payment amount must be greater than zero"
                });
            }

            newAmount = Number(amount);
        }

        // ------------------------------------------------
        // METHOD
        // ------------------------------------------------

        let newMethod =
            payment.payment_method;

        if (payment_method !== undefined) {
            newMethod =
                normalizePaymentMethod(payment_method);

            if (!allowedPaymentMethods.includes(newMethod)) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Invalid payment method. Use cash, telebirr, cbe, or chapa."
                });
            }
        }

        // ------------------------------------------------
        // STATUS
        // ------------------------------------------------

        let newStatus =
            payment.payment_status;

        if (payment_status !== undefined) {
            newStatus =
                normalizePaymentStatus(payment_status);

            if (!allowedPaymentStatuses.includes(newStatus)) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Invalid payment status. Use pending, paid, or failed."
                });
            }
        }

        // ------------------------------------------------
        // UPDATE
        // ------------------------------------------------

        await promiseDb.query(`
            UPDATE payments
            SET
                amount = ?,
                payment_method = ?,
                payment_status = ?
            WHERE id = ?
        `, [
            newAmount,
            newMethod,
            newStatus,
            id
        ]);

        // ------------------------------------------------
        // FETCH UPDATED PAYMENT
        // ------------------------------------------------

        const [updated] = await promiseDb.query(`
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
        `, [id]);

        return res.status(200).json({
            success: true,
            message: "Payment updated successfully",
            payment: updated[0]
        });

    } catch (error) {
        console.error("Update payment error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error updating payment"
        });
    }
};


// ======================================================
// MARK PAYMENT AS PAID
// ADMIN ONLY
// PATCH /api/payments/:id/paid
// ======================================================

const markPaymentAsPaid = async (req, res) => {
    try {
        if (!isAdmin(req)) {
            return res.status(403).json({
                success: false,
                message: "Admin access required"
            });
        }

        const { id } = req.params;

        const [payments] = await promiseDb.query(`
            SELECT *
            FROM payments
            WHERE id = ?
            LIMIT 1
        `, [id]);

        if (payments.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Payment not found"
            });
        }

        await promiseDb.query(`
            UPDATE payments
            SET payment_status = 'paid'
            WHERE id = ?
        `, [id]);

        const [updated] = await promiseDb.query(`
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
        `, [id]);

        return res.status(200).json({
            success: true,
            message: "Payment marked as paid successfully",
            payment: updated[0]
        });

    } catch (error) {
        console.error("Mark payment as paid error:", error);

        return res.status(500).json({
            success: false,
            message:
                "Server error marking payment as paid"
        });
    }
};


// ======================================================
// DELETE PAYMENT
// ADMIN ONLY
// DELETE /api/payments/:id
// ======================================================

const deletePayment = async (req, res) => {
    try {
        if (!isAdmin(req)) {
            return res.status(403).json({
                success: false,
                message: "Admin access required"
            });
        }

        const { id } = req.params;

        const [payments] = await promiseDb.query(`
            SELECT id
            FROM payments
            WHERE id = ?
            LIMIT 1
        `, [id]);

        if (payments.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Payment not found"
            });
        }

        await promiseDb.query(`
            DELETE FROM payments
            WHERE id = ?
        `, [id]);

        return res.status(200).json({
            success: true,
            message: "Payment deleted successfully"
        });

    } catch (error) {
        console.error("Delete payment error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error deleting payment"
        });
    }
};


// ======================================================
// PAYMENT SUMMARY
// ADMIN ONLY
// GET /api/payments/summary
// ======================================================

const getPaymentSummary = async (req, res) => {
    try {
        if (!isAdmin(req)) {
            return res.status(403).json({
                success: false,
                message: "Admin access required"
            });
        }

        const [summary] = await promiseDb.query(`
            SELECT
                COUNT(*) AS total_payments,

                COALESCE(
                    SUM(
                        CASE
                            WHEN payment_status = 'paid'
                            THEN amount
                            ELSE 0
                        END
                    ),
                    0
                ) AS paid_revenue,

                COALESCE(
                    SUM(
                        CASE
                            WHEN payment_status = 'pending'
                            THEN amount
                            ELSE 0
                        END
                    ),
                    0
                ) AS pending_amount,

                COALESCE(
                    SUM(
                        CASE
                            WHEN payment_status = 'failed'
                            THEN amount
                            ELSE 0
                        END
                    ),
                    0
                ) AS failed_amount

            FROM payments
        `);

        const [methods] = await promiseDb.query(`
            SELECT
                payment_method,
                COUNT(*) AS payment_count,
                COALESCE(SUM(amount), 0) AS total_amount
            FROM payments
            WHERE payment_status = 'paid'
            GROUP BY payment_method
            ORDER BY total_amount DESC
        `);

        return res.status(200).json({
            success: true,
            summary: summary[0],
            methods
        });

    } catch (error) {
        console.error("Payment summary error:", error);

        return res.status(500).json({
            success: false,
            message:
                "Server error fetching payment summary"
        });
    }
};


// ======================================================
// EXPORTS
// ======================================================

module.exports = {
    getAllPayments,
    getPaymentById,
    getMyPayments,
    createPayment,
    updatePayment,
    markPaymentAsPaid,
    deletePayment,
    getPaymentSummary
};

