const express = require("express");
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const { Notice } = require("../models");
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
//   limits: { fileSize: 10 * 1024 * 2024 }, // 20MB
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
    const totalNotices = await Notice.findAll({
      where: {
        title: {
          [Op.like]: `%${_search}%`,
        },
        isDelete: false,
      },
    });

    const noticeLen = totalNotices.length;

    const lastPage =
      noticeLen % LIMIT > 0 ? noticeLen / LIMIT + 1 : noticeLen / LIMIT;

    const notices = await Notice.findAll({
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

    return res.status(200).json({ notices, lastPage: parseInt(lastPage) });
  } catch (error) {
    console.error(error);
    return res.status(401).send("공지사항 목록을 불러올 수 업습니다.");
  }
});

router.post(
  "/create",
  isAdminCheck,
  upload.single("file"),
  async (req, res, next) => {
    const { title, content, type, isTop } = req.body;

    try {
      const createResult = await Notice.create({
        title,
        content,
        type,
        isTop: Boolean(isTop),
        file: req.file ? req.file.location : null,
      });

      if (!createResult) {
        return res.status(401).send("게시글을 등록할 수 없습니다. [CODE 076]");
      }

      return res.status(201).json({ result: true });
    } catch (error) {
      console.error(error);
      return res.status(401).send("게시글을 등록할 수 없습니다. [CODE 077]");
    }
  }
);

router.patch(
  "/update",
  upload.single("file"),
  isAdminCheck,
  async (req, res, next) => {
    const { id, title, content, type, isTop } = req.body;

    try {
      const exNotice = await Notice.findOne({ where: { id: parseInt(id) } });

      if (!exNotice) {
        return res.status(401).send("존재하지 않는 게시글 입니다.");
      }

      const updateResult = await Notice.update(
        {
          title,
          content,
          type,
          isTop: Boolean(isTop),
          file: req.file ? req.file.path : exNotice.dataValues.file,
        },
        {
          where: { id: parseInt(id) },
        }
      );

      if (updateResult[0] > 0) {
        return res.status(200).json({ result: true });
      } else {
        return res.status(200).json({ result: false });
      }
    } catch (error) {
      console.error(error);
      return res.status(401).send("게시글을 수정할 수 없습니다. [CODE 087]");
    }
  }
);

router.delete("/delete/:noticeId", isAdminCheck, async (req, res, next) => {
  const { noticeId } = req.params;

  try {
    const exNotice = await Notice.findOne({
      where: { id: parseInt(noticeId) },
    });

    if (!exNotice) {
      return res.status(401).send("존재하지 않는 게시글 입니다.");
    }

    const updateResult = await Notice.update(
      {
        isDelete: true,
        deletedAt: new Date(),
      },
      {
        where: { id: parseInt(noticeId) },
      }
    );

    if (updateResult[0] > 0) {
      return res.status(200).json({ result: true });
    } else {
      return res.status(200).json({ result: false });
    }
  } catch (error) {
    console.error(error);
    return res.status(401).send("게시글을 삭제할 수 없습니다. [CODE 097]");
  }
});

router.get("/list/:noticeId", async (req, res, next) => {
  const { noticeId } = req.params;

  try {
    const exNotice = await Notice.findOne({
      where: { id: parseInt(noticeId) },
    });

    const nextHit = exNotice.dataValues.hit + 1;

    await Notice.update(
      {
        hit: nextHit,
      },
      {
        where: { id: parseInt(noticeId) },
      }
    );

    if (!exNotice) {
      return res.status(401).send("존재하지 않는 게시글 입니다.");
    }

    return res.status(200).json(exNotice);
  } catch (error) {
    console.error(error);
    return res.status(401).send("게시글 정보를 불러올 수 없습니다. [CODE 107]");
  }
});

router.get("/next/:noticeId", async (req, res, next) => {
  const { noticeId } = req.params;

  try {
    const notices = await Notice.findAll({
      where: {
        id: {
          [Op.gt]: parseInt(noticeId),
        },
      },
      limit: 1,
    });

    if (!notices[0]) {
      return res.status(401).send("마지막 게시글 입니다.");
    }

    return res.redirect(`/api/notice/list/${notices[0].id}`);
  } catch (error) {
    console.error(error);
    return res.status(401).send("게시글 정보를 불러올 수 없습니다. [CODE 107]");
  }
});

router.get("/prev/:noticeId", async (req, res, next) => {
  const { noticeId } = req.params;

  try {
    const notices = await Notice.findAll({
      where: {
        id: {
          [Op.lt]: parseInt(noticeId),
        },
      },
    });

    if (!notices[0]) {
      return res.status(401).send("첫번째 게시글 입니다.");
    }

    return res.redirect(`/api/notice/list/${notices[notices.length - 1].id}`);
  } catch (error) {
    console.error(error);
    return res.status(401).send("게시글 정보를 불러올 수 없습니다. [CODE 107]");
  }
});

module.exports = router;
