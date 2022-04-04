const express = require("express");
const isAdminCheck = require("../middlewares/isAdminCheck");
const isLoggedIn = require("../middlewares/isLoggedIn");
const isNanCheck = require("../middlewares/isNanCheck");
const {
  Lecture,
  User,
  Participant,
  LectureDiary,
  Homework,
  Submit,
  LectureMessage,
  LectureStuMemo,
  Commute,
} = require("../models");
const models = require("../models");
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const AWS = require("aws-sdk");
const multerS3 = require("multer-s3");
const moment = require("moment");

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

router.get(["/list", "/list/:sort"], async (req, res, next) => {
  // if (!req.user) {
  //   return res.status(403).send("로그인 후 이용 가능합니다.");
  // }

  const { sort } = req.params;
  const _sort = parseInt(sort) || 1;

  if (isNanCheck(_sort)) {
    return res.status(400).send("잘못된 요청 입니다. 다시 시도해주세요.");
  }

  let __sort = "X.id";

  if (_sort === 1) {
    __sort = "X.parti";
  } else if (_sort === 2) {
    __sort = "X.createdAt";
  } else {
    __sort = "X.course";
  }

  try {
    const selectQuery = `
      SELECT	X.id,
              X.time,
              X.day,
              X.count,
              X.course,
              X.lecDate,
              X.lecTime,
              X.viewLecTime,
              X.startLv,
              X.endLv,
              X.viewLv,
              X.startDate,
              X.endDate,
              X.viewDate,
              X.memo,
              X.zoomLink,
              X.zoomPass,
              X.price,
              X.viewPrice,
              X.createdAt,
              X.parti,
              X.teacherName,
              X.teacherLan
              FROM	(
                      SELECT	DISTINCT
                              A.id,
                              A.time,
                              A.day,
                              A.count,
                              A.course,
                              A.lecDate,
                              A.lecTime,
                              CONCAT(A.lecTime, "분")							                       AS viewLecTime,
                              A.startLv,
                              A.endLv,
                              CONCAT(A.startLv, " ~ ", A.endLv)				                   AS viewLv,
                              A.startDate,
                              A.endDate,
                              CONCAT(A.startDate, " ~ ", A.endDate)			                 AS viewDate,
                              A.memo,
                              A.zoomLink,
                              A.zoomPass,
                              A.price,
                              CONCAT(FORMAT(A.price, "000"), "원")				AS viewPrice,
                              DATE_FORMAT(A.createdAt, "%Y년 %m월 %d일")		AS createdAt,
                              CONCAT(COUNT(B.id) OVER(PARTITION BY B.LectureId), "명")   AS parti,
                              C.id                                                      AS TeacherId,
                              C.profileImage,
                              C.username                                                AS teacherName,
                              C.email,
                              C.level,
                              C.mobile,
                              C.teaLanguage                                             AS  teacherLan
                        FROM	lectures		  A
                        LEFT	OUTER
                        JOIN	participants	B
                          ON	A.id = B.LectureId
                       INNER
                        JOIN  users         C
                          ON  A.UserId = C.id
                       WHERE	A.isDelete = false
                )	X
         ORDER	BY	${__sort} DESC
    `;

    const result = await models.sequelize.query(selectQuery);

    return res.status(200).json(result[0]);
  } catch (error) {
    console.error(error);
    return res.status(401).send("강의 목록을 불러올 수 없습니다.");
  }
});

// 관리자에서 확인하는 모든 강의
router.get(
  ["/allLectures", "/allLectures/:listType"],
  isAdminCheck,
  async (req, res, next) => {
    const { listType } = req.params;

    let nanFlag = isNaN(listType);

    if (!listType) {
      nanFlag = false;
    }

    if (nanFlag) {
      return res.status(400).send("잘못된 요청 입니다.");
    }

    let _listType = Number(listType);

    if (_listType > 2 || !listType) {
      _listType = 2;
    }

    try {
      const lecture = await Lecture.findAll({
        where: { isDelete: false },
        include: [
          {
            model: User,
          },
          {
            model: Participant,
            include: [
              {
                model: User,
                order: [["createdAt", "DESC"]],
              },
            ],
          },
        ],
        order: [
          _listType === 1
            ? ["course", "DESC"]
            : _listType === 2
            ? ["createdAt", "DESC"]
            : ["course", "DESC"],
        ],
      });

      return res.status(200).json(lecture);
    } catch (error) {
      console.error(error);
      return res.status(401).send("모든 강의 목록을 불러올 수 없습니다.");
    }
  }
);

