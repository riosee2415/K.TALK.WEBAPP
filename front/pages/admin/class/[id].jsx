import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import router, { useRouter } from "next/router";

import axios from "axios";
import { END } from "redux-saga";

import AdminLayout from "../../../components/AdminLayout";
import PageHeader from "../../../components/admin/PageHeader";

import { Button, Form, Modal, Slider, Table } from "antd";
import styled from "styled-components";
import {
  Text,
  Wrapper,
  Image,
  SpanText,
  CommonButton,
  TextInput,
  TextArea,
} from "../../../components/commonComponents";
import Theme from "../../../components/Theme";

import wrapper from "../../../store/configureStore";
import { LOAD_MY_INFO_REQUEST } from "../../../reducers/user";
import {
  LECTURE_DETAIL_REQUEST,
  LECTURE_DIARY_LIST_REQUEST,
  LECTURE_MEMO_STU_LIST_REQUEST,
  LECTURE_STUDENT_LIST_REQUEST,
} from "../../../reducers/lecture";
import moment from "moment";

const AdminContent = styled.div`
  padding: 20px;
`;

const CustomSlide = styled(Slider)`
  width: 488px;
  margin: 0 0 8px;
  & .ant-slider-track,
  & .ant-slider-rail {
    height: 12px;
    border-radius: 10px;
  }

  & .ant-slider-track {
    background-color: ${Theme.basicTheme_C} !important;
  }

  & .ant-slider-handle {
    display: none;
  }
`;

