const express = require("express");
const isAdminCheck = require("../middlewares/isAdminCheck");
const models = require("../models");

const router = express.Router();

router.post("/list", isAdminCheck, async (req, res, next) => {
  const { TeacherId } = req.body;
  try {
    const exTeacher = await User.findOne({
      where: { id: parseInt(TeacherId) },
    });

    if (!exTeacher) {
      return res.status(401).send("존재하지 않는 강사입니다.");
    }

    if (exTeacher.level !== 2) {
      return res.status(401).send("해당 사용자는 강사가 아닙니다.");
    }

    const selectQuery = `
  SELECT	A.id,
            A.isFire,
            DATE_FORMAT(A.partDate, "%Y년 %m월 %d일 %H시 %i분 %s초") 			AS	createdAt,
            DATE_FORMAT(A.fireDate, "%Y년 %m월 %d일 %H시 %i분 %s초") 			AS	updatedAt, 
            A.UserId,
            B.userId,
            B.email,
            B.username
    FROM	teacherParts			A
   INNER
    JOIN	users					B
      ON	A.UserId = B.id
   WHERE	A.UserId = ${TeacherId}
   ORDER	BY A.createdAt DESC
      `;

    const list = await models.sequelize.query(selectQuery);

    return res.status(200).json({ list: list[0] });
  } catch (error) {
    console.error(error);
    return res
      .status(401)
      .send("강사 해지 및 재등록 목록을 불러올 수 없습니다.");
  }
});

module.exports = router;