router.get("/detail/:LectureId", async (req, res, next) => {
  const { LectureId } = req.params;

  if (isNanCheck(LectureId)) {
    return res.status(401).send("잘못된 요청입니다.");
  }
  try {
    const selectQuery = `
     SELECT   DISTINCT
              A.id,
              A.time,
              A.day,
              A.count,
              A.course,
              A.lecDate,
              A.lecTime,
              CONCAT(A.lecTime, "분")							                      AS viewLecTime,
              A.startLv,
              A.endLv,
              CONCAT(A.startLv, " ~ ", A.endLv)				                 AS viewLv,
              A.startDate,
              A.endDate,
              CONCAT(A.startDate, " ~ ", A.endDate)			               AS viewDate,
              A.memo,
              A.zoomLink,
              A.zoomPass,
              A.price,
              CONCAT(FORMAT(A.price, "000"), "원")				             AS viewPrice,
              DATE_FORMAT(A.createdAt, "%Y년 %m월 %d일")		            AS createdAt,
              CONCAT(COUNT(B.id) OVER(PARTITION BY B.LectureId), "명") AS parti,
              C.id                                                     AS TeacherId,
              C.profileImage,
              C.username                                               AS teacherName,
              C.email,
              C.level,
              C.mobile,
              C.teaLanguage                                            AS teacherLan
        FROM	lectures		  A
        LEFT	OUTER
        JOIN	participants	B
          ON	A.id = B.LectureId
       INNER
        JOIN  users         C
          ON  A.UserId = C.id
       WHERE	A.isDelete = false
         AND  A.id = ${LectureId}
    `;

    const memoQuery = `
    SELECT	id,
            content,
            DATE_FORMAT(createdAt, "%Y년 %m월 %d일 %H시 %i분 %s초") 			AS	createdAt,
            DATE_FORMAT(updatedAt, "%Y년 %m월 %d일 %H시 %i분 %s초") 			AS	updatedAt,
            LectureId 
      FROM	lectureMessages
     WHERE  LectureId = ${LectureId}
    `;

    const list = await models.sequelize.query(selectQuery);
    const memo = await models.sequelize.query(memoQuery);

    return res.status(200).json({ list: list[0], memo: memo[0] });
  } catch (error) {
    console.error(error);
    return res.status(401).send("강의 정보를 불러올 수 없습니다.");
  }
});

// 강사의 강의 불러오기 (로그인 한 강사의 모든 강의)
router.get("/teacher/list/:TeacherId", async (req, res, next) => {
  const { TeacherId } = req.params;

  if (isNanCheck(TeacherId)) {
    return res.status(401).send("잘못된 요청입니다.");
  }
  try {
    const exTeacher = await User.findOne({
      where: { id: parseInt(TeacherId), level: 2 },
    });

    if (!exTeacher) {
      return res.status(401).send("존재하지 않는 강사입니다.");
    }

    const selectQuery = `
    SELECT   DISTINCT
             A.id,
             A.time,
             A.day,
             A.count,
             A.course,
             A.lecDate,
             A.lecTime,
             CONCAT(A.lecTime, "분")							                      AS viewLecTime,
             A.startLv,
             A.endLv,
             CONCAT(A.startLv, " ~ ", A.endLv)				                 AS viewLv,
             A.startDate,
             A.endDate,
             CONCAT(A.startDate, " ~ ", A.endDate)			               AS viewDate,
             A.memo,
             A.zoomLink,
             A.zoomPass,
             A.price,
             CONCAT(FORMAT(A.price, "000"), "원")				               AS viewPrice,
             DATE_FORMAT(A.createdAt, "%Y년 %m월 %d일")		              AS createdAt,
             CONCAT(COUNT(B.id) OVER(PARTITION BY B.LectureId), "명")  AS parti,
             C.id                                                     AS TeacherId,
             C.profileImage,
             C.username                                               AS teacherName,
             C.email,
             C.level,
             C.mobile,
             C.teaLanguage                                            AS teacherLan
       FROM	lectures		  A
       LEFT	OUTER
       JOIN	participants	B
         ON	A.id = B.LectureId
      INNER
       JOIN  users         C
         ON  A.UserId = C.id
      WHERE	A.isDelete = false
        AND  C.id = ${TeacherId}
   `;

    const list = await models.sequelize.query(selectQuery);

    return res.status(200).json({ list: list[0] });
  } catch (error) {
    console.error(error);
    return res.status(401).send("강사별 강의를 불러올 수 없습니다.");
  }
});

//내 강의를 듣는 학생 목록 조회 [강사]

