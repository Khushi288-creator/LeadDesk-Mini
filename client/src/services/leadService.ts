import api from "./api";
import type { Lead } from "../types";

export const createLead = (lead: Partial<Lead>) => api.post("/leads", lead);

export const getLeads = () => api.get<{ leads: Lead[] }>("/leads");

export const updateLeadStatus = (id: string, status: string) =>
  api.patch(`/leads/${id}`, { status });

export const getStats = () => api.get<{ stats: Stats }>("/leads/stats");

import type { Stats } from "../types";