const express = require("express");
const isAdminCheck = require("../middlewares/isAdminCheck");
const { MainBanner } = require("../models");
const fs = require("fs");
const multer = require("multer");
const path = require("path");
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
  try {
    const banners = await MainBanner.findAll();

    return res.status(200).json(banners);
  } catch (error) {
    console.error(error);
    return res
      .status(403)
      .send("데이터를 가져올 수 없습니다. 개발사에 문의해주세요.");
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

router.post("/update", isAdminCheck, async (req, res, next) => {
  const { id, imagePath, title, content } = req.body;

  try {
    const updateResult = await MainBanner.update(
      { imagePath, title, content },
      {
        where: { id: parseInt(id) },
      }
    );

    if (updateResult > 0) {
      return res.status(200).json({ result: true });
    } else {
      return res.status(403).send("메인베너 수정에 실패했습니다.");
    }
  } catch (error) {
    console.error(error);
    res
      .status(401)
      .send("메인베너를 수정할 수 없습니다. 개발사에 문의해주세요.");
  }
});

router.post("/create", isAdminCheck, async (req, res, next) => {
  const { title, content, imagePath } = req.body;

  try {
    const createResult = await MainBanner.create({
      title,
      content,
      imagePath,
    });

    return res.status(201).json({ result: true });
  } catch (error) {
    console.error(error);
    return res
      .status(401)
      .send(
        "새로운 메인베너 생성에 실패했습니다. 개발사에 문의해주세요. [CODE 0002]"
      );
  }
});

router.delete("/delete/:bannerId", isAdminCheck, async (req, res, next) => {
  const id = req.params.bannerId;

  try {
    const deleteResult = await MainBanner.destroy({
      where: { id: parseInt(id) },
    });

    return res.status(200).json({ result: true });
  } catch (error) {
    console.error(error);
    return res.status(403).send("[서버장애 발생] 개발사에 문의해주세요.");
  }
});

module.exports = router;
