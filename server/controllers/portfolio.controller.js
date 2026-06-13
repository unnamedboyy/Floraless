import Portfolio from "../models/portfolio.js";
import FotoPortfolio from "../models/fotoPortfolio.js";

import { deleteFile }
from "../utils/deleteFile.js";

import { logActivity }
from "../utils/logger.js";

/* =====================================================
   HELPERS
===================================================== */

const generateSlug = (text) => {

  return text

    .toLowerCase()

    .trim()

    .replace(/[^\w ]+/g, "")

    .replace(/ +/g, "-");
};

const parseLayananIds = (
  layananIds
) => {

  if (!layananIds) {
    return [];
  }

  if (
    Array.isArray(
      layananIds
    )
  ) {
    return layananIds;
  }

  try {

    return JSON.parse(
      layananIds
    );

  } catch {

    return [];
  }
};

const attachCoverImage =
  async (portfolio) => {

    const coverImage =
      await FotoPortfolio.findOne({

        portfolioId:
          portfolio._id,

        isCover: true

      });

    return {

      ...portfolio.toObject(),

      coverImage,
    };
  };

const ensureCoverExists =
  async (portfolioId) => {

    const coverExists =
      await FotoPortfolio.findOne({

        portfolioId,

        isCover: true,
      });

    if (coverExists) {
      return;
    }

    const firstImage =
      await FotoPortfolio.findOne({

        portfolioId,
      })

      .sort({
        order: 1
      });

    if (!firstImage) {
      return;
    }

    firstImage.isCover = true;

    await firstImage.save();
  };

/* =====================================================
   CREATE
===================================================== */

export const createPortfolio =
  async (req, res, next) => {

    try {

      const {
        title,
        excerpt,
        content,
        layananIds,
        isFeatured,
      } = req.body;

      const galleryFiles =
        req.files?.gallery || [];

      /* ================= VALIDATION ================= */

      if (!title?.trim()) {

        throw {

          status: 400,

          message:
            "Judul portfolio wajib diisi",
        };
      }

      if (
        title.trim().length < 3
      ) {

        throw {

          status: 400,

          message:
            "Judul portfolio minimal 3 karakter",
        };
      }

      if (!excerpt?.trim()) {

        throw {

          status: 400,

          message:
            "Deskripsi singkat wajib diisi",
        };
      }

      if (
        excerpt.length > 500
      ) {

        throw {

          status: 400,

          message:
            "Excerpt terlalu panjang",
        };
      }

      const parsedLayananIds =
        parseLayananIds(layananIds);

      if (
        parsedLayananIds.length > 1
      ) {

        throw {

          status: 400,

          message:
            "Kategori layanan maksimal 1",
        };
      }

      if (
        content &&
        content.length > 10000
      ) {

        throw {

          status: 400,

          message:
            "Content terlalu panjang",
        };
      }

      if (
        galleryFiles.length === 0
      ) {

        throw {

          status: 400,

          message:
            "Gallery wajib diisi",
        };
      }

      /* ================= CREATE ================= */

      const portfolio =
        await Portfolio.create({

          layananIds:
            parsedLayananIds,

          title:
            title.trim(),

          slug:
            generateSlug(title),

          excerpt:
            excerpt || "",

          content:
            content || "",

          isFeatured:
            isFeatured === "true" ||
            isFeatured === true,

          isActive: true,
        });

      const imageDocs =
        galleryFiles.map(
          (
            file,
            index
          ) => ({

            portfolioId:
              portfolio._id,

            url:
              `/uploads/portfolio/${file.filename}`,

            order:
              index,

            caption:
              "Portfolio Floraless",

            isCover:
              index === 0,
          })
        );

      await FotoPortfolio.insertMany(
        imageDocs
      );

      const result =
        await Portfolio.findById(
          portfolio._id
        )

        .populate(
          "layananIds",
          "nama"
        );

      res.json({

        message:
          "Portfolio berhasil dibuat",

        portfolio:
          await attachCoverImage(
            result
          ),
      });

    } catch (err) {

      next(err);
    }
  };

/* =====================================================
   GET ALL
===================================================== */

export const getPortfolios =
  async (
    req,
    res,
    next
  ) => {

    try {

      const portfolios =
        await Portfolio.find({

          isActive: true

        })

        .populate(
          "layananIds",
          "nama"
        )

        .sort({
          createdAt: -1
        });

      const data =
        await Promise.all(

          portfolios.map(
            attachCoverImage
          )
        );

      res.json(data);

    } catch (err) {

      next(err);
    }
  };

/* =====================================================
   FEATURED
===================================================== */

