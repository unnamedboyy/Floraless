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

      setData(res.data);
    } catch (err) {
      console.error("DASHBOARD ERROR:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [role, JSON.stringify(query)]);

  return { data };
};