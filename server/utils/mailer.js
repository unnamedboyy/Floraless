import nodemailer from "nodemailer";

/* =========================================================
   SMTP TRANSPORTER
========================================================= */

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTLS: true,

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },

  connectionTimeout: 30000,
  greetingTimeout: 30000,
  socketTimeout: 30000,
});

/* =========================================================
   CEK KONEKSI SMTP
========================================================= */

export const verifyEmailConnection = async () => {
  try {
    await transporter.verify();
    console.log("✅ SMTP siap digunakan");
  } catch (err) {
    console.error("❌ SMTP gagal:", err);
  }
};

/* =========================================================
   KIRIM EMAIL
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
      console.warn("[sendEmail] Email tujuan kosong");
      return;
    }

    const html = renderEmailTemplate({
      title,
      message,
      ctaText,
      ctaUrl,
    });

    const info = await transporter.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME || "FLORALESS"}" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("✅ Email berhasil dikirim");
    console.log("Message ID:", info.messageId);

    return info;
  } catch (err) {
    console.error("❌ [sendEmail] Gagal kirim email");
    console.error(err);

    return null;
  }
};

/* =========================================================
   TEMPLATE EMAIL
========================================================= */

const renderEmailTemplate = ({
  title = "",
  message = "",
  ctaText,
  ctaUrl,
}) => {
  const buttonHtml =
    ctaText && ctaUrl
      ? `
      <tr>
        <td align="center" style="padding-top:24px;">
          <a
            href="${ctaUrl}"
            style="
              background:#2563eb;
              color:white;
              text-decoration:none;
              padding:12px 24px;
              border-radius:8px;
              display:inline-block;
              font-weight:600;
            "
          >
            ${ctaText}
          </a>
        </td>
      </tr>
      `
      : "";

  return `
  <table width="100%" cellpadding="0" cellspacing="0"
    style="
      background:#f3f4f6;
      padding:40px 0;
      font-family:Arial,Helvetica,sans-serif;
    ">
    <tr>
      <td align="center">

        <table width="600" cellpadding="0" cellspacing="0"
          style="
            background:white;
            border-radius:12px;
            overflow:hidden;
          ">

          <tr>
            <td
              style="
                background:#111827;
                color:white;
                padding:24px;
                font-size:24px;
                font-weight:bold;
              "
            >
              ${process.env.EMAIL_FROM_NAME || "FLORALESS"}
            </td>
          </tr>

          <tr>
            <td style="padding:32px">

              <h2 style="
                margin:0 0 20px 0;
                color:#111827;
              ">
                ${title}
              </h2>

              <div style="
                color:#4b5563;
                line-height:1.8;
                white-space:pre-line;
              ">
                ${message}
              </div>

              <table width="100%">
                ${buttonHtml}
              </table>

            </td>
          </tr>

          <tr>
            <td
              style="
                background:#f9fafb;
                padding:20px;
                color:#9ca3af;
                font-size:12px;
              "
            >
              Email ini dikirim secara otomatis oleh FLORALESS.<br>
              Mohon tidak membalas email ini.
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
  `;
};