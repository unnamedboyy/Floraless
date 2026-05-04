import { useEffect, useState } from "react";
import api from "@/lib/axios";

export const useJadwal = (query: any) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await api.get("/jadwal", {
        params: query,
      });

      setData(res.data);
    } catch (err) {
      console.error("JADWAL ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [query.start, query.end]);

  return {
    data,
    loading,
    reload: fetchData,
  };
};