import React, { useCallback, useEffect, useState } from "react";
import wrapper from "../../../store/configureStore";
import { END } from "redux-saga";
import axios from "axios";
import styled from "styled-components";
import AdminLayout from "../../../components/AdminLayout";
import PageHeader from "../../../components/admin/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Modal,
  Table,
  Input,
  message,
  Form,
  Select,
  DatePicker,
  Calendar,
  Image,
  Popconfirm,
} from "antd";
import {
  Wrapper,
  Text,
  TextInput,
  GuideDiv,
  SpanText,
} from "../../../components/commonComponents";
import Theme from "../../../components/Theme";
import {
  APP_LIST_REQUEST,
  APP_DETAIL_REQUEST,
  APP_UPDATE_REQUEST,
} from "../../../reducers/application";
import {
  LOAD_MY_INFO_REQUEST,
  USER_ADMIN_UPDATE_REQUEST,
  USER_ALL_LIST_REQUEST,
  USER_CLASS_CHANGE_REQUEST,
  USER_STU_CREATE_REQUEST,
  USER_TEACHER_LIST_REQUEST,
} from "../../../reducers/user";
import {
  PAYMENT_CREATE_REQUEST,
  PAYMENT_LIST_REQUEST,
} from "../../../reducers/payment";
import { LECTURE_ALL_LIST_REQUEST } from "../../../reducers/lecture";
import { useRouter } from "next/router";
import moment from "moment";
import { CalendarOutlined } from "@ant-design/icons";
import {
  PARTICIPANT_CREATE_REQUEST,
  PARTICIPANT_DELETE_REQUEST,
  PARTICIPANT_USER_CURRENT_LIST_REQUEST,
  PARTICIPANT_USER_DELETE_LIST_REQUEST,
  PARTICIPANT_USER_LIMIT_LIST_REQUEST,
  PARTICIPANT_USER_MOVE_LIST_REQUEST,
} from "../../../reducers/participant";
import {
  COMMUTE_ADMIN_LIST_REQUEST,
  COMMUTE_RESET,
} from "../../../reducers/commute";
import useInput from "../../../hooks/useInput";

const FormItem = styled(Form.Item)`
  width: ${(props) => props.width || `100%`};
  margin: 0px;
`;

const CustomTextArea = styled(Input.TextArea)`
  width: ${(props) => props.width || `100%`};
`;

const CustomDatePicker = styled(DatePicker)`
  width: ${(props) => props.width || `350px`};
`;

const AdminContent = styled.div`
  padding: 20px;
`;

