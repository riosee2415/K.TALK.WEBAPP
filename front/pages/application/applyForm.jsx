import React, { useState, useCallback, useRef, useEffect } from "react";
import ClientLayout from "../../components/ClientLayout";
import { SEO_LIST_REQUEST } from "../../reducers/seo";
import Head from "next/head";
import wrapper from "../../store/configureStore";
import { LOAD_MY_INFO_REQUEST } from "../../reducers/user";
import axios from "axios";
import { END } from "redux-saga";
import { useSelector, useDispatch } from "react-redux";
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
import styled from "styled-components";
import { Button, Calendar, Checkbox, Form, Input, message, Select } from "antd";
import useWidth from "../../hooks/useWidth";
import { CalendarOutlined, CaretDownOutlined } from "@ant-design/icons";
import { APP_CREATE_REQUEST } from "../../reducers/application";
import useInput from "../../hooks/useInput";

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

const CustomSelect = styled(Select)`
  width: 100%;

  &:not(.ant-select-customize-input) .ant-select-selector {
    border: none !important;
    box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.05);
  }

  & .ant-select-selector {
    width: 100% !important;
    height: 40px !important;
    padding: 5px 0 0 10px !important;
    border-radius: 5px;
  }

  & .ant-select-arrow span svg {
    color: ${Theme.black_C};
  }
`;

const CusotmInput = styled(TextInput)`
  border: none;
  box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.05);

  &::placeholder {
    color: ${Theme.grey_C};
  }
`;

