const bcrypt = require("bcrypt");
const db = require("../config/db");

const database = typeof db.promise === "function" ? db.promise() : db;

// ======================================================
// HELPER — ADMIN CHECK
// ======================================================

const isAdminUser = (req) => {
    if (!req.user) {
        return false;
    }

    return (
        req.user.isAdmin === true ||
        ["admin", "team_admin", "mentor_admin"].includes(req.user.role)
    );
};

// ======================================================
// GET ALL CLEANERS
// GET /api/cleaners
// ADMIN ONLY
// ======================================================

const getAllCleaners = async (req, res) => {
    try {

        if (!isAdminUser(req)) {
            return res.status(403).json({
                success: false,
                message: "Access denied. Admins only."
            });
        }

        const [cleaners] = await database.query(`
            SELECT
                u.id,
                u.full_name,
                u.email,
                u.phone,
                u.address,
                u.profile_image,
                u.created_at,

                COUNT(DISTINCT ba.id) AS total_assignments,

                COUNT(
                    DISTINCT CASE
                        WHEN ba.assignment_status = 'completed'
                        THEN ba.id
                    END
                ) AS completed_jobs,

                COUNT(
                    DISTINCT CASE
                        WHEN ba.assignment_status IN
                        ('assigned', 'accepted', 'in_progress')
                        THEN ba.id
                    END
                ) AS active_jobs,

                COALESCE(
                    AVG(
                        CASE
                            WHEN r.rating IS NOT NULL
                            THEN r.rating
                        END
                    ),
                    0
                ) AS average_rating

            FROM users u

            LEFT JOIN booking_assignments ba
                ON ba.cleaner_id = u.id

            LEFT JOIN reviews r
                ON r.booking_id = ba.booking_id

            WHERE u.role = 'cleaner'

            GROUP BY
                u.id,
                u.full_name,
                u.email,
                u.phone,
                u.address,
                u.profile_image,
                u.created_at

            ORDER BY u.created_at DESC
        `);

        const formattedCleaners = cleaners.map((cleaner) => {

            const activeJobs = Number(cleaner.active_jobs || 0);

            return {
                id: cleaner.id,
                full_name: cleaner.full_name,
                email: cleaner.email,
                phone: cleaner.phone,
                address: cleaner.address,
                profile_image: cleaner.profile_image,
                created_at: cleaner.created_at,

                total_assignments:
                    Number(cleaner.total_assignments || 0),

                completed_jobs:
                    Number(cleaner.completed_jobs || 0),

                active_jobs:
                    activeJobs,

                average_rating:
                    Number(
                        Number(cleaner.average_rating || 0).toFixed(2)
                    ),

                // Derived from real assignment data.
                status:
                    activeJobs > 0
                        ? "On Job"
                        : "Available"
            };
        });

        return res.status(200).json({
            success: true,
            count: formattedCleaners.length,
            cleaners: formattedCleaners
        });

    } catch (error) {

        console.error(
            "Get all cleaners error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to retrieve cleaners.",
            error: error.message
        });
    }
};

// ======================================================
// GET SINGLE CLEANER
// GET /api/cleaners/:id
// ADMIN ONLY
// ======================================================