export const getFeaturedPortfolios =
  async (
    req,
    res,
    next
  ) => {

    try {

      const portfolios =
        await Portfolio.find({

          isActive: true,

          isFeatured: true,

        })

        .populate(
          "layananIds",
          "nama"
        )

        .sort({
          createdAt: -1
        });

      const data =
        await Promise.all(

          portfolios.map(
            attachCoverImage
          )
        );

      res.json(data);

    } catch (err) {

      next(err);
    }
  };

/* =====================================================
   BY LAYANAN
===================================================== */

export const getPortfolioByLayanan =
  async (
    req,
    res,
    next
  ) => {

    try {

      const portfolios =
        await Portfolio.find({

          isActive: true,

          layananIds:
            req.params.layananId,

        })

        .populate(
          "layananIds",
          "nama"
        )

        .sort({
          createdAt: -1
        });

      const data =
        await Promise.all(

          portfolios.map(
            attachCoverImage
          )
        );

      res.json(data);

    } catch (err) {

      next(err);
    }
  };

/* =====================================================
   DETAIL
===================================================== */

export const getPortfolioById =
  async (
    req,
    res,
    next
  ) => {

    try {

      const portfolio =
        await Portfolio.findById(
          req.params.id
        )

        .populate(
          "layananIds",
          "nama"
        );

      if (!portfolio) {

        throw {

          status: 404,

          message:
            "Portfolio tidak ditemukan",
        };
      }

      const images =
        await FotoPortfolio.find({

          portfolioId:
            portfolio._id

        })

        .sort({
          order: 1
        });

      const coverImage =
        await FotoPortfolio.findOne({

          portfolioId:
            portfolio._id,

          isCover: true
        });

      res.json({

        portfolio,

        images,

        coverImage,
      });

    } catch (err) {

      next(err);
    }
  };

/* =====================================================
   SLUG
===================================================== */

export const getPortfolioBySlug =
  async (
    req,
    res,
    next
  ) => {

    try {

      const portfolio =
        await Portfolio.findOne({

          slug:
            req.params.slug,

          isActive: true,
        })

        .populate(
          "layananIds",
          "nama"
        );

      if (!portfolio) {

        throw {

          status: 404,

          message:
            "Portfolio tidak ditemukan",
        };
      }

      const photos =
        await FotoPortfolio.find({

          portfolioId:
            portfolio._id,

        })

        .sort({
          order: 1,
        });

      const coverImage =
        await FotoPortfolio.findOne({

          portfolioId:
            portfolio._id,

          isCover: true,
        });

      res.json({

        portfolio,

        photos,

        coverImage,
      });

    } catch (err) {

      next(err);
    }
  };

/* =====================================================
   UPDATE
===================================================== */

export const updatePortfolio =
  async (
    req,
    res,
    next
  ) => {

    try {

      const portfolio =
        await Portfolio.findById(
          req.params.id
        );

      if (!portfolio) {

        throw {

          status: 404,

          message:
            "Portfolio tidak ditemukan",
        };
      }

      const {
        title,
        excerpt,
        content,
        existingImages,
        layananIds,
        isFeatured,
      } = req.body;

      /* ================= VALIDATION ================= */

      if (!title?.trim()) {

        throw {

          status: 400,

          message:
            "Judul portfolio wajib diisi",
        };
      }

      if (
        title.trim().length < 3
      ) {

        throw {

          status: 400,

          message:
            "Judul portfolio minimal 3 karakter",
        };
      }

      if (!excerpt?.trim()) {

        throw {

          status: 400,

          message:
            "Deskripsi singkat wajib diisi",
        };
      }

      if (
        excerpt.length > 500
      ) {

        throw {

          status: 400,

          message:
            "Excerpt terlalu panjang",
        };
      }

      const parsedLayananIds =
        parseLayananIds(layananIds);

      if (
        parsedLayananIds.length > 1
      ) {

        throw {

          status: 400,

          message:
            "Kategori layanan maksimal 1",
        };
      }

      if (
        content &&
        content.length > 10000
      ) {

        throw {

          status: 400,

          message:
            "Content terlalu panjang",
        };
      }

      /* ================= UPDATE DATA ================= */

      portfolio.title =
        title.trim();

      portfolio.slug =
        generateSlug(title);

      portfolio.excerpt =
        excerpt || "";

      portfolio.content =
        content || "";

      portfolio.layananIds =
        parsedLayananIds;

      portfolio.isFeatured =
        isFeatured === "true" ||
        isFeatured === true;

      await portfolio.save();

      /* ================= EXISTING IMAGES ================= */

      const parsedExistingImages =

        existingImages

          ? JSON.parse(
              existingImages
            )

          : [];

      const existingImageIds =

        parsedExistingImages.map(
          (img) => img._id
        );

      const oldImages =
        await FotoPortfolio.find({

          portfolioId:
            portfolio._id,
        });

      /* ================= DELETE REMOVED ================= */

      for (const img of oldImages) {

        if (

          !existingImageIds.includes(
            img._id.toString()
          )

        ) {

          deleteFile(
            img.url
          );

          await FotoPortfolio.findByIdAndDelete(
            img._id
          );
        }
      }

      /* ================= UPDATE EXISTING ================= */

      for (
        let i = 0;
        i < parsedExistingImages.length;
        i++
      ) {

        const img =
          parsedExistingImages[i];

        await FotoPortfolio.findByIdAndUpdate(

          img._id,

          {

            order:
              img.order ??
              i,

            isCover:
              img.isCover ||
              false,
          }
        );
      }

      /* ================= NEW GALLERY ================= */

      const galleryFiles =
        req.files?.gallery || [];

      if (
        galleryFiles.length > 0
      ) {

        const existingCount =
          await FotoPortfolio.countDocuments({

            portfolioId:
              portfolio._id,
          });

        const imageDocs =
          galleryFiles.map(
            (
              file,
              index
            ) => ({

              portfolioId:
                portfolio._id,

              url:
                `/uploads/portfolio/${file.filename}`,

              order:
                existingCount +
                index,

              caption:
                "Portfolio Floraless",

              isCover: false,
            })
          );

        await FotoPortfolio.insertMany(
          imageDocs
        );
      }

      /* ================= ENSURE COVER ================= */

      await ensureCoverExists(
        portfolio._id
      );

      const result =
        await Portfolio.findById(
          portfolio._id
        )

        .populate(
          "layananIds",
          "nama"
        );

      res.json({

        message:
          "Portfolio berhasil diupdate",

        portfolio:
          await attachCoverImage(
            result
          ),
      });

    } catch (err) {

      next(err);
    }
  };

