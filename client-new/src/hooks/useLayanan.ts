"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  getAllLayanan,
} from "@/services/layanan.service";

export const useLayanan = (
  query = {}
) => {

  const [data, setData] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(false);

  const fetchData =
    async () => {

      try {

        setLoading(true);

        const res =
          await getAllLayanan(query);

        console.log(
          "LAYANAN:",
          res
        );

        setData(
          res?.data ||
          []
        );

      } catch (err) {

        console.error(
          "GET LAYANAN ERROR:",
          err
        );

      } finally {

        setLoading(false);
      }
    };

  useEffect(() => {

    fetchData();

  }, [
    JSON.stringify(query)
  ]);

  return {

    data,

    loading,

    refresh: fetchData,
  };
};