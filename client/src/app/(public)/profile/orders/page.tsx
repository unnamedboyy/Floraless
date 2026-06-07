"use client";

import {
  useEffect,
  useState,
} from "react";

import OrderCard from "@/components/modal/OrderCard";

import {
  getTickets,
} from "@/services/ticket.service";

export default function OrdersPage() {

  const [loading, setLoading] =
    useState(true);

  const [orders, setOrders] =
    useState<any[]>([]);

  /* =========================================================
     FETCH
  ========================================================= */

  useEffect(() => {

    fetchOrders();

  }, []);

  const fetchOrders =
    async () => {

      try {

        setLoading(true);

        const res =
          await getTickets();

        const data =
          Array.isArray(
            res.data?.data
          )
            ? res.data.data
            : [];

        setOrders(data);

      } catch (err) {

        console.error(err);

      } finally {

        setLoading(false);

      }

    };

  return (

    <div 
      className="
        rounded-[32px]
        border
        border-gray-200
        bg-white
        p-10"
    >

      {/* =====================================================
         HEADER
      ===================================================== */}

      <div>

        <p
          className="
            text-sm
            uppercase
            tracking-[0.35em]
            text-[#C9AE63]
            font-medium
          "
        >
          Orders
        </p>

        <h1
          className="
            mt-4
            text-5xl
            font-bold
            tracking-tight
            text-[#111827]
          "
        >
          Pesanan Saya
        </h1>

        <p
          className="
            mt-5
            max-w-3xl
            text-lg
            leading-8
            text-gray-500
          "
        >
          Lihat seluruh riwayat pemesanan,
          progress pengerjaan dekorasi,
          pembayaran, serta perkembangan
          acara Anda dalam satu tempat.
        </p>

      </div>

      {/* =====================================================
         STATS
      ===================================================== */}

      <div
        className="
          mt-14
          grid
          gap-8

          md:grid-cols-3
        "
      >

        <div>

          <p
            className="
              text-sm
              uppercase
              tracking-wider
              text-gray-500
            "
          >
            Total Pesanan
          </p>

          <h2
            className="
              mt-3
              text-4xl
              font-bold
              text-[#111827]
            "
          >
            {orders.length}
          </h2>

        </div>

        <div>

          <p
            className="
              text-sm
              uppercase
              tracking-wider
              text-gray-500
            "
          >
            Sedang Berjalan
          </p>

          <h2
            className="
              mt-3
              text-4xl
              font-bold
              text-[#111827]
            "
          >
            {
              orders.filter(
                (item) =>
                  item.status ===
                  "in_progress"
              ).length
            }
          </h2>

        </div>

        <div>

          <p
            className="
              text-sm
              uppercase
              tracking-wider
              text-gray-500
            "
          >
            Selesai
          </p>

          <h2
            className="
              mt-3
              text-4xl
              font-bold
              text-[#111827]
            "
          >
            {
              orders.filter(
                (item) =>
                  item.status ===
                  "done"
              ).length
            }
          </h2>

        </div>

      </div>

      {/* =====================================================
         LIST SECTION
      ===================================================== */}

      <div
        className="
          mt-16
        "
      >

        <div
          className="
            pb-5
            border-b
            border-gray-300
          "
        >

          <h2
            className="
              text-2xl
              font-bold
              text-[#111827]
            "
          >
            Riwayat Pesanan
          </h2>

          <p
            className="
              mt-2
              text-gray-500
            "
          >
            Semua pesanan dan acara yang
            pernah Anda buat.
          </p>

        </div>

        {/* ===============================================
           LOADING
        =============================================== */}

        {
          loading && (

            <div
              className="
                py-24
                text-center
              "
            >

              <div
                className="
                  text-gray-500
                "
              >
                Loading pesanan...
              </div>

            </div>

          )
        }

        {/* ===============================================
           EMPTY
        =============================================== */}

        {
          !loading &&
          orders.length === 0 && (

            <div
              className="
                py-24
                text-center
              "
            >

              <h3
                className="
                  text-3xl
                  font-bold
                  text-[#111827]
                "
              >
                Belum Ada Pesanan
              </h3>

              <p
                className="
                  mt-4
                  text-gray-500
                "
              >
                Anda belum memiliki
                riwayat pemesanan layanan.
              </p>

            </div>

          )
        }

        {/* ===============================================
           LIST
        =============================================== */}

        {
          !loading &&
          orders.length > 0 && (

            <div>

              {
                orders.map(
                  (item) => (

                    <OrderCard
                      key={item._id}
                      item={item}
                    />

                  )
                )
              }

            </div>

          )
        }

      </div>

    </div>

  );

}