import { useEffect, useState } from "react";
import { getPegawai } from "@/services/pegawai.service";

export const usePegawai = (query: any) => {
  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    getPegawai(query).then((res) => {
      setData(res.data.data);
      setTotal(res.data.total);
    });
  }, [query]);

  return { data, total };
};