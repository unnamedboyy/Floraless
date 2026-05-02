import { useEffect, useState } from "react";
import api from "@/lib/axios";

export const useTickets = (query: any) => {
  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

  const fetchData = async () => {
    try {
      const res = await api.get("/tickets", {
        params: query,
      });

      setData(res.data.data);
      setTotal(res.data.total);
    } catch (err) {
      console.error("FETCH TICKETS ERROR:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [query]);

  return {
    data,
    total,
    reload: fetchData,
  };
};