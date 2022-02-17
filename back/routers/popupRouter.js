const express = require("express");
const isAdminCheck = require("../middlewares/isAdminCheck");
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const { Popup } = require("../models");
const AWS = require("aws-sdk");
const multerS3 = require("multer-s3");

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

router.post(
  "/image",
  isAdminCheck,
  upload.single("image"),
  async (req, res, next) => {
    return res.json({ path: req.file.location });
  }
);

router.get("/get", async (req, res, next) => {
  try {
    const popups = await Popup.findAll();

    return res.status(200).json(popups);
  } catch (error) {
    console.error(error);
    return res
      .status(401)
      .send("데이터를 불러올 수 없습니다. 개발사에 문의해주세요.");
  }
});

router.get("/viewer", async (req, res, next) => {
  try {
    const popups = await Popup.findAll({
      where: { useYn: true },
    });

    return res.status(200).json(popups);
  } catch (error) {
    console.error(error);
    return res
      .status(401)
      .send("데이터를 불러올 수 없습니다. 개발사에 문의해주세요.");
  }
});

router.post("/create", isAdminCheck, async (req, res, next) => {
  const { imagePath } = req.body;

  try {
    const createResult = await Popup.create({
      imagePath,
      useYn: true,
    });

    return res.status(201).json({ result: true });
  } catch (error) {
    console.error(error);
    return res
      .status(401)
      .send("새로운 팝업을 추가할 수 없습니다. 개발사에 문의해주세요.");
  }
});

router.post("/update", isAdminCheck, async (req, res, next) => {
  const { id, imagePath } = req.body;

  const validation = Number(id);

  if (isNaN(validation)) {
    return res.status(400).send("올바르지 않은 요청 입니다.");
  }

  try {
    const updateResult = await Popup.update(
      { imagePath },
      {
        where: { id: parseInt(id) },
      }
    );

    if (updateResult[0] > 0) {
      return res.status(200).json({ result: true });
    } else {
      return res
        .status(409)
        .send("올바른 요청이지만 정상적으로 처리되지 않았습니다.");
    }
  } catch (error) {
    console.error(error);
    return res.status(401).send("팝업 정보를 수정할 수 없습니다.");
  }
});

router.post("/useUpdate", isAdminCheck, async (req, res, next) => {
  const { id, currentUseYn } = req.body;

  const validation = Number(id);

  if (isNaN(validation)) {
    return res.status(400).send("올바르지 않은 요청 입니다.");
  }

  try {
    const nextUseYn = !currentUseYn;

    const updateResult = await Popup.update(
      { useYn: nextUseYn },
      {
        where: { id: parseInt(id) },
      }
    );

    if (updateResult[0] > 0) {
      return res.status(200).json({ result: true });
    } else {
      return res
        .status(409)
        .send("올바른 요청이지만 정상적으로 처리되지 않았습니다.");
    }
  } catch (error) {
    console.error(error);
    return res.status(403).send("처리할 수 없습니다. 개발사에 문의해주세요.");
  }
});

router.delete("/delete/:popupId", isAdminCheck, async (req, res, next) => {
  const { popupId } = req.params;

  const validation = Number(popupId);

  if (isNaN(validation)) {
    return res.status(400).send("올바르지 않은 요청 입니다.");
  }

  try {
    const deleteResult = await Popup.destroy({
      where: { id: parseInt(popupId) },
    });

    return res.status(200).json({ result: true });
  } catch (error) {
    console.error(error);
    return res.status(403).send("[서버장애 발생] 개발사에 문의해주세요.");
  }
});

module.exports = router;
