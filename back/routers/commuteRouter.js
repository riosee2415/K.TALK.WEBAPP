const express = require("express");
const { Commute, Lecture, User, Participant } = require("../models");
const moment = require("moment");

const router = express.Router();

router.post("/list", async (req, res, next) => {
  const { LectureId, UserId } = req.body;
  try {
    return res.status(200).json({ exCommute, today });
  } catch (error) {
    console.error(error);
    return res.status(401).send("출석 목록을 불러올 수 없습니다.");
  }
});

// 출석 create
router.post("/create", async (req, res, next) => {
  const { time, LectureId, UserId } = req.body;
  try {
    const exLecture = await Lecture.findOne({
      where: { id: parseInt(LectureId) },
    });

    const exUser = await User.findOne({
      where: { id: parseInt(UserId) },
    });

    const exPart = await Participant.findOne({
      where: { LectureId: parseInt(LectureId), UserId: parseInt(UserId) },
    });

    if (!exLecture) {
      return res.status(401).send("존재하지 않는 강의입니다.");
    }

    if (!exUser) {
      return res.status(401).send("존재하지 않는 사용자입니다.");
    }

    if (!exPart) {
      return res
        .status(401)
        .send("해당 학생은 해당 강의에 참여하고 있지 않습니다.");
    }

    const exCommute = await Commute.findOne({
      where: { LectureId: parseInt(LectureId), UserId: parseInt(UserId) },
    });

    let extime = exCommute.time.substring(0, 10);

    const today = moment(time).format("YYYY-MM-DD");

    if (extime === today) {
      return res.status(401).send("이미 해당 학생은 강의에 출석했습니다.");
    }

    const createResult = await Commute.create({
      time,
      LectureId: parseInt(LectureId),
      UserId: parseInt(UserId),
    });

    if (!createResult) {
      return res.status(401).send("처리중 문제가 발생하였습니다.");
    }

    return res.status(201).json({ result: true });
  } catch (error) {
    console.error(error);
    return res.status(401).send("출석 목록을 불러올 수 없습니다.");
  }
});

module.exports = router;
