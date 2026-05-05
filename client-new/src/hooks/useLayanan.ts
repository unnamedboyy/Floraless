"use client";

import { useEffect, useState } from "react";
import { getAllLayanan } from "@/services/layanan.service";

export const useLayanan = (query: any) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await getAllLayanan(query);

      // 🔥 sesuaikan dengan response backend kamu
      setData(res.data.data || res.data || []);
    } catch (err) {
      console.error("GET LAYANAN ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [query]);

  return {
    data,
    loading,
  };
};