router.post("/student/list", isLoggedIn, async (req, res, next) => {
  const { LectureId } = req.body;

  if (!req.user) {
    return res.status(403).send("로그인 후 이용 가능합니다.");
  }
  try {
    const exLecture = await Lecture.findOne({
      where: { id: parseInt(LectureId), UserId: parseInt(req.user.id) },
    });

    if (!exLecture) {
      return res.status(401).send("해당 강의가 존재하지 않습니다.");
    }

    const myusers = await Participant.findAll({
      where: { LectureId: parseInt(LectureId) },
    });

    let students = [];

    await Promise.all(
      myusers.map(async (data) => {
        students.push(
          await User.findOne({
            where: { id: parseInt(data.UserId) },
          })
        );
      })
    );

    return res.status(200).json(students);
  } catch (error) {
    console.error(error);
    return res.status(401).send("강의를 듣는 학생 목록을 불러올 수 없습니다.");
  }
});

//로그인 한 학생이 듣고있는 강의 목록

router.get("/student/lecture/list", isLoggedIn, async (req, res, next) => {
  if (!req.user) {
    return res.status(403).send("로그인 후 이용 가능합니다.");
  }
  try {
    const exParts = await Participant.findAll({
      where: { UserId: parseInt(req.user.id) },
    });

    if (exParts.length === 0) {
      return res.status(401).send("강의에 참여하고 있지 않습니다.");
    }

    //    let lectureIds = [];

    // for (let i = 0; i < lectures.length; i++) {
    //   lectureIds.push(lectures[i].LectureId);
    // }

    let lectures = [];

    await Promise.all(
      exParts.map(async (data) => {
        lectures.push(
          await Lecture.findOne({
            where: { id: parseInt(data.LectureId) },
            include: [
              {
                model: User,
              },
              {
                model: Commute,
              },
            ],
          })
        );
      })
    );

    return res.status(200).json({ lectures });
  } catch (error) {
    console.error(error);
    return res.status(401).send("강의 목록을 불러올 수 없습니다.");
  }
});

router.post("/create", isAdminCheck, async (req, res, next) => {
  const {
    time,
    day,
    count,
    course,
    lecDate,
    lecTime,
    startLv,
    endLv,
    startDate,
    endDate,
    memo,
    price,
    UserId,
  } = req.body;
  try {
    const exTeacher = await User.findOne({
      where: { id: parseInt(UserId), level: 2 },
    });

    if (exTeacher.level !== 2) {
      return res.status(401).send("해당 사용자는 강사가 아닙니다.");
    }

    const createResult = await Lecture.create({
      time,
      day,
      count,
      course,
      lecDate,
      lecTime,
      startLv,
      endLv,
      startDate,
      endDate,
      memo,
      price,
      UserId: parseInt(UserId),
    });

    if (!createResult) {
      return res.status(401).send("처리중 문제가 발생하였습니다.");
    }

    return res.status(201).json({ result: true });
  } catch (error) {
    console.error(error);
    return res.status(401).send("강의를 등록할 수 없습니다.");
  }
});

