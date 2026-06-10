"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import {
  Plus,
  Pencil,
  Trash2,
  Star,
  Images,
  Search,
  FolderKanban,
  Sparkles,
} from "lucide-react";

import toast from "react-hot-toast";

import PortfolioFormModal from "@/components/form/PortfolioFormModal";

import {
  createPortfolio,
  deletePortfolio,
  getPortfolioDetail,
  updatePortfolio,
} from "@/services/portfolio.service";

import { usePortfolio } from "@/hooks/usePortfolio";

export default function AdminPortfolioPage() {
  const {
    data,
    loading,
    refresh,
  } = usePortfolio();

  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<any>(null);

  const filteredData = useMemo(() => {
    return data.filter((item) =>
      item.title
        ?.toLowerCase()
        ?.includes(search.toLowerCase())
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

      await createPortfolio(formData);

      toast.success("Portfolio berhasil dibuat");

      closeModal();

      refresh();
    } catch (err: any) {
      console.error(err);

      toast.error(
        err?.response?.data?.message ??
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
        toast.error("Portfolio ID tidak ditemukan");
        return;
      }

      setSaving(true);

      await updatePortfolio(
        selected._id,
        formData
      );

      toast.success("Portfolio berhasil diupdate");

      closeModal();

      refresh();
    } catch (err: any) {
      console.error(err);

        toast.error(
          err?.response?.data?.message ??
            "Gagal update portfolio"
        );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (
    id: string
  ) => {
    toast((t) => (
      <div className="w-[300px]">

        <p className="font-semibold text-sm">
          Hapus Portfolio?
        </p>

        <p className="text-sm text-gray-500 mt-1">
          Data portfolio tidak dapat dikembalikan
        </p>

        <div className="flex justify-end gap-2 mt-4">

          <button
            onClick={() => toast.dismiss(t.id)}
            className="
              px-3
              py-2
              rounded-xl
              border
              text-sm
            "
          >
            Batal
          </button>

          <button
            onClick={async () => {
              toast.dismiss(t.id);

              try {
                await deletePortfolio(id);

                toast.success(
                  "Portfolio berhasil dihapus"
                );

                refresh();
              } catch (err: any) {
                console.error(err);

                toast.error(
                  err?.response?.data?.message ??
                    "Gagal menghapus portfolio"
                );
              }
            }}
            className="
              px-3
              py-2
              rounded-xl
              bg-red-500
              text-white
              text-sm
            "
          >
            Hapus
          </button>

        </div>

      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 via-white to-neutral-100 p-6 lg:p-8">

      {/* Header */}

      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <h1 className="mt-5 text-4xl font-bold tracking-tight text-neutral-900">

            Portfolio Management

          </h1>

          <p className="mt-2 text-neutral-500">

            Kelola seluruh portfolio yang ditampilkan pada website.

          </p>

        </div>

        <button
          onClick={() => {
            setSelected(null);
            setOpen(true);
          }}
          className="inline-flex items-center justify-center gap-3 rounded-2xl bg-black px-6 py-4 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
        >
          <Plus size={18} />

          Create Portfolio
        </button>

      </div>

      {/* Search */}

      <div className="mt-8 rounded-3xl border border-neutral-200 bg-white px-4 shadow-sm">

        <div className="flex items-center gap-4 rounded-2xl px-5">

          <Search
            size={20}
            className="text-neutral-500"
          />

          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Cari portfolio..."
            className="h-14 w-full text-sm outline-none"
          />
        </div>

      </div>

      {/* Content */}

      {loading ? (
        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm animate-pulse"
            >
              <div className="h-[300px] bg-neutral-200" />

              <div className="space-y-4 p-6">
                <div className="h-4 w-24 rounded bg-neutral-200" />

                <div className="h-7 w-3/4 rounded bg-neutral-200" />

                <div className="space-y-2">
                  <div className="h-3 rounded bg-neutral-200" />
                  <div className="h-3 rounded bg-neutral-200" />
                  <div className="h-3 w-2/3 rounded bg-neutral-200" />
                </div>

                <div className="flex gap-3 pt-4">
                  <div className="h-12 flex-1 rounded-2xl bg-neutral-200" />
                  <div className="h-12 w-12 rounded-2xl bg-neutral-200" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredData.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-neutral-200 bg-white px-8 py-20 text-center shadow-sm">

          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-neutral-100">
            <Images
              size={34}
              className="text-neutral-500"
            />
          </div>

          <h2 className="mt-7 text-3xl font-bold text-neutral-900">
            Belum Ada Portfolio
          </h2>

          <p className="mx-auto mt-3 max-w-lg text-neutral-500">
            Belum ada data portfolio yang tersedia.
            Silakan tambahkan portfolio baru agar
            dapat ditampilkan pada website.
          </p>

        </div>
      ) : (
        <div className="mt-8 grid gap-7 md:grid-cols-2 xl:grid-cols-3">

          {filteredData.map((item: any) => {

            const coverImage =
              item.coverImage?.url
                ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${item.coverImage.url}`
                : "/placeholder.jpg";

            return (

              <div
                key={item._id}
                className="group overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >

                <div className="relative h-[320px] overflow-hidden">

                  <Image
                    src={coverImage}
                    alt={item.title}
                    fill
                    priority
                    unoptimized
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />

                  {item.isFeatured && (
                    <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-[#D4B36A] px-4 py-2 text-xs font-bold text-black shadow">

                      <Star size={14} />

                      FEATURED

                    </div>
                  )}

                </div>

                <div className="p-6">

                  {item.layananIds?.length > 0 && (

                    <div className="mb-4 flex flex-wrap gap-2">

                      {item.layananIds.map(
                        (layanan: any) => (

                          <span
                            key={layanan._id}
                            className="rounded-full bg-neutral-100 px-3 py-1.5 text-xs font-medium text-neutral-700"
                          >
                            {layanan.nama}
                          </span>

                        )
                      )}

                    </div>

                  )}

                  <h2 className="line-clamp-1 text-2xl font-bold text-neutral-900">
                    {item.title}
                  </h2>

                  <p className="mt-4 line-clamp-3 text-sm leading-7 text-neutral-500">
                    {item.excerpt}
                  </p>

                  <div className="mt-7 flex items-center justify-between border-t border-neutral-100 pt-5">

                  <div className="text-sm text-neutral-500">
                    {item.photos?.length || 0} Images
                  </div>

                    <div className="flex gap-3">

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

                            toast.error(
                              "Gagal mengambil detail portfolio"
                            );
                          }
                        }}
                        className="inline-flex items-center gap-2 rounded-2xl bg-neutral-100 px-5 py-3 text-sm font-semibold transition hover:bg-neutral-200"
                      >
                        <Pencil size={16} />

                        Edit
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(item._id)
                        }
                        className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600 transition hover:bg-red-100"
                      >
                        <Trash2 size={18} />
                      </button>

                    </div>

                  </div>

                </div>

              </div>

            );
          })}

        </div>
      )}

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