import { Router } from "express";
import authRoutes from "./authRoutes";
import userRoutes from "./userRoutes";
import bookingRoutes from "./bookingRoutes";

const router = Router();

router.use("/auth", authRoutes);      // /api/auth/...
router.use("/users", userRoutes);     // /api/users/...
router.use("/bookings", bookingRoutes); // /api/bookings/...

export default router;
