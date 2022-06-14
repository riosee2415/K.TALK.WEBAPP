const express = require("express");
const isAdminCheck = require("../middlewares/isAdminCheck");
const isLoggedIn = require("../middlewares/isLoggedIn");
const { CommunityType, Community, CommunityComment } = require("../models");
const models = require("../models");
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const AWS = require("aws-sdk");
const multerS3 = require("multer-s3");
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

router.post("/file", upload.single("file"), async (req, res, next) => {
  return res.json({ path: req.file.location });
});

///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
/////////////////////////////// - TYPE - //////////////////////////////////
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////

router.get("/type/list", async (req, res, next) => {
  try {
    const selectQuery = `
    SELECT	id,
            value,
            isDelete,
            DATE_FORMAT(createdAt, "%Y-%m-%d")		AS createdAt,
            DATE_FORMAT(updatedAt, "%Y-%m-%d") 		AS updatedAt
    FROM	communityTypes
      `;

    const list = await models.sequelize.query(selectQuery);

    return res.status(200).json({ types: list[0] });
  } catch (error) {
    console.error(error);
    return res.status(401).send("게시글 유형 목록을 불러올 수 없습니다.");
  }
});

router.post("/type/create", isAdminCheck, async (req, res, next) => {
  const { value } = req.body;
  try {
    const exType = await CommunityType.findOne({
      where: { value, isDelete: false },
    });

    if (exType) {
      return res.status(401).send("똑같은 이름의 게시글 유형이 존재합니다.");
    }

    const createResult = await CommunityType.create({
      value,
    });

    if (!createResult) {
      return res.status(401).send("처리중 문제가 발생하였습니다.");
    }

    return res.status(201).json({ result: true });
  } catch (error) {
    console.error(error);
    return res.status(401).send("게시글 유형을 등록할 수 없습니다.");
  }
});

