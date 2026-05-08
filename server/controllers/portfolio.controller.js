import Portfolio from "../models/portfolio.js";
import Ticket from "../models/ticket.js";
import Review from "../models/review.js";
import DetailTicket from "../models/detailTicket.js";
import FotoPortfolio from "../models/fotoPortfolio.js";

import { logActivity } from "../utils/logger.js";

/* ================= HELPERS ================= */

const generateSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, "")
    .replace(/ +/g, "-");
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
      } = req.body;

      const thumbnailFile =
        req.files?.thumbnail?.[0];

      const galleryFiles =
        req.files?.gallery || [];

      if (
        !thumbnailFile
      ) {
        throw {
          status: 400,
          message:
            "Thumbnail wajib",
        };
      }

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

          title,

          slug:
            generateSlug(title),

          excerpt,

          content,

          thumbnail:
            req.files?.thumbnail?.[0]
            ? `/uploads/portfolio/${req.files.thumbnail[0].filename}`
            : "",

          type:
            type || "manual",

          isActive: true,
        });

      const imageDocs =
        galleryFiles.map(
          (file, index) => ({

            portfolioId:
              portfolio._id,

            url:
              `/uploads/portfolio/${file.filename}`,

            order:
              index + 1,

            caption:
              "Hasil dekorasi Floraless",
          })
        );

      await FotoPortfolio.insertMany(
        imageDocs
      );

      res.json({
        message:
          "Portfolio berhasil dibuat",
        portfolio,
      });

    } catch (err) {
      next(err);
    }
  };

/* ================= GET ALL ================= */

export const getPortfolios = async (
  req,
  res,
  next
) => {
  try {

    const data =
      await Portfolio.find({
        isActive: true
      })
      .sort({ createdAt: -1 });

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
        }).sort({ order: 1 });

      res.json({
        portfolio,
        images
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
        });

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
        }).sort({
          order: 1,
        });

      res.json({
        portfolio,
        photos,
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
      } = req.body;

      if (title) {
        portfolio.title =
          title;

        portfolio.slug =
          generateSlug(title);
      }

      if (excerpt) {
        portfolio.excerpt =
          excerpt;
      }

      if (content) {
        portfolio.content =
          content;
      }

      const thumbnailFile =
        req.files?.thumbnail?.[0];

      if (thumbnailFile) {

        portfolio.thumbnail =
          `/uploads/portfolio/${thumbnailFile.filename}`;
      }

      await portfolio.save();

      const galleryFiles =
        req.files?.gallery || [];

      if (
        galleryFiles.length > 0
      ) {

        const existing =
          await FotoPortfolio.countDocuments({
            portfolioId:
              portfolio._id,
          });

        const imageDocs =
          galleryFiles.map(
            (file, index) => ({

              portfolioId:
                portfolio._id,

              url:
                `/uploads/portfolio/${file.filename}`,

              order:
                existing +
                index +
                1,

              caption:
                "Hasil dekorasi Floraless",
            })
          );

        await FotoPortfolio.insertMany(
          imageDocs
        );
      }

      res.json({
        message:
          "Portfolio berhasil diupdate",
        portfolio,
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

      data.isActive = false;

      await data.save();

      await logActivity({
        userId: req.user.id,
        action: "DELETE_PORTFOLIO",
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