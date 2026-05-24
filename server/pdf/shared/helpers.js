export const formatRupiah =
  (num = 0) => {

    return "Rp " +
      Number(num)
        .toLocaleString(
          "id-ID"
        );
  };

export const formatDate =
  (date) => {

    return new Date(date)
      .toLocaleDateString(
        "id-ID",
        {

          day: "2-digit",

          month: "long",

          year: "numeric",
        }
      );
  };

export const invoiceNumber =
  (ticketId) => {

    return `INV-${
      new Date()
        .getFullYear()
    }-${
      String(ticketId)
        .slice(-6)
    }`;
  };

/* =====================================================
   PERIOD LABEL
===================================================== */

export const periodLabel =
  ({
    type,
    year,
    month,
    startDate,
    endDate,
  }) => {

    if (type === "yearly") {

      return `Periode Tahun ${year}`;
    }

    if (type === "monthly") {

      return `Periode Bulan ${month}/${year}`;
    }

    if (type === "range") {

      return `Periode ${startDate} sampai ${endDate}`;
    }

    return "Semua Data";
  };