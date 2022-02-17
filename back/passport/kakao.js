const passport = require("passport");
const KakaoStrategy = require("passport-kakao").Strategy;
const bcrypt = require("bcrypt");
const { User } = require("../models");

module.exports = () => {
  passport.use(
    new KakaoStrategy(
      {
        clientID: "ba4f7e382f8765f4853408743e4d583d",
        callbackURL: "http://localhost:4000/api/user/kakao/oauth",
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log(profile);

        const _email = `${profile.provider}_${profile.id}`;
      }
    )
  );
};
