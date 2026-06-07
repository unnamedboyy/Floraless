import { useEffect, useState } from "react";
import { reviewService } from "@/services/review.service";

export function useReviews() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await reviewService.getAll();
      setData(res.data); // ✅ FIX DI SINI
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggle = async (id: string) => {
    await reviewService.toggle(id);
    fetchData();
  };

  const remove = async (id: string) => {
    await reviewService.remove(id);
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, toggle, remove };
}