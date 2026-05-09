"use client";

import {
  useEffect,
  useState,
} from "react";

import OrderCard
from "@/components/modal/OrderCard";

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

    <div>

      {/* =====================================================
         HEADER
      ===================================================== */}

      <div className="
        rounded-[2rem]
        border
        bg-white
        p-8
        shadow-sm
      ">

        <p className="
          text-sm
          uppercase
          tracking-[0.3em]
          text-[#C9AE63]
        ">
          Orders
        </p>

        <h1 className="
          mt-3
          text-4xl
          font-bold
        ">
          Pesanan Saya
        </h1>

        <p className="
          mt-4
          max-w-2xl
          text-gray-600
        ">
          Lihat seluruh riwayat pemesanan dan
          progress dekorasi acara Anda.
        </p>

      </div>

      {/* =====================================================
         CONTENT
      ===================================================== */}

      <div className="
        mt-8
        space-y-6
      ">

        {
          loading ? (

            <div className="
              rounded-[2rem]
              border
              bg-white
              p-10
              text-center
              text-gray-500
            ">
              Loading...
            </div>

          ) : orders.length === 0 ? (

            <div className="
              rounded-[2rem]
              border
              bg-white
              p-10
              text-center
            ">

              <h2 className="
                text-2xl
                font-bold
              ">
                Belum Ada Pesanan
              </h2>

              <p className="
                mt-3
                text-gray-500
              ">
                Anda belum melakukan pemesanan.
              </p>

            </div>

          ) : (

            orders.map(
              (item) => (

                <OrderCard
                  key={item._id}
                  item={item}
                />
              )
            )
          )
        }

      </div>

    </div>
  );
}