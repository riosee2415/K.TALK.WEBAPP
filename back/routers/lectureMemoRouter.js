const express = require("express");
const isAdminCheck = require("../middlewares/isAdminCheck");
const isNanCheck = require("../middlewares/isNanCheck");
const { Lecture, LectureMemo } = require("../models");
const models = require("../models");

const router = express.Router();

router.post("/list", isAdminCheck, async (req, res, next) => {
  const { LectureId } = req.body;
  try {
    const exLecture = await Lecture.findOne({
      where: { id: parseInt(LectureId) },
    });

    if (!exLecture) {
      return res.status(401).send("존재하지 않는 강의 정보입니다.");
    }

    const selectQuery = `
        SELECT  id,
                title,
                content,
                isDelete,
                DATE_FORMAT(createdAt, "%Y년 %m월 %d일")        AS  createdAt,
                LectureId
          FROM  lectureMemos
         WHERE  isDelete = FALSE
           AND  LectureId = ${LectureId}
         ORDER  BY createdAt DESC
    `;

    const list = await models.sequelize.query(selectQuery);

    return res.status(200).json({ list: list[0] });
  } catch (error) {
    console.error(error);
    return res.status(401).send("강의 메모 목록을 불러올 수 없습니다.");
  }
});

router.post("/create", isAdminCheck, async (req, res, next) => {
  const { title, content, LectureId } = req.body;
  try {
    const exLecture = await Lecture.findOne({
      where: { id: parseInt(LectureId) },
    });

    if (!exLecture) {
      return res.status(401).send("존재하지 않는 강의입니다.");
    }

    const createResult = await LectureMemo.create({
      title,
      content,
      LectureId: parseInt(LectureId),
    });

    if (!createResult) {
      return res.status(401).send("처리중 문제가 발생하였습니다.");
    }

    return res.status(201).json({ result: true });
  } catch (error) {
    console.error(error);
    return res.status(401).send("강의 메모를 작성할 수 없습니다.");
  }
});

router.patch("/update", isAdminCheck, async (req, res, next) => {
  const { id, title, content } = req.body;
  try {
    const exLectureMemo = await LectureMemo.findOne({
      where: { id: parseInt(id) },
    });

    if (!exLectureMemo) {
      return res.status(401).send("존재하지 않는 강의메모 입니디.");
    }

    if (exLectureMemo.isDelete) {
      return res.status(401).send("이미 삭제된 강의 메모입니다.");
    }

    const updateResult = await LectureMemo.update(
      {
        title,
        content,
      },
      {
        where: { id: parseInt(id) },
      }
    );

    if (updateResult[0] > 0) {
      return res.status(200).json({ result: true });
    } else {
      return res.status(200).json({ result: true });
    }
  } catch (error) {
    console.error(error);
    return res.status(401).send("강의 메모를 수정할 수 없습니다.");
  }
});

router.delete("/delete/:memoId", isAdminCheck, async (req, res, next) => {
  const { memoId } = req.params;

  if (isNanCheck(memoId)) {
    return res.status(401).send("잘못된 요청입니다.");
  }

  try {
    const exLectureMemo = await LectureMemo.findOne({
      where: { id: parseInt(memoId) },
    });

    if (!exLectureMemo) {
      return res.status(401).send("존재하지 않는 강의 메모입니다.");
    }

    if (exLectureMemo.isDelete) {
      return res.status(401).send("이미 삭제된 강의 메모입니다.");
    }

    const deleteResult = await LectureMemo.update(
      {
        isDelete: true,
      },
      {
        where: { id: parseInt(memoId) },
      }
    );

    if (deleteResult[0] > 0) {
      return res.status(200).json({ result: true });
    } else {
      return res.status(200).json({ result: true });
    }
  } catch (error) {
    console.error(error);
    return res.status(401).send("강의 메모를 삭제할 수 없습니다.");
  }
});

module.exports = router;
