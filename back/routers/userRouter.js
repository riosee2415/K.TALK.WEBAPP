const express = require("express");
const passport = require("passport");
const bcrypt = require("bcrypt");
const { User, Participant, Lecture } = require("../models");
const isAdminCheck = require("../middlewares/isAdminCheck");
const isNanCheck = require("../middlewares/isNanCheck");
const isLoggedIn = require("../middlewares/isLoggedIn");
const { Op } = require("sequelize");
const generateUUID = require("../utils/generateUUID");
const sendSecretMail = require("../utils/mailSender");
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const AWS = require("aws-sdk");
const multerS3 = require("multer-s3");

const router = express.Router();

try {
  fs.accessSync("uploads");
} catch (error) {
  console.log(
    "uploads 폴더가 존재하지 않습니다. 새로 uploads 폴더를 생성합니다."
  );
  fs.mkdirSync("uploads");
}

AWS.config.update({
  accessKeyId: process.env.S3_ACCESS_KEY_Id,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  region: "ap-northeast-2",
});

const upload = multer({
  storage: multerS3({
    s3: new AWS.S3(),
    bucket: process.env.S3_BUCKET_NAME,
    key(req, file, cb) {
      cb(
        null,
        `${
          process.env.S3_STORAGE_FOLDER_NAME
        }/original/${Date.now()}_${path.basename(file.originalname)}`
      );
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

router.get(
  ["/list", "/list/:listType"],
  isAdminCheck,
  async (req, res, next) => {
    let findType = 1;

    const { listType } = req.params;
    const { name, email } = req.query;

    const validation = Number(listType);
    const numberFlag = isNaN(validation);

    if (numberFlag) {
      findType = parseInt(1);
    }

    if (validation >= 2) {
      findType = 2;
    } else {
      findType = 1;
    }

    try {
      let users = [];

      const searchName = name ? name : "";
      const searchEmail = email ? email : "";

      switch (parseInt(findType)) {
        case 1:
          users = await User.findAll({
            where: {
              username: {
                [Op.like]: `%${searchName}%`,
              },
              email: {
                [Op.like]: `%${searchEmail}%`,
              },
            },
            attributes: {
              exclude: ["password"],
            },
            order: [["createdAt", "DESC"]],
          });
          break;
        case 2:
          users = await User.findAll({
            where: {
              username: {
                [Op.like]: `%${searchName}%`,
              },
              email: {
                [Op.like]: `%${searchEmail}%`,
              },
            },
            attributes: {
              exclude: ["password"],
            },
            order: [["username", "ASC"]],
          });
          break;

        default:
          break;
      }

      return res.status(200).json(users);
    } catch (error) {
      console.error(error);
      return res.status(401).send("사용자 목록을 불러올 수 없습니다.");
    }
  }
);

router.get("/signin", async (req, res, next) => {
  console.log("❌❌❌❌❌❌❌❌❌❌❌❌❌❌");
  console.log(req.user);
  console.log("❌❌❌❌❌❌❌❌❌❌❌❌❌❌");
  try {
    if (req.user) {
      const fullUserWithoutPassword = await User.findOne({
        where: { id: req.user.id },
        attributes: {
          exclude: ["password"],
        },
      });

      console.log("🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀");
      console.log(fullUserWithoutPassword);
      console.log("🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀");
      return res.status(200).json(fullUserWithoutPassword);
    } else {
      res.status(200).json(null);
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.post("/signin", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.error(err);
      return next(err);
    }

    if (info) {
      console.log(`❌ LOGIN FAILED : ${info.reason}`);
      return res.status(401).send(info.reason);
    }

    return req.login(user, async (loginErr) => {
      if (loginErr) {
        console.error(loginErr);
        return next(loginErr);
      }

      const fullUserWithoutPassword = await User.findOne({
        where: { id: user.id },
        attributes: {
          exclude: ["password"],
        },
      });

      return res.status(200).json(fullUserWithoutPassword);
    });
  })(req, res, next);
});

router.post("/signin/admin", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.error(err);
      return next(err);
    }

    if (user.level < 3) {
      console.log(`❌ LOGIN FAILED : 관리자 접속 권한이 없습니다.`);
      return res.status(403).send({ reason: "관리자 접속 권한이 없습니다." }); // Forbbiden 권한 없음
    }

    if (info) {
      console.log(`❌ LOGIN FAILED : ${info.reason}`);
      return res.status(401).send(info.reason);
    }

    return req.login(user, async (loginErr) => {
      if (loginErr) {
        console.error(loginErr);
        return next(loginErr);
      }

      const fullUserWithoutPassword = await User.findOne({
        where: { id: user.id },
        attributes: {
          exclude: ["password"],
        },
      });

      return res.status(200).json(fullUserWithoutPassword);
    });
  })(req, res, next);
});

router.get(
  ["/allUsers", "/allUsers/:listType"],
  isAdminCheck,
  async (req, res, next) => {
    const { listType } = req.params;
    const { name, email } = req.query;

    const searchName = name ? name : "";
    const searchEmail = email ? email : "";

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
      let users = [];

      switch (_listType) {
        case 1:
          users = await User.findAll({
            where: {
              level: 1,
              username: {
                [Op.like]: `%${searchName}%`,
              },
              email: {
                [Op.like]: `%${searchEmail}%`,
              },
            },
            attributes: {
              exclude: ["password"],
            },
            include: [
              {
                model: Participant,
                include: [
                  {
                    model: Lecture,
                  },
                ],
              },
            ],
            order: [["createdAt", "DESC"]],
          });
          break;

        case 2:
          users = await User.findAll({
            where: {
              level: 2,
              username: {
                [Op.like]: `%${searchName}%`,
              },
              email: {
                [Op.like]: `%${searchEmail}%`,
              },
            },
            attributes: {
              exclude: ["password"],
            },
            order: [["createdAt", "DESC"]],
          });
          break;

        case 3:
          users = await User.findAll({
            where: {
              username: {
                [Op.like]: `%${searchName}%`,
              },
              email: {
                [Op.like]: `%${searchEmail}%`,
              },
            },
            attributes: {
              exclude: ["password"],
            },
            order: [["createdAt", "DESC"]],
          });
          break;

        default:
          break;
      }

      return res.status(200).json(users);
    } catch (error) {
      console.error(error);
      return res.status(401).send("사용자 목록을 조회할 수 없습니다.");
    }
  }
);

