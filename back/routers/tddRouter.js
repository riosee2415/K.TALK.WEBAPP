const express = require("express");
const isAdminCheck = require("../middlewares/isAdminCheck");
const isLoggedIn = require("../middlewares/isLoggedIn");

const models = require("../models");

const router = express.Router();

// CONSTRANTS
const MON = 1;
const TUE = 2;
const WHS = 3;
const THS = 4;
const FRI = 5;
const SAT = 6;
const SUN = 7;

router.post("/list", async (req, res, next) => {
  const { lectureId } = req.body;

  //   const TEMP_LECTUREID = 18;

  const selectQ = `
    SELECT	A.id,
            A.isDelete,
            A.isChange,
            A.date,
            DATE_FORMAT(A.endDate, "%Y년 %m월 %d일")		  AS viewEndDate,
            DATE_FORMAT(A.createdAt, "%Y년 %m월 %d일")		  AS viewCreatedAt,
            DATE_FORMAT(A.endDate, "%Y년 %m월 %d일")		  AS viewUpdatedAt,
            CASE
              WHEN	DATE_FORMAT(NOW(), "%Y%m%d") < DATE_FORMAT(A.endDate, "%Y%m%d") THEN DATEDIFF(DATE_FORMAT(A.endDate, "%Y%m%d"), DATE_FORMAT(NOW(), "%Y%m%d")) 
              ELSE    0
            END as compareDate,
            A.UserId,
            A.LectureId,
            B.day,
            B.count,
            C.userId,
            C.username,
            C.level,
            C.birth,
            C.stuCountry,
            CASE DAYOFWEEK(NOW()) 
              WHEN '1' THEN '7'
              WHEN '2' THEN '1'
              WHEN '3' THEN '2'
              WHEN '4' THEN '3'
              WHEN '5' THEN '4'
              WHEN '6' THEN '5'
              WHEN '7' THEN '6'
            END AS todayDay
      FROM	participants		A
     INNER
      JOIN	lectures 			B
        ON	A.LectureId = B.id
     INNER
      JOIN  users               C
        ON  A.UserId = C.id
     WHERE	A.isDelete = 0
       AND	A.LectureId = ${lectureId}
       AND  B.isDelete = 0
  `;

  try {
    const list = await models.sequelize.query(selectQ);

    const datum = list[0];

    // 요일 숫자데이터 구하기
    datum.map((data) => {
      const tempDays = [];
      const arr = String(data.day).split(" ");

      arr.map((v) => {
        switch (v) {
          case "월":
            tempDays.push(MON);
            break;
          case "화":
            tempDays.push(TUE);
            break;
          case "수":
            tempDays.push(WHS);
            break;
          case "목":
            tempDays.push(THS);
            break;
          case "금":
            tempDays.push(FRI);
            break;
          case "토":
            tempDays.push(SAT);
            break;
          case "일":
            tempDays.push(SUN);
            break;

          default:
            break;
        }
      });

      data["afterDay"] = tempDays;
    });

    // 잔여 주 차 구하기
    datum.map((data) => {
      const compareDate = data.compareDate;

      const value =
        compareDate % 7 > 0
          ? parseInt(compareDate / 7) + 1
          : parseInt(compareDate / 7);

      data["ingyerWeek"] = value;
    });

    // 요일 갯 수 구하기
    datum.map((data) => {
      if (data.compareDate < 1) return null;

      const tempDay = [];

      let today = parseInt(data.todayDay);
      for (let i = 0; i < data.compareDate; i++) {
        if (today === 7) {
          today = 1;
        } else {
          today += 1;
        }

        tempDay.push(today);
      }

      data["dayList"] = tempDay;
    });

    // 남은 요일 갯수 구하기
    datum.map((data) => {
      if (data.compareDate < 1) return null;

      let cnt = 0;

      data.afterDay.map((v) => {
        data.dayList.map((v2) => {
          if (v === v2) {
            cnt += 1;
          }
        });
      });

      data["ingyerCnt"] = cnt;
    });

    console.log(datum);

    return res.status(200).json(list[0]);
  } catch (error) {
    console.error(error);
    return res.status(401).send("데이터를 조회할 수 없습니다.");
  }
});

///

///

module.exports = router;
