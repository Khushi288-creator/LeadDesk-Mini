import { useState } from "react";
import type { Lead } from "../types";
import StatusBadge from "./StatusBadge";
import EmptyState from "./EmptyState";
import { updateLeadStatus } from "../services/leadService";
import { useToast } from "./Toast";
import { theme } from "../theme";

function LeadTable({ leads, onChanged }: { leads: Lead[]; onChanged: () => void }) {
  const showToast = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = leads.filter((l) => {
    const matchesSearch =
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || l.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await updateLeadStatus(id, status);
      showToast("Status updated");
      onChanged();
    } catch {
      showToast("Failed to update status", "error");
    }
  };

  return (
    <div
      style={{
        background: theme.colors.card,
        borderRadius: 12,
        padding: 20,
        boxShadow: "0 4px 14px rgba(0,0,0,.05)",
      }}
    >
      <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
        <input
          placeholder="🔍 Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: 200, padding: 10, border: `1px solid ${theme.colors.border}`, borderRadius: 8 }}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ padding: 10, border: `1px solid ${theme.colors.border}`, borderRadius: 8 }}
        >
          <option>All</option>
          <option>New</option>
          <option>Contacted</option>
          <option>Closed</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState message="No leads found" />
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ textAlign: "left", color: theme.colors.muted, fontSize: 13 }}>
                <th style={{ padding: 10 }}>Name</th>
                <th style={{ padding: 10 }}>Email</th>
                <th style={{ padding: 10 }}>Budget</th>
                <th style={{ padding: 10 }}>Status</th>
                <th style={{ padding: 10 }}>Update</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead) => (
                <tr key={lead._id} style={{ borderTop: `1px solid ${theme.colors.border}` }}>
                  <td style={{ padding: 10 }}>{lead.name}</td>
                  <td style={{ padding: 10 }}>{lead.email}</td>
                  <td style={{ padding: 10 }}>₹{lead.budget}</td>
                  <td style={{ padding: 10 }}>
                    <StatusBadge status={lead.status} />
                  </td>
                  <td style={{ padding: 10 }}>
                    <select
                      value={lead.status}
                      onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                      style={{ padding: 6, borderRadius: 6, border: `1px solid ${theme.colors.border}` }}
                    >
                      <option>New</option>
                      <option>Contacted</option>
                      <option>Closed</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default LeadTable;