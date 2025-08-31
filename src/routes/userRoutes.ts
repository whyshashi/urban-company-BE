import { Router } from "express";
import { sql } from "../db/neon.js";

const router = Router();

// Get all users
router.get("/", async (req, res) => {
  try {
    const users = await sql`SELECT * FROM users`;
    res.json(users);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Get single user
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [user] = await sql`SELECT * FROM users WHERE id = ${id}`;
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Create user
router.post("/", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const [newUser] = await sql`
      INSERT INTO users (name, email, password) 
      VALUES (${name}, ${email}, ${password}) 
      RETURNING *
    `;
    res.status(201).json(newUser);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Update user
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;
    const [updatedUser] = await sql`
      UPDATE users 
      SET name = ${name}, email = ${email}, password = ${password}
      WHERE id = ${id}
      RETURNING *
    `;
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(updatedUser);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Delete user
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await sql`DELETE FROM users WHERE id = ${id}`;
    if (result.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(204).send();
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
