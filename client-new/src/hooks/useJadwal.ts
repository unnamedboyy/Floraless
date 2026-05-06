import { useEffect, useState } from "react";
import axios from "@/lib/axios";

export function useJadwal(query: any) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await axios.get("/jadwal", {
        params: query
      });

      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [JSON.stringify(query)]);

  return {
    data,
    loading,
    refetch: fetchData
  };
}