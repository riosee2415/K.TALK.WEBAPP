const passport = require("passport");
const local = require("./local");
const kakao = require("./kakao");
const { User } = require("../models");

module.exports = () => {
  passport.serializeUser((user, done) => {
    // 첫번째 인자는 서버 에러, 두번째 인자는 성공 시 데이터

    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findOne({
        where: { id },
        attributes: {
          exclude: ["password", "secret"],
        },
      });

      // 첫번째 인자는 서버 에러, 두번째 인자는 성공 시 데이터
      done(null, user);
    } catch (error) {
      console.error(error);
      done(error);
    }
  });

  local();
  kakao();
};
