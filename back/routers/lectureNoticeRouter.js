const express = require("express");
const isAdminCheck = require("../middlewares/isAdminCheck");
const isLoggedIn = require("../middlewares/isLoggedIn");
const {
  Lecture,
  LectureNotice,
  Participant,
  LectureNoticeComment,
  LectureConnect,
} = require("../models");
const models = require("../models");
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const AWS = require("aws-sdk");
const multerS3 = require("multer-s3");
const isNanCheck = require("../middlewares/isNanCheck");

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

const router = express.Router();

router.post("/file", upload.single("file"), async (req, res, next) => {
  return res.json({ path: req.file.location });
});

// 게시판 리스트 (전체 게시판)
router.post("/list", isLoggedIn, async (req, res, next) => {
  const { LectureId, page } = req.body;

  if (!req.user) {
    return res.status(403).send("로그인 후 이용 가능합니다.");
  }

  const LIMIT = 5;

  const _page = page ? page : 1;

  const __page = _page - 1;
  const OFFSET = __page * 5;

  try {
    const exLecture = await Lecture.findOne({
      where: { id: parseInt(LectureId) },
    });

    if (!exLecture) {
      return res.status(401).send("존재하지 않는 강의 입니다.");
    }

    if (exLecture.isDelete) {
      return res
        .status(401)
        .send("삭제된 강의입니다. 확인 후 다시 시도하여 주십시오.");
    }

    const lengthQuery = `
    SELECT	DISTINCT
            A.LectureNoticeId			                        AS connectNoticeId,
            B.title,
            B.id					                                AS noticeId,
            B.title 				                              AS noticeTitle,
            B.content 			                              AS noticeContent,
            B.author 				                              AS noticeAuthor,
            B.level 				                              AS noticeLevel,
            B.file 					                              AS noticeFile,
            B.hit 					                              AS noticeHit,
            DATE_FORMAT(B.createdAt, "%Y-%m-%d")	        AS noticeCreatedAt,
            B.UserId 				                              AS writeUserId,
            C.number				                              AS lectureNumber,
            C.course				                              AS lectureName
      FROM	lectureConnects				A
     INNER
      JOIN	lectureNotices 				B
        ON	A.LectureNoticeId = B.id
     INNER
      JOIN	lectures					    C
        ON	B.LectureId = C.id
     WHERE	A.UserId = ${req.user.id} OR B.UserId = ${req.user.id}
       AND  B.LectureId = ${LectureId}
       AND  B.isDelete = FALSE
       AND	C.isDelete = FALSE
    `;

    const selectQuery = `
    SELECT	DISTINCT
            A.LectureNoticeId			                        AS connectNoticeId,
            B.title,
            B.id					                                AS noticeId,
            B.title 				                              AS noticeTitle,
            B.content 			                              AS noticeContent,
            B.author 				                              AS noticeAuthor,
            B.level 				                              AS noticeLevel,
            B.file 					                              AS noticeFile,
            B.hit 					                              AS noticeHit,
            DATE_FORMAT(B.createdAt, "%Y-%m-%d")        	AS noticeCreatedAt,
            B.UserId 				                              AS writeUserId,
            C.number				                              AS lectureNumber,
            C.course				                              AS lectureName
      FROM	lectureConnects				A
     INNER
      JOIN	lectureNotices 				B
        ON	A.LectureNoticeId = B.id
     INNER
      JOIN	lectures					    C
        ON	B.LectureId = C.id
     WHERE	A.UserId = ${req.user.id} OR B.UserId = ${req.user.id}
       AND  B.LectureId = ${LectureId}
       AND  B.isDelete = FALSE
       AND	C.isDelete = FALSE
     ORDER  BY B.id DESC
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
    return res.status(401).send("강의실 게시판 목록을 불러올 수 없습니다.");
  }
});

// 관리자 리스트 (조회만 가능)
router.post("/admin/list", isAdminCheck, async (req, res, next) => {
  const { LectureId } = req.body;

  const _LectureId = LectureId || null;

  try {
    if (LectureId) {
      const exLecture = await Lecture.findOne({
        where: { id: parseInt(LectureId) },
      });

      if (!exLecture) {
        return res.status(401).send("존재하지 않는 강의 입니다.");
      }

      if (exLecture.isDelete) {
        return res
          .status(401)
          .send("삭제된 강의입니다. 확인 후 다시 시도하여 주십시오.");
      }
    }

    const selectQuery = `
    SELECT	DISTINCT
            A.LectureNoticeId			                        AS connectNoticeId,
            B.id					                                AS noticeId,
            B.title 				                              AS noticeTitle,
            B.content 			                              AS noticeContent,
            B.author 				                              AS noticeAuthor,
            B.level 				                              AS noticeLevel,
            B.file 					                              AS noticeFile,
            B.hit 					                              AS noticeHit,
            DATE_FORMAT(B.createdAt, "%Y-%m-%d")	        AS noticeCreatedAt,
            B.UserId 				                              AS writeUserId,
            C.number				                              AS lectureNumber,
            C.course				                              AS lectureName
      FROM	lectureConnects				A
     INNER
      JOIN	lectureNotices 				B
        ON	A.LectureNoticeId = B.id
     INNER
      JOIN	lectures					    C
        ON	B.LectureId = C.id
     WHERE	1 = 1
       ${_LectureId ? `AND B.LectureId = ${_LectureId}` : ``}
       AND  B.isDelete = FALSE
       AND	C.isDelete = FALSE
    `;

    const notice = await models.sequelize.query(selectQuery);

    return res.status(200).json({ notice: notice[0] });
  } catch (error) {
    console.error(error);
    return res.status(401).send("강의실 게시판 목록을 불러올 수 없습니다.");
  }
});

router.post("/detail", isLoggedIn, async (req, res, next) => {
  const { LectureNoticeId } = req.body;

  if (!req.user) {
    return res.status(403).send("로그인 후 이용 가능합니다.");
  }

  try {
    const exLecture = await LectureNotice.findOne({
      where: { id: parseInt(LectureNoticeId) },
    });

    if (!exLecture) {
      return res.status(401).send("존재하지 않는 강의 게시글 입니다.");
    }

    if (exLecture.isDelete) {
      return res
        .status(401)
        .send("삭제된 강의 게시글입니다. 확인 후 다시 시도하여 주십시오.");
    }

    const detailQuery = `
    SELECT	A.LectureNoticeId			                        AS connectNoticeId,
            A.UserId 					                            AS connectUserId,
            B.title,
            B.id					                                AS noticeId,
            B.title 				                              AS noticeTitle,
            B.content 			                              AS noticeContent,
            B.author 				                              AS noticeAuthor,
            B.level 				                              AS noticeLevel,
            B.file 					                              AS noticeFile,
            B.hit 					                              AS noticeHit,
            DATE_FORMAT(B.createdAt, "%Y-%m-%d")	        AS noticeCreatedAt,
            B.UserId 				                              AS writeUserId,
            C.id                                          AS lectureId,
            C.number				                              AS lectureNumber,
            C.course				                              AS lectureName
      FROM	lectureConnects				A
     INNER
      JOIN	lectureNotices 				B
        ON	A.LectureNoticeId = B.id
     INNER
      JOIN	lectures					    C
        ON	B.LectureId = C.id
     WHERE	1 = 1
       AND  B.id = ${LectureNoticeId}
       AND  A.UserId = ${req.user.id}
       AND  B.isDelete = FALSE
       AND	C.isDelete = FALSE
    `;

    const detailData = await models.sequelize.query(detailQuery);

    if (detailData[0].length === 0) {
      return res.status(401).send("존재하지 않는 게시글입니다.");
    }

    const commentQuery = `
    SELECT	A.id,
            A.content,
            A.isDelete,
            A.deletedAt,
            A.parent,
            A.parentId,
            DATE_FORMAT(A.createdAt, '%Y-%m-%d')  AS createdAt,
            DATE_FORMAT(A.updatedAt, '%Y-%m-%d')  AS updatedAt,
            A.LectureNoticeId,
            A.grantparentId,
            A.UserId,
            A.name,
            A.level,
            (
              SELECT	COUNT(lc.id)
                FROM	lectureNoticeComments	lc
               WHERE	lc.grantparentId = A.id
                 AND    lc.isDelete = FALSE
            )   AS commentCnt
      FROM	lectureNoticeComments		A
     WHERE	A.isDelete = FALSE
       AND	A.parentId  IS NULL
       AND  A.LectureNoticeId = ${LectureNoticeId}
     ORDER  BY A.createdAt DESC
    `;

    const comments = await models.sequelize.query(commentQuery);

    const commentsLen = await LectureNoticeComment.findAll({
      where: { isDelete: false, LectureNoticeId: parseInt(LectureNoticeId) },
    });

    const nextHit = detailData[0][0].noticeHit;

    await LectureNotice.update(
      {
        hit: nextHit + 1,
      },
      {
        where: { id: parseInt(LectureNoticeId) },
      }
    );

    return res.status(200).json({
      detailData: detailData[0][0],
      comments: comments[0],
      commentsLen: commentsLen.length,
    });
  } catch (error) {
    console.error(error);
    return res.status(401).send("강의실 게시판 목록을 불러올 수 없습니다.");
  }
});

router.post("/create", isLoggedIn, async (req, res, next) => {
  const { title, content, author, level, LectureId, receiverId, file } =
    req.body;

  if (!req.user) {
    return res.status(403).send("로그인 후 이용 가능합니다.");
  }

  if (req.user.level > 3) {
    return res.status(401).send("관리자는 게시글을 작성할 수 없습니다.");
  }

  if (!Array.isArray(receiverId)) {
    return res.status(401).send("잘못된 요청입니다.");
  }

  try {
    const exLecture = await Lecture.findOne({
      where: { id: parseInt(LectureId) },
    });

    if (!exLecture) {
      return res.status(401).send("존재하지 않는 강의 입니다.");
    }

    if (exLecture.isDelete) {
      return res
        .status(401)
        .send("삭제된 강의입니다. 확인 후 다시 시도하여 주십시오.");
    }

    const createResult = await LectureNotice.create({
      title,
      content,
      author,
      level,
      file,
      LectureId: parseInt(LectureId),
      UserId: parseInt(req.user.id),
    });

    if (!createResult) {
      return res.status(401).send("처리중 문제가 발생하였습니다.");
    }

    // 받을사람 ID를 배열로 보내주시면 됩니다 -> receiverId
    await Promise.all(
      receiverId.map(async (data) => {
        await LectureConnect.create({
          UserId: parseInt(data),
          LectureNoticeId: parseInt(createResult.id),
        });
      })
    );

    return res.status(201).json({ result: true });
  } catch (error) {
    console.error(error);
    return res.status(401).send("게시글을 등록할 수 없습니다.");
  }
});

router.patch("/update", isLoggedIn, async (req, res, next) => {
  const { id, title, content, file } = req.body;

  if (!req.user) {
    return res.status(403).send("로그인 후 이용 가능합니다.");
  }

  try {
    const exLecture = await LectureNotice.findOne({
      where: { id: parseInt(id) },
    });

    if (!exLecture) {
      return res.status(401).send("존재하지 않는 강의 게시글입니다.");
    }

    if (exLecture.isDelete) {
      return res
        .status(401)
        .send("삭제된 강의 게시글입니다. 확인 후 다시 시도하여 주십시오.");
    }

    if (exLecture.UserId !== req.user.id) {
      return res.status(401).send("자신이 작성한 게시글만 수정할 수 있습니다.");
    }

    const updateResult = await LectureNotice.update(
      {
        title,
        content,
        file,
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
    return res.status(401).send("게시글을 수정할 수 없습니다.");
  }
});

router.patch("/delete", isLoggedIn, async (req, res, next) => {
  const { id } = req.body;

  if (!req.user) {
    return res.status(403).send("로그인 후 이용 가능합니다.");
  }

  try {
    const exLectureNotice = await LectureNotice.findOne({
      where: { id: parseInt(id) },
    });

    if (!exLectureNotice) {
      return res.status(401).send("존재하지 않는 강의 게시글 입니다.");
    }

    if (exLectureNotice.isDelete) {
      return res
        .status(401)
        .send("삭제된 강의 게시글 입니다. 확인 후 다시 시도하여 주십시오.");
    }

    if (exLectureNotice.UserId !== req.user.id) {
      return res.status(401).send("자신이 작성한 게시글만 삭제할 수 있습니다.");
    }

    const deleteResult = await LectureNotice.update(
      {
        isDelete: true,
        deletedAt: new Date(),
      },
      {
        where: { id: parseInt(id) },
      }
    );

    if (deleteResult[0] > 0) {
      return res.status(200).json({ result: true });
    } else {
      return res.status(200).json({ result: false });
    }
  } catch (error) {
    console.error(error);
    return res.status(401).send("게시글을 삭제할 수 없습니다.");
  }
});

///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
////////////////////////////// - COMMENT - ////////////////////////////////
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////

router.post("/comment/detail", async (req, res, next) => {
  const { commentId, lectureNoticeId } = req.body;

  // if (!req.user) {
  //   return res.status(403).send("로그인 후 이용 가능합니다.");
  // }

  try {
    const selectQuery = `
    SELECT	*
      FROM	(
          WITH RECURSIVE comments_hire AS (
            SELECT	1				AS	lev,
                    id,
                    content,
                    parent,
                    parentId,
                    createdAt,
                    LectureNoticeId,
                    isDelete,
                    grantparentId,
                    UserId,
                    name,
                    level,
                    name		as paths
              FROM	lectureNoticeComments 		
             WHERE	isDelete = 0
               AND	LectureNoticeId = ${lectureNoticeId}
               AND 	id = ${commentId}
             UNION	ALL
            SELECT	B.lev + 1			AS 	lev,
                    A.id,
                    CONCAT(LPAD('', 2 * (B.lev) ,' '), 'ㄴ', A.content),
                    A.parent,
                    A.parentId,
                    A.createdAt,
                    A.LectureNoticeId,
                    A.isDelete,
                    A.grantparentId,
                    A.UserId,
                    A.name,
                    A.level,
                    CONCAT(B.paths, A.id,'-', A.name, A.id)	AS paths
              FROM	lectureNoticeComments		AS 	A
             INNER
              JOIN	comments_hire		    AS	B
                ON	A.parentId = B.id
          ) 
          SELECT * FROM comments_hire
        )	X
    ORDER	BY X.paths;
        `;

    const list = await models.sequelize.query(selectQuery);

    return res.status(200).json({ list: list[0] });
  } catch (error) {
    console.error(error);
    return res.status(401).send("댓글 정보를 불러올 수 없습니다.");
  }
});

router.post("/comment/create", isLoggedIn, async (req, res, next) => {
  const { content, lectureNoticeId, parentId, grantparentId } = req.body;

  if (!req.user) {
    return res.status(403).send("Please log in");
  }

  try {
    const exLectureNotice = await LectureNotice.findOne({
      where: { id: parseInt(lectureNoticeId), isDelete: false },
    });

    if (!exLectureNotice) {
      return res.status(401).send("존재하지 않는 게시글입니다.");
    }

    let dataJson = {};

    if (parentId !== null) {
      dataJson = await LectureNoticeComment.findOne({
        where: { id: parseInt(parentId) },
      });

      if (!dataJson) {
        return res.status(401).send("잠시후 다시 시도하여 주십시오.");
      }
    }

    let dataJson2 = {};

    if (grantparentId !== null) {
      dataJson2 = await LectureNoticeComment.findOne({
        where: { id: parseInt(grantparentId) },
      });

      if (!dataJson2) {
        return res.status(401).send("잠시후 다시 시도하여 주십시오.");
      }
    }

    const createResult = await LectureNoticeComment.create({
      content,
      parent: parentId === null ? 0 : parseInt(dataJson.parent) + 1,
      parentId: parentId ? parentId : null,
      grantparentId: grantparentId ? grantparentId : null,
      LectureNoticeId: parseInt(lectureNoticeId),
      UserId: parseInt(req.user.id),
      name: req.user.username,
      level: parseInt(req.user.level),
    });

    if (!createResult) {
      return res.status(401).send("처리중 문제가 발생하였습니다.");
    }

    return res.status(201).json({ result: true });
  } catch (error) {
    console.error(error);
    return res.status(401).send("댓글을 작성할 수 없습니다.");
  }
});

router.post("/comment/update", isLoggedIn, async (req, res, next) => {
  const { id, content } = req.body;

  if (!req.user) {
    return res.status(403).send("로그인 후 이용 가능합니다.");
  }

  try {
    const exLectureNoticeCom = await LectureNoticeComment.findOne({
      where: { id: parseInt(id), isDelete: false },
    });

    if (!exLectureNoticeCom) {
      return res.status(401).send("존재하지 않는 게시글입니다.");
    }

    if (exLectureNoticeCom.UserId !== req.user.id) {
      return res.status(401).send("자신의 댓글만 수정할 수 있습니다.");
    }

    const updateResult = await LectureNoticeComment.update(
      {
        content,
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
    return res.status(401).send("댓글을 수정할 수 없습니다.");
  }
});

router.delete(
  "/comment/delete/:commentId",
  isLoggedIn,
  async (req, res, next) => {
    const { commentId } = req.params;

    if (!req.user) {
      return res.status(403).send("로그인 후 이용 가능합니다.");
    }

    if (isNanCheck(commentId)) {
      return res.status(401).send("잘못된 요청입니다.");
    }

    try {
      const exLectureNoticeCom = await LectureNoticeComment.findOne({
        where: { id: parseInt(commentId), isDelete: false },
      });

      if (!exLectureNoticeCom) {
        return res.status(401).send("존재하지 않는 댓글입니다.");
      }

      if (exLectureNoticeCom.UserId !== req.user.id) {
        return res.status(401).send("자신의 댓글만 삭제할 수 있습니다.");
      }

      const deleteResult = await LectureNoticeComment.update(
        {
          isDelete: true,
          deletedAt: new Date(),
        },
        {
          where: { id: parseInt(commentId) },
        }
      );

      if (deleteResult[0] > 0) {
        return res.status(200).json({ result: true });
      } else {
        return res.status(200).json({ result: false });
      }
    } catch (error) {
      console.error(error);
      return res.status(401).send("댓글을 삭제할 수 없습니다.");
    }
  }
);

module.exports = router;
