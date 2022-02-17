const express = require("express");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const morgan = require("morgan");
const path = require("path");
const hpp = require("hpp");
const helmet = require("helmet");
const db = require("./models");
const passportConfig = require("./passport");
const passport = require("passport");
const cron = require("node-cron");

const userRouter = require("./routers/userRouter");
const bannerRouter = require("./routers/bannerRouter");
const popupRouter = require("./routers/popupRouter");
const companyRouter = require("./routers/companyRouter");
const acceptRouter = require("./routers/acceptRouter");
const noticeRouter = require("./routers/noticeRouter");
const galleryRouter = require("./routers/galleryRouter");
const questionRouter = require("./routers/questionRouter");
const seoRouter = require("./routers/seoRouter");
const editRouter = require("./routers/editRouter");

// Config Settings
db.sequelize
  .sync()
  .then(() => {
    console.log("🍀 Mysql Database Connected");
  })
  .catch(console.error);
passportConfig();
dotenv.config();

// Express Settings
const app = express();
const PORT = process.env.NODE_ENV === "production" ? process.env.PORT : 4000;

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
  app.use(morgan(`combined`));
  app.use(hpp());
  app.use(helmet());
  app.use(
    cors({
      origin: [process.env.DEPLOY_DOMAIN, "*"],
      credentials: true,
    })
  );
} else {
  app.set("trust proxy", 1);
  app.use(morgan(`dev`));
  app.use(
    cors({
      origin: ["http://localhost:3000", "*"],
      credentials: true,
    })
  );
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use(
  session({
    saveUninitialized: false,
    resave: false,
    secret: process.env.COOKIE_SECRET,
    proxy: true,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
      domain:
        process.env.NODE_ENV === "production" && process.env.SESSION_DOMAIN,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// router URL ,  REAL FILE PWD
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.get("/", (req, res) => {
  res.send("🍀 4LEAF WEB SERVER WITH EXPRESS FRAMEWORK");
});

// Routes Settings
app.use("/api/user", userRouter);
app.use("/api/banner", bannerRouter);
app.use("/api/popup", popupRouter);
app.use("/api/company", companyRouter);
app.use("/api/accept", acceptRouter);
app.use("/api/notice", noticeRouter);
app.use("/api/gallery", galleryRouter);
app.use("/api/question", questionRouter);
app.use("/api/seo", seoRouter);
app.use("/api/edit", editRouter);

// second minute hour day-of-month month day-of-week
const task = cron.schedule(
  "10 * * * * *",
  function () {
    console.log("node-cron 실행 테스트d");
    console.log(new Date());
  },
  {
    scheduled: false,
    timezone: "Asia/Seoul",
  }
);

// task.start();

app.listen(PORT, () => {
  console.log(`🍀 ${PORT} NODE WEB_SERVER EXPRESS STARTING!`);
});