const ApplyForm = () => {
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

  const [timeSelect, setTimeSelect] = useState(null);
  const [isCalendar, setIsCalendar] = useState(false);
  const [isCalendar2, setIsCalendar2] = useState(false);

  const [gender, setGender] = useState([false, false]);

  const [form] = Form.useForm();
  const formRef = useRef();

  //

  ////// REDUX //////
  ////// USEEFFECT //////

  useEffect(() => {
    if (st_appCreateDone) {
      form.resetFields();

      timeSelect(null);
      isCalendar(false);
      setIsCalendar2(false);

      return message.success("Your application has been submitted.");
    }
  }, [st_appCreateDone]);

  useEffect(() => {
    if (st_appCreateError) {
      return message.error(st_appCreateError);
    }
  }, [st_appCreateError]);
  ////// TOGGLE //////

  const calenderToggle = useCallback(() => {
    setIsCalendar(!isCalendar);
  }, [isCalendar]);

  const calenderToggle2 = useCallback(() => {
    setIsCalendar2(!isCalendar2);
  }, [isCalendar2]);

  ////// HANDLER //////

  const submissionHandler = useCallback((data) => {
    // if () {
    //   return message.error("Please select a time.");
    // }
    let save = gender.filter((data) => (data ? data : null));

    // dispatch({
    //   type: APPLY_CREATE_REQUEST,
    //   data: {
    //     firstName: data.firstName,
    //     lastName: data.lastName,
    //     title: titleSelect === "Others." ? data.title : titleSelect,
    //     dateOfBirth: `${data.year}-${data.month}-${data.date}`,
    //     gmailAddress: `${data.firstEmail}${data.lastEmail}`,
    //     nationality: data.nationality,
    //     countryOfResidence: data.countryOfResidence,
    //     languageYouUse: data.languageYouUse,
    //     phoneNumber: data.phoneNumber,
    //     phoneNumber2: data.phoneNumber2,
    //     classHour: timeSelect,
    //     terms: agreeCheck,
    //     comment: data.comment,
    //   },
    // });
  }, []);

  const dateChagneHandler = useCallback((data) => {
    const birth = data.format("YYYY-MM-DD");
    formRef.current.setFieldsValue({
      date1: birth.split("-")[2],
      month1: birth.split("-")[1],
      year1: birth.split("-")[0],
    });
  }, []);

  const dateChagneHandler2 = useCallback((data) => {
    const birth = data.format("YYYY-MM-DD");
    formRef.current.setFieldsValue({
      date2: birth.split("-")[2],
      month2: birth.split("-")[1],
      year2: birth.split("-")[0],
    });
  }, []);

  const onGenderHandler = useCallback((e, idx) => {
    let save = gender.map((data, idx2) => {
      return idx2 === idx ? !data : data;
    });

    setGender(save);
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
        <WholeWrapper
          bgColor={Theme.subTheme_C}
          padding={`80px 0`}
          margin={width < 700 ? `50px 0 0` : `100px 0 0`}>
          <RsWrapper>
            <Wrapper fontSize={`18px`} color={Theme.grey2_C}>
              For absolute beginners / For pre-intermediate learners
            </Wrapper>
            <Wrapper fontSize={`28px`} fontWeight={`bold`} margin={`0 0 70px`}>
              설명회 참가신청서 (초급/중급)
            </Wrapper>

            <CustomForm onFinish={submissionHandler} form={form} ref={formRef}>
              <Wrapper al={`flex-start`}>
                <Text
                  fontSize={`18px`}
                  fontWeight={`bold`}
                  margin={`0 0 10px`}
                  lineHeight={`1.22`}>
                  Name in full (First/Last)
                </Text>
                <Wrapper dr={`row`} ju={`flex-start`}>
                  <Wrapper width={`calc(100% / 2 - 4px)`} margin={`0 8px 0 0`}>
                    <Form.Item name="firstName1" rules={[{ required: true }]}>
                      <CusotmInput
                        width={`100%`}
                        placeholder={"First"}
                        radius={`5px`}
                      />
                    </Form.Item>
                  </Wrapper>

                  <Wrapper width={`calc(100% / 2 - 4px)`}>
                    <Form.Item name="lastName1" rules={[{ required: true }]}>
                      <CusotmInput
                        width={`100%`}
                        placeholder={"Last"}
                        radius={`5px`}
                      />
                    </Form.Item>
                  </Wrapper>
                </Wrapper>
              </Wrapper>

              <Wrapper al={`flex-start`} position={"relative"}>
                <Text
                  fontSize={`18px`}
                  fontWeight={`bold`}
                  margin={`0 0 10px`}
                  lineHeight={`1.22`}>
                  Date of Birth
                </Text>
                <Wrapper dr={`row`} ju={`flex-start`}>
                  <Wrapper width={`calc(100% / 3 - 16px)`}>
                    <Form.Item name="date1" rules={[{ requierd: true }]}>
                      <CusotmInput
                        readOnly
                        width={`100%`}
                        radius={`5px`}
                        placeholder={"Date"}
                      />
                    </Form.Item>
                  </Wrapper>

                  <Wrapper width={`calc(100% / 3 - 16px)`} margin={`0 9px`}>
                    <Form.Item name="month1" rules={[{ requierd: true }]}>
                      <CusotmInput
                        readOnly
                        width={`100%`}
                        radius={`5px`}
                        placeholder={"Month"}
                      />
                    </Form.Item>
                  </Wrapper>

                  <Wrapper width={`calc(100% / 3 - 16px)`}>
                    <Form.Item name="year1" rules={[{ requierd: true }]}>
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
                    fontSize={`30px`}>
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
                  margin={`0 0 20px`}>
                  <Calendar
                    style={{ width: width < 1350 ? `100%` : `300px` }}
                    fullscreen={false}
                    onChange={dateChagneHandler}
                  />
                </Wrapper>
              </Wrapper>
              <Wrapper al={`flex-start`}>
                <Text
                  fontSize={`18px`}
                  fontWeight={`bold`}
                  margin={`0 0 10px`}
                  lineHeight={`1.22`}>
                  Gmail Address
                </Text>
                <Wrapper dr={`row`} ju={`flex-start`}>
                  <Wrapper width={`calc(100% / 2 - 4px)`} margin={`0 8px 0 0`}>
                    <Form.Item name="firstEmail1" rules={[{ required: true }]}>
                      <CusotmInput
                        width={`100%`}
                        radius={`5px`}
                        placeholder={"Address"}
                      />
                    </Form.Item>
                  </Wrapper>

                  <Wrapper width={`calc(100% / 2 - 4px)`}>
                    <Form.Item name="lastEmail1" rules={[{ required: true }]}>
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
                  fontSize={`18px`}
                  fontWeight={`bold`}
                  margin={`0 0 10px`}
                  lineHeight={`1.22`}>
                  Login PW
                </Text>
                <Wrapper dr={`row`} ju={`flex-start`}>
                  <Form.Item name="loginPW1" rules={[{ required: true }]}>
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
                  fontSize={`18px`}
                  fontWeight={`bold`}
                  margin={`0 0 10px`}
                  lineHeight={`1.22`}>
                  Country of Residence
                </Text>
                <Wrapper dr={`row`} ju={`flex-start`}>
                  <Form.Item
                    name="countryOfResidence1"
                    rules={[{ required: true }]}>
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
                  fontSize={`18px`}
                  fontWeight={`bold`}
                  margin={`0 0 10px`}
                  lineHeight={`1.22`}>
                  Language you use
                </Text>
                <Wrapper dr={`row`} ju={`flex-start`}>
                  <Form.Item
                    name="languageYouUse1"
                    rules={[{ required: true }]}>
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
                  fontSize={`18px`}
                  fontWeight={`bold`}
                  margin={`0 0 10px`}
                  lineHeight={`1.22`}>
                  Phone number
                </Text>
                <Wrapper dr={`row`} ju={`flex-start`}>
                  <Wrapper width={`calc(20% - 4px)`} margin={`0 8px 0 0`}>
                    <Form.Item name="phoneNumber1" rules={[{ required: true }]}>
                      <CustomSelect
                        suffixIcon={() => {
                          return <CaretDownOutlined />;
                        }}>
                        <Select.Option value={"1"}>test1</Select.Option>
                        <Select.Option value={"2"}>test2</Select.Option>
                        <Select.Option value={"3"}>test3</Select.Option>
                        <Select.Option value={"4"}>test4</Select.Option>
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

              <Wrapper margin={`100px 0 70px`}>
                <Wrapper fontSize={`18px`} color={Theme.grey2_C}>
                  K-talk Live regular paid lessons
                </Wrapper>
                <Wrapper
                  fontSize={`28px`}
                  fontWeight={`bold`}
                  margin={`0 0 70px`}>
                  정규과정 등록신청서
                </Wrapper>

                <Wrapper al={`flex-start`}>
                  <Text
                    fontSize={`18px`}
                    fontWeight={`bold`}
                    margin={`0 0 10px`}
                    lineHeight={`1.22`}>
                    Name in full (First/Last)
                  </Text>
                  <Wrapper dr={`row`} ju={`flex-start`}>
                    <Wrapper
                      width={`calc(100% / 2 - 4px)`}
                      margin={`0 8px 0 0`}>
                      <Form.Item name="firstName2" rules={[{ required: true }]}>
                        <CusotmInput
                          width={`100%`}
                          placeholder={"First"}
                          radius={`5px`}
                        />
                      </Form.Item>
                    </Wrapper>

                    <Wrapper width={`calc(100% / 2 - 4px)`}>
                      <Form.Item name="lastName2" rules={[{ required: true }]}>
                        <CusotmInput
                          width={`100%`}
                          placeholder={"Last"}
                          radius={`5px`}
                        />
                      </Form.Item>
                    </Wrapper>
                  </Wrapper>
                </Wrapper>

                <Wrapper al={`flex-start`} position={"relative"}>
                  <Text
                    fontSize={`18px`}
                    fontWeight={`bold`}
                    margin={`0 0 10px`}
                    lineHeight={`1.22`}>
                    Date of Birth
                  </Text>
                  <Wrapper dr={`row`} ju={`flex-start`}>
                    <Wrapper width={`calc(100% / 3 - 16px)`}>
                      <Form.Item name="date2" rules={[{ requierd: true }]}>
                        <CusotmInput
                          readOnly
                          width={`100%`}
                          radius={`5px`}
                          placeholder={"Date"}
                        />
                      </Form.Item>
                    </Wrapper>

                    <Wrapper width={`calc(100% / 3 - 16px)`} margin={`0 9px`}>
                      <Form.Item name="month2" rules={[{ requierd: true }]}>
                        <CusotmInput
                          readOnly
                          width={`100%`}
                          radius={`5px`}
                          placeholder={"Month"}
                        />
                      </Form.Item>
                    </Wrapper>

                    <Wrapper width={`calc(100% / 3 - 16px)`}>
                      <Form.Item name="year2" rules={[{ requierd: true }]}>
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
                      fontSize={`30px`}>
                      <CalendarOutlined onClick={calenderToggle2} />
                    </Wrapper>
                  </Wrapper>

                  <Wrapper
                    display={isCalendar2 ? "flex" : "none"}
                    width={`auto`}
                    position={width < 1350 ? `static` : `absolute`}
                    top={`40px`}
                    right={`-310px`}
                    border={`1px solid ${Theme.grey_C}`}
                    margin={`0 0 20px`}>
                    <Calendar
                      style={{ width: width < 1350 ? `100%` : `300px` }}
                      fullscreen={false}
                      onChange={dateChagneHandler2}
                    />
                  </Wrapper>
                </Wrapper>
                <Wrapper al={`flex-start`}>
                  <Text
                    fontSize={`18px`}
                    fontWeight={`bold`}
                    margin={`0 0 10px`}
                    lineHeight={`1.22`}>
                    Gmail Address
                  </Text>
                  <Wrapper dr={`row`} ju={`flex-start`}>
                    <Wrapper
                      width={`calc(100% / 2 - 4px)`}
                      margin={`0 8px 0 0`}>
                      <Form.Item
                        name="firstEmail2"
                        rules={[{ required: true }]}>
                        <CusotmInput
                          width={`100%`}
                          radius={`5px`}
                          placeholder={"Address"}
                        />
                      </Form.Item>
                    </Wrapper>

                    <Wrapper width={`calc(100% / 2 - 4px)`}>
                      <Form.Item name="lastEmail2" rules={[{ required: true }]}>
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
                    fontSize={`18px`}
                    fontWeight={`bold`}
                    margin={`0 0 10px`}
                    lineHeight={`1.22`}>
                    Login PW
                  </Text>
                  <Wrapper dr={`row`} ju={`flex-start`}>
                    <Form.Item name="loginPW2" rules={[{ required: true }]}>
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
                    fontSize={`18px`}
                    fontWeight={`bold`}
                    margin={`0 0 10px`}
                    lineHeight={`1.22`}>
                    성별
                  </Text>
                  <Wrapper dr={`row`} ju={`flex-start`}>
                    <Form.Item name="gender">
                      <CustomCheckBox
                        width={`100%`}
                        radius={`5px`}
                        checked={gender[0]}
                        onChange={(e) => onGenderHandler(e, 0)}>
                        Male
                      </CustomCheckBox>

                      <CustomCheckBox
                        width={`100%`}
                        radius={`5px`}
                        checked={gender[1]}
                        onChange={(e) => onGenderHandler(e, 1)}>
                        Female
                      </CustomCheckBox>
                    </Form.Item>
                  </Wrapper>
                </Wrapper>

                <Wrapper al={`flex-start`}>
                  <Text
                    fontSize={`18px`}
                    fontWeight={`bold`}
                    margin={`0 0 10px`}
                    lineHeight={`1.22`}>
                    Country of Residence
                  </Text>
                  <Wrapper dr={`row`} ju={`flex-start`}>
                    <Form.Item
                      name="countryOfResidence2"
                      rules={[{ required: true }]}>
                      <CusotmInput
                        width={`100%`}
                        radius={`5px`}
                        placeholder={"Select Country of Residence"}
                      />
                    </Form.Item>
                  </Wrapper>
                </Wrapper>
                <Wrapper al={`flex-start`}>
                  <Text
                    fontSize={`18px`}
                    fontWeight={`bold`}
                    margin={`0 0 10px`}
                    lineHeight={`1.22`}>
                    Language you use
                  </Text>
                  <Wrapper dr={`row`} ju={`flex-start`}>
                    <Form.Item
                      name="languageYouUse2"
                      rules={[{ required: true }]}>
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
                    fontSize={`18px`}
                    fontWeight={`bold`}
                    margin={`0 0 10px`}
                    lineHeight={`1.22`}>
                    Phone number
                  </Text>
                  <Wrapper dr={`row`} ju={`flex-start`}>
                    <Wrapper width={`calc(20% - 4px)`} margin={`0 8px 0 0`}>
                      <Form.Item
                        name="phoneNumber3"
                        rules={[{ required: true }]}>
                        <CustomSelect
                          suffixIcon={() => {
                            return <CaretDownOutlined />;
                          }}>
                          <Select.Option value={"1"}>test1</Select.Option>
                          <Select.Option value={"2"}>test2</Select.Option>
                          <Select.Option value={"3"}>test3</Select.Option>
                          <Select.Option value={"4"}>test4</Select.Option>
                        </CustomSelect>
                      </Form.Item>
                    </Wrapper>

                    <Wrapper width={`calc(80% - 4px)`}>
                      <Form.Item
                        name="phoneNumber4"
                        rules={[{ required: true }]}>
                        <CusotmInput width={`100%`} radius={`5px`} />
                      </Form.Item>
                    </Wrapper>
                  </Wrapper>
                </Wrapper>

                <Wrapper al={`flex-start`}>
                  <Text
                    fontSize={`18px`}
                    fontWeight={`bold`}
                    margin={`0 0 10px`}
                    lineHeight={`1.22`}>
                    SNS
                  </Text>
                  <Wrapper dr={`row`} ju={`flex-start`}>
                    <Wrapper width={`calc(20% - 4px)`} margin={`0 8px 0 0`}>
                      <Form.Item
                        name="SnSPhoneNumber1"
                        rules={[{ required: true }]}>
                        <CustomSelect
                          suffixIcon={() => {
                            return <CaretDownOutlined />;
                          }}>
                          <Select.Option value={"1"}>test</Select.Option>
                          <Select.Option value={"2"}>test2</Select.Option>
                          <Select.Option value={"3"}>test3</Select.Option>
                          <Select.Option value={"4"}>test4</Select.Option>
                        </CustomSelect>
                      </Form.Item>
                    </Wrapper>

                    <Wrapper width={`calc(80% - 4px)`}>
                      <Form.Item
                        name="SnSPhoneNumber2"
                        rules={[{ required: true }]}>
                        <CusotmInput width={`100%`} radius={`5px`} />
                      </Form.Item>
                    </Wrapper>
                  </Wrapper>
                </Wrapper>

                <Wrapper al={`flex-start`}>
                  <Text
                    fontSize={`18px`}
                    fontWeight={`bold`}
                    margin={`0 0 10px`}
                    lineHeight={`1.22`}>
                    Occupation
                  </Text>
                  <Wrapper dr={`row`} ju={`flex-start`}>
                    <Form.Item name="occupation" rules={[{ required: true }]}>
                      <CusotmInput
                        width={`100%`}
                        radius={`5px`}
                        placeholder={"Select Your Occupation"}
                      />
                    </Form.Item>
                  </Wrapper>
                </Wrapper>
              </Wrapper>

              <Wrapper margin={`12px 0 0`}>
                <CommonButton
                  width={`121px`}
                  height={`34px`}
                  radius={`5px`}
                  htmlType="submit">
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

export default ApplyForm;
