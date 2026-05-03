import { useEffect, useState } from "react";
import { getAdminDashboard } from "@/services/dashboard.service";

export const useAdminDashboard = (query: any) => {
  const [data, setData] = useState<any>(null);

  const fetchData = async () => {
    try {
      const res = await getAdminDashboard(query);
      setData(res);
    } catch (err) {
      console.error("DASHBOARD ERROR:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [JSON.stringify(query)]);

  return { data };
};