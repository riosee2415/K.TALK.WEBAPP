import React, { useState, useCallback, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { Calendar, Checkbox, Form, message, Select } from "antd";
import { CalendarOutlined, CaretDownOutlined } from "@ant-design/icons";

import { END } from "redux-saga";
import Head from "next/head";
import axios from "axios";
import wrapper from "../../store/configureStore";

import ClientLayout from "../../components/ClientLayout";
import {
  RsWrapper,
  WholeWrapper,
  Wrapper,
  Text,
  TextInput,
  TextArea,
  CommonButton,
  SpanText,
} from "../../components/commonComponents";
import Theme from "../../components/Theme";
import useWidth from "../../hooks/useWidth";

import { SEO_LIST_REQUEST } from "../../reducers/seo";
import { LOAD_MY_INFO_REQUEST } from "../../reducers/user";
import { APP_CREATE_REQUEST } from "../../reducers/application";

const CustomForm = styled(Form)`
  width: 718px;

  & .ant-form-item {
    width: 100%;
    margin: 0 0 48px;
  }

  @media (max-width: 700px) {
    width: 100%;

    & .ant-form-item {
      margin: 0 0 28px;
    }
  }
`;

const CustomCheckBox = styled(Checkbox)`
  & .ant-checkbox-checked .ant-checkbox-inner {
    background-color: ${Theme.white_C} !important;
    border-color: ${Theme.grey_C} !important;
  }

  & .ant-checkbox-checked .ant-checkbox-inner::after {
    border: 2px solid ${Theme.red_C};
    border-top: 0;
    border-left: 0;
  }
`;

const CustomCheckBox2 = styled(Checkbox)`
  & .ant-checkbox + span {
    font-size: 18px !important;
  }

  & .ant-checkbox-inner {
    width: 20px;
    height: 20px;
  }

  & .ant-checkbox-checked .ant-checkbox-inner {
    background-color: ${Theme.white_C} !important;
    border-color: ${Theme.grey_C} !important;
  }

  & .ant-checkbox-checked .ant-checkbox-inner::after {
    border: 2px solid ${Theme.red_C};
    border-top: 0;
    border-left: 0;
  }

  @media (max-width: 700px) {
    & .ant-checkbox + span {
      font-size: 14px !important;
    }
  }
`;

const CustomSelect = styled(Select)`
  width: 100%;

  &:not(.ant-select-customize-input) .ant-select-selector {
    border-radius: 5px;
    box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.16);
  }

  & .ant-select-selector {
    width: 100% !important;
    height: 40px !important;
    padding: 5px 0 0 10px !important;
  }

  & .ant-select-arrow span svg {
    color: ${Theme.black_C};
  }

  & .ant-select-selection-placeholder {
    color: ${Theme.grey2_C};
  }
`;

const CusotmInput = styled(TextInput)`
  border: none;
  box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.16);
  border-radius: 5px;

  &::placeholder {
    color: ${Theme.grey2_C};
  }
`;

const CusotmArea = styled(TextArea)`
  border: none;
  box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.16);
`;

const Application = () => {
  ////// GLOBAL STATE //////
  const { seo_keywords, seo_desc, seo_ogImage, seo_title } = useSelector(
    (state) => state.seo
  );

  const { st_appCreateDone, st_appCreateError } = useSelector(
    (state) => state.app
  );

  ////// HOOKS //////

  const width = useWidth();
  const dispatch = useDispatch();

  const [titleSelect, setTitleSelect] = useState(null);
  const [timeSelect, setTimeSelect] = useState(null);
  const [agreeCheck, setAgreeCheck] = useState(false);
  const [isCalendar, setIsCalendar] = useState(false);

  const [form] = Form.useForm();
  const formRef = useRef();

  ////// REDUX //////
  ////// USEEFFECT //////

  useEffect(() => {
    if (st_appCreateDone) {
      form.resetFields();

      setTitleSelect(null);
      setTimeSelect(null);
      setAgreeCheck(false);
      setIsCalendar(false);

      return message.success("Your application has been submitted.");
    }
  }, [st_appCreateDone]);

  useEffect(() => {
    if (st_appCreateError) {
      return message.error(st_appCreateError);
    }
  }, [st_appCreateError]);
  ////// TOGGLE //////

  const titleSelectToggle = useCallback(
    (select) => {
      setTitleSelect(select);
    },
    [titleSelect]
  );

  const timeSelectToggle = useCallback(
    (select) => {
      setTimeSelect(select);
    },
    [timeSelect]
  );

  const agreeCheckToggle = useCallback(
    (data) => {
      setAgreeCheck(data.target.checked);
    },
    [agreeCheck]
  );

  const calenderToggle = useCallback(() => {
    setIsCalendar(!isCalendar);
  }, [isCalendar]);

  ////// HANDLER //////

  const submissionHandler = useCallback(
    (data) => {
      if (!titleSelect) {
        return message.error("Please select a title.");
      }
      if (!timeSelect) {
        return message.error("Please select a time.");
      }
      if (!agreeCheck) {
        return message.error("Please agree to the terms and conditions.");
      }

      dispatch({
        type: APP_CREATE_REQUEST,
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          title: titleSelect === "Others." ? data.title : titleSelect,
          dateOfBirth: `${data.year}-${data.month}-${data.date}`,
          gmailAddress: `${data.firstEmail}${data.lastEmail}`,
          nationality: data.nationality,
          countryOfResidence: data.countryOfResidence,
          languageYouUse: data.languageYouUse,
          phoneNumber: data.phoneNumber,
          phoneNumber2: data.phoneNumber2,
          classHour: timeSelect,
          terms: agreeCheck,
          comment: data.comment,
        },
      });
    },
    [titleSelect, timeSelect, agreeCheck, timeSelect, agreeCheck]
  );

  const dateChagneHandler = useCallback((data) => {
    const birth = data.format("YYYY-MM-DD");
    formRef.current.setFieldsValue({
      date: birth.split("-")[2],
      month: birth.split("-")[1],
      year: birth.split("-")[0],
    });
  }, []);

  ////// DATAVIEW //////

  const timeArr = [
    "06:00 - 06:50 KST",
    "14:00 - 14:50 KST",
    "22:00 - 22:50 KST",
    "07:00 - 07:50 KST",
    "15:00 - 15:50 KST",
    "23:00 - 23:50 KST",
    "08:00 - 08:50 KST",
    "16:00 - 16:50 KST",
    "24:00 - 24:50 KST",
    "09:00 - 09:50 KST",
    "17:00 - 17:50 KST",
    "01:00 - 01:50 KST",
    "10:00 - 10:50 KST",
    "18:00 - 18:50 KST",
    "02:00 - 02:50 KST",
    "11:00 - 11:50 KST",
    "19:00 - 19:50 KST",
    "03:00 - 03:50 KST",
    "12:00 - 12:50 KST",
    "20:00 - 20:50 KST",
    "04:00 - 04:50 KST",
    "13:00 - 13:50 KST",
    "21:00 - 21:50 KST",
    "05:00 - 05:50 KST",
  ];

  const firstPhoneArr = [
    "010",
    "011",
    "012",
    "013",
    "014",
    "015",
    "016",
    "017",
    "018",
    "019",
    "030",
    "050",
    "060",
    "070",
    "080",
    "020",
    "040",
    "090",
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
        <WholeWrapper
          bgColor={Theme.subTheme_C}
          padding={`80px 0`}
          margin={width < 700 ? `50px 0 0` : `100px 0 0`}
        >
          <RsWrapper>
            <Text fontSize={width < 700 ? `20px` : `28px`} fontWeight={`bold`}>
              Application Form
            </Text>
            <Text
              fontSize={width < 700 ? `16px` : `18px`}
              margin={`10px 0 30px`}
            >
              for K-talk LIve regular paid Korean lessons
            </Text>
            {width < 700 ? (
              <>
                <Text fontSize={`14px`}>
                  ·Please complete and submit this form
                </Text>
                <Text fontSize={`14px`}>
                  so that teachers can contact you for the next step.
                </Text>
              </>
            ) : (
              <Text>
                ·Please complete and submit this form so that teachers can
                contact you for the next step.
              </Text>
            )}

            {width < 700 ? (
              <>
                <Text fontSize={`14px`}>
                  ·If you'd like to apply for our Free Hangeul Lessons,
                </Text>
                <Text fontSize={`14px`}>
                  please exit this page and visit our website at
                </Text>
              </>
            ) : (
              <Text>
                ·If you'd like to apply for our Free Hangeul Lessons, please
                exit this page and visit our website at
              </Text>
            )}
            <Wrapper dr={`row`}>
              <Text color={Theme.basicTheme_C}>http://ktalklive.com</Text>
              &nbsp;or our FB page at&nbsp;
              <Text color={Theme.basicTheme_C}>
                https://www.facebook.com/ktalklive/
              </Text>
            </Wrapper>
            <Wrapper
              color={Theme.subTheme2_C}
              margin={`20px 0 68px`}
              fontSize={`20px`}
              fontWeight={`bold`}
            >
              Thank you very much!
            </Wrapper>

            <CustomForm onFinish={submissionHandler} form={form} ref={formRef}>
              <Wrapper al={`flex-start`}>
                <Text
                  fontSize={width < 700 ? `16px` : `18px`}
                  fontWeight={`bold`}
                  margin={`0 0 10px`}
                  lineHeight={`1.22`}
                >
                  Name in full (First/Last)
                </Text>
                <Wrapper dr={`row`} ju={`flex-start`}>
                  <Wrapper width={`calc(100% / 2 - 4px)`} margin={`0 8px 0 0`}>
                    <Form.Item name="firstName" rules={[{ required: true }]}>
                      <CusotmInput
                        width={`100%`}
                        placeholder={"First"}
                        radius={`5px`}
                      />
                    </Form.Item>
                  </Wrapper>

                  <Wrapper width={`calc(100% / 2 - 4px)`}>
                    <Form.Item name="lastName" rules={[{ required: true }]}>
                      <CusotmInput
                        width={`100%`}
                        placeholder={"Last"}
                        radius={`5px`}
                      />
                    </Form.Item>
                  </Wrapper>
                </Wrapper>
              </Wrapper>
              <Wrapper al={`flex-start`}>
                <Text
                  fontSize={width < 700 ? `16px` : `18px`}
                  fontWeight={`bold`}
                  margin={`0 0 10px`}
                  lineHeight={`1.22`}
                >
                  Title
                </Text>
                <Wrapper dr={`row`} ju={`flex-start`}>
                  <Wrapper
                    dr={`row`}
                    width={`40%`}
                    margin={width < 700 ? `0 0 28px` : `0 0 48px`}
                    ju={`flex-start`}
                  >
                    <CustomCheckBox
                      checked={titleSelect === "Ms."}
                      onChange={() => titleSelectToggle("Ms.")}
                    >
                      Ms.
                    </CustomCheckBox>
                    <CustomCheckBox
                      checked={titleSelect === "Mr."}
                      onChange={() => titleSelectToggle("Mr.")}
                    >
                      Mr.
                    </CustomCheckBox>
                    <CustomCheckBox
                      checked={titleSelect === "Others."}
                      onChange={() => titleSelectToggle("Others.")}
                    >
                      Others.
                    </CustomCheckBox>
                  </Wrapper>
                  <Wrapper width={`60%`}>
                    {titleSelect === "Others." && (
                      <Form.Item name="title">
                        <CusotmInput width={"100%"} radius={`5px`} />
                      </Form.Item>
                    )}
                  </Wrapper>
                </Wrapper>
              </Wrapper>
              <Wrapper al={`flex-start`} position={"relative"}>
                <Text
                  fontSize={width < 700 ? `16px` : `18px`}
                  fontWeight={`bold`}
                  margin={`0 0 10px`}
                  lineHeight={`1.22`}
                >
                  Date of Birth
                </Text>
                <Wrapper dr={`row`} ju={`flex-start`}>
                  <Wrapper width={`calc(100% / 3 - 16px)`}>
                    <Form.Item name="date" rules={[{ requierd: true }]}>
                      <CusotmInput
                        readOnly
                        width={`100%`}
                        radius={`5px`}
                        placeholder={"Date"}
                      />
                    </Form.Item>
                  </Wrapper>

                  <Wrapper width={`calc(100% / 3 - 16px)`} margin={`0 9px`}>
                    <Form.Item name="month" rules={[{ requierd: true }]}>
                      <CusotmInput
                        readOnly
                        width={`100%`}
                        radius={`5px`}
                        placeholder={"Month"}
                      />
                    </Form.Item>
                  </Wrapper>

                  <Wrapper width={`calc(100% / 3 - 16px)`}>
                    <Form.Item name="year" rules={[{ requierd: true }]}>
                      <CusotmInput
                        readOnly
                        width={`100%`}
                        radius={`5px`}
                        placeholder={"Year"}
                      />
                    </Form.Item>
                  </Wrapper>
                  <Wrapper
                    width={`30px`}
                    margin={width < 700 ? `0 0 28px` : `0 0 48px`}
                    fontSize={width < 700 ? `20px` : `30px`}
                  >
                    <CalendarOutlined onClick={calenderToggle} />
                  </Wrapper>
                </Wrapper>
                <Wrapper
                  display={isCalendar ? "flex" : "none"}
                  width={`auto`}
                  position={width < 1350 ? `static` : `absolute`}
                  top={`40px`}
                  right={`-310px`}
                  border={`1px solid ${Theme.grey_C}`}
                  margin={`0 0 20px`}
                >
                  <Calendar
                    style={{ width: width < 1350 ? `100%` : `300px` }}
                    fullscreen={false}
                    onChange={dateChagneHandler}
                  />
                </Wrapper>
              </Wrapper>
              <Wrapper al={`flex-start`}>
                <Text
                  fontSize={width < 700 ? `16px` : `18px`}
                  fontWeight={`bold`}
                  margin={`0 0 10px`}
                  lineHeight={`1.22`}
                >
                  Gmail Address
                </Text>
                <Wrapper dr={`row`} ju={`flex-start`}>
                  <Wrapper width={`calc(100% / 2 - 4px)`} margin={`0 8px 0 0`}>
                    <Form.Item name="firstEmail" rules={[{ required: true }]}>
                      <CusotmInput
                        width={`100%`}
                        radius={`5px`}
                        placeholder={"Address"}
                      />
                    </Form.Item>
                  </Wrapper>

                  <Wrapper width={`calc(100% / 2 - 4px)`}>
                    <Form.Item name="lastEmail" rules={[{ required: true }]}>
                      <CusotmInput
                        width={`100%`}
                        radius={`5px`}
                        placeholder={"@gmail.com"}
                      />
                    </Form.Item>
                  </Wrapper>
                </Wrapper>
              </Wrapper>
              <Wrapper al={`flex-start`}>
                <Text
                  fontSize={width < 700 ? `16px` : `18px`}
                  fontWeight={`bold`}
                  margin={`0 0 10px`}
                  lineHeight={`1.22`}
                >
                  Nationality
                </Text>
                <Wrapper dr={`row`} ju={`flex-start`}>
                  <Form.Item name="nationality" rules={[{ required: true }]}>
                    <CusotmInput
                      width={`100%`}
                      radius={`5px`}
                      placeholder={"Select Nationality"}
                    />
                  </Form.Item>
                </Wrapper>
              </Wrapper>
              <Wrapper al={`flex-start`}>
                <Text
                  fontSize={width < 700 ? `16px` : `18px`}
                  fontWeight={`bold`}
                  margin={`0 0 10px`}
                  lineHeight={`1.22`}
                >
                  Country of Residence
                </Text>
                <Wrapper dr={`row`} ju={`flex-start`}>
                  <Form.Item
                    name="countryOfResidence"
                    rules={[{ required: true }]}
                  >
                    <CusotmInput
                      width={`100%`}
                      radius={`5px`}
                      placeholder={"Nationality"}
                    />
                  </Form.Item>
                </Wrapper>
              </Wrapper>
              <Wrapper al={`flex-start`}>
                <Text
                  fontSize={width < 700 ? `16px` : `18px`}
                  fontWeight={`bold`}
                  margin={`0 0 10px`}
                  lineHeight={`1.22`}
                >
                  Language you use
                </Text>
                <Wrapper dr={`row`} ju={`flex-start`}>
                  <Form.Item name="languageYouUse" rules={[{ required: true }]}>
                    <CusotmInput
                      width={`100%`}
                      radius={`5px`}
                      placeholder={"Select Languge"}
                    />
                  </Form.Item>
                </Wrapper>
              </Wrapper>
              <Wrapper al={`flex-start`}>
                <Text
                  fontSize={width < 700 ? `16px` : `18px`}
                  fontWeight={`bold`}
                  margin={`0 0 10px`}
                  lineHeight={`1.22`}
                >
                  Phone number
                </Text>
                <Wrapper dr={`row`} ju={`flex-start`}>
                  <Wrapper width={`calc(20% - 4px)`} margin={`0 8px 0 0`}>
                    <Form.Item name="phoneNumber" rules={[{ required: true }]}>
                      <CustomSelect
                        suffixIcon={() => {
                          return <CaretDownOutlined />;
                        }}
                      >
                        {firstPhoneArr &&
                          firstPhoneArr.map((data) => {
                            return (
                              <Select.Option value={data}>{data}</Select.Option>
                            );
                          })}
                      </CustomSelect>
                    </Form.Item>
                  </Wrapper>

                  <Wrapper width={`calc(80% - 4px)`}>
                    <Form.Item name="phoneNumber2" rules={[{ required: true }]}>
                      <CusotmInput width={`100%`} radius={`5px`} />
                    </Form.Item>
                  </Wrapper>
                </Wrapper>
              </Wrapper>
              <Wrapper>
                <Form.Item>
                  <CusotmInput width={`100%`} radius={`5px`} />
                </Form.Item>
              </Wrapper>

              <Wrapper al={`flex-start`} margin={`0 0 35px`}>
                <Text
                  fontSize={width < 700 ? `16px` : `18px`}
                  fontWeight={`bold`}
                  margin={`0 0 10px`}
                  lineHeight={`1.22`}
                >
                  Please choose your available class hours.
                </Text>
                <Text
                  fontSize={width < 700 ? `16px` : `18px`}
                  margin={`0 0 10px`}
                  lineHeight={`1.19`}
                >
                  Stated time are in Korean Standard Time(GMT +9). Please check
                  all that apply.
                </Text>
              </Wrapper>
              <Wrapper dr={`row`} margin={`0 0 68px`}>
                {timeArr &&
                  timeArr.map((data) => {
                    return (
                      <Wrapper
                        width={
                          width < 700 ? `calc(100% / 2)` : `calc(100% / 3)`
                        }
                        fontSize={width < 700 ? `16px` : `18px`}
                        al={`flex-start`}
                      >
                        <CustomCheckBox2
                          checked={timeSelect === data}
                          onChange={() => timeSelectToggle(data)}
                        >
                          {data}
                        </CustomCheckBox2>
                      </Wrapper>
                    );
                  })}
              </Wrapper>

              <Wrapper
                color={Theme.red_C}
                fontSize={width < 700 ? `14px` : `18px`}
              >
                <Text>Do you agree to the terms of our Student Rules?</Text>
                {width < 700 ? (
                  <>
                    <Text>Please make sure you have read our</Text>
                    <Text>student rules via the following link.*</Text>
                  </>
                ) : (
                  <Text>
                    Please make sure you have read our student rules via the
                    following link.*
                  </Text>
                )}
              </Wrapper>
              <Wrapper>
                <SpanText
                  fontSize={width < 700 ? `14px` : `16px`}
                  margin={`42px 0 28px`}
                  textDecoration={"underline"}
                >
                  https://drive.google.com/file/d/14ccUCUmYMGk04y-4NF3TK5qP8Vvgc_02/view?usp=sharing
                </SpanText>

                <CustomCheckBox2
                  checked={agreeCheck}
                  onChange={agreeCheckToggle}
                >
                  Yes, I agree
                </CustomCheckBox2>
              </Wrapper>

              <Wrapper al={`flex-start`}>
                <Wrapper
                  fontSize={width < 700 ? `14px` : `18px`}
                  fontWeight={`bold`}
                  margin={`48px 0 10px`}
                  lineHeight={`1.22`}
                >
                  {width < 700 ? (
                    <>
                      <Text>Do you have any other questions or</Text>
                      <Text>comments about our program?</Text>
                    </>
                  ) : (
                    <Text>
                      Do you have any other questions or comments about our
                      program?
                    </Text>
                  )}
                </Wrapper>
                <Form.Item name="comment" rules={[{ requierd: true }]}>
                  <CusotmArea width={`100%`} />
                </Form.Item>
              </Wrapper>

              <Wrapper margin={`12px 0 0`}>
                <CommonButton
                  width={`121px`}
                  height={`34px`}
                  radius={`5px`}
                  htmlType="submit"
                >
                  submission
                </CommonButton>
              </Wrapper>
            </CustomForm>
          </RsWrapper>
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

export default Application;
