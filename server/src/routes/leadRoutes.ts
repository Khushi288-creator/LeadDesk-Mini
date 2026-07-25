import express from "express";

import {
  createLead,
  getLeads,
  updateLeadStatus,
  getDashboardStats,
} from "../controllers/leadController";

import authMiddleware from "../middleware/authMiddleware";

const router = express.Router();

/**
 * Public Route
 */

// Visitor Form Submit
router.post("/", createLead);

/**
 * Protected Routes
 */

// Dashboard Statistics
router.get("/stats", authMiddleware, getDashboardStats);

// Get All Leads
router.get("/", authMiddleware, getLeads);

// Update Lead Status
router.patch("/:id", authMiddleware, updateLeadStatus);

export default router;