const DetailClass = () => {
  // LOAD CURRENT INFO AREA /////////////////////////////////////////////
  const { me, st_loadMyInfoDone } = useSelector((state) => state.user);

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

  const {
    lectureDetail,
    lectureDiaryList,
    lectureDiaryLastPage,
    lectureMemoStuLastPage,
    lectureMemoStuList,
  } = useSelector((state) => state.lecture);
  const dispatch = useDispatch();

  const [currentPage, setCurrentPage] = useState(1);
  const [currentPage2, setCurrentPage2] = useState(1);
  const [detailMemo, setDetailMemo] = useState(null);
  const [memoModal, setMemoModal] = useState(false);

  // console.log(lectureStudentList);

  ////// REDUX //////
  ////// USEEFFECT //////

  useEffect(() => {
    if (router.query) {
      dispatch({
        type: LECTURE_DETAIL_REQUEST,
        data: {
          LectureId: router.query.id,
        },
      });
    }
  }, [router.query]);

  useEffect(() => {
    dispatch({
      type: LECTURE_MEMO_STU_LIST_REQUEST,
      data: {
        LectureId: parseInt(router.query.id),
        page: currentPage,
        search: "",
      },
    });
  }, [router.query, currentPage]);

  useEffect(() => {
    dispatch({
      type: LECTURE_DIARY_LIST_REQUEST,
      data: {
        LectureId: router.query.id,
        page: 1,
      },
    });
  }, [router.query, currentPage]);

  ////// HANDLER //////
  const detailMemoOpen = useCallback((data) => {
    setDetailMemo(data);
    setMemoModal(true);
  }, []);
  const detailMemoClose = useCallback(() => {
    setDetailMemo(null);
    setMemoModal(false);
  }, []);

  ////// TOGGLE //////

  ////// DATAVIEW //////

  const stuColumns = [
    {
      title: "수강생 이름(출생년도)",
      render: (data) => `${data.username}(${data.birth})`,
    },
    {
      title: "국가",
      dataIndex: "stuCountry",
    },
    {
      title: "수업료",
      render: () => lectureDetail && lectureDetail[0].price,
    },
    {
      title: "만기일",
      render: () => lectureDetail && lectureDetail[0].endDate.slice(0, 10),
    },
    {
      title: "메모",
      render: (data) => (
        <Button
          size={`small`}
          type={`primary`}
          onClick={() => detailMemoOpen(data.memo)}
        >
          메모 보기
        </Button>
      ),
    },
    {
      title: "출석률",
      dataIndex: "temp",
    },
  ];

  const lectureColumns = [
    {
      title: "날짜",
      dataIndex: "lecDate",
    },
    {
      title: "강사명",
      dataIndex: "teaName",
    },
    {
      title: "진도",
      dataIndex: "course",
    },
    {
      title: "수업메모",
      dataIndex: "memo",
    },
  ];

  const lectureDatum = [
    {
      id: 1,
      lecDate: "2022-03-22",
      teaName: "강사명",
      course: "진도",
      memo: "메모",
    },
    {
      id: 2,
      lecDate: "2022-03-22",
      teaName: "강사명",
      course: "진도",
      memo: "메모",
    },
    {
      id: 3,
      lecDate: "2022-03-22",
      teaName: "강사명",
      course: "진도",
      memo: "메모",
    },
    {
      id: 4,
      lecDate: "2022-03-22",
      teaName: "강사명",
      course: "진도",
      memo: "메모",
    },
    {
      id: 5,
      lecDate: "2022-03-22",
      teaName: "강사명",
      course: "진도",
      memo: "메모",
    },
    {
      id: 6,
      lecDate: "2022-03-22",
      teaName: "강사명",
      course: "진도",
      memo: "메모",
    },
  ];

  return (
    <AdminLayout>
      <PageHeader
        breadcrumbs={["클래스 관리", "클래스 상세보기"]}
        title={`클래스 상세보기`}
        subTitle={`클래스별 상세 설정을 할 수 있습니다.`}
      />

      <AdminContent>
        <Wrapper dr={`row`} ju={`flex-start`} margin={`0 0 10px`}>
          <Wrapper width={`4%`} padding={`11px 8px`}>
            <Image
              width={`33px`}
              src="https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/common/icon_lecture.png"
              alt="lecture_icon"
            />
          </Wrapper>
          <Wrapper width={`96%`} dr={`row`} ju={`flex-start`}>
            <Text fontSize={`24px`} fontWeight={`bold`}>
              수업 시간 / 요일
            </Text>
            <Text fontSize={`16px`} color={Theme.grey2_C} margin={`0 0 0 15px`}>
              NO.{router.query && router.query.id}
            </Text>
          </Wrapper>
        </Wrapper>
        <Wrapper dr={`row`} ju={`space-between`} margin={`0 0 14px`}>
          <Wrapper width={`50%`} dr={`row`} ju={`flex-start`}>
            <CustomSlide
              // 진도율 계산
              // 수업하는 요일을 이용해서 수업을 하는 날짜들을 전부 나열시킨다
              // 현재 날짜를 불러와 나열된 수업 날짜들과 비교하여 수업이 몇개 진행됐는지 구한다.
              // (수업 기간 * 주에 몇번 수업하는지)로 총 수업 수를 구한다.
              // 진행된 수업 수와 전체 수업 수로 백분율로 만들어 현재 진도율을 구한다.
              defaultValue={55}
              disabled={true}
              draggableTrack={true}
            />

            <Text>&nbsp;(55%)</Text>
          </Wrapper>
          <Wrapper width={`50%`} dr={`row`} ju={`flex-end`}>
            <CommonButton
              radius={`5px`}
              width={`130px`}
              margin={`0 6px`}
              kindOf={`white`}
              padding={`0`}
              onClick={() => moveLinkHandler(`/admin/class/list`)}
            >
              강의 목록
            </CommonButton>
            <CommonButton
              radius={`5px`}
              width={`130px`}
              margin={`0 6px`}
              kindOf={`white`}
              padding={`0`}
              onClick={() => moveLinkHandler(`/admin/board/notice/list`)}
            >
              게시판
            </CommonButton>
            <CommonButton
              radius={`5px`}
              width={`130px`}
              margin={`0 6px`}
              kindOf={`white`}
              padding={`0`}
              onClick={() => moveLinkHandler(`/admin/board/message/list`)}
            >
              쪽지
            </CommonButton>
          </Wrapper>
        </Wrapper>

        <Wrapper
          padding={`40px 30px 35px`}
          dr={`row`}
          ju={`flex-start`}
          bgColor={Theme.white_C}
          radius={`10px`}
          shadow={`0px 5px 15px rgba(0, 0, 0, 0.16)`}
          margin={`0 0 32px`}
        >
          <Wrapper width={`auto`} dr={`row`} ju={`flex-start`}>
            <Wrapper width={`auto`} margin={`0 10px 0 0`} padding={`8px`}>
              <Image
                width={`18px`}
                src="https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/common/icon_calender_b.png"
                alt="clender_icon"
              />
            </Wrapper>
            <Text fontSize={`18px`}>
              {lectureDetail && lectureDetail[0].viewDate}
              <SpanText
                fontWeight={`bold`}
                color={Theme.red_C}
                margin={`0 0 0 15px`}
              >
                {lectureDetail &&
                  `D-${moment
                    .duration(
                      moment(lectureDetail[0].endDate, "YYYY-MM-DD").diff(
                        moment().format("YYYY-MM-DD")
                      )
                    )
                    .asDays()}`}
              </SpanText>
            </Text>
          </Wrapper>
          <Wrapper
            width={`auto`}
            dr={`row`}
            ju={`flex-start`}
            margin={`0 100px 0 72px`}
          >
            <Wrapper width={`auto`} margin={`0 10px 0 0`} padding={`8px`}>
              <Image
                width={`18px`}
                src="https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/common/icon_name_yellow.png"
                alt="name_icon"
              />
            </Wrapper>

            <Text fontSize={`18px`}>
              {lectureDetail && lectureDetail[0].teacherName}
            </Text>
          </Wrapper>
          <Wrapper width={`auto`} dr={`row`} ju={`flex-start`}>
            <Wrapper width={`auto`} margin={`0 10px 0 0`} padding={`8px`}>
              <Image
                width={`18px`}
                src="https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/common/icon_book.png"
                alt="book_icon"
              />
            </Wrapper>
            <Text fontSize={`18px`}>Seoul National University book 1 / 6</Text>
          </Wrapper>

          <Wrapper
            width={`1px`}
            height={`48px`}
            borderLeft={`1px dashed ${Theme.grey_C}`}
            margin={`0 50px 0 130px`}
          />

          <Wrapper width={`auto`} al={`flex-start`} fontSize={`16px`}>
            <Wrapper dr={`row`}>
              <Text
                fontWeight={`bold`}
                width={`80px`}
                margin={`0 20px 0 0`}
                color={Theme.black_C}
              >
                ZOOM ID
              </Text>
              {lectureDetail && lectureDetail[0].zoomLink
                ? lectureDetail[0].zoomLink
                : "-"}
            </Wrapper>
            <Wrapper dr={`row`}>
              <Text
                fontWeight={`bold`}
                width={`80px`}
                margin={`0 20px 0 0`}
                color={Theme.black_C}
              >
                Password
              </Text>
              {lectureDetail && lectureDetail[0].zoomPass
                ? lectureDetail[0].zoomPass
                : "-"}
            </Wrapper>
          </Wrapper>
        </Wrapper>

        <Text fontSize={`18px`} fontWeight={`bold`}>
          수강 학생 목록
        </Text>

        <Table
          columns={stuColumns}
          dataSource={lectureMemoStuList}
          pagination={{
            defaultCurrent: 1,
            current: parseInt(currentPage),
            total: lectureMemoStuLastPage * 10,
            onChange: (page) => setCurrentPage(page),
          }}
        />

        {/* <Wrapper al={`flex-end`} margin={`10px 0 32px`}>
          <CommonButton kindOf={`white`} radius={`5px`}>
            추가하기
          </CommonButton>
        </Wrapper> */}

        <Text fontSize={`18px`} fontWeight={`bold`}>
          강의 일지
        </Text>

        <Table
          columns={lectureColumns}
          dataSource={lectureDiaryList}
          pagination={{
            defaultCurrent: 1,
            current: parseInt(currentPage2),
            total: lectureDiaryLastPage * 10,
            onChange: (page) => setCurrentPage2(page),
          }}
        />
      </AdminContent>

      <Modal visible={memoModal} footer={null} onCancel={detailMemoClose}>
        <Wrapper al={`flex-start`}>
          <Text margin={`0 0 20px`} fontSize={`18px`} fontWeight={`700`}>
            메모
          </Text>
          <Wrapper al={`flex-start`} ju={`flex-start`}>
            {detailMemo &&
              detailMemo.split(`\n`).map((content, idx) => {
                return (
                  <SpanText key={`${content}${idx}`}>
                    {content}
                    <br />
                  </SpanText>
                );
              })}
          </Wrapper>
        </Wrapper>
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

    // 구현부 종료
    context.store.dispatch(END);
    console.log("🍀 SERVER SIDE PROPS END");
    await context.store.sagaTask.toPromise();
  }
);

export default DetailClass;
