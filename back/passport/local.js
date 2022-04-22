const passport = require("passport");
const { Strategy: LocalStrategy } = require("passport-local");
const bcrypt = require("bcrypt");
const { User, Participant } = require("../models");

module.exports = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "userId",
        passwordField: "password",
      },
      async (userId, password, done) => {
        try {
          const user = await User.findOne({
            where: { userId },
          });

          if (!user) {
            return done(null, false, {
              reason: "존재하지 않는 아이디 입니다.",
            });
          }

          if (user.level === 1) {
            const exParts = await Participant.findAll({
              where: {
                UserId: parseInt(user.id),
                isDelete: false,
                isChange: false,
              },
            });

            if (exParts.length === 0) {
              return done(null, false, {
                reason: "참여중인 강의가 없습니다.",
              });
            }
          }
          if (user.level === 2) {
            if (user.isFire) {
              return done(null, false, {
                reason: "해지된 강사는 로그인할 수 없습니다.",
              });
            }
          }

          const result = await bcrypt.compare(password, user.password);

          if (result) {
            return done(null, user);
          }

          return done(null, false, { reason: "비밀번호가 일치하지 않습니다." });
        } catch (error) {
          console.error(error);
          return done(error);
        }
      }
    )
  );
};
