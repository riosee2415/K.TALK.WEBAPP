const express = require("express");
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const AWS = require("aws-sdk");
const multerS3 = require("multer-s3");
const isAdminCheck = require("../middlewares/isAdminCheck");
const { BookFolder, Lecture, Book } = require("../models");
const models = require("../models");
const isNanCheck = require("../middlewares/isNanCheck");

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

router.get("/folder/list", async (req, res, next) => {
  try {
    const folderList = await BookFolder.findAll({
      where: { isDelete: false },
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json(folderList);
  } catch (error) {
    console.error(error);
    return res.status(401).send("폴더 목록을 불러올 수 없습니다.");
  }
});

router.post("/folder/create", isAdminCheck, async (req, res, next) => {
  const { value } = req.body;
  try {
    const exFolder = await BookFolder.findOne({
      where: { value },
    });

    if (exFolder) {
      return res.status(401).send("이미 해당 폴더가 존재합니다.");
    }

    const createResult = await BookFolder.create({
      value,
    });

    if (!createResult) {
      return res.status(401).send("처리중 문제가 발생하였습니다.");
    }

    return res.status(201).json({ result: true });
  } catch (error) {
    console.error(error);
    return res.status(401).send("폴더 목록을 불러올 수 없습니다.");
  }
});

router.patch("/folder/update", isAdminCheck, async (req, res, next) => {
  const { id, value } = req.body;
  try {
    const exFolder = await BookFolder.findOne({
      where: { id: parseInt(id) },
    });

    if (!exFolder) {
      return res.status(401).send("존재하지 않는 폴더입니다.");
    }

    const updateResult = await BookFolder.update(
      {
        value,
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
    return res.status(401).send("폴더 목록을 불러올 수 없습니다.");
  }
});

router.delete(
  "/folder/delete/:folderId",
  isAdminCheck,
  async (req, res, next) => {
    const { folderId } = req.params;
    if (isNanCheck(folderId)) {
      return res.status(401).send("잘못된 요청입니다.");
    }
    try {
      const exFolder = await BookFolder.findOne({
        where: { id: parseInt(folderId) },
      });

      if (!exFolder) {
        return res.status(401).send("존재하지 않는 폴더입니다.");
      }

      const deleteResult = await BookFolder.update(
        {
          isDelete: true,
        },
        {
          where: { id: parseInt(folderId) },
        }
      );

      if (deleteResult[0] > 0) {
        return res.status(200).json({ result: true });
      } else {
        return res.status(200).json({ result: false });
      }
    } catch (error) {
      console.error(error);
      return res.status(401).send("폴더 목록을 불러올 수 없습니다.");
    }
  }
);

router.post("/list", async (req, res, next) => {
  const { BookFolderId, LectureId } = req.body;

  let _BookFolderId = BookFolderId || null;
  let _LectureId = LectureId || null;

  try {
    const selectQuery = `
    SELECT	A.id,
            A.thumbnail,
            A.title,
            A.BookFolderId,
            A.LectureId,
            A.file,
            B.value
    FROM	books					A
   INNER
    JOIN	bookFolders 			B
      ON	A.BookFolderId = B.id
   WHERE	1 = 1
     AND	A.isDelete = FALSE
     AND	B.isDelete = FALSE
     ${_BookFolderId ? `AND A.BookFolderId = ${_BookFolderId}` : ``}
     ${_LectureId ? `AND A.LectureId = ${_LectureId}` : ``}
    `;

    const list = await models.sequelize.query(selectQuery);

    return res.status(200).json({ list: list[0] });
  } catch (error) {
    console.error(error);
    return res.status(401).send("교재 목록을 불러올 수 없습니다.");
  }
});

router.get("/detail/:bookId", async (req, res, next) => {
  const { bookId } = req.params;

  if (isNanCheck(bookId)) {
    return res.status(401).send("잘못된 요청입니다.");
  }

  try {
    const exBook = await Book.findOne({
      where: { id: parseInt(bookId) },
    });

    if (!exBook) {
      return res.status(401).send("존재하지 않는 교재입니다.");
    }

    const selectQuery = `
    SELECT	A.id,
            A.thumbnail,
            A.title,
            A.BookFolderId,
            A.LectureId,
            A.file,
            B.value
    FROM	books					A
   INNER
    JOIN	bookFolders 			B
      ON	A.BookFolderId = B.id
   WHERE	1 = 1
     AND	A.isDelete = FALSE
     AND	B.isDelete = FALSE
     AND    A.id = ${bookId}
    `;

    const book = await models.sequelize.query(selectQuery);

    return res.status(200).json({ book: book[0] });
  } catch (error) {
    console.error(error);
    return res.status(401).send("교재 정보를 불러올 수 없습니다.");
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
  const { thumbnail, title, file, LectureId, BookFolderId } = req.body;
  try {
    const exLecture = await Lecture.findOne({
      where: { id: parseInt(LectureId) },
    });

    const exBookFolder = await BookFolder.findOne({
      where: { id: parseInt(BookFolderId) },
    });

    if (!exLecture) {
      return res.status(401).send("존재하지 않는 강의입니다.");
    }

    if (!exBookFolder) {
      return res.status(401).send("존재하지 않는 폴더입니다.");
    }

    const createResult = await Book.create({
      thumbnail,
      title,
      file,
      LectureId: parseInt(LectureId),
      BookFolderId: parseInt(BookFolderId),
    });

    if (!createResult) {
      return res.status(401).send("처리중 문제가 발생하였습니다.");
    }

    return res.status(201).json({ result: true });
  } catch (error) {
    console.error(error);
    return res.status(401).send("교재를 등록할 수 없습니다.");
  }
});

router.patch("/update", isAdminCheck, async (req, res, next) => {
  const { id, thumbnail, title, file, LectureId, BookFolderId } = req.body;
  try {
    const exBook = await Book.findOne({
      where: { id: parseInt(id) },
    });

    const exLecture = await Lecture.findOne({
      where: { id: parseInt(LectureId) },
    });

    const exBookFolder = await BookFolder.findOne({
      where: { id: parseInt(BookFolderId) },
    });

    if (!exBook) {
      return res.status(401).send("존재하지 않는 교재입니다.");
    }

    if (!exLecture) {
      return res.status(401).send("존재하지 않는 강의입니다.");
    }

    if (!exBookFolder) {
      return res.status(401).send("존재하지 않는 폴더입니다.");
    }

    const updateResult = await Book.update(
      {
        thumbnail,
        title,
        file,
        LectureId: parseInt(LectureId),
        BookFolderId: parseInt(BookFolderId),
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
    return res.status(401).send("교재를 수정할 수 없습니다.");
  }
});

router.delete("/delete/:bookId", isAdminCheck, async (req, res, next) => {
  const { bookId } = req.params;

  if (isNanCheck(bookId)) {
    return res.status(401).send("잘못된 요청입니다.");
  }

  try {
    const exBook = await Book.findOne({
      where: { id: parseInt(bookId) },
    });

    if (!exBook) {
      return res.status(401).send("존재하지 않는 교재입니다.");
    }

    const deleteResult = await Book.update(
      {
        isDelete: true,
      },
      {
        where: { id: parseInt(bookId) },
      }
    );

    if (deleteResult[0] > 0) {
      return res.status(200).json({ result: true });
    } else {
      return res.status(200).json({ result: false });
    }
  } catch (error) {
    console.error(error);
    return res.status(401).send("교재를 삭제할 수 없습니다.");
  }
});

module.exports = router;
