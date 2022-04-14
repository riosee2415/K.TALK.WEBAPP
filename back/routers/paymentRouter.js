const express = require("express");
const { Op } = require("sequelize");
const isAdminCheck = require("../middlewares/isAdminCheck");
const { PayClass, Payment } = require("../models");
const models = require("../models");

const router = express.Router();

router.post("/list", isAdminCheck, async (req, res, next) => {
  const { email } = req.body;

  const _email = email ? email : ``;

  try {
    const selectQuery = `
    SELECT  A.id,
            A.price,
            A.email,
            A.createdAt,
            A.updatedAt,
            A.UserId,
            A.PayClassId,
            B.startDate,
            B.week,
            C.id                  AS LetureId,
            C.course
      FROM  payments		A
     INNER
      JOIN  payClass 		B
        ON  A.PayClassId = B.id
     INNER 
      JOIN  lectures 		C
        ON  B.LectureId = C.id
     WHERE  1 = 1
       ${_email ? `AND A.email LIKE '%${_email}%'` : ``}
    `;

    const list = await models.sequelize.query(selectQuery);

    return res.status(200).json({ list: list[0] });
  } catch (error) {
    console.error(error);
    return res.status(401).send("결제내역을 불러올 수 없습니다.");
  }
});

router.post("/create", async (req, res, next) => {
  const { price, email, PayClassId } = req.body;

  try {
    const exPayClass = await PayClass.findOne({
      where: { id: parseInt(PayClassId) },
    });

    if (!exPayClass) {
      return res.status(401).send("존재하지 않는 정보입니다.");
    }

    const createResult = await Payment.create({
      PayClassId: parseInt(PayClassId),
      email,
      price,
    });

    if (!createResult) {
      return res.status(401).send("처리중 문제가 발생하였습니다.");
    }

    return res.status(201).json({ result: true });
  } catch (error) {
    console.error(error);
    return res.status(401).send("결제를 진행할 수 없습니다.");
  }
});

module.exports = router;
