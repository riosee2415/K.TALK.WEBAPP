const express = require("express");
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const { Notice, User, Lecture, Participant } = require("../models");
const { Op } = require("sequelize");
const isAdminCheck = require("../middlewares/isAdminCheck");
const AWS = require("aws-sdk");
const multerS3 = require("multer-s3");
const isLoggedIn = require("../middlewares/isLoggedIn");
const models = require("../models");

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

// 강의에 등록된 공지사항
router.post("/lecture/list", async (req, res, next) => {
  const { page, LectureId } = req.body;

  const LIMIT = 5;

  const _page = page ? page : 1;

  const __page = _page - 1;
  const OFFSET = __page * 5;

  const _LectureId = LectureId || null;

  try {
    const lengthQuery = `
    SELECT	id,
          
            title,
            content,
            author,
            level,
            senderId,
            receiverId,
            LectureId,
            file,
            isDelete,
            DATE_FORMAT(deletedAt, "%Y년 %m월 %d일 %H시 %i분 %s초") 			AS	deletedAt,
            DATE_FORMAT(createdAt, "%Y년 %m월 %d일 %H시 %i분 %s초") 			AS	createdAt,
            DATE_FORMAT(updatedAt, "%Y년 %m월 %d일 %H시 %i분 %s초") 			AS	updatedAt
      FROM	notices
     WHERE	1 = 1
     ${_LectureId ? `AND LectureId = ${_LectureId}` : ``}
    `;

    const selectQuery = `
    SELECT	id,
          
            title,
            content,
            author,
            level,
            senderId,
            receiverId,
            LectureId,
            file,
            isDelete,
            DATE_FORMAT(deletedAt, "%Y년 %m월 %d일 %H시 %i분 %s초") 			AS	deletedAt,
            DATE_FORMAT(createdAt, "%Y년 %m월 %d일 %H시 %i분 %s초") 			AS	createdAt,
            DATE_FORMAT(updatedAt, "%Y년 %m월 %d일 %H시 %i분 %s초") 			AS	updatedAt
      FROM	notices
     WHERE	1 = 1
    ${_LectureId ? `AND LectureId = ${_LectureId}` : ``}
     ORDER  BY createdAt DESC
     LIMIT  ${LIMIT}
    OFFSET  ${OFFSET}
    `;

    const length = await models.sequelize.query(lengthQuery);
    const notice = await models.sequelize.query(selectQuery);

    const noticelen = length[0].length;

    const lastPage =
      noticelen % LIMIT > 0 ? noticelen / LIMIT + 1 : noticelen / LIMIT;

    return res
      .status(200)
      .json({ notice: notice[0], lastPage: parseInt(lastPage) });
  } catch (error) {
    console.error(error);
    return res.status(401).send("공지사항 목록을 불러올 수 업습니다.");
  }
});

// 사용자 공지사항 (강사 or 학생)
router.get("/list", isLoggedIn, async (req, res, next) => {
  const { page } = req.query;

  const LIMIT = 10;

  const _page = page ? page : 1;

  const __page = _page - 1;
  const OFFSET = __page * 10;

  try {
    const lengthQuery = `
    SELECT	id,
            title,
            content,
            author,
            level,
            LectureId,
            file,
            isDelete,
            DATE_FORMAT(deletedAt, "%Y년 %m월 %d일 %H시 %i분 %s초") 			AS	deletedAt,
            DATE_FORMAT(createdAt, "%Y년 %m월 %d일 %H시 %i분 %s초") 			AS	createdAt,
            DATE_FORMAT(updatedAt, "%Y년 %m월 %d일 %H시 %i분 %s초") 			AS	updatedAt
      FROM	notices
     WHERE	1 = 1
      ${
        req.user.id === 1
          ? ` AND level = 1
              AND level = 3`
          : req.user.id === 2
          ? `
          AND level = 2
          AND level = 3
          `
          : ` AND level = 3`
      }
    `;

    const selectQuery = `
    SELECT	id,
            title,
            content,
            author,
            level,
            LectureId,
            file,
            isDelete,
            DATE_FORMAT(deletedAt, "%Y년 %m월 %d일 %H시 %i분 %s초") 			AS	deletedAt,
            DATE_FORMAT(createdAt, "%Y년 %m월 %d일 %H시 %i분 %s초") 			AS	createdAt,
            DATE_FORMAT(updatedAt, "%Y년 %m월 %d일 %H시 %i분 %s초") 			AS	updatedAt
      FROM	notices
     WHERE	1 = 1
     ${
       req.user.id === 1
         ? ` AND level = 1
            AND level = 3`
         : req.user.id === 2
         ? `
        AND level = 2
        AND level = 3
        `
         : ` AND level = 3`
     }
     ORDER  BY createdAt DESC
     LIMIT  ${LIMIT}
    OFFSET  ${OFFSET}
    `;

    const length = await models.sequelize.query(lengthQuery);
    const notice = await models.sequelize.query(selectQuery);

    const noticelen = length[0].length;

    const lastPage =
      noticelen % LIMIT > 0 ? noticelen / LIMIT + 1 : noticelen / LIMIT;

    return res
      .status(200)
      .json({ notice: notice[0], lastPage: parseInt(lastPage) });
  } catch (error) {
    console.error(error);
    return res.status(401).send("공지사항 목록을 불러올 수 업습니다.");
  }
});
// 공지사항 디테일
router.get("/detail/:noticeId", async (req, res, next) => {
  const { noticeId } = req.params;

  try {
    const selectQuery = `
    SELECT	id,
            title,
            content,
            author,
            LectureId,
            file,
            level,
            isDelete,
            DATE_FORMAT(deletedAt, "%Y년 %m월 %d일 %H시 %i분 %s초") 			AS	deletedAt,
            DATE_FORMAT(createdAt, "%Y년 %m월 %d일 %H시 %i분 %s초") 			AS	createdAt,
            DATE_FORMAT(updatedAt, "%Y년 %m월 %d일 %H시 %i분 %s초") 			AS	updatedAt
      FROM	notices
     WHERE	1 = 1
       AND  isDelete = FALSE
       AND  id = ${noticeId}
    `;

    const notice = await models.sequelize.query(selectQuery);

    return res.status(200).json({ notice: notice[0] });
  } catch (error) {
    console.error(error);
    return res.status(401).send("공지사항 목록을 불러올 수 업습니다.");
  }
});
// 관리자 공지사항
// level: 1 === 학생
// level: 2 === 강사
// level: 3 === 전체

