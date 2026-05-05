"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";

export function useJadwal(query: any) {
  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await api.get("/jadwal", {
        params: {
          // 🔥 mapping query
          start: query.start,
          end: query.end,
          pegawaiId: query.pegawaiId,
        },
      });

      const result = res.data;

      // 🔥 backend kamu return array langsung
      setData(result || []);
      setTotal(result?.length || 0);

    } catch (err) {
      console.error("ERROR JADWAL:", err);
      setData([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [JSON.stringify(query)]);

  return {
    data,
    total,
    loading,
    reload: fetchData,
  };
}