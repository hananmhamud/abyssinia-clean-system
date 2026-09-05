
const express = require("express");
const cors = require("cors");

const db = require("./config/db");

// ======================================================
// ROUTES
// ======================================================
const authRoutes = require("./routes/authRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const receiptRoutes = require("./routes/receiptRoutes");
const cleanerRoutes = require("./routes/cleanerRoutes");

// ======================================================
// APP
// ======================================================
const app = express();

// ======================================================
// MIDDLEWARE
// ======================================================

// Allow frontend requests
app.use(cors());

// Allow JSON request bodies
app.use(express.json());

// ======================================================
// API ROUTES
// ======================================================

// Authentication
app.use(
    "/api/auth",
    authRoutes
);

// Services
app.use(
    "/api/services",
    serviceRoutes
);

// Bookings
app.use(
    "/api/bookings",
    bookingRoutes
);

// Payments
app.use(
    "/api/payments",
    paymentRoutes
);

// Receipts
app.use(
    "/api/receipts",
    receiptRoutes
);

// Cleaners / Workforce
app.use(
    "/api/cleaners",
    cleanerRoutes
);

// ======================================================
// TEST ROUTE
// ======================================================

app.get("/", (req, res) => {

    res.status(200).json({
        success: true,
        message: "Cleaning Service Backend is Running 🚀"
    });

});

// ======================================================
// 404 ROUTE
// ======================================================

app.use((req, res) => {

    res.status(404).json({
        success: false,
        message: "API route not found"
    });

});

// ======================================================
// GLOBAL ERROR HANDLER
// ======================================================

app.use((err, req, res, next) => {

    console.error(
        "Server error:",
        err
    );

    res.status(500).json({
        success: false,
        message: "Internal server error"
    });

});

// ======================================================
// SERVER
// ======================================================

const PORT = 5000;

app.listen(PORT, () => {

    console.log(
        `Server running on port ${PORT}`
    );

});

