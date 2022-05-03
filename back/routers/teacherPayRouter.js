const express = require("express");
const isAdminCheck = require("../middlewares/isAdminCheck");
const isLoggedIn = require("../middlewares/isLoggedIn");
const { TeacherPay, Lecture } = require("../models");
const models = require("../models");

const router = express.Router();

//강사가 볼 리스트
router.post("/teacher/list", isLoggedIn, async (req, res, next) => {
  const { searchDate, endDate, type, page, LectureId } = req.body;

  if (!req.user) {
    return res.status(403).send("로그인 후 이용 가능합니다.");
  }

  if (req.user.level !== 2) {
    return res.status(401).send("강사만 조회가 가능합니다.");
  }

  const LIMIT = 10;

  const _page = page ? page : 1;

  const __page = _page - 1;
  const OFFSET = __page * 10;

  const _searchDate = searchDate || ``;

  const _endDate = endDate || ``;

  const _type = type || ``;

  const _LectureId = LectureId || null;

  try {
    const lengthQuery = `
    SELECT	A.id,
            A.type,
            A.price,
            DATE_FORMAT(A.createdAt, "%Y-%m-%d")				AS createdAt,
            DATE_FORMAT(A.updatedAt, "%Y-%m-%d")				AS updatedAt,
            A.UserId,
            A.LectureId,
            B.profileImage,
            B.username,
            B.mobile,
            B.email,
            B.bankNo,
            B.bankName,
            C.number,
            C.course
    FROM	teacherPays		A
   INNER
    JOIN	users			B
      ON	A.UserId = B.id
   INNER
    JOIN	lectures	    C
      ON	A.LectureId = C.id
   WHERE	1 = 1
     AND	B.isFire = FALSE
     AND	C.isDelete = FALSE
     AND    A.type LIKE '%${_type}%'
     ${
       _searchDate !== ``
         ? `AND DATE_FORMAT(A.createdAt, '%Y-%m-%d') >= DATE_FORMAT('${_searchDate}', '%Y-%m-%d') `
         : ``
     }
      ${
        _endDate !== ``
          ? `AND DATE_FORMAT(A.createdAt, '%Y-%m-%d') <= DATE_FORMAT('${_endDate}', '%Y-%m-%d') `
          : ``
      }
     ${_LectureId ? `AND A.LectureId = ${_LectureId}` : ``}
    `;

    const selectQuery = `
    SELECT	A.id,
            A.type,
            A.price,
            DATE_FORMAT(A.createdAt, "%Y-%m-%d")				AS createdAt,
            DATE_FORMAT(A.updatedAt, "%Y-%m-%d")				AS updatedAt,
            A.UserId,
            A.LectureId,
            B.profileImage,
            B.username,
            B.mobile,
            B.email,
            B.bankNo,
            B.bankName,
            C.number,
            C.course
    FROM	teacherPays		A
   INNER
    JOIN	users			B
      ON	A.UserId = B.id
   INNER
    JOIN	lectures	    C
      ON	A.LectureId = C.id
   WHERE	1 = 1
     AND	B.isFire = FALSE
     AND	C.isDelete = FALSE
     AND  A.type LIKE '%${_type}%'
     ${
       _searchDate !== ``
         ? `AND DATE_FORMAT(A.createdAt, '%Y-%m-%d') >= DATE_FORMAT('${_searchDate}', '%Y-%m-%d') `
         : ``
     }
      ${
        _endDate !== ``
          ? `AND DATE_FORMAT(A.createdAt, '%Y-%m-%d') <= DATE_FORMAT('${_endDate}', '%Y-%m-%d') `
          : ``
      }
     ${_LectureId ? `AND A.LectureId = ${_LectureId}` : ``}
   ORDER   BY A.createdAt DESC
   LIMIT   ${LIMIT}
  OFFSET   ${OFFSET}
    `;

    const length = await models.sequelize.query(lengthQuery);
    const teacherPay = await models.sequelize.query(selectQuery);

    let newprice = 0;

    await Promise.all(
      teacherPay[0].map((data) => {
        newprice += data.price;
      })
    );

    const teacherPaylen = length[0].length;

    const lastPage =
      teacherPaylen % LIMIT > 0
        ? teacherPaylen / LIMIT + 1
        : teacherPaylen / LIMIT;

    return res.status(200).json({
      teacherPay: teacherPay[0],
      lastPage: parseInt(lastPage),
      newprice,
    });
  } catch (error) {
    console.error(error);
    return res.status(401).send("강의료 산정 목록을 불러올 수 없습니다.");
  }
});

