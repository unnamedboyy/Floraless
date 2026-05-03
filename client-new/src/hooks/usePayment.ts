import { useEffect, useState } from "react";
import { getPayments } from "@/services/payment.service";

export const usePayment = (query: any) => {
  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

  const fetchData = async () => {
    try {
      const res = await getPayments(query);
      setData(res.data.data);
      setTotal(res.data.total);
    } catch (err) {
      console.error("PAYMENT ERROR:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [JSON.stringify(query)]);

  return {
    data,
    total,
    reload: fetchData,
  };
};