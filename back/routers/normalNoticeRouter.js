const express = require("express");
const isLoggedIn = require("../middlewares/isLoggedIn");
const { NormalNotice, NormalNoticeComment, User } = require("../models");
const models = require("../models");
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const AWS = require("aws-sdk");
const multerS3 = require("multer-s3");
const isNanCheck = require("../middlewares/isNanCheck");
const isAdminCheck = require("../middlewares/isAdminCheck");

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

router.post("/list", isLoggedIn, async (req, res, next) => {
  const { page } = req.body;

  if (!req.user) {
    return res.status(403).send("로그인 후 이용 가능합니다.");
  }

  const LIMIT = 5;

  const _page = page ? page : 1;

  const __page = _page - 1;
  const OFFSET = __page * 5;

  try {
    const lengthQuery = `
    SELECT	id,
            title,
            content,
            author,
            level,
            receiverId,
            isAdmin,
            file,
            isDelete,
            DATE_FORMAT(deletedAt, '%Y-%m-%d')  AS deletedAt,
            DATE_FORMAT(createdAt, '%Y-%m-%d')  AS createdAt,
            DATE_FORMAT(updatedAt, '%Y-%m-%d')  AS updatedAt,
            UserId
    FROM	normalNotices
   WHERE    receiverId = ${req.user.id}
    `;

    const selectQuery = `
    SELECT	id,
            title,
            content,
            author,
            level,
            receiverId,
            isAdmin,
            file,
            isDelete,
            DATE_FORMAT(deletedAt, '%Y-%m-%d')  AS deletedAt,
            DATE_FORMAT(createdAt, '%Y-%m-%d')  AS createdAt,
            DATE_FORMAT(updatedAt, '%Y-%m-%d')  AS updatedAt,
            UserId
    FROM	normalNotices
   WHERE    receiverId = ${req.user.id}
   ORDER    BY createdAt DESC
   LIMIT    ${LIMIT}
  OFFSET    ${OFFSET}
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
    return res.status(401).send("게시글 목록을 불러올 수 없습니다.");
  }
});

router.post("/admin/list", isAdminCheck, async (req, res, next) => {
  if (!req.user) {
    return res.status(403).send("로그인 후 이용 가능합니다.");
  }

  try {
    const selectQuery = `
    SELECT	id,
            title,
            content,
            author,
            level,
            receiverId,
            isAdmin,
            file,
            isDelete,
            DATE_FORMAT(deletedAt, '%Y-%m-%d')  AS deletedAt,
            DATE_FORMAT(createdAt, '%Y-%m-%d')  AS createdAt,
            DATE_FORMAT(updatedAt, '%Y-%m-%d')  AS updatedAt,
            UserId
    FROM	normalNotices
   WHERE    isAdmin = TRUE
   ORDER    BY createdAt DESC
    `;

    const notice = await models.sequelize.query(selectQuery);

    return res.status(200).json({ notice: notice[0] });
  } catch (error) {
    console.error(error);
    return res.status(401).send("게시글 목록을 불러올 수 없습니다.");
  }
});

router.post("/detail", isLoggedIn, async (req, res, next) => {
  const { NormalNoticeId } = req.body;

  if (!req.user) {
    return res.status(403).send("로그인 후 이용 가능합니다.");
  }

  try {
    const exNormal = await NormalNotice.findOne({
      where: { id: parseInt(NormalNoticeId) },
    });

    if (!exNormal) {
      return res.status(401).send("존재하지 않는 게시글 입니다.");
    }

    if (exNormal.isDelete) {
      return res
        .status(401)
        .send("삭제된 게시글입니다. 확인 후 다시 시도하여 주십시오.");
    }

    const detailQuery = `
    SELECT	id,
            title,
            content,
            author,
            level,
            receiverId,
            isAdmin,
            file,
            hit,
            isDelete,
            DATE_FORMAT(deletedAt, '%Y-%m-%d')  AS deletedAt,
            DATE_FORMAT(createdAt, '%Y-%m-%d')  AS createdAt,
            DATE_FORMAT(updatedAt, '%Y-%m-%d')  AS updatedAt,
            UserId
    FROM	normalNotices
   WHERE    id = ${NormalNoticeId}
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
            A.NormalNoticeId,
            A.grantparentId,
            A.UserId,
            A.name,
            A.level,
            (
              SELECT	COUNT(nc.id)
                FROM	normalNoticeComments	nc
               WHERE	nc.grantparentId = A.id
                 AND    nc.isDelete = FALSE
            )   AS commentCnt
      FROM	normalNoticeComments		A
     WHERE	A.isDelete = FALSE
       AND	A.parentId  IS NULL
       AND  A.NormalNoticeId = ${NormalNoticeId}
     ORDER  BY A.createdAt DESC
    `;

    const comments = await models.sequelize.query(commentQuery);

    const commentsLen = await NormalNoticeComment.findAll({
      where: { isDelete: false, NormalNoticeId: parseInt(NormalNoticeId) },
    });

    const nextHit = detailData[0][0].hit;

    await NormalNotice.update(
      {
        hit: nextHit + 1,
      },
      {
        where: { id: parseInt(NormalNoticeId) },
      }
    );

    return res.status(200).json({
      detailData: detailData[0][0],
      comments: comments[0],
      commentsLen: commentsLen.length,
    });
  } catch (error) {
    console.error(error);
    return res.status(401).send("게시글 정보를 불러올 수 없습니다.");
  }
});

// 학생이 관리자한테 글 작성
router.post("/student/create", isLoggedIn, async (req, res, next) => {
  const { title, content, author, file } = req.body;

  if (!req.user) {
    return res.status(403).send("로그인 후 이용 가능합니다.");
  }

  try {
    const createResult = await NormalNotice.create({
      title,
      content,
      author,
      level: parseInt(req.user.level),
      receiverId: null,
      isAdmin: true,
      file,
      UserId: parseInt(req.user.id),
    });

    if (!createResult) {
      return res.status(401).send("처리중 문제가 발생하였습니다.");
    }

    return res.status(201).json({ result: true });
  } catch (error) {
    console.error(error);
    return res.status(401).send("게시글을 작성할 수 없습니다.");
  }
});

router.post("/teacher/create", isLoggedIn, async (req, res, next) => {
  const { title, content, author, file, receiverId, createType } = req.body;

  if (!req.user) {
    return res.status(403).send("로그인 후 이용 가능합니다.");
  }

  if (parseInt(createType) > 3) {
    return res.status(401).send("잘못된 요청입니다.");
  }

  try {
    // 강사가 강사 전체에게
    if (parseInt(createType) === 1) {
      const teacherList = await User.findAll({
        where: { level: 2, isFire: false },
      });

      if (teacherList.length === 0) {
        return res.status(401).send("강사가 존재하지 않습니다.");
      }

      await Promise.all(
        teacherList.map(async (data) => {
          await NormalNotice.create({
            title,
            content,
            author,
            file,
            receiverId: parseInt(data.id),
            isAdmin: false,
            UserId: parseInt(req.user.id),
          });
        })
      );

      return res.status(201).json({ result: true });
    }

    if (parseInt(createType) === 2) {
      const createResult = await NormalNotice.create({
        title,
        content,
        author,
        level: parseInt(req.user.level),
        receiverId: null,
        isAdmin: true,
        file,
        UserId: parseInt(req.user.id),
      });

      if (!createResult) {
        return res.status(401).send("처리중 문제가 발생하였습니다.");
      }

      return res.status(201).json({ result: true });
    }

    // 강사가 강사 개인에게
    if (parseInt(createType) === 3) {
      const exUser = await User.findOne({
        where: { id: parseInt(receiverId), isFire: false, level: 2 },
      });

      if (!exUser) {
        return res
          .status(401)
          .send(
            "강사 정보가 존재하지 않습니다. 확인 후 다시 시도하여 주십시오."
          );
      }

      const createResult = await NormalNotice.create({
        title,
        content,
        author,
        level: parseInt(req.user.level),
        receiverId: parseInt(receiverId),
        isAdmin: false,
        file,
        UserId: parseInt(req.user.id),
      });

      if (!createResult) {
        return res.status(401).send("처리중 문제가 발생하였습니다.");
      }

      return res.status(201).json({ result: true });
    }
  } catch (error) {
    console.error(error);
    return res.status(401).send("게시글을 작성할 수 없습니다.");
  }
});

router.post("/admin/create", isAdminCheck, async (req, res, next) => {
  const { title, content, author, level, file, receiverId, createType } =
    req.body;

  if (!req.user) {
    return res.status(403).send("로그인 후 이용 가능합니다.");
  }

  if (parseInt(createType) > 4) {
    return res.status(401).send("잘못된 요청입니다.");
  }

  // createType === 1 강사전체
  //                2 학생 전체
  //                3 강사 & 학생 전체
  //                4 한명에게 보내기

  try {
    // 관리자가 학생 전체에게 작성
    if (parseInt(createType) === 1) {
      const teacherList = await User.findAll({
        where: { level: 2, isFire: false },
      });

      if (teacherList.length === 0) {
        return res.status(401).send("강사가 존재하지 않습니다.");
      }

      await Promise.all(
        teacherList.map(async (data) => {
          await NormalNotice.create({
            title,
            content,
            author,
            level,
            file,
            receiverId: parseInt(data.id),
            UserId: parseInt(req.user.id),
          });
        })
      );

      return res.status(201).json({ result: true });
    }

    if (parseInt(createType) === 2) {
      const allStudents = await User.findAll({
        where: { level: 1 },
      });

      if (allStudents.length === 0) {
        return res.status(401).send("학생이 존재하지 않습니다.");
      }

      await Promise.all(
        allStudents.map(async (data) => {
          await NormalNotice.create({
            title,
            content,
            author,
            level,
            file,
            receiverId: parseInt(data.id),
            UserId: parseInt(req.user.id),
          });
        })
      );

      return res.status(201).json({ result: true });
    }

    if (parseInt(createType) === 3) {
      const selectQuery = `
      SELECT	*
        FROM	users
       WHERE	level IN (1,2)
         AND	isFire  = FALSE
        `;

      const allUserList = await models.sequelize.query(selectQuery);

      if (allUserList[0].length === 0) {
        return res
          .status(401)
          .send("정보가 존재하지 않습니다. 확인 후 다시 시도하여 주십시오.");
      }

      await Promise.all(
        allUserList[0].map(async (data) => {
          await NormalNotice.create({
            title,
            content,
            author,
            level,
            file,
            receiverId: parseInt(data.id),
            UserId: parseInt(req.user.id),
          });
        })
      );

      return res.status(201).json({ result: true });
    }

    if (parseInt(createType) === 4) {
      const createResult = await NormalNotice.create({
        title,
        content,
        author,
        level,
        file,
        receiverId: parseInt(receiverId),
        isAdmin: false,
      });

      if (!createResult) {
        return res.status(401).send("처리중 문제가 발생하였습니다.");
      }

      return res.status(201).json({ result: true });
    }
  } catch (error) {
    console.error(error);
    return res.status(401).send("게시글을 작성할 수 없습니다.");
  }
});

router.patch("/update", isLoggedIn, async (req, res, next) => {
  const { id, title, content, file } = req.body;

  if (!req.user) {
    return res.status(403).send("로그인 후 이용 가능합니다.");
  }

  try {
    const exNoramlNotice = await NormalNotice.findOne({
      where: { id: parseInt(id) },
    });

    if (!exNoramlNotice) {
      return res.status(401).send("존재하지 않는 게시글입니다.");
    }

    if (exNoramlNotice.isDelete) {
      return res
        .status(401)
        .send("삭제된 게시글입니다. 확인 후 다시 시도하여 주십시오.");
    }

    if (exNoramlNotice.UserId !== req.user.id) {
      return res.status(401).send("자신이 작성한 게시글만 수정할 수 있습니다.");
    }

    const updateResult = await NormalNotice.update(
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
    const exNormalNotice = await NorexNormalNotice.findOne({
      where: { id: parseInt(id) },
    });

    if (!exNormalNotice) {
      return res.status(401).send("존재하지 않는 게시글 입니다.");
    }

    if (exNormalNotice.isDelete) {
      return res
        .status(401)
        .send("삭제된 게시글 입니다. 확인 후 다시 시도하여 주십시오.");
    }

    if (exNormalNotice.UserId !== req.user.id) {
      return res.status(401).send("자신이 작성한 게시글만 삭제할 수 있습니다.");
    }

    const deleteResult = await NorexNormalNotice.update(
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
  const { commentId, normalNoticeId } = req.body;

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
                        NormalNoticeId,
                        isDelete,
                        grantparentId,
                        UserId,
                        name,
                        level,
                        name		as paths
                FROM	normalNoticeComments 		
               WHERE	isDelete = 0
                 AND	NormalNoticeId = ${normalNoticeId}
                 AND 	id = ${commentId}
               UNION	ALL
              SELECT	B.lev + 1			AS 	lev,
                        A.id,
                        CONCAT(LPAD('', 2 * (B.lev) ,' '), 'ㄴ', A.content),
                        A.parent,
                        A.parentId,
                        A.createdAt,
                        A.NormalNoticeId,
                        A.isDelete,
                        A.grantparentId,
                        A.UserId,
                        A.name,
                        A.level,
                        CONCAT(B.paths, A.id,'-', A.name, A.id)	AS paths
                FROM	normalNoticeComments		AS 	A
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
  const { content, normalNoticeId, parentId, grantparentId } = req.body;

  if (!req.user) {
    return res.status(403).send("Please log in");
  }

  try {
    const exNormalNotice = await NormalNotice.findOne({
      where: { id: parseInt(normalNoticeId), isDelete: false },
    });

    if (!exNormalNotice) {
      return res.status(401).send("존재하지 않는 게시글입니다.");
    }

    let dataJson = {};

    if (parentId !== null) {
      dataJson = await NormalNoticeComment.findOne({
        where: { id: parseInt(parentId) },
      });

      if (!dataJson) {
        return res.status(401).send("잠시후 다시 시도하여 주십시오.");
      }
    }

    let dataJson2 = {};

    if (grantparentId !== null) {
      dataJson2 = await NormalNoticeComment.findOne({
        where: { id: parseInt(grantparentId) },
      });

      if (!dataJson2) {
        return res.status(401).send("잠시후 다시 시도하여 주십시오.");
      }
    }

    const createResult = await NormalNoticeComment.create({
      content,
      parent: parentId === null ? 0 : parseInt(dataJson.parent) + 1,
      parentId: parentId ? parentId : null,
      grantparentId: grantparentId ? grantparentId : null,
      NormalNoticeId: parseInt(normalNoticeId),
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
    const exNormalNoticeCom = await NormalNoticeComment.findOne({
      where: { id: parseInt(id), isDelete: false },
    });

    if (!exNormalNoticeCom) {
      return res.status(401).send("존재하지 않는 게시글입니다.");
    }

    if (exNormalNoticeCom.UserId !== req.user.id) {
      return res.status(401).send("자신의 댓글만 수정할 수 있습니다.");
    }

    const updateResult = await NormalNoticeComment.update(
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
      const exNormalNoticeCom = await NormalNoticeComment.findOne({
        where: { id: parseInt(commentId), isDelete: false },
      });

      if (!exNormalNoticeCom) {
        return res.status(401).send("존재하지 않는 댓글입니다.");
      }

      if (exNormalNoticeCom.UserId !== req.user.id) {
        return res.status(401).send("자신의 댓글만 삭제할 수 있습니다.");
      }

      const deleteResult = await NormalNoticeComment.update(
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
