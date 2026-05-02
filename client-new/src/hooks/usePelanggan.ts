import { useEffect, useState } from "react";
import { getPelanggan } from "@/services/pelanggan.service";

export const usePelanggan = (query: any) => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    getPelanggan(query).then((res) => {
      setData(res.data.data);
    });
  }, [query]);

  return { data };
};