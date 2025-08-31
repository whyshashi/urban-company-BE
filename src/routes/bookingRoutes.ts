// src/routes/booking.routes.ts
import { Router } from "express";
import { sql } from "../db/neon.js";

const router = Router();

/**
 * Book a slot
 * POST /bookings
 * body: { user_id, service_id, slot_time }
 */
router.post("/", async (req, res) => {
  try {
    const { user_id, service_id, slot_time } = req.body;

    if (!user_id || !service_id || !slot_time) {
      return res.status(400).json({ message: "user_id, service_id and slot_time are required" });
    }

    // check if service exists
    const [service] = await sql`SELECT * FROM services WHERE id = ${service_id}`;
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    const [booking] = await sql`
      INSERT INTO bookings (user_id, service_id, slot_time, status, created_at, updated_at)
      VALUES (${user_id}, ${service_id}, ${slot_time}, 'pending', NOW(), NOW())
      RETURNING *
    `;

    res.status(201).json({
      message: "Booking created",
      booking: { ...booking, service }, // include service details
    });
  } catch (error: any) {
    console.error("Error creating booking:", error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get all bookings for a user (with service details)
 * GET /bookings/:userId
 */
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const bookings = await sql`
      SELECT 
        b.id,
        b.slot_time,
        b.status,
        b.rating,
        b.review,
        s.name as service_name,
        s.description as service_description,
        s.base_price as service_price
      FROM bookings b
      JOIN services s ON b.service_id = s.id
      WHERE b.user_id = ${userId}
      ORDER BY b.slot_time ASC
    `;

    res.json({ bookings });
  } catch (error: any) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Update booking status (approve/reject/cancel)
 * PUT /bookings/:id
 */
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "approved", "rejected", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const [updated] = await sql`
      UPDATE bookings 
      SET status = ${status}, updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    if (!updated) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // fetch service details for this booking
    const [service] = await sql`SELECT * FROM services WHERE id = ${updated.service_id}`;

    res.json({
      message: "Booking updated",
      booking: { ...updated, service },
    });
  } catch (error: any) {
    console.error("Error updating booking:", error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Delete a booking
 * DELETE /bookings/:id
 */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await sql`DELETE FROM bookings WHERE id = ${id}`;

    if (result.length === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json({ message: "Booking deleted" });
  } catch (error: any) {
    console.error("Error deleting booking:", error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * ✅ Review a booking
 * POST /bookings/:id/review
 */
router.post("/:id/review", async (req, res) => {
  try {
    const { id } = req.params; // booking id
    const { rating, review } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    const [booking] = await sql`SELECT * FROM bookings WHERE id = ${id}`;

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    const [updatedBooking] = await sql`
      UPDATE bookings 
      SET rating = ${rating}, review = ${review}, updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    if (!updatedBooking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    const [service] = await sql`SELECT * FROM services WHERE id = ${updatedBooking.service_id}`;

    res.json({
      message: "Review added successfully",
      booking: { ...updatedBooking, service },
    });
  } catch (error: any) {
    console.error("Error reviewing booking:", error);
    res.status(500).json({ error: "Failed to add review" });
  }
});

export default router;