router.post("/admin/list", isAdminCheck, async (req, res, next) => {
  const { level } = req.body;

  let nanFlag = isNaN(level);

  if (!level) {
    nanFlag = false;
  }

  if (nanFlag) {
    return res.status(400).send("잘못된 요청 입니다.");
  }

  let _level = Number(level);

  if (_level > 3 || !level) {
    _level = 3;
  }

  try {
    const selectQuery = `
    SELECT	id,
            title,
            content,
            author,
            level,
            LectureId,
            file,
            isDelete,
            DATE_FORMAT(deletedAt, "%Y년 %m월 %d일 %H시 %i분 %s초") 			AS	deletedAt,
            DATE_FORMAT(createdAt, "%Y년 %m월 %d일 %H시 %i분 %s초") 			AS	createdAt,
            DATE_FORMAT(updatedAt, "%Y년 %m월 %d일 %H시 %i분 %s초") 			AS	updatedAt
      FROM	notices
     WHERE	isDelete = FALSE
     ${
       _level === 1
         ? `AND level = 1`
         : _level === 2
         ? `AND level = 2`
         : _level === 3
         ? `AND level = 3`
         : `AND level = 3`
     }
     ORDER  BY createdAt DESC
    `;

    const notice = await models.sequelize.query(selectQuery);

    return res.status(200).json({ notice: notice[0] });
  } catch (error) {
    console.error(error);
    return res.status(401).send("공지사항 목록을 불러올 수 업습니다.");
  }
});

router.post("/file", upload.single("file"), async (req, res, next) => {
  return res.json({ path: req.file.location });
});

//강사가 강의에 공지사항 작성하기 (강의에 참여하고 있는 사람에게 작성하기)
router.post("/create", isLoggedIn, async (req, res, next) => {
  const { title, content, author, LectureId, file } = req.body;

  try {
    const exLecture = await Lecture.findOne({
      where: { id: parseInt(LectureId) },
    });

    if (!exLecture) {
      return res.status(401).send("해당 강의가 존재하지 않습니다.");
    }

    if (exLecture.TeacherId !== req.user.id) {
      return res.status(401).send("자신의 강의에만 등록할 수 있습니다.");
    }

    const createResult = await Notice.create({
      title,
      content,
      author,
      LectureId: parseInt(LectureId),
      file: file ? file : null,
    });

    if (!createResult) {
      return res.status(401).send("처리중 문제가 발생하였습니다.");
    }

    return res.status(201).json({ result: true });
  } catch (error) {
    console.error(error);
    return res.status(401).send("게시글을 등록할 수 없습니다. [CODE 077]");
  }
});

// 관리자 강의 공지사항 등록
router.post("/admin/lecture/create", isAdminCheck, async (req, res, next) => {
  const { title, content, author, LectureId, file } = req.body;

  try {
    const exLecture = await Lecture.findOne({
      where: { id: parseInt(LectureId) },
    });

    if (!exLecture) {
      return res.status(401).send("해당 강의가 존재하지 않습니다.");
    }

    if (exLecture.TeacherId !== req.user.id) {
      return res.status(401).send("자신의 강의에만 등록할 수 있습니다.");
    }

    const createResult = await Notice.create({
      title,
      content,
      author,
      LectureId: parseInt(LectureId),
      file: file ? file : null,
    });

    if (!createResult) {
      return res.status(401).send("처리중 문제가 발생하였습니다.");
    }

    return res.status(201).json({ result: true });
  } catch (error) {
    console.error(error);
    return res.status(401).send("게시글을 등록할 수 없습니다. [CODE 077]");
  }
});

// 관리자 등록
router.post("/admin/create", isAdminCheck, async (req, res, next) => {
  const { title, content, author, file, level } = req.body;

  if (req.user.level < 3) {
    return res.status(403).send("관리자만 게시글을 등록할 수 있습니다.");
  }

  try {
    const createResult = await Notice.create({
      title,
      content,
      author,
      LectureId: null,
      file: file ? file : null,
      level: parseInt(level) === 1 ? 1 : level === 2 ? 2 : level === 3 ? 3 : 3,
    });

    if (!createResult) {
      return res.status(401).send("처리중 문제가 발생하였습니다.");
    }

    return res.status(201).json({ result: true });
  } catch (error) {
    console.error(error);
    return res.status(401).send("게시글을 등록할 수 없습니다.");
  }
});

// 공지사항 수정
router.patch("/update", isLoggedIn, async (req, res, next) => {
  const { id, title, content, file } = req.body;

  try {
    const exNotice = await Notice.findOne({ where: { id: parseInt(id) } });

    if (!exNotice) {
      return res.status(401).send("존재하지 않는 게시글 입니다.");
    }

    const updateResult = await Notice.update(
      {
        title,
        content,
        file,
      },
      {
        where: { id: parseInt(id), senderId: parseInt(req.user.id) },
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
});

router.delete("/delete/:noticeId", isLoggedIn, async (req, res, next) => {
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
