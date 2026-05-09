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
  GripVertical,
} from "lucide-react";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  arrayMove,
  SortableContext,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";

import {
  CSS,
} from "@dnd-kit/utilities";

import {
  useLayanan,
} from "@/hooks/useLayanan";

/* ================= TYPES ================= */

type ExistingImage = {
  _id?: string;
  url?: string;
  imageUrl?: string;
  path?: string;
  caption?: string;
  isCover?: boolean;
  order?: number;
};

type Props = {
  open: boolean;

  onClose: () => void;

  onSubmit: (
    data: FormData
  ) => Promise<void>;

  loading?: boolean;

  initialData?: any;
};

/* ================= HELPERS ================= */

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

/* ================= SORTABLE CARD ================= */

function SortableImageCard({
  img,
  index,
  setAsCover,
  removeExistingImage,
}: any) {

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({

    id:
      img._id ||
      `${index}`,
  });

  const style = {

    transform:
      CSS.Transform.toString(
        transform
      ),

    transition,
  };

  return (

    <div
      ref={setNodeRef}
      style={style}
      className="
        group
        relative
        aspect-square
        overflow-hidden
        rounded-[28px]
        border
        bg-neutral-100
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

      {/* THUMBNAIL */}

      {
        img.isCover && (

          <div className="
            absolute
            left-3
            top-3
            z-20
            rounded-full
            bg-[#D4B36A]
            px-3
            py-1.5
            text-xs
            font-semibold
            text-black
            shadow-lg
          ">
            Thumbnail
          </div>
        )
      }

      {/* DRAG HANDLE */}

      <button
        type="button"
        {...attributes}
        {...listeners}
        className="
          absolute
          right-3
          top-3
          z-20
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-full
          bg-black/70
          text-white
          backdrop-blur-md
        "
      >
        <GripVertical
          size={18}
        />
      </button>

      {/* OVERLAY */}

      <div className="
        absolute
        inset-x-0
        bottom-0
        flex
        items-center
        justify-between
        gap-2
        bg-gradient-to-t
        from-black/80
        via-black/30
        to-transparent
        p-4
        opacity-0
        transition
        group-hover:opacity-100
      ">

        <button
          type="button"
          onClick={() =>
            setAsCover(index)
          }
          className={`
            rounded-xl
            px-3
            py-2
            text-xs
            font-semibold
            transition

            ${
              img.isCover

                ? "bg-[#D4B36A] text-black"

                : "bg-white text-black"
            }
          `}
        >
          {
            img.isCover
              ? "Thumbnail"
              : "Jadikan Thumbnail"
          }
        </button>

        <button
          type="button"
          onClick={() =>
            removeExistingImage(
              index
            )
          }
          className="
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

    </div>
  );
}

/* ================= COMPONENT ================= */

export default function PortfolioFormModal({
  open,
  onClose,
  onSubmit,
  loading,
  initialData,
}: Props) {

  const {
    data: layananList = [],
  } = useLayanan();

  /* ================= STATE ================= */

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

  /* ================= DND ================= */

  const sensors = useSensors(
    useSensor(
      PointerSensor
    )
  );

  /* ================= RESET ================= */

  const resetForm = () => {

    setTitle("");
    setExcerpt("");
    setContent("");

    setIsFeatured(false);

    setSelectedLayanan([]);

    setGallery([]);
    setGalleryPreview([]);

    setExistingImages([]);
  };

  /* ================= EFFECT ================= */

  useEffect(() => {

    if (!open) return;

    /* CREATE */

    if (!initialData) {

      resetForm();

      return;
    }

    /* EDIT */

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

    const normalizedImages = (

      initialData.photos ||

      initialData.images ||

      []

    ).map(
      (
        img: ExistingImage,
        index: number
      ) => ({

        ...img,

        isCover:
          img.isCover ||
          index === 0,

        order:
          img.order ??
          index,
      })
    );

    setExistingImages(
      normalizedImages
    );

    setGallery([]);
    setGalleryPreview([]);

  }, [
    open,
    initialData,
  ]);

  /* ================= HANDLERS ================= */

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

    setGallery((prev) =>
      prev.filter(
        (_, i) =>
          i !== index
      )
    );

    setGalleryPreview((prev) =>
      prev.filter(
        (_, i) =>
          i !== index
      )
    );
  };

  const removeExistingImage = (
    index: number
  ) => {

    const updated =
      [...existingImages];

    updated.splice(index, 1);

    if (
      updated.length > 0 &&
      !updated.some(
        (img) => img.isCover
      )
    ) {

      updated[0].isCover = true;
    }

    setExistingImages(updated);
  };

  const setAsCover = (
    index: number
  ) => {

    const selected =
      existingImages[index];

    const others =
      existingImages.filter(
        (_, i) =>
          i !== index
      );

    const updated = [

      {
        ...selected,
        isCover: true,
        order: 0,
      },

      ...others.map(
        (img, i) => ({

          ...img,

          isCover: false,

          order: i + 1,
        })
      )
    ];

    setExistingImages(
      updated
    );
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

  const handleDragEnd = (
    event: any
  ) => {

    const {
      active,
      over
    } = event;

    if (
      !over ||
      active.id === over.id
    ) {
      return;
    }

    const oldIndex =
      existingImages.findIndex(
        (img, index) =>

          (
            img._id ||
            `${index}`
          ) === active.id
      );

    const newIndex =
      existingImages.findIndex(
        (img, index) =>

          (
            img._id ||
            `${index}`
          ) === over.id
      );

    const updated =
      arrayMove(
        existingImages,
        oldIndex,
        newIndex
      ).map(
        (img, index) => ({

          ...img,

          order: index,
        })
      );

    setExistingImages(
      updated
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

      gallery.forEach((file) => {

        formData.append(
          "gallery",
          file
        );
      });

      formData.append(

        "existingImages",

        JSON.stringify(

          existingImages.map(
            (img, index) => ({

              ...img,

              isCover:
                img.isCover ||

                index === 0,

              order: index,
            })
          )
        )
      );

      await onSubmit(formData);
    };

  if (!open) return null;

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
        max-w-6xl
        overflow-y-auto
        rounded-[32px]
        bg-white
        p-10
      ">

        {/* CLOSE */}

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

        {/* HEADER */}

        <div className="
          mb-10
        ">

          <p className="
            text-sm
            font-medium
            tracking-[0.25em]
            text-neutral-400
          ">
            FLORALESS CMS
          </p>

          <h2 className="
            mt-3
            text-5xl
            font-bold
            tracking-tight
            text-[#111]
          ">
            {
              initialData

                ? "Edit Portfolio"

                : "Create Portfolio"
            }
          </h2>

        </div>

        <div className="
          space-y-8
        ">

          {/* TITLE */}

          <div>

            <label className="
              mb-3
              block
              text-sm
              font-semibold
            ">
              Portfolio Title
            </label>

            <input
              value={title}
              onChange={(e) =>
                setTitle(
                  e.target.value
                )
              }
              placeholder="Masukkan judul portfolio"
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

          </div>

          {/* EXCERPT */}

          <div>

            <label className="
              mb-3
              block
              text-sm
              font-semibold
            ">
              Short Description
            </label>

            <textarea
              value={excerpt}
              onChange={(e) =>
                setExcerpt(
                  e.target.value
                )
              }
              placeholder="Deskripsi singkat portfolio"
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

          </div>

          {/* CONTENT */}

          <div>

            <label className="
              mb-3
              block
              text-sm
              font-semibold
            ">
              Portfolio Content
            </label>

            <textarea
              value={content}
              onChange={(e) =>
                setContent(
                  e.target.value
                )
              }
              placeholder="Isi lengkap portfolio"
              rows={8}
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

          </div>

          {/* FEATURED */}

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

                <p className="
                  mt-1
                  text-sm
                  text-neutral-500
                ">
                  Tampilkan portfolio di section unggulan
                </p>

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

          {/* LAYANAN */}

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
              mb-5
              flex
              items-center
              justify-between
            ">

              <div>

                <p className="
                  text-xl
                  font-semibold
                ">
                  Gallery Images
                </p>

                <p className="
                  mt-1
                  text-sm
                  text-neutral-500
                ">
                  Drag untuk mengatur urutan gallery
                </p>

              </div>

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

            {/* EXISTING */}

            {
              existingImages.length > 0 && (

                <DndContext
                  sensors={sensors}
                  collisionDetection={
                    closestCenter
                  }
                  onDragEnd={
                    handleDragEnd
                  }
                >

                  <SortableContext
                    items={
                      existingImages.map(
                        (
                          img,
                          index
                        ) =>

                          img._id ||
                          `${index}`
                      )
                    }
                    strategy={
                      rectSortingStrategy
                    }
                  >

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

                            <SortableImageCard
                              key={
                                img._id ||
                                index
                              }
                              img={img}
                              index={index}
                              setAsCover={
                                setAsCover
                              }
                              removeExistingImage={
                                removeExistingImage
                              }
                            />
                          )
                        )
                      }

                    </div>

                  </SortableContext>

                </DndContext>
              )
            }

            {/* NEW IMAGES */}

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
                            rounded-[28px]
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
                            <Trash2
                              size={18}
                            />
                          </button>

                        </div>
                      )
                    )
                  }

                </div>
              )
            }

          </div>

          {/* ACTION */}

          <div className="
            flex
            items-center
            justify-end
            gap-4
            pt-5
          ">

            <button
              type="button"
              onClick={onClose}
              className="
                rounded-full
                border
                px-7
                py-4
                text-sm
                font-semibold
              "
            >
              Cancel
            </button>

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

    </div>
  );
}