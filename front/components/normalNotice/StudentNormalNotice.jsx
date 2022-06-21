import React, { useCallback, useEffect, useRef, useState } from "react";
import { Wrapper, Text, CommonButton, CommonTitle } from "../commonComponents";
import axios from "axios";
import { END } from "redux-saga";
import wrapper from "../../store/configureStore";
import {
  NORMAL_FILE_UPLOAD_REQUEST,
  NORMAL_NOTICE_DELETE_REQUEST,
  NORMAL_NOTICE_EDITOR_RENDER,
  NORMAL_NOTICE_LIST_REQUEST,
  NORMAL_NOTICE_MODAL_TOGGLE,
  NORMAL_NOTICE_STU_CREATE_REQUEST,
  NORMAL_NOTICE_UPDATE_REQUEST,
} from "../../reducers/normalNotice";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Empty,
  Form,
  Input,
  message,
  Modal,
  Pagination,
  Popconfirm,
  Select,
  Spin,
} from "antd";
import styled from "styled-components";
import Theme from "../Theme";
import useWidth from "../../hooks/useWidth";
import { saveAs } from "file-saver";
import moment from "moment";
import ToastEditorComponentMix from "../../components/editor/ToastEditorComponentMix";
import { useRouter } from "next/router";
import { LOAD_MY_INFO_REQUEST } from "../../reducers/user";

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

