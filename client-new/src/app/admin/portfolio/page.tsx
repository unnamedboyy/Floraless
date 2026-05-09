"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import {
  Plus,
  Pencil,
  Trash2,
  Star,
  Images,
} from "lucide-react";

import PortfolioFormModal
from "@/components/form/PortfolioFormModal";

import {
  createPortfolio,
  deletePortfolio,
  getPortfolioDetail,
  updatePortfolio,
} from "@/services/portfolio.service";

import {
  usePortfolio,
} from "@/hooks/usePortfolio";

export default function AdminPortfolioPage() {

  const {
    data,
    loading,
    refresh,
  } = usePortfolio();

  const [open,
    setOpen] = useState(false);

  const [saving,
    setSaving] = useState(false);

  const [search,
    setSearch] = useState("");

  const [selected,
    setSelected] = useState<any>(null);

  const filteredData =
    useMemo(() => {

      return data.filter((item) =>

        item.title
          ?.toLowerCase()
          ?.includes(
            search.toLowerCase()
          )
      );

    }, [data, search]);

  const closeModal = () => {

    setOpen(false);

    setSelected(null);
  };

  const handleCreate = async (
    formData: FormData
  ) => {

    try {

      setSaving(true);

      await createPortfolio(
        formData
      );

      alert(
        "Portfolio berhasil dibuat"
      );

      closeModal();

      refresh();

    } catch (err: any) {

      console.error(err);

      alert(

        err?.response?.data?.message ||

        "Gagal membuat portfolio"
      );

    } finally {

      setSaving(false);
    }
  };

  const handleUpdate = async (
    formData: FormData
  ) => {

    try {

      if (!selected?._id) {

        alert(
          "Portfolio ID tidak ditemukan"
        );

        return;
      }

      setSaving(true);

      await updatePortfolio(
        selected._id,
        formData
      );

      alert(
        "Portfolio berhasil diupdate"
      );

      closeModal();

      refresh();

    } catch (err: any) {

      console.error(err);

      alert(

        err?.response?.data?.message ||

        "Gagal update portfolio"
      );

    } finally {

      setSaving(false);
    }
  };

  const handleDelete = async (
    id: string
  ) => {

    const confirmDelete =
      confirm(
        "Hapus portfolio ini?"
      );

    if (!confirmDelete) {
      return;
    }

    try {

      await deletePortfolio(id);

      alert(
        "Portfolio berhasil dihapus"
      );

      refresh();

    } catch (err: any) {

      console.error(err);

      alert(

        err?.response?.data?.message ||

        "Gagal menghapus portfolio"
      );
    }
  };

  return (

    <div className="
      min-h-screen
      bg-[#f8f8f8]
      p-6
      md:p-8
    ">

      <div className="
        mb-8
        flex
        flex-col
        gap-5
        lg:flex-row
        lg:items-center
        lg:justify-between
      ">

        <div>

          <p className="
            text-sm
            font-medium
            tracking-[0.3em]
            text-neutral-400
          ">
            FLORALESS ADMIN
          </p>

          <h1 className="
            mt-3
            text-4xl
            font-bold
            tracking-tight
            text-[#111]
          ">
            Portfolio Management
          </h1>

        </div>

        <button
          onClick={() => {

            setSelected(null);

            setOpen(true);
          }}
          className="
            inline-flex
            items-center
            gap-3
            rounded-2xl
            bg-black
            px-6
            py-4
            text-sm
            font-semibold
            text-white
          "
        >

          <Plus size={18} />

          Create Portfolio

        </button>

      </div>

      <div className="
        mb-8
        rounded-[28px]
        border
        bg-white
        p-3
      ">

        <input
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          placeholder="Cari portfolio..."
          className="
            h-14
            w-full
            rounded-2xl
            border-0
            bg-transparent
            px-5
            text-sm
            outline-none
          "
        />

      </div>

      {
        loading ? (

          <div className="rounded-[32px] border bg-white p-20 text-center text-neutral-400">
            Loading portfolio...
          </div>

        ) : filteredData.length === 0 ? (

          <div className="rounded-[32px] border bg-white p-20 text-center">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-neutral-100">
              <Images size={30} />
            </div>

            <h2 className="mt-6 text-2xl font-bold">
              Belum Ada Portfolio
            </h2>

          </div>

        ) : (

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

            {
              filteredData.map(
                (item: any) => {

                  const coverImage =
                    item.coverImage?.url

                      ? `${process.env.NEXT_PUBLIC_API_URL}${item.coverImage.url}`

                      : "/placeholder.jpg";

                  return (

                    <div
                      key={item._id}
                      className="overflow-hidden rounded-[32px] border bg-white shadow-sm"
                    >

                      <div className="relative h-[320px] overflow-hidden">

                        <Image
                          src={coverImage}
                          alt={item.title}
                          fill
                          unoptimized
                          priority
                          className="object-cover"
                        />

                        {
                          item.isFeatured && (

                            <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-[#D4B36A] px-4 py-2 text-xs font-semibold text-black">

                              <Star size={14} />

                              FEATURED

                            </div>
                          )
                        }

                      </div>

                      <div className="p-6">

                        {
                          item.layananIds?.length > 0 && (

                            <div className="mb-4 flex flex-wrap gap-2">

                              {
                                item.layananIds.map(
                                  (layanan: any) => (

                                    <span
                                      key={layanan._id}
                                      className="rounded-full bg-neutral-100 px-3 py-1.5 text-xs font-medium text-neutral-700"
                                    >
                                      {layanan.nama}
                                    </span>
                                  )
                                )
                              }

                            </div>
                          )
                        }

                        <h2 className="line-clamp-1 text-2xl font-bold text-[#111]">
                          {item.title}
                        </h2>

                        <p className="mt-4 line-clamp-3 text-sm leading-[1.9] text-neutral-500">
                          {item.excerpt}
                        </p>

                        <div className="mt-7 flex items-center gap-3">

                          <button
                            onClick={async () => {

                              try {

                                const res =
                                  await getPortfolioDetail(
                                    item._id
                                  );

                                setSelected({

                                  ...res.portfolio,

                                  images:
                                    res.images || [],

                                  coverImage:
                                    res.coverImage || null,
                                });

                                setOpen(true);

                              } catch (err) {

                                console.error(err);

                                alert(
                                  "Gagal ambil detail portfolio"
                                );
                              }
                            }}
                            className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border px-5 py-3.5 text-sm font-semibold"
                          >

                            <Pencil size={16} />

                            Edit

                          </button>

                          <button
                            onClick={() =>
                              handleDelete(
                                item._id
                              )
                            }
                            className="flex h-[52px] w-[52px] items-center justify-center rounded-2xl border text-red-500"
                          >
                            <Trash2 size={18} />
                          </button>

                        </div>

                      </div>

                    </div>
                  );
                }
              )
            }

          </div>
        )
      }

      <PortfolioFormModal
        open={open}
        onClose={closeModal}
        loading={saving}
        initialData={selected}
        onSubmit={
          selected
            ? handleUpdate
            : handleCreate
        }
      />

    </div>
  );
}
