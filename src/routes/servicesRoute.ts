import { Router } from "express";
import { sql } from "../db/neon.js";

const router = Router();

// Get all services
router.get("/services", async (req, res) => {
  try {
    const services = await sql`SELECT * FROM services`;
    res.json({ services });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Create a service
router.post("/services", async (req, res) => {
  try {
    const { name, description, base_price } = req.body;
    const [service] = await sql`
      INSERT INTO services (name, description, base_price) 
      VALUES (${name}, ${description}, ${base_price}) 
      RETURNING *
    `;
    res.json(service);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Add provider to service
router.post("/services/:id/providers", async (req, res) => {
  try {
    const { id } = req.params;
    const { provider_name, price } = req.body;

    const [provider] = await sql`
      INSERT INTO service_providers (service_id, provider_name, price) 
      VALUES (${id}, ${provider_name}, ${price}) 
      RETURNING *
    `;

    res.json(provider);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Get service details with providers
router.get("/services/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [service] = await sql`SELECT * FROM services WHERE id = ${id}`;
    if (!service) return res.status(404).json({ error: "Service not found" });

    const providers = await sql`SELECT * FROM service_providers WHERE service_id = ${id}`;

    res.json({ ...service, providers });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
