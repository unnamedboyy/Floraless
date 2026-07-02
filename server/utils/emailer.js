import { Resend } from "resend";
import { renderEmailTemplate } from "./renderEmail.js";

const resend = new Resend(process.env.RESEND_API_KEY);

export const verifyEmailConnection = async () => {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.error("❌ RESEND_API_KEY belum diatur.");
      return false;
    }

    console.log("✅ Resend siap digunakan.");
    return true;
  } catch (err) {
    console.error("❌ Gagal menginisialisasi Resend.");
    console.error(err);
    return false;
  }
};

/* =========================================================
   SEND EMAIL
========================================================= */

export const sendEmail = async ({
  to,
  subject,
  title,
  message,
  ctaText,
  ctaUrl,
}) => {
  try {
    if (!process.env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY belum diatur.");
    }

    if (!to) {
      console.warn("⚠️ Email tujuan kosong.");
      return null;
    }

    const html = renderEmailTemplate({
      title,
      message,
      ctaText,
      ctaUrl,
    });

    const { data, error } = await resend.emails.send({
      from:
        process.env.EMAIL_FROM_NAME ||"FLORALESS <noreply@floraless.site>",

      to: Array.isArray(to) ? to : [to],

      subject,

      html,
    });

    if (error) {
      console.error("❌ Resend Error:");
      console.error(error);
      return null;
    }

    console.log("========================================");
    console.log("📧 EMAIL BERHASIL DIKIRIM");
    console.log("To      :", to);
    console.log("Subject :", subject);
    console.log("ID      :", data?.id);
    console.log("========================================");

    return data;
  } catch (err) {
    console.error("========================================");
    console.error("❌ GAGAL MENGIRIM EMAIL");
    console.error(err);
    console.error("========================================");

    return null;
  }
};

/* =========================================================
   SEND EMAIL WITH CUSTOM HTML
   (Opsional jika suatu saat diperlukan)
========================================================= */

export const sendCustomEmail = async ({
  to,
  subject,
  html,
}) => {
  try {
    const { data, error } = await resend.emails.send({
      from:
        process.env.EMAIL_FROM_NAME ||
        "FLORALESS <noreply@floraless.site>",

      to: Array.isArray(to) ? to : [to],

      subject,

      html,
    });

    if (error) {
      console.error(error);
      return null;
    }

    return data;
  } catch (err) {
    console.error(err);
    return null;
  }
};