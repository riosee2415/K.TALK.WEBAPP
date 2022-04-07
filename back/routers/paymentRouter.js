const express = require("express");
const { Op } = require("sequelize");
const isAdminCheck = require("../middlewares/isAdminCheck");
const { PayClass, Payment } = require("../models");

const router = express.Router();

router.get("/list", isAdminCheck, async (req, res, next) => {
  const { email } = req.query;

  const _email = email ? email : ``;

  try {
    const list = await Payment.findAll({
      where: {
        email: {
          [Op.like]: `%${_email}%`,
        },
      },
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json(list);
  } catch (error) {
    console.error(error);
    return res.status(401).send("결제내역을 불러올 수 없습니다.");
  }
});

router.post("/create", async (req, res, next) => {
  const { price, email, PayClassId } = req.body;

  try {
    const exPayClass = await PayClass.findOne({
      where: { PayClassId: parseInt(PayClassId) },
    });

    if (!exPayClass) {
      return res.status(401).send();
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
