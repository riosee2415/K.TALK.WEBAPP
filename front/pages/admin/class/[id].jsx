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
  LECTURE_DIARY_ADMIN_LIST_REQUEST,
  LECTURE_DIARY_LIST_REQUEST,
  LECTURE_MEMO_STU_LIST_REQUEST,
  LECTURE_STUDENT_LIST_REQUEST,
} from "../../../reducers/lecture";
import moment from "moment";
import {
  BOOK_LECTURE_LIST_REQUEST,
  BOOK_LIST_REQUEST,
} from "../../../reducers/book";
import { saveAs } from "file-saver";
import useWidth from "../../../hooks/useWidth";
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

  const width = useWidth();

  const {
    lectureDetail,
    lectureDiaryLastPage,
    lectureMemoStuLastPage,
    lectureMemoStuList,
    lectureDiaryAdminList,
    lectureMemoStuCommute,
  } = useSelector((state) => state.lecture);
  const { bookLecture } = useSelector((state) => state.book);
  const dispatch = useDispatch();

  const [currentPage, setCurrentPage] = useState(1);
  const [currentPage2, setCurrentPage2] = useState(1);
  const [detailMemo, setDetailMemo] = useState(null);
  const [memoModal, setMemoModal] = useState(false);

  const [detailBook, setDetailBook] = useState(null);
  const [bookModal, setBookModal] = useState(false);

  // console.log(lectureStudentList);

  ////// REDUX //////
  ////// USEEFFECT //////

  useEffect(() => {}, [router.query]);

  useEffect(() => {
    if (router.query) {
      dispatch({
        type: LECTURE_DETAIL_REQUEST,
        data: {
          LectureId: router.query.id,
        },
      });
      dispatch({
        type: LECTURE_DIARY_ADMIN_LIST_REQUEST,
        data: {
          LectureId: router.query.id,
        },
      });
      dispatch({
        type: BOOK_LECTURE_LIST_REQUEST,
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

  ////// HANDLER //////

  const fileDownloadHandler = useCallback(async (filePath) => {
    let blob = await fetch(filePath).then((r) => r.blob());

    const file = new Blob([blob]);

    const ext = filePath.substring(
      filePath.lastIndexOf(".") + 1,
      filePath.length
    );

    const originName = `첨부파일.${ext}`;

    saveAs(file, originName);
  }, []);

  const detailMemoOpen = useCallback((data) => {
    setDetailMemo(data);
    setMemoModal(true);
  }, []);
  const detailMemoClose = useCallback(() => {
    setDetailMemo(null);
    setMemoModal(false);
  }, []);

  const detailBookOpen = useCallback(() => {
    setDetailBook(bookLecture);
    setBookModal(true);
  }, [bookLecture]);

  console.log(bookLecture);

  const detailBookClose = useCallback(() => {
    setDetailBook(null);
    setBookModal(false);
  }, []);

  const stepHanlder = useCallback((startDate, endDate, count, lecDate, day) => {
    let dir = 0;

    const save = Math.abs(
      moment.duration(moment().diff(moment(startDate, "YYYY-MM-DD"))).asDays() -
        1
    );

    let check = parseInt(
      moment
        .duration(moment(endDate).diff(moment(startDate, "YYYY-MM-DD")))
        .asDays() + 1
    );

    if (save >= check) {
      dir = check;
    } else {
      dir = save;
    }

    const arr = ["일", "월", "화", "수", "목", "금", "토"];
    let add = 0;

    for (let i = 0; i < dir; i++) {
      let saveDay = moment(startDate)
        .add(i + 1, "days")
        .day();

      const saveResult = day.includes(arr[saveDay]);

      if (saveResult) {
        add += 1;
      }
    }

    return parseInt((add / (count * lecDate)) * 100);
  }, []);

  ////// TOGGLE //////

  ////// DATAVIEW //////

  const stuColumns = [
    {
      title: "No",
      dataIndex: "id",
    },
    {
      title: "수강생 이름(출생년도)",
      render: (data) => `${data.username}(${data.birth.slice(0, 10)})`,
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
      render: (data) => {
        return (
          <Text>
            {Math.floor(
              (lectureMemoStuCommute.find(
                (value) => value.UserId === data.UserId
              ).CommuteCnt /
                (lectureDetail[0].count * lectureDetail[0].lecDate)) *
                100
            )}
            %
          </Text>
        );
      },
    },
  ];
  // console.log(
  //   lectureDetail && lectureDetail[0].count * lectureDetail[0].lecDate
  // );
  const lectureColumns = [
    {
      title: "No",
      dataIndex: "id",
    },
    {
      title: "날짜",
      render: (data) => data.createdAt.slice(0, 10),
    },
    {
      title: "강사명",
      dataIndex: "author",
    },
    {
      title: "진도",
      dataIndex: "process",
    },
    {
      title: "수업메모",
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
  ];

  const bookColumns = [
    {
      title: "No",
      dataIndex: "id",
    },
    {
      title: "썸네일 이미지",
      render: (data) => {
        return (
          <Wrapper width={`100px`}>
            <Image src={data.Book.thumbnail} alt={`thumbnail`} />
          </Wrapper>
        );
      },
    },
    {
      title: "제목",
      render: (data) => {
        return <Text>{data.Book.title}</Text>;
      },
    },
    {
      title: "첨부파일 다운로드",
      render: (data) => {
        return (
          <Button
            type={`primary`}
            size={`small`}
            onClick={() => fileDownloadHandler(data.Book.file)}
          >
            다운로드
          </Button>
        );
      },
    },
  ];

  // console.log(lectureDiaryAdminList);
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
            {lectureDetail && (
              <CustomSlide
                defaultValue={stepHanlder(
                  lectureDetail[0].startDate,
                  lectureDetail[0].endDate,
                  lectureDetail[0].count,
                  lectureDetail[0].lecDate,
                  lectureDetail[0].day
                )}
                disabled={true}
                draggableTrack={true}
              />
            )}

            <Text>
              &nbsp;(
              {lectureDetail &&
                stepHanlder(
                  lectureDetail[0].startDate,
                  lectureDetail[0].endDate,
                  lectureDetail[0].count,
                  lectureDetail[0].lecDate,
                  lectureDetail[0].day
                )}
              %)
            </Text>
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
              {lectureDetail && lectureDetail[0].startDate.slice(0, 10)}~
              {lectureDetail && lectureDetail[0].endDate.slice(0, 10)}
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
              {lectureDetail && lectureDetail[0].course}&nbsp;/&nbsp;
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
            <Text fontSize={`18px`}>
              <Button type={`primary`} size={`small`} onClick={detailBookOpen}>
                교재 리스트
              </Button>
            </Text>
          </Wrapper>

          <Wrapper
            width={`1px`}
            height={`48px`}
            borderLeft={`1px dashed ${Theme.grey_C}`}
            margin={`0 50px 0 130px`}
          />

          <Wrapper width={`auto`} al={`flex-start`} fontSize={`16px`}>
            <Wrapper dr={`row`} ju={`flex-start`}>
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
            <Wrapper dr={`row`} ju={`flex-start`}>
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
          size={`small`}
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
          size={`small`}
          columns={lectureColumns}
          dataSource={lectureDiaryAdminList}
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

      <Modal
        visible={bookModal}
        footer={null}
        onCancel={detailBookClose}
        width={width < 700 ? `80%` : 700}
      >
        <Wrapper al={`flex-start`}>
          <Text margin={`0 0 20px`} fontSize={`18px`} fontWeight={`700`}>
            교재
          </Text>
          <Wrapper al={`flex-start`} ju={`flex-start`}>
            <Table
              style={{ width: `100%` }}
              size={`small`}
              columns={bookColumns}
              dataSource={bookLecture}
            />
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
