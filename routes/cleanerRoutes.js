const express = require("express");

const router = express.Router();

const verifyToken = require("../middlewares/authMiddleware");
const isAdmin = require("../middlewares/adminMiddleware");

const {
    getAllCleaners,
    getCleanerById,
    createCleaner,
    updateCleaner,
    deleteCleaner,
    getCleanerJobs,
    getMyCleanerJobs,
    getMyCleanerProfile,
    assignBooking,
    updateCleanerJobStatus
} = require("../controllers/cleanerController");

// ======================================================
// CLEANER ROUTES
// ======================================================

// ------------------------------------------------------
// IMPORTANT:
// /my/* routes must come BEFORE /:id routes.
// Otherwise Express could interpret "my" as an ID.
// ------------------------------------------------------

// ======================================================
// CLEANER — OWN PROFILE
// GET /api/cleaners/my/profile
// ======================================================

router.get(
    "/my/profile",
    verifyToken,
    getMyCleanerProfile
);

// ======================================================
// CLEANER — OWN JOBS
// GET /api/cleaners/my/jobs
// ======================================================

router.get(
    "/my/jobs",
    verifyToken,
    getMyCleanerJobs
);

// ======================================================
// CLEANER — UPDATE JOB STATUS
// PUT /api/cleaners/jobs/:assignmentId/status
// ======================================================

router.put(
    "/jobs/:assignmentId/status",
    verifyToken,
    updateCleanerJobStatus
);

// ======================================================
// ADMIN — GET ALL CLEANERS
// GET /api/cleaners
// ======================================================

router.get(
    "/",
    verifyToken,
    isAdmin,
    getAllCleaners
);

// ======================================================
// ADMIN — CREATE CLEANER
// POST /api/cleaners
// ======================================================

router.post(
    "/",
    verifyToken,
    isAdmin,
    createCleaner
);

// ======================================================
// ADMIN — ASSIGN BOOKING TO CLEANER
// POST /api/cleaners/assign
// ======================================================

router.post(
    "/assign",
    verifyToken,
    isAdmin,
    assignBooking
);

// ======================================================
// ADMIN — GET CLEANER JOBS
// GET /api/cleaners/:id/jobs
// ======================================================

router.get(
    "/:id/jobs",
    verifyToken,
    isAdmin,
    getCleanerJobs
);

// ======================================================
// ADMIN — GET SINGLE CLEANER
// GET /api/cleaners/:id
// ======================================================

router.get(
    "/:id",
    verifyToken,
    isAdmin,
    getCleanerById
);

// ======================================================
// ADMIN — UPDATE CLEANER
// PUT /api/cleaners/:id
// ======================================================

router.put(
    "/:id",
    verifyToken,
    isAdmin,
    updateCleaner
);

// ======================================================
// ADMIN — DELETE CLEANER
// DELETE /api/cleaners/:id
// ======================================================

router.delete(
    "/:id",
    verifyToken,
    isAdmin,
    deleteCleaner
);

// ======================================================
// EXPORT
// ======================================================

module.exports = router;