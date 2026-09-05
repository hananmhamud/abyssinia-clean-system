const express = require("express");
const router = express.Router();

const verifyToken = require("../middlewares/authMiddleware");
const isAdmin = require("../middlewares/adminMiddleware");

const db = require("../config/db");


// =====================================================
// GET ALL SERVICES
// Public route
// =====================================================

router.get("/", (req, res) => {

    const sql = "SELECT * FROM services";

    db.query(sql, (err, results) => {

        if (err) {
            return res.status(500).json({
                message: "Database error",
                error: err
            });
        }

        res.json(results);
    });
});


// =====================================================
// GET SERVICE BY ID
// Public route
// =====================================================

router.get("/:id", (req, res) => {

    const { id } = req.params;

    const sql = "SELECT * FROM services WHERE id = ?";

    db.query(sql, [id], (err, results) => {

        if (err) {
            return res.status(500).json({
                message: "Database error",
                error: err
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: "Service not found"
            });
        }

        res.json(results[0]);
    });
});


// =====================================================
// ADD NEW SERVICE
// Admin only
// =====================================================

router.post("/", verifyToken, isAdmin, (req, res) => {

    const {
        service_name,
        description,
        price,
        duration_hours,
        status
    } = req.body;

    const sql = `
        INSERT INTO services
        (service_name, description, price, duration_hours, status)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            service_name,
            description,
            price,
            duration_hours,
            status
        ],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    message: "Database error",
                    error: err
                });
            }

            res.status(201).json({
                message: "Service added successfully!",
                id: result.insertId
            });
        }
    );
});


// =====================================================
// UPDATE SERVICE
// Admin only
// =====================================================

router.put("/:id", verifyToken, isAdmin, (req, res) => {

    const { id } = req.params;

    const {
        service_name,
        description,
        price,
        duration_hours,
        status
    } = req.body;

    const sql = `
        UPDATE services
        SET
            service_name = ?,
            description = ?,
            price = ?,
            duration_hours = ?,
            status = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [
            service_name,
            description,
            price,
            duration_hours,
            status,
            id
        ],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    message: "Database error",
                    error: err
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Service not found"
                });
            }

            res.json({
                message: "Service updated successfully!"
            });
        }
    );
});


// =====================================================
// DELETE SERVICE
// Admin only
// =====================================================

router.delete("/:id", verifyToken, isAdmin, (req, res) => {

    const { id } = req.params;

    const sql = "DELETE FROM services WHERE id = ?";

    db.query(sql, [id], (err, result) => {

        if (err) {
            return res.status(500).json({
                message: "Database error",
                error: err
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Service not found"
            });
        }

        res.json({
            message: "Service deleted successfully!"
        });
    });
});


module.exports = router;