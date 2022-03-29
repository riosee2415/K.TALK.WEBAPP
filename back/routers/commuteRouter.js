const express = require("express");
const { Commute, Lecture, User, Participant } = require("../models");
const models = require("../models");
const moment = require("moment");

const router = express.Router();

//출석부 목록
router.post("/list", async (req, res, next) => {
  const { LectureId, search, page } = req.body;

  const LIMIT = 5;

  const _page = page ? page : 1;
  const _search = search ? search : ``;

  const __page = _page - 1;
  const OFFSET = __page * 5;

  try {
    const exLecture = await Lecture.findOne({
      where: { id: parseInt(LectureId) },
    });

    if (!exLecture) {
      return res.status(401).send("출석부 목록을 불러올 수 없습니다.");
    }

    const lengthQuery = `
    SELECT	A.id,
            A.time,
            DATE_FORMAT(A.createdAt, "%Y년 %m월 %d일 %H시 %i분 %s초") 			AS	createdAt,
            DATE_FORMAT(A.updatedAt, "%Y년 %m월 %d일 %H시 %i분 %s초") 			AS	updatedAt,
            A.LectureId,
            A.UserId,
            B.course,
            B.time															                         AS	 LectureTime,
            B.day															                           AS	 LectureDay,
            C.userId,
            C.level,
            C.username
      FROM	commutes		A
     INNER
      JOIN	lectures 		B
        ON	A.LectureId = B.id
     INNER
      JOIN	users			C
        ON	A.UserId = C.id
     WHERE  1 = 1
       AND  A.LectureId = ${LectureId}
    ${_search ? `AND C.username LIKE '%${_search}%'` : ``}
    `;

    const selectQuery = `
    SELECT	A.id,
            A.time,
            DATE_FORMAT(A.createdAt, "%Y년 %m월 %d일 %H시 %i분 %s초") 			AS	createdAt,
            DATE_FORMAT(A.updatedAt, "%Y년 %m월 %d일 %H시 %i분 %s초") 			AS	updatedAt,
            A.LectureId,
            A.UserId,
            B.course,
            B.time															                         AS	 LectureTime,
            B.day															                           AS	 LectureDay,
            C.userId,
            C.level,
            C.username
      FROM	commutes		A
     INNER
      JOIN	lectures 		B
        ON	A.LectureId = B.id
     INNER
      JOIN	users			C
        ON	A.UserId = C.id
     WHERE  1 = 1
       AND  A.LectureId = ${LectureId}
       ${_search ? `AND C.username LIKE '%${_search}%'` : ``}
     ORDER  BY A.createdAt DESC
     LIMIT  ${LIMIT}
    OFFSET  ${OFFSET}
    `;

    const length = await models.sequelize.query(lengthQuery);
    const commute = await models.sequelize.query(selectQuery);

    const commutelen = length[0].length;

    const lastPage =
      commutelen % LIMIT > 0 ? commutelen / LIMIT + 1 : commutelen / LIMIT;

    return res
      .status(200)
      .json({ commute: commute[0], lastPage: parseInt(lastPage) });
  } catch (error) {
    console.error(error);
    return res.status(401).send("출석 목록을 불러올 수 없습니다.");
  }
});

// 출석 create
router.post("/create", async (req, res, next) => {
  const { time, LectureId, UserId } = req.body;
  try {
    const exLecture = await Lecture.findOne({
      where: { id: parseInt(LectureId) },
    });

    const exUser = await User.findOne({
      where: { id: parseInt(UserId) },
    });

    const exPart = await Participant.findOne({
      where: { LectureId: parseInt(LectureId), UserId: parseInt(UserId) },
    });

    if (!exLecture) {
      return res.status(401).send("존재하지 않는 강의입니다.");
    }

    if (!exUser) {
      return res.status(401).send("존재하지 않는 사용자입니다.");
    }

    if (!exPart) {
      return res
        .status(401)
        .send("해당 학생은 해당 강의에 참여하고 있지 않습니다.");
    }

    const exCommQuery = `
      SELECT  id,
              time,
              LectureId,
              UserId
        FROM  commutes
       WHERE   1 = 1
         AND  DATE_FORMAT(time, '%Y-%m-%d') = DATE_FORMAT(NOW(), '%Y-%m-%d')
         AND  LectureId = ${LectureId}
         AND  UserId = ${UserId}
    `;

    const queryResult = await models.sequelize.query(exCommQuery);

    console.log(queryResult[0]);
    console.log(queryResult[0].length);

    if (queryResult[0].length > 0) {
      return res
        .status(401)
        .send("이미 해당 학생은 해당 강의에 출석하였습니다.");
    }

    const createResult = await Commute.create({
      time,
      LectureId: parseInt(LectureId),
      UserId: parseInt(UserId),
    });

    if (!createResult) {
      return res.status(401).send("처리중 문제가 발생하였습니다.");
    }

    return res.status(201).json({ result: true });
  } catch (error) {
    console.error(error);
    return res.status(401).send("출석을 처리할 수 없습니다.");
  }
});

module.exports = router;
