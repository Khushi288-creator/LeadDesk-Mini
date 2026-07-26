import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";


const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
  family: 4, // 👈 ye line force karegi IPv4 use karne ke liye
} as SMTPTransport.Options);

export const sendStatusUpdateEmail = async (
  toEmail: string,
  leadName: string,
  newStatus: string
) => {
  const statusMessages: Record<string, string> = {
    Contacted: "We've reviewed your inquiry and will be reaching out to you shortly.",
    Closed: "Thank you for your interest. This inquiry has been marked as closed.",
  };

  try {
    await transporter.sendMail({
      from: `"LeadDesk" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: `Update on your inquiry — Status: ${newStatus}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>Hi ${leadName},</h2>
          <p>${statusMessages[newStatus] || `Your inquiry status has been updated to: ${newStatus}`}</p>
          <p style="color: #6b7280; font-size: 13px; margin-top: 30px;">— LeadDesk Team</p>
        </div>
      `,
    });
    console.log(`Status email sent to ${toEmail}`);
  } catch (err) {
    console.log("Email send failed:", err);
  }
};