const getCleanerById = async (req, res) => {
    try {

        if (!isAdminUser(req)) {
            return res.status(403).json({
                success: false,
                message: "Access denied. Admins only."
            });
        }

        const cleanerId = Number(req.params.id);

        if (!Number.isInteger(cleanerId) || cleanerId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid cleaner ID."
            });
        }

        const [cleaners] = await database.query(
            `
            SELECT
                u.id,
                u.full_name,
                u.email,
                u.phone,
                u.address,
                u.profile_image,
                u.created_at
            FROM users u
            WHERE u.id = ?
              AND u.role = 'cleaner'
            LIMIT 1
            `,
            [cleanerId]
        );

        if (cleaners.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Cleaner not found."
            });
        }

        const [stats] = await database.query(
            `
            SELECT
                COUNT(*) AS total_assignments,

                SUM(
                    assignment_status = 'completed'
                ) AS completed_jobs,

                SUM(
                    assignment_status IN
                    ('assigned', 'accepted', 'in_progress')
                ) AS active_jobs

            FROM booking_assignments

            WHERE cleaner_id = ?
            `,
            [cleanerId]
        );

        const cleaner = cleaners[0];
        const cleanerStats = stats[0] || {};

        const activeJobs =
            Number(cleanerStats.active_jobs || 0);

        return res.status(200).json({
            success: true,

            cleaner: {
                ...cleaner,

                total_assignments:
                    Number(
                        cleanerStats.total_assignments || 0
                    ),

                completed_jobs:
                    Number(
                        cleanerStats.completed_jobs || 0
                    ),

                active_jobs:
                    activeJobs,

                status:
                    activeJobs > 0
                        ? "On Job"
                        : "Available"
            }
        });

    } catch (error) {

        console.error(
            "Get cleaner error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to retrieve cleaner.",
            error: error.message
        });
    }
};

// ======================================================
// CREATE CLEANER
// POST /api/cleaners
// ADMIN ONLY
// ======================================================

const createCleaner = async (req, res) => {
    try {

        if (!isAdminUser(req)) {
            return res.status(403).json({
                success: false,
                message: "Access denied. Admins only."
            });
        }

        const {
            full_name,
            email,
            password,
            phone,
            address,
            profile_image
        } = req.body;

        if (!full_name || !email || !password) {
            return res.status(400).json({
                success: false,
                message:
                    "Full name, email, and password are required."
            });
        }

        const normalizedEmail =
            String(email).trim().toLowerCase();

        if (normalizedEmail.length > 100) {
            return res.status(400).json({
                success: false,
                message: "Email address is too long."
            });
        }

        if (String(password).length < 6) {
            return res.status(400).json({
                success: false,
                message:
                    "Cleaner password must be at least 6 characters."
            });
        }

        const [existingUsers] = await database.query(
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
                    "A user with this email already exists."
            });
        }

        const hashedPassword =
            await bcrypt.hash(
                String(password),
                10
            );

        const [result] = await database.query(
            `
            INSERT INTO users
            (
                full_name,
                email,
                phone,
                password,
                role,
                address,
                profile_image
            )
            VALUES (?, ?, ?, ?, 'cleaner', ?, ?)
            `,
            [
                String(full_name).trim(),
                normalizedEmail,
                phone || null,
                hashedPassword,
                address || null,
                profile_image || null
            ]
        );

        const [newCleaner] = await database.query(
            `
            SELECT
                id,
                full_name,
                email,
                phone,
                address,
                profile_image,
                role,
                created_at
            FROM users
            WHERE id = ?
            LIMIT 1
            `,
            [result.insertId]
        );

        return res.status(201).json({
            success: true,
            message: "Cleaner created successfully.",
            cleaner: newCleaner[0]
        });

    } catch (error) {

        console.error(
            "Create cleaner error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to create cleaner.",
            error: error.message
        });
    }
};

// ======================================================
// UPDATE CLEANER
// PUT /api/cleaners/:id
// ADMIN ONLY
// ======================================================

