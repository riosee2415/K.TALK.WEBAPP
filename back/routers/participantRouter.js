const express = require("express");
const isAdminCheck = require("../middlewares/isAdminCheck");
const isLoggedIn = require("../middlewares/isLoggedIn");
const { Lecture, User, Participant } = require("../models");
const models = require("../models");

const router = express.Router();

// 참여목록
router.get("/list", isLoggedIn, async (req, res, next) => {
  const { page } = req.query;
  if (!req.user) {
    return res.status(403).send("로그인 후 이용 가능합니다.");
  }

  const LIMIT = 10;

  const _page = page ? page : 1;

  const __page = _page - 1;
  const OFFSET = __page * 10;

  try {
    const lengthQuery = `
      SELECT	A.id,
                A.UserId,
                A.LectureId,
                DATE_FORMAT(A.createdAt,     "%Y년 %m월 %d일 %H시 %i분")							    AS	createdAt,
                B.userId,
                B.username,
                B.level,
                C.course,
                C.lecDate,
                C.startLv,
                C.startDate,
                C.endDate
        FROM	participants				A
       INNER
        JOIN	users						B
          ON	A.UserId  = B.id
       INNER
        JOIN	lectures					C
          ON	A.LectureId = C.id
       WHERE    A.UserId = ${req.user.id}
`;

    const selectQuery = `
        SELECT	A.id,
                A.UserId,
                A.LectureId,
                DATE_FORMAT(A.createdAt,     "%Y년 %m월 %d일 %H시 %i분")							    AS	createdAt,
                B.userId,
                B.username,
                B.level,
                C.course,
                C.lecDate,
                C.startLv,
                C.startDate,
                C.endDate
        FROM	  participants				A
       INNER 
        JOIN  	users					      B
          ON	  A.UserId  = B.id
       INNER
        JOIN	  lectures					  C
          ON	  A.LectureId = C.id
       WHERE    A.UserId = ${req.user.id}
       LIMIT    ${LIMIT}
      OFFSET    ${OFFSET}
`;

    const length = await models.sequelize.query(lengthQuery);
    const partList = await models.sequelize.query(selectQuery);

    const partlen = length[0].length;

    const lastPage =
      partlen % LIMIT > 0 ? partlen / LIMIT + 1 : partlen / LIMIT;

    return res
      .status(200)
      .json({ partList: partList[0], lastPage: parseInt(lastPage) });
  } catch (error) {
    console.error(error);
    return res.status(401).send("참여중인 강의 목록을 불러올 수 없습니다.");
  }
});

// 강의별 참여 목록
router.post("/leture/list", isLoggedIn, async (req, res, next) => {
  const { LectureId } = req.body;

  const _LectureId = LectureId || ``;

  try {
    const selectQuery = `
      SELECT	A.id,
              A.UserId,
              A.LectureId,
              DATE_FORMAT(A.createdAt,     "%Y년 %m월 %d일 %H시 %i분")							    AS	createdAt,
              B.userId,
              B.username,
              B.level,
              B.birth,
              B.stuCountry,
              C.course,
              C.lecDate,
              C.startLv,
              C.startDate,
              C.endDate,
              C.day,
              C.count
        FROM	participants				A
       INNER
        JOIN	users						    B
          ON	A.UserId  = B.id
       INNER
        JOIN	lectures					  C
          ON	A.LectureId = C.id
       WHERE  1 = 1
         ${_LectureId ? `AND A.LectureId = ${_LectureId}` : ``}
         AND  C.UserId = ${req.user.id}
       ORDER  BY A.createdAt DESC
`;

    const partList = await models.sequelize.query(selectQuery);

    return res.status(200).json({ partList: partList[0] });
  } catch (error) {
    console.error(error);
    return res.status(401).send("강의 별 목록을 불러올 수 없습니다.");
  }
});

// 관리자에서 보는 참여 목록
router.post("/admin/list", isAdminCheck, async (req, res, next) => {
  const { UserId, LectureId } = req.body;

  const _UserId = UserId || ``;
  const _LectureId = LectureId || ``;

  try {
    const selectQuery = `
      SELECT	A.id,
                A.UserId,
                A.LectureId,
                DATE_FORMAT(A.createdAt,     "%Y년 %m월 %d일 %H시 %i분")							    AS	createdAt,
                B.userId,
                B.username,
                B.level,
                C.course,
                C.lecDate,
                C.startLv,
                C.startDate,
                C.endDate
        FROM	participants				A
       INNER
        JOIN	users						B
          ON	A.UserId  = B.id
       INNER
        JOIN	lectures					C
          ON	A.LectureId = C.id
       WHERE    1 = 1
         ${_UserId ? `AND A.UserId = ${_UserId}` : ``}
         ${_LectureId ? `AND A.LectureId = ${_LectureId}` : ``}
      ORDER    BY A.createdAt DESC
`;

    const partList = await models.sequelize.query(selectQuery);

    return res.status(200).json({ partList: partList[0] });
  } catch (error) {
    console.error(error);
    return res.status(401).send("강의 참여 리스트를 불러올 수 없습니다.");
  }
});

router.post("/create", isAdminCheck, async (req, res, next) => {
  const { UserId, LectureId } = req.body;
  try {
    const exLecture = await Lecture.findOne({
      where: { id: parseInt(LectureId) },
    });

    if (!exLecture) {
      return res.status(401).send("존재하지 않는 강의입니다.");
    }

    const exUser = await User.findOne({
      where: { id: parseInt(UserId) },
    });

    if (!exUser) {
      return res.status(401).send("존재하지 않는 사용자입니다.");
    }

    if (exUser.level < 1) {
      return res.status(401).send("해당 사용자는 학생이 아닙니다.");
    }

    const partValidation = await Participant.findOne({
      where: { UserId: parseInt(UserId), LectureId: parseInt(LectureId) },
    });

    if (partValidation) {
      return res
        .status(401)
        .send("해당 학생은 이미 해당 강의에 참여하고 있습니다.");
    }

    const createResult = await Participant.create({
      UserId: parseInt(UserId),
      LectureId: parseInt(LectureId),
    });

    if (!createResult) {
      return res.status(401).send("처리중 문제가 발생하였습니다.");
    }

    return res.status(201).json({ result: true });
  } catch (error) {
    console.error(error);
    return res.status(401).send("강의에 참여시킬 수 없습니다.");
  }
});

module.exports = router;
