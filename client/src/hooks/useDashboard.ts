"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";

export const useDashboard = (
  role: "admin" | "pegawai",
  query?: any
) => {
  const [data, setData] = useState<any>(null);

  const fetchData = async () => {
    try {
      const url =
        role === "admin"
          ? "/dashboard/admin"
          : "/dashboard/pegawai";

      const res = await api.get(url, {
        params: query,
      });

      // DEBUG: log semua keys dari response agar mudah trace field
      if (process.env.NODE_ENV === "development") {
        console.log("[useDashboard] keys:", Object.keys(res.data || {}));
        console.log("[useDashboard] data:", res.data);
      }

      setData(res.data);
    } catch (err) {
      console.error("DASHBOARD ERROR:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [role, JSON.stringify(query)]);

  return { data, refetch: fetchData };
};