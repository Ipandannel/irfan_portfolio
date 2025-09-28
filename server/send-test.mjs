import dotenv from "dotenv";
import { Resend } from "resend";

dotenv.config({ path: "./.env" });
const resend = new Resend(process.env.RESEND_API_KEY);

try {
  const result = await resend.emails.send({
    from: process.env.CONTACT_FROM,        // onboarding@resend.dev for testing
    to: process.env.CONTACT_TO,            // your Gmail
    subject: "Resend local test",
    html: "<p>This is a direct test from Node.js</p>"
  });
  console.log("OK:", result);
} catch (e) {
  console.error("ERR:", e?.statusCode, e?.message, e);
}