/* =====================================================
   DELETE
===================================================== */

export const deletePortfolio =
  async (
    req,
    res,
    next
  ) => {

    try {

      const portfolio =
        await Portfolio.findById(
          req.params.id
        );

      if (!portfolio) {

        throw {

          status: 404,

          message:
            "Portfolio tidak ditemukan",
        };
      }

      const images =
        await FotoPortfolio.find({

          portfolioId:
            portfolio._id,
        });

      for (const img of images) {

        deleteFile(
          img.url
        );
      }

      await FotoPortfolio.deleteMany({

        portfolioId:
          portfolio._id,
      });

      portfolio.isActive = false;

      await portfolio.save();

      await logActivity({

        userId:
          req.user.id,

        action:
          "DELETE_PORTFOLIO",

        customDescription:
          `Portfolio ${portfolio.title} dihapus`,
      });

      res.json({

        message:
          "Portfolio berhasil dihapus",
      });

    } catch (err) {

      next(err);
    }
  };

/* =====================================================
   RELATED
===================================================== */

export const getRelatedPortfolio =
  async (
    req,
    res,
    next
  ) => {

    try {

      const current =
        await Portfolio.findById(
          req.params.id
        );

      if (!current) {

        throw {

          status: 404,

          message:
            "Portfolio tidak ditemukan",
        };
      }

      const related =
        await Portfolio.find({

          _id: {
            $ne: current._id
          },

          isActive: true,

          layananIds: {
            $in:
              current.layananIds
          }

        })

        .populate(
          "layananIds",
          "nama"
        )

        .sort({
          createdAt: -1
        })

        .limit(4);

      const data =
        await Promise.all(

          related.map(
            attachCoverImage
          )
        );

      res.json(data);

    } catch (err) {

      next(err);
    }
  };

/* =====================================================
   SET COVER
===================================================== */

export const setCoverPortfolioImage =
  async (req, res, next) => {

    try {

      const image =
        await FotoPortfolio.findById(
          req.params.imageId
        );

      if (!image) {

        throw {

          status: 404,

          message:
            "Foto tidak ditemukan"
        };
      }

      await FotoPortfolio.updateMany(

        {

          portfolioId:
            image.portfolioId

        },

        {

          isCover: false

        }
      );

      image.isCover = true;

      await image.save();

      res.json({

        message:
          "Cover berhasil diubah"

      });

    } catch (err) {

      next(err);
    }
  };

/* =====================================================
   REORDER IMAGES
===================================================== */

export const reorderPortfolioImages =
  async (req, res, next) => {

    try {

      const {
        images
      } = req.body;

      if (
        !Array.isArray(images)
      ) {

        throw {

          status: 400,

          message:
            "Images harus array"
        };
      }

      for (
        let i = 0;
        i < images.length;
        i++
      ) {

        await FotoPortfolio.findByIdAndUpdate(

          images[i]._id,

          {

            order: i + 1

          }
        );
      }

      res.json({

        message:
          "Urutan gallery berhasil diupdate"

      });

    } catch (err) {

      next(err);
    }
  };