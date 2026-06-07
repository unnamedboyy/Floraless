"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/axios";

export function useVoucher(query: any) {

  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

  const [loading, setLoading] =
    useState(false);

  const fetchData = async () => {

    try {

      setLoading(true);

      const res = await axios.get(
        "/vouchers",
        {
          params: query,
        }
      );

      /*
        support:
        res.data.data
        atau
        res.data langsung array
      */

      const rows =
        res.data?.data || res.data || [];

      const totalData =
        res.data?.total ||
        rows.length ||
        0;

      setData(rows);
      setTotal(totalData);

    } catch (err) {

      console.error(err);

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