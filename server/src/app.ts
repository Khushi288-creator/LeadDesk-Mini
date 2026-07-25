import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes";
import leadRoutes from "./routes/leadRoutes";

const app = express();

// =======================
// Middlewares
// =======================

app.use(cors());

app.use(express.json());

app.use(cookieParser());

// =======================
// Health Check
// =======================

app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 LeadDesk Mini Backend is Running Successfully",
  });
});

// =======================
// API Routes
// =======================

app.use("/api/auth", authRoutes);

app.use("/api/leads", leadRoutes);

export default app;