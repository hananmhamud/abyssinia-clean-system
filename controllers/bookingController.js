const db = require("../config/db");

const database = db.promise();

const VALID_BOOKING_STATUSES = [
    "pending",
    "confirmed",
    "completed",
    "cancelled"
];

const VALID_SERVICE_TYPES = [
    "Standard Clean",
    "Deep Clean",
    "Post-Construction",
    "VIP Booking"
];

const parseAddons = (addons) => {
    if (!addons) return [];

    if (Array.isArray(addons)) return addons;

    if (typeof addons === "string") {
        try {
            const parsed = JSON.parse(addons);
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return addons
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean);
        }
    }

    return [];
};

const normalizeBooking = (booking) => ({
    ...booking,
    addons: parseAddons(booking.addons)
});

const isAdminUser = (req) =>
    req.user &&
    (
        req.user.isAdmin === true ||
        ["admin", "team_admin", "mentor_admin"].includes(req.user.role)
    );

const createBooking = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                success: false,
                message: "Authentication required."
            });
        }

        const customer_id = req.user.id;

        const {
            service_id,
            service_type,
            bedrooms,
            bathrooms,
            square_footage,
            addons,
            booking_date,
            booking_time,
            address
        } = req.body;

        if (
            !service_id ||
            !service_type ||
            !booking_date ||
            !booking_time ||
            !address
        ) {
            return res.status(400).json({
                success: false,
                message: "Please complete all required booking fields."
            });
        }

        if (!VALID_SERVICE_TYPES.includes(service_type)) {
            return res.status(400).json({
                success: false,
                message: "Invalid service type."
            });
        }

        const [services] = await database.query(
            `
            SELECT id, service_name, price, status
            FROM services
            WHERE id = ?
            LIMIT 1
            `,
            [service_id]
        );

        if (services.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Selected service was not found."
            });
        }

        if (services[0].status === "unavailable") {
            return res.status(400).json({
                success: false,
                message: "The selected service is currently unavailable."
            });
        }

        const normalizedBedrooms =
            bedrooms === "" || bedrooms === undefined || bedrooms === null
                ? null
                : Number(bedrooms);

        const normalizedBathrooms =
            bathrooms === "" || bathrooms === undefined || bathrooms === null
                ? null
                : Number(bathrooms);

        const normalizedSquareFootage =
            square_footage === "" ||
            square_footage === undefined ||
            square_footage === null
                ? null
                : Number(square_footage);

        if (
            normalizedBedrooms !== null &&
            (!Number.isInteger(normalizedBedrooms) || normalizedBedrooms < 0)
        ) {
            return res.status(400).json({
                success: false,
                message: "Bedrooms must be a valid number."
            });
        }

        if (
            normalizedBathrooms !== null &&
            (!Number.isInteger(normalizedBathrooms) || normalizedBathrooms < 0)
        ) {
            return res.status(400).json({
                success: false,
                message: "Bathrooms must be a valid number."
            });
        }

        if (
            normalizedSquareFootage !== null &&
            (!Number.isInteger(normalizedSquareFootage) ||
                normalizedSquareFootage < 0)
        ) {
            return res.status(400).json({
                success: false,
                message: "Square footage must be a valid number."
            });
        }

        const normalizedAddons = parseAddons(addons);

        const [result] = await database.query(
            `
            INSERT INTO bookings
            (
                customer_id,
                service_id,
                booking_date,
                booking_time,
                address,
                bedrooms,
                bathrooms,
                square_footage,
                service_type,
                addons,
                status
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
            `,
            [
                customer_id,
                service_id,
                booking_date,
                booking_time,
                String(address).trim(),
                normalizedBedrooms,
                normalizedBathrooms,
                normalizedSquareFootage,
                service_type,
                JSON.stringify(normalizedAddons)
            ]
        );

        return res.status(201).json({
            success: true,
            message: "Booking created successfully!",
            bookingId: result.insertId
        });
    } catch (error) {
        console.error("Create booking error:", error);

        return res.status(500).json({
            success: false,
            message: "Database error while creating booking.",
            error: error.message
        });
    }
};

