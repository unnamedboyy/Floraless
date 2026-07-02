/* =========================================================
   RENDER EMAIL TEMPLATE
========================================================= */

export const renderEmailTemplate = ({
  title = "",
  message = "",
  ctaText = "",
  ctaUrl = "",
}) => {
  const buttonHtml =
    ctaText && ctaUrl
      ? `
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:28px;">
        <tr>
          <td align="center">
            <a
              href="${ctaUrl}"
              style="
                background:#2563eb;
                color:#ffffff;
                text-decoration:none;
                padding:14px 30px;
                border-radius:8px;
                font-weight:bold;
                display:inline-block;
                font-size:15px;
              "
            >
              ${ctaText}
            </a>
          </td>
        </tr>
      </table>
      `
      : "";

  return `
<!DOCTYPE html>
<html lang="id">

<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
</head>

<body
  style="
    margin:0;
    padding:0;
    background:#f3f4f6;
    font-family:Arial,Helvetica,sans-serif;
  "
>

<table
  width="100%"
  cellpadding="0"
  cellspacing="0"
  style="padding:40px 20px;background:#f3f4f6;"
>

<tr>

<td align="center">

<table
  width="600"
  cellpadding="0"
  cellspacing="0"
  style="
    background:#ffffff;
    border-radius:14px;
    overflow:hidden;
    box-shadow:0 5px 20px rgba(0,0,0,.08);
  "
>

<tr>

<td
  style="
    background:#111827;
    color:#ffffff;
    padding:28px;
    text-align:center;
  "
>

<div
  style="
    font-size:26px;
    font-weight:bold;
    letter-spacing:1px;
  "
>
🌸 FLORALESS
</div>

<div
  style="
    margin-top:8px;
    font-size:14px;
    color:#d1d5db;
  "
>
Sistem Pemesanan Dekorasi
</div>

</td>

</tr>

<tr>

<td style="padding:36px;">

<h2
  style="
    margin:0 0 24px;
    color:#111827;
    font-size:26px;
  "
>
${title}
</h2>

<div
  style="
    color:#4b5563;
    font-size:15px;
    line-height:1.8;
    white-space:pre-line;
  "
>
${message}
</div>

${buttonHtml}

<hr
  style="
    margin:35px 0;
    border:none;
    border-top:1px solid #e5e7eb;
  "
>

<p
  style="
    margin:0;
    color:#6b7280;
    font-size:13px;
    line-height:1.8;
  "
>
Apabila tombol di atas tidak dapat diklik, silakan salin tautan berikut ke browser Anda:
</p>

<p
  style="
    word-break:break-all;
    font-size:13px;
    color:#2563eb;
  "
>
${ctaUrl || "-"}
</p>

</td>

</tr>

<tr>

<td
  style="
    background:#f9fafb;
    padding:24px;
    text-align:center;
    color:#9ca3af;
    font-size:12px;
    line-height:1.7;
  "
>

<b>FLORALESS</b><br>

Email ini dikirim secara otomatis oleh sistem.<br>

Mohon tidak membalas email ini.

</td>

</tr>

</table>

</td>

</tr>

</table>

</body>

</html>
`;
};