//관리자가 볼 리스트
router.post("/admin/list", isAdminCheck, async (req, res, next) => {
  const { TeacherId, searchDate, endDate, type, LectureId } = req.body;

  const _searchDate = searchDate || ``;

  const _endDate = endDate || ``;

  const _type = type || ``;

  const _LectureId = LectureId || null;
  const _TeacherId = TeacherId || null;

  try {
    const selectQuery = `
    SELECT	A.id,
            A.type,
            A.price,
            DATE_FORMAT(A.createdAt, "%Y-%m-%d")				AS createdAt,
            DATE_FORMAT(A.updatedAt, "%Y-%m-%d")				AS updatedAt,
            A.UserId,
            A.LectureId,
            B.profileImage,
            B.username,
            B.mobile,
            B.email,
            B.bankNo,
            B.bankName,
            C.number,
            C.course
    FROM	teacherPays		A
   INNER
    JOIN	users			B
      ON	A.UserId = B.id
   INNER
    JOIN	lectures	    C
      ON	A.LectureId = C.id
   WHERE	1 = 1
     AND	B.isFire = FALSE
     AND	C.isDelete = FALSE
     AND    A.type LIKE '%${_type}%'
     ${
       _searchDate !== ``
         ? `AND DATE_FORMAT(A.createdAt, '%Y-%m-%d') >= DATE_FORMAT('${_searchDate}', '%Y-%m-%d') `
         : ``
     }
      ${
        _endDate !== ``
          ? `AND DATE_FORMAT(A.createdAt, '%Y-%m-%d') <= DATE_FORMAT('${_endDate}', '%Y-%m-%d') `
          : ``
      }
     ${_LectureId ? `AND A.LectureId = ${_LectureId}` : ``}
     ${_TeacherId ? `AND A.UserId = ${_TeacherId}` : ``}
   ORDER   BY A.createdAt DESC
   `;

    const teacherPay = await models.sequelize.query(selectQuery);

    let newprice = 0;

    await Promise.all(
      teacherPay[0].map((data) => {
        newprice += data.price;
      })
    );

    return res.status(200).json({ teacherPay: teacherPay[0], newprice });
  } catch (error) {
    console.error(error);
    return res.status(401).send("강의료 산정 목록을 불러올 수 없습니다.");
  }
});

// 회의 수당
router.post("/create", isLoggedIn, async (req, res, next) => {
  const { price, LectureId } = req.body;

  if (!req.user) {
    return res.status(403).send("로그인 후 이용 가능합니다.");
  }

  if (req.user.level !== 2) {
    return res.status(401).send("강사만 조회가 가능합니다.");
  }

  try {
    const exLecture = await Lecture.findOne({
      where: { id: parseInt(LectureId) },
    });

    if (!exLecture) {
      return res.status(401).send("존재하지 않는 강의입니다.");
    }

    if (exLecture.UserId !== req.user.id) {
      return res
        .status(401)
        .send("자신의 강의만 회의수당을 작성할 수 있습니다.");
    }

    const createResult = await TeacherPay.create({
      type: "회의수당",
      price,
      LectureId: parseInt(LectureId),
      UserId: parseInt(req.user.id),
    });

    if (!createResult) {
      return res.status(401).send("처리중 문제가 발생하였습니다.");
    }

    return res.status(201).json({ result: true });
  } catch (error) {
    console.error(error);
    return res.status(401).send("회의수당을 작성할 수 없습니다.");
  }
});
module.exports = router;
