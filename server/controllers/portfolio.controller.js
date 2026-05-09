import Portfolio from "../models/portfolio.js";
import FotoPortfolio from "../models/fotoPortfolio.js";
import Ticket from "../models/ticket.js";
import DetailTicket from "../models/detailTicket.js";
import Review from "../models/review.js";

import { deleteFile }
from "../utils/deleteFile.js";

import { logActivity }
from "../utils/logger.js";

/* ================= HELPERS ================= */

const generateSlug = (text) => {

  return text

    .toLowerCase()

    .replace(/[^\w ]+/g, "")

    .replace(/ +/g, "-");
};

const parseLayananIds = (layananIds) => {

  if (!layananIds) return [];

  if (Array.isArray(layananIds)) {
    return layananIds;
  }

  try {
    return JSON.parse(layananIds);
  } catch {
    return [];
  }
};

/* ================= CREATE ================= */

export const createPortfolio =
  async (req, res, next) => {

    try {

      const {
        title,
        excerpt,
        content,
        type,
        layananIds,
        isFeatured,
        ticketId,
        rating,
        review,
      } = req.body;

      const galleryFiles =
        req.files?.gallery || [];

      if (
        galleryFiles.length === 0
      ) {

        throw {

          status: 400,

          message:
            "Gallery wajib",
        };
      }

      const portfolio =
        await Portfolio.create({

          ticketId: ticketId || null,

          layananIds:
            parseLayananIds(layananIds),

          title,

          slug:
            generateSlug(title),

          excerpt,

          content,

          rating,

          review,

          isFeatured:
            isFeatured === "true" ||
            isFeatured === true,

          type:
            type || "manual",

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
              index + 1,

            caption:
              "Hasil dekorasi Floraless",

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

        portfolio: result,
      });

    } catch (err) {

      next(err);
    }
  };

/* ================= GET ALL ================= */

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
            async (item) => {

              const coverImage =
                await FotoPortfolio.findOne({

                  portfolioId:
                    item._id,

                  isCover: true

                });

              return {

                ...item.toObject(),

                coverImage
              };
            }
          )
        );

      res.json(data);

    } catch (err) {

      next(err);
    }
  };

/* ================= GET FEATURED ================= */

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
            async (item) => {

              const coverImage =
                await FotoPortfolio.findOne({

                  portfolioId:
                    item._id,

                  isCover: true

                });

              return {

                ...item.toObject(),

                coverImage
              };
            }
          )
        );

      res.json(data);

    } catch (err) {

      next(err);
    }
  };

/* ================= GET BY LAYANAN ================= */

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
            async (item) => {

              const coverImage =
                await FotoPortfolio.findOne({

                  portfolioId:
                    item._id,

                  isCover: true

                });

              return {

                ...item.toObject(),

                coverImage
              };
            }
          )
        );

      res.json(data);

    } catch (err) {

      next(err);
    }
  };

/* ================= GET DETAIL ================= */

export const getPortfolioById =
  async (req, res, next) => {

    try {

      const portfolio =
        await Portfolio.findById(
          req.params.id
        )

        .populate(
          "layananIds"
        );

      if (!portfolio) {

        throw {

          status: 404,

          message:
            "Portfolio tidak ditemukan"
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

        coverImage
      });

    } catch (err) {

      next(err);
    }
  };

/* ================= GET BY SLUG ================= */

export const getPortfolioBySlug =
  async (req, res, next) => {

    try {

      const portfolio =
        await Portfolio.findOne({

          slug:
            req.params.slug,

          isActive: true,
        })

        .populate(
          "layananIds"
        );

      if (!portfolio) {

        return res.status(404).json({

          message:
            "Portfolio tidak ditemukan",
        });
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

          isCover: true

        });

      res.json({

        portfolio,

        photos,

        coverImage
      });

    } catch (err) {

      next(err);
    }
  };

/* ================= UPDATE ================= */