const updateCleaner = async (req, res) => {
    try {

        if (!isAdminUser(req)) {
            return res.status(403).json({
                success: false,
                message: "Access denied. Admins only."
            });
        }

        const cleanerId = Number(req.params.id);

        if (!Number.isInteger(cleanerId) || cleanerId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid cleaner ID."
            });
        }

        const {
            full_name,
            email,
            phone,
            address,
            profile_image,
            password
        } = req.body;

        const [existing] = await database.query(
            `
            SELECT id, email
            FROM users
            WHERE id = ?
              AND role = 'cleaner'
            LIMIT 1
            `,
            [cleanerId]
        );

        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Cleaner not found."
            });
        }

        let normalizedEmail =
            existing[0].email;

        if (email !== undefined) {

            normalizedEmail =
                String(email).trim().toLowerCase();

            const [emailOwner] =
                await database.query(
                    `
                    SELECT id
                    FROM users
                    WHERE email = ?
                      AND id <> ?
                    LIMIT 1
                    `,
                    [
                        normalizedEmail,
                        cleanerId
                    ]
                );

            if (emailOwner.length > 0) {
                return res.status(409).json({
                    success: false,
                    message:
                        "Another user already uses this email."
                });
            }
        }

        let hashedPassword = null;

        if (
            password !== undefined &&
            String(password).trim() !== ""
        ) {

            if (String(password).length < 6) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Password must be at least 6 characters."
                });
            }

            hashedPassword =
                await bcrypt.hash(
                    String(password),
                    10
                );
        }

        if (hashedPassword) {

            await database.query(
                `
                UPDATE users
                SET
                    full_name = ?,
                    email = ?,
                    phone = ?,
                    address = ?,
                    profile_image = ?,
                    password = ?
                WHERE id = ?
                  AND role = 'cleaner'
                `,
                [
                    full_name !== undefined
                        ? String(full_name).trim()
                        : null,

                    normalizedEmail,

                    phone !== undefined
                        ? phone
                        : null,

                    address !== undefined
                        ? address
                        : null,

                    profile_image !== undefined
                        ? profile_image
                        : null,

                    hashedPassword,

                    cleanerId
                ]
            );

        } else {

            await database.query(
                `
                UPDATE users
                SET
                    full_name = ?,
                    email = ?,
                    phone = ?,
                    address = ?,
                    profile_image = ?
                WHERE id = ?
                  AND role = 'cleaner'
                `,
                [
                    full_name !== undefined
                        ? String(full_name).trim()
                        : null,

                    normalizedEmail,

                    phone !== undefined
                        ? phone
                        : null,

                    address !== undefined
                        ? address
                        : null,

                    profile_image !== undefined
                        ? profile_image
                        : null,

                    cleanerId
                ]
            );
        }

        const [updatedCleaner] =
            await database.query(
                `
                SELECT
                    id,
                    full_name,
                    email,
                    phone,
                    address,
                    profile_image,
                    role,
                    created_at
                FROM users
                WHERE id = ?
                LIMIT 1
                `,
                [cleanerId]
            );

        return res.status(200).json({
            success: true,
            message: "Cleaner updated successfully.",
            cleaner: updatedCleaner[0]
        });

    } catch (error) {

        console.error(
            "Update cleaner error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to update cleaner.",
            error: error.message
        });
    }
};

// ======================================================
// DELETE CLEANER
// DELETE /api/cleaners/:id
// ADMIN ONLY
// ======================================================

const deleteCleaner = async (req, res) => {
    try {

        if (!isAdminUser(req)) {
            return res.status(403).json({
                success: false,
                message: "Access denied. Admins only."
            });
        }

        const cleanerId = Number(req.params.id);

        if (!Number.isInteger(cleanerId) || cleanerId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid cleaner ID."
            });
        }

        const [cleaner] = await database.query(
            `
            SELECT id, full_name
            FROM users
            WHERE id = ?
              AND role = 'cleaner'
            LIMIT 1
            `,
            [cleanerId]
        );

        if (cleaner.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Cleaner not found."
            });
        }

        const [assignments] =
            await database.query(
                `
                SELECT COUNT(*) AS total
                FROM booking_assignments
                WHERE cleaner_id = ?
                `,
                [cleanerId]
            );

        const assignmentCount =
            Number(assignments[0]?.total || 0);

        if (assignmentCount > 0) {
            return res.status(409).json({
                success: false,
                message:
                    "This cleaner has assignment history and cannot be deleted. Update the cleaner instead."
            });
        }

        await database.query(
            `
            DELETE FROM users
            WHERE id = ?
              AND role = 'cleaner'
            `,
            [cleanerId]
        );

        return res.status(200).json({
            success: true,
            message: "Cleaner deleted successfully."
        });

    } catch (error) {

        console.error(
            "Delete cleaner error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to delete cleaner.",
            error: error.message
        });
    }
};

