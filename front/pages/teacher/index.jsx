import React, { useEffect, useCallback, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import DaumPostCode from "react-daum-postcode";
import moment from "moment";

import Head from "next/head";
import { useRouter } from "next/router";

import axios from "axios";
import { END } from "redux-saga";
import wrapper from "../../store/configureStore";
import { SEO_LIST_REQUEST } from "../../reducers/seo";
import {
  LOAD_MY_INFO_REQUEST,
  ME_UPDATE_MODAL_TOGGLE,
  POSTCODE_MODAL_TOGGLE,
  USER_PROFILE_IMAGE_PATH,
  USER_PROFILE_UPLOAD_REQUEST,
  USER_UPDATE_REQUEST,
} from "../../reducers/user";

import {
  LECTURE_TEACHER_LIST_REQUEST,
  LECTURE_LINK_UPDATE_REQUEST,
} from "../../reducers/lecture";

import {
  Calendar,
  message,
  Pagination,
  Modal,
  Form,
  Empty,
  Input,
  Select,
} from "antd";

import { CloseOutlined } from "@ant-design/icons";

import styled from "styled-components";
import useWidth from "../../hooks/useWidth";
import ClientLayout from "../../components/ClientLayout";
import {
  RsWrapper,
  WholeWrapper,
  Wrapper,
  Image,
  Text,
  SpanText,
  TextInput,
  CommonButton,
} from "../../components/commonComponents";
import Theme from "../../components/Theme";
import { NOTICE_LIST_REQUEST } from "../../reducers/notice";
import {
  MESSAGE_ALL_LIST_REQUEST,
  MESSAGE_CREATE_REQUEST,
  MESSAGE_USER_LIST_REQUEST,
} from "../../reducers/message";
import { saveAs } from "file-saver";
import {
  BOOK_ALL_LIST_REQUEST,
  BOOK_LECTURE_CREATE_REQUEST,
  BOOK_LECTURE_LIST_REQUEST,
} from "../../reducers/book";

const PROFILE_WIDTH = `184`;
const PROFILE_HEIGHT = `190`;

const Close = styled(CloseOutlined)`
  & svg {
    width: 200px;
    height: 250px;
  }
`;

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

const Button = styled.button`
  width: calc(100% / 4 - 30px);
  color: ${Theme.black_3C};
  font-size: 18px;
  margin: 0 30px 0 0;
  height: 70px;
  border: none;
  background-color: ${Theme.white_C};
  box-shadow: 0px 5px 15px rgb(0, 0, 0, 0.16);
  cursor: pointer;

  &:hover {
    transition: all 0.2s;
    border: 1px solid ${Theme.basicTheme_C};
    background-color: ${Theme.basicTheme_C};
    color: ${Theme.white_C};
  }

  @media (max-width: 700px) {
    font-size: 14px;
    width: calc(100% / 2 - 10px);
    margin: 10px 10px 0 0;
  }
`;

const CustomText = styled(Text)`
  font-size: 18px;
  font-weight: Bold;
  color: ${Theme.black_2C};

  &::after {
    content: "|";
    padding: 0 10px;
    color: ${Theme.grey_C};
  }

  @media (max-width: 700px) {
    font-size: 14px;
    &::after {
      content: "|";
      padding: 0 5px;
      color: ${Theme.grey_C};
    }
  }
`;

const CustomText2 = styled(Text)`
  font-size: 18px;
  font-weight: ${(props) => props.fontWeight || `Bold`};
  color: ${Theme.black_2C};
  margin: 0;

  &::after {
    content: "";
    margin: ${(props) => props.margin || `0 20px`};
    border-right: 1px dashed ${Theme.grey_C};
  }

  @media (max-width: 1400px) {
    &::after {
      border-right: ${(props) => props.borderRightBool && `0px`};
    }
  }

  @media (max-width: 700px) {
    font-size: 14px;
    &::after {
      margin: ${(props) => props.margin || `0 5px`};
    }
  }
`;

const CustomText3 = styled(Text)`
  font-size: 18px;
  font-weight: Bold;

  &::before {
    content: "";
    margin: 0 20px 0 0;
    border-right: 1px dashed ${Theme.grey_C};
    color: ${Theme.grey_C};
  }

  @media (max-width: 700px) {
    font-size: 14px;
    &::before {
      margin: 0 10px;
    }
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

const CustomForm = styled(Form)`
  width: 100%;

  & .ant-form-item {
    width: 100%;
  }
`;

const CusotmInput = styled(TextInput)`
  border: none;
  box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.16);
  border-radius: 5px;

  &::placeholder {
    color: ${Theme.grey2_C};
  }

  &:focus {
    border: 1px solid ${Theme.basicTheme_C};
  }
`;

const ProfileWrapper = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ProfileImage = styled.img`
  width: 184px;
  height: 190px;
  object-fit: cover;
  border-radius: 5px;
`;
const UploadWrapper = styled.div`
  width: 184px;
  margin: 5px 0;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`;

const GuideWrapper = styled.section`
  width: 100%;
  padding: 5px;
  margin-bottom: 10px;

  border-radius: 3px;
  background-color: #eeeeee;
`;

const GuideText = styled.div`
  font-size: 13.5px;
  color: #5e5e5e;
  font-weight: 700;
`;

const PreviewGuide = styled.p`
  font-weight: 700;
  color: #b1b1b1;
`;

const WordbreakText = styled(Text)`
  width: 100%;
  word-wrap: break-all;
