const express = require("express");
const { Op } = require("sequelize");
const isAdminCheck = require("../middlewares/isAdminCheck");
const isNanCheck = require("../middlewares/isNanCheck");
const { PayClass, Lecture } = require("../models");
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

router.get("/detail/:classId", isAdminCheck, async (req, res, next) => {
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

    const today = moment().format("YYYY-MM-DD");

    if (new Date(exLecture.startDate) < new Date(today)) {
      return res
        .status(401)
        .send("해당 강의의 시작 날짜보다 이전 날짜를 선택할 수 없습니다.");
    }

    // 강의 날짜가 1주일 남았을 때 2주를 선택하면 나도록하는 에러

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
