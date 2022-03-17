const express = require("express");

const router = express.Router();

router.get("/list", async (req, res, next) => {
  try {
  } catch (error) {
    console.error(error);
    return res.status(401).send("출석 목록을 불러올 수 없습니다.");
  }
});

router.post("/create", async (req, res, next) => {
  try {
  } catch (error) {
    console.error(error);
    return res.status(401).send("출석 목록을 불러올 수 없습니다.");
  }
});

router.patch("/update", async (req, res, next) => {
  try {
  } catch (error) {
    console.error(error);
    return res.status(401).send("출석 목록을 불러올 수 없습니다.");
  }
});

router.delete("/delete/:commuteId", async (req, res, next) => {
  try {
  } catch (error) {
    console.error(error);
    return res.status(401).send("출석 목록을 불러올 수 없습니다.");
  }
});

module.exports = router;
