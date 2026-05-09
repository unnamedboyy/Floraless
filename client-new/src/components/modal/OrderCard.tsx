"use client";

import Link from "next/link";

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

const getStatusColor = (
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

export default function OrderCard({
  item,
}: Props) {

  const detail =
    item?.detail;

  const layanan =
    item?.layananId;

  return (

    <div className="
      rounded-[2rem]
      border
      bg-white
      p-6
      shadow-sm
    ">

      <div className="
        flex
        flex-col
        gap-6
        lg:flex-row
        lg:items-center
        lg:justify-between
      ">

        {/* ===================================================
           LEFT
        =================================================== */}

        <div className="
          flex-1
        ">

          <div className="
            flex
            flex-wrap
            items-center
            gap-3
          ">

            <span className={`
              rounded-xl
              px-3
              py-1
              text-xs
              font-semibold
              ${getStatusColor(item.status)}
            `}>

              {
                item.status
              }

            </span>

            <p className="
              text-sm
              text-gray-500
            ">
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
            </p>

          </div>

          <h3 className="
            mt-4
            text-2xl
            font-bold
          ">

            {
              detail?.nama_acara ||
              "Acara"
            }

          </h3>

          <p className="
            mt-2
            text-gray-600
          ">

            {
              detail?.lokasi ||
              "-"
            }

          </p>

          <div className="
            mt-5
            flex
            flex-wrap
            gap-8
          ">

            <div>

              <p className="
                text-sm
                text-gray-500
              ">
                Layanan
              </p>

              <p className="
                mt-1
                font-semibold
              ">
                {
                  layanan?.nama ||
                  "-"
                }
              </p>

            </div>

            <div>

              <p className="
                text-sm
                text-gray-500
              ">
                Harga
              </p>

              <p className="
                mt-1
                font-semibold
              ">
                {
                  formatRupiah(
                    layanan?.harga || 0
                  )
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
                font-semibold
              ">

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

              </p>

            </div>

          </div>

        </div>

        {/* ===================================================
           RIGHT
        =================================================== */}

        <div className="
          flex
          items-center
          gap-3
        ">

          <Link
            href={`/profile/orders/${item._id}`}
            className="
              rounded-full
              bg-black
              px-6
              py-3
              text-sm
              font-semibold
              text-white
              transition
              hover:opacity-90
            "
          >
            Lihat Detail
          </Link>

        </div>

      </div>

    </div>
  );
}