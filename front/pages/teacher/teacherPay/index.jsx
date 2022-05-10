import React, { useEffect, useCallback, useState } from "react";
import ClientLayout from "../../../components/ClientLayout";
import { useDispatch, useSelector } from "react-redux";
import wrapper from "../../../store/configureStore";
import { END } from "redux-saga";
import useWidth from "../../../hooks/useWidth";
import Theme from "../../../components/Theme";
import axios from "axios";
import { LOAD_MY_INFO_REQUEST } from "../../../reducers/user";
import { SEO_LIST_REQUEST } from "../../../reducers/seo";
import Head from "next/head";
import {
  TEACHER_PAY_CREATE_REQUEST,
  TEACHER_PAY_LIST_REQUEST,
} from "../../../reducers/teacherpay";

import {
  message,
  DatePicker,
  Select,
  Empty,
  Pagination,
  Modal,
  Input,
  Form,
  InputNumber,
} from "antd";
import { useRouter } from "next/router";
import styled, { ThemeConsumer, ThemeProvider } from "styled-components";
import {
  RsWrapper,
  WholeWrapper,
  Wrapper,
  SpanText,
  CommonButton,
  Image,
  Text,
  TextArea,
} from "../../../components/commonComponents";
import { LECTURE_TEACHER_LIST_REQUEST } from "../../../reducers/lecture";
import moment from "moment";

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

