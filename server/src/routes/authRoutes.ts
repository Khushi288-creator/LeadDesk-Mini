import express from "express";
import {
  registerAdmin,
  loginAdmin,
} from "../controllers/authController";

const router = express.Router();

// Register Admin
router.post("/register", registerAdmin);

// Login Admin
router.post("/login", loginAdmin);

export default router;