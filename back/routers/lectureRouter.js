const express = require("express");
const isLoggedIn = require("../middlewares/isLoggedIn");
const isNanCheck = require("../middlewares/isNanCheck");

const router = express.Router();

router.get("/list", isLoggedIn, async (req, res, next) => {
  if (!req.user) {
    return res.status(403).send("로그인 후 이용 가능합니다.");
  }
  try {
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
