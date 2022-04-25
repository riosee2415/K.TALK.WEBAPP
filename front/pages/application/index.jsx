import React, { useState, useCallback, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { Calendar, Checkbox, Form, InputNumber, message, Select } from "antd";
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
  ATag,
} from "../../components/commonComponents";

import Theme from "../../components/Theme";
import useWidth from "../../hooks/useWidth";
import moment from "moment";
import { useRouter } from "next/router";

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

const CustomInputNumber = styled(InputNumber)`
  width: 100%;
  height: 40px;
  border: none;
  box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.16);
  border-radius: 5px;

  .ant-input-number-input {
    height: 40px;
  }

  .ant-input-number-handler-wrap {
    display: none;
  }

  &::placeholder {
    color: ${Theme.grey2_C};
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
  margin:${(props) => props.margin}

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
  width:${(props) => props.width}

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
  const router = useRouter();
  const [timeSelect, setTimeSelect] = useState([]);
  const [timeSelectCheck, setTimeSelectCheck] = useState(
    new Array(24).fill(false)
  );

  const [agreeCheck, setAgreeCheck] = useState(false);
  const [isCalendar, setIsCalendar] = useState(false);

  const [selectState, setSelectState] = useState(null);

  const [form] = Form.useForm();

  ////// REDUX //////
  ////// USEEFFECT //////

  useEffect(() => {
    form.setFieldsValue({
      lastEmail: "@gmail.com",
    });
  }, []);

  useEffect(() => {
    if (st_appCreateDone) {
      form.resetFields();
      form.setFieldsValue({
        lastEmail: "@gmail.com",
      });

      setTimeSelectCheck(new Array(24).fill(false));
      setTimeSelect([]);
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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  ////// TOGGLE //////

  const timeSelectToggle = useCallback(
    (select, idx) => {
      let arrPush = [...timeSelect];

      let save = timeSelectCheck.map((data, idx2) => {
        if (idx2 === idx) {
          arrPush.includes(select)
            ? arrPush.splice(arrPush.indexOf(select), 1)
            : arrPush.push(select);

          return !data;
        } else {
          return data;
        }
      });

      setTimeSelect(arrPush);
      setTimeSelectCheck(save);
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
      if (!timeSelect) {
        return message.error("Please select a time.");
      }
      if (!agreeCheck) {
        return message.error("Please agree to the terms and conditions.");
      }
      let classHour = "";
      timeSelect.map((data) => (classHour += `${data}  `));

      dispatch({
        type: APP_CREATE_REQUEST,
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          title: "-",
          dateOfBirth: `${data.year}-${data.month}-${data.date}`,
          gmailAddress: `${data.firstEmail}${data.lastEmail}`,
          nationality: data.nationality,
          countryOfResidence: data.countryOfResidence,
          languageYouUse: data.languageYouUse,
          phoneNumber:
            data.phoneNumber === "직접입력"
              ? data.phoneNumberInput
              : data.phoneNumber,
          phoneNumber2: data.phoneNumber2,
          classHour: classHour,
          terms: agreeCheck,
          comment: data.comment,
        },
      });
    },
    [timeSelect, agreeCheck]
  );

  const dateChagneHandler = useCallback((data) => {
    const birth = data.format("YYYY-MM-DD");
    form.setFieldsValue({
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
    "+93",
    "+355",
    "+213",
    "+1",
    "+376",
    "+244",

    "+64",
    "+672",

    "+54",
    "+374",
    "+297",
    "+247",
    "+61",
    "+43",
    "+994",

    "+973",
    "+880",

    "+375",
    "+32",
    "+501",
    "+229",

    "+975",
    "+591",
    "+387",
    "+267",
    "+55",

    "+673",
    "+359",
    "+226",
    "+95",
    "+257",
    "+855",
    "+237",
    "+1",
    "+238",

    "+236",
    "+235",
    "+56",
    "+86",
    "+57",
    "+269",
    "+242",
    "+682",
    "+506",
    "+385",
    "+53",
    "+357",
    "+420",
    "+243",
    "+45",
    "+246",
    "+253",

    "+593",
    "+20",
    "+503",
    "+240",
    "+291",
    "+372",
    "+251",
    "+500",
    "+298",
    "+679",
    "+358",
    "+33",
    "+594",
    "+689",
    "+241",
    "+220",
    "+995",
    "+49",
    "+233",
    "+350",
    "+30",
    "+299",

    "+590",

    "+502",
    "+224",
    "+245",
    "+592",
    "+509",
    "+39",
    "+504",
    "+852",
    "+36",
    "+354",
    "+91",
    "+62",
    "+98",
    "+964",
    "+353",
    "+44",
    "+972",
    "+39",
    "+225",

    "+81",
    "+44",
    "+962",
    "+7",
    "+254",
    "+686",
    "+965",
    "+996",
    "+856",
    "+371",
    "+961",
    "+266",
    "+231",
    "+218",
    "+423",
    "+370",
    "+352",
    "+853",
    "+389",
    "+261",
    "+265",
    "+60",
    "+960",
    "+223",
    "+356",
    "+692",
    "+596",
    "+222",
    "+230",
    "+262",
    "+52",
    "+691",
    "+373",
    "+377",
    "+976",
    "+382",

    "+212",
    "+258",
    "+264",
    "+674",
    "+977",
    "+31",
    "+599",
    "+687",
    "+64",
    "+505",
    "+227",
    "+234",
    "+683",
    "+672",
    "+850",

    "+47",
    "+968",
    "+92",
    "+680",
    "+970",
    "+507",
    "+675",
    "+595",
    "+51",
    "+63",
    "+870",
    "+48",
    "+351",

    "+974",
    "+242",
    "+262",
    "+40",
    "+7",
    "+250",
    "+590",
    "+290",

    "+590",
    "+508",

    "+685",
    "+378",
    "+239",
    "+966",
    "+221",
    "+381",
    "+248",
    "+232",
    "+65",

    "+421",
    "+386",
    "+677",
    "+252",
    "+27",
    "+82",
    "+211",
    "+34",
    "+94",
    "+249",
    "+597",
    "+47",
    "+268",
    "+46",
    "+41",
    "+963",
    "+886",
    "+992",
    "+255",
    "+66",
    "+670",
    "+228",
    "+690",
    "+676",

    "+216",
    "+90",
    "+993",

    "+688",
    "+256",
    "+380",
    "+971",
    "+44",
    "+1",
    "+598",

    "+998",
    "+678",
    "+58",
    "+84",
    "+681",
    "+212",
    "+967",
    "+260",
    "+263",
    "+82",
  ];

  const country = [
    "Australia",
    "Canada",
    "China",
    "Finland",
    "France",
    "Germany",
    "Ireland",
    "Italy",
    "Japan",
    "Malaysia",
    "Netherland",
    "Poland",
    "S. Africa",
    "S. Korea",
    "Singapore",
    "Spain",
    "Sweden",
    "Switzland",
    "Taiwan",
    "U.K.",
    "USA",

    //
    "Afghanistan",
    "Albania",
    "Algeria",
    "Andorra",
    "Angola",
    "Anguilla",
    "Antigua and Barbuda",
    "Argentina",
    "Armenia",
    "Aruba",
    "Austria",
    "Azerbaijan",
    "Bahamas",
    "Bahrain",
    "Bailiwick of Guernsey",
    "Bailiwick of Jersey",
    "Bangladesh",
    "Barbados",
    "Belarus",
    "Belgium",
    "Belize",
    "Benin",
    "Bermuda",
    "Bhutan",
    "Bolivia",
    "Bosnia-Herzegovina",
    "Botswana",
    "Brazil",
    "British Antarctic Territory",
    "British Indian Ocean Territory",
    "British Virgin Islands",
    "Brunei",
    "Bulgaria",
    "Burkina Faso",
    "Burundi",
    "C.te D'Ivoire",
    "Cambodia",
    "Cameroon",
    "Cape Verde",
    "Cayman Islands",
    "Central African Republic",
    "Chad",
    "Chile",
    "Colombia",
    "Comoros",
    "Congo",
    "Cook Islands",
    "Costa Rica",
    "Croatia",
    "Cuba",
    "Cyprus",
    "Czech",
    "Democratic Republic of Congo",
    "Denmark",
    "Djibouti",
    "Dominica",
    "Dominican Republic",
    "Ecuador",
    "Egypt",
    "El Salvador",
    "Equatorial Guinea",
    "Eritrea",
    "Estonia",
    "Eswatini",
    "Ethiopia",
    "Federated States of Micronesia",
    "Fiji",

    "French Guiana",
    "French Polynesia",
    "Gabon",
    "Gambia",
    "Georgia",
    "Ghana",
    "Gibraltar",
    "Greece",
    "Greenland",
    "Grenada",
    "Guadeloupe",
    "Guam",
    "Guatemala",
    "Guinea",
    "Guinea-Bissau",
    "Guyana",
    "Haiti",
    "Honduras",
    "Hongkong",
    "Hungary",
    "Iceland",
    "India",
    "Indonesia",
    "Iran",
    "Iraq",
    "Isle of Man",
    "Israel",
    "Jamaica",
    "Jordan",
    "Kazakhstan",
    "Kenya",
    "Kiribati",
    "Kosovo",
    "Kuwait",
    "Kyrgyz",
    "Laos",
    "Latvia",
    "Lebanon",
    "Lesotho",
    "Liberia",
    "Libya",
    "Liechtenstein",
    "Lithuania",
    "Luxembourg",
    "Macao",
    "Madagascar",
    "Malawi",
    "Maldives",
    "Mali",
    "Malta",
    "Marshall Islands",
    "Martinique",
    "Mauritania",
    "Mauritius",
    "Mayotte",
    "Mazambique",
    "Mexico",
    "Moldova",
    "Monaco",
    "Mongolia",
    "Montenegro",
    "Montserrat",
    "Morocco",
    "Myanmar",
    "Namibia",
    "Nauru",
    "Nepal",
    "Netherlands Antilles",
    "New Caledonia",
    "New Zealand",
    "Nicaragua",
    "Niger",
    "Nigeria",
    "Niue",
    "North Macedonia",
    "Northern Mariana Islands",
    "Norway",
    "Oman",
    "Pakistan",
    "Palau",
    "Palestine",
    "Panama",
    "Papua New Guinea :PNG",
    "Paraguay",
    "Peru",
    "Philippines",
    "Pitcairn Islands",

    "Portugal",
    "Puerto Rico",
    "Qatar",
    "R.union",
    "Romania",
    "Russia",
    "Rwanda",
    "S.o Tom. & Principe",
    "Sahara Arab Democratic Republic",
    "Samoa",
    "San Marino",
    "Saudi Arabia",
    "Senegal",
    "Serbia",
    "Seychelles",
    "Sierra Leone",
    "Slovakia",
    "Slovenia",
    "Solomon Islands",
    "Somalia",
    "South Sudan",

    "Sri Lanka",
    "St Helena",
    "St. Kitts-Nevis",
    "St. Lucia",
    "St. Pierre and Miquelon",
    "St. Vincent & the Grenadines",
    "Sudan",
    "Suriname",

    "Swiss",
    "Syria",

    "Tajikistan",
    "Tanzania",
    "Thailand",
    "Timor-Leste",
    "Togo",
    "Tonga",
    "Trinidad & Tobago",
    "Tunisia",
    "Turkey",
    "Turkmenistan",
    "Turks and Caicos Islands",
    "Tuvalu",
    "Uganda",
    "Ukraine",
    "United Arab Emirates : UAE",

    "Uruguay",
    "Uzbekistan",
    "Vanuatu",
    "Vatican",
    "Venezuela",
    "Vietnam",
    "Wallis and Futuna",
    "Yemen",
    "Zambia",
    "Zimbabwe",
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
              <ATag
                href="http://ktalklive.com"
                target="_blank"
                width={`auto`}
                color={Theme.basicTheme_C}
                rel="noopener noreferrer"
              >
                http://ktalklive.com
              </ATag>
              &nbsp;or our FB page at&nbsp;
              <ATag
                href="https://www.facebook.com/ktalklive"
                target="_blank"
                width={`auto`}
                color={Theme.basicTheme_C}
                rel="noopener noreferrer"
              >
                https://www.facebook.com/ktalklive
              </ATag>
            </Wrapper>
            <Wrapper
              color={Theme.subTheme2_C}
              margin={`20px 0 68px`}
              fontSize={`20px`}
              fontWeight={`bold`}
            >
              Thank you very much!
            </Wrapper>

            <CustomForm
              onFinish={submissionHandler}
              form={form}
              scrollToFirstError
            >
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
                    <Form.Item name="year" rules={[{ required: true }]}>
                      <CusotmInput
                        readOnly
                        width={`100%`}
                        radius={`5px`}
                        placeholder={"Year"}
                      />
                    </Form.Item>
                  </Wrapper>

                  <Wrapper width={`calc(100% / 3 - 16px)`} margin={`0 9px`}>
                    <Form.Item name="month" rules={[{ required: true }]}>
                      <CusotmInput
                        readOnly
                        width={`100%`}
                        radius={`5px`}
                        placeholder={"Month"}
                      />
                    </Form.Item>
                  </Wrapper>

                  <Wrapper width={`calc(100% / 3 - 16px)`}>
                    <Form.Item name="date" rules={[{ required: true }]}>
                      <CusotmInput
                        readOnly
                        width={`100%`}
                        radius={`5px`}
                        placeholder={"Date"}
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
                    validRange={[moment(1970), moment()]}
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
                    <CustomSelect margin={`0 10px 0 0`}>
                      {country &&
                        country.map((data, idx) => {
                          return (
                            <Select.Option key={idx} value={data}>
                              {data}
                            </Select.Option>
                          );
                        })}
                    </CustomSelect>
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
                    <CustomSelect>
                      {country &&
                        country.map((data, idx) => {
                          return (
                            <Select.Option key={idx} value={data}>
                              {data}
                            </Select.Option>
                          );
                        })}
                    </CustomSelect>
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
                <Wrapper dr={`row`} al={`flex-start`}>
                  <Wrapper width={`20%`} padding={`0 8px 0 0`}>
                    <Form.Item name="phoneNumber" rules={[{ required: true }]}>
                      <CustomSelect
                        onChange={(e) => setSelectState(e)}
                        suffixIcon={() => {
                          return <CaretDownOutlined />;
                        }}
                      >
                        <Select.Option value={`직접입력`}>
                          직접입력
                        </Select.Option>
                        {firstPhoneArr &&
                          firstPhoneArr.map((data, idx) => {
                            return (
                              <Select.Option key={idx} value={data}>
                                {data}
                              </Select.Option>
                            );
                          })}
                      </CustomSelect>
                    </Form.Item>
                    {console.log(selectState)}
                  </Wrapper>
                  {selectState === "직접입력" && (
                    <Wrapper width={`20%`} padding={`0 8px 0 0`}>
                      <Form.Item
                        name={`phoneNumberInput`}
                        style={{ width: `auto` }}
                      >
                        <CusotmInput width={`100%`} />
                      </Form.Item>
                    </Wrapper>
                  )}

                  <Wrapper width={selectState === `직접입력` ? `60%` : `80%`}>
                    <Form.Item name="phoneNumber2" rules={[{ required: true }]}>
                      <CustomInputNumber type="number" />
                    </Form.Item>
                  </Wrapper>
                </Wrapper>
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
                  timeArr.map((data, idx) => {
                    return (
                      <Wrapper
                        width={
                          width < 700 ? `calc(100% / 2)` : `calc(100% / 3)`
                        }
                        fontSize={width < 700 ? `16px` : `18px`}
                        al={`flex-start`}
                      >
                        <CustomCheckBox2
                          key={idx}
                          checked={timeSelectCheck[idx]}
                          onChange={(e) => timeSelectToggle(data, idx)}
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
