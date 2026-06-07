"use client";

import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  MapPin,
} from "lucide-react";

type Props = {
  item: any;
};

const formatRupiah = (
  num: number
) =>
  "Rp " +
  (num || 0).toLocaleString(
    "id-ID"
  );

const getStatusLabel = (
  status: string
) => {

  const map: any = {

    pending: "Pending",

    approved: "Approved",

    in_progress:
      "In Progress",

    done: "Selesai",

    rejected: "Rejected",
  };

  return (
    map[status] || status
  );
};

const getStatusColor = (
  status: string
) => {

  const map: any = {

    pending:
      "text-gray-600",

    approved:
      "text-amber-600",

    in_progress:
      "text-blue-600",

    done:
      "text-emerald-600",

    rejected:
      "text-red-600",
  };

  return (
    map[status] ||
    "text-gray-600"
  );
};

export default function OrderCard({
  item,
}: Props) {

  const detail =
    item?.detail;

  const layanan =
    item?.layananId;

  return (

    <div
      className="
        border-b
        border-gray-200
        py-8

        transition-all
        duration-200

        hover:bg-gray-50/60
      "
    >

      <div
        className="
          flex
          flex-col
          gap-6

          lg:flex-row
          lg:items-center
          lg:justify-between
        "
      >

        {/* ==========================================
           LEFT
        ========================================== */}

        <div className="flex-1">

          <div
            className="
              flex
              flex-wrap
              items-center
              gap-3
            "
          >

            <span
              className={`
                text-sm
                font-semibold
                ${getStatusColor(
                  item.status
                )}
              `}
            >

              {
                getStatusLabel(
                  item.status
                )
              }

            </span>

            <span
              className="
                text-gray-300
              "
            >
              •
            </span>

            <span
              className="
                text-sm
                text-gray-500
              "
            >

              {
                new Date(
                  item.createdAt
                ).toLocaleDateString(
                  "id-ID",
                  {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  }
                )
              }

            </span>

          </div>

          <h2
            className="
              mt-4

              text-3xl
              font-bold
              tracking-tight

              text-[#111827]
            "
          >

            {
              detail?.nama_acara ||
              "Acara"
            }

          </h2>

          <div
            className="
              mt-4

              flex
              flex-wrap
              items-center
              gap-x-6
              gap-y-3

              text-gray-600
            "
          >

            <div
              className="
                flex
                items-center
                gap-2
              "
            >

              <MapPin
                size={16}
              />

              {
                detail?.lokasi ||
                "-"
              }

            </div>

            <div
              className="
                flex
                items-center
                gap-2
              "
            >

              <CalendarDays
                size={16}
              />

              {
                detail?.tanggal_acara

                  ? new Date(
                      detail.tanggal_acara
                    ).toLocaleDateString(
                      "id-ID",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }
                    )

                  : "-"
              }

            </div>

          </div>

          <div
            className="
              mt-6

              grid
              grid-cols-2
              gap-8

              md:grid-cols-3
            "
          >

            <div>

              <p
                className="
                  text-sm
                  text-gray-500
                "
              >
                Layanan
              </p>

              <p
                className="
                  mt-1
                  font-medium
                  text-[#111827]
                "
              >
                {
                  layanan?.nama ||
                  "-"
                }
              </p>

            </div>

            <div>

              <p
                className="
                  text-sm
                  text-gray-500
                "
              >
                Harga
              </p>

              <p
                className="
                  mt-1
                  font-medium
                  text-[#111827]
                "
              >

                {
                  formatRupiah(
                    layanan?.harga ||
                      0
                  )
                }

              </p>

            </div>

          </div>

        </div>

        {/* ==========================================
           ACTION
        ========================================== */}

        <Link
          href={`/profile/orders/${item._id}`}
          className="
            inline-flex
            items-center
            gap-2

            text-sm
            font-semibold

            text-[#111827]

            hover:gap-3

            transition-all
          "
        >

          Lihat Detail

          <ArrowRight
            size={16}
          />

        </Link>

      </div>

    </div>
  );
}