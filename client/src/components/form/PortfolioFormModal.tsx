"use client";

// import Image from "next/image";

import {
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

import {

  X,

  Trash2,

  ImagePlus,

  Star,

  GripVertical,

  Type,

  AlignLeft,

  Layers3,

  Images,

  UploadCloud,

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

import BaseModal from "@/components/form/BaseModal";

/* =========================================================
   TYPES
========================================================= */

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

/* =========================================================
   HELPERS
========================================================= */

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

/* =========================================================
   SORTABLE IMAGE CARD
========================================================= */

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

  const imageUrl =
    getImageUrl(img)
      ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${getImageUrl(img)}`
      : "/placeholder.jpg";

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
        border-slate-200

        bg-slate-100

        shadow-sm

      "
    >
      <img
          src={imageUrl}
          alt=""
          className="
              h-full
              w-full
              object-cover
          "
      />

      {/* COVER */}

      {

        img.isCover && (

          <div className="

            absolute
            left-3
            top-3
            z-20

            h-9

            px-4

            rounded-2xl

            bg-amber-100

            border
            border-amber-200

            text-amber-700

            inline-flex
            items-center
            justify-center

            text-xs
            font-semibold

            shadow-sm

          ">

            Thumbnail

          </div>
        )
      }

      {/* DRAG */}

      <button

        type="button"

        {...attributes}

        {...listeners}

        className="

          absolute
          right-3
          top-3
          z-20

          w-10
          h-10

          rounded-2xl

          bg-white/90

          border
          border-slate-200

          backdrop-blur-sm

          flex
          items-center
          justify-center

          text-slate-600

          shadow-sm

        "
      >

        <GripVertical
          size={18}
        />

      </button>

      {/* OVERLAY */}

      <div className="

        absolute
        inset-0

        bg-gradient-to-t
        from-black/70
        via-black/20
        to-transparent

        opacity-0

        transition

        group-hover:opacity-100

      ">

        <div className="

          absolute

          inset-x-0
          bottom-0

          p-4

          flex
          items-center
          justify-between

          gap-3

        ">

          <button

            type="button"

            onClick={() =>
              setAsCover(index)
            }

            className={`

              h-10

              px-4

              rounded-2xl

              text-xs
              font-semibold

              transition-all

              ${
                img.isCover

                  ? `
                    bg-amber-100
                    text-amber-700
                  `

                  : `
                    bg-white
                    text-slate-700
                  `
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

              w-10
              h-10

              rounded-2xl

              bg-red-500

              flex
              items-center
              justify-center

              text-white

            "
          >

            <Trash2
              size={18}
            />

          </button>

        </div>

      </div>

    </div>
  );
}

/* =========================================================
   NEW IMAGE CARD
========================================================= */

function NewImageCard({

  img,

  index,

  removeNewImage,

}: any) {

  return (

    <div className="

      relative

      aspect-square

      overflow-hidden

      rounded-[28px]

      border
      border-slate-200

      bg-slate-100

      group

    ">

    <img
        src={img}
        alt="preview"
        className="
            h-full
            w-full
            object-cover
        "
    />

      <div className="

        absolute
        inset-0

        bg-black/40

        opacity-0

        transition

        group-hover:opacity-100

      ">

        <button

          type="button"

          onClick={() =>
            removeNewImage(index)
          }

          className="

            absolute
            top-3
            right-3

            w-10
            h-10

            rounded-2xl

            bg-red-500

            flex
            items-center
            justify-center

            text-white

          "
        >

          <Trash2
            size={18}
          />

        </button>

      </div>

    </div>
  );
}

/* =========================================================
   COMPONENT
========================================================= */

export default function PortfolioFormModal({

  open,
  onClose,
  onSubmit,
  loading = false,
  initialData,

}: Props) {

  const {
    data: layananList = [],
  } = useLayanan();

  /* =====================================================
     STATE
  ===================================================== */

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

  /* =====================================================
     DND
  ===================================================== */

  const sensors = useSensors(
    useSensor(
      PointerSensor
    )
  );

  /* =====================================================
     RESET
  ===================================================== */

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

  /* =====================================================
     EFFECT
  ===================================================== */

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

  /* =====================================================
     GALLERY
  ===================================================== */

  const handleGalleryChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    const files =
      Array.from(
        e.target.files || []
      );

    if (files.length === 0)
      return;

    const invalid =
      files.find(
        (file) =>

          !file.type.startsWith(
            "image/"
          )
      );

    if (invalid) {

      toast.error(
        "Semua file harus gambar"
      );

      return;
    }

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

    toast.success(
      `${files.length} gambar ditambahkan`
    );
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

          : [id]
    );
  };

  /* =====================================================
     DND
  ===================================================== */

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

  /* =====================================================
     SUBMIT
  ===================================================== */

  const handleSubmit =
    async () => {

      if (!title.trim()) {

        toast.error(
          "Judul portfolio wajib diisi"
        );

        return;
      }

      if (!excerpt.trim()) {

        toast.error(
          "Deskripsi singkat wajib diisi"
        );

        return;
      }

      if (selectedLayanan.length === 0) {

        toast.error(
          "Kategori layanan wajib dipilih"
        );

        return;
      }

      if (
        gallery.length === 0 &&
        existingImages.length === 0
      ) {

        toast.error(
          "Minimal upload 1 gallery"
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

  /* =====================================================
     RENDER
  ===================================================== */

  return (

    <BaseModal
      open={open}
      onClose={onClose}
      maxWidth="max-w-7xl"
      className="
        h-[92vh]
      "
    >

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="

        px-10
        py-7

        border-b
        border-slate-200

        bg-[#FCFCFD]

        shrink-0

      ">

        <div className="

          flex
          items-start
          justify-between

        ">

          <div>

            <div className="

              flex
              items-center
              gap-3

              flex-wrap

            ">

              <h2 className="

                text-[42px]

                leading-none

                tracking-tight

                font-bold

                text-[#0F172A]

              ">

                {

                  initialData

                    ? "Edit"

                    : "Tambah"
                }

              </h2>

              <h2 className="
                text-[42px]
                leading-none
                tracking-tight
                font-bold
                text-[#C9AE63]

              ">

                portfolio

              </h2>

            </div>

            <p className="

              mt-3

              text-[16px]

              text-slate-500

            ">

              Kelola gallery portfolio FLORALESS

            </p>

          </div>

          <button

            onClick={onClose}

            className="

              w-14
              h-14

              rounded-2xl

              border
              border-slate-200

              bg-white

              flex
              items-center
              justify-center

              text-slate-500

              hover:bg-slate-100

              transition-all

            "
          >

            <X size={22} />

          </button>

        </div>

      </div>

      {/* =====================================================
          BODY
      ===================================================== */}

      <div className="

        flex-1

        overflow-y-auto

        px-10
        py-8

        space-y-7

      ">

        {/* =====================================================
            INFORMASI
        ===================================================== */}

        <Section title="Informasi Portfolio">

          <div className="

            grid
            grid-cols-1
            md:grid-cols-2

            gap-5

          ">

            <InputField

              label="Judul Portfolio"

              icon={<Type size={18} />}

            >

              <input

                value={title}

                onChange={(e) =>
                  setTitle(
                    e.target.value
                  )
                }

                placeholder="Wedding Premium Decoration"

                className={inputClass}

              />

            </InputField>

            <div className="space-y-2">

              <label className="

                text-sm
                font-medium

                text-slate-700

              ">
                Featured Portfolio
              </label>

              <button

                type="button"

                onClick={() =>
                  setIsFeatured(
                    !isFeatured
                  )
                }

                className={`

                  h-[58px]

                  px-5

                  rounded-2xl

                  border

                  flex
                  items-center
                  gap-3

                  transition-all

                  ${
                    isFeatured

                      ? `
                        bg-amber-50
                        border-amber-200
                        text-amber-700
                      `

                      : `
                        bg-white
                        border-slate-200
                        text-slate-600
                      `
                  }

                `}
              >

                <Star size={18} />

                {

                  isFeatured

                    ? "Featured"

                    : "Tidak Featured"
                }

              </button>

            </div>

            <div className="
              md:col-span-2
            ">

              <TextareaField

                label="Deskripsi Singkat *"

                icon={<AlignLeft size={18} />}

              >

                <textarea

                  rows={4}

                  value={excerpt}

                  onChange={(e) =>
                    setExcerpt(
                      e.target.value
                    )
                  }

                  placeholder="Deskripsi singkat portfolio"

                  className={textareaClass}

                />

              </TextareaField>

            </div>

            <div className="
              md:col-span-2
            ">

              <TextareaField

                label="Isi Portfolio"

                icon={<AlignLeft size={18} />}

              >

                <textarea

                  rows={8}

                  value={content}

                  onChange={(e) =>
                    setContent(
                      e.target.value
                    )
                  }

                  placeholder="Isi lengkap portfolio"

                  className={textareaClass}

                />

              </TextareaField>

            </div>

          </div>

        </Section>

        {/* =====================================================
            LAYANAN
        ===================================================== */}

        <Section title="Kategori Layanan *">

          {

            layananList.length === 0

              ? (

                <div className="

                  rounded-2xl

                  border
                  border-dashed
                  border-slate-200

                  bg-slate-50

                  py-10

                  text-center

                  text-sm

                  text-slate-500

                ">

                  Belum ada layanan tersedia

                </div>
              )

              : (

                <>

                  <p className="

                    text-xs

                    text-slate-400

                  ">

                    Pilih 1 kategori layanan (wajib)

                  </p>

                <div className="

                  flex
                  flex-wrap

                  gap-3

                ">

                  {

                    layananList.map(
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

                              h-12

                              px-5

                              rounded-2xl

                              border

                              text-sm
                              font-medium

                              transition-all

                              ${
                                active

                                  ? `
                                    bg-[#0F172A]
                                    border-[#0F172A]
                                    text-white
                                  `

                                  : `
                                    bg-white
                                    border-slate-200
                                    text-slate-700
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

                </>
              )
          }

        </Section>

        {/* =====================================================
            GALLERY
        ===================================================== */}

        <Section title="Gallery Portfolio">

          <div className="space-y-7">

            {/* TOP */}

            <div className="

              flex
              items-center
              justify-between

              gap-4

              flex-wrap

            ">

              <div>

                <h4 className="

                  text-lg
                  font-semibold

                  text-[#0F172A]

                ">

                  Upload Gallery

                </h4>

                <p className="

                  mt-1

                  text-sm

                  text-slate-500

                ">

                  Drag untuk mengatur urutan gallery

                </p>

              </div>

              <label className="
                h-12
                px-5
                rounded-2xl
                border
                border-slate-200
                bg-white
                flex
                items-center
                gap-2
                text-sm
                font-medium
                text-slate-700
                hover:bg-slate-100
                transition-all
                cursor-pointer

              ">

                <UploadCloud
                  size={18}
                />

                Tambah Gambar

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

            {/* EMPTY */}

            {

              existingImages.length === 0 &&

              galleryPreview.length === 0 && (

                <div className="

                  rounded-[30px]

                  border-2
                  border-dashed
                  border-slate-200

                  bg-slate-50

                  py-20

                  text-center

                ">

                  <div className="

                    mx-auto

                    w-20
                    h-20

                    rounded-3xl

                    bg-white

                    border
                    border-slate-200

                    flex
                    items-center
                    justify-center

                    text-slate-400

                    shadow-sm

                  ">

                    <Images
                      size={36}
                    />

                  </div>

                  <h4 className="

                    mt-6

                    text-lg
                    font-semibold

                    text-[#0F172A]

                  ">

                    Belum ada gallery

                  </h4>

                  <p className="

                    mt-2

                    text-sm

                    text-slate-500

                  ">

                    Upload gambar portfolio untuk memulai

                  </p>

                </div>
              )
            }

            {/* EXISTING */}

            {

              existingImages.length > 0 && (

                <div className="space-y-5">

                  <div className="

                    flex
                    items-center
                    gap-2

                    text-sm
                    font-semibold

                    text-slate-600

                  ">

                    <Layers3 size={16} />

                    Gallery Existing

                  </div>

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

                        grid
                        grid-cols-2
                        md:grid-cols-4
                        lg:grid-cols-5

                        gap-5

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

                </div>
              )
            }

            {/* NEW */}

            {

              galleryPreview.length > 0 && (

                <div className="space-y-5">

                  <div className="

                    flex
                    items-center
                    gap-2

                    text-sm
                    font-semibold

                    text-slate-600

                  ">

                    <ImagePlus size={16} />

                    Gambar Baru

                  </div>

                  <div className="

                    grid
                    grid-cols-2
                    md:grid-cols-4
                    lg:grid-cols-5

                    gap-5

                  ">

                    {

                      galleryPreview.map(
                        (
                          img,
                          index
                        ) => (

                          <NewImageCard

                            key={index}

                            img={img}

                            index={index}

                            removeNewImage={
                              removeNewImage
                            }

                          />
                        )
                      )
                    }

                  </div>

                </div>
              )
            }

          </div>

        </Section>

      </div>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <div className="

        shrink-0

        px-10
        py-5

        border-t
        border-slate-200

        bg-white/90

        backdrop-blur-sm

        flex
        items-center
        justify-between

      ">

        <p className="

          text-sm

          text-slate-500

        ">

          {

            initialData

              ? "Perubahan siap disimpan"

              : "Portfolio baru akan dibuat"
          }

        </p>

        <div className="

          flex
          items-center

          gap-3

        ">

          <button

            onClick={onClose}

            className="

              h-12

              px-6

              rounded-2xl

              border
              border-slate-200

              bg-white

              text-slate-700

              text-sm
              font-medium

              hover:bg-slate-100

              transition-all

            "
          >

            Batal

          </button>

          <button

            onClick={handleSubmit}

            disabled={loading}

            className="

              h-12

              px-7

              rounded-2xl

              bg-[#0F172A]

              text-white

              text-sm
              font-semibold

              hover:opacity-90

              transition-all

              disabled:opacity-50

            "
          >

            {

              loading

                ? "Menyimpan..."

                : initialData

                  ? "Update Portfolio"

                  : "Simpan Portfolio"
            }

          </button>

        </div>

      </div>

    </BaseModal>
  );
}

/* =========================================================
   SECTION
========================================================= */

function Section({

  title,

  children,

}: any) {

  return (

    <div className="

      rounded-[30px]

      border
      border-slate-200

      bg-white

      p-7

      space-y-6

      shadow-sm

    ">

      <h3 className="

        text-[28px]
        font-semibold

        text-[#0F172A]

      ">

        {title}

      </h3>

      {children}

    </div>
  );
}

/* =========================================================
   INPUT FIELD
========================================================= */

function InputField({

  label,

  icon,

  children,

}: any) {

  return (

    <div className="space-y-2">

      <label className="

        text-sm
        font-medium

        text-slate-700

      ">

        {label}

      </label>

      <div className="relative">

        {

          icon && (

            <div className="

              absolute
              left-4
              top-1/2
              -translate-y-1/2

              text-slate-400

            ">

              {icon}

            </div>
          )
        }

        <div className="
          [&_input]:pl-11
        ">

          {children}

        </div>

      </div>

    </div>
  );
}

/* =========================================================
   TEXTAREA FIELD
========================================================= */

function TextareaField({

  label,

  icon,

  children,

}: any) {

  return (

    <div className="space-y-2">

      <label className="

        text-sm
        font-medium

        text-slate-700

      ">

        {label}

      </label>

      <div className="relative">

        {

          icon && (

            <div className="

              absolute
              left-4
              top-5

              text-slate-400

            ">

              {icon}

            </div>
          )
        }

        <div className="
          [&_textarea]:pl-11
        ">

          {children}

        </div>

      </div>

    </div>
  );
}

/* =========================================================
   STYLES
========================================================= */

const inputClass = `

  w-full

  h-[58px]

  rounded-2xl

  border
  border-slate-200

  bg-white

  px-4

  text-[15px]

  text-slate-800

  outline-none

  transition-all

  shadow-sm

  placeholder:text-slate-400

  focus:border-slate-400

  focus:ring-4
  focus:ring-slate-100

`;

const textareaClass = `

  w-full

  rounded-2xl

  border
  border-slate-200

  bg-white

  px-4
  py-4

  text-[15px]

  text-slate-800

  outline-none

  resize-none

  transition-all

  shadow-sm

  placeholder:text-slate-400

  focus:border-slate-400

  focus:ring-4
  focus:ring-slate-100

`;