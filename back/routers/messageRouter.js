const express = require("express");
const isAdminCheck = require("../middlewares/isAdminCheck");
const isLoggedIn = require("../middlewares/isLoggedIn");
const isNanCheck = require("../middlewares/isNanCheck");
const { User, Lecture, Message, Participant } = require("../models");
const models = require("../models");

const router = express.Router();

// 쪽지 사용자 리스트 (강사 or 학생)

router.get("/user/list", isLoggedIn, async (req, res, next) => {
  const { page } = req.query;

  if (!req.user) {
    return res.status(403).send("Please log in");
  }

  const LIMIT = 5;

  const _page = page ? page : 1;

  const __page = _page - 1;
  const OFFSET = __page * 5;

  try {
    const lengthQuery = `
    SELECT	A.id,
            A.title,
            A.author,
            A.senderId,
            A.receiverId,
            A.receiveLectureId,
            A.content,
            A.level,
            DATE_FORMAT(A.createdAt, "%Y년 %m월 %d일 %H시 %i분 %s초") 			AS	createdAt,
            DATE_FORMAT(A.updatedAt, "%Y년 %m월 %d일 %H시 %i분 %s초") 			AS	updatedAt,
            B.username,
            B.level                                                      AS  userLevel
      FROM	Messages  A
     INNER
      JOIN  users     B
        ON  A.senderId = B.id
     WHERE  A.receiverId = ${req.user.id}
       AND  A.receiveLectureId IS NULL     
    `;

    const selectQuery = `
    SELECT	A.id,
            A.title,
            A.author,
            A.senderId,
            A.receiverId,
            A.receiveLectureId,
            A.content,
            A.level,
            DATE_FORMAT(A.createdAt, "%Y년 %m월 %d일 %H시 %i분 %s초") 			AS	createdAt,
            DATE_FORMAT(A.updatedAt, "%Y년 %m월 %d일 %H시 %i분 %s초") 			AS	updatedAt,
            B.username,
            B.level                                                      AS  userLevel
      FROM	Messages  A
     INNER
      JOIN  users     B
        ON  A.senderId = B.id
     WHERE  A.receiverId = ${req.user.id} 
       AND  A.receiveLectureId IS NULL    
     ORDER  BY A.createdAt  DESC
     LIMIT  ${LIMIT}
    OFFSET  ${OFFSET}
    `;

    const length = await models.sequelize.query(lengthQuery);
    const message = await models.sequelize.query(selectQuery);

    const messagelen = length[0].length;

    const lastPage =
      messagelen % LIMIT > 0 ? messagelen / LIMIT + 1 : messagelen / LIMIT;

    return res
      .status(200)
      .json({ message: message[0], lastPage: parseInt(lastPage) });
  } catch (error) {
    console.error(error);
    return res.status(401).send("No message found");
  }
});

