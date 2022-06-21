import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Wrapper,
  Image,
  Text,
  SpanText,
  TextInput,
  CommonButton,
  CommonTitle,
} from "../commonComponents";
import axios from "axios";
import { END } from "redux-saga";
import wrapper from "../../store/configureStore";
import {
  NORMAL_FILE_UPLOAD_REQUEST,
  NORMAL_NOTICE_LIST_REQUEST,
  NORMAL_NOTICE_MODAL_TOGGLE,
  NORMAL_NOTICE_TEACHER_CREATE_REQUEST,
} from "../../reducers/normalNotice";
import { useDispatch, useSelector } from "react-redux";
import { Button, Form, Input, message, Modal, Pagination, Select } from "antd";
import styled from "styled-components";
import Theme from "../Theme";
import useWidth from "../../hooks/useWidth";
import { saveAs } from "file-saver";
import moment from "moment";
import ToastEditorComponentMix from "../../components/editor/ToastEditorComponentMix";
import { useRouter } from "next/router";

const CustomPage = styled(Pagination)`
  & .ant-pagination-next > button {
    border: none;
  }

  & .ant-pagination-prev > button {
    border: none;
  }

  & {
    width: 100%;
    display: flex;
    justify-content: center;
  }

  & .ant-pagination-item,
  & .ant-pagination-next,
  & .ant-pagination-prev {
    border: none;
    width: 28px;
    height: 28px !important;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${Theme.white_C} !important;
    margin: 0 5px !important;
  }

  & .ant-pagination-item-active a {
    color: ${Theme.subTheme2_C};
  }

  & .ant-pagination-item:focus-visible a,
  .ant-pagination-item:hover a {
    color: ${Theme.subTheme2_C};
  }

  & .ant-pagination-item-link svg {
    font-weight: bold;
    color: ${Theme.black_2C};
  }

  @media (max-width: 800px) {
    width: 18px;
    height: 18px !important;
  }
`;

const CustomModal = styled(Modal)`
  & .ant-modal-header,
  & .ant-modal-content {
    border-radius: 5px;
  }

  & .ant-modal-title {
    font-size: 20px;
    font-weight: bold;
  }

  @media (max-width: 700px) {
    & .ant-modal-title {
      font-size: 16px;
    }
  }
`;

const FileBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`;

const TeacherNormalNotice = () => {
  ////// GLOBAL STATE //////

  const { me } = useSelector((state) => state.user);

  const {
    normalNoticeList,
    normalNoticeLastPage,
    normalNoticeFilePath,
    //
    normalNoticeModal,
    //
    normalNoticeListLoading,
    normalNoticeListError,
    //
    normalNoticeTeacherCreateLoading,
    normalNoticeTeacherCreateDone,
    normalNoticeTeacherCreateError,
  } = useSelector((state) => state.normalNotice);

  ////// HOOKS //////

  const width = useWidth();

  const dispatch = useDispatch();

  const router = useRouter();

  const [normalNoticeType, setNormalNoticeType] = useState(null);
  const [updateData, setUpdateData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [contentData, setContentData] = useState("");
  const [filename, setFilename] = useState(null);

  const [normalNoticeForm] = Form.useForm();

  const fileRef = useRef();

  ////// USEEFFECT /////

  useEffect(() => {
    if (normalNoticeListError) {
      return message.error(normalNoticeListError);
    }
  }, [normalNoticeListError]);

  useEffect(() => {
    if (normalNoticeTeacherCreateDone) {
      dispatch({
        type: NORMAL_NOTICE_LIST_REQUEST,
        data: {
          page: currentPage,
        },
      });

      normalNoticeModalToggle();

      return message.success("일반게시판이 작성됬습니다.");
    }
  }, [normalNoticeTeacherCreateDone]);

  useEffect(() => {
    if (normalNoticeTeacherCreateError) {
      return message.error(normalNoticeTeacherCreateError);
    }
  }, [normalNoticeTeacherCreateError]);

  ////// TOGGLE //////

  const normalNoticeModalToggle = useCallback(() => {
    normalNoticeForm.resetFields();
    setNormalNoticeType(null);
    setContentData(null);

    dispatch({
      type: NORMAL_NOTICE_MODAL_TOGGLE,
    });
  }, [normalNoticeModal, normalNoticeType, contentData]);

  ////// HANDLER //////

  // NORMAL NOTICE CHNAGE PAGE
  const onChangeNormalNoticePage = useCallback(
    (page) => {
      setCurrentPage(page);

      dispatch({
        type: NORMAL_NOTICE_LIST_REQUEST,
        data: {
          page,
        },
      });
    },
    [currentPage]
  );

  // 일반게시판 추가
  const normalNoticeAdminCreate = useCallback(
    (data) => {
      dispatch({
        type: NORMAL_NOTICE_TEACHER_CREATE_REQUEST,
        data: {
          title: data.title,
          content: contentData,
          author: me.username,
          level: me.level,
          file: normalNoticeFilePath,
          createType: normalNoticeType === "강사전체" ? 1 : 2,
        },
      });
    },
    [normalNoticeType, normalNoticeFilePath, me, contentData]
  );

  // 에디터 추가
  const getEditContent = useCallback(
    (contentValue) => {
      if (contentValue) {
        normalNoticeForm.submit();

        setContentData(contentValue);
      }
    },
    [contentData]
  );

  // 유형 선택
  const normalNoticeTypeChangeHandler = useCallback(
    (type) => {
      setNormalNoticeType(type);
    },
    [normalNoticeType]
  );

  const moveLinkHandler = useCallback((link) => {
    router.push(link);
  });

  // 파일 업로드
  const fileChangeHandler = useCallback(
    (e) => {
      const formData = new FormData();
      setFilename(e.target.files[0].name);

      [].forEach.call(e.target.files, (file) => {
        formData.append("file", file);
      });

      dispatch({
        type: NORMAL_FILE_UPLOAD_REQUEST,
        data: formData,
      });
    },
    [filename]
  );

  const fileUploadClick = useCallback(() => {
    fileRef.current.click();
  }, []);

  ////// DATEVIEW //////
  const normalSelectArr = ["강사전체", "관리자"];

  return (
    <>
      <Wrapper al={`flex-start`}>
        <Wrapper dr={`row`} ju={`space-between`}>
          <CommonTitle margin={`0 0 20px`}>일반게시판</CommonTitle>
          <CommonButton
            onClick={normalNoticeModalToggle}
            loading={normalNoticeTeacherCreateLoading}
          >
            작성하기
          </CommonButton>
        </Wrapper>

        <Wrapper borderTop={`2px solid ${Theme.black_C}`}>
          <Wrapper
            dr={`row`}
            textAlign={`center`}
            padding={`20px 0`}
            bgColor={Theme.subTheme9_C}
            borderBottom={`1px solid ${Theme.grey_C}`}
          >
            <Text
              fontSize={width < 700 ? `14px` : `18px`}
              fontWeight={`Bold`}
              width={width < 800 ? `15%` : `10%`}
            >
              번호
            </Text>
            <Text
              fontSize={width < 700 ? `14px` : `18px`}
              fontWeight={`Bold`}
              width={width < 800 ? `25%` : `10%`}
            >
              날짜
            </Text>
            <Text
              fontSize={width < 700 ? `14px` : `18px`}
              fontWeight={`Bold`}
              width={width < 800 ? `45%` : `70%`}
            >
              제목
            </Text>
            <Text
              fontSize={width < 700 ? `14px` : `18px`}
              fontWeight={`Bold`}
              width={width < 800 ? `15%` : `10%`}
            >
              작성자
            </Text>
          </Wrapper>
          {normalNoticeListLoading ? (
            <Wrapper>
              <Spin />
              <Text>일반게시판을 불러오고 있습니다.</Text>
            </Wrapper>
          ) : (
            normalNoticeList &&
            (normalNoticeList.length === 0 ? (
              <Wrapper margin={`30px 0`}>
                <Empty description="조회된 일반게시판이 없습니다." />
              </Wrapper>
            ) : (
              normalNoticeList.map((data, idx) => {
                return (
                  <Wrapper
                    key={data.id}
                    dr={`row`}
                    textAlign={`center`}
                    ju={`flex-start`}
                    padding={`25px 0 20px`}
                    cursor={`pointer`}
                    bgColor={idx % 2 === 1 && Theme.subTheme_C}
                    borderBottom={`1px solid ${Theme.grey_C}`}
                    onClick={() =>
                      moveLinkHandler(`/teacher/normalNotice/${data.noticeId}`)
                    }
                  >
                    <Text
                      fontSize={width < 700 ? `14px` : `16px`}
                      width={width < 800 ? `15%` : `10%`}
                      wordBreak={`break-word`}
                    >
                      {data.noticeId}
                    </Text>
                    <Text
                      fontSize={width < 700 ? `14px` : `16px`}
                      width={width < 800 ? `25%` : `10%`}
                    >
                      {moment(data.noticeCreatedAt, "YYYY/MM/DD").format(
                        "YYYY/MM/DD"
                      )}
                    </Text>
                    <Text
                      fontSize={width < 700 ? `14px` : `16px`}
                      width={width < 800 ? `45%` : `70%`}
                      textAlign={`left`}
                      isEllipsis
                    >
                      {data.noticeTitle}
                    </Text>
                    <Text
                      fontSize={width < 700 ? `14px` : `16px`}
                      width={width < 800 ? `15%` : `10%`}
                    >
                      {data.noticeAuthor}
                    </Text>
                  </Wrapper>
                );
              })
            ))
          )}
        </Wrapper>

        <Wrapper margin={`65px 0 85px`}>
          <CustomPage
            current={currentPage}
            total={normalNoticeLastPage * 10}
            onChange={(page) => onChangeNormalNoticePage(page)}
          ></CustomPage>
        </Wrapper>
      </Wrapper>

      {/* NORMAL NOTICE MODAL */}
      <CustomModal
        width={`1000px`}
        title="일반게시판 작성하기"
        visible={normalNoticeModal}
        onCancel={normalNoticeModalToggle}
        footer={null}
      >
        <Wrapper padding={`10px`}>
          <Form
            form={normalNoticeForm}
            style={{ width: `100%` }}
            onFinish={normalNoticeAdminCreate}
          >
            <Form.Item
              name="type"
              label="유형"
              rules={[{ required: true, message: "유형을 선택해 주세요." }]}
            >
              <Select
                showSearch
                style={{ width: `100%` }}
                placeholder="유형을 선택해 주세요."
                onChange={normalNoticeTypeChangeHandler}
              >
                {normalSelectArr &&
                  normalSelectArr.map((data) => (
                    <Select.Option value={data}>{data}</Select.Option>
                  ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="제목"
              name="title"
              rules={[{ required: true, message: "제목을 입력해 주세요" }]}
            >
              <Input allowClear placeholder="제목을 입력해주세요." />
            </Form.Item>

            <Form.Item
              label="본문"
              name="content"
              rules={[{ required: true, message: "본문을 입력해 주세요." }]}
            >
              <ToastEditorComponentMix
                action={getEditContent}
                initialValue={""}
                placeholder="본문을 입력해주세요."
                buttonText={"작성"}
              />
            </Form.Item>

            <FileBox>
              <input
                type="file"
                name="file"
                hidden
                ref={fileRef}
                onChange={fileChangeHandler}
              />
              <Text margin={`0 10px 0 0`}>
                {updateData
                  ? `첨부파일`
                  : filename
                  ? filename
                  : `파일을 선택해주세요.`}
              </Text>
              <Button size="small" type="primary" onClick={fileUploadClick}>
                FILE UPLOAD
              </Button>
            </FileBox>
          </Form>
        </Wrapper>
      </CustomModal>
      {/* NORMAL NOTICE MODAL END */}
    </>
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
      type: NORMAL_NOTICE_LIST_REQUEST,
      data: {
        page: 1,
      },
    });

    // 구현부 종료
    context.store.dispatch(END);
    console.log("🍀 SERVER SIDE PROPS END");
    await context.store.sagaTask.toPromise();
  }
);

export default TeacherNormalNotice;
