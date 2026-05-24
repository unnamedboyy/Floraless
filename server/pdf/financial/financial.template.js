import {

  formatDate,

  formatRupiah,

} from "../shared/helpers.js";

export default function financialTemplate({

  logo,

  data,

  summary,

  periodLabel,

}) {

  return `

<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8" />

<title>
Financial Report
</title>

<style>

* {

  box-sizing: border-box;

  font-family:
    Arial,
    sans-serif;
}

body {

  margin: 0;

  padding: 32px;

  color: #111827;

  background: #ffffff;

  font-size: 11px;
}

/* =====================================================
   HEADER
===================================================== */

.header {

  display: flex;

  justify-content:
    space-between;

  align-items: start;

  margin-bottom: 30px;
}

.logo {

  width: 180px;

  object-fit: contain;
}

.title h1 {

  margin: 0;

  font-size: 26px;

  font-weight: 800;

  color: #0F172A;
}

.title p {

  margin-top: 8px;

  color: #6B7280;

  font-size: 12px;
}

/* =====================================================
   SUMMARY
===================================================== */

.summary-grid {

  display: grid;

  grid-template-columns:
    repeat(4, 1fr);

  gap: 14px;

  margin-bottom: 30px;
}

.summary-card {

  border:
    1px solid #E5E7EB;

  border-radius: 16px;

  padding: 18px;
}

.summary-label {

  font-size: 10px;

  text-transform: uppercase;

  color: #6B7280;

  margin-bottom: 10px;

  letter-spacing: 1px;
}

.summary-value {

  font-size: 20px;

  font-weight: 800;

  color: #0F172A;
}

/* =====================================================
   TABLE
===================================================== */

table {

  width: 100%;

  border-collapse: collapse;
}

th {

  background: #0F172A;

  color: white;

  padding: 14px 12px;

  text-align: left;

  font-size: 10px;
}

td {

  padding: 14px 12px;

  border-bottom:
    1px solid #E5E7EB;

  font-size: 11px;
}

.badge {

  display: inline-flex;

  align-items: center;

  justify-content: center;

  padding: 6px 12px;

  border-radius: 999px;

  font-size: 10px;

  font-weight: 700;
}

.badge-approved {

  background: #DCFCE7;

  color: #166534;
}

.badge-pending {

  background: #FEF3C7;

  color: #92400E;
}

.badge-rejected {

  background: #FEE2E2;

  color: #991B1B;
}

/* =====================================================
   FOOTER
===================================================== */

.footer {

  margin-top: 40px;

  display: flex;

  justify-content:
    space-between;

  align-items: end;
}

.signature {

  text-align: center;
}

.signature-line {

  width: 180px;

  border-bottom:
    1px solid #111827;

  margin-bottom: 8px;

  height: 50px;
}

</style>

</head>

<body>

<!-- =====================================================
     HEADER
===================================================== -->

<div class="header">

  <div>

    <img
      src="${logo}"
      class="logo"
    />

  </div>

  <div class="title">

    <h1>
      LAPORAN KEUANGAN
    </h1>

    <p>
      ${periodLabel}
    </p>

  </div>

</div>

<!-- =====================================================
     SUMMARY
===================================================== -->

<div class="summary-grid">

  <div class="summary-card">

    <div class="summary-label">
      Total Transaksi
    </div>

    <div class="summary-value">
      ${summary.totalTransaction}
    </div>

  </div>

  <div class="summary-card">

    <div class="summary-label">
      Total Pemasukan
    </div>

    <div class="summary-value">
      ${formatRupiah(
        summary.totalIncome
      )}
    </div>

  </div>

  <div class="summary-card">

    <div class="summary-label">
      Approved
    </div>

    <div class="summary-value">
      ${summary.approved}
    </div>

  </div>

  <div class="summary-card">

    <div class="summary-label">
      Pending
    </div>

    <div class="summary-value">
      ${summary.pending}
    </div>

  </div>

</div>

<!-- =====================================================
     TABLE
===================================================== -->

<table>

  <thead>

    <tr>

      <th>
        Tanggal
      </th>

      <th>
        Pelanggan
      </th>

      <th>
        Layanan
      </th>

      <th>
        Tipe
      </th>

      <th>
        Jumlah
      </th>

      <th>
        Status
      </th>

    </tr>

  </thead>

  <tbody>

    ${data.map((item) => `

<tr>

<td>
  ${formatDate(
    item.createdAt
  )}
</td>

<td>
  ${
    item.ticketId
      ?.pelangganId
      ?.nama || "-"
  }
</td>

<td>
  ${
    item.ticketId
      ?.layananId
      ?.nama || "-"
  }
</td>

<td>
  ${item.tipe}
</td>

<td>
  ${formatRupiah(
    item.jumlah
  )}
</td>

<td>

  <span class="
    badge

    ${
      item.status ===
      "approved"

      ? "badge-approved"

      : item.status ===
        "pending"

      ? "badge-pending"

      : "badge-rejected"
    }
  ">

    ${item.status}

  </span>

</td>

</tr>

`).join("")}

  </tbody>

</table>

<!-- =====================================================
     FOOTER
===================================================== -->

<div class="footer">

  <div>

    <strong>
      Catatan:
    </strong>

    <p
      style="
        margin-top: 8px;
        color: #6B7280;
      "
    >
      Laporan dibuat otomatis oleh sistem FLORALESS.
    </p>

  </div>

  <div class="signature">

    <div class="signature-line"></div>

    <strong>
      FLORALESS
    </strong>

  </div>

</div>

</body>

</html>

`;
}