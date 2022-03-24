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
} = require("../models");
const models = require("../models");

const router = express.Router();

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
                          ON  A.TeacherId = C.id
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
router.get("/allLectures", isAdminCheck, async (req, res, next) => {
  try {
    const lecture = await Lecture.findAll({
      where: { isDelete: false },
      include: [
        {
          model: Participant,
          include: [
            {
              model: User,
            },
          ],
        },
      ],
    });

    return res.status(200).json(lecture);
  } catch (error) {
    console.error(error);
    return res.status(401).send("모든 강의 목록을 불러올 수 없습니다.");
  }
});

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
          ON  A.TeacherId = C.id
       WHERE	A.isDelete = false
         AND  A.id = ${LectureId}
    `;

    const list = await models.sequelize.query(selectQuery);

    return res.status(200).json({ list: list[0] });
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
         ON  A.TeacherId = C.id
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
      where: { id: parseInt(LectureId), TeacherId: parseInt(req.user.id) },
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
      TeacherId: parseInt(UserId),
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
        TeacherId: parseInt(UserId),
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

    if (!exLecture.TeacherId !== req.user.id) {
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
     LIMIT  ${LIMIT}
    OFFSET  ${OFFSET}
     ORDER  BY createdAt DESC
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

router.post("/diary/admin/list", async (req, res, next) => {
  const { TeacherId } = req.body;

  const _TeacherId = TeacherId || null;

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
        ON	B.TeacherId = C.id 
     WHERE  1 = 1
       ${_TeacherId ? `AND B.TeacherId = ${_TeacherId}` : ``}
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

    if (!exLecture.TeacherId !== req.user.id) {
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

router.get("/homework/list", async (req, res, next) => {
  try {
  } catch (error) {
    console.error(error);
    return res.status(401).send("숙제 목록을 불러올 수 없습니다.");
  }
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

    const exLecture2 = await Lecture.findOne({
      title,
      date,
      file,
      LectureId,
    });

    if (exLecture2) {
      return res.status(401).send("이미 해당 강의에 숙제가 존재합니다.");
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

module.exports = router;
