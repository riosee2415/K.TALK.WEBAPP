const Sequelize = require("sequelize");
const user = require("./user");
const mainbanner = require("./mainbanner");
const companyinfo = require("./companyinfo");
const popup = require("./popup");
const acceptrecord = require("./acceptrecord");
const notice = require("./notice");
const gallary = require("./gallary");
const question = require("./question");
const questiontype = require("./questiontype");
const seo = require("./seo");
const application = require("./application");
const commute = require("./commute");
const lecture = require("./lecture");
const message = require("./message");
const participant = require("./participant");
const lecturediary = require("./lecturediary");
const bookfolder = require("./bookfolder");
const book = require("./book");

const env = process.env.NODE_ENV || "development";
const config = require("../config/config")[env];
const db = {};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

db.User = user;
db.MainBanner = mainbanner;
db.CompanyInfo = companyinfo;
db.Popup = popup;
db.AcceptRecord = acceptrecord;
db.Notice = notice;
db.Gallary = gallary;
db.Question = question;
db.QuestionType = questiontype;
db.Seo = seo;
db.Application = application;
db.Lecture = lecture;
db.Message = message;
db.Participant = participant;
db.Commute = commute;
db.LectureDiary = lecturediary;
db.BookFolder = bookfolder;
db.Book = book;

Object.keys(db).forEach((modelName) => {
  db[modelName].init(sequelize);
});

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
