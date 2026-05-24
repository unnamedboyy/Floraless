import {

  formatRupiah,

  formatDate,

} from "../shared/helpers.js";

export default function invoiceTemplate({

  ticket,

  detail,

  paymentRows,

  totalHarga,

  totalPaid,

  remaining,

  invoiceNo,

  logo,

}) {

  return `

<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8" />

<title>
Invoice FLORALESS
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

  padding: 28px;

  color: #111827;

  background: #ffffff;

  font-size: 11px;

  line-height: 1.5;
}

/* =====================================================
   HEADER
===================================================== */

.header {

  display: flex;

  justify-content:
    space-between;

  align-items: start;

  margin-bottom: 24px;
}

.logo {

  font-size: 24px;

  font-weight: 800;

  letter-spacing: 1px;
}

.logo span {

  color: #6B7280;
}

.invoice-title {

  text-align: right;
}

.invoice-title h1 {

  margin: 0;

  font-size: 24px;

  font-weight: 800;
}

.invoice-title p {

  margin-top: 6px;

  color: #6B7280;

  font-size: 12px;
}

/* =====================================================
   SECTION
===================================================== */

.section {

  margin-bottom: 18px;

  page-break-inside: avoid;
}

.card {

  border:
    1px solid #E5E7EB;

  border-radius: 18px;

  padding: 20px;

  page-break-inside: avoid;
}

/* =====================================================
   TEXT
===================================================== */

.label {

  font-size: 10px;

  text-transform: uppercase;

  letter-spacing: 1px;

  color: #6B7280;

  margin-bottom: 8px;
}

.value {

  font-size: 12px;

  font-weight: 700;

  margin-bottom: 6px;
}

p {

  margin: 0 0 6px 0;
}

/* =====================================================
   TABLE
===================================================== */

table {

  width: 100%;

  border-collapse: collapse;

  table-layout: fixed;

  margin-top: 14px;

  font-size: 11px;
}

th {

  background: #0F172A;

  color: white;

  padding: 12px;

  font-size: 10px;

  text-align: left;

  font-weight: 700;
}

td {

  padding: 14px 12px;

  border-bottom:
    1px solid #E5E7EB;

  vertical-align: middle;
}

/* =====================================================
   BADGE
===================================================== */

.badge {

  display: inline-flex;

  align-items: center;

  justify-content: center;

  padding: 6px 12px;

  border-radius: 999px;

  font-size: 10px;

  font-weight: 700;

  background: #DCFCE7;

  color: #166534;
}

.badge-waiting {

  background: #FEF3C7;

  color: #92400E;
}

/* =====================================================
   PAYMENT TITLE
===================================================== */

.payment-title {

  margin-top: 0;

  margin-bottom: 4px;

  font-size: 14px;

  font-weight: 800;
}

/* =====================================================
   SUMMARY
===================================================== */

.summary {

  width: 100%;

  margin-top: 18px;

  display: flex;

  justify-content: flex-end;
}

.summary-box {

  width: 400px;
}

.summary-row {

  display: flex;

  justify-content:
    space-between;

  padding: 10px 0;

  border-bottom:
    1px solid #E5E7EB;

  font-size: 12px;
}

.summary-row.total {

  font-size: 16px;

  font-weight: 800;
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

    <div
    style="
        display: flex;
        flex-direction: column;
        gap: 10px;
    "
    >

    <img

        src="${logo}"

        alt="FLORALESS Logo"

        style="
        width: 180px;
        object-fit: contain;
        "
    />
    </div>

  </div>

  <div class="invoice-title">

    <h1>
      INVOICE
    </h1>

    <p>
      ${invoiceNo}
    </p>

  </div>

</div>

<!-- =====================================================
     CUSTOMER + EVENT + SERVICE
===================================================== -->

<div class="section">

  <div class="card">

    <div
      style="
        display: flex;
        justify-content: space-between;
        align-items: start;
        gap: 40px;
        margin-bottom: 24px;
      "
    >

      <!-- LEFT -->

      <div
        style="
          flex: 1;
        "
      >

        <!-- CUSTOMER -->

        <div
          style="
            margin-bottom: 18px;
          "
        >

          <div class="label">
            Pelanggan
          </div>

          <div class="value">
            ${
              ticket
                .pelangganId
                ?.nama || "-"
            }
          </div>

          <p>
            ${
              ticket
                .pelangganId
                ?.no_telp || "-"
            }
          </p>

        </div>

        <!-- EVENT -->

        <div>

          <div class="label">
            Detail Acara
          </div>

          <div class="value">
            ${
              detail
                ?.nama_acara || "-"
            }
          </div>

          <p>
            ${
              detail
                ?.lokasi || "-"
            }
          </p>

          <p>
            ${
              detail
                ?.tanggal_acara

                ? formatDate(
                    detail
                      .tanggal_acara
                  )

                : "-"
            }
          </p>

        </div>

      </div>

    <!-- RIGHT -->

    <div
    style="
        width: 320px;
    "
    >

    <!-- SERVICE -->

    <div
        style="
        margin-bottom: 24px;
        "
    >

        <div class="label">
        Layanan
        </div>

        <div
        style="
            font-size: 20px;
            font-weight: 800;
            margin-bottom: 10px;
        "
        >
        ${
            ticket
            .layananId
            ?.nama || "-"
        }
        </div>

        <div
        style="
            font-size: 11px;
            color: #6B7280;
            line-height: 1.7;
        "
        >
        ${
            ticket
            .layananId
            ?.deskripsi ||

            "Layanan dekorasi dan floral premium FLORALESS."
        }
        </div>

    </div>

    <!-- PAYMENT RECEIVER -->

    <div>

        <div class="label">
        Dibayar Ke
        </div>

        <div
        style="
            font-size: 16px;
            font-weight: 700;
            margin-bottom: 10px;
        "
        >
        Roxy Yusewa
        </div>

        <div
        style="
            font-size: 11px;
            color: #6B7280;
            line-height: 1.8;
        "
        >
        Babarsari, Yogyakarta
        <br />
        +62 856 4040 6548
        </div>

    </div>

    </div>

      </div>

    </div>

    <!-- =====================================================
         PAYMENT PLAN
    ===================================================== -->

    <div>

      <h2 class="payment-title">
        Payment Plan
      </h2>

      <table>

        <thead>

          <tr>

            <th>
              Tipe
            </th>

            <th>
              Status
            </th>

            <th>
              Tanggal
            </th>

            <th>
              Pengirim
            </th>

            <th>
              Jumlah
            </th>

          </tr>

        </thead>

        <tbody>

          ${
            paymentRows.map(
              (item) => `

<tr>

<td>
  ${
    item.tipe
  }
</td>

<td>

  <span class="
    badge

    ${
      item.paid

        ? ""

        : "badge-waiting"
    }
  ">

    ${
      item.paid

        ? "Sudah Dibayar"

        : "Menunggu"
    }

  </span>

</td>

<td>

  ${
    item.tanggal

      ? formatDate(
          item.tanggal
        )

      : "-"
  }

</td>

<td>
  ${
    item.pengirim
  }
</td>

<td>
  ${formatRupiah(
    item.jumlah
  )}
</td>

</tr>

`
            ).join("")
          }

        </tbody>

      </table>

    </div>

    <!-- =====================================================
         SUMMARY
    ===================================================== -->

    <div class="summary">

      <div class="summary-box">

        <div class="summary-row">

          <div>
            Total Harga
          </div>

          <div>
            ${formatRupiah(
              totalHarga
            )}
          </div>

        </div>

        <div class="summary-row">

          <div>
            Total Dibayar
          </div>

          <div>
            ${formatRupiah(
              totalPaid
            )}
          </div>

        </div>

        <div class="summary-row total">

          <div>
            Sisa Pembayaran
          </div>

          <div>
            ${formatRupiah(
              remaining
            )}
          </div>

        </div>

      </div>

    </div>

  </div>

</div>

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
        margin-top: 6px;
        color: #6B7280;
      "
    >
      Invoice ini dibuat otomatis oleh sistem FLORALESS.
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