import nodemailer from "nodemailer";

/* =========================================================
   TRANSPORTER
   - Sesuaikan EMAIL_HOST / EMAIL_PORT kalau bukan pakai gmail
   - Simpan kredensial di .env, JANGAN hardcode
========================================================= */

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/* =========================================================
   FUNGSI UTAMA - sendEmail
   Dipakai di controller mana saja, tujuan & isi beda-beda
   tapi template/layout tetap konsisten.

   Contoh pakai:
   await sendEmail({
     to: "user@email.com",
     subject: "Ticket Anda Disetujui",
     title: "Ticket Disetujui ✅",
     message: "Ticket Anda dengan nomor #123 telah disetujui...",
     ctaText: "Lihat Ticket",
     ctaUrl: "https://app-kamu.com/ticket/123",
   });
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
    if (!to) {
      console.warn("[sendEmail] Dilewati: tujuan email kosong");
      return;
    }

    const html = renderEmailTemplate({
      title,
      message,
      ctaText,
      ctaUrl,
    });

    await transporter.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME || "Admin"}" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log(`[sendEmail] Terkirim ke ${to} - "${subject}"`);
  } catch (err) {
    console.error("[sendEmail] Gagal kirim email:", err.message);
  }
};

/* =========================================================
   TEMPLATE HTML
   Satu layout, dipakai ulang. Bagian yang beda cuma:
   title, message (boleh multi-baris / HTML sederhana), dan CTA button (opsional)
========================================================= */

const renderEmailTemplate = ({ title, message, ctaText, ctaUrl }) => {
  const buttonHtml =
    ctaText && ctaUrl
      ? `
      <tr>
        <td style="padding: 24px 0 0 0;" align="center">
          <a href="${ctaUrl}"
             style="background-color:#2563eb;color:#ffffff;text-decoration:none;
                    padding:12px 28px;border-radius:6px;font-size:14px;
                    font-weight:600;display:inline-block;">
            ${ctaText}
          </a>
        </td>
      </tr>`
      : "";

  return `
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f7;padding:32px 0;font-family:Arial,Helvetica,sans-serif;">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;">
          <tr>
            <td style="background-color:#111827;padding:20px 24px;">
              <span style="color:#ffffff;font-size:18px;font-weight:700;">
                ${process.env.EMAIL_FROM_NAME || "Aplikasi"}
              </span>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 24px;">
              <h2 style="margin:0 0 16px 0;color:#111827;font-size:20px;">
                ${title || ""}
              </h2>
              <div style="color:#374151;font-size:14px;line-height:1.6;white-space:pre-line;">
                ${message || ""}
              </div>
              <table width="100%">${buttonHtml}</table>
            </td>
          </tr>
          <tr>
            <td style="background-color:#f9fafb;padding:16px 24px;">
              <span style="color:#9ca3af;font-size:12px;">
                Email ini dikirim otomatis, mohon tidak membalas email ini.
              </span>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
  `;
};