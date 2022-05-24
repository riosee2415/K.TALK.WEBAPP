const express = require("express");
const isAdminCheck = require("../middlewares/isAdminCheck");
const isLoggedIn = require("../middlewares/isLoggedIn");
const {
  Lecture,
  User,
  Participant,
  Payment,
  PayClass,
  TeacherPay,
} = require("../models");
const models = require("../models");

const router = express.Router();

// 참여목록
// END DATE 빠짐 ////////////////////////////////////////////
// END DATE 빠짐 ////////////////////////////////////////////
// END DATE 빠짐 ////////////////////////////////////////////
// END DATE 빠짐 ////////////////////////////////////////////
// END DATE 빠짐 ////////////////////////////////////////////
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
              A.isDelete,
              A.UserId,
              A.LectureId,
              A.date,
              A.endDate,
              DATE_FORMAT(A.createdAt,     "%Y년 %m월 %d일 %H시 %i분")							    AS	createdAt,
              B.userId,
              B.username,
              B.level,
              C.course,
              C.lecDate,
              C.startLv,
              C.startDate
        FROM	participants				A
       INNER
        JOIN	users						B
          ON	A.UserId  = B.id
       INNER
        JOIN	lectures					C
          ON	A.LectureId = C.id
       WHERE  A.UserId = ${req.user.id}
         AND  A.isDelete = FALSE
         AND  A.isChange = FALSE
`;

    const selectQuery = `
        SELECT	A.id,
                A.isDelete,
                A.UserId,
                A.LectureId,
                A.date,
                A.endDate,
                DATE_FORMAT(A.createdAt,     "%Y년 %m월 %d일 %H시 %i분")							    AS	createdAt,
                B.userId,
                B.username,
                B.level,
                C.course,
                C.lecDate,
                C.startLv,
                C.startDate
        FROM	  participants				A
       INNER 
        JOIN  	users					      B
          ON	  A.UserId  = B.id
       INNER
        JOIN	  lectures					  C
          ON	  A.LectureId = C.id
       WHERE    A.UserId = ${req.user.id}
         AND    A.isDelete = FALSE
         AND    A.isChange = FALSE
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
// END DATE 빠짐 ////////////////////////////////////////////
// END DATE 빠짐 ////////////////////////////////////////////
// END DATE 빠짐 ////////////////////////////////////////////
// END DATE 빠짐 ////////////////////////////////////////////
// END DATE 빠짐 ////////////////////////////////////////////
router.post("/lecture/list", isLoggedIn, async (req, res, next) => {
  const { LectureId } = req.body;

  const _LectureId = LectureId || ``;

  try {
    const selectQuery = `
      SELECT	A.id,
              A.isDelete,
              A.UserId,
              A.LectureId,
              A.date,
              A.endDate,
              DATE_FORMAT(A.createdAt,     "%Y년 %m월 %d일 %H시 %i분")							    AS	createdAt,
              B.userId,
              B.username,
              B.level,
              B.birth,
              B.stuCountry,
              C.course,
              C.lecDate,
              C.startLv,
              C.startDate             AS LectureStartDate,
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
         AND  A.isDelete = FALSE
         ${_LectureId ? `AND A.LectureId = ${_LectureId}` : ``}
         AND  C.UserId = ${req.user.id}
         AND  A.isChange = FALSE
       ORDER  BY A.createdAt DESC
    `;

    const partList = await models.sequelize.query(selectQuery);

    let userIds = [];

    for (let i = 0; i < partList[0].length; i++) {
      userIds.push(partList[0][i].UserId);
    }

    const priceQuery = `
    SELECT  A.price,
            A.UserId,
            B.LectureId
      FROM  payments    A
     INNER
      JOIN  payClass    B
        ON  A.PayClassId = B.id
     WHERE  UserId in (${userIds})
       AND  B.LectureId = ${LectureId}
  `;

    const price = await models.sequelize.query(priceQuery);

    return res.status(200).json({ partList: partList[0], price: price[0] });
  } catch (error) {
    console.error(error);
    return res.status(401).send("강의 별 목록을 불러올 수 없습니다.");
  }
});

