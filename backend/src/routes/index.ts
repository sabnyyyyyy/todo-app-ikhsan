import { Router } from "express";
import authRoutes from "./authRoutes";
import todoRoutes from "./todoRoutes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/todos", todoRoutes);

export default router;
