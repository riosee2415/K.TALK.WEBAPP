const express = require("express");
const isAdminCheck = require("../middlewares/isAdminCheck");
const { User } = require("../models");

const router = express.Router();

router.get("/list", isAdminCheck, async (req, res, next) => {
  const { search } = req.query;

  const _search = search ? search : null;
  try {
  } catch (error) {
    console.error(error);
    return res.status(401).send("결제내역을 불러올 수 없습니다.");
  }
});

router.post("/create", async (req, res, next) => {
  const { price, email, PayClassId } = req.body;
  try {
    const exUser = await User.findOne({
      where: { email },
    });

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
      UserId: exUser ? exUser.id : null,
    });
  } catch (error) {
    console.error(error);
    return res.status(401).send("결제를 진행할 수 없습니다.");
  }
});

module.exports = router;