// 관리자에서 보는 참여 목록
// END DATE 빠짐 ////////////////////////////////////////////
// END DATE 빠짐 ////////////////////////////////////////////
// END DATE 빠짐 ////////////////////////////////////////////
// END DATE 빠짐 ////////////////////////////////////////////
// END DATE 빠짐 ////////////////////////////////////////////
router.post("/admin/list", isAdminCheck, async (req, res, next) => {
  const { UserId, LectureId, isDelete, isChange } = req.body;

  const _UserId = UserId || ``;
  const _LectureId = LectureId || ``;

  let _isDelete = isDelete || null;
  let _isChange = isChange || null;

  try {
    const selectQuery = `
      SELECT	A.id,
              A.isDelete,
              A.UserId,
              A.LectureId,
              A.date,
              A.endDate,
              DATE_FORMAT(A.createdAt,     "%Y년 %m월 %d일 %H시 %i분")							    AS	createdAt,
              B.userId,
              B.email,
              B.username,
              B.level,
              B.birth,
              B.profileImage,
              B.sns,
              B.snsId,
              B.mobile,
              B.stuLiveCon,
              B.stuLanguage,
              B.stuPayCount,
              B.adminMemo,
              B.mobile,
              B.stuCountry,
              C.course,
              C.lecDate,
              C.startLv,
              C.startDate             AS LectureStartDate,
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
       ${_UserId ? `AND A.UserId = ${_UserId}` : ``}
       ${_isDelete ? ` AND  A.isChange = ${_isDelete}` : ``}
       ${_isChange ? ` AND  A.isDelete = ${_isChange}` : ``}
       ORDER  BY A.createdAt DESC
    `;

    const partList = await models.sequelize.query(selectQuery);

    let userIds = [];

    for (let i = 0; i < partList[0].length; i++) {
      userIds.push(partList[0][i].UserId);
    }

    let price = [];

    let commutes = [];

    if (userIds.length !== 0) {
      const priceQuery = `
      SELECT  A.id,
              A.price,
              A.UserId,
              B.LectureId
        FROM  payments    A
       INNER
        JOIN  payClass    B
          ON  A.PayClassId = B.id
       WHERE  1 = 1
         AND  A.UserId IN (${parseInt(userIds)})
         AND  B.LectureId = ${LectureId}
    `;

      price = await models.sequelize.query(priceQuery);

      const commuteQuery = `
      SELECT	id,
              time,
              status,
              createdAt,
              LectureId,
              UserId 
        FROM	commutes
       WHERE  1 = 1
         AND  UserId IN (${parseInt(userIds)})
         AND  LectureId = ${LectureId}
      `;

      commutes = await models.sequelize.query(commuteQuery);
    }

    return res
      .status(200)
      .json({ partList: partList[0], price: price[0], commutes: commutes[0] });
  } catch (error) {
    console.error(error);
    return res.status(401).send("강의 참여 리스트를 불러올 수 없습니다.");
  }
});

router.post("/create", isAdminCheck, async (req, res, next) => {
  const { UserId, LectureId, date, endDate, PaymentId } = req.body;
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
      where: {
        UserId: parseInt(UserId),
        LectureId: parseInt(LectureId),
        isDelete: false,
        isChange: false,
      },
    });

    if (partValidation) {
      return res
        .status(401)
        .send("해당 학생은 이미 해당 강의에 참여하고 있습니다.");
    }

    const createResult = await Participant.create({
      UserId: parseInt(UserId),
      LectureId: parseInt(LectureId),
      date,
      endDate,
    });

    if (!createResult) {
      return res.status(401).send("처리중 문제가 발생하였습니다.");
    }

    if (PaymentId) {
      await Payment.update(
        {
          UserId: parseInt(UserId),
        },
        {
          where: { id: parseInt(PaymentId) },
        }
      );

      return res.status(201).json({ result: true });
    }

    return res.status(201).json({ result: true });
  } catch (error) {
    console.error(error);
    return res.status(401).send("강의에 참여시킬 수 없습니다.");
  }
});

