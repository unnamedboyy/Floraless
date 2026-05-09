"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  getPortfolios,
} from "@/services/portfolio.service";

/* ================= TYPES ================= */

export type PortfolioItem = {

  _id: string;

  title: string;

  slug: string;

  excerpt: string;

  content?: string;

  createdAt: string;

  rating?: number;

  review?: string;

  isFeatured?: boolean;

  layananIds?: {
    _id: string;
    nama: string;
  }[];

  coverImage?: {

    _id?: string;

    url: string;

    isCover?: boolean;
  };
};

/* ================= HOOK ================= */

export function usePortfolio() {

  const [data, setData] =
    useState<PortfolioItem[]>([]);

  const [loading, setLoading] =
    useState(true);

  const fetchData =
    async () => {

      try {

        setLoading(true);

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