const Index = () => {
  const { RangePicker } = DatePicker;
  const { Option } = Select;

  ////// GLOBAL STATE //////
  const { seo_keywords, seo_desc, seo_ogImage, seo_title } = useSelector(
    (state) => state.seo
  );

  const { me } = useSelector((state) => state.user);

  const router = useRouter();
  const width = useWidth();
  const dispatch = useDispatch();

  const [meetingForm] = Form.useForm();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [type, setType] = useState("");
  const [lectureId, setLectureId] = useState("");

  const [meetingModal, setMeetingModal] = useState(false);

  const [currentPage, setCurrentPage] = useState("");

  const [currentType, setCurrentType] = useState(null);

  const {
    teacherPayList,
    teacherPayLastPage,
    teacherPayListDone,
    teacherPayListError,
    teacherPayPrice,
    st_teacherCreateDone,
    st_teacherCreateError,
  } = useSelector((state) => state.teacherpay);

  const {
    lectureTeacherList,

    st_lectureTeacherListError,
  } = useSelector((state) => state.lecture);

  ////// HOOKS //////
  ////// REDUX //////
  ////// USEEFFECT //////

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
    if (teacherPayListDone) {
    }
  }, [teacherPayListDone]);

  useEffect(() => {
    if (teacherPayListError) {
      return message.error(teacherPayListError);
    }
  }, [teacherPayListError]);

  useEffect(() => {
    dispatch({
      type: LECTURE_TEACHER_LIST_REQUEST,
      data: {
        TeacherId: me && me.id,
      },
    });
  }, [me]);

  useEffect(() => {
    if (st_lectureTeacherListError) {
      return message.error(st_lectureTeacherListError);
    }
  }, [st_lectureTeacherListError]);

  useEffect(() => {
    if (st_teacherCreateDone) {
      modalMettingClose();
      return message.success("회의수당이 등록 되었습니다.");
    }
  }, [st_teacherCreateDone]);

  useEffect(() => {
    if (st_teacherCreateError) {
      return message.error(st_teacherCreateError);
    }
  }, [st_teacherCreateError]);

  useEffect(() => {
    meetingForm.setFieldsValue({
      price: currentType && JSON.parse(currentType).price,
    });
  }, [currentType]);

  ////// TOGGLE //////
  ////// HANDLER //////

  const onChangeDate = useCallback((dates, dateStrings) => {
    if (dateStrings) {
      setStartDate(dateStrings[0]);
      setEndDate(dateStrings[1]);
    }
  }, []);

  const searchHandler = useCallback(() => {
    dispatch({
      type: TEACHER_PAY_LIST_REQUEST,
      data: {
        searchDate: startDate,
        endDate: endDate,
        type: type,
        page: 1,
        LectureId: lectureId,
      },
    });
  }, [startDate, endDate, type, me, lectureId]);

  const handleChange = useCallback((e) => {
    setType(e);
  }, []);

  const onChangeNoticeLecturePage = useCallback((page) => {
    setCurrentPage(page);

    // dispatch({
    //   type: NOTICE_LECTURE_LIST_REQUEST,
    //   data: {
    //     page,
    //     LectureId: id,
    //   },
    // });
  }, []);
  ////// DATAVIEW //////

  const lectureHandle = useCallback((data) => {
    setLectureId(data.id);
  }, []);

  const clickHandler = useCallback(() => {
    setMeetingModal(true);

    // meetingForm.setFieldsValue({
    //   price: 20000,
    // });
  }, [meetingForm]);

  const modalMettingClose = useCallback(() => {
    setMeetingModal(false);
    setCurrentType(null);
    meetingForm.resetFields();
  }, []);

  const onSubmit = useCallback((data) => {
    dispatch({
      type: TEACHER_PAY_CREATE_REQUEST,
      data: {
        type: JSON.parse(data.type).type,
        price: data.price,
        LectureId: data.LectureId,
        memo: data.memo,
      },
    });
  }, []);

  const typeArr = [
    { type: "기본수당(정규과정)", price: 20000 },
    { type: "기본수당(무료설명회)", price: 30000 },
    { type: "대기수당(정규과정)", price: 10000 },
    { type: "대기수당(무료설명회)", price: 15000 },
    { type: "회의수당", price: 20000 },
    { type: "참관수당", price: 15000 },
    { type: "등록수당", price: 30000 },
    { type: "연장수당", price: 144 * 200 },
  ];

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
        <WholeWrapper margin={`100px 0 0`}>
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
                  <SpanText color={Theme.basicTheme_C} wordBreak={`break-all`}>
                    {me && me.username}
                  </SpanText>
                  님!
                </Text>
              </Wrapper>
            </Wrapper>

            <Wrapper dr={`row`} ju={`space-between`}>
              <Wrapper dr={`row`} width={`auto`}>
                <RangePicker format="YYYY-MM-DD" onChange={onChangeDate} />

                <Select
                  style={{ width: 200, marginLeft: 10 }}
                  onChange={handleChange}
                  placeholder="수당을 선택해주세요.">
                  <Option value={""}>{"전체"}</Option>
                  {typeArr.map((data, idx) => {
                    return (
                      <Option key={idx} value={data.type}>
                        {data.type}
                      </Option>
                    );
                  })}
                </Select>

                <Select
                  style={{ width: 200, marginLeft: 10 }}
                  onChange={lectureHandle}
                  placeholder="강의를 선택해주세요.">
                  <Option value={""}>{"전체"}</Option>

                  {lectureTeacherList &&
                    lectureTeacherList.map((data, idx) => {
                      return (
                        <Option key={data.id} value={data.id}>
                          {data.course}
                        </Option>
                      );
                    })}
                </Select>

                <CommonButton
                  radius={`5px`}
                  margin={`0 0 0 10px`}
                  onClick={searchHandler}>
                  검색
                </CommonButton>
              </Wrapper>

              <CommonButton
                radius={`5px`}
                kindOf={`white`}
                onClick={clickHandler}>
                수당 입력
              </CommonButton>
            </Wrapper>

            <Wrapper al={`flex-start`}>
              <Text
                color={Theme.black_2C}
                fontSize={width < 700 ? `18px` : `22px`}
                fontWeight={`Bold`}
                margin={`86px 0 20px`}>
                강의료 산정
              </Text>
            </Wrapper>

            <Wrapper shadow={`0px 5px 15px rgb(0,0,0,0.16)`} radius={`10px`}>
              <Wrapper dr={`row`} textAlign={`center`} padding={`20px 0`}>
                <Text
                  fontSize={width < 700 ? `14px` : `18px`}
                  fontWeight={`Bold`}
                  width={`15%`}>
                  수당유형
                </Text>
                <Text
                  fontSize={width < 700 ? `14px` : `18px`}
                  fontWeight={`Bold`}
                  width={`30%`}>
                  강의
                </Text>

                <Text
                  fontSize={width < 700 ? `14px` : `18px`}
                  fontWeight={`Bold`}
                  width={`30%`}>
                  금액
                </Text>
                <Text
                  fontSize={width < 700 ? `14px` : `18px`}
                  fontWeight={`Bold`}
                  width={`25%`}>
                  날짜
                </Text>
              </Wrapper>

              {teacherPayList && teacherPayList.length === 0 ? (
                <Wrapper margin={`50px 0`}>
                  <Empty description="조회된 데이터가 없습니다." />
                </Wrapper>
              ) : (
                teacherPayList &&
                teacherPayList.map((data, idx) => {
                  return (
                    <Wrapper
                      key={data.id}
                      dr={`row`}
                      textAlign={`center`}
                      ju={`flex-start`}
                      padding={`25px 0 20px`}
                      cursor={`pointer`}
                      bgColor={idx % 2 === 0 && Theme.lightGrey_C}>
                      <Text
                        fontSize={width < 700 ? `14px` : `16px`}
                        width={`15%`}
                        wordBreak={`break-word`}>
                        {data.type}
                      </Text>
                      <Text
                        fontSize={width < 700 ? `14px` : `16px`}
                        width={`30%`}>
                        {data.course}
                      </Text>
                      <Text
                        fontSize={width < 700 ? `14px` : `16px`}
                        width={`30%`}>
                        {String(data.price).replace(
                          /\B(?=(\d{3})+(?!\d))/g,
                          ","
                        )}
                        원
                      </Text>
                      <Text
                        fontSize={width < 700 ? `14px` : `16px`}
                        width={`25%`}>
                        {moment(data.createdAt, "YYYY/MM/DD").format(
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
              ju={`flex-end`}
              shadow={`0px 5px 15px rgb(0,0,0,0.16)`}
              radius={`10px`}
              padding={`20px`}
              margin={`20px 0 0`}>
              <Text
                fontSize={width < 700 ? `14px` : `16px`}>{`총 가격 : ${String(
                teacherPayPrice
              ).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}원`}</Text>
            </Wrapper>

            <Wrapper margin={`65px 0 85px`}>
              <CustomPage
                total={teacherPayLastPage * 10}
                current={currentPage}
              />
            </Wrapper>
          </RsWrapper>

          <Modal
            visible={meetingModal}
            title="회의수당"
            okText="등록"
            footer={null}
            cancelText="취소"
            onCancel={() => modalMettingClose()}>
            <Form form={meetingForm} onFinish={onSubmit}>
              <Form.Item
                labelCol={{ span: 4 }}
                labelWrap={{ span: 20 }}
                name={"type"}
                label="수당 유형"
                rules={[
                  { required: true, message: "수당유형을 선택해주세요." },
                ]}>
                <Select
                  style={{ width: "100%" }}
                  placeholder="유형을 선택해주세요"
                  onChange={(e) => setCurrentType(e)}
                  defaultValue={null}>
                  {typeArr.map((data, idx) => {
                    return (
                      <Option key={idx} value={JSON.stringify(data)}>
                        {data.type}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>

              <Form.Item
                labelCol={{ span: 4 }}
                labelWrap={{ span: 20 }}
                name={"LectureId"}
                label="강의"
                rules={[{ required: true, message: "강의를 선택해주세요." }]}>
                <Select
                  style={{ width: "100%" }}
                  onChange={lectureHandle}
                  placeholder="강의를 선택해주세요">
                  {lectureTeacherList &&
                    lectureTeacherList.map((data, idx) => {
                      return (
                        <Option key={data.id} value={data.id}>
                          {data.course}
                        </Option>
                      );
                    })}
                </Select>
              </Form.Item>

              <Form.Item
                name={"price"}
                label="가격"
                labelCol={{ span: 4 }}
                labelWrap={{ span: 20 }}>
                <Input
                  value={currentType && JSON.parse(currentType).price}
                  disabled></Input>
              </Form.Item>

              <Form.Item
                name={"memo"}
                label="메모"
                labelCol={{ span: 4 }}
                labelWrap={{ span: 20 }}>
                <TextArea
                  width={`100%`}
                  border={`1px solid ${Theme.grey_C} !important`}
                />
              </Form.Item>

              <Wrapper al={`flex-end`} margin={`10px 0 0 0`}>
                <CommonButton
                  radius={`5px`}
                  margin={`0 0 0 10px`}
                  htmlType="submit">
                  입력
                </CommonButton>
              </Wrapper>
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
      type: SEO_LIST_REQUEST,
    });

    // 구현부 종료
    context.store.dispatch(END);
    console.log("🍀 SERVER SIDE PROPS END");
    await context.store.sagaTask.toPromise();
  }
);

export default Index;