export const updatePortfolio =
  async (req, res, next) => {

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
        ticketId,
        rating,
        review,
        type,
      } = req.body;

      if (title) {

        portfolio.title =
          title;
      }

      if (excerpt !== undefined) {

        portfolio.excerpt =
          excerpt;
      }

      if (content !== undefined) {

        portfolio.content =
          content;
      }

      if (layananIds !== undefined) {

        portfolio.layananIds =
          parseLayananIds(layananIds);
      }

      if (isFeatured !== undefined) {

        portfolio.isFeatured =
          isFeatured === "true" ||
          isFeatured === true;
      }

      if (ticketId !== undefined) {

        portfolio.ticketId =
          ticketId || null;
      }

      if (rating !== undefined) {

        portfolio.rating =
          rating;
      }

      if (review !== undefined) {

        portfolio.review =
          review;
      }

      if (type) {

        portfolio.type = type;
      }

      await portfolio.save();

      /* ================= REMOVE IMAGES ================= */

      const existingImageIds =
        existingImages

          ? JSON.parse(
              existingImages
            ).map(
              (img) =>
                img._id
            )

          : [];

      const oldImages =
        await FotoPortfolio.find({

          portfolioId:
            portfolio._id,
        });

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

      /* ================= ADD NEW IMAGES ================= */

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
                index +
                1,

              caption:
                "Hasil dekorasi Floraless",

              isCover: false,
            })
          );

        await FotoPortfolio.insertMany(
          imageDocs
        );
      }

      /* ================= ENSURE COVER EXISTS ================= */

      const coverExists =
        await FotoPortfolio.findOne({

          portfolioId:
            portfolio._id,

          isCover: true
        });

      if (!coverExists) {

        const firstImage =
          await FotoPortfolio.findOne({

            portfolioId:
              portfolio._id

          })

          .sort({
            order: 1
          });

        if (firstImage) {

          firstImage.isCover =
            true;

          await firstImage.save();
        }
      }

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

        portfolio: result,
      });

    } catch (err) {

      next(err);
    }
  };

/* ================= DELETE ================= */

export const deletePortfolio =
  async (req, res, next) => {

    try {

      const data =
        await Portfolio.findById(
          req.params.id
        );

      if (!data) {

        throw {

          status: 404,

          message:
            "Portfolio tidak ditemukan"
        };
      }

      const images =
        await FotoPortfolio.find({

          portfolioId:
            data._id
        });

      for (const img of images) {

        deleteFile(
          img.url
        );
      }

      await FotoPortfolio.deleteMany({

        portfolioId:
          data._id
      });

      data.isActive = false;

      await data.save();

      await logActivity({

        userId:
          req.user.id,

        action:
          "DELETE_PORTFOLIO",

        customDescription:
          `Portfolio ${data.title} dihapus`
      });

      res.json({

        message:
          "Portfolio berhasil dihapus"
      });

    } catch (err) {

      next(err);
    }
  };

/* ================= SET COVER ================= */

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

  /* ================= RELATED ================= */

export const getRelatedPortfolio =
  async (req, res, next) => {

    try {

      const current =
        await Portfolio.findById(
          req.params.id
        );

      if (!current) {

        throw {

          status: 404,

          message:
            "Portfolio tidak ditemukan"
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
            async (item) => {

              const coverImage =
                await FotoPortfolio.findOne({

                  portfolioId:
                    item._id,

                  isCover: true

                });

              return {

                ...item.toObject(),

                coverImage
              };
            }
          )
        );

      res.json(data);

    } catch (err) {

      next(err);
    }
  };

/* ================= GENERATE FROM TICKET ================= */

export const generatePortfolioFromTicket =
  async (req, res, next) => {

    try {

      const ticket =
        await Ticket.findById(
          req.params.ticketId
        )

        .populate(
          "layananId",
          "nama"
        );

      if (!ticket) {

        throw {

          status: 404,

          message:
            "Ticket tidak ditemukan"
        };
      }

      if (
        ticket.status !== "done"
      ) {

        throw {

          status: 400,

          message:
            "Ticket belum selesai"
        };
      }

      const existing =
        await Portfolio.findOne({

          ticketId:
            ticket._id
        });

      if (existing) {

        throw {

          status: 400,

          message:
            "Portfolio ticket ini sudah ada"
        };
      }

      const detail =
        await DetailTicket.findOne({

          ticketId:
            ticket._id
        });

      const review =
        await Review.findOne({

          ticketId:
            ticket._id,

          isActive: true
        });

      const result = {

        ticketId:
          ticket._id,

        layananIds:
          ticket.layananId
            ? [ticket.layananId._id]
            : [],

        title:
          detail?.nama_acara ||
          "Portfolio Floraless",

        excerpt:
          detail?.catatan ||
          "",

        content: `
Acara:
${detail?.nama_acara || "-"}

Lokasi:
${detail?.lokasi || "-"}

Tanggal Acara:
${detail?.tanggal_acara
  ? new Date(
      detail.tanggal_acara
    ).toLocaleDateString("id-ID")
  : "-"}

Dekorasi dikerjakan oleh tim Floraless
dengan konsep elegan dan premium.
        `.trim(),

        rating:
          review?.rating || 5,

        review:
          review?.komentar || "",

        isFeatured: false,

        type: "ticket"
      };

      res.json(result);

    } catch (err) {

      next(err);
    }
  };