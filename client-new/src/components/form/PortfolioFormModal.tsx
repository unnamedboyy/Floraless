"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { X, Trash2, ImagePlus } from "lucide-react";

type ExistingImage = {
  _id?: string;
  url: string;
  caption?: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => Promise<void>;
  loading?: boolean;
  initialData?: any;
};

export default function PortfolioFormModal({
  open,
  onClose,
  onSubmit,
  loading,
  initialData
}: Props) {

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
    useState<ExistingImage[]>([]);

  useEffect(() => {

    if (!initialData) return;

    setTitle(
      initialData.title || ""
    );

    setExcerpt(
      initialData.excerpt || ""
    );

    setContent(
      initialData.content || ""
    );

    if (initialData.thumbnail) {

      setThumbnailPreview(
        `${process.env.NEXT_PUBLIC_API_URL}${initialData.thumbnail}`
      );
    }

    if (initialData.images) {

      setExistingImages(
        initialData.images
      );
    }

  }, [initialData]);

  if (!open) return null;

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

  const handleSubmit = async () => {

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
      backdrop-blur-sm
      p-5
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

        <div className="mt-10 space-y-8">

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
              text-lg
              outline-none
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
              text-lg
              outline-none
            "
          />

          <textarea
            value={content}
            onChange={(e) =>
              setContent(e.target.value)
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

          {/* THUMBNAIL */}

          <div>

            <p className="
              mb-4
              text-lg
              font-semibold
            ">
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

            <label className="
              flex
              cursor-pointer
              items-center
              justify-center
              gap-3
              rounded-[20px]
              border-2
              border-dashed
              border-gray-300
              px-6
              py-10
              transition
              hover:border-black
            ">

              <ImagePlus size={24} />

              <span className="font-medium">
                Upload Thumbnail
              </span>

              <input
                type="file"
                accept="image/*"
                hidden
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

            </label>

          </div>

          {/* EXISTING GALLERY */}

          {
            existingImages.length > 0 && (

              <div>

                <p className="
                  mb-5
                  text-lg
                  font-semibold
                ">
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
                      (img, index) => (

                        <div
                          key={index}
                          className="
                            group
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
                            className="
                              object-cover
                            "
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

            <p className="
              mb-5
              text-lg
              font-semibold
            ">
              Add Gallery Images
            </p>

            <label className="
              flex
              cursor-pointer
              items-center
              justify-center
              gap-3
              rounded-[20px]
              border-2
              border-dashed
              border-gray-300
              px-6
              py-10
              transition
              hover:border-black
            ">

              <ImagePlus size={24} />

              <span className="font-medium">
                Upload Multiple Images
              </span>

              <input
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={handleGalleryChange}
              />

            </label>

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
                      (img, index) => (

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
                            className="
                              object-cover
                            "
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