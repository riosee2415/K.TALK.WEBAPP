const nodemailer = require("nodemailer");
const smtpPool = require("nodemailer-smtp-pool");
const dotenv = require("dotenv");
dotenv.config();

const smtpTransport = nodemailer.createTransport(
  smtpPool({
    service: "Gmail",
    host: "localhost",
    port: "465",
    tls: {
      rejectUnauthorize: false,
    },

    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASSWORD,
    },
    maxConnections: 5,
    maxMessages: 10,
  })
);

const sendMail = async (email) => {
  await smtpTransport.sendMail(email, function (err, info) {
    if (err) {
      console.error("Send Mail error : ", err);
      //smtpTransport.close();
    } else {
      console.log("Message sent : ", info);
      //smtpTransport.close();
    }
  });
};

const sendSecretMail = (adress, title, content) => {
  const email = {
    from: "teamagent.net",
    to: adress,
    subject: title,
    html: content,
  };

  return sendMail(email);
};

module.exports = sendSecretMail;
