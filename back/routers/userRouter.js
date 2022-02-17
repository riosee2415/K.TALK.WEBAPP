const express = require("express");
const passport = require("passport");
const bcrypt = require("bcrypt");
const { User } = require("../models");
const isAdminCheck = require("../middlewares/isAdminCheck");
const isLoggedIn = require("../middlewares/isLoggedIn");
const { Op } = require("sequelize");
const generateUUID = require("../utils/generateUUID");
const sendSecretMail = require("../utils/mailSender");

const router = express.Router();

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
        attributes: ["id", "nickname", "email", "level"],
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
        attributes: ["id", "nickname", "email", "level", "username"],
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
        attributes: ["id", "nickname", "email", "level", "username"],
      });

      return res.status(200).json(fullUserWithoutPassword);
    });
  })(req, res, next);
});

router.post("/signup", async (req, res, next) => {
  const { email, username, nickname, mobile, password, terms } = req.body;

  if (!terms) {
    return res.status(401).send("이용약관에 동의해주세요.");
  }

  try {
    const exUser = await User.findOne({
      where: { email: email },
    });

    if (exUser) {
      return res.status(401).send("이미 가입된 이메일 입니다.");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await User.create({
      email,
      username,
      nickname,
      mobile,
      terms,
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

router.post("/me/update", isLoggedIn, async (req, res, next) => {
  const { id, nickname, mobile } = req.body;

  try {
    const exUser = await User.findOne({ where: { id: parseInt(id) } });

    if (!exUser) {
      return res.status(401).send("존재하지 않는 사용자 입니다.");
    }

    const updateUser = await User.update(
      { nickname, mobile },
      {
        where: { id: parseInt(id) },
      }
    );

    return res.status(200).json({ result: true });
  } catch (error) {
    console.error(error);
    return res.status(401).send("정보를 수정할 수 없습니다.");
  }
});

router.post("/findemail", async (req, res, next) => {
  const { nickname, mobile } = req.body;

  try {
    const exUser = await User.findOne({
      where: {
        nickname,
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
  const { email, nickname, mobile } = req.body;

  try {
    const cookieEmail = req.user.dataValues.email;
    const cookieNickname = req.user.dataValues.nickname;
    const cookieMobile = req.user.dataValues.mobile;

    if (
      email === cookieEmail &&
      nickname === cookieNickname &&
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

module.exports = router;