const getMyBookings = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                success: false,
                message: "Authentication required."
            });
        }

        const [results] = await database.query(
            `
            SELECT
                b.id,
                b.customer_id,
                b.service_id,
                s.service_name,
                s.price,
                s.duration_hours,
                b.booking_date,
                b.booking_time,
                b.address,
                b.bedrooms,
                b.bathrooms,
                b.square_footage,
                b.service_type,
                b.addons,
                b.status,
                b.created_at
            FROM bookings b
            INNER JOIN services s ON b.service_id = s.id
            WHERE b.customer_id = ?
            ORDER BY
                b.booking_date DESC,
                b.booking_time DESC,
                b.id DESC
            `,
            [req.user.id]
        );

        return res.status(200).json(results.map(normalizeBooking));
    } catch (error) {
        console.error("Get customer bookings error:", error);

        return res.status(500).json({
            success: false,
            message: "Database error while loading bookings.",
            error: error.message
        });
    }
};

const getBookingById = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                success: false,
                message: "Authentication required."
            });
        }

        const [results] = await database.query(
            `
            SELECT
                b.id,
                b.customer_id,
                u.full_name,
                u.email,
                u.phone,
                b.service_id,
                s.service_name,
                s.price,
                s.duration_hours,
                b.booking_date,
                b.booking_time,
                b.address,
                b.bedrooms,
                b.bathrooms,
                b.square_footage,
                b.service_type,
                b.addons,
                b.status,
                b.created_at
            FROM bookings b
            INNER JOIN users u ON b.customer_id = u.id
            INNER JOIN services s ON b.service_id = s.id
            WHERE b.id = ?
            LIMIT 1
            `,
            [req.params.id]
        );

        if (results.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Booking not found."
            });
        }

        const booking = normalizeBooking(results[0]);

        if (
            !isAdminUser(req) &&
            Number(booking.customer_id) !== Number(req.user.id)
        ) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to view this booking."
            });
        }

        return res.status(200).json({
            success: true,
            booking
        });
    } catch (error) {
        console.error("Get booking error:", error);

        return res.status(500).json({
            success: false,
            message: "Database error while loading booking.",
            error: error.message
        });
    }
};

const cancelBooking = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                success: false,
                message: "Authentication required."
            });
        }

        const [result] = await database.query(
            `
            UPDATE bookings
            SET status = 'cancelled'
            WHERE
                id = ?
                AND customer_id = ?
                AND status NOT IN ('cancelled', 'completed')
            `,
            [req.params.id, req.user.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Booking not found or it cannot be cancelled."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Booking cancelled successfully!"
        });
    } catch (error) {
        console.error("Cancel booking error:", error);

        return res.status(500).json({
            success: false,
            message: "Database error while cancelling booking.",
            error: error.message
        });
    }
};

const getAllBookings = async (req, res) => {
    try {
        const [results] = await database.query(
            `
            SELECT
                b.id,
                b.customer_id,
                u.full_name,
                u.email,
                u.phone,
                u.address AS customer_address,
                b.service_id,
                s.service_name,
                s.price,
                s.duration_hours,
                b.booking_date,
                b.booking_time,
                b.address,
                b.bedrooms,
                b.bathrooms,
                b.square_footage,
                b.service_type,
                b.addons,
                b.status,
                b.created_at,

                (
                    SELECT p.id
                    FROM payments p
                    WHERE p.booking_id = b.id
                    ORDER BY p.id DESC
                    LIMIT 1
                ) AS payment_id,

                (
                    SELECT p.amount
                    FROM payments p
                    WHERE p.booking_id = b.id
                    ORDER BY p.id DESC
                    LIMIT 1
                ) AS payment_amount,

                (
                    SELECT p.payment_method
                    FROM payments p
                    WHERE p.booking_id = b.id
                    ORDER BY p.id DESC
                    LIMIT 1
                ) AS payment_method,

                (
                    SELECT p.payment_status
                    FROM payments p
                    WHERE p.booking_id = b.id
                    ORDER BY p.id DESC
                    LIMIT 1
                ) AS payment_status,

                (
                    SELECT p.payment_date
                    FROM payments p
                    WHERE p.booking_id = b.id
                    ORDER BY p.id DESC
                    LIMIT 1
                ) AS payment_date,

                (
                    SELECT r.id
                    FROM receipts r
                    WHERE r.booking_id = b.id
                    ORDER BY r.id DESC
                    LIMIT 1
                ) AS receipt_id,

                (
                    SELECT r.receipt_number
                    FROM receipts r
                    WHERE r.booking_id = b.id
                    ORDER BY r.id DESC
                    LIMIT 1
                ) AS receipt_number

            FROM bookings b
            INNER JOIN users u ON b.customer_id = u.id
            INNER JOIN services s ON b.service_id = s.id
            ORDER BY
                b.booking_date DESC,
                b.booking_time DESC,
                b.id DESC
            `
        );

        return res.status(200).json(results.map(normalizeBooking));
    } catch (error) {
        console.error("Get all bookings error:", error);

        return res.status(500).json({
            success: false,
            message: "Database error while loading all bookings.",
            error: error.message
        });
    }
};

