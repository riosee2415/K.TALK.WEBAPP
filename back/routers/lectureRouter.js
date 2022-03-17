const express = require("express");
const isLoggedIn = require("../middlewares/isLoggedIn");
const isNanCheck = require("../middlewares/isNanCheck");
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
              X.parti
              FROM	(
                      SELECT	DISTINCT
                              A.id,
                              A.course,
                              A.lecDate,
                              A.lecTime,
                              CONCAT(A.lecTime, "분")							AS viewLecTime,
                              A.startLv,
                              A.endLv,
                              CONCAT(A.startLv, " ~ ", A.endLv)				AS viewLv,
                              A.startDate,
                              A.endDate,
                              CONCAT(A.startDate, " ~ ", A.endDate)			AS viewDate,
                              A.memo,
                              A.price,
                              CONCAT(FORMAT(A.price, "000"), "원")				AS viewPrice,
                              DATE_FORMAT(A.createdAt, "%Y년 %m월 %d일")		AS createdAt,
                              CONCAT(COUNT(B.id) OVER(PARTITION BY B.LectureId), "명") AS parti
                        FROM	lectures		A
                        LEFT	OUTER
                        JOIN	participants	B
                          ON	A.id = B.LectureId
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

router.post("/create", async (req, res, next) => {
  try {
  } catch (error) {
    console.error(error);
    return res.status(401).send("강의를 등록할 수 없습니다.");
  }
});

router.patch("/update", async (req, res, next) => {
  try {
  } catch (error) {
    console.error(error);
    return res.status(401).send("강의를 수정할 수 없습니다.");
  }
});

router.delete("/delete/:lectureId", async (req, res, next) => {
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
module.exports = router;