router.get("/sender/list", isLoggedIn, async (req, res, next) => {
  const { page } = req.query;

  if (!req.user) {
    return res.status(403).send("Please log in");
  }

  const LIMIT = 5;

  const _page = page ? page : 1;

  const __page = _page - 1;
  const OFFSET = __page * 5;

  try {
    const lengthQuery = `
    SELECT	A.id,
            A.title,
            A.author,
            A.senderId,
            A.receiverId,
            A.receiveLectureId,
            A.content,
            A.level,
            DATE_FORMAT(A.createdAt, "%Y년 %m월 %d일 %H시 %i분 %s초") 			AS	createdAt,
            DATE_FORMAT(A.updatedAt, "%Y년 %m월 %d일 %H시 %i분 %s초") 			AS	updatedAt,
            B.username,
            B.level                                                      AS  userLevel
      FROM	Messages  A
     INNER
      JOIN  users     B
        ON  A.receiverId = B.id
     WHERE  A.senderId = ${req.user.id}
       AND  A.receiveLectureId IS NULL     
    `;

    const selectQuery = `
    SELECT	A.id,
            A.title,
            A.author,
            A.senderId,
            A.receiverId,
            A.receiveLectureId,
            A.content,
            A.level,
            DATE_FORMAT(A.createdAt, "%Y년 %m월 %d일 %H시 %i분 %s초") 			AS	createdAt,
            DATE_FORMAT(A.updatedAt, "%Y년 %m월 %d일 %H시 %i분 %s초") 			AS	updatedAt,
            B.username,
            B.level                                                      AS  userLevel
      FROM	Messages  A
     INNER
      JOIN  users     B
        ON  A.receiverId = B.id
     WHERE  A.senderId = ${req.user.id} 
       AND  A.receiveLectureId IS NULL    
     ORDER  BY A.createdAt  DESC
     LIMIT  ${LIMIT}
    OFFSET  ${OFFSET}
    `;

    const length = await models.sequelize.query(lengthQuery);
    const message = await models.sequelize.query(selectQuery);

    const messagelen = length[0].length;

    const lastPage =
      messagelen % LIMIT > 0 ? messagelen / LIMIT + 1 : messagelen / LIMIT;

    return res
      .status(200)
      .json({ message: message[0], lastPage: parseInt(lastPage) });
  } catch (error) {
    console.error(error);
    return res.status(401).send("No message found");
  }
});

// 전체 쪽지
router.get("/all/list", isLoggedIn, async (req, res, next) => {
  const { page } = req.query;

  if (!req.user) {
    return res.status(403).send("Please log in");
  }

  const LIMIT = 5;

  const _page = page ? page : 1;

  const __page = _page - 1;
  const OFFSET = __page * 5;

  try {
    const lengthQuery = `
    SELECT	A.id,
            A.title,
            A.author,
            A.senderId,
            A.receiverId,
            A.receiveLectureId,
            A.content,
            A.level,
            DATE_FORMAT(A.createdAt, "%Y년 %m월 %d일 %H시 %i분 %s초") 			AS	createdAt,
            DATE_FORMAT(A.updatedAt, "%Y년 %m월 %d일 %H시 %i분 %s초") 			AS	updatedAt,
            B.username,
            B.level                                                      AS  userLevel
      FROM	Messages      A
     INNER
      JOIN  users         B
        ON  A.senderId = B.id
     WHERE  1 = 1
    ${`AND  A.level IN (${req.user.level}, 3)`}
       AND  A.receiveLectureId IS NULL
       AND  A.receiverId IS NULL     
    `;

    const selectQuery = `
    SELECT	A.id,
            A.title,
            A.author,
            A.senderId,
            A.receiverId,
            A.receiveLectureId,
            A.content,
            A.level,
            DATE_FORMAT(A.createdAt, "%Y년 %m월 %d일 %H시 %i분 %s초") 			AS	createdAt,
            DATE_FORMAT(A.updatedAt, "%Y년 %m월 %d일 %H시 %i분 %s초") 			AS	updatedAt,
            B.username,
            B.level                                                      AS  userLevel
      FROM	Messages      A
     INNER
      JOIN  users         B
        ON  A.senderId = B.id
     WHERE  1 = 1
    ${`AND  A.level IN (${req.user.level}, 3)`}
       AND  A.receiveLectureId IS NULL
       AND  A.receiverId IS NULL    
     ORDER  BY A.createdAt  DESC
     LIMIT  ${LIMIT}
    OFFSET  ${OFFSET}
    `;

    const length = await models.sequelize.query(lengthQuery);
    const message = await models.sequelize.query(selectQuery);

    const messagelen = length[0].length;

    const lastPage =
      messagelen % LIMIT > 0 ? messagelen / LIMIT + 1 : messagelen / LIMIT;

    return res
      .status(200)
      .json({ message: message[0], lastPage: parseInt(lastPage) });
  } catch (error) {
    console.error(error);
    return res.status(401).send("No message found");
  }
});

