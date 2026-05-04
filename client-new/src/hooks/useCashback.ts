import { useEffect, useState } from "react";
import { getCashbacks } from "@/services/cashback.service";

export const useCashback = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await getCashbacks();

      // 🔥 handle kemungkinan response beda bentuk
      if (Array.isArray(res)) {
        setData(res);
      } else if (res?.data) {
        setData(res.data);
      } else {
        setData([]);
      }

    } catch (err) {
      console.error("CASHBACK ERROR:", err);
      setData([]); // 🔥 anti crash
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    data,
    loading,
    reload: fetchData,
  };
};