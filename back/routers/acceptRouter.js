const express = require("express");
const isAdminCheck = require("../middlewares/isAdminCheck");
const { AcceptRecord } = require("../models");
const { Op } = require("sequelize");
const models = require("../models");

const router = express.Router();

router.get("/list", async (req, res, next) => {
  try {
    const currentDate = new Date();

    const startDate = `${currentDate.getFullYear()}-${String(
      currentDate.getMonth() + 1
    ).padStart(2, "0")}-01`;

    let last = new Date(
      String(currentDate.getFullYear()),
      String(currentDate.getMonth() + 1)
    );
    last = new Date(last - 1);
    const lastD = last.getDate();

    const searchStartDate = new Date(startDate);
    const searchLastDate = new Date(
      `${currentDate.getFullYear()}-${String(
        currentDate.getMonth() + 1
      ).padStart(2, "0")}-${lastD}`
    );

    const accepts = await AcceptRecord.findAll({
      where: {
        createdAt: { [Op.gte]: searchStartDate },
        createdAt: { [Op.lte]: searchLastDate },
      },
    });

    return res.status(200).json(accepts);
  } catch (error) {
    console.error(error);
    return res
      .status(401)
      .send("접속자 기록을 조회할 수 없습니다. 개발사에 문의해주세요.");
  }
});

router.post("/create", async (req, res, next) => {
  const { ip } = req.body;

  try {
    const createResult = await AcceptRecord.create({
      ip,
    });

    if (createResult) {
      return res.status(201).json({ result: true });
    }

    return res
      .status(401)
      .send("접속자를 기록할 수 없습니다. 서버 개발팀 확인 요망!");
  } catch (error) {
    console.error(error);
    return res
      .status(401)
      .send("접속자를 기록할 수 없습니다. 프론트 개발팀 확인 요망!");
  }
});

router.post("/list/date", isAdminCheck, async (req, res, next) => {
  const { searchDate } = req.body;

  try {
    const dateParsingData = new Date(searchDate);

    const nextDate = new Date(searchDate);
    nextDate.setDate(nextDate.getDate() + 1);

    const results = await AcceptRecord.findAll({
      where: {
        [Op.and]: [
          { createdAt: { [Op.gte]: dateParsingData } },
          { createdAt: { [Op.lt]: nextDate } },
        ],
      },
    });

    return res.status(200).json(results);
  } catch (error) {
    console.error(error);
    return res
      .status(401)
      .send(
        "접속자 기록을 찾을 수 없습니다. 개발사에 문의해주세요. (문의처 4LEAFSOFTWARE FRONT DEVELOPMENT TEAM)"
      );
  }
});

router.get("/list/graph/:typeId", isAdminCheck, async (req, res, next) => {
  const { typeId } = req.params;

  const validation = Number(typeId);
  const numberFlag = isNaN(validation);

  if (numberFlag) {
    return res
      .status(401)
      .send("잘못된 요청 입니다. 다시 시도해주세요. [DATA TYPE VALIDATION]");
  }

  const value = parseInt(typeId);
  const inFlag = (value > 0 ? true : false) && (value < 3 ? true : false);

  if (!inFlag) {
    return res
      .status(401)
      .send("잘못된 요청 입니다. 다시 시도해주세요. [DATA VALUE VALIDATION]");
  }

  try {
    const condition =
      value === 1
        ? `WHERE  createdAt BETWEEN DATE_ADD(NOW(),INTERVAL -1  WEEK ) AND NOW()`
        : `WHERE  createdAt BETWEEN DATE_ADD(NOW(),INTERVAL -1  MONTH ) AND NOW()`;

    const dQuery = `
    SELECT 	A.createdAt		AS date,
            COUNT(*)		AS count
      FROM	(
              SELECT	DATE_FORMAT(createdAt, '%Y-%m-%d') as createdAt 
                FROM	acceptRecords ar
                ${condition}
            ) A
     GROUP	BY A.createdAt
     ORDER  BY A.createdAt ASC
    `;

    try {
      const results = await models.sequelize.query(dQuery);

      return res.status(200).json(results[0]);
    } catch (error) {
      console.error(error);
      return res
        .status(401)
        .send(
          "접속자 기록을 찾을 수 없습니다. 개발사에 문의해주세요. (문의처 4LEAFSOFTWARE FRONT DEVELOPMENT TEAM)"
        );
    }
  } catch (error) {
    console.error(error);
    return res
      .status(401)
      .send(
        "접속자 기록을 찾을 수 없습니다. 개발사에 문의해주세요. (문의처 4LEAFSOFTWARE FRONT DEVELOPMENT TEAM)"
      );
  }
});

module.exports = router;
