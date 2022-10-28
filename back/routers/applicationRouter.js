const express = require("express");
const isAdminCheck = require("../middlewares/isAdminCheck");
const isNanCheck = require("../middlewares/isNanCheck");
const { Application } = require("../models");
const models = require("../models");

const router = express.Router();

router.post("/useYn/data", async (req, res, next) => {
  const selectQ = `
  SELECT useYn FROM appBooleans
  `;

  try {
    const response = await models.sequelize.query(selectQ);

    return res.status(200).json(response[0][0].useYn);
  } catch (error) {
    console.log();
  }
});

router.post("/useYn", isAdminCheck, async (req, res, next) => {
  const { useYn } = req.body;

  const updateQuery = `
  UPDATE  appBooleans
     SET  useYn = ${useYn},
          lastUseDate = NOW()
   WHERE  id = 1
  `;

  try {
    await models.sequelize.query(updateQuery);

    return res.status(200).json({ result: true });
  } catch (error) {
    console.error(error);
    return res.status(401).send("데이터를 조회할 수 없습니다.");
  }
});

router.post("/list", isAdminCheck, async (req, res, next) => {
  const { isComplete, isTime, time, status } = req.body;

  const _isComplete = parseInt(isComplete) || 3;

  const _status = status || ``;

  const _isTime = isTime || ``;

  const _time = time ? time : ``;

  let orderName = "createdAt";
  let orderSC = "DESC";

  if (_isTime) {
    orderName = "meetDate";
    orderSC = "DESC";
  }

  try {
    const selectQuery = `
      SELECT	  id,
                firstName,
                lastName,
                dateOfBirth,
                gmailAddress,
                nationality,
                countryOfResidence,
                languageYouUse,
                phoneNumber,
                phoneNumber2,
                classHour,
                comment,
                isPaid,
                isComplete,
                DATE_FORMAT(payDate,       "%Y/%m/%d : %H:%i")						    AS	payDate,
                DATE_FORMAT(completedAt,   "%Y/%m/%d : %H:%i")						    AS	completedAt,
                DATE_FORMAT(createdAt,     "%Y/%m/%d : %H:%i")							  AS	createdAt,
                DATE_FORMAT(updatedAt,     "%Y/%m/%d : %H:%i") 					      AS	updatedAt,
                timeDiff,
                wantStartDate,
                teacher,
                freeTeacher,
                isDiscount,
                meetDate,
                meetDate2,
                level,
                job,
                status,
                purpose
        FROM	  applications
       WHERE    1 = 1
                ${
                  _isComplete === 1
                    ? `AND isComplete = 0`
                    : _isComplete === 2
                    ? `AND isComplete = 1`
                    : _isComplete === 3
                    ? ``
                    : 1
                }
                ${
                  _time !== ``
                    ? `AND DATE_FORMAT(meetDate, "%Y-%m-%d") = DATE_FORMAT("${_time}", "%Y-%m-%d")`
                    : ``
                }
                ${_status !== `` ? `AND status LIKE '${_status}' ` : ``}
       ORDER    BY  ${orderName} ${orderSC}
      `;

    const lists = await models.sequelize.query(selectQuery);

    return res.status(200).json({ lists: lists[0] });
  } catch (error) {
    console.error(error);
    return res.status(401).send("신청서 목록을 불러올 수 없습니다.");
  }
});