// ======================================================
// GET CLEANER JOBS — ADMIN
// GET /api/cleaners/:id/jobs
// ======================================================

const getCleanerJobs = async (req, res) => {
    try {

        if (!isAdminUser(req)) {
            return res.status(403).json({
                success: false,
                message: "Access denied. Admins only."
            });
        }

        const cleanerId = Number(req.params.id);

        if (!Number.isInteger(cleanerId) || cleanerId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid cleaner ID."
            });
        }

        const [jobs] = await database.query(
            `
            SELECT
                ba.id AS assignment_id,
                ba.booking_id,
                ba.cleaner_id,
                ba.assigned_at,
                ba.assignment_status,

                b.booking_date,
                b.booking_time,
                b.address,
                b.service_type,
                b.status AS booking_status,
                b.bedrooms,
                b.bathrooms,
                b.square_footage,
                b.addons,

                s.id AS service_id,
                s.service_name,
                s.price,
                s.duration_hours,

                customer.id AS customer_id,
                customer.full_name AS customer_name,
                customer.email AS customer_email,
                customer.phone AS customer_phone

            FROM booking_assignments ba

            INNER JOIN bookings b
                ON b.id = ba.booking_id

            INNER JOIN services s
                ON s.id = b.service_id

            INNER JOIN users customer
                ON customer.id = b.customer_id

            WHERE ba.cleaner_id = ?

            ORDER BY
                b.booking_date DESC,
                b.booking_time DESC,
                ba.assigned_at DESC
            `,
            [cleanerId]
        );

        const formattedJobs = jobs.map((job) => {

            let addons = job.addons;

            if (
                typeof addons === "string" &&
                addons.trim() !== ""
            ) {
                try {
                    addons = JSON.parse(addons);
                } catch {
                    // Keep original value if malformed.
                }
            }

            return {
                ...job,
                addons
            };
        });

        return res.status(200).json({
            success: true,
            count: formattedJobs.length,
            jobs: formattedJobs
        });

    } catch (error) {

        console.error(
            "Get cleaner jobs error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to retrieve cleaner jobs.",
            error: error.message
        });
    }
};

// ======================================================
// GET MY CLEANER JOBS
// GET /api/cleaners/my/jobs
// CLEANER ONLY
// ======================================================

const getMyCleanerJobs = async (req, res) => {
    try {

        if (!req.user || !req.user.id) {
            return res.status(401).json({
                success: false,
                message: "Authentication required."
            });
        }

        const cleanerId = Number(req.user.id);

        const [cleaner] = await database.query(
            `
            SELECT id, full_name, email, role
            FROM users
            WHERE id = ?
              AND role = 'cleaner'
            LIMIT 1
            `,
            [cleanerId]
        );

        if (cleaner.length === 0) {
            return res.status(403).json({
                success: false,
                message:
                    "Only cleaner accounts can access cleaner jobs."
            });
        }

        const [jobs] = await database.query(
            `
            SELECT
                ba.id AS assignment_id,
                ba.booking_id,
                ba.cleaner_id,
                ba.assigned_at,
                ba.assignment_status,

                b.booking_date,
                b.booking_time,
                b.address,
                b.service_type,
                b.status AS booking_status,
                b.bedrooms,
                b.bathrooms,
                b.square_footage,
                b.addons,

                s.id AS service_id,
                s.service_name,
                s.price,
                s.duration_hours,

                customer.id AS customer_id,
                customer.full_name AS customer_name,
                customer.email AS customer_email,
                customer.phone AS customer_phone

            FROM booking_assignments ba

            INNER JOIN bookings b
                ON b.id = ba.booking_id

            INNER JOIN services s
                ON s.id = b.service_id

            INNER JOIN users customer
                ON customer.id = b.customer_id

            WHERE ba.cleaner_id = ?

            ORDER BY
                b.booking_date ASC,
                b.booking_time ASC,
                ba.assigned_at DESC
            `,
            [cleanerId]
        );

        const formattedJobs = jobs.map((job) => {

            let addons = job.addons;

            if (
                typeof addons === "string" &&
                addons.trim() !== ""
            ) {
                try {
                    addons = JSON.parse(addons);
                } catch {
                    // Keep original value.
                }
            }

            return {
                ...job,
                addons
            };
        });

        return res.status(200).json({
            success: true,
            cleaner: cleaner[0],
            count: formattedJobs.length,
            jobs: formattedJobs
        });

    } catch (error) {

        console.error(
            "Get my cleaner jobs error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to retrieve your jobs.",
            error: error.message
        });
    }
};

