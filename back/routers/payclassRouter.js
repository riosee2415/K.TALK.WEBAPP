const express = require("express");
const { Op } = require("sequelize");
const isAdminCheck = require("../middlewares/isAdminCheck");
const isNanCheck = require("../middlewares/isNanCheck");
const { PayClass, Lecture } = require("../models");
const models = require("../models");
const moment = require("moment");

const router = express.Router();

router.get("/list", isAdminCheck, async (req, res, next) => {
  const { search } = req.query;

  const _search = search ? search : ``;

  try {
    const list = await PayClass.findAll({
      where: {
        name: {
          [Op.like]: `%${_search}%`,
        },
        isDelete: false,
      },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: Lecture,
        },
      ],
    });

    return res.status(200).json(list);
  } catch (error) {
    console.error(error);
    return res.status(401).send("결제 클래스 목록을 불러올 수 없습니다.");
  }
});

router.get("/class/detail", async (req, res, next) => {
  const { LectureId } = req.body;
  try {
    const exLecture = await Lecture.findOne({
      where: { id: parseInt(LectureId) },
    });

    if (!exLecture) {
      return res.status(401).send("존재하지 않는 강의입니다.");
    }

    const selectQuery = `
   SELECT A.id,
          A.name,
          A.price,
          A.discount,
          A.link,
          A.memo,
          A.startDate,
          A.week,
          A.isDelete,
          DATE_FORMAT(A.createdAt,"%Y-%m-%d")		AS createdAt,
          DATE_FORMAT(A.updatedAt,"%Y-%m-%d")		AS updatedAt,
          A.LectureId,
          B.number,
          B.course,
          C.username
     FROM payClass			A
    INNER
     JOIN lectures 			B
       ON A.LectureId = B.id
    INNER
     JOIN users 				C
       ON B.UserId = C.id
    WHERE A.isDelete = FALSE
      AND A.LectureId = ${LectureId}
    `;

    const result = await models.sequelize.query(selectQuery);

    return res.status(200).json({ result: result[0] });
  } catch (error) {
    console.error(error);
    return res.status(401).send("결제 클래스 목록을 불러올 수 없습니다.");
  }
});

router.get("/detail/:classId", async (req, res, next) => {
  const { classId } = req.params;

  if (isNanCheck(classId)) {
    return res.status(401).send("잘못된 요청입니다.");
  }

  try {
    const exClass = await PayClass.findOne({
      where: { id: parseInt(classId), isDelete: false },
      include: [
        {
          model: Lecture,
        },
      ],
    });

    if (!exClass) {
      return res.status(401).send("존재하지 않는 결제 클래스 정보입니다.");
    }

    return res.status(200).json(exClass);
  } catch (error) {
    console.error(error);
    return res.status(401).send("결제 클래스 정보를 불러올 수 없습니다.");
  }
});

router.post("/create", isAdminCheck, async (req, res, next) => {
  const { name, price, discount, memo, startDate, week, LectureId, domain } =
    req.body;

  try {
    const exLecture = await Lecture.findOne({
      where: { id: parseInt(LectureId) },
    });

    if (!exLecture) {
      return res.status(401).send("존재하지 않는 강의입니다.");
    }

    const createResult = await PayClass.create({
      name,
      price,
      discount,
      memo,
      startDate,
      week,
      LectureId: parseInt(LectureId),
    });

    if (!createResult) {
      return res.status(401).send("처리중 문제가 발생하였습니다.");
    }

    await PayClass.update(
      {
        link: `${domain}/${createResult.id}`,
      },
      {
        where: { id: parseInt(createResult.id) },
      }
    );

    return res.status(201).json({ result: true });
  } catch (error) {
    console.error(error);
    return res.status(401).send("결제 클래스를 생성할 수 없습니다.");
  }
});

router.delete("/delete/:classId", isAdminCheck, async (req, res, next) => {
  const { classId } = req.params;

  if (isNanCheck(classId)) {
    return res.status(401).send("잘못된 요청입니다.");
  }

  try {
    const exClass = await PayClass.findOne({
      where: { id: parseInt(classId), isDelete: false },
    });

    if (!exClass) {
      return res.status(401).send("존재하지 않는 결제 클래스 정보입니다.");
    }

    const deleteResult = await PayClass.update(
      { isDelete: true },
      {
        where: { id: parseInt(classId) },
      }
    );

    if (deleteResult[0] > 0) {
      return res.status(200).json({ result: true });
    } else {
      return res.status(200).json({ result: false });
    }
  } catch (error) {
    console.error(error);
    return res.status(401).send("결제 클래스를 삭제할 수 없습니다.");
  }
});

module.exports = router;
