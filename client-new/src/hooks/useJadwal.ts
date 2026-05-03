import { useEffect, useState } from "react";
import { getJadwal } from "@/services/jadwal.service";

export const useJadwal = (query: any) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getJadwal(query);
      setData(res.data); // backend kamu return array
    } catch (err) {
      console.error("ERROR JADWAL:", err);
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
    reload: fetchData,
  };
};