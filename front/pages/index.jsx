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
  ArrowRightOutlined,
  CloseCircleOutlined,
  CommentOutlined,
  EyeOutlined,
  FileTextOutlined,
  RightCircleFilled,
} from "@ant-design/icons";
import Application from "../components/application/Application";
import { APP_USE_LIST_REQUEST } from "../reducers/application";
import Tutors from "../components/main/Tutors";
import Link from "next/dist/client/link";

const WordbreakText = styled(Wrapper)`
  width: 100%;
  word-wrap: break-all;
  & img {
    max-width: 100%;
  }
`;

const Box = styled(Wrapper)`
  flex-direction: row;
  transition: 0.5s;
  width: calc(100% / 2 - 15px);
  padding: 20px;
  background: ${Theme.white_C};
  border-radius: 10px;
  cursor: pointer;
  margin: 0 30px 30px 0;

  &:hover {
    background-color: ${(props) => props.theme.subTheme14_C};
  }

  &:nth-child(2n) {
    margin: 0 0 30px;
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

  console.log(communityList);

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
        <WholeWrapper
          padding={width < 800 ? `82px 0` : `72px 0`}
          bgColor={Theme.lightGrey4_C}
        >
          <Wrapper height={`calc(100vh - 72px)`}>
            <RsWrapper
              dr={`row`}
              borderBottom={`2px solid ${Theme.darkGrey_C}`}
            >
              <Wrapper width={`50%`} al={`flex-start`}>
                <Text fontSize={`32px`} fontWeight={`bold`} margin={`0 0 15px`}>
                  Start learning Korean for Free!
                </Text>
                <Text fontSize={`15px`} fontWeight={`bold`}>
                  K-talk Live runs free online lessons every week all year
                  round.
                </Text>
                <Text fontSize={`15px`} fontWeight={`bold`}>
                  - 100-minute trial lessons for learners of all levels, every
                  week through Zoom
                </Text>
                <a href={`https://calendly.com/ktalklive`} target={`_blank`}>
                  <CommonButton
                    width={`200px`}
                    height={`60px`}
                    margin={`20px 0 60px`}
                  >
                    <Wrapper dr={`row`} fontSize={`18px`}>
                      Book here
                      <Wrapper
                        width={`30px`}
                        height={`30px`}
                        radius={`100%`}
                        bgColor={Theme.white_C}
                        color={Theme.basicTheme_C}
                        fontSize={`20px`}
                        margin={`0 0 0 10px`}
                      >
                        <ArrowRightOutlined />
                      </Wrapper>
                    </Wrapper>
                  </CommonButton>
                </a>
                <Text fontWeight={`600`}>Completely free of charge</Text>
                <Text fontWeight={`600`}>
                  Powered by Jeju Korean Language Center
                </Text>
              </Wrapper>
              <Wrapper width={`50%`}>
                <Image
                  alt="banner image"
                  src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/new_main-page/img_main-ban.png`}
                />
              </Wrapper>
            </RsWrapper>
          </Wrapper>

          <RsWrapper
            id="stu"
            borderBottom={`2px solid ${Theme.darkGrey_C}`}
            padding={`75px 0`}
          >
            <Wrapper dr={`row`} ju={`space-between`} margin={`0 0 30px`}>
              <Text fontSize={`18px`} fontWeight={`bold`}>
                Student's Review
              </Text>
              <Wrapper width={`auto`} dr={`row`} al={`flex-end`}>
                <Pagination
                  defaultCurrent={1}
                  current={parseInt(currentPage)}
                  onChange={(page) => otherPageCall(page)}
                  total={communityMaxLength * 9}
                />
                {me && <CommonButton onClick={modalOpen}>Write</CommonButton>}
              </Wrapper>
            </Wrapper>
            <Wrapper dr={`row`} ju={`space-bewteen`}>
              {communityList && communityList.length === 0 ? (
                <Wrapper>
                  <Empty description={`게시물이 없습니다.`} />
                </Wrapper>
              ) : (
                communityList &&
                communityList.map((data) => {
                  return (
                    <Box key={data.id}>
                      <Image
                        alt="thumbnail"
                        src={data.profileImage}
                        width={`186px`}
                        height={`196px`}
                        radius={`15px`}
                      />
                      <Wrapper
                        width={`calc(100% - 186px)`}
                        padding={`0 0 0 45px`}
                        al={`flex-start`}
                      >
                        <Text
                          fontSize={`18px`}
                          fontWeight={`bold`}
                          margin={`0 0 14px`}
                        >
                          {data.username}(
                          {data.level === 1
                            ? `Student`
                            : data.level === 2
                            ? `Teacher`
                            : `admin`}
                          )
                        </Text>
                        <Text fontSize={`11px`}>Hangeul</Text>
                        <Text fontSize={`11px`}>Speaks:{data.stuLanguage}</Text>
                        <Text
                          margin={`10px 0 5px`}
                          width={`100%`}
                          isEllipsis
                          fontSize={`13px`}
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
                        <Wrapper
                          al={`flex-start`}
                          ju={`flex-start`}
                          dangerouslySetInnerHTML={{
                            __html:
                              data.content.length < 300
                                ? data.content
                                : data.content.slice(0, 300) + "...",
                          }}
                        ></Wrapper>

                        <Text
                          isHover
                          color={Theme.basicTheme_C}
                          fontWeight={`bold`}
                          margin={`10px 0 0`}
                          onClick={() => moveLinkHandler(`/board/${data.id}`)}
                        >
                          Read More
                        </Text>
                        {/* <Text>
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
                        <Wrapper dr={`row`} ju={`flex-end`} margin={`45px 0 0`}>
                          <EyeOutlined />
                          &nbsp;
                          {data.hit}
                          <SpanText fontSize={`12px`} margin={`0 5px`}>
                            |
                          </SpanText>
                          <CommentOutlined />
                          &nbsp;
                          {data.commentCnt}
                        </Wrapper> */}
                      </Wrapper>
                    </Box>
                  );
                })
              )}
            </Wrapper>
          </RsWrapper>

          <RsWrapper dr={`row`} id="what">
            <Wrapper width={`50%`}>
              <Image
                alt="banner image"
                src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/new_main-page/img_intro_ban.png`}
              />
            </Wrapper>
            <Wrapper width={`50%`} al={`flex-end`}>
              <Text fontSize={`32px`} fontWeight={`bold`} margin={`0 0 15px`}>
                What is K-talk Live?
              </Text>
              <Text fontSize={`15px`} fontWeight={`bold`}>
                Come and meet our best of best native teachers!
              </Text>
              <Text fontSize={`15px`} fontWeight={`bold`}>
                K-talk Live offers the high-quality lectures same as the one we
                provide in our center.
              </Text>
              <Text margin={`25px 0 0`}>· Starts every Monday</Text>
              <Text>· Absolute beginners to Advanced learners</Text>
              <Text>· Not more than 6 learners in a class</Text>
              <Text>
                · US$144.- / 4 weeks (3 sessions a week, 1 session = 50 min)
              </Text>
              <Link href={`/application`}>
                <a>
                  <CommonButton
                    width={`200px`}
                    height={`60px`}
                    margin={`43px 0 0`}
                    kindOf={`delete`}
                  >
                    <Wrapper dr={`row`} fontSize={`18px`}>
                      apply here
                      <Wrapper
                        width={`30px`}
                        height={`30px`}
                        radius={`100%`}
                        bgColor={Theme.white_C}
                        color={Theme.red_C}
                        fontSize={`20px`}
                        margin={`0 0 0 10px`}
                      >
                        <ArrowRightOutlined />
                      </Wrapper>
                    </Wrapper>
                  </CommonButton>
                </a>
              </Link>
            </Wrapper>
          </RsWrapper>

          {!me && currentFormToggle && modalView && (
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

          <RsWrapper id="tutor">
            <Tutors />
          </RsWrapper>

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
