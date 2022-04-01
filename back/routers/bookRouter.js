const express = require("express");
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const AWS = require("aws-sdk");
const multerS3 = require("multer-s3");
const isAdminCheck = require("../middlewares/isAdminCheck");
const { BookFolder, Lecture, Book, BookList } = require("../models");
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
  const { BookFolderId, search, page } = req.body;

  const LIMIT = 10;

  const _page = page ? page : 1;

  const __page = _page - 1;
  const OFFSET = __page * 10;

  let _BookFolderId = BookFolderId || null;

  const _search = search ? search : ``;

  try {
    const lengthQuery = `
    SELECT	A.id,
            A.thumbnail,
            A.title,
            A.BookFolderId,
            A.file,
            B.value
      FROM	books					    A
     INNER
      JOIN	bookFolders 			B
        ON	A.BookFolderId = B.id
     WHERE	1 = 1
       AND	A.isDelete = FALSE
       AND	B.isDelete = FALSE
       ${_BookFolderId ? `AND A.BookFolderId = ${_BookFolderId}` : ``}
       ${_search ? `AND A.title LIKE '%${_search}%'` : ``}
    `;

    const selectQuery = `
    SELECT	A.id,
            A.thumbnail,
            A.title,
            A.BookFolderId,
            A.file,
            B.value
      FROM	books					    A
     INNER
      JOIN	bookFolders 			B
        ON	A.BookFolderId = B.id
     WHERE	1 = 1
       AND	A.isDelete = FALSE
       AND	B.isDelete = FALSE
       ${_BookFolderId ? `AND A.BookFolderId = ${_BookFolderId}` : ``}
       ${_search ? `AND A.title LIKE '%${_search}%'` : ``}
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
      FROM	books					    A
     INNER
      JOIN	bookFolders 			B
        ON	A.BookFolderId = B.id
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
  const { thumbnail, title, file, BookFolderId } = req.body;

  if (!req.user) {
    return res.status(403).send("로그인 후 이용 가능합니다.");
  }

  try {
    const exBookFolder = await BookFolder.findOne({
      where: { id: parseInt(BookFolderId) },
    });

    if (!exBookFolder) {
      return res.status(401).send("존재하지 않는 폴더입니다.");
    }

    const createResult = await Book.create({
      thumbnail,
      title,
      file,
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

router.patch("/update", isLoggedIn, async (req, res, next) => {
  const { id, thumbnail, title, file, BookFolderId } = req.body;

  if (!req.user) {
    return res.status(403).send("로그인 후 이용 가능합니다.");
  }

  try {
    const exBook = await Book.findOne({
      where: { id: parseInt(id) },
    });

    const exBookFolder = await BookFolder.findOne({
      where: { id: parseInt(BookFolderId) },
    });

    if (!exBook) {
      return res.status(401).send("존재하지 않는 교재입니다.");
    }

    if (!exBookFolder) {
      return res.status(401).send("존재하지 않는 폴더입니다.");
    }

    const updateResult = await Book.update(
      {
        thumbnail,
        title,
        file,
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

router.post("/lecture/list", isLoggedIn, async (req, res, next) => {
  const { LectureId } = req.body;
  try {
    const exLecture = await Lecture.findOne({
      where: { id: parseInt(LectureId) },
    });

    if (!exLecture) {
      return res.status(401).send("존재하지 않는 강의 입니다.");
    }

    if (exLecture.UserId !== req.user.id) {
      return res.status(401).send("자신의 강의가 아닙니다.");
    }

    const bookList = await BookList.findAll({
      where: { LectureId: parseInt(LectureId) },
      include: [
        {
          model: Book,
        },
      ],
    });

    return res.status(200).json(bookList);
  } catch (error) {
    console.error(error);
    return res
      .status(401)
      .send("강의에 등록된 교재 목록을 불러올 수 없습니다.");
  }
});

router.post("/lecture/create", isLoggedIn, async (req, res, next) => {
  const { BookId, LectureId } = req.body;

  try {
    const exLecture = await Lecture.findOne({
      where: { id: parseInt(LectureId) },
    });

    if (!exLecture) {
      return res.status(401).send("존재하지 않는 강의 입니다.");
    }

    if (exLecture.UserId !== req.user.id) {
      return res.status(401).send("자신의 강의가 아닙니다.");
    }

    const exBook = await Book.findOne({
      where: { id: parseInt(BookId) },
    });

    if (!exBook) {
      return res.status(401).send("존재하지 않는 교재입니다.");
    }

    const exBookList = await BookList.findOne({
      LectureId: parseInt(LectureId),
      BookId: parseInt(BookId),
    });

    if (exBookList) {
      return res.status(401).send("이미 해당 강의에 교재가 등록되어 있습니다.");
    }

    const createResult = await BookList.create({
      LectureId: parseInt(LectureId),
      BookId: parseInt(BookId),
    });

    if (!createResult) {
      return res.status(401).send("처리중 문제가 발생하였습니다.");
    }

    return res.status(201).json({ result: true });
  } catch (error) {
    console.error(error);
    return res.status(401).send("강의에 교재를 추가할 수 없습니다.");
  }
});

router.patch("/leture/update", isLoggedIn, async (req, res, next) => {
  const { id, BookId, LectureId } = req.body;
  try {
    const exBookList = await BookList.findOne({
      where: { id: parseInt(id) },
    });

    if (!exBookList) {
      return res.status(401).send("등록되지 않은 정보입니다.");
    }

    const exLecture = await Lecture.findOne({
      where: { id: parseInt(LectureId) },
    });

    if (!exLecture) {
      return res.status(401).send("존재하지 않는 강의 입니다.");
    }

    if (exLecture.UserId !== req.user.id) {
      return res.status(401).send("자신의 강의가 아닙니다.");
    }

    const exBook = await Book.findOne({
      where: { id: parseInt(BookId) },
    });

    if (!exBook) {
      return res.status(401).send("존재하지 않는 교재입니다.");
    }

    const exBookList2 = await BookList.findOne({
      LectureId: parseInt(LectureId),
      BookId: parseInt(BookId),
    });

    if (exBookList2) {
      return res.status(401).send("이미 해당 강의에 교재가 등록되어 있습니다.");
    }

    const updateResult = await BookList.update(
      {
        LectureId: parseInt(LectureId),
        BookId: parseInt(BookId),
      },
      {
        where: { id: parseInt(id) },
      }
    );

    if (updateResult[0] > 0) {
      return res.status(201).json({ result: true });
    } else {
      return res.status(201).json({ result: true });
    }
  } catch (error) {
    console.error(error);
    return res.status(401).send("강의에 등록된 교제를 수정할 수 없습니다.");
  }
});

router.delete("/delete/:BookListId", isLoggedIn, async (req, res, next) => {
  const { BookListId } = req.params;

  if (isNanCheck(BookListId)) {
    return res.status(403).send("로그인 후 이용 가능합니다.");
  }

  try {
    const exBookList = await BookList.findOne({
      where: { id: parseInt(BookListId) },
    });

    if (!exBookList) {
      return res.status(401).send("등록되지 않은 정보입니다.");
    }

    const deleteResult = await BookList.destroy({
      where: { id: parseInt(BookListId) },
    });

    return res.status(200).json({ result: true });
  } catch (error) {
    console.error(error);
    return res.status(401).send("강의에 등록된 교제를 삭제할 수 없습니다.");
  }
});

module.exports = router;
