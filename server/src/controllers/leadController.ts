import { Request, Response } from "express";
import Lead from "../models/Lead";
import { sendStatusUpdateEmail } from "../utils/sendEmail";

/**
 * @desc Create New Lead
 * @route POST /api/leads
 */
export const createLead = async (req: Request, res: Response) => {
  try {
    const { name, email, budget, message } = req.body;

    // Server-side validation
    if (!name || !/^[A-Za-z\s]{2,50}$/.test(name.trim())) {
      return res.status(400).json({ success: false, message: "Invalid name" });
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      return res.status(400).json({ success: false, message: "Invalid email" });
    }
    if (!message || message.trim().length < 10) {
      return res.status(400).json({ success: false, message: "Message too short" });
    }

    // ...existing lead creation code continues here

    const lead = await Lead.create({
      name,
      email,
      budget,
      message,
    });

    res.status(201).json({
      success: true,
      message: "Lead submitted successfully.",
      lead,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

/**
 * @desc Get All Leads
 * @route GET /api/leads
 */
export const getLeads = async (req: Request, res: Response) => {
  try {
    const search = (req.query.search as string) || "";

    const query = {
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    };

    const leads = await Lead.find(query).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      total: leads.length,
      leads,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

/**
 * @desc Update Lead Status
 * @route PATCH /api/leads/:id
 */
export const updateLeadStatus = async (
  req: Request,
  res: Response
) => {
  try {
    const { status } = req.body;

    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { status },
      {
        new: true,
      }
    );

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found.",
      });
    }

    // 👇 naya add kiya
    sendStatusUpdateEmail(lead.email, lead.name, status);

    res.status(200).json({
      success: true,
      message: "Lead status updated.",
      lead,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

/**
 * @desc Dashboard Statistics
 * @route GET /api/leads/stats
 */
export const getDashboardStats = async (
  req: Request,
  res: Response
) => {
  try {
    const totalLeads = await Lead.countDocuments();

    const newLeads = await Lead.countDocuments({
      status: "New",
    });

    const contactedLeads = await Lead.countDocuments({
      status: "Contacted",
    });

    const closedLeads = await Lead.countDocuments({
      status: "Closed",
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todaysLeads = await Lead.countDocuments({
      createdAt: {
        $gte: today,
      },
    });

    const latestLead = await Lead.findOne().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      stats: {
        totalLeads,
        todaysLeads,
        newLeads,
        contactedLeads,
        closedLeads,
        latestLead,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};