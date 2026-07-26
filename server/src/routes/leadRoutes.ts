import express from "express";

import {
  createLead,
  getLeads,
  updateLeadStatus,
  getDashboardStats,
  getChartData,
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

// Chart Data (last 7 days)
router.get("/chart-data", authMiddleware, getChartData);

// Get All Leads
router.get("/", authMiddleware, getLeads);

// Update Lead Status
router.patch("/:id", authMiddleware, updateLeadStatus);

export default router;