router.get("/user/partList", isLoggedIn, async (req, res, next) => {
  const { page } = req.query;

  if (!req.user) {
    return res.status(403).send("Please log in");
  }

  const LIMIT = 5;

  const _page = page ? page : 1;

  const __page = _page - 1;
  const OFFSET = __page * 5;

  try {
    const parts = await Participant.findAll({
      where: {
        isDelete: false,
        isChange: false,
        UserId: parseInt(req.user.id),
      },
    });

    if (parts.length === 0) {
      return res.status(401).send("No class found.");
    }

    let lectureIds = [];

    for (let i = 0; i < parts.length; i++) {
      lectureIds.push(parts[i].LectureId);
    }

    const lengthQuery = `
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
     WHERE  receiveLectureId IN (${lectureIds})
       AND  receiverId IS NULL     
    `;

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
     WHERE  receiveLectureId IN (${lectureIds})
       AND  receiverId IS NULL         
     ORDER  BY createdAt  DESC
     LIMIT  ${LIMIT}
    OFFSET  ${OFFSET}
    `;

    const length = await models.sequelize.query(lengthQuery);
    const message = await models.sequelize.query(selectQuery);

    const messagelen = length[0].length;

    const lastPage =
      messagelen % LIMIT > 0 ? messagelen / LIMIT + 1 : messagelen / LIMIT;

    return res
      .status(200)
      .json({ message: message[0], lastPage: parseInt(lastPage) });
  } catch (error) {
    console.error(error);
    return res.status(401).send("Unable to load your class list.");
  }
});

// 강의별 쪽지 리스트
router.post("/lecture/list", async (req, res, next) => {
  const { LectureId, page } = req.body;

  if (!req.user) {
    return res.status(403).send("로그인 후 이용 가능합니다.");
  }

  const LIMIT = 5;

  const _page = page ? page : 1;

  const __page = _page - 1;
  const OFFSET = __page * 5;

  try {
    const exLecture = await Lecture.findOne({
      where: { id: parseInt(LectureId), isDelete: false },
    });

    if (!exLecture) {
      return res.status(401).send("존재하지 않는 강의입니다.");
    }

    const lengthQuery = `
    SELECT	A.id,
            A.title,
            A.author,
            A.receiveLectureId,
            A.content,
            A.level,
            A.senderId,
            DATE_FORMAT(A.createdAt, "%Y년 %m월 %d일 %H시 %i분 %s초") 			AS	createdAt,
            DATE_FORMAT(A.updatedAt, "%Y년 %m월 %d일 %H시 %i분 %s초") 			AS	updatedAt,
            B.username,
            B.level                                                      AS  userLevel
      FROM	Messages        A
     INNER
      JOIN  users           B
        ON  A.senderId = B.id
     WHERE  receiveLectureId = ${LectureId}
    `;

    const selectQuery = `
    SELECT	A.id,
            A.title,
            A.author,
            A.receiveLectureId,
            A.content,
            A.senderId,
            A.level,
            DATE_FORMAT(A.createdAt, "%Y년 %m월 %d일 %H시 %i분 %s초") 			AS	createdAt,
            DATE_FORMAT(A.updatedAt, "%Y년 %m월 %d일 %H시 %i분 %s초") 			AS	updatedAt,
            B.username,
            B.level                                                      AS  userLevel
      FROM	Messages        A
     INNER
      JOIN  users           B
        ON  A.senderId = B.id
     WHERE  receiveLectureId = ${LectureId}    
     ORDER  BY A.createdAt  DESC
     LIMIT  ${LIMIT}
    OFFSET  ${OFFSET}
    `;

    const length = await models.sequelize.query(lengthQuery);
    const message = await models.sequelize.query(selectQuery);

    const messagelen = length[0].length;

    const lastPage =
      messagelen % LIMIT > 0 ? messagelen / LIMIT + 1 : messagelen / LIMIT;

    return res
      .status(200)
      .json({ message: message[0], lastPage: parseInt(lastPage) });
  } catch (error) {
    console.error(error);
    return res.status(401).send("강의별 쪽지 목록을 불러올 수 없습니다.");
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
    SELECT	A.id,
            A.title,
            A.author,
            A.senderId,
            A.receiverId,
            A.receiveLectureId,
            A.content,
            A.level,
            DATE_FORMAT(A.createdAt, "%Y년 %m월 %d일 %H시 %i분 %s초") 			AS	createdAt,
            DATE_FORMAT(A.updatedAt, "%Y년 %m월 %d일 %H시 %i분 %s초") 			AS	updatedAt,
            B.username,
            B.level                                                      AS  userLevel
      FROM	Messages      A
     INNER
      JOIN  users         B
        ON  A.senderId = B.id
     WHERE  1 = 1
            ${_search ? `AND A.author LIKE '%${_search}%'` : ``}
            ${
              _listType === 1
                ? `AND A.level = 1`
                : _listType === 2
                ? `AND A.level = 2`
                : _listType === 3
                ? ``
                : ``
            }
    ORDER   BY A.createdAt DESC 
    `;

    const messages = await models.sequelize.query(selectQuery);

    return res.status(200).json({ messages: messages[0] });
  } catch (error) {
    console.error(error);
    return res.status(401).send("쪽지를 확인할 수 없습니다.");
  }
});

