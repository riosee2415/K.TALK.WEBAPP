const express = require("express");
const isAdminCheck = require("../middlewares/isAdminCheck");
const isLoggedIn = require("../middlewares/isLoggedIn");
const isNanCheck = require("../middlewares/isNanCheck");
const { User, Lecture, Message, Participant } = require("../models");
const models = require("../models");

const router = express.Router();

router.get("/user/list", isLoggedIn, async (req, res, next) => {
  if (!req.user) {
    return res.status(403).send("로그인 후 이용 가능합니다.");
  }

  try {
    const selectQuery = `
    SELECT	id,
            title,
            author,
            senderId,
            receiverId,
            receiveLectureId,
            content,
            level,
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

// listType이 1이라면 학생에게 온 쪽지 조회 2라면 강사에게 온 쪽지 조회 3이라면 전체 조회
router.post("/admin/list", isAdminCheck, async (req, res, next) => {
  const { listType, search } = req.body;

  if (!req.user) {
    return res.status(403).send("로그인 후 이용 가능합니다.");
  }

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

  let _search = search ? search : "";

  try {
    const selectQuery = `
    SELECT	id,
            title,
            author,
            senderId,
            receiverId,
            receiveLectureId,
            content,
            level,
            DATE_FORMAT(createdAt, "%Y년 %m월 %d일 %H시 %i분 %s초") 			AS	createdAt,
            DATE_FORMAT(updatedAt, "%Y년 %m월 %d일 %H시 %i분 %s초") 			AS	updatedAt
      FROM	Messages
     WHERE  1 = 1
            ${_search ? `AND author LIKE '%${_search}%'` : ``}
            ${
              _listType === 1
                ? `AND level = 1`
                : _listType === 2
                ? `AND level = 2`
                : _listType === 3
                ? ``
                : ``
            }
    ORDER   BY createdAt DESC 
    `;

    const messages = await models.sequelize.query(selectQuery);

    return res.status(200).json({ messages: messages[0] });
  } catch (error) {
    console.error(error);
    return res.status(401).send("쪽지를 확인할 수 없습니다.");
  }
});

router.get("/detail/:messageId", async (req, res, next) => {
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
            title,
            author,
            senderId,
            receiverId,
            receiveLectureId,
            content,
            level,
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

// 사용자가 강사에게 쪽지를 보낼때 필요한 리스트
router.get("/teacherList", isLoggedIn, async (req, res, next) => {
  if (!req.user) {
    return res.status(403).send("로그인 후 이용 가능합니다.");
  }
  try {
    const parts = await Participant.findAll({
      where: { UserId: parseInt(req.user.id) },
    });

    if (parts.length === 0) {
      return res.status(401).send("참여중인 강의가 없습니다.");
    }

    let users = [];

    await Promise.all(
      parts.map(async (data) => {
        users = await Lecture.findAll({
          where: { id: parseInt(data.LectureId) },
        });
      })
    );

    let teachers = [];

    await Promise.all(
      users.map(async (data) => {
        teachers = await User.findAll({
          where: { id: parseInt(data.TeacherId) },
        });
      })
    );

    return res.status(200).json(teachers);
  } catch (error) {
    console.error(error);
    return res.status(401).send("강사 목록을 불러올 수 없습니다.");
  }
});

router.post("/create", async (req, res, next) => {
  const {
    title,
    author,
    senderId,
    receiverId,
    receiveLectureId,
    content,
    level,
  } = req.body;
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
      title,
      author,
      senderId: parseInt(senderId),
      receiverId: parseInt(receiverId),
      receiveLectureId: receiveLectureId ? parseInt(receiveLectureId) : null,
      content,
      level,
    });

    if (!createResult) {
      return res.status(401).send("처리중 문제가 발생하였습니다.");
    }

    return res.status(201).json({ result: true });
  } catch (error) {
    console.error(error);
    return res.status(401).send("쪽지를 확인할 수 없습니다.");
  }
});

//관리자에게 쓰기
router.post("/forAdminCreate", isLoggedIn, async (req, res, next) => {
  const { title, author, content } = req.body;

  if (!req.user) {
    return res.status(403).send("로그인 후 이용 가능합니다.");
  }

  try {
    const exAdmin = await User.findAll({
      where: { level: 4 },
    });

    if (exAdmin === 0) {
      return res.status(401).send("관리자가 존재하지 않습니다.");
    }

    await Promise.all(
      exAdmin.map(async (data) => {
        await Message.create({
          title,
          author,
          senderId: parseInt(req.user.id),
          receiverId: parseInt(data.id),
          content,
          level: parseInt(req.user.level),
        });
      })
    );

    return res.status(201).json({ result: true });
  } catch (error) {
    console.error(error);
    return res.status(401).send("관리자에게 쪽지를 쓸 수 없습니다.");
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

// 단체로 보내기 (한명만 보내기도 가능)

router.post("/many/create", isLoggedIn, async (req, res, next) => {
  const { title, author, content, receiverId } = req.body;

  if (!req.user) {
    return res.status(403).send("잘못된 요청입니다.");
  }

  if (!Array.isArray(receiverId)) {
    return res.status(401).send("잘못된 요청입니다.");
  }

  try {
    await Promise.all(
      receiverId.map(async (data) => {
        await Message.create({
          receiverId: parseInt(data),
          senderId: parseInt(req.user.id),
          title,
          author,
          content,
        });
      })
    );

    return res.status(201).json({ result: true });
  } catch (error) {
    console.error(error);
    return res.status(401).send("쪽지를 보낼 수 없습니다.");
  }
});

// 모든 사용자에게 보내기 (type 1은 학생, type2는 강사, type3은 전체)
router.post("/all/create", isAdminCheck, async (req, res, next) => {
  const { type, title, author, content } = req.body;

  if (!req.user) {
    return res.status(403).send("잘못된 요청입니다.");
  }

  try {
    const users = await User.findAll({});

    if (type === 1) {
      const students = await User.findAll({
        where: { level: 1 },
      });

      await Promise.all(
        students.map(async (data) => {
          await Message.create({
            receiverId: parseInt(data.id),
            senderId: parseInt(req.user.level),
            title,
            author,
            content,
            level: parseInt(req.user.id),
          });
        })
      );

      return res.status(201).json({ result: true });
    }

    if (type === 2) {
      const teachers = await User.findAll({
        where: { level: 2 },
      });

      await Promise.all(
        teachers.map(async (data) => {
          await Message.create({
            receiverId: parseInt(data.id),
            senderId: parseInt(req.user.level),
            title,
            author,
            content,
            level: parseInt(req.user.id),
          });
        })
      );

      return res.status(201).json({ result: true });
    }

    await Promise.all(
      users.map(async (data) => {
        await Message.create({
          receiverId: parseInt(data.id),
          senderId: parseInt(req.user.level),
          title,
          author,
          content,
          level: parseInt(req.user.id),
        });
      })
    );

    return res.status(201).json({ result: true });
  } catch (error) {
    console.error(error);
    return res.status(401).send("쪽지를 보낼 수 없습니다.");
  }
});

//강의 단위로 메시지 보내기

router.post("/lecture/create", isAdminCheck, async (req, res, next) => {
  const { title, content, author, LectureId } = req.body;
  try {
    const exLecture = await Lecture.findOne({
      where: { id: parseInt(LectureId) },
    });

    if (!exLecture) {
      return res.status(401).send("존재하지 않는 강의 입니다.");
    }

    const userList = await Participant.findAll({
      where: { LectureId: parseInt(LectureId) },
    });

    if (userList.length === 0) {
      return res.status(401).send("해당 강의에 참여하고 있는 학생이 없습니다.");
    }

    await Promise.all(
      userList.map(async (data) => {
        await Message.create({
          title,
          content,
          author,
          receiveLectureId: parseInt(LectureId),
          senderId: parseInt(req.user.id),
          receiverId: parseInt(data.UserId),
          level: parseInt(req.user.level),
        });
      })
    );

    return res.status(201).json({ result: true });
  } catch (error) {
    console.error(error);
    return res.status(401).send("쪽지를 보낼 수 없습니다.");
  }
});

module.exports = router;
