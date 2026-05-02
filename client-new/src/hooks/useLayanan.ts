import { useEffect, useState } from "react";
import { layananService } from "@/services/layanan.service";

export function useLayanan() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await layananService.getAll({ search });
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const create = async (payload: any) => {
    await layananService.create(payload);
    fetchData();
  };

  const update = async (id: string, payload: any) => {
    await layananService.update(id, payload);
    fetchData();
  };

  const remove = async (id: string) => {
    await layananService.remove(id);
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, [search]);

  return {
    data,
    loading,
    search,
    setSearch,
    create,
    update,
    remove
  };
}