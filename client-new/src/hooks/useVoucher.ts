import { useEffect, useState } from "react";
import { getVouchers } from "@/services/voucher.service";

export const useVoucher = () => {
  const [data, setData] = useState<any[]>([]);

  const fetchData = async () => {
    try {
      const res = await getVouchers();
      setData(res.data.data);
    } catch (err) {
      console.error("VOUCHER ERROR:", err);
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