const WordbreakText = styled(Text)`
  word-break: break-all;
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

const StudentNormalNotice = () => {
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
    normalNoticeStuCreateLoading,
    normalNoticeStuCreateDone,
    normalNoticeStuCreateError,
    //
    normalNoticeUpdateLoading,
    normalNoticeUpdateDone,
    normalNoticeUpdateError,
    //
    normalNoticeDeleteLoading,
    normalNoticeDeleteDone,
    normalNoticeDeleteError,
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
    if (router.query) {
      dispatch({
        type: NORMAL_NOTICE_LIST_REQUEST,
        data: {
          page: 1,
        },
      });
    }
  }, [router.query]);

  useEffect(() => {
    if (normalNoticeListError) {
      return message.error(normalNoticeListError);
    }
  }, [normalNoticeListError]);

  // CREATE EFFECT
  useEffect(() => {
    if (normalNoticeStuCreateDone) {
      dispatch({
        type: NORMAL_NOTICE_LIST_REQUEST,
        data: {
          page: currentPage,
        },
      });

      normalNoticeCreateModalToggle();

      return message.success("Normal Board has been written.");
    }
  }, [normalNoticeStuCreateDone]);

  useEffect(() => {
    if (normalNoticeStuCreateError) {
      return message.error(normalNoticeStuCreateError);
    }
  }, [normalNoticeStuCreateError]);

  // UPDATE EFFECT
  useEffect(() => {
    if (normalNoticeUpdateDone) {
      dispatch({
        type: NORMAL_NOTICE_LIST_REQUEST,
        data: {
          page: currentPage,
        },
      });

      normalNoticeUpdateModalToggle(null);

      return message.success("Normal Board is update.");
    }
  }, [normalNoticeUpdateDone]);

  useEffect(() => {
    if (normalNoticeUpdateError) {
      return message.error(normalNoticeUpdateError);
    }
  }, [normalNoticeUpdateError]);

  // DELETE EFFECT
  useEffect(() => {
    if (normalNoticeDeleteDone) {
      dispatch({
        type: NORMAL_NOTICE_LIST_REQUEST,
        data: {
          page: currentPage,
        },
      });

      return message.success("Normal Board is delete.");
    }
  }, [normalNoticeDeleteDone]);

  useEffect(() => {
    if (normalNoticeDeleteError) {
      return message.error(normalNoticeDeleteError);
    }
  }, [normalNoticeDeleteError]);

  ////// TOGGLE //////

  // CREATE MODAL TOGGLE
  const normalNoticeCreateModalToggle = useCallback(() => {
    dispatch({
      type: NORMAL_NOTICE_EDITOR_RENDER,
      data: "create",
    });
    setUpdateData(null);
    normalNoticeForm.resetFields();
    setNormalNoticeType(null);
    setContentData(null);

    dispatch({
      type: NORMAL_NOTICE_MODAL_TOGGLE,
    });
  }, [normalNoticeModal, normalNoticeType, contentData, updateData]);

  // UPDATE MODAL TOGGLE
  const normalNoticeUpdateModalToggle = useCallback(
    (data) => {
      if (data) {
        setUpdateData(data);
        setContentData(data.noticeContent);

        normalNoticeForm.setFieldsValue({
          title: data.noticeTitle,
          content: data.noticeContent,
        });

        dispatch({
          type: NORMAL_NOTICE_EDITOR_RENDER,
          data: data.noticeContent,
        });
      } else {
        dispatch({
          type: NORMAL_NOTICE_EDITOR_RENDER,
          data: null,
        });
        setUpdateData(null);
        normalNoticeForm.resetFields();
        setNormalNoticeType(null);
        setContentData(null);
      }

      dispatch({
        type: NORMAL_NOTICE_MODAL_TOGGLE,
      });
    },
    [normalNoticeModal, normalNoticeType, contentData, updateData]
  );

  ////// HANDLER //////

  // 일반게시판 페이지 네이션
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
  const normalNoticeCreate = useCallback(
    (data) => {
      dispatch({
        type: NORMAL_NOTICE_STU_CREATE_REQUEST,
        data: {
          title: data.title,
          content: contentData,
          author: me.username,
          level: me.level,
          file: normalNoticeFilePath,
        },
      });
    },
    [normalNoticeFilePath, me, contentData]
  );

  // 일반게시판 수정
  const normalNoticeUpdate = useCallback(
    (data) => {
      dispatch({
        type: NORMAL_NOTICE_UPDATE_REQUEST,
        data: {
          id: updateData.noticeId,
          title: data.title,
          content: contentData,
          author: me.username,
          level: me.level,
          file: normalNoticeFilePath,
        },
      });
    },
    [normalNoticeFilePath, me, contentData, updateData]
  );

  // 일반게시판 수정
  const normalNoticeDelete = useCallback((data) => {
    dispatch({
      type: NORMAL_NOTICE_DELETE_REQUEST,
      data: {
        id: data.noticeId,
      },
    });
  }, []);

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

  return (
    <>
      <Wrapper al={`flex-start`} margin={`40px 0 0`}>
        <Wrapper dr={`row`} ju={`space-between`}>
          <CommonTitle margin={`0 0 20px`}>Normal Board</CommonTitle>
          <CommonButton
            onClick={normalNoticeCreateModalToggle}
            loading={normalNoticeStuCreateLoading}
          >
            Write
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
            <WordbreakText
              fontSize={width < 700 ? `14px` : `18px`}
              fontWeight={`Bold`}
              width={`10%`}
            >
              No
            </WordbreakText>
            <WordbreakText
              fontSize={width < 700 ? `14px` : `18px`}
              fontWeight={`Bold`}
              width={width < 800 ? `25%` : `10%`}
            >
              Date
            </WordbreakText>
            <WordbreakText
              fontSize={width < 700 ? `14px` : `18px`}
              fontWeight={`Bold`}
              width={width < 800 ? `35%` : `58%`}
            >
              Title
            </WordbreakText>
            <WordbreakText
              fontSize={width < 700 ? `14px` : `18px`}
              fontWeight={`Bold`}
              width={width < 800 ? `15%` : `10%`}
            >
              Writer
            </WordbreakText>
            <WordbreakText
              fontSize={width < 700 ? `14px` : `18px`}
              fontWeight={`Bold`}
              width={width < 800 ? `15%` : `12%`}
            >
              {width < 800 ? `Update` : `Update | Delete`}
            </WordbreakText>
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
                <Empty description="No NormalNotice" />
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
                  >
                    <WordbreakText
                      fontSize={width < 700 ? `14px` : `16px`}
                      width={`10%`}
                      wordBreak={`break-word`}
                      onClick={() =>
                        moveLinkHandler(
                          `/normalNotice/${data.noticeId}?type=stu`
                        )
                      }
                      isEllipsis
                    >
                      {data.noticeId}
                    </WordbreakText>
                    <WordbreakText
                      fontSize={width < 700 ? `14px` : `16px`}
                      width={width < 800 ? `25%` : `10%`}
                      onClick={() =>
                        moveLinkHandler(
                          `/normalNotice/${data.noticeId}?type=stu`
                        )
                      }
                      isEllipsis
                    >
                      {moment(data.noticeCreatedAt, "YYYY/MM/DD").format(
                        "YYYY/MM/DD"
                      )}
                    </WordbreakText>
                    <WordbreakText
                      fontSize={width < 700 ? `14px` : `16px`}
                      width={width < 800 ? `35%` : `58%`}
                      onClick={() =>
                        moveLinkHandler(
                          `/normalNotice/${data.noticeId}?type=stu`
                        )
                      }
                      textAlign={`left`}
                      isEllipsis
                    >
                      {data.noticeTitle}
                    </WordbreakText>
                    <WordbreakText
                      fontSize={width < 700 ? `14px` : `16px`}
                      width={width < 800 ? `15%` : `10%`}
                      onClick={() =>
                        moveLinkHandler(
                          `/normalNotice/${data.noticeId}?type=stu`
                        )
                      }
                      isEllipsis
                    >
                      {data.noticeAuthor}
                      {`(${
                        data.noticeLevel === 1
                          ? "student"
                          : data.noticeLevel === 2
                          ? "teacher"
                          : "admin"
                      })`}
                    </WordbreakText>
                    <Wrapper width={width < 800 ? `15%` : `12%`}>
                      {me && me.id === data.writeUserId ? (
                        <Wrapper dr={width < 800 ? `column` : `row`}>
                          <CommonButton
                            width={width < 800 ? `100%` : `50%`}
                            padding={`0`}
                            fontSize={`13px`}
                            onClick={() => normalNoticeUpdateModalToggle(data)}
                            loading={normalNoticeUpdateLoading}
                          >
                            Update
                          </CommonButton>
                          <Popconfirm
                            title="Are you sure you want to delete it?"
                            okText="Delete"
                            cancelText="Cancel"
                            placement="topRight"
                            onConfirm={() => normalNoticeDelete(data)}
                            loading={normalNoticeDeleteLoading}
                          >
                            <CommonButton
                              width={width < 800 ? `100%` : `50%`}
                              padding={`0`}
                              fontSize={`13px`}
                              kindOf={`delete`}
                            >
                              Delete
                            </CommonButton>
                          </Popconfirm>
                        </Wrapper>
                      ) : (
                        <WordbreakText>
                          You do not have permission.
                        </WordbreakText>
                      )}
                    </Wrapper>
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
        title={updateData ? "Normal Notice Update" : "Normal Notice Write"}
        visible={normalNoticeModal}
        onCancel={() => normalNoticeUpdateModalToggle(null)}
        footer={null}
      >
        <Wrapper padding={`10px`}>
          <Form
            form={normalNoticeForm}
            style={{ width: `100%` }}
            onFinish={updateData ? normalNoticeUpdate : normalNoticeCreate}
            labelCol={{ span: 2 }}
            wrapperCol={{ span: 22 }}
          >
            <Form.Item
              label="title"
              name="title"
              rules={[{ required: true, message: "Please enter the title." }]}
            >
              <Input allowClear placeholder="Please enter the title." />
            </Form.Item>

            <Form.Item
              label="content"
              name="content"
              rules={[{ required: true, message: "Please enter the content." }]}
            >
              <ToastEditorComponentMix
                action={getEditContent}
                initialValue={contentData ? contentData : ""}
                placeholder="Please enter the content."
                buttonText={updateData ? "Update" : "Write"}
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
                  ? `file`
                  : filename
                  ? filename
                  : `Please select a file.`}
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

export default StudentNormalNotice;