// ======================================================
// GET MY CLEANER PROFILE
// GET /api/cleaners/my/profile
// CLEANER ONLY
// ======================================================

const getMyCleanerProfile = async (req, res) => {
    try {

        if (!req.user || !req.user.id) {
            return res.status(401).json({
                success: false,
                message: "Authentication required."
            });
        }

        const cleanerId = Number(req.user.id);

        const [cleaners] = await database.query(
            `
            SELECT
                id,
                full_name,
                email,
                phone,
                address,
                profile_image,
                role,
                created_at
            FROM users
            WHERE id = ?
              AND role = 'cleaner'
            LIMIT 1
            `,
            [cleanerId]
        );

        if (cleaners.length === 0) {
            return res.status(403).json({
                success: false,
                message: "Cleaner profile not found."
            });
        }

        return res.status(200).json({
            success: true,
            cleaner: cleaners[0]
        });

    } catch (error) {

        console.error(
            "Get cleaner profile error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to retrieve cleaner profile.",
            error: error.message
        });
    }
};

// ======================================================
// ASSIGN BOOKING TO CLEANER
// POST /api/cleaners/assign
// ADMIN ONLY
// ======================================================

const assignBooking = async (req, res) => {

    let connection;

    try {

        if (!isAdminUser(req)) {
            return res.status(403).json({
                success: false,
                message: "Access denied. Admins only."
            });
        }

        const bookingId =
            Number(req.body.booking_id);

        const cleanerId =
            Number(req.body.cleaner_id);

        if (
            !Number.isInteger(bookingId) ||
            bookingId <= 0 ||
            !Number.isInteger(cleanerId) ||
            cleanerId <= 0
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Valid booking_id and cleaner_id are required."
            });
        }

        connection =
            await database.getConnection();

        await connection.beginTransaction();

        // --------------------------------------------------
        // LOCK BOOKING
        // --------------------------------------------------

        const [bookings] =
            await connection.query(
                `
                SELECT
                    id,
                    status
                FROM bookings
                WHERE id = ?
                FOR UPDATE
                `,
                [bookingId]
            );

        if (bookings.length === 0) {

            await connection.rollback();

            return res.status(404).json({
                success: false,
                message: "Booking not found."
            });
        }

        if (
            bookings[0].status === "completed" ||
            bookings[0].status === "cancelled"
        ) {

            await connection.rollback();

            return res.status(409).json({
                success: false,
                message:
                    "Completed or cancelled bookings cannot be assigned."
            });
        }

        // --------------------------------------------------
        // VERIFY CLEANER
        // --------------------------------------------------

        const [cleaners] =
            await connection.query(
                `
                SELECT
                    id,
                    full_name,
                    email
                FROM users
                WHERE id = ?
                  AND role = 'cleaner'
                LIMIT 1
                `,
                [cleanerId]
            );

        if (cleaners.length === 0) {

            await connection.rollback();

            return res.status(404).json({
                success: false,
                message:
                    "Cleaner not found."
            });
        }

        // --------------------------------------------------
        // FIND CURRENT ACTIVE ASSIGNMENT
        // --------------------------------------------------

        const [activeAssignments] =
            await connection.query(
                `
                SELECT
                    id,
                    cleaner_id,
                    assignment_status
                FROM booking_assignments
                WHERE booking_id = ?
                  AND assignment_status IN
                  ('assigned', 'accepted', 'in_progress')
                ORDER BY assigned_at DESC
                LIMIT 1
                FOR UPDATE
                `,
                [bookingId]
            );

        if (
            activeAssignments.length > 0 &&
            Number(
                activeAssignments[0].cleaner_id
            ) === cleanerId
        ) {

            await connection.commit();

            return res.status(200).json({
                success: true,
                message:
                    "This cleaner is already assigned to this booking.",
                assignment: {
                    id: activeAssignments[0].id,
                    booking_id: bookingId,
                    cleaner_id: cleanerId,
                    assignment_status:
                        activeAssignments[0].assignment_status
                }
            });
        }

        // --------------------------------------------------
        // CANCEL PREVIOUS ACTIVE ASSIGNMENT
        // --------------------------------------------------

        if (activeAssignments.length > 0) {

            await connection.query(
                `
                UPDATE booking_assignments
                SET assignment_status = 'cancelled'
                WHERE id = ?
                `,
                [activeAssignments[0].id]
            );
        }

        // --------------------------------------------------
        // CREATE NEW ASSIGNMENT
        // --------------------------------------------------

        const [assignmentResult] =
            await connection.query(
                `
                INSERT INTO booking_assignments
                (
                    booking_id,
                    cleaner_id,
                    assignment_status
                )
                VALUES (?, ?, 'assigned')
                `,
                [
                    bookingId,
                    cleanerId
                ]
            );

        // --------------------------------------------------
        // CONFIRM BOOKING
        // --------------------------------------------------

        if (bookings[0].status === "pending") {

            await connection.query(
                `
                UPDATE bookings
                SET status = 'confirmed'
                WHERE id = ?
                `,
                [bookingId]
            );
        }

        await connection.commit();

        return res.status(201).json({
            success: true,
            message:
                "Cleaner assigned successfully.",

            assignment: {
                id: assignmentResult.insertId,
                booking_id: bookingId,
                cleaner_id: cleanerId,
                cleaner_name:
                    cleaners[0].full_name,
                assignment_status: "assigned"
            }
        });

    } catch (error) {

        if (connection) {
            try {
                await connection.rollback();
            } catch (rollbackError) {
                console.error(
                    "Rollback error:",
                    rollbackError
                );
            }
        }

        console.error(
            "Assign booking error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to assign booking to cleaner.",
            error: error.message
        });

    } finally {

        if (connection) {
            connection.release();
        }
    }
};

