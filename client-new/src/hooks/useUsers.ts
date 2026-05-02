import { useEffect, useState } from "react";
import { getUsersByRole } from "@/services/user.service";

export const useUsers = (role: "pegawai" | "pelanggan", query: any) => {
  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getUsersByRole(role, query);
      setData(res.data.data);
      setTotal(res.data.total);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [JSON.stringify(query), role]);

  return { data, total, loading, reload: fetchData };
};