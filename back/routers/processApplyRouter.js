const express = require("express");
const isAdminCheck = require("../middlewares/isAdminCheck");
const isNanCheck = require("../middlewares/isNanCheck");
const { ProcessApply, ProcessApply2 } = require("../models");
const models = require("../models");

const router = express.Router();

router.post("/list", isAdminCheck, async (req, res, next) => {
  const { isComplete } = req.body;

  const _isComplete = isComplete || ``;

  try {
    const selectQuery = `
    SELECT	    id,
                firstName,
                lastName,
                dateOfBirth,
                gmailAddress,
                loginPw,
                countryofResidence,
                phoneNumber,
                isComplete,
                DATE_FORMAT(completedAt,   "%Y/%m/%d : %H:%i")						  AS	completedAt,
                DATE_FORMAT(createdAt,     "%Y/%m/%d : %H:%i")							AS	createdAt,
                DATE_FORMAT(updatedAt,     "%Y/%m/%d : %H:%i") 					   	AS	updatedAt
    FROM	    processApply2s
   WHERE      1 = 1
         ${_isComplete ? `AND   isComplete = ${_isComplete}` : ``}
  ORDER         BY  createdAt DESC
      `;

    const lists = await models.sequelize.query(selectQuery);

    return res.status(200).json({ lists: lists[0] });
  } catch (error) {
    console.error(error);
    return res.status(401).send("신청서 목록을 불러올 수 없습니다.");
  }
});

router.get("/detail/:apply", isAdminCheck, async (req, res, next) => {
  const { apply } = req.params;

  if (isNanCheck(apply)) {
    return res.status(401).send("잘못된 요청입니다.");
  }
  try {
    const exApp = await ProcessApply.findOne({
      where: { id: parseInt(apply) },
    });

    if (!exApp) {
      return res.status(401).send("존재하지 않는 신청서입니다.");
    }

    const selectQuery = `
    SELECT	    id,
                firstName,
                lastName,
                dateOfBirth,
                gmailAddress,
                loginPw,
                countryofResidence,
                phoneNumber,
                isComplete,
                DATE_FORMAT(completedAt,   "%Y/%m/%d : %H:%i")						  AS	completedAt,
                DATE_FORMAT(createdAt,     "%Y/%m/%d : %H:%i")							AS	createdAt,
                DATE_FORMAT(updatedAt,     "%Y/%m/%d : %H:%i") 					   	AS	updatedAt
      FROM	    processApply2s
     WHERE      1 = 1
       AND      id = ${apply}
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
    loginPw,
    countryofResidence,
    phoneNumber,
  } = req.body;
  try {
    const createResult = await ProcessApply2.create({
      firstName,
      lastName,
      dateOfBirth,
      gmailAddress,
      loginPw,
      countryofResidence,
      phoneNumber,
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
  const { id } = req.body;
  try {
    const exApp = await ProcessApply2.findOne({
      where: { id: parseInt(id) },
    });

    if (!exApp) {
      return res.status(401).send("존재하지 않는 신청서입니다.");
    }

    const updateResult = await ProcessApply2.update(
      {
        isComplete: true,
        completedAt: new Date(),
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

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

router.post("/apply/list", isAdminCheck, async (req, res, next) => {
  const { isComplete } = req.body;

  const _isComplete = isComplete || ``;

  try {
    const selectQuery = `
    SELECT	    cFirstName,
                cLastName,
                cDateOfBirth,
                cGmailAddress,
                cLoginPw,
                cGender,
                cNationality,
                cCountryofResidence,
                cLanguageYouUse,
                cPhonenumber,
                cSns,
                cSnsId,
                cOccupation,
                DATE_FORMAT(completedAt,   "%Y/%m/%d : %H:%i")						  AS	completedAt,
                DATE_FORMAT(createdAt,     "%Y/%m/%d : %H:%i")							AS	createdAt,
                DATE_FORMAT(updatedAt,     "%Y/%m/%d : %H:%i") 					   	AS	updatedAt
    FROM	    processApplys
   WHERE      1 = 1
         ${_isComplete ? `AND   isComplete = ${_isComplete}` : ``}
  ORDER         BY  createdAt DESC
      `;

    const lists = await models.sequelize.query(selectQuery);

    return res.status(200).json({ lists: lists[0] });
  } catch (error) {
    console.error(error);
    return res.status(401).send("신청서 목록을 불러올 수 없습니다.");
  }
});

router.get("/apply/detail/:apply", isAdminCheck, async (req, res, next) => {
  const { apply } = req.params;

  if (isNanCheck(apply)) {
    return res.status(401).send("잘못된 요청입니다.");
  }
  try {
    const exApp = await ProcessApply.findOne({
      where: { id: parseInt(apply) },
    });

    if (!exApp) {
      return res.status(401).send("존재하지 않는 신청서입니다.");
    }

    const selectQuery = `
     SELECT	    cFirstName,
                cLastName,
                cDateOfBirth,
                cGmailAddress,
                cLoginPw,
                cGender,
                cNationality,
                cCountryofResidence,
                cLanguageYouUse,
                cPhonenumber,
                cSns,
                cSnsId,
                cOccupation,
                DATE_FORMAT(completedAt,   "%Y/%m/%d : %H:%i")						  AS	completedAt,
                DATE_FORMAT(createdAt,     "%Y/%m/%d : %H:%i")							AS	createdAt,
                DATE_FORMAT(updatedAt,     "%Y/%m/%d : %H:%i") 					   	AS	updatedAt
      FROM	    processApplys
     WHERE      1 = 1
       AND      id = ${apply}
    `;

    const lists = await models.sequelize.query(selectQuery);

    return res.status(200).json({ lists: lists[0] });
  } catch (error) {
    console.error(error);
    return res.status(401).send("신청서 목록을 불러올 수 없습니다.");
  }
});

router.post("/apply/create", async (req, res, next) => {
  const {
    cFirstName,
    cLastName,
    cDateOfBirth,
    cGmailAddress,
    cLoginPw,
    cGender,
    cNationality,
    cCountryofResidence,
    cLanguageYouUse,
    cPhonenumber,
    cSns,
    cSnsId,
    cOccupation,
  } = req.body;
  try {
    const createResult = await ProcessApply.create({
      cFirstName,
      cLastName,
      cDateOfBirth,
      cGmailAddress,
      cLoginPw,
      cGender,
      cNationality,
      cCountryofResidence,
      cLanguageYouUse,
      cPhonenumber,
      cSns,
      cSnsId,
      cOccupation,
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

router.patch("/apply/update", isAdminCheck, async (req, res, next) => {
  const { id } = req.body;
  try {
    const exApp = await ProcessApply.findOne({
      where: { id: parseInt(id) },
    });

    if (!exApp) {
      return res.status(401).send("존재하지 않는 신청서입니다.");
    }

    const updateResult = await ProcessApply.update(
      {
        isComplete: true,
        completedAt: new Date(),
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