// ======================================================
// UPDATE CLEANER JOB STATUS
// PUT /api/cleaners/jobs/:assignmentId/status
// CLEANER ONLY
// ======================================================

const updateCleanerJobStatus = async (req, res) => {

    let connection;

    try {

        if (!req.user || !req.user.id) {
            return res.status(401).json({
                success: false,
                message: "Authentication required."
            });
        }

        const cleanerId =
            Number(req.user.id);

        const assignmentId =
            Number(req.params.assignmentId);

        const requestedStatus =
            String(
                req.body.assignment_status ||
                req.body.status ||
                ""
            )
                .trim()
                .toLowerCase();

        if (
            !Number.isInteger(assignmentId) ||
            assignmentId <= 0
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid assignment ID."
            });
        }

        const allowedStatuses = [
            "assigned",
            "accepted",
            "in_progress",
            "completed"
        ];

        if (!allowedStatuses.includes(requestedStatus)) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid assignment status."
            });
        }

        // --------------------------------------------------
        // VERIFY CLEANER ACCOUNT
        // --------------------------------------------------

        const [cleaner] =
            await database.query(
                `
                SELECT id
                FROM users
                WHERE id = ?
                  AND role = 'cleaner'
                LIMIT 1
                `,
                [cleanerId]
            );

        if (cleaner.length === 0) {
            return res.status(403).json({
                success: false,
                message:
                    "Only cleaner accounts can update cleaner jobs."
            });
        }

        connection =
            await database.getConnection();

        await connection.beginTransaction();

        // --------------------------------------------------
        // LOCK ASSIGNMENT
        // --------------------------------------------------

        const [assignments] =
            await connection.query(
                `
                SELECT
                    ba.id,
                    ba.booking_id,
                    ba.cleaner_id,
                    ba.assignment_status,

                    b.status AS booking_status

                FROM booking_assignments ba

                INNER JOIN bookings b
                    ON b.id = ba.booking_id

                WHERE ba.id = ?
                  AND ba.cleaner_id = ?

                LIMIT 1

                FOR UPDATE
                `,
                [
                    assignmentId,
                    cleanerId
                ]
            );

        if (assignments.length === 0) {

            await connection.rollback();

            return res.status(404).json({
                success: false,
                message:
                    "Cleaner assignment not found."
            });
        }

        const currentStatus =
            assignments[0].assignment_status;

        // --------------------------------------------------
        // VALID STATUS TRANSITIONS
        // --------------------------------------------------

        const validTransitions = {
            assigned: ["assigned", "accepted"],
            accepted: ["accepted", "in_progress"],
            in_progress: ["in_progress", "completed"],
            completed: ["completed"]
        };

        if (
            !validTransitions[currentStatus]
                .includes(requestedStatus)
        ) {

            await connection.rollback();

            return res.status(409).json({
                success: false,
                message:
                    `Invalid status transition: ${currentStatus} → ${requestedStatus}.`
            });
        }

        // --------------------------------------------------
        // UPDATE ASSIGNMENT
        // --------------------------------------------------

        await connection.query(
            `
            UPDATE booking_assignments
            SET assignment_status = ?
            WHERE id = ?
              AND cleaner_id = ?
            `,
            [
                requestedStatus,
                assignmentId,
                cleanerId
            ]
        );

        // --------------------------------------------------
        // UPDATE BOOKING STATUS
        // --------------------------------------------------

        if (requestedStatus === "completed") {

            await connection.query(
                `
                UPDATE bookings
                SET status = 'completed'
                WHERE id = ?
                `,
                [assignments[0].booking_id]
            );

        } else if (
            requestedStatus === "accepted" ||
            requestedStatus === "in_progress"
        ) {

            // The bookings table does not have an
            // "in_progress" enum value.
            // "confirmed" represents the booking
            // while assignment_status tracks actual
            // cleaner progress.

            if (
                assignments[0].booking_status === "pending"
            ) {

                await connection.query(
                    `
                    UPDATE bookings
                    SET status = 'confirmed'
                    WHERE id = ?
                    `,
                    [assignments[0].booking_id]
                );
            }
        }

        await connection.commit();

        return res.status(200).json({
            success: true,
            message:
                "Cleaner job status updated successfully.",

            assignment: {
                id: assignmentId,
                booking_id:
                    assignments[0].booking_id,
                cleaner_id:
                    cleanerId,
                previous_status:
                    currentStatus,
                assignment_status:
                    requestedStatus
            }
        });

    } catch (error) {

        if (connection) {
            try {
                await connection.rollback();
            } catch (rollbackError) {
                console.error(
                    "Rollback error:",
                    rollbackError
                );
            }
        }

        console.error(
            "Update cleaner job status error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to update cleaner job status.",
            error: error.message
        });

    } finally {

        if (connection) {
            connection.release();
        }
    }
};

// ======================================================
// EXPORTS
// ======================================================

module.exports = {
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
};