router.post("/detail", isAdminCheck, async (req, res, next) => {
  const { email } = req.body;

  try {
    const exApp = await Application.findOne({
      where: { gmailAddress: email },
    });

    if (!exApp) {
      return res.status(401).send("존재하지 않는 신청서입니다.");
    }

    const selectQuery = `
     SELECT	    A.id,
                A.firstName,
                A.lastName,
                A.dateOfBirth,
                A.gmailAddress,
                A.nationality,
                A.countryOfResidence,
                A.languageYouUse,
                A.phoneNumber,
                A.phoneNumber2,
                A.classHour,
                A.comment,
                A.isPaid,
                A.isComplete,
                DATE_FORMAT(A.payDate,       "%Y/%m/%d : %H:%i")						  AS	payDate,
                DATE_FORMAT(A.completedAt,   "%Y/%m/%d : %H:%i")						  AS	completedAt,
                DATE_FORMAT(A.createdAt,     "%Y/%m/%d : %H:%i")							AS	createdAt,
                DATE_FORMAT(A.updatedAt,     "%Y/%m/%d : %H:%i") 					   	AS	updatedAt,
                A.timeDiff,
                A.wantStartDate,
                A.teacher,
                A.freeTeacher,
                A.isDiscount,
                A.meetDate,
                A.meetDate2,
                A.level,
                A.job,
                A.status,
                A.purpose,
                B.id                                                          AS userPkId,
                B.stuNo,
                B.stuJob,
                B.userId,
                B.profileImage,
                B.username,
                B.mobile,
                B.email,
                B.birth,
                B.stuPayCount,
                B.sns,
                B.snsId,
                B.gender,
                B.address,
                B.detailAddress,
                B.stuCountry,
                B.stuLiveCon,
                B.stuLanguage
      FROM	    applications    A
      LEFT
     OUTER
      JOIN      users           B
        ON      A.gmailAddress = B.email
     WHERE      1 = 1
       AND      gmailAddress = "${email}"
    `;

    const lists = await models.sequelize.query(selectQuery);

    return res.status(200).json({ lists: lists[0] });
  } catch (error) {
    console.error(error);
    return res.status(401).send("신청서 목록을 불러올 수 없습니다.");
  }
});

router.post("/create", async (req, res, next) => {
  const {
    firstName,
    lastName,
    dateOfBirth,
    gmailAddress,
    nationality,
    countryOfResidence,
    languageYouUse,
    phoneNumber,
    phoneNumber2,
    classHour,
    terms,
    comment,
  } = req.body;
  try {
    const findExistQuery = `
    SELECT  id
      FROM  applications
     WHERE  gmailAddress = "${gmailAddress}"
    `;

    const exData = await models.sequelize.query(findExistQuery);

    if (exData[0].length !== 0) {
      return res
        .status(401)
        .send("이미 해당 이메일로 등록된 신청서 양식이 존재합니다.");
    }

    const createResult = await Application.create({
      firstName,
      lastName,
      dateOfBirth,
      gmailAddress,
      nationality,
      countryOfResidence,
      languageYouUse,
      phoneNumber,
      phoneNumber2: phoneNumber2 ? phoneNumber2 : null,
      classHour,
      terms,
      comment: comment ? comment : null,
    });

    if (!createResult) {
      return res.status(401).send("A Problem Occurred During Processing.");
    }

    return res.status(201).json({ result: true });
  } catch (error) {
    console.error(error);
    return res.status(401).send("Cannot Submit This Application.");
  }
});

router.patch("/update", isAdminCheck, async (req, res, next) => {
  const {
    id,
    timeDiff,
    wantStartDate,
    teacher,
    freeTeacher,
    isDiscount,
    meetDate,
    meetDate2,
    level,
    job,
    purpose,
    status,
  } = req.body;
  try {
    const exApp = await Application.findOne({
      where: { id: parseInt(id) },
    });

    if (!exApp) {
      return res.status(401).send("존재하지 않는 신청서입니다.");
    }

    const updateResult = await Application.update(
      {
        timeDiff,
        wantStartDate,
        teacher,
        freeTeacher,
        isDiscount,
        meetDate,
        meetDate2,
        level,
        job,
        purpose,
        status,
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
    return res.status(401).send("신청서를 처리할 수 없습니다.");
  }
});

router.patch("/pay/update", isAdminCheck, async (req, res, next) => {
  const { id } = req.body;
  try {
    const exApp = await Application.findOne({
      where: { id: parseInt(id) },
    });

    if (!exApp) {
      return res.status(401).send("존재하지 않는 신청서입니다.");
    }

    const updateResult = await Application.update(
      {
        isPaid: true,
        payDate: new Date(),
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
    return res.status(401).send("신청서를 처리할 수 없습니다.");
  }
});

module.exports = router;
