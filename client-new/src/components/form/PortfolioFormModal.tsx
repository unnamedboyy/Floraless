
"use client";

import Image from "next/image";

import {
  useEffect,
  useState,
} from "react";

import {
  X,
  Trash2,
  ImagePlus,
  Star,
} from "lucide-react";

import { useLayanan }
from "@/hooks/useLayanan";

type ExistingImage = {
  _id?: string;
  url?: string;
  imageUrl?: string;
  path?: string;
  caption?: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (
    data: FormData
  ) => Promise<void>;
  loading?: boolean;
  initialData?: any;
  prefilledData?: any;
};

export default function PortfolioFormModal({
  open,
  onClose,
  onSubmit,
  loading,
  initialData,
  prefilledData,
}: Props) {

  const {
    data: layananList = []
  } = useLayanan({});

  const [title, setTitle] =
    useState("");

  const [excerpt, setExcerpt] =
    useState("");

  const [content, setContent] =
    useState("");

  const [isFeatured,
    setIsFeatured] =
    useState(false);

  const [selectedLayanan,
    setSelectedLayanan] =
    useState<string[]>([]);

  const [gallery,
    setGallery] =
    useState<File[]>([]);

  const [galleryPreview,
    setGalleryPreview] =
    useState<string[]>([]);

  const [existingImages,
    setExistingImages] =
    useState<ExistingImage[]>([]);

  const getImageUrl = (
    img: ExistingImage
  ) => {

    return (
      img.url ||
      img.imageUrl ||
      img.path ||
      ""
    );
  };

  useEffect(() => {

    if (!open) return;

    if (!initialData) {

      if (prefilledData) {

        setTitle(
          prefilledData.title || ""
        );

        setExcerpt(
          prefilledData.excerpt || ""
        );

        setContent(
          prefilledData.content || ""
        );

        setIsFeatured(false);

        setSelectedLayanan(
          prefilledData.layananIds?.map(
            (item: any) =>
              typeof item === "string"
                ? item
                : item._id
          ) || []
        );

        setExistingImages([]);

        return;
      }

      setTitle("");
      setExcerpt("");
      setContent("");
      setIsFeatured(false);
      setSelectedLayanan([]);
      setExistingImages([]);
      setGallery([]);
      setGalleryPreview([]);

      return;
    }

    setTitle(
      initialData.title || ""
    );

    setExcerpt(
      initialData.excerpt || ""
    );

    setContent(
      initialData.content || ""
    );

    setIsFeatured(
      initialData.isFeatured || false
    );

    setSelectedLayanan(

      initialData.layananIds?.map(
        (item: any) =>
          typeof item === "string"
            ? item
            : item._id
      ) || []
    );

    setExistingImages(
      initialData.photos ||
      initialData.images ||
      []
    );

  }, [
    open,
    initialData,
    prefilledData
  ]);

  useEffect(() => {

    if (!open) {

      setGallery([]);
      setGalleryPreview([]);
      setExistingImages([]);
    }

  }, [open]);

  if (!open) return null;

  const handleGalleryChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    const files =
      Array.from(
        e.target.files || []
      );

    setGallery((prev) => [
      ...prev,
      ...files
    ]);

    const previews =
      files.map((file) =>
        URL.createObjectURL(file)
      );

    setGalleryPreview((prev) => [
      ...prev,
      ...previews
    ]);
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

  const toggleLayanan = (
    id: string
  ) => {

    setSelectedLayanan(
      (prev) =>

        prev.includes(id)

          ? prev.filter(
              (item) =>
                item !== id
            )

          : [...prev, id]
    );
  };

  const handleSubmit =
    async () => {

      if (
        gallery.length === 0 &&
        existingImages.length === 0
      ) {

        alert(
          "Minimal upload 1 foto gallery"
        );

        return;
      }

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

      formData.append(
        "isFeatured",
        String(isFeatured)
      );

      formData.append(
        "layananIds",
        JSON.stringify(
          selectedLayanan
        )
      );

      if (
        prefilledData?.ticketId
      ) {

        formData.append(
          "ticketId",
          prefilledData.ticketId
        );
      }

      if (
        prefilledData?.rating
      ) {

        formData.append(
          "rating",
          String(
            prefilledData.rating
          )
        );
      }

      if (
        prefilledData?.review
      ) {

        formData.append(
          "review",
          prefilledData.review
        );
      }

      if (
        prefilledData?.type
      ) {

        formData.append(
          "type",
          prefilledData.type
        );
      }

      gallery.forEach((file) => {

        formData.append(
          "gallery",
          file
        );

      });

      formData.append(
        "existingImages",
        JSON.stringify(
          existingImages
        )
      );

      await onSubmit(formData);
    };

  return (
    <div className="
      fixed
      inset-0
      z-[999]
      flex
      items-center
      justify-center
      bg-black/50
      p-5
      backdrop-blur-sm
    ">

      <div className="
        relative
        max-h-[95vh]
        w-full
        max-w-5xl
        overflow-y-auto
        rounded-[32px]
        bg-white
        p-10
      ">

        <button
          onClick={onClose}
          className="
            absolute
            right-5
            top-5
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-full
            border
          "
        >
          <X />
        </button>

        <h2 className="
          text-5xl
          font-bold
          text-[#111]
        ">
          {
            initialData
              ? "Edit Portfolio"
              : "Create Portfolio"
          }
        </h2>

        <div className="
          mt-10
          space-y-8
        ">

          <input
            value={title}
            onChange={(e) =>
              setTitle(
                e.target.value
              )
            }
            placeholder="Title"
            className="
              w-full
              rounded-[24px]
              border
              px-6
              py-5
              text-lg
              outline-none
            "
          />

          <textarea
            value={excerpt}
            onChange={(e) =>
              setExcerpt(
                e.target.value
              )
            }
            placeholder="Excerpt"
            rows={4}
            className="
              w-full
              rounded-[24px]
              border
              px-6
              py-5
              text-lg
              outline-none
            "
          />

          <textarea
            value={content}
            onChange={(e) =>
              setContent(
                e.target.value
              )
            }
            placeholder="Content"
            rows={7}
            className="
              w-full
              rounded-[24px]
              border
              px-6
              py-5
              text-lg
              outline-none
            "
          />

          <div className="
            rounded-[28px]
            border
            p-6
          ">

            <div className="
              flex
              items-center
              justify-between
            ">

              <div>

                <h3 className="
                  flex
                  items-center
                  gap-2
                  text-xl
                  font-semibold
                ">
                  <Star size={20} />
                  Featured Portfolio
                </h3>

              </div>

              <button
                type="button"
                onClick={() =>
                  setIsFeatured(
                    !isFeatured
                  )
                }
                className={`
                  h-8
                  w-16
                  rounded-full
                  transition
                  ${
                    isFeatured
                      ? "bg-black"
                      : "bg-neutral-300"
                  }
                `}
              >
                <div
                  className={`
                    h-8
                    w-8
                    rounded-full
                    bg-white
                    shadow-md
                    transition
                    ${
                      isFeatured
                        ? "translate-x-8"
                        : "translate-x-0"
                    }
                  `}
                />
              </button>

            </div>

          </div>

          <div className="
            rounded-[28px]
            border
            p-6
          ">

            <h3 className="
              text-xl
              font-semibold
            ">
              Kategori Layanan
            </h3>

            <div className="
              mt-6
              flex
              flex-wrap
              gap-3
            ">

              {
                layananList?.map(
                  (item: any) => {

                    const active =
                      selectedLayanan.includes(
                        item._id
                      );

                    return (

                      <button
                        key={item._id}
                        type="button"
                        onClick={() =>
                          toggleLayanan(
                            item._id
                          )
                        }
                        className={`
                          rounded-full
                          border
                          px-5
                          py-3
                          text-sm
                          font-medium
                          transition
                          ${
                            active

                              ? `
                                border-black
                                bg-black
                                text-white
                              `

                              : `
                                border-neutral-300
                                bg-white
                                text-black
                              `
                          }
                        `}
                      >
                        {item.nama}
                      </button>
                    );
                  }
                )
              }

            </div>

          </div>

          {/* GALLERY */}

          <div>

            <div className="
              mb-4
              flex
              items-center
              justify-between
            ">

              <p className="
                text-lg
                font-semibold
              ">
                Gallery Images
              </p>

              <label
                className="
                  flex
                  cursor-pointer
                  items-center
                  gap-2
                  rounded-full
                  border
                  px-5
                  py-3
                  text-sm
                  font-medium
                "
              >

                <ImagePlus
                  size={18}
                />

                Add Images

                <input
                  type="file"
                  multiple
                  accept="image/*"
                  hidden
                  onChange={
                    handleGalleryChange
                  }
                />

              </label>

            </div>

            {
              existingImages.length > 0 && (

                <div className="
                  mb-6
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
                            aspect-square
                            overflow-hidden
                            rounded-[24px]
                          "
                        >

                          <Image
                            src={`${process.env.NEXT_PUBLIC_API_URL}${getImageUrl(img)}`}
                            alt=""
                            fill
                            unoptimized
                            className="
                              object-cover
                            "
                          />

                          <button
                            type="button"
                            onClick={() =>
                              removeExistingImage(
                                index
                              )
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

            {
              galleryPreview.length > 0 && (

                <div className="
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
                            aspect-square
                            overflow-hidden
                            rounded-[24px]
                          "
                        >

                          <Image
                            src={img}
                            alt="preview"
                            fill
                            className="
                              object-cover
                            "
                          />

                          <button
                            type="button"
                            onClick={() =>
                              removeNewImage(
                                index
                              )
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
            onClick={handleSubmit}
            disabled={loading}
            className="
              rounded-full
              bg-black
              px-8
              py-4
              text-lg
              font-semibold
              text-white
              transition
              hover:scale-[1.02]
            "
          >
            {
              loading
                ? "Saving..."
                : initialData
                  ? "Update Portfolio"
                  : "Create Portfolio"
            }
          </button>

        </div>

      </div>

    </div>  
  );
}
