const express = require("express");
const isLoggedIn = require("../middlewares/isLoggedIn");
const isNanCheck = require("../middlewares/isNanCheck");
const { User, Lecture, Message } = require("../models");
const models = require("../models");

const router = express.Router();

router.get("/list", isLoggedIn, async (req, res, next) => {
  if (!req.user) {
    return res.status(403).send("로그인 후 이용 가능합니다.");
  }

  try {
    const selectQuery = `
    SELECT	id,
            senderId,
            receiverId,
            receiveLectureId,
            content,
            DATE_FORMAT(createdAt, "%Y년 %m월 %d일 %H시 %i분 %s초") 			AS	createdAt,
            DATE_FORMAT(updatedAt, "%Y년 %m월 %d일 %H시 %i분 %s초") 			AS	updatedAt
      FROM	Messages
     WHERE  receiverId = ${req.user.id}
    `;

    const messages = await models.sequelize.query(selectQuery);

    return res.status(200).json({ messages: messages[0] });
  } catch (error) {
    console.error(error);
    return res.status(401).send("쪽지를 확인할 수 없습니다.");
  }
});

router.get("/detail/:messageId", isLoggedIn, async (req, res, next) => {
  const { messageId } = req.params;

  if (!req.user) {
    return res.status(403).send("로그인 후 이용 가능합니다.");
  }

  if (isNanCheck(messageId)) {
    return res.status(401).send("잘못된 요청입니다.");
  }
  try {
    const exMessage = await Message.findOne({
      where: { id: parseInt(messageId) },
    });

    if (!exMessage) {
      return res.status(401).send("존재하지 않는 쪽지입니다.");
    }

    const selectQuery = `
    SELECT	id,
            senderId,
            receiverId,
            receiveLectureId,
            content,
            DATE_FORMAT(createdAt, "%Y년 %m월 %d일 %H시 %i분 %s초") 			AS	createdAt,
            DATE_FORMAT(updatedAt, "%Y년 %m월 %d일 %H시 %i분 %s초") 			AS	updatedAt
      FROM	Messages
     WHERE  id = ${messageId}
    `;

    const message = await models.sequelize.query(selectQuery);

    return res.status(200).json({ message: message[0] });
  } catch (error) {
    console.error(error);
    return res.status(401).send("쪽지를 확인할 수 없습니다.");
  }
});

router.post("/create", async (req, res, next) => {
  const { senderId, receiverId, receiveLectureId, content } = req.body;
  try {
    const exUser = await User.findOne({
      where: { id: parseInt(receiverId) },
    });

    if (!exUser) {
      return res.status(401).send("존재하지 않는 사용자입니다. [수신자]");
    }

    const exUser2 = await User.findOne({
      where: { id: parseInt(senderId) },
    });

    if (!exUser2) {
      return res.status(401).send("존재하지 않는 사용자입니다. [발신자]");
    }

    if (receiveLectureId) {
      const exLecture = await Lecture.findOne({
        where: { id: parseInt(receiveLectureId) },
      });

      if (!exLecture) {
        return res.status(401).send("존재하지 않는 강의입니다.");
      }
    }

    const createResult = await Message.create({
      senderId: parseInt(senderId),
      receiverId: parseInt(receiverId),
      receiveLectureId: receiveLectureId ? parseInt(receiveLectureId) : null,
      content,
    });

    if (!createResult) {
      return res.status(401).send("처리중 문제가 발생하였습니다.");
    }
  } catch (error) {
    console.error(error);
    return res.status(401).send("쪽지를 확인할 수 없습니다.");
  }
});

router.delete("/delete/:messageId", async (req, res, next) => {
  const { messageId } = req.params;

  if (isNanCheck(messageId)) {
    return res.status(401).send("잘못된 요청입니다.");
  }

  try {
    const exMessage = await Message.findOne({
      where: { id: parseInt(messageId) },
    });

    if (!exMessage) {
      return res.status(401).send("존재하지 않는 쪽지입니다.");
    }

    const deleteResult = await Message.update(
      {
        isDelete: true,
      },
      {
        where: { id: parseInt(messageId) },
      }
    );

    if (deleteResult[0] > 0) {
      return res.status(200).json({ result: true });
    } else {
      return res.status(200).json({ result: false });
    }
  } catch (error) {
    console.error(error);
    return res.status(401).send("쪽지를 확인할 수 없습니다.");
  }
});

module.exports = router;
