const express = require("express");
const { Op } = require("sequelize");
const isAdminCheck = require("../middlewares/isAdminCheck");
const isLoggedIn = require("../middlewares/isLoggedIn");
const { PayClass, Payment, User } = require("../models");
const models = require("../models");

const router = express.Router();

router.post("/user/list", isLoggedIn, async (req, res, next) => {
  try {
    const selectQuery = `
    SELECT  ROW_NUMBER() OVER(ORDER BY A.createdAt)     AS num,
            A.id,
            A.price,
            A.email,
            A.type,
            A.name,
            A.lectureId,
            A.isComplete,
            DATE_FORMAT(A.completedAt, "%Y-%m-%d")      AS completedAt,
            A.createdAt,
            DATE_FORMAT(A.createdAt, "%Y-%m-%d")        AS viewCreatedAt,
            A.updatedAt,
            A.bankNo,
            A.UserId,
            A.PayClassId,
            B.startDate,
            B.week,
            C.id                  AS LetureId,
            C.course,
            D.username            AS teacherName
      FROM  payments		A
     INNER
      JOIN  payClass 		B
        ON  A.PayClassId = B.id
     INNER 
      JOIN  lectures 		C
        ON  A.lectureId = C.id
     INNER 
      JOIN  users 		  D
        ON  C.UserId = D.id
     WHERE  1 = 1
       AND  A.UserId = ${req.user.id}
     ORDER  BY num DESC
    `;

    const list = await models.sequelize.query(selectQuery);

    return res.status(200).json({ list: list[0] });
  } catch (error) {
    console.error(error);
    return res.status(401).send("결제내역을 불러올 수 없습니다.");
  }
});

router.post("/list", isAdminCheck, async (req, res, next) => {
  const { email, type, listType } = req.body;

  const _email = email ? email : ``;

  const _type = type ? type : ``;

  let nanFlag = isNaN(listType);

  if (!listType) {
    nanFlag = false;
  }

  if (nanFlag) {
    return res.status(400).send("잘못된 요청 입니다.");
  }

  let _listType = Number(listType);

  if (_listType > 3 || !listType) {
    _listType = 3;
  }

  try {
    const selectQuery = `
    SELECT  A.id,
            A.price,
            A.email,
            A.type,
            A.name,
            A.lectureId,
            A.isComplete,
            DATE_FORMAT(A.completedAt, "%Y-%m-%d")      AS completedAt,
            A.createdAt,
            A.updatedAt,
            A.bankNo,
            A.UserId,
            A.PayClassId,
            B.startDate,
            B.week,
            C.id                  AS LetureId,
            C.course,
            C.number,
            D.username            AS teacherName
      FROM  payments		A
     INNER
      JOIN  payClass 		B
        ON  A.PayClassId = B.id
     INNER 
      JOIN  lectures 		C
        ON  A.lectureId = C.id
     INNER 
      JOIN  users 		  D
        ON  C.UserId = D.id
     WHERE  1 = 1
       ${_email ? `AND A.email LIKE '%${_email}%'` : ``}
       ${_type !== `` ? `AND A.type ='${_type}'` : ``}
       ${
         _listType === 1
           ? `AND A.isComplete = FALSE`
           : _listType === 2
           ? `AND A.isComplete = TRUE`
           : _listType === 3
           ? ``
           : ``
       }
     ORDER  BY A.createdAt DESC
    `;

    const list = await models.sequelize.query(selectQuery);

    return res.status(200).json({ list: list[0] });
  } catch (error) {
    console.error(error);
    return res.status(401).send("결제내역을 불러올 수 없습니다.");
  }
});

router.post("/create", async (req, res, next) => {
  const { type, price, email, PayClassId, name, bankNo, lectureId } = req.body;

  try {
    const exPayClass = await PayClass.findOne({
      where: { id: parseInt(PayClassId) },
    });

    if (!exPayClass) {
      return res.status(401).send("존재하지 않는 정보입니다.");
    }

    if (type === "계좌이체") {
      const createResult = await Payment.create({
        PayClassId: parseInt(PayClassId),
        email,
        price,
        type: "계좌이체",
        name,
        bankNo,
        isComplete: false,
        UserId: req.user ? req.user.id : null,
        lectureId,
      });

      if (!createResult) {
        return res.status(401).send("처리중 문제가 발생하였습니다.");
      }

      return res.status(201).json({ result: true });
    }

    if (type === "PayPal") {
      const createResult = await Payment.create({
        PayClassId: parseInt(PayClassId),
        email,
        price,
        type: "PayPal",
        name,
        isComplete: true,
        UserId: req.user ? req.user.id : null,
        lectureId,
      });

      if (!createResult) {
        return res.status(401).send("처리중 문제가 발생하였습니다.");
      }

      return res.status(201).json({ result: true });
    }
  } catch (error) {
    console.error(error);
    return res.status(401).send("결제를 진행할 수 없습니다.");
  }
});

router.patch("/update", async (req, res, next) => {
  const { id, UserId } = req.body;

  try {
    const exPayment = await Payment.findOne({
      where: { id: parseInt(id) },
    });

    if (!exPayment) {
      return res.status(401).send("존재하지 않는 결제정보 입니다.");
    }

    const exUser = await User.findOne({
      where: { id: parseInt(UserId) },
    });

    if (!exUser) {
      return res.status(401).send("존재하지 않는 사용자입니다.");
    }

    if (exPayment.email !== exUser.email) {
      return res
        .status(401)
        .send("사용자 정보가 해당 결제 내역과 일치하지 않습니다.");
    }

    const updateResult = await Payment.update(
      {
        UserId: parseInt(UserId),
      },
      {
        where: { id: parseInt(id) },
      }
    );

    if (updateResult[0] > 0) {
      return res.status(201).json({ result: true });
    } else {
      return res.status(201).json({ result: false });
    }
  } catch (error) {
    console.error(error);
    return res.status(401).send("결제를 진행할 수 없습니다.");
  }
});

router.patch("/price/update", isAdminCheck, async (req, res, next) => {
  const { id, price } = req.body;

  try {
    const exPayment = await Payment.findOne({
      where: { id: parseInt(id) },
    });

    if (!exPayment) {
      return res.status(401).send("존재하지 않는 결제정보 입니다.");
    }

    const updateResult = await Payment.update(
      {
        price: parseInt(price),
      },
      {
        where: { id: parseInt(id) },
      }
    );

    if (updateResult[0] > 0) {
      return res.status(201).json({ result: true });
    } else {
      return res.status(201).json({ result: false });
    }
  } catch (error) {
    console.error(error);
    return res.status(401).send("결제를 진행할 수 없습니다.");
  }
});

router.patch("/permit", isAdminCheck, async (req, res, next) => {
  const { id } = req.body;
  try {
    const exPayment = await Payment.findOne({
      where: { id: parseInt(id) },
    });

    if (!exPayment) {
      return res.status(401).send("존재하지 않는 결제정보 입니다.");
    }

    const updateResult = await Payment.update(
      {
        isComplete: true,
        completedAt: new Date(),
      },
      {
        where: { id: parseInt(id) },
      }
    );

    if (updateResult[0] > 0) {
      return res.status(201).json({ result: true });
    } else {
      return res.status(201).json({ result: false });
    }
  } catch (error) {
    console.error(error);
    return res.status(401).send("결제정보를 승인할 수 없습니다.");
  }
});

module.exports = router;
