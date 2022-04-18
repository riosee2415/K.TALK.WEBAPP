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
import { PARTICIPANT_ADMIN_LIST_REQUEST } from "../../../reducers/participant";
import { NOTICE_LECTURE_LIST_REQUEST } from "../../../reducers/notice";
import { MESSAGE_LECTURE_LIST_REQUEST } from "../../../reducers/message";
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
    lectureMemoStuLastPage,
    lectureMemoStuList,
    lectureDiaryAdminList,
    noticeLectureLastPage,
  } = useSelector((state) => state.lecture);
  const { partAdminList } = useSelector((state) => state.participant);
  const { bookLecture } = useSelector((state) => state.book);
  const { noticeLectureList } = useSelector((state) => state.notice);
  const { messageLectureList, messageLectureLastPage } = useSelector(
    (state) => state.message
  );
  const dispatch = useDispatch();

  const [currentPage, setCurrentPage] = useState(1);

  const [memoModal, setMemoModal] = useState(false);
  const [currentStudentId, setCurrentStudentId] = useState(null);
  const [commutesModal, setCommutesModal] = useState(false);

  const [lecModal, setLecModal] = useState(false);
  const [lecMemoData, setLecMemoData] = useState(null);

  const [detailMemoModal, setDetailMemoModal] = useState(false);
  const [detailMemo, setDetailMemo] = useState(null);

  const [detailBook, setDetailBook] = useState(null);
  const [bookModal, setBookModal] = useState(false);

  const [currentNoticePage, setCurrentNoticePage] = useState(1);
  const [currentMessagePage, setCurrentMessagePage] = useState(1);

  const [noticeModal, setNoticeModal] = useState(false);
  const [noticeDetail, setNoticeDetail] = useState(null);

  const [messageModal, setMessageModal] = useState(false);
  const [messageDetail, setMessageDetail] = useState(null);

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
      dispatch({
        type: PARTICIPANT_ADMIN_LIST_REQUEST,
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
        StudentId: currentStudentId,
      },
    });
  }, [router.query, currentPage, currentStudentId]);

  useEffect(() => {
    dispatch({
      type: NOTICE_LECTURE_LIST_REQUEST,
      data: {
        LectureId: router.query.id,
        page: currentNoticePage,
      },
    });
  }, [router.query, currentNoticePage]);

  useEffect(() => {
    dispatch({
      type: MESSAGE_LECTURE_LIST_REQUEST,
      data: {
        LectureId: router.query.id,
        page: currentMessagePage,
      },
    });
  }, [router.query, currentMessagePage]);

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
    setCurrentStudentId(data.UserId);
    setMemoModal(true);
  }, []);
  const detailMemoClose = useCallback(() => {
    setMemoModal(false);
    setCurrentStudentId(null);
  }, []);

  const detailCommutesOpen = useCallback((data) => {
    setCurrentStudentId(data.UserId);
    setCommutesModal(true);
  }, []);
  const detailCommutesClose = useCallback(() => {
    setCurrentStudentId(null);
    setCommutesModal(false);
  }, []);

  const lecMemoOpen = useCallback((data) => {
    setLecModal(true);
    setLecMemoData(data);
  }, []);
  const lecMemoClose = useCallback(() => {
    setLecModal(false);
    setLecMemoData(null);
  }, []);

  const detailBookOpen = useCallback(() => {
    setDetailBook(bookLecture);
    setBookModal(true);
  }, [bookLecture]);

  // console.log(bookLecture);

  const detailBookClose = useCallback(() => {
    setDetailBook(null);
    setBookModal(false);
  }, []);

  const detailMemoContentOpen = useCallback((data) => {
    setDetailMemo(data);
    setDetailMemoModal(true);
  }, []);

  const detailMemoContentClose = useCallback(() => {
    setDetailMemo(null);
    setDetailMemoModal(false);
  }, []);

  const stepEnd = useCallback((endDate, day) => {
    let endDay = moment
      .duration(moment(endDate).diff(moment().format("YYYY-MM-DD")))
      .asDays();

    const arr = ["일", "월", "화", "수", "목", "금", "토"];
    let add = 0;

    for (let i = 0; i < endDay; i++) {
      let saveDay = moment()
        .add(i + 1, "days")
        .day();

      const saveResult = day.includes(arr[saveDay]);

      if (saveResult) {
        add += 1;
      }
    }

    return add;
  }, []);

  ////// TOGGLE //////

  const noticeToggle = useCallback((data) => {
    setNoticeModal((prev) => !prev);
    setNoticeDetail(data);
  }, []);

  const messageToggle = useCallback((data) => {
    setMessageModal((prev) => !prev);
    setMessageDetail(data);
  }, []);

  ////// DATAVIEW //////
  const stuColumns = [
    {
      title: "No",
      dataIndex: "id",
    },
    {
      title: "수강생 이름(출생년도)",
      render: (data) => {
        return `${data.username}(${data.birth.slice(0, 10)})`;
      },
    },
    {
      title: "국가",
      dataIndex: "stuCountry",
    },
    {
      title: "수업료",
      render: (data) => {
        const findData = partAdminList.price.find(
          (value) => value.UserId === data.UserId
        );
        return <Text>{findData ? `$` + findData.price : `-`}</Text>;
      },
    },
    {
      title: "만기일",
      render: () => lectureDetail && lectureDetail[0].endDate.slice(0, 10),
    },
    {
      title: "출석 기록",
      render: (data) => (
        <Button
          size={`small`}
          type={`primary`}
          onClick={() => detailCommutesOpen(data)}
        >
          상세보기
        </Button>
      ),
    },
    {
      title: "메모",
      render: (data) => (
        <Button
          size={`small`}
          type={`primary`}
          onClick={() => detailMemoOpen(data)}
        >
          메모 보기
        </Button>
      ),
    },
  ];
  // console.log(
  //   lectureDetail && lectureDetail[0].count * lectureDetail[0].lecDate
  // );
  const lectureColumns = [
    {
      title: "번호",
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
          onClick={() => lecMemoOpen(data)}
        >
          메모 보기
        </Button>
      ),
    },
  ];

  const bookColumns = [
    {
      title: "번호",
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

  const memoListColumns = [
    {
      title: "번호",
      dataIndex: "id",
    },
    {
      title: "작성일",
      render: (data) => <Text>{data.createdAt.slice(0, 13)}</Text>,
    },
    {
      title: "메모 보기",
      render: (data) => {
        return (
          <Button
            type={`primary`}
            size={`small`}
            onClick={() => detailMemoContentOpen(data)}
          >
            내용 보기
          </Button>
        );
      },
    },
  ];

  const commutesListColumns = [
    {
      title: "번호",
      dataIndex: "id",
    },

    {
      title: "출석일",
      render: (data) => <Text>{data.time}</Text>,
    },
    {
      title: "출석 여부",
      render: (data) => {
        return <Text>{data.status}</Text>;
      },
    },
  ];

  const noticeColumns = [
    {
      title: "번호",
      dataIndex: "id",
    },
    {
      title: "제목",
      dataIndex: "title",
    },
    {
      title: "작성자",
      dataIndex: "author",
    },
    {
      title: "작성일",
      render: (data) => <div>{data.createdAt.substring(0, 13)}</div>,
    },
    {
      title: "상세보기",
      render: (data) => (
        <Button
          type="primary"
          size={`small`}
          onClick={() => noticeToggle(data)}
        >
          상세보기
        </Button>
      ),
    },
  ];

  const messageColumns = [
    {
      title: "번호",
      dataIndex: "id",
    },
    {
      title: "제목",
      dataIndex: "title",
    },

    {
      title: "작성자",
      dataIndex: "author",
    },

    {
      title: "생성일",
      render: (data) => <div>{data.createdAt.substring(0, 14)}</div>,
    },

    {
      title: "상세보기",
      render: (data) => (
        <Button type="primary" size="small" onClick={() => messageToggle(data)}>
          상세보기
        </Button>
      ),
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
        <Wrapper dr={`row`} ju={`space-between`} margin={`0 0 30px`}>
          <Wrapper dr={`row`} ju={`flex-start`} width={`auto`}>
            <Wrapper width={`auto`} padding={`11px 8px`}>
              <Image
                width={`33px`}
                src="https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/common/icon_lecture.png"
                alt="lecture_icon"
              />
            </Wrapper>
            <Wrapper width={`auto`} dr={`row`} ju={`flex-start`}>
              <Text fontSize={`24px`} fontWeight={`bold`}>
                {console.log(lectureDetail && lectureDetail[0].day)}
                {lectureDetail && lectureDetail[0].day}&nbsp;/&nbsp;
                {lectureDetail && lectureDetail[0].time}
              </Text>
              <Text
                fontSize={`16px`}
                color={Theme.grey2_C}
                margin={`0 0 0 15px`}
              >
                NO.{router.query && router.query.id}
              </Text>
            </Wrapper>
          </Wrapper>
          <Wrapper dr={`row`} ju={`flex-start`} width={`auto`}>
            <CommonButton
              radius={`5px`}
              width={`130px`}
              margin={`0 6px`}
              kindOf={`white`}
              padding={`0`}
              onClick={() => moveLinkHandler(`/admin`)}
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
                  stepEnd(lectureDetail[0].endDate, lectureDetail[0].day)}
                회
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
              {lectureDetail && lectureDetail[0].teacherName}&nbsp;/&nbsp;
              {lectureDetail && lectureDetail[0].course}
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
                width={`90px`}
                margin={`0 20px 0 0`}
                color={Theme.black_C}
              >
                ZOOM LINK
              </Text>
              {lectureDetail && lectureDetail[0].zoomLink
                ? lectureDetail[0].zoomLink
                : "-"}
            </Wrapper>
            <Wrapper dr={`row`} ju={`flex-start`}></Wrapper>
          </Wrapper>
        </Wrapper>

        <Text fontSize={`18px`} fontWeight={`bold`}>
          수강 학생 목록
        </Text>

        <Table
          size={`small`}
          columns={stuColumns}
          dataSource={partAdminList.partList}
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
        <Wrapper dr={`row`} ju={`space-between`} al={`flex-start`}>
          <Wrapper width={`47.5%`} al={`flex-start`}>
            <Text fontSize={`18px`} fontWeight={`bold`}>
              게시판
            </Text>

            {console.log(noticeLectureList)}
            <Table
              columns={noticeColumns}
              style={{ width: `100%` }}
              dataSource={noticeLectureList ? noticeLectureList : []}
              pagination={{
                defaultCurrent: 1,
                current: parseInt(currentNoticePage),
                onChange: (page) => setCurrentNoticePage(page),
                total: noticeLectureLastPage * 10,
              }}
              size={`small`}
            />
          </Wrapper>
          <Wrapper width={`47.5%`} al={`flex-start`}>
            <Text fontSize={`18px`} fontWeight={`bold`}>
              쪽지
            </Text>

            <Table
              size={`small`}
              columns={messageColumns}
              style={{ width: `100%` }}
              dataSource={messageLectureList ? messageLectureList : []}
              pagination={{
                defaultCurrent: 1,
                current: parseInt(currentMessagePage),
                onChange: (page) => setCurrentMessagePage(page),
                total: messageLectureLastPage * 10,
              }}
            />
          </Wrapper>
        </Wrapper>
      </AdminContent>

      <Modal visible={memoModal} footer={null} onCancel={detailMemoClose}>
        <Wrapper al={`flex-start`}>
          <Text margin={`0 0 20px`} fontSize={`18px`} fontWeight={`700`}>
            메모
          </Text>
          <Wrapper al={`flex-start`} ju={`flex-start`}>
            <Table
              style={{ width: `100%` }}
              size={`small`}
              columns={memoListColumns}
              dataSource={lectureMemoStuList}
              pagination={{
                current: parseInt(currentPage),
                total: lectureMemoStuLastPage * 10,
                onChange: (page) => setCurrentPage(page),
              }}
            />
          </Wrapper>
        </Wrapper>
      </Modal>

      <Modal
        visible={commutesModal}
        footer={null}
        onCancel={detailCommutesClose}
      >
        <Wrapper al={`flex-start`}>
          <Text margin={`0 0 20px`} fontSize={`18px`} fontWeight={`700`}>
            출석 기록
          </Text>
          <Wrapper al={`flex-start`} ju={`flex-start`}>
            <Table
              style={{ width: `100%` }}
              size={`small`}
              columns={commutesListColumns}
              dataSource={partAdminList.commutes}
              pagination={{
                current: parseInt(currentPage),
                total: lectureMemoStuLastPage * 10,
                onChange: (page) => setCurrentPage(page),
              }}
            />
          </Wrapper>
        </Wrapper>
      </Modal>

      <Modal
        visible={detailMemoModal}
        footer={null}
        onCancel={detailMemoContentClose}
        width={800}
        title={`메모 내용`}
      >
        <Wrapper al={`flex-start`}>
          <Text margin={`0 0 20px`} fontSize={`18px`} fontWeight={`700`}>
            {detailMemo && detailMemo.username} &nbsp;| &nbsp;
            {detailMemo && detailMemo.createdAt.slice(0, 13)}
          </Text>
          <Wrapper al={`flex-start`} ju={`flex-start`} height={`500px`}>
            {detailMemo &&
              detailMemo.memo.split(`\n`).map((data) => (
                <SpanText>
                  {data}
                  <br />
                </SpanText>
              ))}
          </Wrapper>
        </Wrapper>
      </Modal>

      <Modal
        visible={lecModal}
        footer={null}
        onCancel={lecMemoClose}
        width={600}
        title={`메모 내용`}
      >
        <Wrapper al={`flex-start`}>
          <Text margin={`0 0 20px`} fontSize={`18px`} fontWeight={`700`}>
            {lecMemoData && lecMemoData.createdAt.slice(0, 10)}
          </Text>
          <Wrapper al={`flex-start`} ju={`flex-start`} minHeight={`300px`}>
            {lecMemoData &&
              lecMemoData.lectureMemo.split(`\n`).map((data) => (
                <SpanText>
                  {data}
                  <br />
                </SpanText>
              ))}
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

      <Modal
        visible={noticeModal}
        onCancel={() => noticeToggle(null)}
        footer={null}
        title={`게시글 자세히 보기`}
      >
        <Wrapper>
          <Wrapper dr={`row`}>
            <Text>작성일 : </Text>
            <Text>{noticeDetail && noticeDetail.createdAt.slice(0, 13)}</Text>
          </Wrapper>

          <Wrapper dr={`row`}>
            <Text>제목 : </Text>
            <Text>{noticeDetail && noticeDetail.title}</Text>
          </Wrapper>

          <Wrapper dr={`row`}>
            <Text>작성자 : </Text>
            <Text>{noticeDetail && noticeDetail.author}</Text>
          </Wrapper>

          <Wrapper dr={`row`}>
            <Text>내용 : </Text>
            <Wrapper al={`flex-start`} ju={`flex-start`}>
              {noticeDetail &&
                noticeDetail.content.split(`\n`).map((data) => {
                  return (
                    <SpanText>
                      {data} <br />
                    </SpanText>
                  );
                })}
            </Wrapper>
          </Wrapper>
        </Wrapper>
      </Modal>

      <Modal
        visible={messageModal}
        onCancel={() => messageToggle(null)}
        footer={null}
        title={`쪽지 자세히 보기`}
      ></Modal>
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
