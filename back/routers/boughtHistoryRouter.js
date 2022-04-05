const express = require("express");
const isAdminCheck = require("../middlewares/isAdminCheck");

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

module.exports = router;
