export interface Lead {
  _id: string;
  name: string;
  email: string;
  budget: number;
  message: string;
  status: "New" | "Contacted" | "Closed";
  source: string;
  createdAt: string;
  updatedAt: string;
}

export interface Stats {
  totalLeads: number;
  todaysLeads: number;
  newLeads: number;
  contactedLeads: number;
  closedLeads: number;
  latestLead?: Lead;
}