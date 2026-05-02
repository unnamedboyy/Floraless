import { useEffect, useState } from "react";
import {
  getAdminDashboard,
  getPegawaiDashboard,
} from "@/services/dashboard.service";

export const useAdminDashboard = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAdminDashboard();
        setData(res);
      } catch (err) {
        console.error("ADMIN DASHBOARD ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading };
};

export const usePegawaiDashboard = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getPegawaiDashboard();
        setData(res);
      } catch (err) {
        console.error("PEGAWAI DASHBOARD ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading };
};