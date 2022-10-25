import React, { useCallback, useEffect, useRef, useState } from "react";

import axios from "axios";
import wrapper from "../store/configureStore";
import { END } from "redux-saga";
import Head from "next/head";

import ClientLayout from "../components/ClientLayout";
import { useDispatch, useSelector } from "react-redux";
import {
  Text,
  Image,
  WholeWrapper,
  Wrapper,
  RsWrapper,
  CommonButton,
  SpanText,
  ATag,
} from "../components/commonComponents";

import useWidth from "../hooks/useWidth";
import Theme from "../components/Theme";
import { useRouter } from "next/router";

import { LOAD_MY_INFO_REQUEST } from "../reducers/user";

import styled from "styled-components";
import {
  COMMUNITY_CREATE_REQUEST,
  COMMUNITY_LIST_REQUEST,
  COMMUNITY_TYPE_LIST_REQUEST,
  COMMUNITY_UPLOAD_REQUEST,
  FILE_INIT,
  CREATE_MODAL_CLOSE_REQUEST,
  CREATE_MODAL_OPEN_REQUEST,
} from "../reducers/community";
import {
  Button,
  Empty,
  Form,
  Input,
  message,
  Modal,
  notification,
  Pagination,
} from "antd";
import ToastEditorComponent6 from "../components/editor/ToastEditorComponent6";
import {
  CloseCircleOutlined,
  CommentOutlined,
  EyeOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import Application from "../components/application/Application";
import { APP_USE_LIST_REQUEST } from "../reducers/application";

const Box = styled(Wrapper)`
  align-items: flex-start;
  justify-content: flex-start;
  transition: 0.5s;
  width: calc(100% / 3 - 14px);
  padding: 30px 25px;
  background-color: ${(props) => props.theme.lightGrey2_C};
  border: 1px solid ${Theme.subTheme13_C};
  border-radius: 10px;
  cursor: pointer;
  margin: 0 20px 20px 0;

  &:hover {
    background-color: ${(props) => props.theme.subTheme6_C};
    color: ${(props) => props.theme.white_C};
  }

  &:nth-child(3n) {
    margin: 0 0 20px;
  }

  @media (max-width: 800px) {
    width: 100%;
    margin: 0 0 20px !important;
  }
`;

const LoadNotification = (msg, content) => {
  notification.open({
    message: msg,
    description: content,
    onClick: () => {},
  });
};

const Home = ({}) => {
  const width = useWidth();
  ////// GLOBAL STATE //////
  const { me } = useSelector((state) => state.user);
  const {
    communityList,
    communityMaxLength,
    createModal,
    st_communityCreateDone,
    st_communityCreateError,
    filePath,
  } = useSelector((state) => state.community);
  const { currentFormToggle } = useSelector((state) => state.app);

  ////// HOOKS //////
  const router = useRouter();
  const fileRef = useRef();

  ////// REDUX //////
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const [modalView, setModalView] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [contentData, setContentData] = useState("");

  ////// USEEFFECT //////
  useEffect(() => {
    if (st_communityCreateDone) {
      message.success(`게시판이 작성되었습니다.`);
      dispatch({
        type: COMMUNITY_LIST_REQUEST,
        data: {
          typeId: 2,
        },
      });
      dispatch({
        type: FILE_INIT,
      });
      modalClose();
    }
  }, [st_communityCreateDone]);

  useEffect(() => {
    dispatch({
      type: COMMUNITY_LIST_REQUEST,
      data: {
        typeId: 2,
      },
    });
  }, [router.query]);

  useEffect(() => {
    if (st_communityCreateError) {
      message.error(st_communityCreateError);
    }
  }, [st_communityCreateError]);

  ////// TOGGLE //////
  const modalOpen = useCallback(() => {
    dispatch({
      type: CREATE_MODAL_OPEN_REQUEST,
    });
  }, []);
  const modalClose = useCallback(() => {
    dispatch({
      type: CREATE_MODAL_CLOSE_REQUEST,
    });
    form.resetFields();
  }, []);

  const appModal = useCallback(() => {
    setModalView((prev) => !prev);
  }, modalView);

  ////// HANDLER //////
  const moveLinkHandler = useCallback((link) => {
    router.push(link);
  }, []);

  const formFinishBoard = useCallback(() => {
    form.submit();
  }, [form]);

  const onSubmitBoard = useCallback(
    (data) => {
      if (!contentData || contentData.trim() === "") {
        return message.error("Please click the Save button");
      }
      dispatch({
        type: COMMUNITY_CREATE_REQUEST,
        data: {
          title: data.title,
          content: contentData,
          type: 2,
          file: filePath,
        },
      });
    },
    [filePath, contentData]
  );

  const fileUploadClick = useCallback(() => {
    fileRef.current.click();
  }, [fileRef.current]);

  const fileChangeHandler = useCallback(
    (e) => {
      const formData = new FormData();

      [].forEach.call(e.target.files, (file) => {
        formData.append("file", file);
      });

      dispatch({
        type: COMMUNITY_UPLOAD_REQUEST,
        data: formData,
      });

      fileRef.current.value = "";
    },
    [fileRef]
  );

  const otherPageCall = useCallback((changePage) => {
    setCurrentPage(changePage);

    dispatch({
      type: COMMUNITY_LIST_REQUEST,
      data: {
        page: changePage,
        typeId: 2,
      },
    });
  }, []);

  const getEditContent = (contentValue) => {
    setContentData(contentValue);
  };
  ////// DATAVIEW //////

  return (
    <>
      <Head>
        <title>K-talk Live</title>
      </Head>

      <ClientLayout>
        <WholeWrapper padding={width < 800 ? `82px 0` : `100px 0`}>
          <Image
            alt="main"
            src={
              width < 900
                ? `https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/main-banner/banner1-mobile.png`
                : `https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/main-banner/banner1.png`
            }
          />

          <Wrapper>
            <RsWrapper>
              <Wrapper
                fontSize={
                  width < 900 ? (width < 700 ? `14px` : `16px`) : `24px`
                }
                color={Theme.basicTheme_C}
                fontWeight={`bold`}
                margin={`100px 0 20px`}
              >
                <Text>
                  <SpanText color={Theme.subTheme6_C}>K-talk Live</SpanText>
                  &nbsp;RUNS&nbsp;
                  <SpanText color={Theme.subTheme6_C}>
                    FREE ONLINE LESSONS
                  </SpanText>
                </Text>
                <Text>EVERY WEEK ALL YEAR ROUND</Text>
              </Wrapper>
              <Image
                alt="icon"
                margin={`10px 0 5px 15px`}
                width={width < 800 ? `220px` : `280px`}
                src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/main/img_free-message.png`}
              />
              <Wrapper dr={`row`} ju={`space-between`} margin={`0 0 100px`}>
                <Wrapper
                  shadow={`0 5px 15px rgba(0, 0, 0, 0.05)`}
                  width={width < 1000 ? `100%` : `49%`}
                  padding={width < 900 ? `20px 10px` : `35px 30px`}
                  dr={`row`}
                  ju={`space-around`}
                >
                  <Wrapper
                    width={`auto`}
                    fontSize={
                      width < 900 ? (width < 700 ? `13px` : `15px`) : `20px`
                    }
                    al={`flex-start`}
                  >
                    <Text fontWeight={`bold`}>For absolute beginners</Text>
                    <Text fontWeight={`300`}>
                      three 50-minute sessions a week
                    </Text>
                  </Wrapper>
                  <Wrapper width={`auto`}>
                    <ATag
                      href={`https://forms.gle/M4hQxCN8itnWkM3x7`}
                      target={`_blank`}
                    >
                      <CommonButton
                        height={`40px`}
                        radius={`25px`}
                        kindOf={`white`}
                        padding={`5px 5px 5px 8px`}
                      >
                        apply here
                        <Image
                          alt="icon"
                          margin={`0 0 0 15px`}
                          width={width < 900 ? `25px` : `30px`}
                          src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/main/blue-btn.png`}
                        />
                      </CommonButton>
                    </ATag>
                  </Wrapper>
                </Wrapper>
                <Wrapper
                  shadow={`0 5px 15px rgba(0, 0, 0, 0.05)`}
                  width={width < 1000 ? `100%` : `49%`}
                  padding={width < 900 ? `20px 10px` : `35px 30px`}
                  dr={`row`}
                  ju={`space-around`}
                >
                  <Wrapper
                    width={`auto`}
                    fontSize={
                      width < 900 ? (width < 700 ? `13px` : `15px`) : `20px`
                    }
                    al={`flex-start`}
                  >
                    <Text fontWeight={`bold`}>
                      For pre-intermediate learners
                    </Text>
                    <Text fontWeight={`300`}>2 sessions a week</Text>
                  </Wrapper>
                  <Wrapper width={`auto`}>
                    <ATag
                      href={`https://forms.gle/nsqiuEsEQqMj9qUj7`}
                      target={`_blank`}
                    >
                      <CommonButton
                        height={`40px`}
                        radius={`25px`}
                        kindOf={`white`}
                        padding={`5px 5px 5px 8px`}
                        // onClick={() => moveLinkHandler(`/application`)}
                      >
                        apply here
                        <Image
                          alt="icon"
                          margin={`0 0 0 15px`}
                          width={width < 900 ? `25px` : `30px`}
                          src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/main/blue-btn.png`}
                        />
                      </CommonButton>
                    </ATag>
                  </Wrapper>
                </Wrapper>
              </Wrapper>

              <Wrapper
                fontSize={
                  width < 900 ? (width < 700 ? `14px` : `16px`) : `24px`
                }
                color={Theme.subTheme2_C}
                fontWeight={`bold`}
                margin={`0 0 20px`}
              >
                K-talk Live regular paid lessons
              </Wrapper>

              <Wrapper
                shadow={`0 5px 15px rgba(0, 0, 0, 0.05)`}
                padding={width < 900 ? `20px 10px` : `35px 30px`}
                dr={`row`}
                ju={width < 900 ? `center` : `space-around`}
              >
                <Wrapper
                  width={`auto`}
                  al={`flex-start`}
                  color={Theme.darkGrey_C}
                  fontSize={
                    width < 900 ? (width < 700 ? `12px` : `14px`) : `18px`
                  }
                  fontWeight={`300`}
                >
                  <Text>
                    Starts every Monday
                    <SpanText
                      fontSize={width < 800 ? `12px` : `15px`}
                      margin={`0 10px`}
                    >
                      |
                    </SpanText>
                    Suitable for beginner to advanced
                    <SpanText
                      fontSize={width < 800 ? `12px` : `15px`}
                      margin={`0 10px`}
                    >
                      |
                    </SpanText>
                    Live online group class taught by native Korean teachers
                  </Text>
                  <Text margin={width < 700 ? `10px 0` : `20px 0`}>
                    3 sessions a week (1 session = 50 minutes)
                    <SpanText
                      fontSize={width < 800 ? `12px` : `15px`}
                      margin={`0 10px`}
                    >
                      |
                    </SpanText>
                    US $144 for 4 weeks (12 sessions over 4 weeks)
                    <SpanText
                      fontSize={width < 800 ? `12px` : `15px`}
                      margin={`0 10px`}
                    >
                      |
                    </SpanText>
                    Lessons through Zoom
                  </Text>
                  <Text>
                    Payment through Paypal
                    <SpanText
                      fontSize={width < 800 ? `12px` : `15px`}
                      margin={`0 10px`}
                    >
                      |
                    </SpanText>
                    Money-back guarantee for all lesson
                    <SpanText
                      fontSize={width < 800 ? `12px` : `15px`}
                      margin={`0 10px`}
                    >
                      |
                    </SpanText>
                    Not more than 7 learners in a class
                  </Text>
                </Wrapper>
                <Wrapper width={`auto`} margin={width < 900 && `15px 0 0`}>
                  <CommonButton
                    height={`40px`}
                    radius={`25px`}
                    kindOf={`subTheme`}
                    padding={`5px 5px 5px 8px`}
                    onClick={() => moveLinkHandler("/application")}
                  >
                    apply here
                    <Image
                      alt="icon"
                      margin={`0 0 0 15px`}
                      width={width < 900 ? `25px` : `30px`}
                      src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/main/red-btn.png`}
                    />
                  </CommonButton>
                </Wrapper>
              </Wrapper>

              <Wrapper al={`flex-start`} ju={`flex-start`} margin={`110px 0 0`}>
                <Wrapper>
                  <Image
                    alt="logo"
                    src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/main/icon_symbol.png`}
                    width={`64px`}
                  />
                  <Text
                    fontSize={`32px`}
                    fontWeight={`700`}
                    margin={`0 0 20px`}
                  >
                    Student's Review
                  </Text>
                  <Wrapper al={`flex-end`}>
                    {me && (
                      <CommonButton onClick={modalOpen}>Write</CommonButton>
                    )}
                  </Wrapper>
                </Wrapper>
                <Wrapper dr={`row`} ju={`flex-start`} margin={`10px 0 0`}>
                  {communityList && communityList.length === 0 ? (
                    <Wrapper>
                      <Empty description={`게시물이 없습니다.`} />
                    </Wrapper>
                  ) : (
                    communityList &&
                    communityList.map((data) => {
                      return (
                        <Box
                          onClick={() => moveLinkHandler(`/board/${data.id}`)}
                        >
                          <Text color={Theme.grey3_C} fontSize={`15px`}>
                            No.{data.id}
                          </Text>
                          <Text
                            margin={`10px 0 5px`}
                            width={`100%`}
                            isEllipsis
                            fontSize={`22px`}
                            fontWeight={`bold`}
                          >
                            {data.file && (
                              <>
                                <FileTextOutlined
                                  style={{ color: Theme.basicTheme_C }}
                                />
                                &nbsp;
                              </>
                            )}
                            {data.title}
                          </Text>
                          <Text>
                            {data.createdAt}
                            <SpanText fontSize={`12px`} margin={`0 5px`}>
                              |
                            </SpanText>
                            {data.username}(
                            {data.level === 1
                              ? `Student`
                              : data.level === 2
                              ? `Teacher`
                              : `admin`}
                            )
                          </Text>
                          <Wrapper
                            dr={`row`}
                            ju={`flex-end`}
                            margin={`45px 0 0`}
                          >
                            <EyeOutlined />
                            &nbsp;
                            {data.hit}
                            <SpanText fontSize={`12px`} margin={`0 5px`}>
                              |
                            </SpanText>
                            <CommentOutlined />
                            &nbsp;
                            {data.commentCnt}
                          </Wrapper>
                        </Box>
                      );
                    })
                  )}
                </Wrapper>
                <Wrapper margin={`20px 0 100px`}>
                  <Pagination
                    defaultCurrent={1}
                    current={parseInt(currentPage)}
                    onChange={(page) => otherPageCall(page)}
                    total={communityMaxLength * 9}
                  />
                </Wrapper>
              </Wrapper>
              <Wrapper dr={`row`} ju={`space-between`}>
                <Wrapper
                  shadow={`0 5px 15px rgba(0, 0, 0, 0.05)`}
                  padding={`20px 30px`}
                  dr={`row`}
                  width={width < 1000 ? `100%` : `63%`}
                >
                  <ATag
                    width={`auto`}
                    href={`https://www.instagram.com/ktalk_live/`}
                    target={`_blank`}
                    margin={width < 900 && `0 0 15px`}
                  >
                    <Image
                      alt="icon"
                      margin={`0 5px 0 0px`}
                      width={`50px`}
                      src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/main/icon_instagram.png`}
                    />
                    <Text fontSize={width < 900 ? `14px` : `18px`}>
                      https://www.instagram.com/ktalk_live/
                    </Text>
                  </ATag>
                  <Image
                    alt="icon"
                    margin={`0 15px`}
                    width={`1px`}
                    display={width < 900 ? `none` : `block`}
                    src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/main/dot-line.png`}
                  />
                  <ATag
                    width={`auto`}
                    href={`https://www.facebook.com/KtalkLive`}
                    target={`_blank`}
                  >
                    <Image
                      alt="icon"
                      margin={`0 5px 0 0px`}
                      width={`50px`}
                      src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/main/icon_facebook.png`}
                    />
                    <Text fontSize={width < 900 ? `14px` : `18px`}>
                      https://www.facebook.com/KtalkLive
                    </Text>
                  </ATag>
                </Wrapper>
                <Wrapper
                  shadow={`0 5px 15px rgba(0, 0, 0, 0.05)`}
                  padding={`20px 30px`}
                  dr={`row`}
                  width={width < 1000 ? `100%` : `35%`}
                >
                  <ATag width={`auto`} href={`mailto:jklc.ktalk@gmail.com`}>
                    <Image
                      alt="icon"
                      margin={`0 5px 0 15px`}
                      width={`50px`}
                      src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/main/icon_mail.png`}
                    />
                    <Wrapper dr={`row`}>
                      <Text
                        fontSize={
                          width < 900 ? (width < 700 ? `13px` : `14px`) : `18px`
                        }
                        fontWeight={`bold`}
                        margin={`0 5px 0 0`}
                      >
                        More infomation
                      </Text>
                      <Text fontSize={width < 900 ? `14px` : `18px`}>
                        jklc.ktalk@gmail.com
                      </Text>
                    </Wrapper>
                  </ATag>
                </Wrapper>
              </Wrapper>

              <Modal
                title={`Write`}
                visible={createModal}
                onOk={formFinishBoard}
                onCancel={modalClose}
                width={`900px`}
              >
                <Form
                  form={form}
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 20 }}
                  onFinish={onSubmitBoard}
                >
                  <Form.Item label={`Title`} name={`title`}>
                    <Input />
                  </Form.Item>
                  <Form.Item label={`Content`} name={`content`}>
                    <ToastEditorComponent6
                      action={getEditContent}
                      placeholder="Please write a comment."
                    />
                  </Form.Item>
                  {/* <Form.Item label={`Type`} name={`type`}>
                    <Select>
                      {communityTypes &&
                        communityTypes.map((data) => {
                          return (
                            <Select.Option value={data.id}>
                              {data.value}
                            </Select.Option>
                          );
                        })}
                    </Select>
                  </Form.Item> */}
                  {/* review 고정 */}
                  <Form.Item label={`File`}>
                    <input
                      type="file"
                      name="file"
                      hidden
                      ref={fileRef}
                      onChange={fileChangeHandler}
                    />

                    <Button
                      type={`primary`}
                      size={`small`}
                      onClick={fileUploadClick}
                    >
                      FILE UPLOAD
                    </Button>
                  </Form.Item>
                  {filePath && (
                    <Form.Item label={`이미지`}>
                      <Image width={`100px`} src={filePath} />
                    </Form.Item>
                  )}
                </Form>
              </Modal>
            </RsWrapper>
          </Wrapper>

          {currentFormToggle && modalView && (
            <Wrapper
              position={`fixed`}
              top={`100px`}
              left={`0`}
              zIndex={`100`}
              height={`calc(100vh - 100px)`}
              wrap={`nowrap`}
              overflow={`auto`}
              ju={`flex-start`}
            >
              <RsWrapper position={`relative`}>
                <Wrapper
                  al={`flex-end`}
                  position={`absolute`}
                  top={`40px`}
                  right={`0`}
                  fontSize={`30px`}
                  width={`auto`}
                  onClick={appModal}
                  cursor={`pointer`}
                >
                  <CloseCircleOutlined />
                </Wrapper>
              </RsWrapper>
              <Application />
            </Wrapper>
          )}
        </WholeWrapper>
      </ClientLayout>
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
      type: COMMUNITY_TYPE_LIST_REQUEST,
    });

    context.store.dispatch({
      type: APP_USE_LIST_REQUEST,
    });

    // 구현부 종료
    context.store.dispatch(END);
    console.log("🍀 SERVER SIDE PROPS END");
    await context.store.sagaTask.toPromise();
  }
);
export default Home;
