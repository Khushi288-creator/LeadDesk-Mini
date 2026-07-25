import { useEffect, useState } from "react";
import DashboardCard from "../components/DashboardCard";
import StatusBadge from "../components/StatusBadge";
import Spinner from "../components/Spinner";
import { getStats } from "../services/leadService";
import type { Stats } from "../types";
import { theme } from "../theme";

function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const res = await getStats();
      setStats((res.data as any).stats || (res.data as any));
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div style={{ padding: 30, background: theme.colors.bg, minHeight: "100vh" }}>
      <h1>📊 LeadDesk Dashboard</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
          gap: 20,
          marginTop: 25,
        }}
      >
        <DashboardCard title="Total Leads" value={stats?.totalLeads || 0} color={theme.colors.primary} />
        <DashboardCard title="Today's Leads" value={stats?.todaysLeads || 0} color={theme.colors.success} />
        <DashboardCard title="New Leads" value={stats?.newLeads || 0} color={theme.colors.warning} />
        <DashboardCard title="Contacted" value={stats?.contactedLeads || 0} color={theme.colors.purple} />
        <DashboardCard title="Closed" value={stats?.closedLeads || 0} color={theme.colors.danger} />
      </div>

      <div
        style={{
          marginTop: 30,
          background: theme.colors.card,
          borderRadius: 12,
          padding: 20,
          boxShadow: "0 4px 14px rgba(0,0,0,.05)",
        }}
      >
        <h3>🕒 Latest Lead</h3>
        {stats?.latestLead ? (
          <div style={{ marginTop: 10 }}>
            <p><strong>{stats.latestLead.name}</strong> — {stats.latestLead.email}</p>
            <p style={{ color: theme.colors.muted }}>Budget: ₹{stats.latestLead.budget}</p>
            <StatusBadge status={stats.latestLead.status} />
          </div>
        ) : (
          <p style={{ color: theme.colors.muted }}>No leads yet</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;