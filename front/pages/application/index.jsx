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
  margin: ${(props) => props.margin};

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
  width: ${(props) => props.width};

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

      let saveTotal = JSON.parse(data.phoneNumber);

      let classHour = "";
      timeSelect.map((data) => (classHour += `${data}  `));

      dispatch({
        type: APP_CREATE_REQUEST,
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          dateOfBirth: `${data.year}-${data.month}-${data.date}`,
          gmailAddress: `${data.firstEmail}${data.lastEmail}`,
          nationality: data.nationality,
          countryOfResidence: saveTotal.Afghanistan,
          languageYouUse: data.languageYouUse,
          phoneNumber: saveTotal.number,
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

  const country = [
    "S. Korea",
    "USA",
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
    "Singapore",
    "Spain",
    "Sweden",
    "Switzland",
    "Taiwan",
    "U.K.",

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

  // "Australia",
  // "Canada",
  // "China",
  // "Finland",
  // "France",
  // "Germany",
  // "Ireland",
  // "Italy",
  // "Japan",
  // "Malaysia",
  // "Netherland",
  // "Poland",
  // "S. Africa",
  // "S. Korea",
  // "Singapore",
  // "Spain",
  // "Sweden",
  // "Switzland",
  // "Taiwan",
  // "U.K.",
  // "USA",

  let total = [
    {
      Afghanistan: "South Korea",
      number: "+82",
    },
    {
      Afghanistan: "United States",
      number: "+1",
    },
    {
      Afghanistan: "Australia",
      number: "+61",
    },
    {
      Afghanistan: "Canada",
      number: "+1",
    },
    {
      Afghanistan: "China",
      number: "+86",
    },
    {
      Afghanistan: "Finland",
      number: "+358",
    },
    {
      Afghanistan: "France",
      number: "+33",
    },
    {
      Afghanistan: "Germany",
      number: "+49",
    },
    {
      Afghanistan: "Ireland",
      number: "+353",
    },
    {
      Afghanistan: "Italy",
      number: "+39",
    },
    {
      Afghanistan: "Japan",
      number: "+81",
    },
    {
      Afghanistan: "Malaysia",
      number: "+60",
    },
    {
      Afghanistan: "Netherlands",
      number: "+31",
    },
    {
      Afghanistan: "Poland",
      number: "+48",
    },
    {
      Afghanistan: "South Africa",
      number: "+27",
    },
    {
      Afghanistan: "Singapore",
      number: "+65",
    },
    {
      Afghanistan: "Spain",
      number: "+34",
    },
    {
      Afghanistan: "Sweden",
      number: "+46",
    },
    {
      Afghanistan: "Switzerland",
      number: "+41",
    },
    {
      Afghanistan: "Taiwan",
      number: "+886",
    },
    {
      Afghanistan: "United Kingdom",
      number: "+44",
    },
    {
      Afghanistan: "Albania",
      number: "+355",
    },
    {
      Afghanistan: "Algeria",
      number: "+213",
    },
    {
      Afghanistan: "American Samoa",
      number: "+1 684",
    },
    {
      Afghanistan: "Andorra",
      number: "+376",
    },
    {
      Afghanistan: "Angola",
      number: "+244",
    },
    {
      Afghanistan: "Anguilla",
      number: "+1 264",
    },
    {
      Afghanistan: "Antarctica",
      number: "+64",
    },
    {
      Afghanistan: "Antarctica",
      number: "+672",
    },
    {
      Afghanistan: "Antigua and Barbuda",
      number: "+1 268",
    },
    {
      Afghanistan: "Argentina",
      number: "+54",
    },
    {
      Afghanistan: "Armenia",
      number: "+374",
    },
    {
      Afghanistan: "Aruba",
      number: "+297",
    },
    {
      Afghanistan: "Ascension Island",
      number: "+247",
    },

    {
      Afghanistan: "Austria",
      number: "+43",
    },
    {
      Afghanistan: "Azerbaijan",
      number: "+994",
    },
    {
      Afghanistan: "Bahamas",
      number: "+1 242",
    },
    {
      Afghanistan: "Bahrain",
      number: "+973",
    },
    {
      Afghanistan: "Bangladesh",
      number: "+880",
    },
    {
      Afghanistan: "Barbados",
      number: "+1 246",
    },
    {
      Afghanistan: "Belarus",
      number: "+375",
    },
    {
      Afghanistan: "Belgium",
      number: "+32",
    },
    {
      Afghanistan: "Belize",
      number: "+501",
    },
    {
      Afghanistan: "Benin",
      number: "+229",
    },
    {
      Afghanistan: "Bermuda",
      number: "+1 441",
    },
    {
      Afghanistan: "Bhutan",
      number: "+975",
    },
    {
      Afghanistan: "Bolivia",
      number: "+591",
    },
    {
      Afghanistan: "Bosnia and Herzegovina",
      number: "+387",
    },
    {
      Afghanistan: "Botswana",
      number: "+267",
    },
    {
      Afghanistan: "Brazil",
      number: "+55",
    },
    {
      Afghanistan: "British Virgin Islands",
      number: "+1 284",
    },
    {
      Afghanistan: "Brunei",
      number: "+673",
    },
    {
      Afghanistan: "Bulgaria",
      number: "+359",
    },
    {
      Afghanistan: "Burkina Faso",
      number: "+226",
    },
    {
      Afghanistan: "Burma (Myanmar)",
      number: "+95",
    },
    {
      Afghanistan: "Burundi",
      number: "+257",
    },
    {
      Afghanistan: "Cambodia",
      number: "+855",
    },
    {
      Afghanistan: "Cameroon",
      number: "+237",
    },

    {
      Afghanistan: "Cape Verde",
      number: "+238",
    },
    {
      Afghanistan: "Cayman Islands",
      number: "+1 345",
    },
    {
      Afghanistan: "Central African Republic",
      number: "+236",
    },
    {
      Afghanistan: "Chad",
      number: "+235",
    },
    {
      Afghanistan: "Chile",
      number: "+56",
    },

    {
      Afghanistan: "Christmas Island",
      number: "+61",
    },
    {
      Afghanistan: "Cocos (Keeling) Islands",
      number: "+61",
    },
    {
      Afghanistan: "Colombia",
      number: "+57",
    },
    {
      Afghanistan: "Comoros",
      number: "+269",
    },
    {
      Afghanistan: "Congo",
      number: "+242",
    },
    {
      Afghanistan: "Cook Islands",
      number: "+682",
    },
    {
      Afghanistan: "Costa Rica",
      number: "+506",
    },
    {
      Afghanistan: "Croatia",
      number: "+385",
    },
    {
      Afghanistan: "Cuba",
      number: "+53",
    },
    {
      Afghanistan: "Cyprus",
      number: "+357",
    },
    {
      Afghanistan: "Czech Republic",
      number: "+420",
    },
    {
      Afghanistan: "Democratic Republic of the Congo",
      number: "+243",
    },
    {
      Afghanistan: "Denmark",
      number: "+45",
    },
    {
      Afghanistan: "Diego Garcia",
      number: "+246",
    },
    {
      Afghanistan: "Djibouti",
      number: "+253",
    },
    {
      Afghanistan: "Dominica",
      number: "+1 767",
    },
    {
      Afghanistan: "Dominican Republic",
      number: "+1 809",
    },
    {
      Afghanistan: "Dominican Republic",
      number: "+1 829",
    },
    {
      Afghanistan: "Dominican Republic",
      number: "+1 849",
    },
    {
      Afghanistan: "Ecuador",
      number: "+593",
    },
    {
      Afghanistan: "Egypt",
      number: "+20",
    },
    {
      Afghanistan: "El Salvador",
      number: "+503",
    },
    {
      Afghanistan: "Equatorial Guinea",
      number: "+240",
    },
    {
      Afghanistan: "Eritrea",
      number: "+291",
    },
    {
      Afghanistan: "Estonia",
      number: "+372",
    },
    {
      Afghanistan: "Ethiopia",
      number: "+251",
    },
    {
      Afghanistan: "Falkland Islands",
      number: "+500",
    },
    {
      Afghanistan: "Faroe Islands",
      number: "+298",
    },
    {
      Afghanistan: "Fiji",
      number: "+679",
    },

    {
      Afghanistan: "French Guiana",
      number: "+594",
    },
    {
      Afghanistan: "French Polynesia",
      number: "+689",
    },
    {
      Afghanistan: "Gabon",
      number: "+241",
    },
    {
      Afghanistan: "Gambia",
      number: "+220",
    },
    {
      Afghanistan: "Georgia",
      number: "+995",
    },

    {
      Afghanistan: "Ghana",
      number: "+233",
    },
    {
      Afghanistan: "Gibraltar",
      number: "+350",
    },
    {
      Afghanistan: "Greece",
      number: "+30",
    },
    {
      Afghanistan: "Greenland",
      number: "+299",
    },
    {
      Afghanistan: "Grenada",
      number: "+1 473",
    },
    {
      Afghanistan: "Guadeloupe",
      number: "+590",
    },
    {
      Afghanistan: "Guam",
      number: "+1 671",
    },
    {
      Afghanistan: "Guatemala",
      number: "+502",
    },
    {
      Afghanistan: "Guinea",
      number: "+224",
    },
    {
      Afghanistan: "Guinea-Bissau",
      number: "+245",
    },
    {
      Afghanistan: "Guyana",
      number: "+592",
    },
    {
      Afghanistan: "Haiti",
      number: "+509",
    },
    {
      Afghanistan: "Holy See (Vatican City)",
      number: "+39",
    },
    {
      Afghanistan: "Honduras",
      number: "+504",
    },
    {
      Afghanistan: "Hong Kong",
      number: "+852",
    },
    {
      Afghanistan: "Hungary",
      number: "+36",
    },
    {
      Afghanistan: "Iceland",
      number: "+354",
    },
    {
      Afghanistan: "India",
      number: "+91",
    },
    {
      Afghanistan: "Indonesia",
      number: "+62",
    },
    {
      Afghanistan: "Iran",
      number: "+98",
    },
    {
      Afghanistan: "Iraq",
      number: "+964",
    },

    {
      Afghanistan: "Isle of Man",
      number: "+44",
    },
    {
      Afghanistan: "Israel",
      number: "+972",
    },

    {
      Afghanistan: "Ivory Coast (Côte d'Ivoire)",
      number: "+225",
    },
    {
      Afghanistan: "Jamaica",
      number: "+1 876",
    },

    {
      Afghanistan: "Jersey",
      number: "+44",
    },
    {
      Afghanistan: "Jordan",
      number: "+962",
    },
    {
      Afghanistan: "Kazakhstan",
      number: "+7",
    },
    {
      Afghanistan: "Kenya",
      number: "+254",
    },
    {
      Afghanistan: "Kiribati",
      number: "+686",
    },
    {
      Afghanistan: "Kuwait",
      number: "+965",
    },
    {
      Afghanistan: "Kyrgyzstan",
      number: "+996",
    },
    {
      Afghanistan: "Laos",
      number: "+856",
    },
    {
      Afghanistan: "Latvia",
      number: "+371",
    },
    {
      Afghanistan: "Lebanon",
      number: "+961",
    },
    {
      Afghanistan: "Lesotho",
      number: "+266",
    },
    {
      Afghanistan: "Liberia",
      number: "+231",
    },
    {
      Afghanistan: "Libya",
      number: "+218",
    },
    {
      Afghanistan: "Liechtenstein",
      number: "+423",
    },
    {
      Afghanistan: "Lithuania",
      number: "+370",
    },
    {
      Afghanistan: "Luxembourg",
      number: "+352",
    },
    {
      Afghanistan: "Macau",
      number: "+853",
    },
    {
      Afghanistan: "Macedonia",
      number: "+389",
    },
    {
      Afghanistan: "Madagascar",
      number: "+261",
    },
    {
      Afghanistan: "Malawi",
      number: "+265",
    },

    {
      Afghanistan: "Maldives",
      number: "+960",
    },
    {
      Afghanistan: "Mali",
      number: "+223",
    },
    {
      Afghanistan: "Malta",
      number: "+356",
    },
    {
      Afghanistan: "Marshall Islands",
      number: "+692",
    },
    {
      Afghanistan: "Martinique",
      number: "+596",
    },
    {
      Afghanistan: "Mauritania",
      number: "+222",
    },
    {
      Afghanistan: "Mauritius",
      number: "+230",
    },
    {
      Afghanistan: "Mayotte",
      number: "+262",
    },
    {
      Afghanistan: "Mexico",
      number: "+52",
    },
    {
      Afghanistan: "Micronesia",
      number: "+691",
    },
    {
      Afghanistan: "Moldova",
      number: "+373",
    },
    {
      Afghanistan: "Monaco",
      number: "+377",
    },
    {
      Afghanistan: "Mongolia",
      number: "+976",
    },
    {
      Afghanistan: "Montenegro",
      number: "+382",
    },
    {
      Afghanistan: "Montserrat",
      number: "+1 664",
    },
    {
      Afghanistan: "Morocco",
      number: "+212",
    },
    {
      Afghanistan: "Mozambique",
      number: "+258",
    },
    {
      Afghanistan: "Namibia",
      number: "+264",
    },
    {
      Afghanistan: "Nauru",
      number: "+674",
    },
    {
      Afghanistan: "Nepal",
      number: "+977",
    },
    {
      Afghanistan: "Netherlands Antilles",
      number: "+599",
    },
    {
      Afghanistan: "New Caledonia",
      number: "+687",
    },
    {
      Afghanistan: "New Zealand",
      number: "+64",
    },
    {
      Afghanistan: "Nicaragua",
      number: "+505",
    },
    {
      Afghanistan: "Niger",
      number: "+227",
    },
    {
      Afghanistan: "Nigeria",
      number: "+234",
    },
    {
      Afghanistan: "Niue",
      number: "+683",
    },
    {
      Afghanistan: "Norfolk Island",
      number: "+672",
    },
    {
      Afghanistan: "North Korea",
      number: "+850",
    },
    {
      Afghanistan: "Northern Mariana Islands",
      number: "+1 670",
    },
    {
      Afghanistan: "Norway",
      number: "+47",
    },
    {
      Afghanistan: "Oman",
      number: "+968",
    },
    {
      Afghanistan: "Pakistan",
      number: "+92",
    },
    {
      Afghanistan: "Palau",
      number: "+680",
    },
    {
      Afghanistan: "Palestine",
      number: "+970",
    },
    {
      Afghanistan: "Panama",
      number: "+507",
    },
    {
      Afghanistan: "Papua New Guinea",
      number: "+675",
    },
    {
      Afghanistan: "Paraguay",
      number: "+595",
    },
    {
      Afghanistan: "Peru",
      number: "+51",
    },
    {
      Afghanistan: "Philippines",
      number: "+63",
    },
    {
      Afghanistan: "Pitcairn Islands",
      number: "+870",
    },

    {
      Afghanistan: "Portugal",
      number: "+351",
    },
    {
      Afghanistan: "Puerto Rico",
      number: "+1 939",
    },
    {
      Afghanistan: "Puerto Rico",
      number: "+1 787",
    },
    {
      Afghanistan: "Qatar",
      number: "+974",
    },
    {
      Afghanistan: "Republic of the Congo",
      number: "+242",
    },
    {
      Afghanistan: "Reunion Island",
      number: "+262",
    },
    {
      Afghanistan: "Romania",
      number: "+40",
    },
    {
      Afghanistan: "Russia",
      number: "+7",
    },
    {
      Afghanistan: "Rwanda",
      number: "+250",
    },
    {
      Afghanistan: "Saint Barthelemy",
      number: "+590",
    },
    {
      Afghanistan: "Saint Helena",
      number: "+290",
    },
    {
      Afghanistan: "Saint Kitts and Nevis",
      number: "+1 869",
    },
    {
      Afghanistan: "Saint Lucia",
      number: "+1 758",
    },
    {
      Afghanistan: "Saint Martin",
      number: "+590",
    },
    {
      Afghanistan: "Saint Pierre and Miquelon",
      number: "+508",
    },
    {
      Afghanistan: "Saint Vincent and the Grenadines",
      number: "+1 784",
    },
    {
      Afghanistan: "Samoa",
      number: "+685",
    },
    {
      Afghanistan: "San Marino",
      number: "+378",
    },
    {
      Afghanistan: "Sao Tome and Principe",
      number: "+239",
    },
    {
      Afghanistan: "Saudi Arabia",
      number: "+966",
    },
    {
      Afghanistan: "Senegal",
      number: "+221",
    },
    {
      Afghanistan: "Serbia",
      number: "+381",
    },
    {
      Afghanistan: "Seychelles",
      number: "+248",
    },
    {
      Afghanistan: "Sierra Leone",
      number: "+232",
    },

    {
      Afghanistan: "Sint Maarten",
      number: "+1 721",
    },
    {
      Afghanistan: "Slovakia",
      number: "+421",
    },
    {
      Afghanistan: "Slovenia",
      number: "+386",
    },
    {
      Afghanistan: "Solomon Islands",
      number: "+677",
    },
    {
      Afghanistan: "Somalia",
      number: "+252",
    },
    {
      Afghanistan: "South Sudan",
      number: "+211",
    },

    {
      Afghanistan: "Sri Lanka",
      number: "+94",
    },
    {
      Afghanistan: "Sudan",
      number: "+249",
    },
    {
      Afghanistan: "Suriname",
      number: "+597",
    },
    {
      Afghanistan: "Svalbard",
      number: "+47",
    },
    {
      Afghanistan: "Swaziland",
      number: "+268",
    },
    {
      Afghanistan: "Syria",
      number: "+963",
    },
    {
      Afghanistan: "Tajikistan",
      number: "+992",
    },
    {
      Afghanistan: "Tanzania",
      number: "+255",
    },
    {
      Afghanistan: "Thailand",
      number: "+66",
    },
    {
      Afghanistan: "Timor-Leste (East Timor)",
      number: "+670",
    },
    {
      Afghanistan: "Togo",
      number: "+228",
    },
    {
      Afghanistan: "Tokelau",
      number: "+690",
    },
    {
      Afghanistan: "Tonga Islands",
      number: "+676",
    },
    {
      Afghanistan: "Trinidad and Tobago",
      number: "+1 868",
    },
    {
      Afghanistan: "Tunisia",
      number: "+216",
    },
    {
      Afghanistan: "Turkey",
      number: "+90",
    },
    {
      Afghanistan: "Turkmenistan",
      number: "+993",
    },
    {
      Afghanistan: "Turks and Caicos Islands",
      number: "+1 649",
    },
    {
      Afghanistan: "Tuvalu",
      number: "+688",
    },
    {
      Afghanistan: "Uganda",
      number: "+256",
    },
    {
      Afghanistan: "Ukraine",
      number: "+380",
    },
    {
      Afghanistan: "United Arab Emirates",
      number: "+971",
    },
    {
      Afghanistan: "Uruguay",
      number: "+598",
    },
    {
      Afghanistan: "US Virgin Islands",
      number: "+1 340",
    },
    {
      Afghanistan: "Uzbekistan",
      number: "+998",
    },
    {
      Afghanistan: "Vanuatu",
      number: "+678",
    },
    {
      Afghanistan: "Venezuela",
      number: "+58",
    },
    {
      Afghanistan: "Vietnam",
      number: "+84",
    },
    {
      Afghanistan: "Wallis and Futuna",
      number: "+681",
    },
    {
      Afghanistan: "Western Sahara",
      number: "+212",
    },
    {
      Afghanistan: "Yemen",
      number: "+967",
    },
    {
      Afghanistan: "Zambia",
      number: "+260",
    },
    {
      Afghanistan: "Zimbabwe",
      number: "+263",
    },
  ];

  return (
    <>
      <Head>
        <title>
          {seo_title.length < 1 ? "K-talk Live" : seo_title[0].content}
        </title>

        <meta
          name="subject"
          content={seo_title.length < 1 ? "K-talk Live" : seo_title[0].content}
        />
        <meta
          name="title"
          content={seo_title.length < 1 ? "K-talk Live" : seo_title[0].content}
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
          content={seo_title.length < 1 ? "K-talk Live" : seo_title[0].content}
        />
        <meta
          property="og:site_name"
          content={seo_title.length < 1 ? "K-talk Live" : seo_title[0].content}
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
              for K-talk Live regular paid Korean lessons
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
                    validRange={[moment(`1940`), moment()]}
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
                  <Wrapper
                    width={width < 700 ? `60%` : `60%`}
                    padding={`0 8px 0 0`}
                  >
                    <Form.Item name="phoneNumber" rules={[{ required: true }]}>
                      <CustomSelect
                        suffixIcon={() => {
                          return <CaretDownOutlined />;
                        }}
                      >
                        {total &&
                          total.map((data, idx) => {
                            return (
                              <Select.Option
                                key={idx}
                                value={JSON.stringify(data)}
                              >
                                {`${data.number} ${data.Afghanistan}`}
                              </Select.Option>
                            );
                          })}
                      </CustomSelect>
                    </Form.Item>
                  </Wrapper>

                  <Wrapper width={width < 700 ? `50%` : `40%`}>
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
                        key={idx}
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
