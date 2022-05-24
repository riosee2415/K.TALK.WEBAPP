const express = require("express");
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const AWS = require("aws-sdk");
const multerS3 = require("multer-s3");
const isAdminCheck = require("../middlewares/isAdminCheck");
const { Lecture, Book } = require("../models");
const models = require("../models");
const isNanCheck = require("../middlewares/isNanCheck");
const isLoggedIn = require("../middlewares/isLoggedIn");

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

router.post("/list", async (req, res, next) => {
  const { LectureId, search, page, level, stage, kinds } = req.body;

  const LIMIT = 12;

  const _page = page ? page : 1;

  const __page = _page - 1;
  const OFFSET = __page * 12;

  let _LectureId = LectureId || null;

  const _search = search ? search : ``;
  const _level = level ? level : ``;
  const _stage = stage ? stage : ``;
  const _kinds = kinds ? kinds : ``;

  try {
    const lengthQuery = `
    SELECT	A.id,
            A.thumbnail,
            A.title,
            A.LectureId,
            A.file,
            A.level,
            A.stage,
            A.kinds,
            B.course,
            C.username
      FROM	books					    A
     INNER
      JOIN	lectures 			    B
        ON	A.LectureId = B.id
     INNER
      JOIN	users 			      C
        ON	B.UserId = C.id
     WHERE	1 = 1
       AND	A.isDelete = FALSE
       AND	B.isDelete = FALSE
       ${_LectureId ? `AND A.LectureId = ${_LectureId}` : ``}
       ${_search ? `AND A.title LIKE '%${_search}%'` : ``}
       ${_level !== `` ? `AND A.level LIKE '%${_level}%'` : ``}
       ${_stage !== `` ? `AND A.stage LIKE '${_stage}'` : ``}
       ${_kinds !== `` ? `AND A.kinds LIKE '${_kinds}'` : ``}
    `;

    const selectQuery = `
    SELECT	A.id,
            A.thumbnail,
            A.title,
            A.LectureId,
            A.file,
            A.level,
            A.stage,
            A.kinds,
            B.course,
            C.username
      FROM	books					    A
     INNER
      JOIN	lectures 			    B
        ON	A.LectureId = B.id
     INNER
      JOIN	users 			      C
        ON	B.UserId = C.id
     WHERE	1 = 1
       AND	A.isDelete = FALSE
       AND	B.isDelete = FALSE
       ${_LectureId ? `AND A.LectureId = ${_LectureId}` : ``}
       ${_search ? `AND A.title LIKE '%${_search}%'` : ``}
       ${_level !== `` ? `AND A.level LIKE '%${_level}%'` : ``}
       ${_stage !== `` ? `AND A.stage LIKE '${_stage}'` : ``}
       ${_kinds !== `` ? `AND A.kinds LIKE '${_kinds}'` : ``}
     LIMIT  ${LIMIT}
    OFFSET  ${OFFSET}
    `;

    const length = await models.sequelize.query(lengthQuery);
    const books = await models.sequelize.query(selectQuery);

    const bookslen = length[0].length;

    const lastPage =
      bookslen % LIMIT > 0 ? bookslen / LIMIT + 1 : bookslen / LIMIT;

    return res
      .status(200)
      .json({ books: books[0], lastPage: parseInt(lastPage) });
  } catch (error) {
    console.error(error);
    return res.status(401).send("Unable to load the list of classes.");
  }
});

router.get("/allBooks", async (req, res, next) => {
  try {
    const allBooks = await Book.findAll({
      where: { isDelete: false },
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json(allBooks);
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
            A.LectureId,
            A.file,
            A.level,
            A.stage,
            A.kinds,
            B.course
      FROM	books					    A
     INNER
      JOIN	lectures 			    B
        ON	A.LectureId = B.id
     WHERE	1 = 1
       AND	A.isDelete = FALSE
       AND	B.isDelete = FALSE
       AND  A.id = ${bookId}
      `;

    const book = await models.sequelize.query(selectQuery);

    return res.status(200).json({ book: book[0] });
  } catch (error) {
    console.error(error);
    return res.status(401).send("교재 정보를 불러올 수 없습니다.");
  }
});

router.post("/image", upload.single("image"), async (req, res, next) => {
  return res.json({ path: req.file.location });
});

router.post("/create", isLoggedIn, async (req, res, next) => {
  const { thumbnail, title, file, LectureId, level, stage, kinds } = req.body;

  if (!req.user) {
    return res.status(403).send("로그인 후 이용 가능합니다.");
  }

  try {
    const exLecture = await Lecture.findOne({
      where: { id: parseInt(LectureId) },
    });

    if (!exLecture) {
      return res.status(401).send("존재하지 않는 강의입니다.");
    }

    const createResult = await Book.create({
      thumbnail,
      title,
      file,
      level,
      stage,
      kinds,
      LectureId: parseInt(LectureId),
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

router.patch("/update", isLoggedIn, async (req, res, next) => {
  const { id, thumbnail, title, file, LectureId, level, stage, kinds } =
    req.body;

  if (!req.user) {
    return res.status(403).send("로그인 후 이용 가능합니다.");
  }

  try {
    const exBook = await Book.findOne({
      where: { id: parseInt(id) },
    });

    const exLecture = await Lecture.findOne({
      where: { id: parseInt(LectureId) },
    });

    if (!exBook) {
      return res.status(401).send("존재하지 않는 교재입니다.");
    }

    if (!exLecture) {
      return res.status(401).send("존재하지 않는 강의입니다.");
    }

    if (exLecture.UserId !== req.user.id) {
      return res
        .status(401)
        .send("자신의 강의에 등록된 교재만 수정할 수 있습니다.");
    }

    const updateResult = await Book.update(
      {
        thumbnail,
        title,
        file,
        level,
        stage,
        kinds,
        LectureId: parseInt(LectureId),
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

    const exLecture = await Lecture.findOne({
      where: { id: parseInt(exBook.LectureId) },
    });

    if (!exLecture) {
      return res.status(401).send("존재하지 않는 강의입니다.");
    }

    if (exLecture.UserId !== req.user.id) {
      return res
        .status(401)
        .send("자신의 강의에 등록된 교재만 삭제할 수 있습니다.");
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

router.patch("/admin/update", isAdminCheck, async (req, res, next) => {
  const { id, thumbnail, title, file, LectureId, level, stage, kinds } =
    req.body;

  try {
    const exBook = await Book.findOne({
      where: { id: parseInt(id) },
    });

    const exLecture = await Lecture.findOne({
      where: { id: parseInt(LectureId) },
    });

    if (!exBook) {
      return res.status(401).send("존재하지 않는 교재입니다.");
    }

    if (!exLecture) {
      return res.status(401).send("존재하지 않는 강의입니다.");
    }

    const updateResult = await Book.update(
      {
        thumbnail,
        title,
        file,
        level,
        stage,
        kinds,
        LectureId: parseInt(LectureId),
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

router.delete("/admin/delete/:bookId", isAdminCheck, async (req, res, next) => {
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

    const exLecture = await Lecture.findOne({
      where: { id: parseInt(exBook.LectureId) },
    });

    if (!exLecture) {
      return res.status(401).send("존재하지 않는 강의입니다.");
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