const updateBookingStatus = async (req, res) => {
    try {
        const bookingId = req.params.id;
        const status = String(req.body.status || "")
            .trim()
            .toLowerCase();

        if (!status) {
            return res.status(400).json({
                success: false,
                message: "Status is required."
            });
        }

        if (!VALID_BOOKING_STATUSES.includes(status)) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid booking status. Allowed values: pending, confirmed, completed, cancelled."
            });
        }

        const [existing] = await database.query(
            `
            SELECT id
            FROM bookings
            WHERE id = ?
            LIMIT 1
            `,
            [bookingId]
        );

        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Booking not found."
            });
        }

        await database.query(
            `
            UPDATE bookings
            SET status = ?
            WHERE id = ?
            `,
            [status, bookingId]
        );

        return res.status(200).json({
            success: true,
            message: "Booking status updated successfully!",
            bookingId: Number(bookingId),
            status
        });
    } catch (error) {
        console.error("Update booking status error:", error);

        return res.status(500).json({
            success: false,
            message: "Database error during status update.",
            error: error.message
        });
    }
};

const adminCreateBooking = async (req, res) => {
    try {
        const {
            customer_id,
            service_id,
            service_type,
            bedrooms,
            bathrooms,
            square_footage,
            addons,
            booking_date,
            booking_time,
            address
        } = req.body;

        if (
            !customer_id ||
            !service_id ||
            !booking_date ||
            !booking_time ||
            !address
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Customer, service, date, time and address are required fields."
            });
        }

        const [customers] = await database.query(
            `
            SELECT id
            FROM users
            WHERE id = ?
            LIMIT 1
            `,
            [customer_id]
        );

        if (customers.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Customer not found."
            });
        }

        const [services] = await database.query(
            `
            SELECT id, status
            FROM services
            WHERE id = ?
            LIMIT 1
            `,
            [service_id]
        );

        if (services.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Service not found."
            });
        }

        if (services[0].status === "unavailable") {
            return res.status(400).json({
                success: false,
                message: "Selected service is unavailable."
            });
        }

        const normalizedServiceType =
            service_type || "Standard Clean";

        if (!VALID_SERVICE_TYPES.includes(normalizedServiceType)) {
            return res.status(400).json({
                success: false,
                message: "Invalid service type."
            });
        }

        const normalizedAddons = parseAddons(addons);

        const [result] = await database.query(
            `
            INSERT INTO bookings
            (
                customer_id,
                service_id,
                service_type,
                booking_date,
                booking_time,
                address,
                bedrooms,
                bathrooms,
                square_footage,
                addons,
                status
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
            `,
            [
                customer_id,
                service_id,
                normalizedServiceType,
                booking_date,
                booking_time,
                String(address).trim(),
                bedrooms || null,
                bathrooms || null,
                square_footage || null,
                JSON.stringify(normalizedAddons)
            ]
        );

        return res.status(201).json({
            success: true,
            message: "Booking added successfully by admin!",
            bookingId: result.insertId
        });
    } catch (error) {
        console.error("Admin create booking error:", error);

        return res.status(500).json({
            success: false,
            message: "Database error while adding booking.",
            error: error.message
        });
    }
};

const deleteBooking = async (req, res) => {
    try {
        const bookingId = req.params.id;

        const [bookings] = await database.query(
            `
            SELECT id
            FROM bookings
            WHERE id = ?
            LIMIT 1
            `,
            [bookingId]
        );

        if (bookings.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Booking not found."
            });
        }

        const [result] = await database.query(
            `
            DELETE FROM bookings
            WHERE id = ?
            `,
            [bookingId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Booking not found."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Booking deleted successfully!",
            bookingId: Number(bookingId)
        });
    } catch (error) {
        console.error("Delete booking error:", error);

        return res.status(500).json({
            success: false,
            message: "Database error while deleting booking.",
            error: error.message
        });
    }
};

module.exports = {
    createBooking,
    getMyBookings,
    getBookingById,
    cancelBooking,
    getAllBookings,
    updateBookingStatus,
    adminCreateBooking,
    deleteBooking
};