router.patch("/update", isAdminCheck, async (req, res, next) => {
  const { partId, createdAt, endDate } = req.body;
  try {
    const exPart = await Participant.findOne({
      where: { id: parseInt(partId) },
    });

    if (!exPart) {
      return res.status(401).send("존재하지 않는 참여 내역입니다.");
    }

    const updateResult = await Participant.update(
      {
        createdAt,
        endDate,
      },
      {
        where: { id: parseInt(partId) },
      }
    );

    if (updateResult[0] > 0) {
      return res.status(200).json({ result: true });
    } else {
      return res.status(200).json({ result: false });
    }
  } catch (error) {
    console.error(error);
    return res.status(401).send("데이터를 수정할 수 없습니다.");
  }
});

// 연장수당 (학생 수업연장 update 및 강사 연장 수당. 기존 part에서 endDate, date 변경 및 teacherPay 데이터 생성)
// router.patch("/termUpgrade", isAdminCheck, async(req,res,next) => {
//   try {

//   } catch (error) {
//     console.error(error)
//   }
// })

// 학생 강의에서 빼기
router.post("/delete", isAdminCheck, async (req, res, next) => {
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
      where: {
        UserId: parseInt(UserId),
        LectureId: parseInt(LectureId),
        isDelete: false,
        isChange: false,
      },
    });

    if (!partValidation) {
      return res
        .status(401)
        .send("해당 학생은 해당 강의에 참여하고 있지 않습니다.");
    }

    const updateResult = await Participant.update(
      {
        isDelete: true,
      },
      {
        where: { UserId: parseInt(UserId), LectureId: parseInt(LectureId) },
      }
    );

    if (updateResult[0] > 0) {
      return res.status(200).json({ result: true });
    } else {
      return res.status(200).json({ result: false });
    }
  } catch (error) {
    console.error(error);
    return res.status(401).send("학생의 강의를 옮길 수 없습니다.");
  }
});

// 반 옮긴 학생 리스트

router.post("/user/delete/list", isAdminCheck, async (req, res, next) => {
  const { UserId, isDelete, isChange } = req.body;

  let _isDelete = isDelete || null;
  let _isChange = isChange || null;

  try {
    const exUser = await User.findOne({
      where: { id: parseInt(UserId) },
    });

    if (!exUser) {
      return res.status(401).send("존재하지 않는 학생입니다.");
    }

    if (exUser.level !== 1) {
      return res.status(401).send("해당 사용자는 학생이 아닙니다.");
    }

    const selectQuery = `
    SELECT	A.id,
            A.date,
            A.endDate,
            A.createdAt,
            A.updatedAt,
            A.LectureId,
            A.UserId,
            A.isDelete,
            B.number,
            B.time,
            B.course,
            B.day,
            B.UserId 						AS TeacherId,
            C.username          AS TeacherName
      FROM	participants	A
     INNER
      JOIN	lectures 			B	
        ON	A.LectureId = B.id
     INNER
      JOIN	users 			  C	
        ON	B.UserId = C.id
     WHERE	1 = 1
      ${_isDelete ? `AND A.isDelete = ${_isDelete}` : ``}
      ${_isChange ? `AND A.isChange = ${_isChange}` : ``}
       AND	A.UserId = ${UserId}
    `;

    const list = await models.sequelize.query(selectQuery);

    return res.status(200).json({ list: list[0] });
  } catch (error) {
    console.error(error);
    return res.status(401).send("반을 옮긴 학생 목록을 불러올 수 없습니다.");
  }
});