router.post("/admin/main/list", isAdminCheck, async (req, res, next) => {
  const { page } = req.body;

  const LIMIT = 5;

  const _page = page ? page : 1;

  const __page = _page - 1;
  const OFFSET = __page * 5;

  try {
    const lengthQuery = `
    SELECT	A.id,
            A.title,
            A.author,
            A.senderId,
            A.receiverId,
            A.receiveLectureId,
            A.content,
            A.level,
            DATE_FORMAT(A.createdAt, "%Y년 %m월 %d일 %H시 %i분 %s초") 			AS	createdAt,
            DATE_FORMAT(A.updatedAt, "%Y년 %m월 %d일 %H시 %i분 %s초") 			AS	updatedAt,
            B.username,
            B.level                                                      AS  userLevel
      FROM	Messages      A
     INNER
      JOIN  users         B
        ON  A.senderId = B.id
     WHERE  1 = 1
    `;

    const selectQuery = `
    SELECT	A.id,
            A.title,
            A.author,
            A.senderId,
            A.receiverId,
            A.receiveLectureId,
            A.content,
            A.level,
            DATE_FORMAT(A.createdAt, "%Y년 %m월 %d일 %H시 %i분 %s초") 			AS	createdAt,
            DATE_FORMAT(A.updatedAt, "%Y년 %m월 %d일 %H시 %i분 %s초") 			AS	updatedAt,
            B.username,
            B.level                                                      AS  userLevel
      FROM	Messages      A
     INNER
      JOIN  users         B
        ON  A.senderId = B.id
     WHERE  1 = 1
     ORDER  BY A.createdAt  DESC
     LIMIT  ${LIMIT}
    OFFSET  ${OFFSET}
    `;

    const length = await models.sequelize.query(lengthQuery);
    const message = await models.sequelize.query(selectQuery);

    const messagelen = length[0].length;

    const lastPage =
      messagelen % LIMIT > 0 ? messagelen / LIMIT + 1 : messagelen / LIMIT;

    return res
      .status(200)
      .json({ message: message[0], lastPage: parseInt(lastPage) });
  } catch (error) {
    console.error(error);
    return res.status(401).send("쪽지를 확인할 수 없습니다.");
  }
});

