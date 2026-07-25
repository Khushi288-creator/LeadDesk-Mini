import { useEffect, useState } from "react";
import type { Lead } from "../types";
import { getLeads } from "../services/leadService";
import LeadForm from "../components/LeadForm";
import LeadTable from "../components/LeadTable";
import Spinner from "../components/Spinner";

function Leads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  const loadLeads = async () => {
    try {
      setLoading(true);
      const res = await getLeads();
      // apne backend ke actual response shape ke hisaab se check karlena
      setLeads((res.data as any).leads || (res.data as any));
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();
  }, []);

  return (
    <div style={{ padding: 30 }}>
      <h1>📋 Leads</h1>
      <LeadForm onCreated={loadLeads} />
      {loading ? <Spinner /> : <LeadTable leads={leads} onChanged={loadLeads} />}
    </div>
  );
}

export default Leads;