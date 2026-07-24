import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// =======================
// Global Middlewares
// =======================

// Allow frontend to access backend
app.use(cors());

// Parse JSON request body
app.use(express.json());

// Parse cookies
app.use(cookieParser());

// =======================
// Health Check Route
// =======================

app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 LeadDesk Mini Backend is Running Successfully"
  });
});

export default app;