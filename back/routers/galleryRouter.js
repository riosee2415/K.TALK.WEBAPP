const express = require("express");
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const { Gallary } = require("../models");
const { Op } = require("sequelize");
const isAdminCheck = require("../middlewares/isAdminCheck");
const AWS = require("aws-sdk");
const multerS3 = require("multer-s3");

const router = express.Router();

try {
  fs.accessSync("uploads");
} catch (error) {
  console.log(
    "uploads 폴더가 존재하지 않습니다. 새로 uploads 폴더를 생성합니다."
  );
  fs.mkdirSync("uploads");
}

AWS.config.update({
  accessKeyId: process.env.S3_ACCESS_KEY_Id,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  region: "ap-northeast-2",
});

const upload = multer({
  storage: multerS3({
    s3: new AWS.S3(),
    bucket: process.env.S3_BUCKET_NAME,
    key(req, file, cb) {
      cb(
        null,
        `${
          process.env.S3_STORAGE_FOLDER_NAME
        }/original/${Date.now()}_${path.basename(file.originalname)}`
      );
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// const upload = multer({
//   storage: multer.diskStorage({
//     destination(req, file, done) {
//       done(null, "uploads");
//     },
//     filename(req, file, done) {
//       const ext = path.extname(file.originalname); // 확장자 추출 (.png)
//       const basename = path.basename(file.originalname, ext);

//       done(null, basename + "_" + new Date().getTime() + ext);
//     },
//   }),
//   limits: { fileSize: 20 * 1024 * 2024 }, // 20MB
// });
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.get("/list", async (req, res, next) => {
  const { page, search } = req.query;

  const LIMIT = 10;

  const _page = page ? page : 1;
  const _search = search ? search : "";

  const __page = _page - 1;
  const OFFSET = __page * 10;

  try {
    const totalGallerys = await Gallary.findAll({
      where: {
        title: {
          [Op.like]: `%${_search}%`,
        },
        isDelete: false,
      },
    });

    const galleryLen = totalGallerys.length;

    const lastPage =
      galleryLen % LIMIT > 0 ? galleryLen / LIMIT + 1 : galleryLen / LIMIT;

    const gallerys = await Gallary.findAll({
      offset: OFFSET,
      limit: LIMIT,
      where: {
        title: {
          [Op.like]: `%${_search}%`,
        },
        isDelete: false,
      },
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({ gallerys, lastPage: parseInt(lastPage) });
  } catch (error) {
    console.error(error);
    return res.status(401).send("겔러리 게시글 목록을 불러올 수 업습니다.");
  }
});

router.post(
  "/image",
  isAdminCheck,
  upload.single("image"),
  async (req, res, next) => {
    return res.json({ path: req.file.location });
  }
);

router.post("/create", isAdminCheck, async (req, res, next) => {
  const { thumbnail, title, content } = req.body;

  try {
    const createResult = await Gallary.create({
      thumbnail,
      title,
      content,
    });

    return res.status(201).json(createResult);
  } catch (error) {
    console.error(error);
    return res.status(401).send("겔러리 게시글을 생성할 수 없습니다.");
  }
});

router.patch("/update", isAdminCheck, async (req, res, next) => {
  const { id, thumbnail, title, content } = req.body;

  try {
    const exGallery = await Gallary.findOne({ where: { id: parseInt(id) } });

    if (!exGallery) {
      return res.status(401).send("존재하지 않는 게시글 입니다.");
    }

    const updateResult = await Gallary.update(
      {
        thumbnail,
        title,
        content,
      },
      {
        where: {
          id: parseInt(id),
        },
      }
    );

    if (updateResult[0] > 0) {
      return res.status(200).json({ result: true });
    } else {
      return res.status(200).json({ result: false });
    }
  } catch (error) {
    console.error(error);
    return res.status(401).send("겔러리 게시글을 수정할 수 없습니다.");
  }
});

router.delete("/delete/:galleryId", isAdminCheck, async (req, res, next) => {
  const { galleryId } = req.params;

  try {
    const exGallery = await Gallary.findOne({
      where: { id: parseInt(galleryId) },
    });

    if (!exGallery) {
      return res.status(401).send("존재하지 않는 게시글 입니다.");
    }

    const deleteResult = await Gallary.update(
      {
        isDelete: true,
        deletedAt: new Date(),
      },
      {
        where: {
          id: parseInt(galleryId),
        },
      }
    );

    if (deleteResult[0] > 0) {
      return res.status(200).json({ result: true });
    } else {
      return res.status(200).json({ result: false });
    }
  } catch (error) {
    console.error(error);
    return res.status(401).send("겔러리 게시글을 삭제할 수 없습니다.");
  }
});

router.get("/list/:galleryId", async (req, res, next) => {
  const { galleryId } = req.params;

  try {
    const exGallery = await Gallary.findOne({
      where: { id: parseInt(galleryId) },
    });

    if (!exGallery) {
      return res.status(401).send("존재하지 않는 게시글 입니다.");
    }

    const nextHit = exGallery.dataValues.hit + 1;

    await Gallary.update(
      {
        hit: nextHit,
      },
      {
        where: { id: parseInt(galleryId) },
      }
    );

    return res.status(200).json(exGallery);
  } catch (error) {
    console.error(error);
    return res.status(403).send("겔러리 게시글을 불러올 수 없습니다.");
  }
});

module.exports = router;
