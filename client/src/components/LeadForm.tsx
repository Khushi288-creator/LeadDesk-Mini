import { useState } from "react";
import { createLead } from "../services/leadService";
import { useToast } from "./Toast";
import { theme } from "../theme";

function LeadForm({ onCreated }: { onCreated: () => void }) {
  const showToast = useToast();
  const [form, setForm] = useState({ name: "", email: "", budget: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      showToast("Name and Email are required", "error");
      return;
    }

    try {
      setLoading(true);
      await createLead({ ...form, budget: Number(form.budget) || 0 });
      showToast("Lead created successfully 🎉");
      setForm({ name: "", email: "", budget: "", message: "" });
      onCreated();
    } catch (err: any) {
      showToast(err.response?.data?.message || "Failed to create lead", "error");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: 12,
    marginTop: 10,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: 8,
    boxSizing: "border-box" as const,
    fontSize: 14,
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        background: theme.colors.card,
        padding: 24,
        borderRadius: 12,
        boxShadow: "0 4px 14px rgba(0,0,0,.05)",
        marginBottom: 24,
      }}
    >
      <h3 style={{ marginBottom: 4 }}>➕ Add New Lead</h3>

      <input name="name" placeholder="Name" value={form.name} onChange={handleChange} style={inputStyle} />
      <input name="email" placeholder="Email" value={form.email} onChange={handleChange} style={inputStyle} />
      <input name="budget" type="number" placeholder="Budget" value={form.budget} onChange={handleChange} style={inputStyle} />
      <textarea name="message" placeholder="Message" value={form.message} onChange={handleChange} style={{ ...inputStyle, minHeight: 80 }} />

      <button
        type="submit"
        disabled={loading}
        style={{
          marginTop: 14,
          padding: "12px 24px",
          background: theme.colors.primary,
          color: "#fff",
          border: "none",
          borderRadius: 8,
          cursor: "pointer",
          fontWeight: 600,
        }}
      >
        {loading ? "Adding..." : "Add Lead"}
      </button>
    </form>
  );
}

export default LeadForm;