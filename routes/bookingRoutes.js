const express = require("express");

const router = express.Router();

const verifyToken = require("../middlewares/authMiddleware");
const isAdmin = require("../middlewares/adminMiddleware");

const {
    createBooking,
    getMyBookings,
    getBookingById,
    cancelBooking,
    getAllBookings,
    updateBookingStatus,
    adminCreateBooking,
    deleteBooking
} = require("../controllers/bookingController");

router.post(
    "/",
    verifyToken,
    createBooking
);

router.get(
    "/my-bookings",
    verifyToken,
    getMyBookings
);

router.get(
    "/all",
    verifyToken,
    isAdmin,
    getAllBookings
);

router.get(
    "/:id",
    verifyToken,
    getBookingById
);

router.put(
    "/:id/cancel",
    verifyToken,
    cancelBooking
);

router.put(
    "/:id/status",
    verifyToken,
    isAdmin,
    updateBookingStatus
);

router.post(
    "/admin/add",
    verifyToken,
    isAdmin,
    adminCreateBooking
);

router.delete(
    "/:id",
    verifyToken,
    isAdmin,
    deleteBooking
);

module.exports = router;