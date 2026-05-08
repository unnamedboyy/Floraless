"use client";

import { useEffect, useState } from "react";

import {
  getPortfolios,
} from "@/services/portfolio.service";

export function usePortfolio() {

  const [data, setData] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const fetchData = async () => {

    try {

      const res =
        await getPortfolios();

      setData(
        Array.isArray(res)
          ? res
          : []
      );

    } catch (err) {

      console.error(err);

      setData([]);

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    data,
    loading,
    refresh: fetchData,
  };
}