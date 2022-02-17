const express = require("express");
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const AWS = require("aws-sdk");
const multerS3 = require("multer-s3");
const isAdminCheck = require("../middlewares/isAdminCheck");
const { Seo } = require("../models");
const models = require("../models");

const router = express.Router();

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

router.get("/list", isAdminCheck, async (req, res, next) => {
  try {
    const selectQuery = `
    SELECT  id,
            type,
            content,
            DATE_FORMAT(updatedAt, "%Y년 %m월 %d일") AS updatedAt,
            DATE_FORMAT(createdAt, "%Y년 %m월 %d일") AS createdAt 
      FROM	seos
    `;

    const seos = await models.sequelize.query(selectQuery);

    res.status(200).json({ seos: seos[0] });
  } catch (error) {
    console.error(error);

    return res.status(400).send("데이터를 불러올 수 없습니다.");
  }
});

router.patch("/update/title", isAdminCheck, async (req, res, next) => {
  const { id, title } = req.body;

  try {
    const exData = await Seo.findOne({
      where: { id: parseInt(id) },
    });

    if (!exData) {
      return res.status(401).send("잘못 된 요청입니다. 다시 확인해주세요.");
    }

    const updateResults = await Seo.update(
      {
        content: title,
      },
      {
        where: { id: parseInt(id) },
      }
    );

    return res.status(200).json({ result: true });
  } catch (error) {
    console.error(error);
    return res
      .status(400)
      .send("데이터를 수정할 수 없습니다. 개발사에 문의해주세요.");
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

router.patch("/update/thumbnail", isAdminCheck, async (req, res, next) => {
  const { url } = req.body;

  try {
    const ex = await Seo.findAll({
      where: {
        type: "이미지",
      },
    });

    if (ex.length !== 0) {
      await Seo.update(
        {
          content: url,
        },
        {
          where: { id: ex[0].id },
        }
      );
    } else {
      await Seo.create({
        type: "이미지",
        content: url,
      });
    }

    return res.status(200).json({ result: true });
  } catch (error) {
    console.error(error);
    return res.status(400).send("이미지 수정에 실패했습니다.");
  }
});

router.patch("/update/keyword", isAdminCheck, async (req, res, next) => {
  const { id, value } = req.body;

  try {
    const exData = await Seo.findOne({
      where: { id: parseInt(id) },
    });

    if (!exData) {
      return res.status(401).send("잘못 된 요청입니다. 다시 확인해주세요.");
    }

    const updateResults = await Seo.update(
      {
        content: value,
      },
      {
        where: { id: parseInt(id) },
      }
    );

    return res.status(200).json({ result: true });
  } catch (error) {
    console.error(error);
    return res
      .status(400)
      .send("데이터를 수정할 수 없습니다. 개발사에 문의해주세요.");
  }
});

router.delete("/delete/keyword/:id", isAdminCheck, async (req, res, next) => {
  const { id } = req.params;

  try {
    await Seo.destroy({ where: { id: parseInt(id) } });

    return res.status(200).json({ result: true });
  } catch (error) {
    console.error(error);
    return res.status(400).send("키워드를 삭제할 수 없습니다.");
  }
});

router.post("/create/keyword", isAdminCheck, async (req, res, next) => {
  const { value } = req.body;

  try {
    await Seo.create({
      type: "키워드",
      content: value,
    });

    return res.status(201).json({ result: true });
  } catch (error) {
    console.log(error);
    return res.status(400).send("키워드 등록에 실패했습니다.");
  }
});

router.patch("/update/desc", isAdminCheck, async (req, res, next) => {
  const { value } = req.body;

  try {
    const ex = await Seo.findAll({
      where: {
        type: "홈페이지설명",
      },
    });

    if (ex.length !== 0) {
      await Seo.update(
        {
          content: value,
        },
        {
          where: { type: "홈페이지설명" },
        }
      );
    } else {
      await Seo.create({
        content: value,
        type: "홈페이지설명",
      });
    }

    return res.status(200).json({ result: true });
  } catch (error) {
    console.error(error);
    return res.status(400).send("홈페이지 설명 수정에 실패했습니다.");
  }
});

module.exports = router;