// 몇일 남았는지 체크
router.post("/user/limit/list", isAdminCheck, async (req, res, next) => {
  const { UserId } = req.body;

  const _UserId = UserId || null;

  try {
    if (_UserId) {
      const exUser = await User.findOne({
        where: { id: parseInt(UserId) },
      });

      if (!exUser) {
        return res.status(401).send("존재하지 않는 학생입니다.");
      }

      if (exUser.level !== 1) {
        return res.status(401).send("해당 사용자는 학생이 아닙니다.");
      }
    }

    const selectQuery = `
    SELECT	Z.id,
            Z.price,
            Z.email,
            Z.createdAt,
            Z.UserId,
            Z.PayClassId,
            Z.week,
            Z.LectureId,
            Z.number,
            Z.course,
            Z.day,
            Z.time,
            Z.teacherName,
            Z.studentName,
            Z.stuCountry,
            Z.limitDate,
            Z.compareDate,
            Z.mobile
     FROM (
                SELECT	A.id,
                        A.price,
                        A.email,
                        A.createdAt,
                        A.UserId,
                        A.PayClassId,
                        B.week,
                        B.LectureId,
                        C.number,
                        C.course,
                        C.day,
                        C.time,
                        D.username 					AS teacherName,
                        F.username 					AS studentName,
                        F.stuCountry,
                        F.mobile,
                        (
                          SELECT	DATEDIFF(DATE_ADD(DATE_FORMAT(B.startDate, "%Y-%m-%d"),  INTERVAL B.week WEEK), now())
                            FROM	DUAL
                        )	AS 	limitDate,
                        (
                          SELECT  DATE_ADD(DATE_FORMAT(B.startDate, "%Y-%m-%d"),  INTERVAL B.week WEEK)
                            FROM  DUAL
                        ) AS  compareDate
                  FROM	payments			A
                 INNER
                  JOIN	payClass 			B
                    ON	A.PayClassId = B.id
                 INNER
                  JOIN	lectures 			C
                    ON	B.LectureId = C.id
                 INNER
                  JOIN	users				  D
                    ON	C.UserId = D.id
                 INNER
                  JOIN	users				  F
                    ON	A.UserId = F.id
                 WHERE  1 = 1
                   ${_UserId ? `AND A.UserId = ${_UserId}` : ``}
   		    )	Z
   WHERE	DATE_ADD(DATE_FORMAT(now(), '%Y-%m-%d'), INTERVAL 7 DAY) >= Z.compareDate
   ORDER  BY limitDate ASC
    `;

    const list = await models.sequelize.query(selectQuery);

    return res.status(200).json({ list: list[0] });
  } catch (error) {
    console.error(error);
    return res.status(401).send("반을 옮긴 학생 목록을 불러올 수 없습니다.");
  }
});

router.post("/lastDate/list", isAdminCheck, async (req, res, next) => {
  const { search } = req.body;

  let _search = search ? search : ``;

  try {
    const selectQuery = `
    SELECT	Z.id,
            Z.price,
            Z.email,
            Z.createdAt,
            Z.UserId,
            Z.PayClassId,
            Z.week,
            Z.LectureId,
            Z.number,
            Z.course,
            Z.teacherName,
            Z.studentName,
            Z.stuCountry,
            Z.limitDate,
            Z.compareDate
     FROM (
                SELECT	A.id,
                        A.price,
                        A.email,
                        A.createdAt,
                        A.UserId,
                        A.PayClassId,
                        B.week,
                        B.LectureId,
                        C.number,
                        C.course,
                        D.username 					AS teacherName,
                        F.username 					AS studentName,
                        F.stuCountry,
                        (
                          SELECT	DATEDIFF(DATE_ADD(DATE_FORMAT(B.startDate, "%Y-%m-%d"),  INTERVAL B.week WEEK), now())
                            FROM	DUAL
                        )	AS 	limitDate,
                        (
                          SELECT  DATE_ADD(DATE_FORMAT(B.startDate, "%Y-%m-%d"),  INTERVAL B.week WEEK)
                            FROM  DUAL
                        ) AS  compareDate
                  FROM	payments			A
                 INNER
                  JOIN	payClass 			B
                    ON	A.PayClassId = B.id
                 INNER
                  JOIN	lectures 			C
                    ON	B.LectureId = C.id
                 INNER
                  JOIN	users				D
                    ON	C.UserId = D.id
                 INNER
                  JOIN	users				F
                    ON	A.UserId = F.id
   		    )	Z
   WHERE	CONCAT(Z.limitDate, "일") LIKE '%${_search}%'
   ORDER  BY limitDate ASC
    `;

    const list = await models.sequelize.query(selectQuery);

    return res.status(200).json({ list: list[0] });
  } catch (error) {
    console.error(error);
    return res.status(401).send("목록을 불러올 수 없습니다.");
  }
});

module.exports = router;

/// 도메인/페이먼트/id
