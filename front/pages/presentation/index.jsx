import React, { useCallback, useState } from "react";

import { useSelector } from "react-redux";
import { END } from "redux-saga";
import Head from "next/head";
import axios from "axios";
import wrapper from "../../store/configureStore";

import { Form, Select, Calendar } from "antd";
import styled from "styled-components";
import { CalendarOutlined, CaretDownOutlined } from "@ant-design/icons";
import ClientLayout from "../../components/ClientLayout";
import {
  WholeWrapper,
  RsWrapper,
  Wrapper,
  Text,
  TextInput,
  CommonButton,
} from "../../components/commonComponents";
import Theme from "../../components/Theme";

import useWidth from "../../hooks/useWidth";
import { SEO_LIST_REQUEST } from "../../reducers/seo";
import { LOAD_MY_INFO_REQUEST } from "../../reducers/user";

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

const CusotmInput = styled(TextInput)`
  /* border: none; */
  box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.16);
  border-radius: 5px;

  &::placeholder {
    color: ${Theme.grey2_C};
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

const Presentation = () => {
  ////// GLOBAL STATE //////
  const { seo_keywords, seo_desc, seo_ogImage, seo_title } = useSelector(
    (state) => state.seo
  );

  ////// HOOKS //////

  const width = useWidth();

  const [isCalendar, setIsCalendar] = useState(false);
  const [isCalendar2, setIsCalendar2] = useState(false);

  const [form] = Form.useForm();

  ////// TOGGLE //////

  const calenderToggle = useCallback(() => {
    setIsCalendar(!isCalendar);
  }, [isCalendar]);

  const calender2Toggle = useCallback(() => {
    setIsCalendar2(!isCalendar2);
  }, [isCalendar2]);

  ////// HANDLER //////

  const dateChagneHandler = useCallback((data) => {
    const birth = data.format("YYYY-MM-DD");
    form.setFieldsValue({
      date: birth.split("-")[2],
      month: birth.split("-")[1],
      year: birth.split("-")[0],
    });
  }, []);

  const dateChagneHandler2 = useCallback((data) => {
    const birth = data.format("YYYY-MM-DD");
    form.setFieldsValue({
      date2: birth.split("-")[2],
      month2: birth.split("-")[1],
      year2: birth.split("-")[0],
    });
  }, []);

  const submitHandler = useCallback((data) => {
    console.log(data);
  }, []);

  ////// DATAVIEW //////

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
        <title>{seo_title.length < 1 ? "ALAL" : seo_title[0].content}</title>

        <meta
          name="subject"
          content={seo_title.length < 1 ? "ALAL" : seo_title[0].content}
        />
        <meta
          name="title"
          content={seo_title.length < 1 ? "ALAL" : seo_title[0].content}
        />
        <meta name="keywords" content={seo_keywords} />
        <meta
          name="description"
          content={
            seo_desc.length < 1 ? "undefined description" : seo_desc[0].content
          }
        />
        {/* <!-- OG tag  --> */}
        <meta
          property="og:title"
          content={seo_title.length < 1 ? "ALAL" : seo_title[0].content}
        />
        <meta
          property="og:site_name"
          content={seo_title.length < 1 ? "ALAL" : seo_title[0].content}
        />
        <meta
          property="og:description"
          content={
            seo_desc.length < 1 ? "undefined description" : seo_desc[0].content
          }
        />
        <meta property="og:keywords" content={seo_keywords} />
        <meta
          property="og:image"
          content={seo_ogImage.length < 1 ? "" : seo_ogImage[0].content}
        />
      </Head>
      <ClientLayout>
        <WholeWrapper margin={`100px 0`}>
          <RsWrapper>
            <Wrapper margin={width < 700 ? `20px 0 30px` : `90px 0 68px`}>
              {width < 700 ? (
                <>
                  <Text color={Theme.grey2_C}>For absolute beginners</Text>
                  <Text color={Theme.grey2_C}>
                    For pre-intermediate leamers
                  </Text>
                </>
              ) : (
                <Text color={Theme.grey2_C}>
                  For absolute beginners / For pre-intermediate leamers
                </Text>
              )}
              <Text
                fontSize={width < 700 ? `20px` : `28px`}
                fontWeight={`bold`}
              >
                설명회 참가신청서 (초급/중급)
              </Text>
            </Wrapper>
            <CustomForm onFinish={submitHandler} form={form}>
              <Text
                fontSize={width < 700 ? `16px` : `18px`}
                fontWeight={`bold`}
                margin={`0 0 10px`}
              >
                Name in full (First / Last)
              </Text>
              <Wrapper dr={`row`} ju={`space-between`}>
                <Wrapper width={`calc(50% - 4px)`}>
                  <Form.Item name="firstName" rules={[{ required: true }]}>
                    <CusotmInput placeholder="First" width={`100%`} />
                  </Form.Item>
                </Wrapper>
                <Wrapper width={`calc(50% - 4px)`}>
                  <Form.Item name="lastName" rules={[{ required: true }]}>
                    <CusotmInput placeholder="Last" width={`100%`} />
                  </Form.Item>
                </Wrapper>
              </Wrapper>
              <Wrapper al={`flex-start`} position={"relative"}>
                <Text
                  fontSize={width < 700 ? `16px` : `18px`}
                  fontWeight={`bold`}
                  margin={`0 0 10px`}
                >
                  Date of Birth
                </Text>
                <Wrapper dr={`row`} ju={`flex-start`}>
                  <Wrapper width={`calc(100% / 3 - 16px)`}>
                    <Form.Item name="date">
                      <CusotmInput
                        readOnly
                        width={`100%`}
                        placeholder={"Date"}
                      />
                    </Form.Item>
                  </Wrapper>

                  <Wrapper width={`calc(100% / 3 - 16px)`} margin={`0 9px`}>
                    <Form.Item name="month">
                      <CusotmInput
                        readOnly
                        width={`100%`}
                        placeholder={"Month"}
                      />
                    </Form.Item>
                  </Wrapper>

                  <Wrapper width={`calc(100% / 3 - 16px)`}>
                    <Form.Item name="year">
                      <CusotmInput
                        readOnly
                        width={`100%`}
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
                  top={`30px`}
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

              <Text
                fontSize={width < 700 ? `16px` : `18px`}
                fontWeight={`bold`}
                margin={`0 0 10px`}
              >
                Gmail Address
              </Text>
              <Wrapper dr={`row`} ju={`flex-start`}>
                <Wrapper width={`calc(100% / 2 - 4px)`} margin={`0 8px 0 0`}>
                  <Form.Item name="firstEmail" rules={[{ required: true }]}>
                    <CusotmInput width={`100%`} placeholder={"Address"} />
                  </Form.Item>
                </Wrapper>

                <Wrapper width={`calc(100% / 2 - 4px)`}>
                  <Form.Item name="lastEmail" rules={[{ required: true }]}>
                    <CusotmInput width={`100%`} placeholder={"@gmail.com"} />
                  </Form.Item>
                </Wrapper>
              </Wrapper>

              <Text
                fontSize={width < 700 ? `16px` : `18px`}
                fontWeight={`bold`}
                margin={`0 0 10px`}
              >
                Login PW
              </Text>
              <Form.Item name="loginPW" rules={[{ required: true }]}>
                <CusotmInput
                  type="password"
                  width={`100%`}
                  placeholder={"PW"}
                />
              </Form.Item>
              <Text
                fontSize={width < 700 ? `16px` : `18px`}
                fontWeight={`bold`}
                margin={`0 0 10px`}
              >
                Country of Residence
              </Text>
              <Form.Item name="countryOfResidence" rules={[{ required: true }]}>
                <CusotmInput width={`100%`} placeholder={"Nationality"} />
              </Form.Item>
              <Text
                fontSize={width < 700 ? `16px` : `18px`}
                fontWeight={`bold`}
                margin={`0 0 10px`}
              >
                Phone number
              </Text>
              <Wrapper dr={`row`} ju={`flex-start`}>
                <Wrapper width={`calc(20% - 4px)`} margin={`0 8px 0 0`}>
                  <Form.Item
                    name="firstPhoneNumber"
                    rules={[{ required: true }]}
                  >
                    <CustomSelect
                      suffixIcon={() => {
                        return <CaretDownOutlined />;
                      }}
                    >
                      {firstPhoneArr &&
                        firstPhoneArr.map((data) => {
                          return (
                            <Select.Option key={data} value={data}>
                              {data}
                            </Select.Option>
                          );
                        })}
                    </CustomSelect>
                  </Form.Item>
                </Wrapper>

                <Wrapper width={`calc(80% - 4px)`}>
                  <Form.Item
                    name="lastPhoneNumber"
                    rules={[{ required: true }]}
                  >
                    <CusotmInput type="number" width={`100%`} />
                  </Form.Item>
                </Wrapper>
              </Wrapper>

              <Wrapper margin={width < 700 ? `20px 0 30px` : `90px 0 68px`}>
                <Text color={Theme.grey2_C}>
                  K-talk Live regular paid lessons
                </Text>
                <Text
                  fontSize={width < 700 ? `20px` : `28px`}
                  fontWeight={`bold`}
                >
                  정규과정 등록신청서
                </Text>
              </Wrapper>
              <Text
                fontSize={width < 700 ? `16px` : `18px`}
                fontWeight={`bold`}
                margin={`0 0 10px`}
              >
                Name in full (First / Last)
              </Text>
              <Wrapper dr={`row`} ju={`space-between`}>
                <Wrapper width={`calc(50% - 4px)`}>
                  <Form.Item
                    name="firstname2"
                    rules={[
                      { required: true, message: "'firstname' is required" },
                    ]}
                  >
                    <CusotmInput placeholder="First" width={`100%`} />
                  </Form.Item>
                </Wrapper>
                <Wrapper width={`calc(50% - 4px)`}>
                  <Form.Item
                    name="lastname2"
                    rules={[
                      { required: true, message: "'lastname' is required" },
                    ]}
                  >
                    <CusotmInput placeholder="Last" width={`100%`} />
                  </Form.Item>
                </Wrapper>
              </Wrapper>
              <Wrapper al={`flex-start`} position={"relative"}>
                <Text
                  fontSize={width < 700 ? `16px` : `18px`}
                  fontWeight={`bold`}
                  margin={`0 0 10px`}
                >
                  Date of Birth
                </Text>
                <Wrapper dr={`row`} ju={`flex-start`}>
                  <Wrapper width={`calc(100% / 3 - 16px)`}>
                    <Form.Item name="date2">
                      <CusotmInput
                        readOnly
                        width={`100%`}
                        placeholder={"Date"}
                      />
                    </Form.Item>
                  </Wrapper>

                  <Wrapper width={`calc(100% / 3 - 16px)`} margin={`0 9px`}>
                    <Form.Item name="month2">
                      <CusotmInput
                        readOnly
                        width={`100%`}
                        placeholder={"Month"}
                      />
                    </Form.Item>
                  </Wrapper>

                  <Wrapper width={`calc(100% / 3 - 16px)`}>
                    <Form.Item name="year2">
                      <CusotmInput
                        readOnly
                        width={`100%`}
                        placeholder={"Year"}
                      />
                    </Form.Item>
                  </Wrapper>
                  <Wrapper
                    width={`30px`}
                    margin={width < 700 ? `0 0 28px` : `0 0 48px`}
                    fontSize={width < 700 ? `20px` : `30px`}
                  >
                    <CalendarOutlined onClick={calender2Toggle} />
                  </Wrapper>
                </Wrapper>

                <Wrapper
                  display={isCalendar2 ? "flex" : "none"}
                  width={`auto`}
                  position={width < 1350 ? `static` : `absolute`}
                  top={`30px`}
                  right={`-310px`}
                  border={`1px solid ${Theme.grey_C}`}
                  margin={`0 0 20px`}
                >
                  <Calendar
                    style={{ width: width < 1350 ? `100%` : `300px` }}
                    fullscreen={false}
                    onChange={dateChagneHandler2}
                  />
                </Wrapper>
              </Wrapper>

              <Text
                fontSize={width < 700 ? `16px` : `18px`}
                fontWeight={`bold`}
                margin={`0 0 10px`}
              >
                Gmail Address
              </Text>
              <Wrapper dr={`row`} ju={`flex-start`}>
                <Wrapper width={`calc(100% / 2 - 4px)`} margin={`0 8px 0 0`}>
                  <Form.Item
                    name="firstEmail2"
                    rules={[
                      { required: true, message: "'firstEmail' is required" },
                    ]}
                  >
                    <CusotmInput width={`100%`} placeholder={"Address"} />
                  </Form.Item>
                </Wrapper>

                <Wrapper width={`calc(100% / 2 - 4px)`}>
                  <Form.Item
                    name="lastEmail2"
                    rules={[
                      { required: true, message: "'lastEmail' is required" },
                    ]}
                  >
                    <CusotmInput width={`100%`} placeholder={"@gmail.com"} />
                  </Form.Item>
                </Wrapper>
              </Wrapper>

              <Text
                fontSize={width < 700 ? `16px` : `18px`}
                fontWeight={`bold`}
                margin={`0 0 10px`}
              >
                Login PW
              </Text>
              <Form.Item
                name="loginPW2"
                rules={[{ required: true, message: "'loginPW' is required" }]}
              >
                <CusotmInput
                  type="password"
                  width={`100%`}
                  placeholder={"PW"}
                />
              </Form.Item>
              <Text
                fontSize={width < 700 ? `16px` : `18px`}
                fontWeight={`bold`}
                margin={`0 0 10px`}
                lineHeight={`1.22`}
              >
                Nationality
              </Text>
              <Form.Item name="nationality2" rules={[{ required: true }]}>
                <CusotmInput
                  width={`100%`}
                  radius={`5px`}
                  placeholder={"Select Nationality"}
                />
              </Form.Item>
              <Text
                fontSize={width < 700 ? `16px` : `18px`}
                fontWeight={`bold`}
                margin={`0 0 10px`}
              >
                Country of Residence
              </Text>
              <Form.Item
                name="countryOfResidence2"
                rules={[
                  {
                    required: true,
                    message: "'country of Residence' is required",
                  },
                ]}
              >
                <CusotmInput
                  width={`100%`}
                  placeholder={"Select Country of Residence"}
                />
              </Form.Item>
              <Text
                fontSize={width < 700 ? `16px` : `18px`}
                fontWeight={`bold`}
                margin={`0 0 10px`}
                lineHeight={`1.22`}
              >
                Language you use
              </Text>
              <Wrapper dr={`row`} ju={`flex-start`}>
                <Form.Item
                  name="languageYouUse2"
                  rules={[
                    {
                      required: true,
                      message: "'language you user' is required",
                    },
                  ]}
                >
                  <CusotmInput
                    width={`100%`}
                    radius={`5px`}
                    placeholder={"Select Languge"}
                  />
                </Form.Item>
              </Wrapper>
              <Text
                fontSize={width < 700 ? `16px` : `18px`}
                fontWeight={`bold`}
                margin={`0 0 10px`}
              >
                Phone number
              </Text>
              <Wrapper dr={`row`} ju={`flex-start`}>
                <Wrapper width={`calc(20% - 4px)`} margin={`0 8px 0 0`}>
                  <Form.Item
                    name="firstPhoneNumber2"
                    rules={[
                      {
                        required: true,
                        message: "'firstPhoneNumber' is required",
                      },
                    ]}
                  >
                    <CustomSelect
                      suffixIcon={() => {
                        return <CaretDownOutlined />;
                      }}
                    >
                      {firstPhoneArr &&
                        firstPhoneArr.map((data) => {
                          return (
                            <Select.Option key={data} value={data}>
                              {data}
                            </Select.Option>
                          );
                        })}
                    </CustomSelect>
                  </Form.Item>
                </Wrapper>

                <Wrapper width={`calc(80% - 4px)`}>
                  <Form.Item
                    name="lastPhoneNumber2"
                    rules={[
                      {
                        required: true,
                        message: "'lasyPhonNumber' is required",
                      },
                    ]}
                  >
                    <CusotmInput type="number" width={`100%`} />
                  </Form.Item>
                </Wrapper>
              </Wrapper>

              <Text
                fontSize={width < 700 ? `16px` : `18px`}
                fontWeight={`bold`}
                margin={`0 0 10px`}
              >
                SNS
              </Text>
              <Wrapper dr={`row`} ju={`flex-start`}>
                <Wrapper width={`calc(20% - 4px)`} margin={`0 8px 0 0`}>
                  <Form.Item
                    name="firstsns2"
                    rules={[
                      { required: true, message: "'firstsns' is required" },
                    ]}
                  >
                    <CustomSelect
                      placeholder="SNS"
                      suffixIcon={() => {
                        return <CaretDownOutlined />;
                      }}
                    >
                      {firstPhoneArr &&
                        firstPhoneArr.map((data) => {
                          return (
                            <Select.Option key={data} value={data}>
                              {data}
                            </Select.Option>
                          );
                        })}
                    </CustomSelect>
                  </Form.Item>
                </Wrapper>

                <Wrapper width={`calc(80% - 4px)`}>
                  <Form.Item
                    name="lastsns2"
                    rules={[
                      { required: true, message: "'lastsns' is required" },
                    ]}
                  >
                    <CusotmInput placeholder={`ID`} width={`100%`} />
                  </Form.Item>
                </Wrapper>
              </Wrapper>

              <Text
                fontSize={width < 700 ? `16px` : `18px`}
                fontWeight={`bold`}
                margin={`0 0 10px`}
              >
                Occupation
              </Text>
              <Form.Item
                name="occupation2"
                rules={[
                  { required: true, message: "'occupation' is required" },
                ]}
              >
                <CustomSelect
                  suffixIcon={() => {
                    return <CaretDownOutlined />;
                  }}
                  width={`100%`}
                  placeholder={"Select Your Occupation"}
                >
                  {firstPhoneArr &&
                    firstPhoneArr.map((data) => {
                      return (
                        <Select.Option key={data} value={data}>
                          {data}
                        </Select.Option>
                      );
                    })}
                </CustomSelect>
              </Form.Item>

              <Wrapper>
                <CommonButton radius={`5px`} htmlType="submit">
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

export default Presentation;
