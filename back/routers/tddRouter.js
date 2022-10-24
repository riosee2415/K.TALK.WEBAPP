const express = require("express");
const isAdminCheck = require("../middlewares/isAdminCheck");
const isLoggedIn = require("../middlewares/isLoggedIn");

const models = require("../models");

const router = express.Router();

router.post("/list", async (req, res, next) => {
  const { lectureId } = req.body;

  const selectQ = `
    SELECT	A.id,
  			A.isDelete,
  			A.isChange,
  			A.date,
  			DATE_FORMAT(A.endDate, "%Y년 %m월 %d일")		as viewEndDate,
  			DATE_FORMAT(A.createdAt, "%Y년 %m월 %d일")		as viewCreatedAt,
  			DATE_FORMAT(A.endDate, "%Y년 %m월 %d일")		as viewUpdatedAt,
  			A.UserId,
  			A.LectureId,
  			B.day,
  			B.count
	FROM	participants		A
   INNER
    JOIN	lectures 			B
      ON	A.LectureId = B.id
   WHERE	A.isDelete = 0
     AND	A.LectureId = ${lectureId}
     AND    B.isDelete = 0
  `;

  try {
    const list = await models.sequelize.query(selectQ);

    return res.status(200).json(list[0]);
  } catch (error) {
    console.error(error);
    return res.status(401).send("데이터를 조회할 수 없습니다.");
  }
});

///

///

module.exports = router;