router.get("/detail/:UserId", isAdminCheck, async (req, res, next) => {
  const { UserId } = req.params;

  if (isNanCheck(UserId)) {
    return res.status(401).send("잘못된 요청입니다.");
  }
  try {
    const exUser = await User.findOne({
      where: { id: parseInt(UserId) },
      attributes: {
        exclude: ["password"],
      },
      include: [
        {
          model: Participant,
          include: [
            {
              model: Lecture,
            },
          ],
        },
      ],
    });

    if (!exUser) {
      return res.status(401).send("존재하지 않는 사용자입니다.");
    }

    return res.status(200).json(exUser);
  } catch (error) {
    console.error(error);
    return res.status(401).send("사용자 정보를 불러올 수 없습니다.");
  }
});

router.post("/signup", async (req, res, next) => {
  const { userId, email, username, mobile, password, birth, gender } = req.body;

  try {
    const exUser = await User.findOne({
      where: { email: email },
    });

    if (exUser) {
      return res.status(401).send("이미 가입된 이메일 입니다.");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await User.create({
      userId,
      email,
      username,
      mobile,
      birth,
      gender,
      password: hashedPassword,
    });

    res.status(201).send("SUCCESS");
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/me", isLoggedIn, async (req, res, next) => {
  try {
    return res.status(200).json(req.user);
  } catch (error) {
    console.error(error);
    return res.status(401).send("사용자 정보를 불러올 수 없습니다.");
  }
});

router.post("/image", upload.single("image"), async (req, res, next) => {
  return res.json({ path: req.file.location });
});

router.post("/me/update", isLoggedIn, async (req, res, next) => {
  const {
    profileImage,
    mobile,
    address,
    detailAddress,
    teaCountry,
    teaLanguage,
    bankNo,
    bankName,
    stuLanguage,
    birth,
    stuCountry,
    stuLiveCon,
    sns,
    snsId,
    stuJob,
  } = req.body;

  try {
    const updateUser = await User.update(
      {
        profileImage,
        mobile,
        address,
        detailAddress,
        birth,
        teaCountry: req.user.level === 2 ? teaCountry : null,
        teaLanguage: req.user.level === 2 ? teaLanguage : null,
        bankNo: req.user.level === 2 ? bankNo : null,
        bankName: req.user.level === 2 ? bankName : null,
        stuLanguage: req.user.level === 1 ? stuLanguage : null,
        stuCountry: req.user.level === 1 ? stuCountry : null,
        stuLiveCon: req.user.level === 1 ? stuLiveCon : null,
        sns: req.user.level === 1 ? sns : null,
        snsId: req.user.level === 1 ? snsId : null,
        stuJob: req.user.level === 1 ? stuJob : null,
      },
      {
        where: { id: parseInt(req.user.id) },
      }
    );

    return res.status(200).json({ result: true });
  } catch (error) {
    console.error(error);
    return res.status(401).send("정보를 수정할 수 없습니다.");
  }
});

router.patch("/teaMemo/update", isAdminCheck, async (req, res, next) => {
  const { id, teaMemo } = req.body;
  try {
    const exUser = await User.findOne({
      where: { id: parseInt(id) },
    });

    if (!exUser) {
      return res.status(401).send("존재하지 않는 사용자입니다.");
    }

    const updateResult = await User.update(
      {
        teaMemo,
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
    return res.status(401).send("메모를 작성할 수 없습니다.");
  }
});

router.patch("/stuMemo/update", isAdminCheck, async (req, res, next) => {
  const { id, stuMemo } = req.body;
  try {
    const exUser = await User.findOne({
      where: { id: parseInt(id) },
    });

    if (!exUser) {
      return res.status(401).send("존재하지 않는 사용자입니다.");
    }

    const updateResult = await User.update(
      {
        stuMemo,
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
    return res.status(401).send("메모를 작성할 수 없습니다.");
  }
});

router.patch("/adminMemo/update", isAdminCheck, async (req, res, next) => {
  const { id, adminMemo } = req.body;
  try {
    const exUser = await User.findOne({
      where: { id: parseInt(id) },
    });

    if (!exUser) {
      return res.status(401).send("존재하지 않는 사용자입니다.");
    }

    const updateResult = await User.update(
      {
        adminMemo,
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
    return res.status(401).send("메모를 작성할 수 없습니다.");
  }
});

router.post("/findemail", async (req, res, next) => {
  const { username, mobile } = req.body;

  try {
    const exUser = await User.findOne({
      where: {
        username,
        mobile,
      },
    });

    if (exUser) {
      return res.status(200).json({ email: exUser.email });
    } else {
      return res.status(200).json({ email: false });
    }
  } catch (error) {
    console.error(error);
    return res.status(401).send("아이디를 찾을 수 없습니다.");
  }
});

router.post("/modifypass", isLoggedIn, async (req, res, next) => {
  const { email, username, mobile } = req.body;

  try {
    const cookieEmail = req.user.dataValues.email;
    const cookieUsername = req.user.dataValues.username;
    const cookieMobile = req.user.dataValues.mobile;

    if (
      email === cookieEmail &&
      username === cookieUsername &&
      mobile === cookieMobile
    ) {
      const currentUserId = req.user.dataValues.id;

      const UUID = generateUUID();

      const updateResult = await User.update(
        { secret: UUID },
        {
          where: { id: parseInt(currentUserId) },
        }
      );

      if (updateResult[0] > 0) {
        // 이메일 전송

        await sendSecretMail(
          cookieEmail,
          `🔐 [보안 인증코드 입니다.] ㅁㅁㅁㅁ 에서 비밀번호 변경을 위한 보안인증 코드를 발송했습니다.`,
          `
          <div>
            <h3>ㅁㅁㅁㅁ</h3>
            <hr />
            <p>보안 인증코드를 발송해드립니다. ㅁㅁㅁㅁ 홈페이지의 인증코드 입력란에 정확히 입력해주시기 바랍니다.</p>
            <p>인증코드는 [<strong>${UUID}</strong>] 입니다. </p>

            <br /><hr />
            <article>
              발송해드린 인증코드는 외부로 유출하시거나, 유출 될 경우 개인정보 침해의 위험이 있으니, 필히 본인만 사용하며 타인에게 양도하거나 알려주지 마십시오.
            </article>
          </div>
          `
        );

        return res.status(200).json({ result: true });
      } else {
        return res
          .status(401)
          .send("요청이 올바르지 않습니다. 다시 시도해주세요.");
      }
    } else {
      return res
        .status(401)
        .send("입력하신 정보가 잘못되었습니다. 다시 확인해주세요.");
    }
  } catch (error) {
    console.error(error);
    return res.status(401).send("잘못된 요청 입니다. [CODE097]");
  }
});

router.patch("/modifypass/update", isLoggedIn, async (req, res, next) => {
  const { secret, password } = req.body;

  try {
    const exUser = await User.findOne({
      where: { id: req.user.dataValues.id },
    });

    if (!exUser) {
      return res
        .status(401)
        .send("잘못된 요청 입니다. 다시 로그인 후 이용해주세요.");
    }

    const hashPassord = await bcrypt.hash(password, 12);

    const updateResult = await User.update(
      { password: hashPassord },
      {
        where: { id: req.user.dataValues.id },
      }
    );

    if (updateResult[0] === 1) {
      return res.status(200).json({ result: true });
    } else {
      return res.status(200).json({ result: false });
    }
  } catch (error) {
    console.error(error);
    return res.status(401).send("잘못된 요청 입니다.");
  }
});

router.patch("/level/update", isAdminCheck, async (req, res, next) => {
  const { selectUserId, changeLevel } = req.body;

  try {
    const exUser = await User.findOne({
      where: { id: parseInt(selectUserId) },
    });

    if (!exUser) {
      return res
        .status(401)
        .send("잘못된 사용자 입니다. 다시 확인 후 시도해주세요.");
    }

    const currentLevel = parseInt(exUser.dataValues.level);

    if (parseInt(currentLevel) === 5) {
      return res.status(403).send("개발사의 권한을 수정할 수 없습니다.");
    }

    if (parseInt(currentLevel) === parseInt(changeLevel)) {
      return res
        .status(401)
        .send(
          "변경하려는 사용자 권한이 동일합니다. 다시 확인 후 시도해주세요."
        );
    }

    const updateResult = await User.update(
      { level: parseInt(changeLevel) },
      {
        where: {
          id: parseInt(selectUserId),
        },
      }
    );

    if (updateResult[0] === 1) {
      return res.status(200).json({ result: true });
    } else {
      return res.status(200).json({ result: false });
    }
  } catch (error) {
    console.error(error);
    return res.status(401).send("잘못된 요청 입니다. 개발사에 문의해주세요.");
  }
});

router.get(
  "/kakaoLogin",
  passport.authenticate("kakao", {
    failureRedirect: "/",
  }),
  (res, req) => {
    res.redirect("/");
  }
);

router.get(
  "/kakao/oauth",
  passport.authenticate("kakao", {
    failureRedirect: "/",
  }),
  (res, req) => {
    return res.redirect("/");
  }
);

router.get("/logout", function (req, res) {
  req.logout();
  req.session.save(() => {
    res.clearCookie("connect.sid");
    res.redirect("/");
  });
});

// router.post("/seq/create", isAdminCheck, async (req, res, next) => {
//   const { email, username, nickname, birth, gender, mobile, password, level } =
//     req.body;

//   try {
//     const result = await User.create({
//       email,
//       username,
//       nickname,
//       birth,
//       gender,
//       mobile,
//       password,
//       level,
//     });

//     return res.status(201).json({ result: true });
//   } catch (error) {
//     console.error(error);
//     return res.status(400).send("회원 생성에 실패했습니다.");
//   }
// });

// 🍀 회원 신규 등록

router.post("/student/create", isAdminCheck, async (req, res, next) => {
  const {
    userId,
    password,
    username,
    mobile,
    email,
    address,
    detailAddress,
    startDate,
    endDate,
    stuLanguage,
    birth,
    stuCountry,
    stuLiveCon,
    sns,
    snsId,
    stuJob,
    gender,
    LectureId,
  } = req.body;

  if (!Array.isArray(LectureId)) {
    return res.status(401).send("잘못된 요청입니다.");
  }

  try {
    const exUser = await User.findOne({
      where: { userId },
    });

    if (exUser) {
      return res.status(401).send("이미 사용중인 아이디입니다.");
    }

    const exUser2 = await User.findOne({
      where: { email },
    });

    if (exUser2) {
      return res.status(401).send("이미 사용중인 이메일입니다.");
    }

    const allStudents = await User.findAll({
      where: { level: 1 },
    });

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await User.create({
      userId,
      password: hashedPassword,
      username,
      mobile,
      email,
      address,
      detailAddress,
      startDate,
      endDate,
      stuNo: parseInt(allStudents.length) + 1,
      stuLanguage,
      birth,
      stuCountry,
      stuLiveCon,
      sns,
      snsId,
      stuJob,
      gender,
      level: 1,
    });

    if (!result) {
      return res.status(401).send("처리중 문제가 발생하였습니다.");
    }

    const exLecture = await Lecture.findOne({
      where: { id: parseInt(LectureId) },
    });

    if (!exLecture) {
      return res.status(401).send("존재하지 않는 강의 입니다.");
    }

    await Promise.all(
      LectureId.map(async (data) => {
        await Participant.create({
          LectureId: parseInt(data),
          UserId: parseInt(result.id),
        });
      })
    );

    return res.status(201).json({ result: true });
  } catch (error) {
    console.error(error);
    return res.status(400).send("회원 생성에 실패했습니다.");
  }
});

// 학생 반 옮기기
router.patch("/class/update", isAdminCheck, async (req, res, next) => {
  const { UserId, LectureId, ChangeLectureId } = req.body;
  try {
    const exLecture = await Lecture.findOne({
      where: { id: parseInt(LectureId) },
    });

    const exUser = await User.findOne({
      where: { id: parseInt(UserId) },
    });

    const exLecture2 = await Lecture.findOne({
      where: { id: parseInt(ChangeLectureId) },
    });

    if (parseInt(LectureId) === parseInt(ChangeLectureId)) {
      return res.status(401).send("동일한 강의를 선택하였습니다");
    }

    if (!exLecture) {
      return res.status(401).send("존재하지 않는 강의입니다.");
    }

    if (!exLecture2) {
      return res.status(401).send("존재하지 않는 사용자입니다.");
    }

    if (!exUser) {
      return res.status(401).send("존재하지 않는 사용자입니다.");
    }

    const exPart = await Participant.findOne({
      where: { UserId: parseInt(UserId), LectureId: parseInt(ChangeLectureId) },
    });

    if (exPart) {
      return res.status(401).send("이미 해당 강의에 참여하고 있습니다.");
    }

    const updateResult = await Participant.update(
      {
        LectureId: parseInt(ChangeLectureId),
      },
      {
        where: { UserId: parseInt(UserId), LectureId: parseInt(LectureId) },
      }
    );

    if (updateResult[0] > 0) {
      return res.status(200).json({ result: true });
    } else {
      return res.status(200).json({ result: false });
    }
  } catch (error) {
    console.error(error);
    return res.status(401).send("학생의 반을 옮길 수 없습니다.");
  }
});

router.post("/teacher/create", isAdminCheck, async (req, res, next) => {
  const {
    userId,
    password,
    username,
    mobile,
    email,
    address,
    detailAddress,
    identifyNum,
    teaCountry,
    teaLanguage,
    bankNo,
    bankName,
    birth,
    gender,
  } = req.body;
  try {
    const exUser = await User.findOne({
      where: { userId },
    });

    if (exUser) {
      return res.status(401).send("이미 사용중인 아이디입니다.");
    }

    const exUser2 = await User.findOne({
      where: { email },
    });

    if (exUser2) {
      return res.status(401).send("이미 사용중인 이메일입니다.");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await User.create({
      userId,
      password: hashedPassword,
      username,
      mobile,
      email,
      address,
      detailAddress,
      identifyNum,
      teaCountry,
      teaLanguage,
      bankNo,
      bankName,
      birth,
      gender,
      level: 2,
    });

    if (!result) {
      return res.status(401).send("처리중 문제가 발생하였습니다.");
    }

    return res.status(201).json({ result: true });
  } catch (error) {
    console.error(error);
    return res.status(401).send("강사 생성에 실패했습니다.");
  }
});

router.post("/findUserByEmail", isAdminCheck, async (req, res, next) => {
  const { email } = req.body;
  try {
    const exUser = await User.findOne({
      where: { email },
    });

    if (exUser) {
      return res.status(200).json({ result: true });
    } else {
      return res.status(200).json({ result: false });
    }
  } catch (error) {
    console.error(error);
    return res.status(401).send("잠시 후 다시 시도하여 주십시오.");
  }
});

module.exports = router;
