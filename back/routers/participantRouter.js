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

router.post("/last/list", async (req, res, next) => {
  const { lectureId, userId } = req.body;

  const _userId = userId ? userId : false;
  const _lectureId = lectureId ? lectureId : false;

  const MON = 1;
  const TUE = 2;
  const WHS = 3;
  const THS = 4;
  const FRI = 5;
  const SAT = 6;
  const SUN = 7;

  //   const TEMP_LECTUREID = 18;

  const selectQ = `
    SELECT	ROW_NUMBER()  OVER(ORDER BY C.username)      AS num,
            A.id,
            A.isDelete,
            A.isChange,
            A.date,
            DATE_FORMAT(A.endDate, "%Y년 %m월 %d일")		  AS viewEndDate,
            DATE_FORMAT(A.createdAt, "%Y년 %m월 %d일")		  AS viewCreatedAt,
            DATE_FORMAT(A.endDate, "%Y년 %m월 %d일")		  AS viewUpdatedAt,
            CASE
              WHEN	DATE_FORMAT(NOW(), "%Y%m%d") < DATE_FORMAT(A.endDate, "%Y%m%d") THEN DATEDIFF(DATE_FORMAT(A.endDate, "%Y%m%d"), DATE_FORMAT(NOW(), "%Y%m%d")) 
              ELSE    0
            END as compareDate,
            A.UserId,
            A.LectureId,
            B.course,
            B.day,
            B.count,
            C.userId,
            C.username,
            C.level,
            C.birth,
            C.stuCountry,
            CASE DAYOFWEEK(NOW()) 
              WHEN '1' THEN '7'
              WHEN '2' THEN '1'
              WHEN '3' THEN '2'
              WHEN '4' THEN '3'
              WHEN '5' THEN '4'
              WHEN '6' THEN '5'
              WHEN '7' THEN '6'
            END AS todayDay
      FROM	participants		A
     INNER
      JOIN	lectures 			B
        ON	A.LectureId = B.id
     INNER
      JOIN  users               C
        ON  A.UserId = C.id
     WHERE	A.isDelete = 0
       ${_userId ? `AND A.UserId = ${_userId}` : ``}
       ${_lectureId ? `AND	A.LectureId = ${_lectureId}` : ``}
       AND  B.isDelete = 0
       AND  A.isChange = 0
     ORDER  BY num ASC
  `;

  try {
    const list = await models.sequelize.query(selectQ);

    const datum = list[0];

    // 요일 숫자데이터 구하기
    datum.map((data) => {
      const tempDays = [];
      const arr = String(data.day).split(" ");

      arr.map((v) => {
        switch (v) {
          case "월":
            tempDays.push(MON);
            break;
          case "화":
            tempDays.push(TUE);
            break;
          case "수":
            tempDays.push(WHS);
            break;
          case "목":
            tempDays.push(THS);
            break;
          case "금":
            tempDays.push(FRI);
            break;
          case "토":
            tempDays.push(SAT);
            break;
          case "일":
            tempDays.push(SUN);
            break;

          default:
            break;
        }
      });

      data["afterDay"] = tempDays;
    });

    // 잔여 주 차 구하기
    datum.map((data) => {
      const compareDate = data.compareDate;

      const value =
        compareDate % 7 > 0
          ? parseInt(compareDate / 7) + 1
          : parseInt(compareDate / 7);

      data["ingyerWeek"] = value;
    });

    // 요일 갯 수 구하기
    datum.map((data) => {
      if (data.compareDate < 1) return null;

      const tempDay = [];

      let today = parseInt(data.todayDay);
      for (let i = 0; i < data.compareDate; i++) {
        if (today === 7) {
          today = 1;
        } else {
          today += 1;
        }

        tempDay.push(today);
      }

      data["dayList"] = tempDay;
    });

    // 남은 요일 갯수 구하기
    datum.map((data) => {
      if (data.compareDate < 1) return null;

      let cnt = 0;

      data.afterDay.map((v) => {
        data.dayList.map((v2) => {
          if (v === v2) {
            cnt += 1;
          }
        });
      });

      data["ingyerCnt"] = cnt;
    });

    return res.status(200).json(list[0]);
  } catch (error) {
    console.error(error);
    return res.status(401).send("데이터를 조회할 수 없습니다.");
  }
});

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
       AND  A.lectureId = ${LectureId}
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
              DATE_FORMAT(B.birth, "%Y년 %m월 %d일")                                   AS viewBirth,
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
         AND  A.lectureId = ${LectureId}
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

router.post("/student/notice/list", isLoggedIn, async (req, res, next) => {
  const { LectureId } = req.body;

  if (!req.user) {
    return res.status(403).send("로그인 후 이용 가능합니다.");
  }

  try {
    const exPart = await Participant.findOne({
      where: {
        UserId: parseInt(req.user.id),
        LectureId: parseInt(LectureId),
        isChange: false,
        isDelete: false,
      },
    });

    if (!exPart) {
      return res.status(401).send("해당 강의에 참여하고 있지 않습니다.");
    }

    const selectQuery = `
      SELECT  B.id,
              B.username,
              B.level
        FROM  participants    A
       INNER
        JOIN  users           B
          ON  A.UserId = B.id
       WHERE  A.isDelete = FALSE
         AND  A.isChange = FALSE
         AND  A.LectureId = ${LectureId}
    `;

    const list = await models.sequelize.query(selectQuery);

    return res.status(200).json({ list: list[0] });
  } catch (error) {
    console.error(error);
    return res.status(401).send("해당 강의의 학생 목록을 불러올 수 없습니다.");
  }
});

router.patch("/update", isAdminCheck, async (req, res, next) => {
  const { partId, createdAt, endDate, isPay, lectureId } = req.body;
  try {
    const exPart = await Participant.findOne({
      where: { id: parseInt(partId) },
    });

    if (!exPart) {
      return res.status(401).send("존재하지 않는 참여 내역입니다.");
    }

    const findUser = `
    SELECT  id,
            email,
            username
      FROM  users
     WHERE  id = ${exPart.UserId}
    `;

    const findUserData = await models.sequelize.query(findUser);

    const updateResult = await Participant.update(
      {
        createdAt,
        endDate,
      },
      {
        where: { id: parseInt(partId) },
      }
    );

    if (parseInt(isPay) === 1) {
      const insertQuery = `
      INSERT  INTO  payments
      (
        price,
        email,
        type,
        name,
        bankNo,
        isComplete,
        completedAt,
        UserId,
        lectureId,
        createdAt,
        updatedAt
      )
      VALUES
      (
        1,
        "${findUserData[0][0].email}",
        "-",
        "${findUserData[0][0].username}",
        null,
        1,
        NOW(),
        ${findUserData[0][0].id},
        ${lectureId},
        NOW(),
        NOW()
      )
      `;

      await models.sequelize.query(insertQuery);
    }

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

// 몇일 남았는지 체크 => 수업종료일기준으로 바뀌어야함
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
                    ON	A.lectureId = C.id
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

// 결제 만료일이 아니라 수업종료일이 보여져야함 그리고 남은일수가 아니라 남은 수업횟수로 체인지
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
                    ON	A.lectureId = C.id
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