router.patch("/type/update", isAdminCheck, async (req, res, next) => {
  const { id, value } = req.body;
  try {
    const exType = await CommunityType.findOne({
      where: { id: parseInt(id), isDelete: false },
    });

    if (!exType) {
      return res.status(401).send("존재하지 않는 게시글 유형입니다.");
    }

    const updateResult = await CommunityType.update(
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
    return res.status(401).send("게시글 유형을 수정할 수 없습니다.");
  }
});

router.delete("/type/delete/:typeId", isAdminCheck, async (req, res, next) => {
  const { typeId } = req.params;
  try {
    const exType = await CommunityType.findOne({
      where: { id: parseInt(typeId), isDelete: false },
    });

    if (!exType) {
      return res.status(401).send("존재하지 않는 게시글 유형입니다.");
    }

    const deleteResult = await CommunityType.update(
      {
        isDelete: true,
      },
      {
        where: { id: parseInt(typeId) },
      }
    );

    if (deleteResult[0] > 0) {
      return res.status(200).json({ result: true });
    } else {
      return res.status(200).json({ result: false });
    }
  } catch (error) {
    console.error(error);
    return res.status(401).send("게시글 유형을 삭제할 수 없습니다.");
  }
});

///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
///////////////////////////// - COMMUNITY - ///////////////////////////////
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////

router.post("/list", async (req, res, next) => {
  const { searchTitle, searchName, level, typeId, page } = req.body;

  // if (!req.user) {
  //   return res.status(403).send("로그인 후 이용 가능합니다.");
  // }

  const LIMIT = 10;

  const _page = page ? page : 1;

  const __page = _page - 1;
  const OFFSET = __page * 10;

  const _searchTitle = searchTitle ? searchTitle : ``;
  const _searchName = searchName ? searchName : ``;

  const _level = level ? level : ``;

  const _typeId = typeId || null;

  try {
    const lengthQuery = `
    SELECT	A.id,
            A.title,
            A.content,
            A.file,
            A.hit,
            A.isDelete,
            DATE_FORMAT(A.deletedAt, "%Y-%m-%d")		AS deletedAt,
            DATE_FORMAT(A.createdAt, "%Y-%m-%d")		AS createdAt,
            DATE_FORMAT(A.updatedAt, "%Y-%m-%d") 		AS updatedAt,
            A.CommunityTypeId,
            A.UserId,
            B.value,
            C.userId,
            C.profileImage,
            C.username,
            C.level,
            (
            	SELECT  COUNT(id)
            	  FROM  communityComments cc
            	 WHERE  cc.CommunityId = A.id
            	   AND	cc.isDelete = FALSE
            )                                       AS commentCnt
    FROM	communitys					A
   INNER		
    JOIN	communityTypes				B
      ON	A.CommunityTypeId = B.id
   INNER
    JOIN	users						C
      ON	A.UserId = C.id
   WHERE    1 = 1
     AND    A.isDelete = FALSE
     AND    B.isDelete = FALSE
     ${_searchTitle !== `` ? `AND A.title LIKE '%${_searchTitle}%'` : ``}
     ${_searchName !== `` ? `AND C.username LIKE '%${_searchName}%'` : ``}
     ${_level !== `` ? `AND C.level = ${_level}` : ``}
     ${_level !== `` ? `AND C.level = ${_level}` : ``}
     ${_typeId ? `AND A.CommunityTypeId = ${_typeId}` : ``}
    `;

    const selectQuery = `
    SELECT	A.id,
            A.title,
            A.content,
            A.file,
            A.hit,
            A.isDelete,
            DATE_FORMAT(A.deletedAt, "%Y-%m-%d")		AS deletedAt,
            DATE_FORMAT(A.createdAt, "%Y-%m-%d")		AS createdAt,
            DATE_FORMAT(A.updatedAt, "%Y-%m-%d") 		AS updatedAt,
            A.CommunityTypeId,
            A.UserId,
            B.value,
            C.userId,
            C.profileImage,
            C.username,
            C.level,
            (
            	SELECT  COUNT(id)
            	  FROM  communityComments cc
            	 WHERE  cc.CommunityId = A.id
            	   AND	cc.isDelete = FALSE
            )                                       AS commentCnt
    FROM	communitys					A
   INNER		
    JOIN	communityTypes				B
      ON	A.CommunityTypeId = B.id
   INNER
    JOIN	users						C
      ON	A.UserId = C.id
   WHERE    1 = 1
     AND    A.isDelete = FALSE
     AND    B.isDelete = FALSE
    ${_searchTitle !== `` ? `AND A.title LIKE '%${_searchTitle}%'` : ``}
    ${_searchName !== `` ? `AND C.username LIKE '%${_searchName}%'` : ``}
    ${_level !== `` ? `AND C.level = ${_level}` : ``}
    ${_level !== `` ? `AND C.level = ${_level}` : ``}
    ${_typeId ? `AND A.CommunityTypeId = ${_typeId}` : ``} 
   ORDER    BY A.createdAt DESC
   LIMIT    ${LIMIT}
  OFFSET    ${OFFSET}
    `;

    const length = await models.sequelize.query(lengthQuery);
    const community = await models.sequelize.query(selectQuery);

    const communitylen = length[0].length;

    const lastPage =
      communitylen % LIMIT > 0
        ? communitylen / LIMIT + 1
        : communitylen / LIMIT;

    return res
      .status(200)
      .json({ community: community[0], lastPage: parseInt(lastPage) });
  } catch (error) {
    console.error(error);
    return res.status(401).send("게시글 목록을 불러올 수 없습니다.");
  }
});

router.get("/detail/:communityId", async (req, res, next) => {
  const { communityId } = req.params;

  if (isNanCheck(communityId)) {
    return res.status(401).send("잘못된 요청입니다.");
  }

  try {
    const selectQuery = `
  SELECT	A.id,
            A.title,
            A.content,
            A.file,
            A.hit,
            A.isDelete,
            DATE_FORMAT(A.deletedAt, "%Y-%m-%d")		AS deletedAt,
            DATE_FORMAT(A.createdAt, "%Y-%m-%d")		AS createdAt,
            DATE_FORMAT(A.updatedAt, "%Y-%m-%d") 		AS updatedAt,
            A.CommunityTypeId,
            A.UserId,
            B.value,
            C.userId,
            C.profileImage,
            C.username,
            C.level
    FROM	communitys					  A
   INNER		
    JOIN	communityTypes				B
      ON	A.CommunityTypeId = B.id
   INNER
    JOIN	users						      C
      ON	A.UserId = C.id
   WHERE    1 = 1
     AND    A.isDelete = FALSE
     AND    B.isDelete = FALSE
     AND    A.id = ${communityId}
    `;

    const detailData = await models.sequelize.query(selectQuery);

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
            A.CommunityId,
            A.grantparentId,
            A.UserId,
            B.userId,
            B.profileImage,
            B.username,
            B.level,
            (
              SELECT	COUNT(cc.id)
                FROM	communityComments	cc
               WHERE	cc.grantparentId = A.id
            )   AS commentCnt
      FROM	communityComments		A
     INNER
      JOIN	users 					B
        ON	A.UserId = B.id
     WHERE	A.isDelete = FALSE
       AND	A.parentId  IS NULL
       AND  A.CommunityId = ${communityId}
     ORDER  BY A.createdAt DESC
    `;

    const comments = await models.sequelize.query(commentQuery);

    const commentsLen = await CommunityComment.findAll({
      where: { isDelete: false, CommunityId: parseInt(communityId) },
    });

    const nextHit = detailData[0].hit;

    await Community.update(
      {
        hit: nextHit + 1,
      },
      {
        where: { id: parseInt(communityId) },
      }
    );

    return res.status(200).json({
      detailData: detailData[0][0],
      comments: comments[0],
      commentsLen: commentsLen.length,
    });
  } catch (error) {
    console.error(error);
    return res.status(401).send("게시글 상세정보를 불러올 수 없습니다.");
  }
});

router.post("/create", isLoggedIn, async (req, res, next) => {
  const { title, content, file, type } = req.body;

  if (!req.user) {
    return res.status(403).send("Please log in");
  }

  try {
    const exType = await CommunityType.findOne({
      where: { id: parseInt(type), isDelete: false },
    });

    if (!exType) {
      return res.status(401).send("존재하지 않는 게시글 유형입니다.");
    }

    const createResult = await Community.create({
      title,
      content,
      file,
      CommunityTypeId: parseInt(type),
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

router.patch("/update", isLoggedIn, async (req, res, next) => {
  const { id, title, content, file, type } = req.body;

  if (!req.user) {
    return res.status(403).send("로그인 후 이용 가능합니다.");
  }

  try {
    const exCommunity = await Community.findOne({
      where: { id: parseInt(id), isDelete: false },
    });

    if (!exCommunity) {
      return res.status(401).send("존재하지 않는 게시글입니다.");
    }

    if (req.user.level > 3) {
      const updateResult = await Community.update(
        {
          title,
          content,
          file,
          CommunityTypeId: parseInt(type),
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
    }

    if (req.user.level < 3) {
      if (exCommunity.UserId !== req.user.id) {
        return res.status(401).send("자신의 게시글만 수정할 수 있습니다.");
      }

      const updateResult = await Community.update(
        {
          title,
          content,
          file,
          CommunityTypeId: parseInt(type),
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
    }
  } catch (error) {
    console.error(error);
    return res.status(401).send("게시글을 수정할 수 없습니다.");
  }
});

router.delete("/delete/:communityId", isLoggedIn, async (req, res, next) => {
  const { communityId } = req.params;

  if (!req.user) {
    return res.status(403).send("로그인 후 이용 가능합니다.");
  }

  if (isNanCheck(communityId)) {
    return res.status(401).send("잘못된 요청입니다.");
  }

  try {
    const exCommunity = await Community.findOne({
      where: { id: parseInt(communityId), isDelete: false },
    });

    if (!exCommunity) {
      return res.status(401).send("존재하지 않는 게시글입니다.");
    }

    if (req.user.level > 3) {
      const deleteResult = await Community.update(
        {
          isDelete: true,
          deletedAt: new Date(),
        },
        {
          where: { id: parseInt(communityId) },
        }
      );

      if (deleteResult[0] > 0) {
        return res.status(200).json({ result: true });
      } else {
        return res.status(200).json({ result: false });
      }
    }

    if (req.user.level < 3) {
      if (exCommunity.UserId !== req.user.id) {
        return res.status(401).send("자신의 게시글만 삭제할 수 있습니다.");
      }

      const deleteResult = await Community.update(
        {
          isDelete: true,
          deletedAt: new Date(),
        },
        {
          where: { id: parseInt(communityId) },
        }
      );

      if (deleteResult[0] > 0) {
        return res.status(200).json({ result: true });
      } else {
        return res.status(200).json({ result: false });
      }
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
  const { commentId, communityId } = req.body;

  // if (!req.user) {
  //   return res.status(403).send("로그인 후 이용 가능합니다.");
  // }

  try {
    const selectQuery = `
    SELECT	*
      FROM	(
              WITH RECURSIVE comments_hire AS (
                SELECT	1				AS	lev,
                        CC.id,
                        CC.content,
                        CC.parent,
                        CC.parentId,
                        CC.createdAt,
                        CC.CommunityId,
                        CC.isDelete,
                        CC.grantparentId,
                        US.id			AS idOfUser,
                        US.userId,
                        US.profileImage,
                        US.username,
                        US.level,
                        US.username		as paths
                  FROM	communityComments		CC
                 INNER
                  JOIN	users					US
                    ON	CC.UserId = US.id 
                 WHERE	CC.isDelete = 0
                   AND	CC.CommunityId = ${communityId}
                   AND 	CC.id = ${commentId}
                 UNION	ALL
                SELECT	B.lev + 1			AS 	lev,
                        A.id,
                        CONCAT(LPAD('', 2 * (B.lev) ,' '), 'ㄴ', A.content),
                        A.parent,
                        A.parentId,
                        A.createdAt,
                        A.CommunityId,
                        A.isDelete,
                        A.grantparentId,
                        B.idOfUser,
                        B.userId,
                        B.profileImage,
                        B.username,
                        B.level,
                        CONCAT(B.paths, A.id,'-', 	B.username, A.id)	AS paths
                  FROM	communityComments		AS 	A
                 INNER
                  JOIN	comments_hire		AS	B
                    ON	A.parentId = B.id
            ) 
          SELECT * FROM comments_hire
        )	X
      ORDER	BY X.paths
      `;

    const list = await models.sequelize.query(selectQuery);

    return res.status(200).json({ list: list[0] });
  } catch (error) {
    console.error(error);
    return res.status(401).send("댓글 정보를 불러올 수 없습니다.");
  }
});

router.post("/comment/create", isLoggedIn, async (req, res, next) => {
  const { content, communityId, parentId, grantparentId } = req.body;

  if (!req.user) {
    return res.status(403).send("Please log in");
  }

  try {
    const exCommunity = await Community.findOne({
      where: { id: parseInt(communityId), isDelete: false },
    });

    if (!exCommunity) {
      return res.status(401).send("존재하지 않는 게시글입니다.");
    }

    let dataJson = {};

    if (parentId !== null) {
      dataJson = await CommunityComment.findOne({
        where: { id: parseInt(parentId) },
      });

      if (!dataJson) {
        return res.status(401).send("잠시후 다시 시도하여 주십시오.");
      }
    }

    let dataJson2 = {};

    if (parentId !== null) {
      dataJson2 = await CommunityComment.findOne({
        where: { id: parseInt(grantparentId) },
      });

      if (!dataJson2) {
        return res.status(401).send("잠시후 다시 시도하여 주십시오.");
      }
    }

    const createResult = await CommunityComment.create({
      content,
      parent: parentId === null ? 0 : parseInt(dataJson.parent) + 1,
      parentId: parentId ? parentId : null,
      grantparentId: parseInt(grantparentId),
      CommunityId: parseInt(communityId),
      UserId: parseInt(req.user.id),
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
    const exCommunityCom = await CommunityComment.findOne({
      where: { id: parseInt(id), isDelete: false },
    });

    if (!exCommunityCom) {
      return res.status(401).send("존재하지 않는 게시글입니다.");
    }

    if (exCommunityCom.UserId !== req.user.id) {
      return res.status(401).send("자신의 댓글만 수정할 수 있습니다.");
    }

    const updateResult = await CommunityComment.update(
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
    return res.status(401).send("댓글을 작성할 수 없습니다.");
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
      const exCommunityCom = await CommunityComment.findOne({
        where: { id: parseInt(commentId), isDelete: false },
      });

      if (!exCommunityCom) {
        return res.status(401).send("존재하지 않는 댓글입니다.");
      }

      if (req.user.level > 3) {
        const deleteResult = await CommunityComment.update(
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
      }

      if (req.user.level < 3) {
        if (exCommunityCom.UserId !== req.user.id) {
          return res.status(401).send("자신의 댓글만 삭제할 수 있습니다.");
        }

        const deleteResult = await CommunityComment.update(
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
      }
    } catch (error) {
      console.error(error);
      return res.status(401).send("댓글을 작성할 수 없습니다.");
    }
  }
);

module.exports = router;