router.patch("/update", isAdminCheck, async (req, res, next) => {
  const {
    id,
    time,
    day,
    count,
    course,
    lecDate,
    lecTime,
    startLv,
    endLv,
    startDate,
    endDate,
    memo,
    price,
    UserId,
  } = req.body;
  try {
    const exLecture = await Lecture.findOne({
      where: { id: parseInt(id) },
    });

    if (!exLecture) {
      return res.status(401).send("존재하지 않는 강의입니다.");
    }

    const exTeacher = await User.findOne({
      where: { id: parseInt(UserId), level: 2 },
    });

    if (exTeacher.level !== 2) {
      return res.status(401).send("해당 사용자는 강사가 아닙니다.");
    }

    const updateResult = await Lecture.update(
      {
        time,
        day,
        count,
        course,
        lecDate,
        lecTime,
        startLv,
        endLv,
        startDate,
        endDate,
        memo,
        price,
        UserId: parseInt(UserId),
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
    return res.status(401).send("강의를 수정할 수 없습니다.");
  }
});

router.patch("/link/update", isLoggedIn, async (req, res, next) => {
  const { id, zoomLink, zoomPass } = req.body;
  try {
    const exLecture = await Lecture.findOne({
      where: { id: parseInt(id) },
    });

    if (!exLecture) {
      return res.status(401).send("존재하지 않는 강의입니다.");
    }

    if (exLecture.UserId !== req.user.id) {
      return res
        .status(401)
        .send("자신의 강의에만 줌 링크를 등록할 수 있습니다.");
    }

    const updateResult = await Lecture.update(
      {
        zoomLink,
        zoomPass,
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
    return res.status(401).send("강의에 줌 링크를 등록할 수 없습니다.");
  }
});

router.delete("/delete/:lectureId", isAdminCheck, async (req, res, next) => {
  const { lectureId } = req.params;

  if (isNanCheck(lectureId)) {
    return res.status(401).send("잘못된 요청입니다.");
  }

  try {
    const exLecture = await Lecture.findOne({
      where: { id: parseInt(lectureId) },
    });

    if (!exLecture) {
      return res.status(401).send("존재하지 않는 강의입니다.");
    }

    const deleteResult = await Lecture.update(
      {
        isDelete: true,
      },
      {
        where: { id: parseInt(lectureId) },
      }
    );

    if (deleteResult[0] > 0) {
      return res.status(200).json({ result: true });
    } else {
      return res.status(200).json({ result: false });
    }
  } catch (error) {
    console.error(error);
    return res.status(401).send("강의를 삭제할 수 없습니다.");
  }
});

///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
////////////////////////////// - 강의 별 학생 메모 작성 -///////////////////////////////////

router.get("/memo/student/list", async (req, res, next) => {
  const { page, search, LectureId } = req.query;

  const LIMIT = 5;

  const _page = page ? page : 1;
  const _search = search ? search : ``;

  const __page = _page - 1;
  const OFFSET = __page * 5;

  try {
    const lengthQuery = `
    SELECT	A.id,
            A.memo,
            DATE_FORMAT(A.createdAt, "%Y년 %m월 %d일 %H시 %i분 %s초") 			AS	createdAt,
            DATE_FORMAT(A.updatedAt, "%Y년 %m월 %d일 %H시 %i분 %s초") 			AS	updatedAt,
            A.LectureId,
            A.UserId,
            B.username,
            B.stuCountry,
            B.birth
      FROM	lectureStuMemos       A
     INNER
      JOIN  users                 B
        ON  A.UserId = B.id
     WHERE  LectureId = ${LectureId}
     ${_search ? `AND B.username LIKE '%${_search}%'` : ``}
     `;

    const studentMemoQuery = `
    SELECT	A.id,
            A.memo,
            DATE_FORMAT(A.createdAt, "%Y년 %m월 %d일 %H시 %i분 %s초") 			AS	createdAt,
            DATE_FORMAT(A.updatedAt, "%Y년 %m월 %d일 %H시 %i분 %s초") 			AS	updatedAt,
            A.LectureId,
            A.UserId,
            B.username,
            B.stuCountry,
            B.birth
      FROM	lectureStuMemos       A
     INNER
      JOIN  users                 B
        ON  A.UserId = B.id
     WHERE  LectureId = ${LectureId}
     ${_search ? `AND B.username LIKE '%${_search}%'` : ``}
     ORDER  BY A.createdAt DESC
     LIMIT  ${LIMIT}
    OFFSET  ${OFFSET}
    `;

    const commuteQuery = `
    SELECT count(UserId)			AS CommuteCnt,
           UserId
      FROM commutes
     WHERE LectureId = ${LectureId}
     GROUP BY UserId
    `;

    const length = await models.sequelize.query(lengthQuery);
    const stuMemo = await models.sequelize.query(studentMemoQuery);
    const commute = await models.sequelize.query(commuteQuery);

    const stuMemolen = length[0].length;

    const lastPage =
      stuMemolen % LIMIT > 0 ? stuMemolen / LIMIT + 1 : stuMemolen / LIMIT;

    return res.status(200).json({
      stuMemo: stuMemo[0],
      lastPage: parseInt(lastPage),
      commute: commute[0],
    });
  } catch (error) {
    console.error(error);
    return res.status(401).send("메모 정보를 불러올 수 없습니다.");
  }
});

router.get("/memo/student/detail/:memoId", async (req, res, next) => {
  const { memoId } = req.params;

  if (isNanCheck(memoId)) {
    return res.status(401).send("잘못된 요청입니다.");
  }

  try {
    const studentMemoQuery = `
    SELECT	id,
            memo,
            DATE_FORMAT(createdAt, "%Y년 %m월 %d일 %H시 %i분 %s초") 			AS	createdAt,
            DATE_FORMAT(updatedAt, "%Y년 %m월 %d일 %H시 %i분 %s초") 			AS	updatedAt,
            LectureId,
            UserId
      FROM	lectureStuMemos
     WHERE  id = ${memoId}
    `;

    const studentMemo = await models.sequelize.query(studentMemoQuery);

    return res.status(200).json({ studentMemo: studentMemo[0] });
  } catch (error) {
    console.error(error);
    return res.status(401).send("메모 정보를 불러올 수 없습니다.");
  }
});

router.post("/memo/student/create", isLoggedIn, async (req, res, next) => {
  const { memo, LectureId, UserId } = req.body;
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

    const exPart = await Participant.findOne({
      where: { UserId: parseInt(UserId), LectureId: parseInt(LectureId) },
    });

    if (!exPart) {
      return res.status(401).send("해당 강의에 참여하고 있는 학생이 아닙니다.");
    }

    const exMemoQuery = `
    SELECT	id,
            memo,
            createdAt,
            updatedAt,
            LectureId,
            UserId 
      FROM	lectureStuMemos
     WHERE  1 = 1
       AND  DATE_FORMAT(createdAt, '%Y-%m-%d') = DATE_FORMAT(NOW(), '%Y-%m-%d')
       AND  LectureId = ${LectureId}
       AND  UserId = ${UserId}
    `;

    const exMemo = await models.sequelize.query(exMemoQuery);

    if (exMemo[0].length > 0) {
      return res.status(401).send("이미 해당 학생의 메모가 등록되었습니다.");
    }

    const createResult = await LectureStuMemo.create({
      memo,
      UserId: parseInt(UserId),
      LectureId: parseInt(LectureId),
    });

    if (!createResult) {
      return res.status(401).send("처리중 문제가 발생하였습니다.");
    }

    return res.status(201).json({ result: true });
  } catch (error) {
    console.error(error);
    return res.status(401).send("학생 메모를 등록할 수 없습니다.");
  }
});

router.patch("/memo/student/update", isLoggedIn, async (req, res, next) => {
  const { id, memo } = req.body;
  try {
    const exMemo = await LectureStuMemo.findOne({
      where: { id: parseInt(id) },
    });

    if (!exMemo) {
      return res.status(401).send("존재하지 않는 학생 메모입니다.");
    }

    console.log(exMemo);

    const updateResult = await LectureStuMemo.update(
      {
        memo,
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
    return res.status(401).send("학생 메모를 수정할 수 없습니다.");
  }
});

///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////// - 강의 메모 작성 -///////////////////////////////////////

router.get("/memo/detail/:memoId", async (req, res, next) => {
  const { memoId } = req.params;

  if (isNanCheck(memoId)) {
    return res.status(401).send("잘못된 요청입니다.");
  }

  try {
    const memoQuery = `
    SELECT	id,
            content,
            DATE_FORMAT(createdAt, "%Y년 %m월 %d일 %H시 %i분 %s초") 			AS	createdAt,
            DATE_FORMAT(updatedAt, "%Y년 %m월 %d일 %H시 %i분 %s초") 			AS	updatedAt,
            LectureId 
      FROM	lectureMessages
     WHERE  id = ${memoId}
    `;

    const memo = await models.sequelize.query(memoQuery);

    return res.status(200).json({ memo: memo[0] });
  } catch (error) {
    console.error(error);
    return res.status(401).send("메모 정보를 불러올 수 없습니다.");
  }
});

router.post("/memo/create", isLoggedIn, async (req, res, next) => {
  const { content, LectureId } = req.body;

  try {
    const exLecture = await Lecture.findOne({
      where: { id: parseInt(LectureId) },
    });

    if (!exLecture) {
      return res.status(401).send("존재하지 않는 강의입니다.");
    }

    if (exLecture.UserId !== req.user.id) {
      return res.status(401).send("자신의 강의가 아닙니다.");
    }

    const createResult = await LectureMessage.create({
      content,
      LectureId: parseInt(LectureId),
    });

    if (!createResult) {
      return res.status(401).send("처리중 문제가 발생하였습니다.");
    }

    return res.status(201).json({ result: true });
  } catch (error) {
    console.error(error);
    return res.status(401).send("강의 메모를 작성할 수 없습니다.");
  }
});

router.patch("/memo/update", isLoggedIn, async (req, res, next) => {
  const { id, content } = req.body;
  try {
    const exMemo = await LectureMessage.findOne({
      where: { id: parseInt(id) },
    });

    if (!exMemo) {
      return res.status(401).send("존재하지 않는 강의 메모입니다.");
    }

    const updateResult = await LectureMessage.update(
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
    return res.status(401).send("강의 메모를 수정할 수 없습니다.");
  }
});

///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////// - 강의 일지 작성 -///////////////////////////////////////

router.post("/diary/list", isLoggedIn, async (req, res, next) => {
  const { page, LectureId } = req.body;

  const LIMIT = 10;

  const _page = page ? page : 1;

  const __page = _page - 1;
  const OFFSET = __page * 10;

  try {
    const exLecture = await Lecture.findOne({
      where: { id: parseInt(LectureId) },
    });

    if (!exLecture) {
      return res.status(401).send("존재하지 않는 강의입니다.");
    }

    if (exLecture.UserId !== req.user.id) {
      return res.status(401).send("자신의 강의가 아닙니다.");
    }

    const lengthQuery = `
    SELECT	id,
            author,
            process,
            lectureMemo,
            createdAt,
            updatedAt,
            LectureId
      FROM	lectureDiarys
     WHERE  LectureId = ${LectureId}
      `;

    const diaryQuery = `
    SELECT	id,
            author,
            process,
            lectureMemo,
            createdAt,
            updatedAt,
            LectureId
      FROM	lectureDiarys
     WHERE  LectureId = ${LectureId}
     ORDER  BY createdAt DESC
     LIMIT  ${LIMIT}
    OFFSET  ${OFFSET}
    `;

    const length = await models.sequelize.query(lengthQuery);
    const diarys = await models.sequelize.query(diaryQuery);

    const diaryLen = length[0].length;

    const lastPage =
      diaryLen % LIMIT > 0 ? diaryLen / LIMIT + 1 : diaryLen / LIMIT;

    return res
      .status(200)
      .json({ diarys: diarys[0], lastPage: parseInt(lastPage) });
  } catch (error) {
    console.error(error);
    return res.status(401).send("강의 일지 목록을 불러올 수 없습니다.");
  }
});

router.post("/diary/admin/list", isAdminCheck, async (req, res, next) => {
  const { LectureId } = req.body;

  const _LectureId = LectureId || null;

  try {
    const selectQuery = `
    SELECT	A.id,
            A.author,
            A.process,
            A.lectureMemo,
            A.createdAt,
            A.updatedAt,
            A.LectureId,
            B.course,
            B.lecDate,
            B.lecTime,
            B.startLv,
            B.endLv,
            B.startDate,
            B.endDate,
            B.memo,
            B.price,
            C.username,
            C.level,
            C.teaCountry,
            C.teaLanguage
      FROM	lectureDiarys			A
     INNER
      JOIN	lectures				B
        ON	A.LectureId = B.id 
     INNER
      JOIN	users 					C
        ON	B.UserId = C.id 
     WHERE  1 = 1
       ${_LectureId ? `AND A.LectureId = ${_LectureId}` : ``}
     ORDER  BY createdAt DESC
    `;

    const list = await models.sequelize.query(selectQuery);

    return res.status(200).json({ list: list[0] });
  } catch (error) {
    console.error(error);
    return res.status(401).send("강의 일지 목록을 불러올 수 없습니다.");
  }
});

router.post("/diary/create", isLoggedIn, async (req, res, next) => {
  const { author, process, lectureMemo, LectureId } = req.body;

  if (!req.user) {
    return res.status(403).send("로그인 후 이용 가능합니다.");
  }

  if (req.user.level !== 2) {
    return res
      .status(401)
      .send("강사가 아닌 사용자는 강의일지를 작성할 수 없습니다.");
  }

  try {
    const exLecture = await Lecture.findOne({
      where: { id: parseInt(LectureId) },
    });

    if (!exLecture) {
      return res.status(401).send("존재하지 않는 강의입니다.");
    }

    if (exLecture.UserId !== req.user.id) {
      return res.status(401).send("자신의 강의가 아닙니다.");
    }

    const createResult = await LectureDiary.create({
      author,
      process,
      lectureMemo,
      LectureId: parseInt(LectureId),
    });

    if (!createResult) {
      return res.status(401).send("처리중 문제가 발생하였습니다.");
    }

    return res.status(201).json({ result: true });
  } catch (error) {
    console.error(error);
    return res.status(401).send("강의 일지를 작성할 수 없습니다.");
  }
});

///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////// - 숙제 작성 - ////////////////////////////////////////

router.post("/homework/list", async (req, res, next) => {
  const { LectureId, page } = req.body;

  const LIMIT = 5;

  const _page = page ? page : 1;

  const __page = _page - 1;
  const OFFSET = __page * 5;

  try {
    const lengthQuery = `
      SELECT  id,
              title,
              date,
              file,
              isDelete,
              LectureId
        FROM  homeworks
       WHERE  LectureId = ${LectureId}
    `;

    const homeworkQuery = `
      SELECT  id,
              title,
              date,
              file,
              isDelete,
              LectureId
        FROM  homeworks
       WHERE  LectureId = ${LectureId}
       ORDER  BY  createdAt DESC
       LIMIT  ${LIMIT}
      OFFSET  ${OFFSET}
    `;

    const length = await models.sequelize.query(lengthQuery);
    const homeworks = await models.sequelize.query(homeworkQuery);

    const homeworkLen = length[0].length;

    const lastPage =
      homeworkLen % LIMIT > 0 ? homeworkLen / LIMIT + 1 : homeworkLen / LIMIT;

    return res
      .status(200)
      .json({ homeworks: homeworks[0], lastPage: parseInt(lastPage) });
  } catch (error) {
    console.error(error);
    return res.status(401).send("숙제 목록을 불러올 수 없습니다.");
  }
});

// 학생이 듣고있는 수업의 숙제 리스트

router.get("/homework/student/list", isLoggedIn, async (req, res, next) => {
  if (!req.user) {
    return res.status(403).send("로그인 후 이용 가능합니다.");
  }

  const { page, search } = req.query;

  const LIMIT = 5;

  const _page = page ? page : 1;
  const _search = search ? search : ``;

  const __page = _page - 1;
  const OFFSET = __page * 5;

  try {
    const lectures = await Participant.findAll({
      where: { UserId: parseInt(req.user.id) },
    });

    if (!lectures) {
      return res.status(401).send("참여하고 있는 강의가 없습니다.");
    }

    let lectureIds = [];

    for (let i = 0; i < lectures.length; i++) {
      lectureIds.push(lectures[i].LectureId);
    }

    const lengthQuery = `
    SELECT	A.id,
            A.title,
            A.date,
            A.file,
            A.isDelete,
            A.createdAt,
            A.updatedAt, 
            A.LectureId,
            B.course,
            C.username 
      FROM	homeworks			A
     INNER
      JOIN	lectures			B
        ON	A.LectureId = B.id
     INNER
      JOIN	users				C
        ON	B.UserId = C.id
    WHERE	A.LectureId IN (${lectureIds})
      ${_search ? `AND B.course LIKE %'${_search}'%` : ``}
    `;

    const selectQuery = `
    SELECT	A.id,
            A.title,
            A.date,
            A.file,
            A.isDelete,
            A.createdAt,
            A.updatedAt, 
            A.LectureId,
            B.course,
            C.username 
      FROM	homeworks			A
     INNER
      JOIN	lectures			B
        ON	A.LectureId = B.id
     INNER
      JOIN	users				C
        ON	B.UserId = C.id
     WHERE	A.LectureId IN (${lectureIds})
     ${_search ? `AND B.course LIKE %'${_search}'%` : ``}
     ORDER  BY A.createdAt DESC
     LIMIT  ${LIMIT}
    OFFSET  ${OFFSET}
    `;

    const length = await models.sequelize.query(lengthQuery);
    const homeworks = await models.sequelize.query(selectQuery);

    const homeworkLen = length[0].length;

    const lastPage =
      homeworkLen % LIMIT > 0 ? homeworkLen / LIMIT + 1 : homeworkLen / LIMIT;

    return res
      .status(200)
      .json({ homeworks: homeworks[0], lastPage: parseInt(lastPage) });
  } catch (error) {
    console.error(error);
    return res.status(401).send("숙제 목록을 불러올 수 없습니다.");
  }
});

router.post("/file", upload.single("file"), async (req, res, next) => {
  return res.json({ path: req.file.location });
});

router.post("/homework/create", async (req, res, next) => {
  const { title, date, file, LectureId } = req.body;
  try {
    const exLecture = await Lecture.findOne({
      where: { id: parseInt(LectureId) },
    });

    if (!exLecture) {
      return res.status(401).send("존재하지 않는 강의입니다.");
    }

    const createResult = await Homework.create({
      title,
      date,
      file,
      LectureId: parseInt(LectureId),
    });

    if (!createResult) {
      return res.status(401).send("처리중 문제가 발생하였습니다.");
    }

    return res.status(201).json({ result: true });
  } catch (error) {
    console.error(error);
    return res.status(401).send("숙제를 등록할 수 없습니다.");
  }
});

// 강사 숙제 작성 목록 확인하기.
router.post("/submit/list", isLoggedIn, async (req, res, next) => {
  const { LectureId, search, page } = req.body;

  const LIMIT = 5;

  const _page = page ? page : 1;
  const _search = search ? search : ``;

  const __page = _page - 1;
  const OFFSET = __page * 5;

  try {
    const exLecture = await Lecture.findOne({
      where: { id: parseInt(LectureId), UserId: parseInt(req.user.id) },
    });

    if (!exLecture) {
      return res.status(401).send("존재하지 않는 강의입니다.");
    }

    const lengthQuery = `
    SELECT	A.id,
            A.file,
            A.isComplete,
            DATE_FORMAT(A.createdAt, "%Y년 %m월 %d일 %H시 %i분 %s초") 			AS	createdAt,
            DATE_FORMAT(A.updatedAt, "%Y년 %m월 %d일 %H시 %i분 %s초") 			AS	updatedAt,
            A.LectureId,
            A.UserId,
            A.HomeworkId,
            B.userId,
            B.username,
            B.level,
            C.title,
            C.date,
            D.course
      FROM	submits				A
     INNER
      JOIN	users				B
        ON	A.UserId = B.id
     INNER
      JOIN	homeworks			C
        ON	A.HomeworkId = C.id
     INNER
      JOIN	lectures			D
        ON	A.LectureId = D.id
     WHERE  A.LectureId = ${LectureId}
     ${_search ? `AND B.username LIKE '%${_search}%'` : ``}
    `;

    const selectQuery = `
    SELECT	A.id,
            A.file,
            A.isComplete,
            DATE_FORMAT(A.createdAt, "%Y년 %m월 %d일 %H시 %i분 %s초") 			AS	createdAt,
            DATE_FORMAT(A.updatedAt, "%Y년 %m월 %d일 %H시 %i분 %s초") 			AS	updatedAt,
            A.LectureId,
            A.UserId,
            A.HomeworkId,
            B.userId,
            B.username,
            B.level,
            C.title,
            C.date,
            D.course
      FROM	submits				A
     INNER
      JOIN	users				B
        ON	A.UserId = B.id
     INNER
      JOIN	homeworks			C
        ON	A.HomeworkId = C.id
     INNER
      JOIN	lectures			D
        ON	A.LectureId = D.id
     WHERE  A.LectureId = ${LectureId}
     ${_search ? `AND B.username LIKE '%${_search}%'` : ``}
     ORDER  BY  createdAt DESC
     LIMIT  ${LIMIT}
    OFFSET  ${OFFSET}
    `;

    const length = await models.sequelize.query(lengthQuery);
    const submits = await models.sequelize.query(selectQuery);

    const submitslen = length[0].length;

    const lastPage =
      submitslen % LIMIT > 0 ? submitslen / LIMIT + 1 : submitslen / LIMIT;

    return res
      .status(200)
      .json({ submits: submits[0], lastPage: parseInt(lastPage) });
  } catch (error) {
    console.error(error);
    return res.status(401).send("숙제 제출 목록을 불러올 수 없습니다.");
  }
});

// 학생 숙제 제출
router.post("/submit/create", isLoggedIn, async (req, res, next) => {
  const { HomeworkId, LectureId, file } = req.body;
  if (!req.user) {
    return res.status(403).send("로그인 후 이용 가능합니다.");
  }
  try {
    const exPart = await Participant.findOne({
      where: { LectureId: parseInt(LectureId), UserId: parseInt(req.user.id) },
    });

    if (!exPart) {
      return res.status(401).send("해당 강의에 참여하고 있지 않습니다.");
    }

    const exHomework = await Homework.findOne({
      where: { id: parseInt(HomeworkId), LectureId: parseInt(LectureId) },
    });

    if (!exHomework) {
      return res.status(401).send("존재하지 않는 숙제입니다.");
    }

    const exSubmit = `
    SELECT	A.id,
            A.file,
            A.createdAt,
            B.date
      FROM	submits			A
     INNER
      JOIN	homeworks 		B
        ON	A.HomeworkId = B.id
     WHERE  1 = 1
       AND  B.date BETWEEN DATE_FORMAT(B.createdAt, '%Y-%m-%d') AND DATE_FORMAT(B.date, '%Y-%m-%d')
       AND  A.HomeworkId = ${HomeworkId}
       AND  A.UserId = ${req.user.id}
  `;

    const validate = await models.sequelize.query(exSubmit);

    if (validate[0].length > 0) {
      return res.status(401).send("이미 기한 안에 숙제를 제출하였습니다.");
    }

    const today = moment().format("YYYY-MM-DD");

    if (new Date(exHomework.date) < new Date(today)) {
      return res.status(401).send("숙제 제출기한이 지났습니다.");
    }

    const createResult = await Submit.create({
      file,
      LectureId: parseInt(LectureId),
      UserId: parseInt(req.user.id),
      HomeworkId: parseInt(HomeworkId),
    });

    if (!createResult) {
      return res.status(401).send("처리중 문제가 발생하였습니다.");
    }

    return res.status(201).json({ result: true });
  } catch (error) {
    console.error(error);
    return res.status(401).send("숙제를 제출할 수 없습니다.");
  }
});

module.exports = router;
