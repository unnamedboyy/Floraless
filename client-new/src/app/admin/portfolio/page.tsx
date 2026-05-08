"use client";

import Image from "next/image";

import {
  useEffect,
  useState,
} from "react";

import {
  Plus,
  Pencil,
  Trash2,
  X,
} from "lucide-react";

import {
  usePortfolio,
} from "@/hooks/usePortfolio";

import {
  createPortfolio,
  updatePortfolio,
  deletePortfolio,
  getPortfolioDetail,
} from "@/services/portfolio.service";

export default function AdminPortfolioPage() {

  const {
    data,
    loading,
    refresh,
  } = usePortfolio();

  const [open, setOpen] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [selected, setSelected] =
    useState<any>(null);

  const [title, setTitle] =
    useState("");

  const [excerpt, setExcerpt] =
    useState("");

  const [content, setContent] =
    useState("");

  const [thumbnail,
    setThumbnail] =
    useState<File | null>(null);

  const [thumbnailPreview,
    setThumbnailPreview] =
    useState("");

  const [gallery,
    setGallery] =
    useState<File[]>([]);

  const [galleryPreview,
    setGalleryPreview] =
    useState<string[]>([]);

  const [existingImages,
    setExistingImages] =
    useState<any[]>([]);

  useEffect(() => {

    if (!selected) {

      setTitle("");
      setExcerpt("");
      setContent("");

      setThumbnail(null);

      setThumbnailPreview("");

      setGallery([]);

      setGalleryPreview([]);

      setExistingImages([]);

      return;
    }

    setTitle(
      selected.title || ""
    );

    setExcerpt(
      selected.excerpt || ""
    );

    setContent(
      selected.content || ""
    );

    if (selected.thumbnail) {

      setThumbnailPreview(
        `${process.env.NEXT_PUBLIC_API_URL}${selected.thumbnail}`
      );
    }

    setExistingImages(
      selected.images || []
    );

  }, [selected]);

  const closeModal = () => {

    setOpen(false);

    setSelected(null);

    setTitle("");

    setExcerpt("");

    setContent("");

    setThumbnail(null);

    setGallery([]);

    setGalleryPreview([]);

    setExistingImages([]);
  };

  const handleGalleryChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    const files =
      Array.from(
        e.target.files || []
      );

    setGallery(files);

    const previews =
      files.map((file) =>
        URL.createObjectURL(file)
      );

    setGalleryPreview(previews);
  };

  const removeNewImage = (
    index: number
  ) => {

    const updatedGallery =
      [...gallery];

    updatedGallery.splice(index, 1);

    setGallery(updatedGallery);

    const updatedPreview =
      [...galleryPreview];

    updatedPreview.splice(index, 1);

    setGalleryPreview(
      updatedPreview
    );
  };

  const removeExistingImage = (
    index: number
  ) => {

    const updated =
      [...existingImages];

    updated.splice(index, 1);

    setExistingImages(updated);
  };

  const handleEdit = async (
    item: any
  ) => {

    try {

      const res =
        await getPortfolioDetail(
          item._id
        );

      setSelected({

        ...res.portfolio,

        images:
          res.images || []

      });

      setOpen(true);

    } catch (err) {

      console.error(err);

    }

  };

  const handleSave =
    async (
      e: React.FormEvent
    ) => {

      e.preventDefault();

      try {

        setSaving(true);

        const formData =
          new FormData();

        formData.append(
          "title",
          title
        );

        formData.append(
          "excerpt",
          excerpt
        );

        formData.append(
          "content",
          content
        );

        if (thumbnail) {

          formData.append(
            "thumbnail",
            thumbnail
          );
        }

        gallery.forEach(
          (img) => {

            formData.append(
              "gallery",
              img
            );
          }
        );

        formData.append(
          "existingImages",
          JSON.stringify(
            existingImages
          )
        );

        if (selected) {

          await updatePortfolio(
            selected._id,
            formData
          );

        } else {

          await createPortfolio(
            formData
          );
        }

        closeModal();

        refresh();

      } catch (err) {

        console.error(err);

      } finally {

        setSaving(false);
      }
    };

  const handleDelete =
    async (id: string) => {

      const ok =
        confirm(
          "Hapus portfolio?"
        );

      if (!ok) return;

      try {

        await deletePortfolio(id);

        refresh();

      } catch (err) {

        console.error(err);
      }
    };

  return (

    <div className="min-h-screen bg-[#f6f8fc] p-8">

      {/* HEADER */}

      <div className="mb-10 flex items-center justify-between">

        <div>

          <p className="text-sm text-gray-500">
            Admin
          </p>

          <h1 className="mt-2 text-4xl font-bold text-gray-900">
            Portfolio
          </h1>

        </div>

        <button
          onClick={() => {

            setSelected(null);

            setOpen(true);
          }}
          className="
            flex
            items-center
            gap-2
            rounded-2xl
            bg-black
            px-5
            py-3
            text-sm
            font-semibold
            text-white
          "
        >

          <Plus size={18} />

          Tambah Portfolio

        </button>

      </div>

      {/* GRID */}

      {loading ? (

        <div>
          Loading...
        </div>

      ) : (

        <div
          className="
            grid
            gap-7
            md:grid-cols-2
            xl:grid-cols-3
          "
        >

          {(data || []).map(
            (item: any) => (

              <div
                key={item._id}
                className="
                  overflow-hidden
                  rounded-[32px]
                  bg-white
                  shadow-sm
                "
              >

                <div className="relative h-[280px] overflow-hidden">

                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_URL}${item.thumbnail}`}
                    alt={item.title}
                    fill
                    unoptimized
                    className="
                      object-cover
                    "
                  />

                </div>

                <div className="p-6">

                  <h2 className="text-2xl font-semibold text-gray-900">
                    {item.title}
                  </h2>

                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-gray-500">
                    {item.excerpt}
                  </p>

                  <div className="mt-8 flex items-center justify-end gap-3">

                    <button
                      onClick={() =>
                        handleEdit(item)
                      }
                      className="
                        flex
                        h-12
                        w-12
                        items-center
                        justify-center
                        rounded-2xl
                        border
                      "
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(item._id)
                      }
                      className="
                        flex
                        h-12
                        w-12
                        items-center
                        justify-center
                        rounded-2xl
                        bg-red-500
                        text-white
                      "
                    >
                      <Trash2 size={18} />
                    </button>

                  </div>

                </div>

              </div>

            )
          )}

        </div>

      )}

      {/* MODAL */}

      {
        open && (

          <div className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/50
            p-6
          ">

            <div className="
              relative
              max-h-[95vh]
              w-full
              max-w-5xl
              overflow-y-auto
              rounded-[32px]
              bg-white
              p-8
            ">

              <button
                onClick={closeModal}
                className="
                  absolute
                  right-5
                  top-5
                "
              >
                <X size={28} />
              </button>

              <h2 className="
                text-5xl
                font-bold
              ">
                {
                  selected
                    ? "Edit Portfolio"
                    : "Create Portfolio"
                }
              </h2>

              <form
                onSubmit={handleSave}
                className="mt-10 space-y-8"
              >

                <input
                  value={title}
                  onChange={(e) =>
                    setTitle(e.target.value)
                  }
                  placeholder="Title"
                  className="
                    w-full
                    rounded-[24px]
                    border
                    px-6
                    py-5
                  "
                />

                <textarea
                  value={excerpt}
                  onChange={(e) =>
                    setExcerpt(e.target.value)
                  }
                  placeholder="Excerpt"
                  rows={4}
                  className="
                    w-full
                    rounded-[24px]
                    border
                    px-6
                    py-5
                  "
                />

                <textarea
                  value={content}
                  onChange={(e) =>
                    setContent(e.target.value)
                  }
                  placeholder="Content"
                  rows={8}
                  className="
                    w-full
                    rounded-[24px]
                    border
                    px-6
                    py-5
                  "
                />

                {/* THUMBNAIL */}

                <div>

                  <p className="mb-4 font-semibold">
                    Thumbnail
                  </p>

                  {
                    thumbnailPreview && (

                      <div className="
                        relative
                        mb-5
                        h-[260px]
                        overflow-hidden
                        rounded-[28px]
                      ">

                        <Image
                          src={thumbnailPreview}
                          alt="thumbnail"
                          fill
                          unoptimized
                          className="object-cover"
                        />

                      </div>

                    )
                  }

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {

                      const file =
                        e.target.files?.[0];

                      if (!file) return;

                      setThumbnail(file);

                      setThumbnailPreview(
                        URL.createObjectURL(file)
                      );
                    }}
                  />

                </div>

                {/* EXISTING GALLERY */}

                {
                  existingImages.length > 0 && (

                    <div>

                      <p className="mb-5 font-semibold">
                        Existing Gallery
                      </p>

                      <div className="
                        grid
                        grid-cols-2
                        gap-5
                        md:grid-cols-4
                      ">

                        {
                          existingImages.map(
                            (
                              img,
                              index
                            ) => (

                              <div
                                key={index}
                                className="
                                  relative
                                  h-52
                                  overflow-hidden
                                  rounded-[24px]
                                "
                              >

                                <Image
                                  src={`${process.env.NEXT_PUBLIC_API_URL}${img.url}`}
                                  alt="gallery"
                                  fill
                                  unoptimized
                                  className="object-cover"
                                />

                                <button
                                  type="button"
                                  onClick={() =>
                                    removeExistingImage(index)
                                  }
                                  className="
                                    absolute
                                    right-3
                                    top-3
                                    flex
                                    h-10
                                    w-10
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-red-500
                                    text-white
                                  "
                                >
                                  <Trash2 size={18} />
                                </button>

                              </div>

                            )
                          )
                        }

                      </div>

                    </div>

                  )
                }

                {/* NEW GALLERY */}

                <div>

                  <p className="mb-4 font-semibold">
                    Gallery
                  </p>

                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={
                      handleGalleryChange
                    }
                  />

                  {
                    galleryPreview.length > 0 && (

                      <div className="
                        mt-6
                        grid
                        grid-cols-2
                        gap-5
                        md:grid-cols-4
                      ">

                        {
                          galleryPreview.map(
                            (
                              img,
                              index
                            ) => (

                              <div
                                key={index}
                                className="
                                  relative
                                  h-52
                                  overflow-hidden
                                  rounded-[24px]
                                "
                              >

                                <Image
                                  src={img}
                                  alt="preview"
                                  fill
                                  className="object-cover"
                                />

                                <button
                                  type="button"
                                  onClick={() =>
                                    removeNewImage(index)
                                  }
                                  className="
                                    absolute
                                    right-3
                                    top-3
                                    flex
                                    h-10
                                    w-10
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-red-500
                                    text-white
                                  "
                                >
                                  <Trash2 size={18} />
                                </button>

                              </div>

                            )
                          )
                        }

                      </div>

                    )
                  }

                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="
                    rounded-full
                    bg-black
                    px-8
                    py-4
                    text-white
                  "
                >
                  {
                    saving
                      ? "Saving..."
                      : selected
                        ? "Update Portfolio"
                        : "Create Portfolio"
                  }
                </button>

              </form>

            </div>

          </div>

        )
      }

    </div>

  );
}