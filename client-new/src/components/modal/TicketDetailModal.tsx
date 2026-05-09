"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  getTicketFull,
} from "@/services/ticket.service";

type Props = {
  open: boolean;
  ticketId: string | null;
  onClose: () => void;
};

const formatRupiah = (
  num: number
) =>
  "Rp " +
  (num || 0).toLocaleString(
    "id-ID"
  );

const getStatusBadge = (
  status: string
) => {

  const map: any = {

    pending:
      "bg-gray-100 text-gray-700",

    approved:
      "bg-yellow-100 text-yellow-700",

    in_progress:
      "bg-blue-100 text-blue-700",

    done:
      "bg-green-100 text-green-700",

    rejected:
      "bg-red-100 text-red-700",
  };

  return (
    map[status] ||
    "bg-gray-100 text-gray-700"
  );
};

export default function TicketDetailModal({
  open,
  ticketId,
  onClose,
}: Props) {

  const [data, setData] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(false);

  /* =========================================================
     FETCH DETAIL
  ========================================================= */

  useEffect(() => {

    if (
      open &&
      ticketId
    ) {

      fetchDetail();
    }

  }, [open, ticketId]);

  const fetchDetail =
    async () => {

      try {

        setLoading(true);

        const res =
          await getTicketFull(
            ticketId!
          );

        setData(
          res.data
        );

      } catch (err) {

        console.error(err);

        alert(
          "Gagal ambil detail"
        );

      } finally {

        setLoading(false);
      }
    };

  /* =========================================================
     CLOSE
  ========================================================= */

  if (!open) {
    return null;
  }

  /* =========================================================
     DATA
  ========================================================= */

  const ticket =
    data?.ticket;

  const pelanggan =
    ticket?.pelangganId;

  const layanan =
    ticket?.layananId;

  const detail =
    data?.detail;

  const payments =
    data?.payments || [];

  const summary =
    data?.paymentSummary;

  const logs =
    data?.logs || [];

  return (

    <div className="
      fixed
      inset-0
      z-50
      flex
      items-center
      justify-center
      bg-black/40
      p-4
      backdrop-blur-sm
    ">

      <div className="
        max-h-[95vh]
        w-full
        max-w-5xl
        overflow-y-auto
        rounded-3xl
        bg-white
        shadow-2xl
      ">

        {/* =====================================================
           HEADER
        ===================================================== */}

        <div className="
          sticky
          top-0
          z-10
          border-b
          bg-white
          px-8
          py-6
        ">

          <div className="
            flex
            items-start
            justify-between
            gap-4
          ">

            <div>

              <h2 className="
                text-2xl
                font-bold
              ">
                Detail Ticket
              </h2>

              <p className="
                mt-1
                text-sm
                text-gray-500
              ">
                Informasi lengkap ticket
              </p>

            </div>

            <button
              onClick={onClose}
              className="
                h-11
                w-11
                rounded-2xl
                text-lg
                text-gray-500
                transition
                hover:bg-gray-100
              "
            >
              ✕
            </button>

          </div>

        </div>

        {/* =====================================================
           CONTENT
        ===================================================== */}

        {
          loading ? (

            <div className="p-8">
              Loading...
            </div>

          ) : (

            <div className="
              space-y-6
              p-8
            ">

              {/* =================================================
                 TOP CARDS
              ================================================= */}

              <div className="
                grid
                gap-5
                md:grid-cols-3
              ">

                {/* STATUS */}

                <div className="
                  rounded-3xl
                  border
                  p-5
                ">

                  <p className="
                    text-sm
                    text-gray-500
                  ">
                    Status Ticket
                  </p>

                  <span className={`
                    mt-3
                    inline-flex
                    rounded-xl
                    px-3
                    py-1
                    text-sm
                    font-medium
                    ${getStatusBadge(ticket?.status)}
                  `}>
                    {ticket?.status}
                  </span>

                </div>

                {/* PELANGGAN */}

                <div className="
                  rounded-3xl
                  border
                  p-5
                ">

                  <p className="
                    text-sm
                    text-gray-500
                  ">
                    Pelanggan
                  </p>

                  <p className="
                    mt-2
                    font-semibold
                  ">
                    {
                      pelanggan?.nama ||
                      "-"
                    }
                  </p>

                  <p className="
                    mt-1
                    text-sm
                    text-gray-500
                  ">
                    {
                      pelanggan?.no_telp ||
                      "-"
                    }
                  </p>

                </div>

                {/* LAYANAN */}

                <div className="
                  rounded-3xl
                  border
                  p-5
                ">

                  <p className="
                    text-sm
                    text-gray-500
                  ">
                    Layanan
                  </p>

                  <p className="
                    mt-2
                    font-semibold
                  ">
                    {
                      layanan?.nama ||
                      "-"
                    }
                  </p>

                  <p className="
                    mt-1
                    text-sm
                    text-gray-500
                  ">
                    {
                      formatRupiah(
                        layanan?.harga || 0
                      )
                    }
                  </p>

                </div>

              </div>

              {/* =================================================
                 DETAIL ACARA
              ================================================= */}

              <div className="
                rounded-3xl
                border
                p-6
              ">

                <h3 className="
                  text-lg
                  font-semibold
                ">
                  Detail Acara
                </h3>

                <div className="
                  mt-5
                  grid
                  gap-5
                  md:grid-cols-2
                ">

                  <div>

                    <p className="
                      text-sm
                      text-gray-500
                    ">
                      Nama Acara
                    </p>

                    <p className="
                      mt-1
                      font-medium
                    ">
                      {
                        detail?.nama_acara ||
                        "-"
                      }
                    </p>

                  </div>

                  <div>

                    <p className="
                      text-sm
                      text-gray-500
                    ">
                      Lokasi
                    </p>

                    <p className="
                      mt-1
                      font-medium
                    ">
                      {
                        detail?.lokasi ||
                        "-"
                      }
                    </p>

                  </div>

                  <div>

                    <p className="
                      text-sm
                      text-gray-500
                    ">
                      Tanggal Acara
                    </p>

                    <p className="
                      mt-1
                      font-medium
                    ">
                      {
                        detail?.tanggal_acara

                          ? new Date(
                              detail.tanggal_acara
                            ).toLocaleDateString(
                              "id-ID",
                              {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )

                          : "-"
                      }
                    </p>

                  </div>

                  <div>

                    <p className="
                      text-sm
                      text-gray-500
                    ">
                      Catatan
                    </p>

                    <p className="
                      mt-1
                      font-medium
                    ">
                      {
                        detail?.catatan ||
                        "-"
                      }
                    </p>

                  </div>

                </div>

              </div>

              {/* =================================================
                 PAYMENT SUMMARY
              ================================================= */}

              <div className="
                rounded-3xl
                border
                p-6
              ">

                <h3 className="
                  text-lg
                  font-semibold
                ">
                  Payment Summary
                </h3>

                <div className="
                  mt-5
                  grid
                  gap-5
                  md:grid-cols-4
                ">

                  <div>

                    <p className="
                      text-sm
                      text-gray-500
                    ">
                      Total Harga
                    </p>

                    <p className="
                      mt-1
                      text-xl
                      font-bold
                    ">
                      {
                        formatRupiah(
                          summary?.totalHarga || 0
                        )
                      }
                    </p>

                  </div>

                  <div>

                    <p className="
                      text-sm
                      text-gray-500
                    ">
                      Total Dibayar
                    </p>

                    <p className="
                      mt-1
                      text-xl
                      font-bold
                      text-green-600
                    ">
                      {
                        formatRupiah(
                          summary?.totalDibayar || 0
                        )
                      }
                    </p>

                  </div>

                  <div>

                    <p className="
                      text-sm
                      text-gray-500
                    ">
                      Sisa Tagihan
                    </p>

                    <p className="
                      mt-1
                      text-xl
                      font-bold
                      text-red-500
                    ">
                      {
                        formatRupiah(
                          summary?.sisa || 0
                        )
                      }
                    </p>

                  </div>

                  <div>

                    <p className="
                      text-sm
                      text-gray-500
                    ">
                      Status
                    </p>

                    <p className="
                      mt-1
                      text-xl
                      font-bold
                    ">
                      {
                        summary?.status ||
                        "-"
                      }
                    </p>

                  </div>

                </div>

              </div>

              {/* =================================================
                 PAYMENTS
              ================================================= */}

              {
                payments.length > 0 && (

                  <div className="
                    rounded-3xl
                    border
                    p-6
                  ">

                    <h3 className="
                      text-lg
                      font-semibold
                    ">
                      Riwayat Pembayaran
                    </h3>

                    <div className="
                      mt-5
                      space-y-4
                    ">

                      {
                        payments.map(
                          (item: any) => (

                            <div
                              key={item._id}
                              className="
                                rounded-2xl
                                bg-gray-50
                                p-4
                              "
                            >

                              <div className="
                                flex
                                items-center
                                justify-between
                              ">

                                <div>

                                  <p className="
                                    font-semibold
                                  ">
                                    {
                                      formatRupiah(
                                        item.jumlah
                                      )
                                    }
                                  </p>

                                  <p className="
                                    text-sm
                                    text-gray-500
                                  ">
                                    {
                                      item.metode ||
                                      "-"
                                    }
                                  </p>

                                </div>

                                <div className="
                                  text-right
                                ">

                                  <p className="
                                    text-sm
                                    text-gray-500
                                  ">
                                    {
                                      item.createdAt

                                        ? new Date(
                                            item.createdAt
                                          ).toLocaleDateString(
                                            "id-ID"
                                          )

                                        : "-"
                                    }
                                  </p>

                                  <p className="
                                    mt-1
                                    text-xs
                                    text-gray-400
                                  ">
                                    {
                                      item.status
                                    }
                                  </p>

                                </div>

                              </div>

                            </div>
                          )
                        )
                      }

                    </div>

                  </div>
                )
              }

              {/* =================================================
                 ACTIVITY LOGS
              ================================================= */}

              {
                logs.length > 0 && (

                  <div className="
                    rounded-3xl
                    border
                    p-6
                  ">

                    <h3 className="
                      text-lg
                      font-semibold
                    ">
                      Activity Logs
                    </h3>

                    <div className="
                      mt-5
                      space-y-4
                    ">

                      {
                        logs.map(
                          (log: any) => (

                            <div
                              key={log._id}
                              className="
                                rounded-2xl
                                bg-gray-50
                                p-4
                              "
                            >

                              <p className="
                                font-medium
                              ">
                                {
                                  log.action ||
                                  log.aksi ||
                                  "-"
                                }
                              </p>

                              <p className="
                                mt-1
                                text-sm
                                text-gray-500
                              ">
                                {
                                  log.description ||
                                  "-"
                                }
                              </p>

                              <p className="
                                mt-2
                                text-xs
                                text-gray-400
                              ">
                                {
                                  log.createdAt

                                    ? new Date(
                                        log.createdAt
                                      ).toLocaleString(
                                        "id-ID"
                                      )

                                    : "-"
                                }
                              </p>

                            </div>
                          )
                        )
                      }

                    </div>

                  </div>
                )
              }

            </div>
          )
        }

      </div>

    </div>
  );
}