const express = require("express");
const isAdminCheck = require("../middlewares/isAdminCheck");
const isLoggedIn = require("../middlewares/isLoggedIn");
const { Question, QuestionType, User } = require("../models");

const router = express.Router();

// QUESTION TYPE
router.get("/type/list/", async (req, res, next) => {
  try {
    const types = await QuestionType.findAll({
      where: { isDelete: false },
      order: [["value", "ASC"]],
    });

    return res.status(200).json(types);
  } catch (error) {
    console.error(error);
    return res.status(401).send("문의 유형을 불러올 수 없습니다.");
  }
});

router.post("/type/create", isAdminCheck, async (req, res, next) => {
  const { value } = req.body;

  try {
    await QuestionType.create({
      value,
    });

    return res.status(201).json({ result: true });
  } catch (error) {
    console.error(error);
    return res.status(401).send("새로운 유형을 등록할 수 없습니다.");
  }
});

router.patch("/type/update", isAdminCheck, async (req, res, next) => {
  const { id, value } = req.body;

  try {
    const exQuestionType = await QuestionType.findOne({
      where: { id: parseInt(id) },
    });

    if (!exQuestionType) {
      return res.status(401).send("존재하지 않는 유형 입니다.");
    }

    const updateResult = await QuestionType.update(
      {
        value,
      },
      {
        where: { id: parseInt(id) },
      }
    );

    if (updateResult[0] > 0) {
      return res.status(200).json({ result: true });
    } else {
      return res.status(200).json({ result: false });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(401)
      .send(
        "유형 데이터를 수정할 수 없습니다. 개발사에 문의해주세요. [CODE 065]"
      );
  }
});

router.delete(
  "/type/delete/:questionTypeId",
  isAdminCheck,
  async (req, res, next) => {
    const { questionTypeId } = req.params;

    try {
      const exQuestionType = await QuestionType.findOne({
        where: { id: parseInt(questionTypeId) },
      });

      if (!exQuestionType) {
        return res.status(401).send("존재하지 않는 유형 입니다.");
      }

      const updateResult = await QuestionType.update(
        {
          isDelete: true,
        },
        {
          where: { id: parseInt(questionTypeId) },
        }
      );

      if (updateResult[0] > 0) {
        return res.status(200).json({ result: true });
      } else {
        return res.status(200).json({ result: false });
      }
    } catch (error) {
      console.error(error);
      return res
        .status(401)
        .send(
          "유형 데이터를 삭제할 수 없습니다. 개발사에 문의해주세요. [CODE 066]"
        );
    }
  }
);

// QUESTION
router.get(
  ["/list/:listType", "/list"],
  isAdminCheck,
  async (req, res, next) => {
    const { listType } = req.params;

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
      let questions = [];

      switch (_listType) {
        case 1:
          questions = await Question.findAll({
            where: { isCompleted: false },
            include: [
              {
                model: User,
                attributes: ["id", "email", "nickname"],
              },
              {
                model: QuestionType,
              },
            ],
            //
          });
          break;
        case 2:
          questions = await Question.findAll({
            where: { isCompleted: true },
            include: [
              {
                model: User,
                attributes: ["id", "email", "nickname"],
              },
              {
                model: QuestionType,
              },
            ],
            //
          });
          break;
        case 3:
          questions = await Question.findAll({
            include: [
              {
                model: User,
                attributes: ["id", "email", "nickname"],
              },
              {
                model: QuestionType,
              },
            ],
          });
          break;
        default:
          break;
      }

      return res.status(200).json(questions);
    } catch (error) {
      console.error(error);
      return res
        .status(401)
        .send("문의 데이터를 가져올 수 없습니다. [CODE 036]");
    }
  }
);

router.post("/create", isLoggedIn, async (req, res, next) => {
  const { title, type, content } = req.body;

  try {
    const createResult = await Question.create({
      title,
      content,
      QuestionTypeId: parseInt(type),
      UserId: req.user.id,
    });

    return res.status(201).json({ result: true });
  } catch (error) {
    console.error(error);
    return res.status(401).send("문의 데이터를 생성할 수 없습니다. [CODE 037]");
  }
});

router.delete("/delete/:questionId", isAdminCheck, async (req, res, next) => {
  const { questionId } = req.params;

  try {
    const exQuestion = await Question.findOne({
      where: { id: parseInt(questionId) },
    });

    if (!exQuestion) {
      return res.status(401).send("존재하지 않는 문의 입니다.");
    }

    await Question.destroy({
      where: { id: parseInt(questionId) },
    });

    return res.status(200).json({ result: true });
  } catch (error) {
    console.error(error);
    return res.status(401).send("문의내용을 삭제할 수 없습니다. [CODE 036]");
  }
});

router.patch("/update", isAdminCheck, async (req, res, next) => {
  const { id, title, content, answer } = req.body;

  try {
    const exQuestion = await Question.findOne({
      where: { id: parseInt(id) },
    });

    if (!exQuestion) {
      return res.status(401).send("존재하지 않는 문의 입니다.");
    }

    const updateResult = await Question.update(
      {
        title,
        content,
        answer,
        answerdAt: new Date(),
        isCompleted: true,
      },
      {
        where: { id: parseInt(id) },
      }
    );

    if (updateResult[0] > 0) {
      return res.status(200).json({ result: true });
    } else {
      return res.status(200).json({ result: false });
    }
  } catch (error) {
    console.error(error);
    return res.status(401).send("문의내용을 수정할 수 없습니다. [CODE 035]");
  }
});

module.exports = router;