const List = () => {
  // LOAD CURRENT INFO AREA /////////////////////////////////////////////
  const {
    me,
    st_loadMyInfoDone,
    teachers,
    createId,
    //
    st_userStuCreateDone,
    st_userStuCreateError,
    //
    st_userChangeDone,
    st_userChangeError,
    //
    st_userAdminUpdateDone,
    //
  } = useSelector((state) => state.user);

  const {
    paymentList,
    //
    st_paymentListDone,
    st_paymentListError,
    //
    st_paymentCreateDone,
  } = useSelector((state) => state.payment);

  const {
    applicationList,
    applicationDetail,
    //
    st_appListError,
    //
    st_appUpdateDone,
    st_appUpdateError,
    //
    st_appDetailDone,
    st_appDetailError,
    //
  } = useSelector((state) => state.app);

  const { st_lectureAllListError, allLectures } = useSelector(
    (state) => state.lecture
  );

  const {
    //
    partUserMoveList,
    st_participantUserMoveListDone,
    //
    partUserCurrentList,
    //
    partUserLimitList,
    st_participantUserLimitListDone,
    //
    partUserDeleteList,
    st_participantUserDeleteListDone,
    //
    st_participantDeleteDone,
    //
    st_participantCreateDone,
    st_participantCreateError,
  } = useSelector((state) => state.participant);

  const { commuteAdminList } = useSelector((state) => state.commute);

  const router = useRouter();

  const moveLinkHandler = useCallback((link) => {
    router.push(link);
  }, []);

  useEffect(() => {
    if (st_loadMyInfoDone) {
      if (!me || parseInt(me.level) < 3) {
        moveLinkHandler(`/admin`);
      }
    }
  }, [st_loadMyInfoDone]);
  /////////////////////////////////////////////////////////////////////////

  ////// HOOKS //////
  const dispatch = useDispatch();

  const [userForm] = Form.useForm(); // 학생 정보 폼
  const [stuForm] = Form.useForm(); // 학생 수업 참여 폼
  const [stuUForm] = Form.useForm(); // 학생 수업 수정 폼

  const [uModal, setUModal] = useState(false); // 반 옮기기 모달 토글

  const [opt2, setOpt2] = useState(null); // 참가시킬 강의 목록
  const [time, setTime] = useState(false); // 줌 미팅 시간 값
  const [isPay, setIsPay] = useState("네"); // 결제여부
  const [uData, setUData] = useState(null); // 학생 반 옮기기 정보 담기
  const [noData, setNoData] = useState(null); // 결제여부 아니요 였을 시 강의목록
  const [isJoin, setIsJoin] = useState(false); // 회원가입여부
  const [yesData, setYesData] = useState(null); // 결제여부 네 였을 시 강의 목록
  const [isBirth, setIsBirth] = useState(false); // 생년월일 달력 열고닫기
  const [userData, setUserData] = useState(null); // 학생상세정보
  const [stuSelect, setStuSelect] = useState(""); // 학생 출석 목록 내 강의 검색
  const [statusType, setStatusType] = useState(""); // 등록상태 검색 값
  const [isType, setIsType] = useState(null); // 등록인지 수정인지 값 ( 회원가입 전 )
  const [currentTab, setCurrentTab] = useState(3); // 3 = 전체, 2 = 완료, 1 = 미완료
  const [currentId, setCurrentId] = useState(null); // 테이블 선택 값

  const numberInput = useInput(); // 강의기간 (form안에 form이여서 input 쓸수밖에 없음)

  ////// USEEFFECT //////

  // 회원가입 여부에 따라서 isType 조절하기
  useEffect(() => {
    if (isJoin) {
      setIsType(null);
    } else {
      setIsType("수정");
    }
  }, [userData]);

  useEffect(() => {
    const qs = router.query;

    dispatch({
      type: APP_LIST_REQUEST,
      data: {
        isComplete: currentTab,
        time: time ? moment(time).format("YYYY-MM-DD") : null,
        status: statusType,
      },
    });
  }, [time, statusType, currentTab]);

  // ========= SUCCESS ========= //

  // 수업 참여 후 처리
  useEffect(() => {
    if (st_participantCreateDone) {
      // 학생이 참여하고 있는 강의 가져오기
      dispatch({
        type: PARTICIPANT_USER_CURRENT_LIST_REQUEST,
        data: {
          UserId: applicationDetail[0].userPkId,
          isDelete: "0",
          isChange: "0",
        },
      });

      if (noData) {
        // 프리퀀시 올리기 (결제내역생성)
        dispatch({
          type: PAYMENT_CREATE_REQUEST,
          data: {
            type: "-",
            email: applicationDetail[0].gmailAddress,
            name: applicationDetail[0].username,
            userId: applicationDetail[0].userPkId,
            lectureId: JSON.parse(noData).id,
          },
        });
      }

      setIsPay("네");
      setNoData(null);
      setYesData(null);
      numberInput.setValue(``);

      return message.success("학생이 수업에 참여했습니다.");
    }
  }, [st_participantCreateDone]);

  // 학생 정보 수정 후처리
  useEffect(() => {
    if (st_userAdminUpdateDone) {
      dispatch({
        type: APP_DETAIL_REQUEST,
        data: {
          email: userData && userData.gmailAddress,
        },
      });

      return message.success("회원의 정보를 수정했습니다.");
    }
  }, [st_userAdminUpdateDone]);

  // 반 옮기기 후처리
  useEffect(() => {
    if (st_userChangeDone) {
      setUData(null);
      setUModal(false);
      stuUForm.resetFields();

      // 학생 반 이동 내역 가져오기
      dispatch({
        type: PARTICIPANT_USER_MOVE_LIST_REQUEST,
        data: {
          UserId: applicationDetail[0].userPkId,
          isDelete: "0",
          isChange: "1",
        },
      });

      // 학생이 참여하고 있는 강의 가져오기
      dispatch({
        type: PARTICIPANT_USER_CURRENT_LIST_REQUEST,
        data: {
          UserId: applicationDetail[0].userPkId,
          isDelete: "0",
          isChange: "0",
        },
      });

      return message.success("학생의 수업을 수정하였습니다.");
    }
  }, [st_userChangeDone]);

  useEffect(() => {
    if (st_userChangeError) {
      return message.error(st_userChangeError);
    }
  }, [st_userChangeError]);

  // 학생 수업 빼기 후 처리
  useEffect(() => {
    if (st_participantDeleteDone) {
      // 학생이 참여하고 있는 강의 가져오기
      dispatch({
        type: PARTICIPANT_USER_CURRENT_LIST_REQUEST,
        data: {
          UserId: applicationDetail[0].userPkId,
          isDelete: "0",
          isChange: "0",
        },
      });

      // 종료된 강의 가져오기
      dispatch({
        type: PARTICIPANT_USER_DELETE_LIST_REQUEST,
        data: {
          UserId: applicationDetail[0].userPkId,
          isDelete: "1",
          isChange: "0",
        },
      });

      return message.success("해당 수업이 종료되었습니다.");
    }
  }, [st_participantDeleteDone]);

  useEffect(() => {
    if (st_paymentListDone) {
      const payOpt =
        paymentList &&
        paymentList.map((data) => {
          if (data.isComplete === 0) {
            return;
          }
          return (
            <Select.Option key={data.id} value={JSON.stringify(data)}>
              {`결제일: ${data.createdAt.slice(0, 10)} | ${data.course} | `}
              {`결제한 가격: $${data.price} |  ${data.email}`}
            </Select.Option>
          );
        });
    }
  }, [st_paymentListDone]);

  useEffect(() => {
    if (st_userStuCreateDone) {
      if (noData) {
        dispatch({
          type: PAYMENT_CREATE_REQUEST,
          data: {
            type: "-",
            email: userData && userData.gmailAddress,
            name: `${userData && userData.firstName} ${
              userData && userData.lastName
            }`,
            userId: createId,
            lectureId: JSON.parse(noData).id,
          },
        });
      }

      window.location.reload();

      return message.success("회원을 생성 했습니다.");
    }
  }, [st_userStuCreateDone]);

  // =========== ERROR ============== //

  useEffect(() => {
    if (st_lectureAllListError) {
      return message.error(st_lectureAllListError);
    }
  }, [st_lectureAllListError]);

  useEffect(() => {
    if (st_appDetailError) {
      return message.error(st_appDetailError);
    }
  }, [st_appDetailError]);

  // 수업 참여 후 처리
  useEffect(() => {
    if (st_participantCreateError) {
      return message.error(st_participantCreateError);
    }
  }, [st_participantCreateError]);

  useEffect(() => {
    if (st_appUpdateError) {
      return message.error(st_appUpdateError);
    }
  }, [st_appUpdateError]);

  useEffect(() => {
    if (st_appListError) {
      return message.error(st_appListError);
    }
  }, [st_appListError]);

  useEffect(() => {
    if (st_paymentListError) {
      return message.error(st_paymentListError);
    }
  }, [st_paymentListError]);

  useEffect(() => {
    if (st_userStuCreateError) {
      return message.error(st_userStuCreateError);
    }
  }, [st_userStuCreateError]);

  useEffect(() => {
    if (st_lectureAllListError) {
      return message.error(st_lectureAllListError);
    }
  }, [st_lectureAllListError]);

  ////////////////////////////////////////
  ////////////////////////////////////////
  ////////////////////////////////////////
  ////////////////////////////////////////
  ////////////////////////////////////////

  // 신청서 폼 수정
  useEffect(() => {
    if (st_appUpdateDone) {
      window.location.reload();

      return message.success("신청서 정보가 수정되었습니다.");
    }
  }, [st_appUpdateDone]);

  useEffect(() => {
    if (st_appDetailDone) {
      // 학생 정보 세팅
      if (applicationDetail[0]) {
        userForm.setFieldsValue({
          // 가능한 수업시간
          classHour: applicationDetail[0].classHour,
          // 시차
          timeDiff: applicationDetail[0].timeDiff,
          // 원하는 시작 날짜
          wantStartDate: applicationDetail[0].wantStartDate
            ? moment(applicationDetail[0].wantStartDate)
            : null,
          // 담당강사
          teacher: applicationDetail[0].teacher,
          // 줌 미팅 날짜
          meetDate:
            applicationDetail[0] && applicationDetail[0].meetDate
              ? moment(applicationDetail[0] && applicationDetail[0].meetDate)
              : null,
          // 줌 미팅 시간
          meetDate2:
            applicationDetail[0] && applicationDetail[0].meetDate2
              ? applicationDetail[0].meetDate2
              : "",
          // 레벨
          level: applicationDetail[0].level,
          // 메모
          purpose: applicationDetail[0].purpose,
          // comment
          comment: applicationDetail[0].comment,
          // 무료수업 담당 강사
          freeTeacher: applicationDetail[0].freeTeacher,
          // 이름
          username: isJoin
            ? applicationDetail[0].username
            : `${userData && userData.firstName} ${
                userData && userData.lastName
              }`,
          // 이메일
          email: isJoin
            ? applicationDetail[0].email
            : userData && userData.gmailAddress,
          // 아이디
          userId: isJoin
            ? applicationDetail[0].userId
            : userData && userData.gmailAddress,
          // sns
          sns: applicationDetail[0].sns,
          // snsId
          snsId: applicationDetail[0].snsId,
          // 생년월일
          birth: applicationDetail[0].birth
            ? applicationDetail[0].birth.slice(0, 10)
            : userData && userData.dateOfBirth,
          // 전화번호
          mobile: isJoin
            ? applicationDetail[0].mobile
            : `${userData && userData.phoneNumber} ${
                userData && userData.phoneNumber2
              }`,
          // 비밀번호
          password: isJoin
            ? applicationDetail[0].mobile
              ? applicationDetail[0].mobile.slice(-4)
              : ""
            : userData && userData.phoneNumber2.slice(-4),
          // 거주국가
          stuLiveCon:
            applicationDetail[0] && applicationDetail[0].stuLiveCon
              ? applicationDetail[0].stuLiveCon
              : applicationDetail[0].countryOfResidence,
          // 국가
          stuCountry:
            applicationDetail[0] && applicationDetail[0].stuCountry
              ? applicationDetail[0].stuCountry
              : applicationDetail[0].nationality,
          // 사용언어
          stuLanguage:
            applicationDetail[0] && applicationDetail[0].stuLanguage
              ? applicationDetail[0].stuLanguage
              : applicationDetail[0].languageYouUse,
          // 회차
          stuPayCount: applicationDetail[0].stuPayCount,
          // 직업
          job: isJoin ? applicationDetail[0].stuJob : userData && userData.job,
          // 등록상태
          status: applicationDetail[0].status,
          // 성별
          gender: applicationDetail[0].gender,
          // 주소
          address: applicationDetail[0].address,
        });
      }

      if (isJoin) {
        // 학생이 참여하고 있는 강의 가져오기
        dispatch({
          type: PARTICIPANT_USER_CURRENT_LIST_REQUEST,
          data: {
            UserId: applicationDetail[0].userPkId,
            isDelete: "0",
            isChange: "0",
          },
        });

        // 학생이 결제한 목록 가져오기
        dispatch({
          type: PAYMENT_LIST_REQUEST,
          data: {
            email: applicationDetail[0].email,
          },
        });

        // 학생 반 이동 내역 가져오기
        dispatch({
          type: PARTICIPANT_USER_MOVE_LIST_REQUEST,
          data: {
            UserId: applicationDetail[0].userPkId,
            isDelete: "0",
            isChange: "1",
          },
        });

        // 학생의 일주일 이하로 남은 강의 내역 가져오기
        dispatch({
          type: PARTICIPANT_USER_LIMIT_LIST_REQUEST,
          data: {
            UserId: applicationDetail[0].userPkId,
          },
        });

        // 종료된 강의 가져오기
        dispatch({
          type: PARTICIPANT_USER_DELETE_LIST_REQUEST,
          data: {
            UserId: applicationDetail[0].userPkId,
            isDelete: "1",
            isChange: "0",
          },
        });

        // 유저 정보 가져오기
        dispatch({
          type: USER_ALL_LIST_REQUEST,
          data: {
            type: 1,
            name: "",
            email: "",
          },
        });
      }
    }
  }, [userForm, st_appDetailDone, applicationDetail, isJoin, userData]);

  // 참가시킬 강의 정보 세팅
  useEffect(() => {
    setOpt2(
      paymentList &&
        paymentList.map((data) => {
          if (data.UserId) return;
          if (data.isComplete === 0) {
            return;
          }
          return (
            <Option
              key={data.id}
              value={JSON.stringify(data)}
              // value={`${data.id},${data.LetureId},${data.week}`}
            >
              {`결제일: ${data.createdAt.slice(0, 10)} | ${data.course} | `}
              {`결제한 가격: $${data.price} |  ${data.email}`}
            </Option>
          );
        })
    );
  }, [paymentList]);

  ////// TOGGLE //////

  // 생년월일 토글
  const isBirthToggle = useCallback(() => {
    setIsBirth(!isBirth);
  }, [isBirth]);

  // 반옮기기 모달 토글
  const uModalToggle = useCallback(
    (data) => {
      if (data) {
        setUData(data);
      }

      stuUForm.resetFields();
      setUModal(!uModal);
    },
    [uModal]
  );

  ////// HANDLER //////

  // 등록 수정 선택
  const typeHandler = useCallback((data) => {
    setIsType(data);
  }, []);

  // 왼쪽 테이블 선택
  const row = {
    onChange: (selectedRowKeys, selectedRows) => {
      // 아이디 값
      setCurrentId(selectedRowKeys);

      // 유저 폼 리셋 - 값이 없는 폼이 있을수도 있기 때문에
      userForm.resetFields();

      // 학생 회원가입 여부 기능
      setIsJoin(selectedRows[0].isComplete === 0 ? false : true);

      // 학생 정보담기
      setUserData(selectedRows[0]);

      // 학생 정보 불러오기
      dispatch({
        type: APP_DETAIL_REQUEST,
        data: {
          email: selectedRows[0].gmailAddress,
        },
      });

      // 학생 수업 참여 정보 세팅
      stuForm.setFieldsValue({
        name: `${selectedRows[0].firstName} ${selectedRows[0].lastName}`,
      });

      // 학생 수업 참여 강의 전체 목록 가져오기
      dispatch({
        type: LECTURE_ALL_LIST_REQUEST,
        data: {
          TeacherId: "",
          studentName: "",
          time: "",
          startLv: "",
        },
      });

      // 학생 출석목록 select 초기화
      setStuSelect(null);
      dispatch({
        type: COMMUTE_RESET,
      });

      // 학생수업참여 기능 리셋
      setIsPay("네");

      // 결제여부 네 기능시 가져오는 강의목록
      setYesData(null);
      numberInput.setValue(``);

      // 결제여부 아니요 기능시 가져오는 강의목록
      setNoData(null);
    },
  };

  // 결제여부 어떤걸 선택하든 강의 목록 기능
  const noLectureHandler = useCallback((data) => {
    setNoData(data);
  }, []);

  // 달력 날짜 수정 기능
  const dateChagneHandler = useCallback((data) => {
    const birth = moment(data).format("YYYY-MM-DD");
    userForm.setFieldsValue({
      birth: birth,
    });
  }, []);

  // 학생 수업 수정 기능
  const stuUpdateHandler = useCallback(
    (data) => {
      if (!data.changelecture) {
        return message.error(`바꿀 강의를 선택해주세요.`);
      }

      let Day = Math.ceil(
        Math.abs(
          moment
            .duration(moment().diff(moment(uData && uData.endDate)))
            .asDays()
        )
      );

      dispatch({
        type: USER_CLASS_CHANGE_REQUEST,
        data: {
          UserId: uData && uData.UserId,
          LectureId: uData && uData.LectureId,
          ChangeLectureId: data.changelecture,
          date: Day,
          endDate: uData.endDate,
        },
      });
    },
    [uData]
  );

  // 수업 빼기 기능
  const onEndClassSubmit = useCallback((data) => {
    dispatch({
      type: PARTICIPANT_DELETE_REQUEST,
      data: {
        UserId: data.UserId,
        LectureId: data.LectureId,
      },
    });
  }, []);

  // 출석목록 검색
  const onClickCommuteHandler = useCallback(() => {
    dispatch({
      type: COMMUTE_ADMIN_LIST_REQUEST,
      data: {
        LectureId: stuSelect,
        UserId: applicationDetail[0].userPkId,
      },
    });
  }, [stuSelect, applicationDetail]);

  // 참가시킬 강의 기능
  const onSeachHandler = useCallback((LectureId, paymentData) => {
    let arr = [];

    paymentData.map((data, idx) => {
      if (data.LetureId === LectureId) {
        arr.push({
          id: data.id,
          week: data.week,
        });
      }
    });

    setYesData(arr);
  }, []);

  // 학생 수업 참여 기능
  const onUpdateClassSubmit = useCallback(() => {
    let partLecture = yesData ? JSON.parse(yesData) : null;
    let lectureList = noData ? JSON.parse(noData) : null; // 아니오 했을 시 선택된 강의 정보

    // // if (lectureList) {
    // //   if (moment() < moment(lectureList.startDate)) {
    // //     return message.error(
    // //       "수업 참여일이 수업 시작 날짜보다 과거일 수 없습니다."
    // //     );
    // //   }
    // // } else if (partLecture) {
    // //   if (moment() < moment(partLecture.startDate.slice(0, 10))) {
    // //     return message.error(
    // //       "수업 참여일이 수업 시작 날짜보다 과거일 수 없습니다."
    // //     );
    // //   }
    // // }

    // data : 강의기간 (주차 * 7) == 일수
    // endDate : 강의 안에 만료일
    // paymentId : payclass안의 강의의 ID / "아니오" === null

    dispatch({
      type: PARTICIPANT_CREATE_REQUEST,
      data: {
        UserId: applicationDetail && applicationDetail[0].userPkId,
        LectureId: lectureList ? lectureList.id : partLecture.LetureId,
        date: lectureList
          ? parseInt(numberInput.value) * 7
          : parseInt(partLecture.week) * 7,
        endDate: lectureList
          ? moment()
              .add(parseInt(numberInput.value * 7 - 1), "days")
              .format("YYYY-MM-DD")
          : moment()
              .add(parseInt(partLecture.week * 7 - 1), "days")
              .format("YYYY-MM-DD"),
        PaymentId: lectureList ? null : partLecture.id,
      },
    });
  }, [noData, yesData, numberInput.value, applicationDetail]);

  // 결제여부 선택기능
  const paySelectHandler = useCallback((data) => {
    setIsPay(data);
  }, []);

  // 학생 상세정보 업데이트
  const updateStuFinish = useCallback(
    (data) => {
      dispatch({
        type: USER_ADMIN_UPDATE_REQUEST,
        data: {
          id: applicationDetail[0].userPkId,
          username: data.username,
          birth: data.birth,
          userId: data.email,
          email: data.email,
          mobile: data.mobile,
          password: data.password,
          stuCountry: data.stuCountry,
          stuLiveCon: data.stuLiveCon,
          stuLanguage: data.stuLanguage,
          sns: data.sns,
          snsId: data.snsId,
          stuPayCount: data.stuPayCount,
          classHour: data.classHour,
          timeDiff: data.timeDiff,
          wantStartDate: data.wantStartDate
            ? data.wantStartDate.format("YYYY-MM-DD")
            : null,
          teacher: data.teacher,
          freeTeacher: data.freeTeacher,
          meetDate: data.meetDate ? data.meetDate.format("YYYY-MM-DD") : null,
          meetDate2: data.meetDate2,
          level: data.level,
          purpose: data.purpose,
          gender: data.gender,
          stuJob: data.job,
          address: data.address,
          status: data.status,
          // detailAddress : data.detailAddress,
          // adminMemo : "",
        },
      });

      // if (data.email === applicationDetail[0].email) {
      //   dispatch({
      //     type: USER_ADMIN_UPDATE_REQUEST,
      //     data: {
      //       id: applicationDetail[0].userPkId,
      //       username: data.username,
      //       birth: data.birth,
      //       mobile: data.mobile,
      //       password: data.password,
      //       stuCountry: data.stuCountry,
      //       stuLiveCon: data.stuLiveCon,
      //       stuLanguage: data.stuLanguage,
      //       sns: data.sns,
      //       snsId: data.snsId,
      //       stuPayCount: data.stuPayCount,
      //       classHour: data.classHour,
      //       timeDiff: data.timeDiff,
      //       wantStartDate: data.wantStartDate
      //         ? data.wantStartDate.format("YYYY-MM-DD")
      //         : "",
      //       teacher: data.teacher,
      //       freeTeacher: data.freeTeacher,
      //       meetDate: data.meetDate
      //         ? data.meetDate.format("YYYY-MM-DD hh:mm")
      //         : "",
      //       level: data.level,
      //       purpose: data.purpose,
      //       gender: data.gender,
      //       stuJob: data.job,
      //     },
      //   });
      // } else {
      //   dispatch({
      //     type: USER_ADMIN_UPDATE_REQUEST,
      //     data: {
      //       id: applicationDetail[0].userPkId,
      //       username: data.username,
      //       userId: data.email,
      //       email: data.email,
      //       birth: data.birth,
      //       mobile: data.mobile,
      //       password: data.password,
      //       stuCountry: data.stuCountry,
      //       stuLiveCon: data.stuLiveCon,
      //       stuLanguage: data.stuLanguage,
      //       sns: data.sns,
      //       snsId: data.snsId,
      //       stuPayCount: data.stuPayCount,
      //       classHour: data.classHour,
      //       timeDiff: data.timeDiff,
      //       wantStartDate: data.wantStartDate
      //         ? data.wantStartDate.format("YYYY-MM-DD")
      //         : "",
      //       teacher: data.teacher,
      //       freeTeacher: data.freeTeacher,
      //       meetDate: data.meetDate
      //         ? data.meetDate.format("YYYY-MM-DD hh:mm")
      //         : "",
      //       level: data.level,
      //       purpose: data.purpose,
      //       gender: data.gender,
      //       stuJob: data.job,
      //     },
      //   });
      // }
    },
    [applicationDetail]
  );

  // 학생 생성하기
  const createFinish = useCallback(
    (data) => {
      if (isType === null) {
        return message.error(
          "학생 정보 오른쪽 등록 및 수정버튼을 다시 눌러주시기 바랍니다."
        );
      }

      if (isType === "등록") {
        if (!yesData && !noData) {
          return message.error("수업을 선택 후 회원 등록이 가능합니다.");
        }

        if (!data.gender) {
          return message.error("등록하실 때 성별은 필수값입니다.");
        }

        if (isPay === null) {
          return message.error("결제 여부를 선택해주세요.");
        }

        let partLecture = yesData ? JSON.parse(yesData) : null;
        let lectureList = noData ? JSON.parse(noData) : null; // 아니오 했을 시 선택된 강의 정보

        // if (lectureList) {
        //   if (moment() < moment(lectureList.startDate)) {
        //     return message.error(
        //       "수업 참여일이 수업 시작 날짜보다 과거일 수 없습니다."
        //     );
        //   }
        // } else if (partLecture) {
        //   if (moment() < moment(partLecture.startDate.slice(0, 10))) {
        //     return message.error(
        //       "수업 참여일이 수업 시작 날짜보다 과거일 수 없습니다."
        //     );
        //   }
        // }

        // paymentCreate
        // 강의목록 리셋
        // 아니오일때 type : "-" , email, name, UserId (userPkId) , lectureId

        dispatch({
          type: USER_STU_CREATE_REQUEST,
          data: {
            userId: data.email,
            password: data.password,
            username: data.username,
            mobile: data.mobile,
            email: data.email,
            address: data.address,
            // detailAddress: data.detailAddress,
            stuLanguage: data.stuLanguage,
            birth: data.birth,
            stuCountry: data.stuCountry,
            stuLiveCon: data.stuLiveCon,
            stuPayCount: data.stuPayCount,
            sns: data.sns,
            snsId: data.snsId,
            // stuJob: data.job,
            gender: data.gender,
            LectureId: lectureList ? lectureList.id : partLecture.LetureId,
            date: lectureList
              ? parseInt(numberInput.value) * 7
              : parseInt(partLecture.week) * 7,
            endDate: lectureList
              ? moment()
                  .add(parseInt(numberInput.value * 7 - 1), "days")
                  .format("YYYY-MM-DD")
              : moment()
                  .add(parseInt(partLecture.week * 7 - 1), "days")
                  .format("YYYY-MM-DD"),
            PaymentId: lectureList ? null : partLecture.id,
          },
        });
      }

      if (isType === "수정") {
        dispatch({
          type: APP_UPDATE_REQUEST,
          data: {
            id: userData && userData.id,
            timeDiff: data.timeDiff,
            wantStartDate: moment(data.wantStartDate).format("YYYY-MM-DD"),
            teacher: data.teacher,
            freeTeacher: data.freeTeacher,
            isDiscount: false,
            meetDate: moment(data.meetDate).format("YYYY-MM-DD"),
            meetDate2: data.meetDate2,

            level: data.level,
            job: data.job,
            purpose: data.purpose,
            status: data.status,
          },
        });
      }
    },
    [isPay, numberInput, yesData, noData, isType]
  );

  // 전체검색 기능
  const onClickAllList = useCallback(() => {
    dispatch({
      type: APP_LIST_REQUEST,
      data: {
        isComplete: "",
        isTime: false,
        time: false,
        status: "",
      },
    });
    setTime(null);
    setCurrentTab(3);
    setStatusType("");
    setUserData(null);
    setCurrentId(null);
  }, []);

  // 줌 미팅 시간 기능
  const onChangeDate = useCallback((data) => {
    if (data) {
      setTime(moment(data));
    } else {
      setTime(null);
    }
  }, []);
  ////// DATAVIEW //////

  // 등록상태
  const stateList = ["등록", "잠정등록", "NoShow", "연기"];

  // 학생 출석 목록 TABLE
  const columnCommute = [
    {
      title: "수업 이름",
      render: (data) => <div>{data.course}</div>,
    },

    {
      title: "요일",
      render: (data) => <div>{data.LectureDay}</div>,
    },

    {
      title: "시간",
      render: (data) => <div>{data.LectureTime}</div>,
    },

    {
      title: "출석상태",
      render: (data) => <div>{`${data.status}`}</div>,
    },

    {
      title: "출석일",
      render: (data) => <div>{`${data.createdAt.slice(0, 13)}`}</div>,
    },
  ];

  // 학생 결제 목록 TABLE
  const columnsPayList = [
    {
      title: "수업 번호",
      render: (data) => <div>{data.number}</div>,
    },

    {
      title: "이름",
      render: (data) => <div>{data.teacherName}</div>,
    },
    {
      title: "결제한 강의",
      dataIndex: "course",
    },
    {
      title: "결제한 가격",

      render: (data) => {
        return <div>{`$${data.price}`}</div>;
      },
    },
    {
      title: "결제일",
      render: (data) => {
        return <div>{data.createdAt.substring(0, 10)}</div>;
      },
    },
  ];

  // 일주일 이하로 남은 강의 내역 TABLE
  const columns7End = [
    {
      title: "수업 번호",
      render: (data) => <div>{data.number}</div>,
    },

    {
      title: "이름",
      render: (data) => <div>{data.teacherName}</div>,
    },

    {
      title: "수업 이름",
      render: (data) => <div>{data.course}</div>,
    },

    {
      title: "요일",
      render: (data) => <div>{data.day}</div>,
    },

    {
      title: "시간",
      render: (data) => <div>{data.time}</div>,
    },

    {
      title: "수업 남은 날",
      render: (data) => (
        <div style={{ color: Theme.red_C }}>{`${data.limitDate}일`}</div>
      ),
    },
  ];

  // 종료된 강의 내역 TABLE
  const columnsEnd = [
    {
      title: "수업 번호",
      render: (data) => <div>{data.number}</div>,
    },

    {
      title: "이름",
      render: (data) => <div>{data.TeacherName}</div>,
    },

    {
      title: "수업 이름",
      render: (data) => <div>{data.course}</div>,
    },

    {
      title: "요일",
      render: (data) => <div>{data.day}</div>,
    },

    {
      title: "시간",
      render: (data) => <div>{data.time}</div>,
    },

    {
      title: "수업 종료일",
      render: (data) => <div>{data.updatedAt.slice(0, 10)}</div>,
    },
  ];

  // 반 이동 내역 TABLE
  const columnsMove = [
    {
      title: "수업 번호",
      render: (data) => <div>{data.number}</div>,
    },

    {
      title: "이름",
      render: (data) => <div>{data.TeacherName}</div>,
    },

    {
      title: "수업 이름",
      render: (data) => <div>{data.course}</div>,
    },

    {
      title: "요일",
      render: (data) => <div>{data.day}</div>,
    },

    {
      title: "시간",
      render: (data) => <div>{data.time}</div>,
    },

    {
      title: "수업 참여일",
      render: (data) => (
        <div>{moment(data.createdAt).format("YYYY-MM-DD")}</div>
      ),
    },

    {
      title: "수업 변경일",
      render: (data) => <div>{data.updatedAt.slice(0, 10)}</div>,
    },
  ];

  // 참여하고 있는 강의 TABLE
  const columnsList = [
    {
      title: "수업 번호",
      render: (data) => <div>{data.number}</div>,
    },

    {
      title: "이름",
      render: (data) => <div>{data.TeacherName}</div>,
    },

    {
      title: "수업 이름",
      render: (data) => <div>{data.course}</div>,
    },

    {
      title: "요일",
      render: (data) => <div>{data.day}</div>,
    },

    {
      title: "시간",
      render: (data) => <div>{data.time}</div>,
    },

    {
      title: "남은 횟수",
      render: (data) => <div>{data.ingyerCnt}</div>,
    },

    {
      title: "수업 참여일",
      render: (data) => <div>{data.createdAt.slice(0, 10)}</div>,
    },

    {
      title: "수업 종료일",
      render: (data) => <div>{data.endDate}</div>,
    },
    {
      title: "수업 수정",
      children: [
        {
          title: "반옮기기",
          render: (data) => (
            <Button
              type="primary"
              size="small"
              onClick={() => uModalToggle(data)}
            >
              반옮기기
            </Button>
          ),
        },
        {
          title: "수업빼기",
          render: (data) => (
            <Popconfirm
              title="수업을 종료하시겠습니까?"
              okText="종료"
              cancelText="취소"
              onConfirm={() => onEndClassSubmit(data)}
            >
              <Button type="danger" size="small">
                수업빼기
              </Button>
            </Popconfirm>
          ),
        },
      ],
    },
  ];

  // 왼쪽 LIST TABLE
  const leftTable = [
    {
      title: "이름",
      render: (data) => (
        <Wrapper al={`flex-start`} width={`100px`}>
          <Text width={`100%`}>
            {data.firstName}&nbsp;{data.lastName}
          </Text>
        </Wrapper>
      ),
    },
    {
      title: "이메일",
      render: (data) => (
        <Wrapper al={`flex-start`} width={`220px`}>
          <Text width={`100%`}>{data.gmailAddress}</Text>
        </Wrapper>
      ),
    },
    {
      title: "회원가입여부",
      render: (data) => (
        <Wrapper al={`flex-start`} width={`50px`}>
          {data.completedAt ? `완료` : `미완료`}
        </Wrapper>
      ),
    },
  ];

  const country = [
    "S. Korea",
    "USA",
    "Australia",
    "Canada",
    "China",
    "Finland",
    "France",
    "Germany",
    "Ireland",
    "Italy",
    "Japan",
    "Malaysia",
    "Netherland",
    "Poland",
    "S. Africa",
    "Singapore",
    "Spain",
    "Sweden",
    "Switzland",
    "Taiwan",
    "U.K.",

    //
    "Afghanistan",
    "Albania",
    "Algeria",
    "Andorra",
    "Angola",
    "Anguilla",
    "Antigua and Barbuda",
    "Argentina",
    "Armenia",
    "Aruba",
    "Austria",
    "Azerbaijan",
    "Bahamas",
    "Bahrain",
    "Bailiwick of Guernsey",
    "Bailiwick of Jersey",
    "Bangladesh",
    "Barbados",
    "Belarus",
    "Belgium",
    "Belize",
    "Benin",
    "Bermuda",
    "Bhutan",
    "Bolivia",
    "Bosnia-Herzegovina",
    "Botswana",
    "Brazil",
    "British Antarctic Territory",
    "British Indian Ocean Territory",
    "British Virgin Islands",
    "Brunei",
    "Bulgaria",
    "Burkina Faso",
    "Burundi",
    "C.te D'Ivoire",
    "Cambodia",
    "Cameroon",
    "Cape Verde",
    "Cayman Islands",
    "Central African Republic",
    "Chad",
    "Chile",
    "Colombia",
    "Comoros",
    "Congo",
    "Cook Islands",
    "Costa Rica",
    "Croatia",
    "Cuba",
    "Cyprus",
    "Czech",
    "Democratic Republic of Congo",
    "Denmark",
    "Djibouti",
    "Dominica",
    "Dominican Republic",
    "Ecuador",
    "Egypt",
    "El Salvador",
    "Equatorial Guinea",
    "Eritrea",
    "Estonia",
    "Eswatini",
    "Ethiopia",
    "Federated States of Micronesia",
    "Fiji",

    "French Guiana",
    "French Polynesia",
    "Gabon",
    "Gambia",
    "Georgia",
    "Ghana",
    "Gibraltar",
    "Greece",
    "Greenland",
    "Grenada",
    "Guadeloupe",
    "Guam",
    "Guatemala",
    "Guinea",
    "Guinea-Bissau",
    "Guyana",
    "Haiti",
    "Honduras",
    "Hongkong",
    "Hungary",
    "Iceland",
    "India",
    "Indonesia",
    "Iran",
    "Iraq",
    "Isle of Man",
    "Israel",
    "Jamaica",
    "Jordan",
    "Kazakhstan",
    "Kenya",
    "Kiribati",
    "Kosovo",
    "Kuwait",
    "Kyrgyz",
    "Laos",
    "Latvia",
    "Lebanon",
    "Lesotho",
    "Liberia",
    "Libya",
    "Liechtenstein",
    "Lithuania",
    "Luxembourg",
    "Macao",
    "Madagascar",
    "Malawi",
    "Maldives",
    "Mali",
    "Malta",
    "Marshall Islands",
    "Martinique",
    "Mauritania",
    "Mauritius",
    "Mayotte",
    "Mazambique",
    "Mexico",
    "Moldova",
    "Monaco",
    "Mongolia",
    "Montenegro",
    "Montserrat",
    "Morocco",
    "Myanmar",
    "Namibia",
    "Nauru",
    "Nepal",
    "Netherlands Antilles",
    "New Caledonia",
    "New Zealand",
    "Nicaragua",
    "Niger",
    "Nigeria",
    "Niue",
    "North Macedonia",
    "Northern Mariana Islands",
    "Norway",
    "Oman",
    "Pakistan",
    "Palau",
    "Palestine",
    "Panama",
    "Papua New Guinea :PNG",
    "Paraguay",
    "Peru",
    "Philippines",
    "Pitcairn Islands",

    "Portugal",
    "Puerto Rico",
    "Qatar",
    "R.union",
    "Romania",
    "Russia",
    "Rwanda",
    "S.o Tom. & Principe",
    "Sahara Arab Democratic Republic",
    "Samoa",
    "San Marino",
    "Saudi Arabia",
    "Senegal",
    "Serbia",
    "Seychelles",
    "Sierra Leone",
    "Slovakia",
    "Slovenia",
    "Solomon Islands",
    "Somalia",
    "South Sudan",

    "Sri Lanka",
    "St Helena",
    "St. Kitts-Nevis",
    "St. Lucia",
    "St. Pierre and Miquelon",
    "St. Vincent & the Grenadines",
    "Sudan",
    "Suriname",

    "Swiss",
    "Syria",

    "Tajikistan",
    "Tanzania",
    "Thailand",
    "Timor-Leste",
    "Togo",
    "Tonga",
    "Trinidad & Tobago",
    "Tunisia",
    "Turkey",
    "Turkmenistan",
    "Turks and Caicos Islands",
    "Tuvalu",
    "Uganda",
    "Ukraine",
    "United Arab Emirates : UAE",

    "Uruguay",
    "Uzbekistan",
    "Vanuatu",
    "Vatican",
    "Venezuela",
    "Vietnam",
    "Wallis and Futuna",
    "Yemen",
    "Zambia",
    "Zimbabwe",
  ];

  return (
    <AdminLayout>
      <PageHeader
        breadcrumbs={["신청서 관리", "신청서 목록"]}
        title={`신청서 목록`}
        subTitle={`홈페이지의 사용자에게 입력받은 신청서 목록을 관리할 수 있습니다.`}
      />
      {/* <AdminTop createButton={true} createButtonAction={() => {})} /> */}

      <AdminContent>
        {/* ADMIN TOP MENU */}
        <Wrapper
          dr="row"
          ju="flex-start"
          margin="0px 0px 10px 0px"
          borderBottom={`1px dashed ${Theme.lightGrey_C}`}
          padding="5px 0px"
        >
          <Button
            type={currentTab === 3 ? "primary" : `default`}
            size={`small`}
            onClick={() => setCurrentTab(3)}
          >
            전체
          </Button>
          <Button
            type={currentTab === 1 ? "primary" : `default`}
            size={`small`}
            onClick={() => setCurrentTab(1)}
          >
            미완료
          </Button>
          <Button
            type={currentTab === 2 ? "primary" : `default`}
            size={`small`}
            onClick={() => setCurrentTab(2)}
          >
            완료
          </Button>

          <Select
            onChange={(e) => setStatusType(e)}
            style={{ width: `350px` }}
            size={`small`}
            value={statusType ? statusType : null}
            placeholder={"등록상태를 선택해주세요. Ex) NoShow"}
          >
            {stateList &&
              stateList.map((data, idx) => {
                return (
                  <Select.Option key={idx} value={data}>
                    {data}
                  </Select.Option>
                );
              })}
          </Select>

          <DatePicker
            size="small"
            format="YYYY-MM-DD"
            onChange={onChangeDate}
            // value={time}
            style={{ width: `250px` }}
            placeholder="줌 미팅 시간을 선택해주세요."
          ></DatePicker>

          <Button
            type={!router.query.type && `primary`}
            size={`small`}
            onClick={() => onClickAllList()}
          >
            전체검색
          </Button>
        </Wrapper>
        {/* ADMIN TOP MENU END */}

        {/* ADMIN GUIDE AREA */}
        <Wrapper
          margin={`0px 0px 10px 0px`}
          radius="5px"
          bgColor={Theme.lightGrey_C}
          padding="5px"
          fontSize="13px"
          al="flex-start"
        >
          <GuideDiv isImpo={true}>
            리스트의 오른쪽 동그라미를 선택했을 시 오른쪽 박스에 학생 상세정보를
            확인 할 수 있습니다.
          </GuideDiv>
          <GuideDiv isImpo={true}>
            회원 등록하지 않은 리스트는 등록하실때 수업을 꼭 기입해주셔야 등록이
            가능합니다.
          </GuideDiv>
          <GuideDiv isImpo={true}>
            회원 등록 진행 후 회원의 정보를 추가, 수정할 수 있습니다.
          </GuideDiv>
          <GuideDiv isImpo={true}>
            진행여부, 줌 미팅일 날짜로 신청서를 검색할 수 있습니다.
          </GuideDiv>
          <GuideDiv isImpo={true}>
            회원을 등록하면 화면이 새로고침 됩니다.
          </GuideDiv>
        </Wrapper>
        {/* ADMIN GUIDE AREA END*/}

        <Wrapper
          dr={`row`}
          al={`flex-start`}
          wrap={`nowrap`}
          ju={`space-between`}
        >
          <Wrapper width={`38%`} minWidth={`450px`} overflow={`auto`}>
            <Table
              style={{ width: `100%`, cursor: `pointer` }}
              rowKey="id"
              columns={leftTable}
              dataSource={applicationList ? applicationList : []}
              // rowSelection={{
              //   type: `radio`,
              // }}

              rowSelection={{
                type: `radio`,
                ...row,
                selectedRowKeys: currentId,
              }}

              // onRow={(data) => {
              //   return {
              //     onClick: () => {
              //       tableHandler(data);
              //     },
              //   };
              // }}
              // size="small"
            />
          </Wrapper>
          <Form
            form={userForm}
            style={{ width: `62%` }}
            onFinish={isJoin ? updateStuFinish : createFinish}
          >
            <Wrapper
              height={`670px`}
              border={`1px solid ${Theme.lightGrey3_C}`}
            >
              <Wrapper
                height={`55px`}
                borderBottom={`1px solid ${Theme.lightGrey3_C}`}
                dr={`row`}
                padding={`0 10px`}
                ju={`space-between`}
                bgColor={Theme.lightGrey2_C}
              >
                <Text>학생 상세정보</Text>
                <Button type="primary" size="small" htmlType="submit">
                  {isJoin ? "수정하기" : "등록하기"}
                </Button>
              </Wrapper>

              <Wrapper
                height={`calc(100% - 55px)`}
                padding={`10px`}
                overflow={`auto`}
                ju={`flex-start`}
                wrap={`nowrap`}
              >
                {userData === null ? (
                  <Wrapper fontWeight={`700`} fontSize={`20px`} height={`100%`}>
                    학생을 선택해주세요.
                    <Text>이름 오른쪽 동그라미를 클릭해주세요.</Text>
                  </Wrapper>
                ) : (
                  <>
                    {/* 학생 수업 참여 */}
                    <Wrapper dr={`row`} ju={`flex-start`}>
                      <Text
                        fontWeight={`700`}
                        color={Theme.basicTheme_C}
                        margin={`0 0 5px`}
                      >
                        학생 수업 참여
                      </Text>

                      <Wrapper
                        margin={`0px 0px 10px 0px`}
                        radius="5px"
                        bgColor={Theme.lightGrey_C}
                        padding="5px"
                        fontSize="13px"
                        al="flex-start"
                      >
                        <GuideDiv isImpo={true}>
                          학생의 결제여부 및 강의목록, 강의기간을 선택하여
                          수업에 참여시킬 수 있습니다.
                        </GuideDiv>
                        <GuideDiv isImpo={true}>
                          결제여부 및 강의목록, 강의기간은 필수입니다.
                        </GuideDiv>
                      </Wrapper>
                    </Wrapper>

                    <Wrapper al={`flex-start`} margin={`0 0 20px`}>
                      <Text fontWeight={`700`} margin={`0 0 5px`}>
                        학생 이름
                      </Text>
                      <TextInput
                        readOnly={true}
                        value={`${userData && userData.firstName} ${
                          userData && userData.lastName
                        }`}
                        width={`100%`}
                      />

                      <Text fontWeight={`700`} margin={`5px 0`}>
                        결제 여부
                      </Text>
                      <Select
                        defaultValue="네"
                        onChange={paySelectHandler}
                        value={isPay}
                        style={{ width: `100%` }}
                      >
                        <Select.Option value="네">네</Select.Option>
                        <Select.Option value="아니오">아니오</Select.Option>
                      </Select>

                      {isPay === "네" ? (
                        <>
                          <Text fontWeight={`700`} margin={`5px 0`}>
                            강의 목록
                          </Text>

                          <Select
                            style={{ width: `100%` }}
                            height={`32px`}
                            showSearch
                            onChange={(LectureId) =>
                              onSeachHandler(LectureId, paymentList)
                            }
                            value={yesData}
                            filterOption={(input, option) =>
                              option.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            }
                            placeholder="참가시킬 강의를 선택해주세요."
                          >
                            {opt2}
                          </Select>
                        </>
                      ) : (
                        <>
                          <Text fontWeight={`700`} margin={`5px 0`}>
                            강의 목록
                          </Text>
                          <Select
                            showSearch={true}
                            placeholder="강의목록을 선택해주세요."
                            style={{ width: `100%` }}
                            onChange={noLectureHandler}
                            value={noData}
                          >
                            {allLectures && allLectures.length === 0
                              ? ""
                              : allLectures &&
                                allLectures.map((data, idx) => {
                                  return (
                                    <Select.Option
                                      key={data.id}
                                      value={JSON.stringify(data)}
                                    >
                                      {`${data.number} | ${data.course} | ${data.User.username}`}
                                    </Select.Option>
                                  );
                                })}
                          </Select>

                          <Text fontWeight={`700`} margin={`5px 0`}>
                            강의 기간
                          </Text>
                          <Input
                            type="number"
                            placeholder="강의 기간을 입력해주세요."
                            {...numberInput}
                          />
                        </>
                      )}

                      <Wrapper
                        al={`flex-end`}
                        margin={`20px 0 0`}
                        display={isJoin ? `flex` : `none`}
                      >
                        <Button
                          type="primary"
                          size="small"
                          onClick={onUpdateClassSubmit}
                        >
                          수업 참여하기
                        </Button>
                      </Wrapper>
                    </Wrapper>

                    {isJoin && (
                      <>
                        {/* 학생이 참여하고 있는 강의 */}
                        <Wrapper dr={`row`} ju={`flex-start`}>
                          <Text
                            fontWeight={`700`}
                            color={Theme.basicTheme_C}
                            margin={`0 0 5px`}
                          >
                            참여하고 있는 강의
                          </Text>

                          <Wrapper
                            margin={`0px 0px 10px 0px`}
                            radius="5px"
                            bgColor={Theme.lightGrey_C}
                            padding="5px"
                            fontSize="13px"
                            al="flex-start"
                          >
                            <GuideDiv isImpo={true}>
                              학생이 참여하고 있는 강의 목록을 확인 할 수
                              있습니다.
                            </GuideDiv>
                            <GuideDiv isImpo={true}>
                              수업 참여일은 관리자가 학생의 수업을 참여시킨
                              날짜입니다.
                            </GuideDiv>
                            <GuideDiv isImpo={true}></GuideDiv>
                          </Wrapper>
                        </Wrapper>
                        <Table
                          style={{ width: `100%`, margin: `0 0 30px` }}
                          rowKey="id"
                          columns={columnsList}
                          dataSource={partUserCurrentList}
                          size="small"
                        />

                        {/* 학생 결제 목록 */}
                        <Wrapper dr={`row`} ju={`flex-start`}>
                          <Text
                            fontWeight={`700`}
                            color={Theme.basicTheme_C}
                            margin={`0 0 5px`}
                          >
                            학생 결제 목록
                          </Text>

                          <Wrapper
                            margin={`0px 0px 10px 0px`}
                            radius="5px"
                            bgColor={Theme.lightGrey_C}
                            padding="5px"
                            fontSize="13px"
                            al="flex-start"
                          >
                            <GuideDiv isImpo={true}>
                              학생이 결제한 목록을 확인 할 수 있습니다.
                            </GuideDiv>
                          </Wrapper>
                        </Wrapper>
                        <Table
                          style={{ width: `100%`, margin: `0 0 30px` }}
                          rowKey="id"
                          columns={columnsPayList}
                          dataSource={paymentList ? paymentList : []}
                          size="small"
                        />

                        {/* 학생 출석 목록 */}
                        <Wrapper dr={`row`} ju={`flex-start`}>
                          <Wrapper dr={`row`} ju={`space-between`}>
                            <Text
                              fontWeight={`700`}
                              color={Theme.basicTheme_C}
                              margin={`0 0 5px`}
                            >
                              학생 출석 목록
                            </Text>

                            <Wrapper
                              dr={`row`}
                              ju={`flex-start`}
                              margin={`0 0 10px 0`}
                            >
                              <Select
                                style={{ width: 300 }}
                                onChange={(e) => setStuSelect(e)}
                                value={stuSelect}
                                size="small"
                                placeholder="강의를 선택해주세요."
                              >
                                {partUserCurrentList &&
                                partUserCurrentList.length === 0 ? (
                                  <Select>{"참여중인 수업이 없습니다."}</Select>
                                ) : (
                                  partUserCurrentList &&
                                  partUserCurrentList.map((data, idx) => {
                                    return (
                                      <Select.Option
                                        key={data.id}
                                        value={data.LectureId}
                                      >
                                        {data.course}
                                      </Select.Option>
                                    );
                                  })
                                )}
                              </Select>

                              <Button
                                size="small"
                                style={{ marginLeft: 10 }}
                                onClick={() => onClickCommuteHandler()}
                                type="primary"
                              >
                                검색
                              </Button>
                            </Wrapper>
                          </Wrapper>

                          <Wrapper
                            margin={`0px 0px 10px 0px`}
                            radius="5px"
                            bgColor={Theme.lightGrey_C}
                            padding="5px"
                            fontSize="13px"
                            al="flex-start"
                          >
                            <GuideDiv isImpo={true}>
                              학생이 강의 출석한 기록을 확인 할 수 있습니다.
                            </GuideDiv>
                            <GuideDiv isImpo={true}>
                              강의를 선택 후 출석 목록을 확인 할 수 있습니다.
                              무조건적으로 강의를 하나 선택해주세요.
                            </GuideDiv>
                          </Wrapper>
                        </Wrapper>
                        <Table
                          style={{ width: `100%`, margin: `0 0 30px` }}
                          rowKey="id"
                          columns={columnCommute}
                          dataSource={commuteAdminList ? commuteAdminList : []}
                          size="small"
                        />

                        {/* 학생이 수업을 이동한 내역 */}
                        <Wrapper dr={`row`} ju={`flex-start`}>
                          <Text
                            fontWeight={`700`}
                            color={Theme.basicTheme_C}
                            margin={`0 0 5px`}
                          >
                            반 이동 내역
                          </Text>

                          <Wrapper
                            margin={`0px 0px 10px 0px`}
                            radius="5px"
                            bgColor={Theme.lightGrey_C}
                            padding="5px"
                            fontSize="13px"
                            al="flex-start"
                          >
                            <GuideDiv isImpo={true}>
                              학생이 수업을 이동한 내역을 확인 할 수 있습니다.
                            </GuideDiv>
                          </Wrapper>
                        </Wrapper>
                        <Table
                          style={{ width: `100%`, margin: `0 0 30px` }}
                          rowKey="id"
                          columns={columnsMove}
                          dataSource={
                            st_participantUserMoveListDone
                              ? partUserMoveList
                              : []
                          }
                          size="small"
                        />

                        {/* 종료된 강의 내역 */}
                        <Wrapper dr={`row`} ju={`flex-start`}>
                          <Text
                            fontWeight={`700`}
                            color={Theme.basicTheme_C}
                            margin={`0 0 5px`}
                          >
                            종료된 강의 내역
                          </Text>

                          <Wrapper
                            margin={`0px 0px 10px 0px`}
                            radius="5px"
                            bgColor={Theme.lightGrey_C}
                            padding="5px"
                            fontSize="13px"
                            al="flex-start"
                          >
                            <GuideDiv isImpo={true}>
                              학생의 수업이 종료된 강의를 확인 할 수 있습니다.
                            </GuideDiv>
                          </Wrapper>
                        </Wrapper>
                        <Table
                          style={{ width: `100%`, margin: `0 0 30px` }}
                          rowKey="id"
                          columns={columnsEnd}
                          dataSource={
                            st_participantUserDeleteListDone
                              ? partUserDeleteList
                              : []
                          }
                          size="small"
                        />

                        {/* 일주일 이하로 남은 강의 내역 */}
                        {/* <Wrapper dr={`row`} ju={`flex-start`}>
                          <Text
                            fontWeight={`700`}
                            color={Theme.basicTheme_C}
                            margin={`0 0 5px`}
                          >
                            일주일 이하로 남은 강의 내역
                          </Text>

                          <Wrapper
                            margin={`0px 0px 10px 0px`}
                            radius="5px"
                            bgColor={Theme.lightGrey_C}
                            padding="5px"
                            fontSize="13px"
                            al="flex-start"
                          >
                            <GuideDiv isImpo={true}>
                              학생의 수업이 일주일 이하로 남은 강의 내역을 확인
                              할 수 있습니다.
                            </GuideDiv>
                          </Wrapper>
                        </Wrapper>
                        <Table
                          style={{ width: `100%`, margin: `0 0 30px` }}
                          rowKey="id"
                          columns={columns7End}
                          dataSource={
                            st_participantUserLimitListDone
                              ? partUserLimitList
                              : []
                          }
                          size="small"
                        />*/}
                      </>
                    )}

                    {/* 학생 상세정보 */}
                    <Wrapper dr={`row`} ju={`flex-start`}>
                      <Wrapper
                        dr={`row`}
                        ju={`space-between`}
                        margin={`0 0 5px`}
                      >
                        <Text fontWeight={`700`} color={Theme.basicTheme_C}>
                          학생 상세정보
                        </Text>

                        {!isJoin && (
                          <Wrapper dr={`row`} width={`auto`}>
                            <Button
                              size="small"
                              type={isType === "등록" ? `primary` : `default`}
                              onClick={() => typeHandler("등록")}
                            >
                              등록
                            </Button>
                            <Button
                              size="small"
                              type={isType !== "등록" ? `primary` : `default`}
                              onClick={() => typeHandler("수정")}
                            >
                              수정
                            </Button>
                          </Wrapper>
                        )}
                      </Wrapper>

                      <Wrapper
                        margin={`0px 0px 10px 0px`}
                        radius="5px"
                        bgColor={Theme.lightGrey_C}
                        padding="5px"
                        fontSize="13px"
                        al="flex-start"
                      >
                        <GuideDiv isImpo={true}>
                          이메일 변경은 개발사에 문의해주세요.
                        </GuideDiv>
                        <GuideDiv isImpo={true}>
                          학생의 상세정보를 확인 할 수 있습니다.
                        </GuideDiv>
                        <GuideDiv isImpo={true}>
                          학생의 정보를 수정할 때 아래의 수정하기 버튼을 눌러
                          수정 할 수 있습니다.
                        </GuideDiv>
                        <GuideDiv isImpo={true}>
                          학생이 회원가입 하기 전에도 사용할 수 있으며, 각
                          정보를 메모처럼 사용할 수 있습니다.
                        </GuideDiv>
                        <GuideDiv isImpo={true}>
                          등록하기전 수정을 원하시면 오른쪽 수정 버튼을
                          클릭해주시기 바랍니다.
                        </GuideDiv>
                        <GuideDiv isImpo={true}>
                          등록/수정 후 홈페이지가 새로고침 됩니다.
                        </GuideDiv>
                        <GuideDiv isImpo={true}>
                          성별은 필수 값 입니다.
                        </GuideDiv>
                      </Wrapper>
                    </Wrapper>

                    {isJoin && (
                      <Wrapper
                        padding={`5px 0 3px`}
                        dr={`row`}
                        borderBottom={`1px dashed ${Theme.lightGrey3_C}`}
                      >
                        <Wrapper
                          width={`25%`}
                          bgColor={Theme.lightGrey3_C}
                          padding={`3px`}
                          height={`100px`}
                        >
                          프로필 이미지
                        </Wrapper>
                        <Wrapper
                          width={`75%`}
                          al={`flex-start`}
                          padding={`0 10px`}
                        >
                          <Image
                            width={`100px`}
                            height={`100px`}
                            src={
                              applicationDetail &&
                              applicationDetail[0].profileImage
                                ? `${
                                    applicationDetail[0] &&
                                    applicationDetail[0].profileImage
                                  }`
                                : `https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/common/img_default-profile.png`
                            }
                          />
                        </Wrapper>
                      </Wrapper>
                    )}

                    {console.log(applicationDetail)}

                    <Wrapper
                      padding={`5px 0`}
                      dr={`row`}
                      borderBottom={`1px dashed ${Theme.lightGrey3_C}`}
                    >
                      <Wrapper
                        width={`25%`}
                        bgColor={Theme.lightGrey3_C}
                        padding={`3px`}
                      >
                        신청일
                      </Wrapper>
                      <Wrapper
                        width={`75%`}
                        al={`flex-start`}
                        padding={`0 10px`}
                      >
                        <Input
                          disabled={true}
                          value={
                            userData && userData.createdAt
                              ? userData && userData.createdAt.slice(0, 10)
                              : ""
                          }
                        />
                      </Wrapper>
                    </Wrapper>

                    {isJoin && (
                      <Wrapper
                        padding={`5px 0`}
                        dr={`row`}
                        borderBottom={`1px dashed ${Theme.lightGrey3_C}`}
                      >
                        <Wrapper
                          width={`25%`}
                          bgColor={Theme.lightGrey3_C}
                          padding={`3px`}
                        >
                          회원가입일
                        </Wrapper>
                        <Wrapper
                          width={`75%`}
                          al={`flex-start`}
                          padding={`0 10px`}
                        >
                          <Input
                            disabled={true}
                            value={
                              userData && userData.completedAt
                                ? userData.completedAt.slice(0, 10)
                                : ""
                            }
                          />
                        </Wrapper>
                      </Wrapper>
                    )}

                    <>
                      <Wrapper
                        padding={`5px 0`}
                        dr={`row`}
                        borderBottom={`1px dashed ${Theme.lightGrey3_C}`}
                      >
                        <Wrapper
                          width={`25%`}
                          bgColor={Theme.lightGrey3_C}
                          padding={`3px`}
                        >
                          이름
                        </Wrapper>
                        <Wrapper
                          width={`75%`}
                          al={`flex-start`}
                          padding={`0 10px`}
                        >
                          <FormItem name="username">
                            <Input
                              placeholder="이름을 입력해주세요."
                              disabled={
                                isType === "등록" || isType === null
                                  ? false
                                  : true
                              }
                            />
                          </FormItem>
                        </Wrapper>
                      </Wrapper>

                      <Wrapper
                        padding={`5px 0`}
                        dr={`row`}
                        borderBottom={`1px dashed ${Theme.lightGrey3_C}`}
                      >
                        <Wrapper
                          width={`25%`}
                          bgColor={Theme.lightGrey3_C}
                          padding={`3px`}
                        >
                          이메일
                        </Wrapper>
                        <Wrapper
                          width={`75%`}
                          al={`flex-start`}
                          padding={`0 10px`}
                        >
                          <FormItem name="email">
                            <Input
                              placeholder="이메일을 입력해주세요."
                              disabled={true}
                            />
                          </FormItem>
                        </Wrapper>
                      </Wrapper>

                      <Wrapper
                        padding={`5px 0`}
                        dr={`row`}
                        borderBottom={`1px dashed ${Theme.lightGrey3_C}`}
                      >
                        <Wrapper
                          width={`25%`}
                          bgColor={Theme.lightGrey3_C}
                          padding={`3px`}
                        >
                          아이디
                        </Wrapper>
                        <Wrapper
                          width={`75%`}
                          al={`flex-start`}
                          padding={`0 10px`}
                        >
                          <FormItem name="email">
                            <Input
                              disabled={true}
                              placeholder="아이디를 입력해주세요."
                            />
                          </FormItem>
                        </Wrapper>
                      </Wrapper>

                      <Wrapper
                        padding={`5px 0`}
                        dr={`row`}
                        borderBottom={`1px dashed ${Theme.lightGrey3_C}`}
                      >
                        <Wrapper
                          width={`25%`}
                          bgColor={Theme.lightGrey3_C}
                          padding={`3px`}
                        >
                          주소
                        </Wrapper>
                        <Wrapper
                          width={`75%`}
                          al={`flex-start`}
                          padding={`0 10px`}
                        >
                          <FormItem name="address">
                            <Input
                              placeholder="주소를 입력해주세요."
                              disabled={
                                isType === "등록" || isType === null
                                  ? false
                                  : true
                              }
                            />
                          </FormItem>
                        </Wrapper>
                      </Wrapper>

                      {/* <Wrapper
                          padding={`5px 0`}
                          dr={`row`}
                          borderBottom={`1px dashed ${Theme.lightGrey3_C}`}
                        >
                          <Wrapper
                            width={`25%`}
                            bgColor={Theme.lightGrey3_C}
                            padding={`3px`}
                          >
                            상세주소
                          </Wrapper>
                          <Wrapper
                            width={`75%`}
                            al={`flex-start`}
                            padding={`0 10px`}
                          >
                            <FormItem name="detailAddress">
                              <Input placeholder="상세주소를 입력해주세요." />
                            </FormItem>
                          </Wrapper>
                        </Wrapper> */}

                      <Wrapper
                        padding={`5px 0`}
                        dr={`row`}
                        borderBottom={`1px dashed ${Theme.lightGrey3_C}`}
                      >
                        <Wrapper
                          width={`25%`}
                          bgColor={Theme.lightGrey3_C}
                          padding={`3px`}
                        >
                          휴대폰 번호
                        </Wrapper>
                        <Wrapper
                          width={`75%`}
                          al={`flex-start`}
                          padding={`0 10px`}
                        >
                          <FormItem name="mobile">
                            <Input
                              disabled={
                                isType === "등록" || isType === null
                                  ? false
                                  : true
                              }
                              placeholder="전화번호를 입력해주세요."
                              onChange={(e) =>
                                userForm.setFieldsValue({
                                  password: e.target.value.slice(-4),
                                })
                              }
                            />
                          </FormItem>
                        </Wrapper>
                      </Wrapper>

                      <Wrapper
                        padding={`5px 0`}
                        dr={`row`}
                        borderBottom={`1px dashed ${Theme.lightGrey3_C}`}
                      >
                        <Wrapper
                          width={`25%`}
                          bgColor={Theme.lightGrey3_C}
                          padding={`3px`}
                        >
                          비밀번호
                        </Wrapper>
                        <Wrapper
                          width={`75%`}
                          al={`flex-start`}
                          padding={`0 10px`}
                        >
                          <FormItem name="password">
                            <Input
                              disabled={true}
                              placeholder="비밀번호를 입력해주세요."
                            />
                          </FormItem>
                        </Wrapper>
                      </Wrapper>

                      <Wrapper
                        padding={`5px 0`}
                        dr={`row`}
                        borderBottom={`1px dashed ${Theme.lightGrey3_C}`}
                      >
                        <Wrapper
                          width={`25%`}
                          bgColor={Theme.lightGrey3_C}
                          padding={`3px`}
                        >
                          생년월일
                        </Wrapper>
                        <Wrapper
                          width={`75%`}
                          ju={`space-between`}
                          padding={`0 10px`}
                          dr={`row`}
                        >
                          <FormItem
                            name="birth"
                            width={
                              isType === "등록" || isType === null
                                ? `calc(100% - 30px)`
                                : `100%`
                            }
                          >
                            <Input
                              disabled={true}
                              placeholder="생년월일을 입력해주세요."
                            />
                          </FormItem>

                          <Wrapper
                            width={`auto`}
                            display={
                              isType === "등록" || isType === null
                                ? `flex`
                                : `none`
                            }
                          >
                            <CalendarOutlined onClick={isBirthToggle} />
                          </Wrapper>
                        </Wrapper>

                        {isBirth && (
                          <Wrapper
                            // display={isCalendar ? "flex" : "none"}
                            width={`auto`}
                            shadow={`0px 0px 10px ${Theme.lightGrey3_C}`}
                            border={`1px solid ${Theme.lightGrey3_C}`}
                            padding={`5px 0`}
                            margin={`5px 0 0`}
                          >
                            <Calendar
                              // style={{ width: width < 1350 ? `100%` : `100%` }}
                              fullscreen={false}
                              validRange={[moment(`1940`), moment()]}
                              onChange={dateChagneHandler}
                            />
                          </Wrapper>
                        )}
                      </Wrapper>

                      <Wrapper
                        padding={`5px 0`}
                        dr={`row`}
                        borderBottom={`1px dashed ${Theme.lightGrey3_C}`}
                      >
                        <Wrapper
                          width={`25%`}
                          bgColor={Theme.lightGrey3_C}
                          padding={`3px`}
                        >
                          <Text>
                            성별
                            {!isJoin && (
                              <SpanText color={Theme.red_C}>*</SpanText>
                            )}
                          </Text>
                        </Wrapper>
                        <Wrapper
                          width={`75%`}
                          al={`flex-start`}
                          padding={`0 10px`}
                        >
                          <FormItem name="gender">
                            <Select
                              placeholder="성별을 선택해주세요."
                              disabled={
                                isType === "등록" || isType === null
                                  ? false
                                  : true
                              }
                            >
                              <Select.Option value="여">여</Select.Option>
                              <Select.Option value="남">남</Select.Option>
                              <Select.Option value="상관없음">
                                상관없음
                              </Select.Option>
                            </Select>
                          </FormItem>
                        </Wrapper>
                      </Wrapper>

                      <Wrapper
                        padding={`5px 0`}
                        dr={`row`}
                        borderBottom={`1px dashed ${Theme.lightGrey3_C}`}
                      >
                        <Wrapper
                          width={`25%`}
                          bgColor={Theme.lightGrey3_C}
                          padding={`3px`}
                        >
                          국가
                        </Wrapper>
                        <Wrapper
                          width={`75%`}
                          al={`flex-start`}
                          padding={`0 10px`}
                        >
                          <FormItem name="stuCountry">
                            <Select
                              placeholder="국가를 입력해주세요."
                              disabled={
                                isType === "등록" || isType === null
                                  ? false
                                  : true
                              }
                            >
                              {country &&
                                country.map((data, idx) => {
                                  return (
                                    <Select.Option key={idx} value={data}>
                                      {data}
                                    </Select.Option>
                                  );
                                })}
                            </Select>
                          </FormItem>
                        </Wrapper>
                      </Wrapper>

                      <Wrapper
                        padding={`5px 0`}
                        dr={`row`}
                        borderBottom={`1px dashed ${Theme.lightGrey3_C}`}
                      >
                        <Wrapper
                          width={`25%`}
                          bgColor={Theme.lightGrey3_C}
                          padding={`3px`}
                        >
                          거주 국가
                        </Wrapper>
                        <Wrapper
                          width={`75%`}
                          al={`flex-start`}
                          padding={`0 10px`}
                        >
                          <FormItem name="stuLiveCon">
                            <Select
                              placeholder="거주국가를 입력해주세요."
                              disabled={
                                isType === "등록" || isType === null
                                  ? false
                                  : true
                              }
                            >
                              {country &&
                                country.map((data, idx) => {
                                  return (
                                    <Select.Option key={idx} value={data}>
                                      {data}
                                    </Select.Option>
                                  );
                                })}
                            </Select>
                          </FormItem>
                        </Wrapper>
                      </Wrapper>

                      <Wrapper
                        padding={`5px 0`}
                        dr={`row`}
                        borderBottom={`1px dashed ${Theme.lightGrey3_C}`}
                      >
                        <Wrapper
                          width={`25%`}
                          bgColor={Theme.lightGrey3_C}
                          padding={`3px`}
                        >
                          사용언어
                        </Wrapper>
                        <Wrapper
                          width={`75%`}
                          al={`flex-start`}
                          padding={`0 10px`}
                        >
                          <FormItem name="stuLanguage">
                            <Input
                              placeholder="사용언어를 입력해주세요."
                              disabled={
                                isType === "등록" || isType === null
                                  ? false
                                  : true
                              }
                            />
                          </FormItem>
                        </Wrapper>
                      </Wrapper>

                      <Wrapper
                        padding={`5px 0`}
                        dr={`row`}
                        borderBottom={`1px dashed ${Theme.lightGrey3_C}`}
                      >
                        <Wrapper
                          width={`25%`}
                          bgColor={Theme.lightGrey3_C}
                          padding={`3px`}
                        >
                          SNS
                        </Wrapper>
                        <Wrapper
                          width={`75%`}
                          al={`flex-start`}
                          padding={`0 10px`}
                        >
                          <FormItem name="sns">
                            <Input
                              placeholder="SNS를 입력해주세요."
                              disabled={
                                isType === "등록" || isType === null
                                  ? false
                                  : true
                              }
                            />
                          </FormItem>
                        </Wrapper>
                      </Wrapper>

                      <Wrapper
                        padding={`5px 0`}
                        dr={`row`}
                        borderBottom={`1px dashed ${Theme.lightGrey3_C}`}
                      >
                        <Wrapper
                          width={`25%`}
                          bgColor={Theme.lightGrey3_C}
                          padding={`3px`}
                        >
                          SNS Id
                        </Wrapper>
                        <Wrapper
                          width={`75%`}
                          al={`flex-start`}
                          padding={`0 10px`}
                        >
                          <FormItem name="snsId">
                            <Input
                              placeholder="SNS ID를 입력해주세요."
                              disabled={
                                isType === "등록" || isType === null
                                  ? false
                                  : true
                              }
                            />
                          </FormItem>
                        </Wrapper>
                      </Wrapper>
                    </>

                    {isType === null && (
                      <Wrapper
                        padding={`5px 0`}
                        dr={`row`}
                        borderBottom={`1px dashed ${Theme.lightGrey3_C}`}
                      >
                        <Wrapper
                          width={`25%`}
                          bgColor={Theme.lightGrey3_C}
                          padding={`3px`}
                        >
                          회차
                        </Wrapper>
                        <Wrapper
                          width={`75%`}
                          al={`flex-start`}
                          padding={`0 10px`}
                        >
                          <FormItem name="stuPayCount">
                            <Input
                              placeholder="회차를 입력해주세요."
                              type="number"
                            />
                          </FormItem>
                        </Wrapper>
                      </Wrapper>
                    )}

                    {(isType === "수정" || isType === null) && (
                      <>
                        <Wrapper
                          padding={`5px 0`}
                          dr={`row`}
                          borderBottom={`1px dashed ${Theme.lightGrey3_C}`}
                        >
                          <Wrapper
                            width={`25%`}
                            bgColor={Theme.lightGrey3_C}
                            padding={`3px`}
                          >
                            등록상태
                          </Wrapper>
                          <Wrapper
                            width={`75%`}
                            al={`flex-start`}
                            padding={`0 10px`}
                          >
                            <FormItem name="status">
                              <Select placeholder="등록상태를 선택해주세요.">
                                {stateList.map((data) => {
                                  return (
                                    <Select.Option value={data}>
                                      {data}
                                    </Select.Option>
                                  );
                                })}
                              </Select>
                            </FormItem>
                          </Wrapper>
                        </Wrapper>

                        <Wrapper
                          padding={`5px 0`}
                          dr={`row`}
                          borderBottom={`1px dashed ${Theme.lightGrey3_C}`}
                        >
                          <Wrapper
                            width={`25%`}
                            bgColor={Theme.lightGrey3_C}
                            padding={`3px`}
                          >
                            시차
                          </Wrapper>
                          <Wrapper
                            width={`75%`}
                            al={`flex-start`}
                            padding={`0 10px`}
                          >
                            <FormItem name="timeDiff">
                              <Input placeholder="시차를 입력해주세요." />
                            </FormItem>
                          </Wrapper>
                        </Wrapper>

                        <Wrapper
                          padding={`5px 0`}
                          dr={`row`}
                          borderBottom={`1px dashed ${Theme.lightGrey3_C}`}
                        >
                          <Wrapper
                            width={`25%`}
                            bgColor={Theme.lightGrey3_C}
                            padding={`3px`}
                          >
                            원하는 시작 날짜
                          </Wrapper>
                          <Wrapper
                            width={`75%`}
                            al={`flex-start`}
                            padding={`0 10px`}
                          >
                            <FormItem name="wantStartDate">
                              <CustomDatePicker
                                style={{ width: `100%` }}
                                placeholder="원하시는 시작 날짜를 선택해주세요."
                              />
                            </FormItem>
                          </Wrapper>
                        </Wrapper>

                        <Wrapper
                          padding={`5px 0`}
                          dr={`row`}
                          borderBottom={`1px dashed ${Theme.lightGrey3_C}`}
                        >
                          <Wrapper
                            width={`25%`}
                            bgColor={Theme.lightGrey3_C}
                            padding={`3px`}
                          >
                            무료수업 담당 강사
                          </Wrapper>
                          <Wrapper
                            width={`75%`}
                            al={`flex-start`}
                            padding={`0 10px`}
                          >
                            <FormItem name="freeTeacher">
                              <Select
                                placeholder={`무료수업 담당 강사를 선택해주세요.`}
                              >
                                {teachers &&
                                  teachers.map((data, idx) => {
                                    return (
                                      <Select.Option
                                        key={data.id}
                                        value={data.username}
                                      >
                                        {data.username}
                                      </Select.Option>
                                    );
                                  })}
                              </Select>
                            </FormItem>
                          </Wrapper>
                        </Wrapper>

                        <Wrapper
                          padding={`5px 0`}
                          dr={`row`}
                          borderBottom={`1px dashed ${Theme.lightGrey3_C}`}
                        >
                          <Wrapper
                            width={`25%`}
                            bgColor={Theme.lightGrey3_C}
                            padding={`3px`}
                          >
                            담당 강사
                          </Wrapper>
                          <Wrapper
                            width={`75%`}
                            al={`flex-start`}
                            padding={`0 10px`}
                          >
                            <FormItem name="teacher">
                              <Select
                                placeholder={`담당 강사를 선택해주세요.`}
                                filterOption={(input, option) =>
                                  option.children
                                    .toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                                }
                                showSearch
                              >
                                {allLectures &&
                                  allLectures.map((data, idx) => {
                                    return (
                                      <Select.Option
                                        key={`${data.User.username} ${data.course}`}
                                        value={data.username}
                                      >
                                        {`(${data.number}) ${data.User.username} ${data.course}`}
                                      </Select.Option>
                                    );
                                  })}
                              </Select>
                            </FormItem>
                          </Wrapper>
                        </Wrapper>

                        <Wrapper
                          padding={`5px 0`}
                          dr={`row`}
                          borderBottom={`1px dashed ${Theme.lightGrey3_C}`}
                        >
                          <Wrapper
                            width={`25%`}
                            bgColor={Theme.lightGrey3_C}
                            padding={`3px`}
                          >
                            줌 미팅 날짜
                          </Wrapper>
                          <Wrapper
                            width={`75%`}
                            al={`flex-start`}
                            padding={`0 10px`}
                          >
                            <FormItem name="meetDate">
                              <CustomDatePicker
                                style={{ width: `100%` }}
                                // showTime={{ format: "HH:mm", minuteStep: 10 }}
                                format="YYYY-MM-DD"
                                placeholder="줌 미팅 날짜를 선택해주세요."
                              />
                            </FormItem>
                          </Wrapper>
                        </Wrapper>

                        <Wrapper
                          padding={`5px 0`}
                          dr={`row`}
                          borderBottom={`1px dashed ${Theme.lightGrey3_C}`}
                        >
                          <Wrapper
                            width={`25%`}
                            bgColor={Theme.lightGrey3_C}
                            padding={`3px`}
                          >
                            줌 미팅 시간
                          </Wrapper>
                          <Wrapper
                            width={`75%`}
                            al={`flex-start`}
                            padding={`0 10px`}
                          >
                            <FormItem name="meetDate2">
                              <Input
                                placeholder={`줌 미팅 시간을 입력해주세요.`}
                              />
                            </FormItem>
                          </Wrapper>
                        </Wrapper>

                        <Wrapper
                          padding={`5px 0`}
                          dr={`row`}
                          borderBottom={`1px dashed ${Theme.lightGrey3_C}`}
                        >
                          <Wrapper
                            width={`25%`}
                            bgColor={Theme.lightGrey3_C}
                            padding={`3px`}
                          >
                            레벨
                          </Wrapper>
                          <Wrapper
                            width={`75%`}
                            al={`flex-start`}
                            padding={`0 10px`}
                          >
                            <FormItem name="level">
                              <Input
                                type="number"
                                placeholder={`레벨을 입력해주세요.`}
                              />
                            </FormItem>
                          </Wrapper>
                        </Wrapper>

                        <Wrapper
                          padding={`5px 0`}
                          dr={`row`}
                          borderBottom={`1px dashed ${Theme.lightGrey3_C}`}
                        >
                          <Wrapper
                            width={`25%`}
                            bgColor={Theme.lightGrey3_C}
                            padding={`3px`}
                          >
                            직업
                          </Wrapper>
                          <Wrapper
                            width={`75%`}
                            al={`flex-start`}
                            padding={`0 10px`}
                          >
                            <FormItem name="job">
                              <Input
                                type="job"
                                placeholder={`직업을 입력해주세요.`}
                              />
                            </FormItem>
                          </Wrapper>
                        </Wrapper>

                        <Wrapper
                          padding={`5px 0`}
                          dr={`row`}
                          borderBottom={`1px dashed ${Theme.lightGrey3_C}`}
                        >
                          <Wrapper bgColor={Theme.lightGrey3_C} padding={`3px`}>
                            COMMENT
                          </Wrapper>
                          <Wrapper al={`flex-start`}>
                            <FormItem name="comment">
                              <CustomTextArea
                                readOnly
                                style={{ width: `100%` }}
                                rows={6}
                                border={`1px solid ${Theme.grey_C} !important`}
                              />
                            </FormItem>
                          </Wrapper>
                        </Wrapper>

                        <Wrapper
                          padding={`5px 0`}
                          dr={`row`}
                          borderBottom={`1px dashed ${Theme.lightGrey3_C}`}
                        >
                          <Wrapper bgColor={Theme.lightGrey3_C} padding={`3px`}>
                            메모
                          </Wrapper>
                          <Wrapper al={`flex-start`}>
                            <FormItem name="purpose">
                              <CustomTextArea
                                placeholder={`메모를 입력해주세요.`}
                                style={{ width: `100%` }}
                                rows={6}
                                border={`1px solid ${Theme.grey_C} !important`}
                              />
                            </FormItem>
                          </Wrapper>
                        </Wrapper>

                        <Wrapper
                          padding={`5px 0`}
                          dr={`row`}
                          borderBottom={`1px dashed ${Theme.lightGrey3_C}`}
                        >
                          <Wrapper bgColor={Theme.lightGrey3_C} padding={`3px`}>
                            가능한 수업시간
                          </Wrapper>
                          <Wrapper al={`flex-start`}>
                            <FormItem name="classHour">
                              <CustomTextArea
                                rows={4}
                                placeholder={`가능한 수업시간을 입력해주세요.`}
                              />
                            </FormItem>
                          </Wrapper>
                        </Wrapper>
                      </>
                    )}
                  </>
                )}
              </Wrapper>
            </Wrapper>
          </Form>
        </Wrapper>
      </AdminContent>

      <Modal
        title="학생 수업 수정"
        onCancel={uModalToggle}
        footer={null}
        visible={uModal}
      >
        <Form form={stuUForm} onFinish={stuUpdateHandler}>
          <Wrapper al={`flex-start`}>
            <Text fontWeight={`700`} margin={`0 0 5px`}>
              학생이름
            </Text>
            <TextInput
              value={applicationDetail && applicationDetail[0].username}
              readOnly={true}
              width={`100%`}
            />

            <Text fontWeight={`700`} margin={`5px 0`}>
              현재 강의
            </Text>
            <TextInput
              value={`${uData && uData.number} | ${uData && uData.course}`}
              readOnly={true}
              width={`100%`}
            />

            <Text fontWeight={`700`} margin={`5px 0`}>
              바꿀 강의
            </Text>
            <Form.Item name="changelecture" style={{ width: `100%` }}>
              <Select
                placeholder="수정할 강의를 선택해주세요."
                showSearch={true}
              >
                {allLectures && allLectures.length === 0
                  ? ""
                  : allLectures &&
                    allLectures.map((data, idx) => {
                      return (
                        <Select.Option key={data.id} value={data.id}>
                          {`${data.number} | ${data.course} | ${data.User.username}`}
                        </Select.Option>
                      );
                    })}
              </Select>
            </Form.Item>
          </Wrapper>

          <Wrapper al={`flex-end`} margin={`10px 0 0`}>
            <Button size="small" type="primary" htmlType="submit">
              수정하기
            </Button>
          </Wrapper>
        </Form>
      </Modal>
    </AdminLayout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  async (context) => {
    // SSR Cookie Settings For Data Load/////////////////////////////////////
    const cookie = context.req ? context.req.headers.cookie : "";
    axios.defaults.headers.Cookie = "";
    if (context.req && cookie) {
      axios.defaults.headers.Cookie = cookie;
    }
    ////////////////////////////////////////////////////////////////////////
    // 구현부

    context.store.dispatch({
      type: LOAD_MY_INFO_REQUEST,
    });

    context.store.dispatch({
      type: USER_TEACHER_LIST_REQUEST,
    });

    // 구현부 종료
    context.store.dispatch(END);
    console.log("🍀 SERVER SIDE PROPS END");
    await context.store.sagaTask.toPromise();
  }
);

export default List;