`;

const Index = () => {
  ////// GLOBAL STATE //////
  const { seo_keywords, seo_desc, seo_ogImage, seo_title } = useSelector(
    (state) => state.seo
  );

  const {
    me,
    meUpdateModal,

    userProfilePath,
    //
    st_userProfileUploadLoading,
    st_userProfileUploadDone,
    st_userProfileUploadError,
    //
    st_userUserUpdateDone,
    st_userUserUpdateError,
  } = useSelector((state) => state.user);

  const {
    lectureTeacherList,
    st_lectureTeacherListDone,
    st_lectureTeacherListError,

    st_lectureLinkUpdateDone,
    st_lectureLinkUpdateError,
  } = useSelector((state) => state.lecture);

  const { noticeList, noticeLastPage, st_noticeListDone, st_noticeListError } =
    useSelector((state) => state.notice);

  const {
    messageUserList,
    messageUserLastPage,
    st_messageUserListDone,
    st_messageUserListError,

    st_messageCreateDone,
    st_messageCreateError,

    messageAllList,
    messageAllLastPage,
    st_messageAllListDone,
    st_messageAllListError,
  } = useSelector((state) => state.message);

  const {
    bookAllList,
    st_bookAllListDone,
    st_bookAllListError,
    st_bookLectureCreateDone,
    st_bookLectureCreateError,
  } = useSelector((state) => state.book);

  ////// HOOKS //////

  const width = useWidth();
  const router = useRouter();
  const dispatch = useDispatch();

  const [updateForm] = Form.useForm();
  const [zoomLinkForm] = Form.useForm();
  const [answerform] = Form.useForm();
  const [messageSendform] = Form.useForm();
  const [textBookUploadform] = Form.useForm();

  const [currentPage1, setCurrentPage1] = useState(1);
  const [currentPage2, setCurrentPage2] = useState(1);
  const [currentPage3, setCurrentPage3] = useState(1);
  const [currentPage4, setCurrentPage4] = useState(1);

  const [zoomLinkToggle, setZoomLinkToggle] = useState(false);
  const [messageViewToggle, setMessageViewToggle] = useState(false);
  const [messageAnswerModal, setMessageAnswerModal] = useState(false);
  const [messageSendModal, setMessageSendModal] = useState(false);

  const [noticeViewModal, setNoticeViewModal] = useState(false);
  const [noticeViewDatum, setNoticeViewDatum] = useState(null);

  const [textbookToggle, settextbookToggle] = useState(false);
  const [textbookData, setTextbookData] = useState("");

  const [selectValue, setSelectValue] = useState("");

  const [thumbnail, setThumbnail] = useState("");

  const [sendMessageType, setSendMessageType] = useState(1);

  const [lectureId, setLectureId] = useState("");

  const imageInput = useRef();

  const [messageDatum, setMessageDatum] = useState();

  const textbookModalHandler = useCallback((data) => {
    settextbookToggle(true);
    setTextbookData(data);
  }, []);
  ////// REDUX //////
  ////// USEEFFECT //////

  useEffect(() => {
    dispatch({
      type: MESSAGE_ALL_LIST_REQUEST,
    });
  }, []);

  useEffect(() => {
    if (st_bookAllListDone) {
    }
  }, [st_bookAllListDone]);

  useEffect(() => {
    if (st_bookAllListError) {
      return message.error(st_bookAllListError);
    }
  }, [st_bookAllListError]);

  useEffect(() => {
    if (st_bookLectureCreateError) {
      return message.error(st_bookLectureCreateError);
    }
  }, [st_bookLectureCreateError]);

  useEffect(() => {
    if (st_bookLectureCreateDone) {
      onReset();
      return message.success("교재 등록이 완료되었습니다.");
    }
  }, [st_bookLectureCreateDone]);

  useEffect(() => {
    dispatch({
      type: LECTURE_TEACHER_LIST_REQUEST,
      data: {
        TeacherId: me && me.id,
      },
    });
  }, [me]);

  useEffect(() => {
    if (!me) {
      message.error("로그인 후 이용해주세요.");
      return router.push(`/`);
    } else if (me.level !== 2) {
      message.error("강사가 아닙니다.");
      return router.push(`/`);
    }
  }, [me]);

  useEffect(() => {
    if (st_userProfileUploadDone) {
      return message.success("프로필 사진이 업로드되었습니다.");
    }
  }, [st_userProfileUploadDone]);

  useEffect(() => {
    if (st_userUserUpdateDone) {
      dispatch({
        type: LOAD_MY_INFO_REQUEST,
      });

      updateForm.resetFields();
      dispatch({
        type: USER_PROFILE_IMAGE_PATH,
        data: null,
      });

      dispatch({
        type: ME_UPDATE_MODAL_TOGGLE,
      });

      return message.success("회원 정보가 수정되었습니다.");
    }
  }, [st_userUserUpdateDone]);

  useEffect(() => {
    if (st_userProfileUploadError) {
      return message.error(st_userProfileUploadError);
    }
  }, [st_userProfileUploadError]);

  useEffect(() => {
    if (st_userUserUpdateError) {
      return message.error(st_userUserUpdateError);
    }
  }, [st_userUserUpdateError]);

  useEffect(() => {
    if (meUpdateModal) {
      updateForm.setFieldsValue({
        mobile: me.mobile,
        postNum: me.postNum,
        address: me.address,
        detailAddress: me.detailAddress,
        teaLanguage: me.teaLanguage,
        teaCountry: me.teaCountry,
        bankNo: me.bankNo,
        bankName: me.bankName,
        birth: moment(me.birth),
      });

      if (me.profileImage)
        dispatch({
          type: USER_PROFILE_IMAGE_PATH,
          data: me.profileImage,
        });
    } else {
      updateForm.resetFields();
      dispatch({
        type: USER_PROFILE_IMAGE_PATH,
        data: null,
      });
    }
  }, [meUpdateModal]);

  useEffect(() => {
    if (st_messageUserListError) {
      return message.error(st_messageUserListError);
    }
  }, [st_messageUserListError]);

  useEffect(() => {
    dispatch({
      type: MESSAGE_USER_LIST_REQUEST,
      data: {
        page: 1,
      },
    });
  }, []);

  useEffect(() => {
    if (st_lectureLinkUpdateDone) {
      zoomLinkModalToggle();

      dispatch({
        type: LECTURE_TEACHER_LIST_REQUEST,
        data: {
          TeacherId: me && me.id,
        },
      });

      return message.success("줌 링크를 등록하였습니다.");
    }
  }, [st_lectureLinkUpdateDone]);

  useEffect(() => {
    if (st_lectureLinkUpdateError) {
      return message.error(st_lectureLinkUpdateError);
    }
  }, [st_lectureLinkUpdateError]);

  useEffect(() => {
    if (st_noticeListDone) {
    }
  }, [st_noticeListDone]);

  useEffect(() => {
    if (st_noticeListError) {
      return message.error(st_noticeListError);
    }
  }, [st_noticeListError]);

  useEffect(() => {
    if (st_lectureTeacherListError) {
      return message.error(st_lectureTeacherListError);
    }
  }, [st_lectureTeacherListError]);

  useEffect(() => {
    if (st_messageCreateError) {
      return message.error(st_messageCreateError);
    }
  }, [st_messageCreateError]);

  useEffect(() => {
    if (st_messageCreateDone) {
      onReset();
      return message.success("쪽지를 보냈습니다.");
    }
  }, [st_messageCreateDone]);

  ////// TOGGLE //////

  const meUpdateModalToggle = useCallback(() => {
    dispatch({
      type: ME_UPDATE_MODAL_TOGGLE,
    });
  }, [meUpdateModal]);

  const zoomLinkModalToggle = useCallback(
    (data) => {
      setZoomLinkToggle((prev) => !prev);

      onFillZoomLink(data);
      setLectureId(data);
    },
    [zoomLinkToggle]
  );

  const messageAnswerToggleHanlder = useCallback((e) => {
    setMessageAnswerModal(true);
  }, []);

  ////// HANDLER //////

  const receiveSelectHandler = useCallback(async (value, bookData) => {
    let thumbnail = await bookData.filter((data, idx) => {
      if (value === data.id) {
        return true;
      }
    });

    let save = await thumbnail.map((data) => data.thumbnail);

    setThumbnail(save);
    setSelectValue(value);
  }, []);

  const onClickNoticeHandler = useCallback((data) => {
    setNoticeViewDatum(data);
    setNoticeViewModal(true);
  }, []);

  const onReset = useCallback(() => {
    answerform.resetFields();
    textBookUploadform.resetFields();
    settextbookToggle(false);

    setMessageAnswerModal(false);
    setMessageViewToggle(false);

    setNoticeViewModal(false);

    setThumbnail("");
    setNoticeViewDatum("");
    setTextbookData("");
  }, []);

  const clickImageUpload = useCallback(() => {
    imageInput.current.click();
  }, []);

  const onChangeImages = useCallback((e) => {
    const formData = new FormData();

    [].forEach.call(e.target.files, (file) => {
      formData.append("image", file);
    });

    dispatch({
      type: USER_PROFILE_UPLOAD_REQUEST,
      data: formData,
    });
  }, []);

  const meUpdateHandler = useCallback(
    (data) => {
      if (!userProfilePath || userProfilePath.trim().length === 0) {
        return message.error("프로필 사진을 업로드해주세요");
      }

      dispatch({
        type: USER_UPDATE_REQUEST,
        data: {
          profileImage: userProfilePath,
          mobile: data.mobile,
          detailAddress: data.detailAddress,
          address: data.address,
          teaLanguage: data.teaLanguage,
          teaCountry: data.teaCountry,
          bankNo: data.bankNo,
          bankName: data.bankName,
          birth: data.birth.format("YYYY-MM-DD"),
        },
      });
    },
    [userProfilePath]
  );

  const moveLinkHandler = useCallback((link) => {
    router.push(link);
  }, []);

  const onChangeNoticePage = useCallback((page) => {
    setCurrentPage1(page);

    dispatch({
      type: NOTICE_LIST_REQUEST,
      data: {
        page,
      },
    });
  }, []);

  const onChangeLecturePage = useCallback((page) => {
    setCurrentPage2(page);

    dispatch({
      type: NOTICE_LIST_REQUEST,
      data: {
        page,
      },
    });
  }, []);

  const onChangeMessagePage = useCallback((page) => {
    setCurrentPage3(page);

    dispatch({
      type: MESSAGE_USER_LIST_REQUEST,
      data: {
        page,
      },
    });
  }, []);

  const zoomLinkFinish = useCallback(
    (data) => {
      dispatch({
        type: LECTURE_LINK_UPDATE_REQUEST,
        data: {
          id: lectureId.id,
          zoomLink: data.zoomLink,
          zoomPass: data.zoomPass,
        },
      });
    },
    [lectureId]
  );

  const onFillZoomLink = (data) => {
    if (data) {
      zoomLinkForm.setFieldsValue({
        zoomLink: data.zoomLink,
        zoomPass: data.zoomPass,
      });
    }
  };

  const messageViewModalHanlder = useCallback((data) => {
    setMessageViewToggle(true);

    setMessageDatum(data);
  }, []);

  const answerFinishHandler = useCallback(
    (data, messageData) => {
      if (messageData) {
        dispatch({
          type: MESSAGE_CREATE_REQUEST,
          data: {
            title: data.messageTitle,
            author: me.userId,
            senderId: messageData.receiverId,
            receiverId: messageData.senderId,
            content: data.messageContent,
            level: me.level,
          },
        });
      }
    },

    [me]
  );
  const sendMessageTypeHandler = useCallback((num) => {
    setSendMessageType(num);
  }, []);

  const sendMessageFinishHandler = useCallback(
    (data) => {
      dispatch({
        type: MESSAGE_CREATE_REQUEST,
        data: {
          title: data.title,
          author: me.userId,
          senderId: me.id,
          receiverId: lectureId,
          content: data.content,
          level: me.level,
        },
      });
    },
    [me, lectureId]
  );

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

  const textBookFinishHandler = useCallback(
    (value) => {
      dispatch({
        type: BOOK_LECTURE_CREATE_REQUEST,
        data: {
          BookId: value.bookId,
          LectureId: textbookData.id,
        },
      });
    },

    [textbookData]
  );

  const allmessageChangePage = useCallback((page) => {
    dispatch({
      type: MESSAGE_ALL_LIST_REQUEST,
      data: {
        page,
      },
    });
  }, []);

  ////// DATAVIEW //////

  return (
    <>
      <Head>
        <title>
          {seo_title.length < 1 ? "K-Talk Live" : seo_title[0].content}
        </title>

        <meta
          name="subject"
          content={seo_title.length < 1 ? "K-Talk Live" : seo_title[0].content}
        />
        <meta
          name="title"
          content={seo_title.length < 1 ? "K-Talk Live" : seo_title[0].content}
        />
        <meta name="keywords" content={seo_keywords} />
        <meta
          name="description"
          content={
            seo_desc.length < 1
              ? "REAL-TIME ONLINE KOREAN LESSONS"
              : seo_desc[0].content
          }
        />
        {/* <!-- OG tag  --> */}
        <meta
          property="og:title"
          content={seo_title.length < 1 ? "K-Talk Live" : seo_title[0].content}
        />
        <meta
          property="og:site_name"
          content={seo_title.length < 1 ? "K-Talk Live" : seo_title[0].content}
        />
        <meta
          property="og:description"
          content={
            seo_desc.length < 1
              ? "REAL-TIME ONLINE KOREAN LESSONS"
              : seo_desc[0].content
          }
        />
        <meta property="og:keywords" content={seo_keywords} />
        <meta
          property="og:image"
          content={seo_ogImage.length < 1 ? "" : seo_ogImage[0].content}
        />
      </Head>

      <ClientLayout>
        <WholeWrapper margin={`100px 0 0`} bgColor={Theme.subTheme_C}>
          <RsWrapper>
            <Wrapper
              margin={width < 700 ? `30px 0` : `60px 0`}
              dr={`row`}
              ju={`space-between`}>
              <Wrapper width={`auto`} dr={`row`} ju={`flex-start`}>
                <Wrapper width={`auto`} padding={`9px`} bgColor={Theme.white_C}>
                  <Image
                    width={width < 700 ? `65px` : `75px`}
                    height={width < 700 ? `65px` : `75px`}
                    radius={`100px`}
                    src={
                      me && me.profileImage
                        ? me.profileImage
                        : "https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/common/img_default-profile.png"
                    }
                    alt="teacher_thumbnail"
                  />
                </Wrapper>
                <Text
                  fontSize={width < 700 ? `20px` : `28px`}
                  fontWeight={`bold`}
                  padding={`0 0 0 15px`}>
                  안녕하세요,&nbsp;
                  <SpanText color={Theme.basicTheme_C}>
                    {me && me.userId}
                  </SpanText>
                  님!
                </Text>
              </Wrapper>
              <Wrapper width={`auto`}>
                <CommonButton radius={`5px`} onClick={meUpdateModalToggle}>
                  회원정보 수정
                </CommonButton>
              </Wrapper>
            </Wrapper>

            <Wrapper al={`flex-start`}>
              <Text
                color={Theme.black_2C}
                fontSize={width < 700 ? `18px` : `22px`}
                fontWeight={`Bold`}
                margin={`0 0 20px`}>
                공지사항
              </Text>

              <Wrapper shadow={`0px 5px 15px rgb(0,0,0,0.16)`} radius={`10px`}>
                <Wrapper dr={`row`} textAlign={`center`} padding={`20px 0`}>
                  <Text
                    fontSize={width < 700 ? `14px` : `18px`}
                    fontWeight={`Bold`}
                    width={width < 800 ? `15%` : `10%`}>
                    번호
                  </Text>
                  <Text
                    fontSize={width < 700 ? `14px` : `18px`}
                    fontWeight={`Bold`}
                    width={width < 800 ? `45%` : `70%`}>
                    제목
                  </Text>
                  <Text
                    fontSize={width < 700 ? `14px` : `18px`}
                    fontWeight={`Bold`}
                    width={width < 800 ? `15%` : `10%`}>
                    작성자
                  </Text>

                  <Text
                    fontSize={width < 700 ? `14px` : `18px`}
                    fontWeight={`Bold`}
                    width={width < 800 ? `25%` : `10%`}>
                    날짜
                  </Text>
                </Wrapper>

                {noticeList && noticeList.length === 0 ? (
                  <Wrapper margin={`30px 0`}>
                    <Empty description="조회된 공지사항 리스트가 없습니다." />
                  </Wrapper>
                ) : (
                  noticeList &&
                  noticeList.map((data, idx) => {
                    return (
                      <Wrapper
                        key={data.id}
                        dr={`row`}
                        textAlign={`center`}
                        ju={`flex-start`}
                        padding={`25px 0 20px`}
                        cursor={`pointer`}
                        bgColor={idx % 2 === 0 && Theme.lightGrey_C}
                        onClick={() => onClickNoticeHandler(data)}>
                        <Text
                          fontSize={width < 700 ? `14px` : `16px`}
                          width={width < 800 ? `15%` : `10%`}
                          wordBreak={`break-word`}>
                          {data.id}
                        </Text>
                        <Text
                          fontSize={width < 700 ? `14px` : `16px`}
                          width={width < 800 ? `45%` : `70%`}
                          textAlign={`left`}>
                          {data.title}
                        </Text>
                        <Text
                          fontSize={width < 700 ? `14px` : `16px`}
                          width={width < 800 ? `15%` : `10%`}>
                          {data.author}
                        </Text>
                        <Text
                          fontSize={width < 700 ? `14px` : `16px`}
                          width={width < 800 ? `25%` : `10%`}>
                          {moment(data.createdAt, "YYYY/MM/DD").format(
                            "YYYY/MM/DD"
                          )}
                        </Text>
                      </Wrapper>
                    );
                  })
                )}
              </Wrapper>

              <Wrapper margin={`65px 0 85px`}>
                <CustomPage
                  current={currentPage1}
                  total={noticeLastPage * 10}
                  onChange={(page) => onChangeNoticePage(page)}></CustomPage>
              </Wrapper>
            </Wrapper>

            <Wrapper al={`flex-start`}>
              <Text
                color={Theme.black_2C}
                fontSize={width < 700 ? `18px` : `22px`}
                fontWeight={`Bold`}
                margin={`0 0 20px`}>
                내 수업
              </Text>

              {lectureTeacherList && lectureTeacherList.length === 0 ? (
                <Wrapper margin={`30px 0`}>
                  <Empty description="조회된 수업 리스트가 없습니다." />
                </Wrapper>
              ) : (
                lectureTeacherList &&
                lectureTeacherList.map((data, idx) => {
                  return (
                    <Wrapper
                      key={data.id}
                      dr={`row`}
                      ju={`flex-start`}
                      al={`flex-start`}
                      shadow={`0px 5px 15px rgb(0,0,0,0.16)`}
                      padding={width < 700 ? `15px 10px 10px` : `35px 30px`}
                      margin={
                        idx === lectureTeacherList.length - 1 ? `0` : "0 0 20px"
                      }
                      radius={`10px`}>
                      <Wrapper
                        width={
                          width < 1280 ? (width < 800 ? `100%` : `60%`) : `37%`
                        }
                        dr={`row`}
                        ju={`flex-start`}
                        al={`flex-start`}>
                        <Wrapper
                          width={`auto`}
                          padding={width < 700 ? `0` : `5px`}
                          margin={`0 10px 0 0`}>
                          <Image
                            width={`22px`}
                            height={`22px`}
                            src="https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/common/icon_clock.png"
                            alt="clock_icon"
                          />
                        </Wrapper>

                        <Wrapper
                          width={`calc(100% - 42px - 100px)`}
                          dr={`row`}
                          ju={`flex-start`}>
                          <Text
                            fontSize={width < 700 ? `14px` : `18px`}
                            fontWeight={`bold`}
                            lineHeight={`1.22`}>
                            {data.day}
                            &nbsp;&nbsp;|&nbsp;&nbsp;
                            {data.time}
                          </Text>
                          <Wrapper
                            width={`1px`}
                            height={width < 800 ? `20px` : `34px`}
                            borderLeft={`1px dashed ${Theme.grey_C}`}
                            margin={
                              width < 1350
                                ? width < 700
                                  ? `0 4px`
                                  : `0 10px`
                                : `0 20px`
                            }
                          />
                        </Wrapper>
                      </Wrapper>

                      <Wrapper
                        dr={`row`}
                        ju={`space-between`}
                        width={width < 1400 ? `100%` : `62%`}
                        margin={width < 700 ? `10px 0 0 0` : `0`}>
                        <Wrapper dr={`row`} width={`auto`}>
                          <Image
                            width={`22px`}
                            height={`22px`}
                            src="https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/common/icon_calender_y.png"
                            alt="calender_icon"
                            margin={`0 5px 0 0`}
                          />
                          <CustomText2
                            color={Theme.black_2C}
                            fontWeight={`normal`}
                            width={width < 700 ? `auto` : `140px`}>
                            {moment(data.startDate, "YYYY/MM/DD").format(
                              "YYYY/MM/DD"
                            )}
                          </CustomText2>

                          <Image
                            width={`22px`}
                            height={`22px`}
                            src="https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/common/icon_number.png"
                            alt="calender_icon"
                            margin={`0 5px 0 0`}
                          />
                          <Text
                            color={Theme.black_2C}
                            fontSize={width < 700 ? `12px` : `18px`}
                            width={width < 700 ? `auto` : `140px`}
                            margin={`0 10px 0 0`}>
                            {`NO.${data.id}`}
                          </Text>

                          <Wrapper width={`auto`} fontWeight={`bold`}>
                            <Text
                              cursor={`pointer`}
                              color={Theme.black_2C}
                              fontSize={width < 700 ? `12px` : `18px`}
                              width={width < 700 ? `auto` : `140px`}
                              onClick={() => textbookModalHandler(data)}>
                              교재 등록
                            </Text>
                          </Wrapper>
                        </Wrapper>

                        <Wrapper width={`auto`}>
                          <CustomText3
                            onClick={() =>
                              moveLinkHandler(`/teacher/${data.id}`)
                            }
                            color={Theme.black_2C}
                            cursor={`pointer`}>
                            상세 수업 보러가기
                          </CustomText3>
                        </Wrapper>
                      </Wrapper>
                    </Wrapper>
                  );
                })
              )}

              <Wrapper margin={`65px 0 0`}>
                <CustomPage
                  current={currentPage2}
                  total={noticeLastPage * 10}
                  onChange={(page) => onChangeLecturePage(page)}></CustomPage>
              </Wrapper>
            </Wrapper>

            <Wrapper margin={`110px 0`}>
              <CustomPage
                current={currentPage3}
                total={messageUserLastPage * 10}
                onChange={(page) => onChangeMessagePage(page)}></CustomPage>
            </Wrapper>

            <Wrapper al={`flex-start`} margin={`86px 0 20px`}>
              <Text
                color={Theme.black_2C}
                fontSize={width < 700 ? `18px` : `22px`}
                fontWeight={`Bold`}>
                강사 전체 쪽지
              </Text>
            </Wrapper>

            <Wrapper shadow={`0px 5px 15px rgb(0,0,0,0.16)`} radius={`10px`}>
              <Wrapper dr={`row`} textAlign={`center`} padding={`20px 0`}>
                <Text
                  fontSize={width < 700 ? `14px` : `18px`}
                  fontWeight={`Bold`}
                  width={`15%`}>
                  글 번호
                </Text>
                <Text
                  fontSize={width < 700 ? `14px` : `18px`}
                  fontWeight={`Bold`}
                  width={`calc(100% - 15% - 15% - 25%)`}>
                  제목
                </Text>

                <Text
                  fontSize={width < 700 ? `14px` : `18px`}
                  fontWeight={`Bold`}
                  width={`15%`}>
                  작성자
                </Text>

                <Text
                  fontSize={width < 700 ? `14px` : `18px`}
                  fontWeight={`Bold`}
                  width={`25%`}>
                  날짜
                </Text>
              </Wrapper>

              {messageAllList && messageAllList.length === 0 ? (
                <Wrapper margin={`50px 0`}>
                  <Empty description="조회된 데이터가 없습니다." />
                </Wrapper>
              ) : (
                messageAllList &&
                messageAllList.map((data2, idx) => {
                  return (
                    <Wrapper
                      key={data2.id}
                      dr={`row`}
                      textAlign={`center`}
                      padding={`25px 0 20px`}
                      cursor={`pointer`}
                      bgColor={idx % 2 === 0 && Theme.lightGrey_C}
                      onClick={() => messageViewModalHanlder(data2)}>
                      <Text
                        fontSize={width < 700 ? `14px` : `16px`}
                        width={`15%`}>
                        {data2.id}
                      </Text>
                      <Text
                        fontSize={width < 700 ? `14px` : `16px`}
                        width={`calc(100% - 15% - 15% - 25%)`}
                        textAlign={`left`}>
                        {data2.title}
                      </Text>

                      <Text
                        fontSize={width < 700 ? `14px` : `16px`}
                        width={`15%`}>
                        {data2.author}
                      </Text>
                      <Text
                        fontSize={width < 700 ? `14px` : `16px`}
                        width={`25%`}>
                        {moment(data2.createdAt, "YYYY/MM/DD").format(
                          "YYYY/MM/DD"
                        )}
                      </Text>
                    </Wrapper>
                  );
                })
              )}
            </Wrapper>

            <Wrapper margin={`60px 0`}>
              <CustomPage
                size="small"
                current={currentPage4}
                tota={messageAllLastPage * 10}
                onChange={(page) => allmessageChangePage(page)}
              />
            </Wrapper>

            <Wrapper al={`flex-start`}>
              <Text
                color={Theme.black_2C}
                fontSize={width < 700 ? `18px` : `22px`}
                fontWeight={`Bold`}
                margin={`0 0 20px 0`}>
                개인 쪽지함
              </Text>
            </Wrapper>

            <Wrapper shadow={`0px 5px 15px rgb(0,0,0,0.16)`} radius={`10px`}>
              <Wrapper dr={`row`} textAlign={`center`} padding={`20px 0`}>
                <Text
                  fontSize={width < 700 ? `14px` : `18px`}
                  fontWeight={`Bold`}
                  width={`15%`}>
                  글 번호
                </Text>
                <Text
                  fontSize={width < 700 ? `14px` : `18px`}
                  fontWeight={`Bold`}
                  width={`calc(100% - 15% - 15% - 25%)`}>
                  제목
                </Text>

                <Text
                  fontSize={width < 700 ? `14px` : `18px`}
                  fontWeight={`Bold`}
                  width={`15%`}>
                  작성자
                </Text>

                <Text
                  fontSize={width < 700 ? `14px` : `18px`}
                  fontWeight={`Bold`}
                  width={`25%`}>
                  날짜
                </Text>
              </Wrapper>

              {messageUserList && messageUserList.length === 0 ? (
                <Wrapper margin={`50px 0`}>
                  <Empty description="조회된 데이터가 없습니다." />
                </Wrapper>
              ) : (
                messageUserList &&
                messageUserList.map((data2, idx) => {
                  return (
                    <Wrapper
                      key={data2.id}
                      dr={`row`}
                      textAlign={`center`}
                      padding={`25px 0 20px`}
                      cursor={`pointer`}
                      bgColor={idx % 2 === 0 && Theme.lightGrey_C}
                      onClick={() => messageViewModalHanlder(data2)}>
                      <Text
                        fontSize={width < 700 ? `14px` : `16px`}
                        width={`15%`}>
                        {data2.id}
                      </Text>
                      <Text
                        fontSize={width < 700 ? `14px` : `16px`}
                        width={`calc(100% - 15% - 15% - 25%)`}
                        textAlign={`left`}>
                        {data2.title}
                      </Text>

                      <Text
                        fontSize={width < 700 ? `14px` : `16px`}
                        width={`15%`}>
                        {data2.author}
                      </Text>
                      <Text
                        fontSize={width < 700 ? `14px` : `16px`}
                        width={`25%`}>
                        {moment(data2.createdAt, "YYYY/MM/DD").format(
                          "YYYY/MM/DD"
                        )}
                      </Text>
                    </Wrapper>
                  );
                })
              )}
            </Wrapper>

            <Wrapper
              dr={`row`}
              margin={`100px 0`}
              ju={width < 700 ? `flex-start` : "center"}>
              <Button onClick={() => moveLinkHandler(`/textbook`)}>
                교재 찾기 / 올리기
              </Button>
              <Button>복무 규정</Button>
              <Button>강사 계약서</Button>
              <Button>강의 산정료</Button>
            </Wrapper>
          </RsWrapper>

          <CustomModal
            width={`700px`}
            visible={meUpdateModal}
            footer={null}
            onCancel={meUpdateModalToggle}>
            <Text fontSize={`22px`} fontWeight={`bold`} margin={`0 0 24px`}>
              회원정보 수정
            </Text>

            <ProfileWrapper>
              <GuideWrapper>
                <GuideText>
                  프로필 이미지 사이즈는 가로 {PROFILE_WIDTH}px 과 세로
                  {PROFILE_HEIGHT}px을 기준으로 합니다.
                </GuideText>
                <GuideText>
                  이미지 사이즈가 상이할 경우 화면에 올바르지 않게 보일 수
                  있으니 이미지 사이즈를 확인해주세요.
                </GuideText>
              </GuideWrapper>

              <ProfileImage
                src={
                  userProfilePath
                    ? `${userProfilePath}`
                    : `https://via.placeholder.com/${PROFILE_WIDTH}x${PROFILE_HEIGHT}`
                }
                alt="main_GALLEY_image"
              />
              <PreviewGuide>
                {userProfilePath && `이미지 미리보기 입니다.`}
              </PreviewGuide>

              <UploadWrapper>
                <input
                  type="file"
                  name="image"
                  accept=".png, .jpg"
                  // multiple
                  hidden
                  ref={imageInput}
                  onChange={onChangeImages}
                />
                <CommonButton
                  type="primary"
                  onClick={clickImageUpload}
                  loading={st_userProfileUploadLoading}
                  radius={`5px`}>
                  UPLOAD
                </CommonButton>
              </UploadWrapper>
            </ProfileWrapper>

            <CustomForm form={updateForm} onFinish={meUpdateHandler}>
              <Text fontSize={`18px`} fontWeight={`bold`}>
                전화번호
              </Text>
              <Form.Item
                name="mobile"
                rules={[
                  { required: true, message: "전화번호를 입력해주세요." },
                ]}>
                <CusotmInput
                  width={`100%`}
                  placeholder="전화번호를 입력해주세요."
                />
              </Form.Item>

              <Text fontSize={`18px`} fontWeight={`bold`}>
                주소
              </Text>
              <Form.Item
                name="address"
                rules={[{ required: true, message: "주소를 입력해주세요." }]}>
                <CusotmInput width={`100%`} />
              </Form.Item>

              <Text fontSize={`18px`} fontWeight={`bold`}>
                상세 주소
              </Text>
              <Form.Item
                name="detailAddress"
                rules={[
                  { required: true, message: "상세주소를 입력해주세요." },
                ]}>
                <CusotmInput width={`100%`} />
              </Form.Item>

              <Text fontSize={`18px`} fontWeight={`bold`}>
                강사 언어
              </Text>
              <Form.Item
                name="teaLanguage"
                rules={[
                  { required: true, message: "강사 언어를 입력해주세요." },
                ]}>
                <CusotmInput
                  width={`100%`}
                  placeholder="강사 언어를 입력해주세요."
                />
              </Form.Item>

              <Text fontSize={`18px`} fontWeight={`bold`}>
                강사 나라
              </Text>
              <Form.Item
                name="teaCountry"
                rules={[
                  { required: true, message: "강사 나라를 입력해주세요." },
                ]}>
                <CusotmInput
                  width={`100%`}
                  placeholder="강사 나라를 입력해주세요."
                />
              </Form.Item>

              <Text fontSize={`18px`} fontWeight={`bold`}>
                은행이름
              </Text>
              <Form.Item
                name="bankName"
                rules={[
                  { required: true, message: "은행이름을 입력해주세요." },
                ]}>
                <CusotmInput
                  width={`100%`}
                  placeholder="은행이름을 입력해주세요."
                />
              </Form.Item>

              <Text fontSize={`18px`} fontWeight={`bold`}>
                계좌번호
              </Text>
              <Form.Item
                name="bankNo"
                rules={[
                  { required: true, message: "계좌번호를 입력해주세요." },
                ]}>
                <CusotmInput
                  width={`100%`}
                  placeholder="계좌번호를 입력해주세요."
                />
              </Form.Item>

              <Text fontSize={`18px`} fontWeight={`bold`}>
                생년월일
              </Text>
              <Form.Item
                name="birth"
                rules={[
                  { required: true, message: "생년월일를 입력해주세요." },
                ]}>
                <Calendar fullscreen={false} />
              </Form.Item>

              <Wrapper>
                <CommonButton height={`40px`} radius={`5px`} htmlType="submit">
                  회원정보 수정
                </CommonButton>
              </Wrapper>
            </CustomForm>
          </CustomModal>

          <CustomModal
            width={`700px`}
            height={`500px`}
            visible={zoomLinkToggle}
            onCancel={zoomLinkModalToggle}
            footer={null}>
            <Wrapper>
              <Text fontSize={`22px`} fontWeight={`bold`} margin={`0 0 24px`}>
                줌링크 등록하기
              </Text>
            </Wrapper>

            <CustomForm onFinish={zoomLinkFinish} form={zoomLinkForm}>
              <Form.Item
                label="줌 링크"
                name={"zoomLink"}
                rules={[{ required: true, message: "줌링크를 입력해주세요." }]}>
                <CusotmInput width={`100%`} />
              </Form.Item>

              <Form.Item
                label="줌 비밀번호"
                name={"zoomPass"}
                rules={[
                  { required: true, message: "줌 비밀번호를 입력해주세요." },
                ]}>
                <CusotmInput width={`100%`} />
              </Form.Item>

              <Wrapper>
                <CommonButton height={`40px`} radius={`5px`} htmlType="submit">
                  등록
                </CommonButton>
              </Wrapper>
            </CustomForm>
          </CustomModal>
        </WholeWrapper>

        <CustomModal
          visible={messageViewToggle}
          width={`1350px`}
          title={messageAnswerModal ? "쪽지 답변" : "쪽지함"}
          footer={null}
          closable={false}>
          <CustomForm
            form={answerform}
            onFinish={(data) => answerFinishHandler(data, messageDatum)}>
            {messageAnswerModal && (
              <>
                <Wrapper dr={`row`} ju={`flex-start`} margin={`0 0 40px`}>
                  <Text
                    fontSize={`18px`}
                    fontWeight={`bold`}
                    margin={`0 35px 0 0`}>
                    작성자
                  </Text>

                  <Text>{messageDatum && messageDatum.author}</Text>
                </Wrapper>

                <Text fontSize={`18px`} fontWeight={`bold`}>
                  제목
                </Text>
                <Wrapper padding={`10px`}>
                  <Form.Item
                    name="messageTitle"
                    rules={[
                      { required: true, message: "제목을 입력해주세요." },
                    ]}>
                    <CusotmInput
                      width={`100%`}
                      placeholder="제목을 입력해주세요."
                    />
                  </Form.Item>
                </Wrapper>

                <Text fontSize={`18px`} fontWeight={`bold`}>
                  내용
                </Text>
                <Wrapper padding={`10px`}>
                  <Form.Item
                    name="messageContent"
                    rules={[
                      { required: true, message: "내용을 입력해주세요." },
                    ]}>
                    <Input.TextArea
                      style={{ height: `360px` }}
                      placeholder="내용을 입력해주세요."
                    />
                  </Form.Item>
                </Wrapper>

                <Wrapper dr={`row`}>
                  <CommonButton
                    margin={`0 5px 0 0`}
                    kindOf={`grey`}
                    color={Theme.darkGrey_C}
                    radius={`5px`}
                    onClick={() => onReset()}>
                    돌아가기
                  </CommonButton>
                  <CommonButton
                    margin={`0 0 0 5px`}
                    radius={`5px`}
                    htmlType="submit">
                    작성하기
                  </CommonButton>
                </Wrapper>
              </>
            )}
          </CustomForm>

          {!messageAnswerModal && (
            <>
              <Wrapper
                dr={`row`}
                ju={`space-between`}
                margin={`0 0 35px`}
                fontSize={width < 700 ? `14px` : `16px`}>
                <Text margin={`0 54px 0 0`}>
                  {`작성자: ${messageDatum && messageDatum.author}`}
                </Text>
                <Text>{`날짜: ${
                  messageDatum &&
                  moment(messageDatum.createdAt, "YYYY/MM/DD").format(
                    "YYYY/MM/DD"
                  )
                }`}</Text>
              </Wrapper>

              <Text fontSize={`18px`} fontWeight={`bold`}>
                제목
              </Text>

              <Wrapper padding={`10px`} al={`flex-start`}>
                <Text fontSize={width < 700 ? `14px` : `16px`}>
                  {messageDatum && messageDatum.title}
                </Text>
              </Wrapper>

              <Text fontSize={`18px`} fontWeight={`bold`}>
                내용
              </Text>
              <Wrapper padding={`10px`} al={`flex-start`}>
                <Text
                  minHeight={`360px`}
                  fontSize={width < 700 ? `14px` : `16px`}>
                  {messageDatum &&
                    messageDatum.content.split(`\n`).map((data, idx) => {
                      return (
                        <Text key={`${data}${idx}`}>
                          {data}
                          <br />
                        </Text>
                      );
                    })}
                </Text>
              </Wrapper>

              <Wrapper dr={`row`}>
                <CommonButton
                  margin={`0 5px 0 0`}
                  kindOf={`grey`}
                  color={Theme.darkGrey_C}
                  radius={`5px`}
                  onClick={() => onReset()}>
                  돌아가기
                </CommonButton>
                <CommonButton
                  onClick={() => messageAnswerToggleHanlder(messageDatum)}
                  margin={`0 0 0 5px`}
                  radius={`5px`}>
                  답변하기
                </CommonButton>
              </Wrapper>
            </>
          )}
        </CustomModal>

        <CustomModal
          visible={messageSendModal}
          width={`1350px`}
          title={
            sendMessageType === 1
              ? "학생에게 쪽지 보내기"
              : sendMessageType === 3 && "관리자에게 쪽지 보내기"
          }
          footer={null}
          closable={false}>
          <CustomForm
            form={messageSendform}
            onFinish={(data) =>
              sendMessageType === 1
                ? sendMessageFinishHandler(data)
                : sendMessageType === 3 && sendMessageAdminFinishHandler(data)
            }>
            <Wrapper dr={`row`} ju={`flex-end`}>
              <CommonButton
                margin={`0 0 0 5px`}
                radius={`5px`}
                width={`100px`}
                height={`32px`}
                size="small"
                onClick={() => sendMessageTypeHandler(1)}>
                {"학생"}
              </CommonButton>

              <CommonButton
                margin={`0 0 0 5px`}
                radius={`5px`}
                width={`100px`}
                height={`32px`}
                size="small"
                onClick={() => sendMessageTypeHandler(3)}>
                {"관리자"}
              </CommonButton>
            </Wrapper>

            <Text fontSize={`18px`} fontWeight={`bold`}>
              제목
            </Text>
            <Form.Item
              name="title"
              rules={[{ required: true, message: "제목을 입력해주세요." }]}>
              <Input />
            </Form.Item>
            <Text fontSize={`18px`} fontWeight={`bold`}>
              내용
            </Text>
            <Form.Item
              name="content"
              rules={[{ required: true, message: "내용을 입력해주세요." }]}>
              <Input.TextArea style={{ height: `360px` }} />
            </Form.Item>
            <Wrapper dr={`row`}>
              <CommonButton
                margin={`0 5px 0 0`}
                kindOf={`grey`}
                color={Theme.darkGrey_C}
                radius={`5px`}
                onClick={() => onReset()}>
                돌아가기
              </CommonButton>
              <CommonButton
                margin={`0 0 0 5px`}
                radius={`5px`}
                htmlType="submit">
                쪽지 보내기
              </CommonButton>
            </Wrapper>
          </CustomForm>
        </CustomModal>

        <CustomModal
          visible={noticeViewModal}
          width={`1350px`}
          title="공지사항"
          footer={null}
          closable={false}>
          <Wrapper
            dr={`row`}
            ju={`space-between`}
            margin={`0 0 35px`}
            fontSize={width < 700 ? `14px` : `16px`}>
            <Text margin={`0 54px 0 0`}>
              {`작성자: ${noticeViewDatum && noticeViewDatum.author}`}
            </Text>
            <Wrapper width={`auto`}>
              <Text>
                {`작성일: ${moment(
                  noticeViewDatum && noticeViewDatum.createdAt,
                  "YYYY/MM/DD"
                ).format("YYYY/MM/DD")}`}
              </Text>

              <Text>
                {`수정일: ${moment(
                  noticeViewDatum && noticeViewDatum.updatedAt,
                  "YYYY/MM/DD"
                ).format("YYYY/MM/DD")}`}
              </Text>
            </Wrapper>
          </Wrapper>

          {noticeViewDatum && noticeViewDatum.file && (
            <Wrapper dr={`row`} ju={`flex-end`}>
              <Text margin={`0 10px 0 0`} fontSize={`15px`}>
                첨부파일
              </Text>

              <CommonButton
                size={`small`}
                radius={`5px`}
                fontSize={`14px`}
                onClick={() => fileDownloadHandler(noticeViewDatum.file)}>
                다운로드
              </CommonButton>
            </Wrapper>
          )}

          <Text fontSize={`18px`} fontWeight={`bold`}>
            제목
          </Text>
          <Wrapper padding={`10px`}>
            <WordbreakText fontSize={width < 700 ? `14px` : `16px`}>
              {noticeViewDatum && noticeViewDatum.title}
            </WordbreakText>
          </Wrapper>

          <Text fontSize={`18px`} fontWeight={`bold`}>
            내용
          </Text>
          <Wrapper padding={`10px`}>
            <WordbreakText
              fontSize={width < 700 ? `14px` : `16px`}
              dangerouslySetInnerHTML={{
                __html: noticeViewDatum && noticeViewDatum.content,
              }}></WordbreakText>
          </Wrapper>

          <Wrapper>
            <CommonButton
              onClick={() => onReset()}
              kindOf={`grey`}
              color={Theme.darkGrey_C}
              radius={`5px`}>
              돌아가기
            </CommonButton>
          </Wrapper>
        </CustomModal>

        <CustomModal
          visible={textbookToggle}
          width={`1350px`}
          title="교재 등록"
          footer={null}
          closable={false}>
          <CustomForm
            form={textBookUploadform}
            onFinish={textBookFinishHandler}>
            <Text
              fontSize={width < 700 ? `14px` : `18px`}
              fontWeight={`bold`}
              margin={`0 0 10px`}>
              교재 이미지
            </Text>

            <Wrapper margin={`0 20px 0 0`}>
              {thumbnail ? (
                <Image
                  width={`auto`}
                  height={`250px`}
                  src={thumbnail}
                  alt={`menu_icon`}
                />
              ) : (
                <Close />
              )}
            </Wrapper>

            <Text
              fontSize={width < 700 ? `14px` : `18px`}
              fontWeight={`bold`}
              margin={`0 0 10px`}>
              교재 이름
            </Text>

            <Form.Item
              name="bookId"
              rules={[
                {
                  required: true,
                  message: "교재를 선택해주세요.",
                },
              ]}>
              <Select
                value={selectValue}
                style={{ width: `100%` }}
                onChange={(id) => receiveSelectHandler(id, bookAllList)}>
                {bookAllList && bookAllList.length === 0 ? (
                  <Select.Option value="참여 중인 강의가 없습니다." disabled>
                    교재가 없습니다.
                  </Select.Option>
                ) : (
                  bookAllList &&
                  bookAllList.map((data, idx) => {
                    return (
                      <Select.Option key={`${data.id}${idx}`} value={data.id}>
                        {data.title}
                      </Select.Option>
                    );
                  })
                )}
              </Select>
            </Form.Item>

            {/* 
            <Text fontSize={width < 700 ? `14px` : `18px`} fontWeight={`bold`}>
              파일 업로드
            </Text>

            <Wrapper al={`flex-start`}>
              <input
                type="file"
                name="file"
                accept=".pdf"
                // multiple
                hidden
                ref={imageInput}
                onChange={onChangeImages}
              />
              <Button
                icon={<UploadOutlined />}
                onClick={clickImageUpload}
                style={{
                  height: `40px`,
                  width: `150px`,
                  margin: `10px 0 0`,
                }}>
                파일 올리기
              </Button>
              <Text>{`${fileName}`}</Text>
            </Wrapper> */}

            <Wrapper dr={`row`}>
              <CommonButton
                margin={`0 5px 0 0`}
                kindOf={`grey`}
                color={Theme.darkGrey_C}
                radius={`5px`}
                onClick={() => onReset()}>
                돌아가기
              </CommonButton>
              <CommonButton
                margin={`0 0 0 5px`}
                radius={`5px`}
                htmlType="submit">
                등록
              </CommonButton>
            </Wrapper>
          </CustomForm>
        </CustomModal>
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
      type: SEO_LIST_REQUEST,
    });

    context.store.dispatch({
      type: BOOK_ALL_LIST_REQUEST,
    });

    context.store.dispatch({
      type: NOTICE_LIST_REQUEST,
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

export default Index;
