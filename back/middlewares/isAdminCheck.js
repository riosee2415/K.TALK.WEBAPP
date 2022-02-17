const dotenv = require("dotenv");
dotenv.config();
const { User } = require("../models");

const isAdminCheck = async (req, res, next) => {
  if (process.env.NODE_ENV === "development") {
    next();
  } else {
    if (!req.user) {
      return res.status(403).send("로그인이 필요합니다.");
    } else {
      const exUser = await User.findOne({
        where: { id: parseInt(req.user.id) },
      });

      if (exUser.level >= 3) {
        next();
      } else {
        return res
          .status(403)
          .send("사용 권한이 없습니다. 관리자에게 문의하세요.");
      }
    }
  }
};

module.exports = isAdminCheck;
