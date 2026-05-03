import { useEffect, useState } from "react";
import { getCashbacks } from "@/services/cashback.service";

export const useCashback = () => {
  const [data, setData] = useState<any[]>([]);

  const fetchData = async () => {
    try {
      const res = await getCashbacks();
      setData(res.data);
    } catch (err) {
      console.error("CASHBACK ERROR:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    data,
    reload: fetchData,
  };
};