// 쪽지 상세
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
    SELECT	A.id,
            A.title,
            A.author,
            A.senderId,
            A.receiverId,
            A.receiveLectureId,
            A.content,
            A.level,
            DATE_FORMAT(A.createdAt, "%Y년 %m월 %d일 %H시 %i분 %s초") 			AS	createdAt,
            DATE_FORMAT(A.updatedAt, "%Y년 %m월 %d일 %H시 %i분 %s초") 			AS	updatedAt,
            B.username,
            B.level                                                      AS  userLevel
      FROM	Messages  A
     INNER
      JOIN  users     B
        ON  A.senderId = B.id
     WHERE  A.id = ${messageId}
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
    return res.status(403).send("Please log in");
  }
  try {
    const parts = await Participant.findAll({
      where: {
        UserId: parseInt(req.user.id),
        isDelete: false,
        isChange: false,
      },
    });

    if (parts.length === 0) {
      return res.status(401).send("No class found");
    }

    let users = [];

    await Promise.all(
      parts.map(async (data) => {
        users.push(
          await Lecture.findOne({
            where: { id: parseInt(data.LectureId) },
            include: [
              {
                model: User,
              },
            ],
          })
        );
      })
    );

    return res.status(200).json(users);
  } catch (error) {
    console.error(error);
    return res.status(401).send("Unable to load teacher list");
  }
});

// 쪽지 쓰기 1:1
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
      return res.status(401).send("User ID does not exist.");
    }

    const exUser2 = await User.findOne({
      where: { id: parseInt(senderId) },
    });

    if (!exUser2) {
      return res.status(401).send("User ID does not exist.");
    }

    if (receiveLectureId) {
      const exLecture = await Lecture.findOne({
        where: { id: parseInt(receiveLectureId) },
      });

      if (!exLecture) {
        return res.status(401).send("Class does not exist.");
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
      return res.status(401).send("Error");
    }

    return res.status(201).json({ result: true });
  } catch (error) {
    console.error(error);
    return res.status(401).send("No message found");
  }
});

//관리자에게 쓰기
router.post("/forAdminCreate", isLoggedIn, async (req, res, next) => {
  const { title, author, content } = req.body;

  if (!req.user) {
    return res.status(403).send("Please log in");
  }

  try {
    const exAdmin = await User.findAll({
      where: { level: 4 },
    });

    if (exAdmin.length === 0) {
      return res.status(401).send("Admin does not exist.");
    }

    await Promise.all(
      exAdmin.map(async (data) => {
        await Message.create({
          title,
          author,
          senderId: parseInt(req.user.id),
          receiverId: parseInt(data.id),
          content,
          level: parseInt(4),
        });
      })
    );

    return res.status(201).json({ result: true });
  } catch (error) {
    console.error(error);
    return res.status(401).send("Message cannot be sent to Admin.");
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
  const { title, author, content, receiverId, level } = req.body;

  if (!req.user) {
    return res.status(403).send("잘못된 요청입니다.");
  }

  if (!Array.isArray(receiverId)) {
    return res.status(401).send("잘못된 요청입니다.");
  }

  if (!Array.isArray(level)) {
    return res.status(401).send("잘못된 요청입니다.");
  }

  try {
    for (let i = 0; i < receiverId.length; i++) {
      await Message.create({
        receiverId: parseInt(receiverId[i]),
        senderId: parseInt(req.user.id),
        title,
        author,
        content,
        level: parseInt(level[i]),
      });
    }

    return res.status(201).json({ result: true });
  } catch (error) {
    console.error(error);
    return res.status(401).send("쪽지를 보낼 수 없습니다.");
  }
});

// 모든 사용자에게 보내기 (type 1은 학생, type2는 강사, type3은 전체)
router.post("/all/create", isAdminCheck, async (req, res, next) => {
  const { type, title, author, content } = req.body;

  try {
    const createResult = await Message.create({
      receiverId: null,
      senderId: parseInt(req.user.id),
      title,
      author,
      content,
      level: parseInt(type),
    });

    if (!createResult) {
      return res.status(401).send("처리중 문제가 발생하였습니다.");
    }

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

    const createResult = await Message.create({
      title,
      content,
      author,
      receiveLectureId: parseInt(LectureId),
      senderId: parseInt(req.user.id),
      receiverId: null,
      level: parseInt(req.user.level),
    });

    if (!createResult) {
      return res.status(401).send("처리중 문제가 발생하였습니다.");
    }

    return res.status(201).json({ result: true });
  } catch (error) {
    console.error(error);
    return res.status(401).send("쪽지를 보낼 수 없습니다.");
  }
});

module.exports = router;
