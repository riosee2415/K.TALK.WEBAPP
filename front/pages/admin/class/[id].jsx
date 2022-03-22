import React, { useCallback, useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import router, { useRouter } from "next/router";

import axios from "axios";
import { END } from "redux-saga";

import AdminLayout from "../../../components/AdminLayout";
import PageHeader from "../../../components/admin/PageHeader";

import { Button, Slider, Table } from "antd";
import styled from "styled-components";
import {
  Text,
  Wrapper,
  Image,
  SpanText,
  CommonButton,
} from "../../../components/commonComponents";
import Theme from "../../../components/Theme";

import wrapper from "../../../store/configureStore";
import { LOAD_MY_INFO_REQUEST } from "../../../reducers/user";
import {
  LECTURE_DETAIL_LECTURE_REQUEST,
  LECTURE_STUDENT_LIST_REQUEST,
} from "../../../reducers/lecture";

const AdminContent = styled.div`
  padding: 20px;
`;

const CustomSlide = styled(Slider)`
  width: 488px;
  margin: 0 0 8px;
  & .ant-slider-track,
  & .ant-slider-rail {
    height: 12px;
    border-radius: 10px;
  }

  & .ant-slider-track {
    background-color: ${Theme.basicTheme_C} !important;
  }

  & .ant-slider-handle {
    display: none;
  }
`;

const DetailClass = () => {
  // LOAD CURRENT INFO AREA /////////////////////////////////////////////
  const { me, st_loadMyInfoDone } = useSelector((state) => state.user);

  const router = useRouter();

  const moveLinkHandler = useCallback((link) => {
    router.push(link);
  }, []);

  useEffect(() => {
    if (st_loadMyInfoDone) {
      if (!me || parseInt(me.level) < 3) {
        moveLinkHandler(`/admin`);
      }
    }
  }, [st_loadMyInfoDone]);
  /////////////////////////////////////////////////////////////////////////

  ////// HOOKS //////

  const { lectureStudentList, detailLectures } = useSelector(
    (state) => state.lecture
  );

  const dispatch = useDispatch();

  console.log(detailLectures);
  console.log(lectureStudentList);

  ////// USEEFFECT //////

  useEffect(() => {
    if (router.query) {
      dispatch({
        type: LECTURE_DETAIL_LECTURE_REQUEST,
        data: {
          LectureId: router.query.id,
        },
      });
    }
  }, [router.query]);

  useEffect(() => {
    if (detailLectures) {
      dispatch({
        type: LECTURE_STUDENT_LIST_REQUEST,
        data: {
          TeacherId: detailLectures[0].TeacherId,
        },
      });
    }
  }, [detailLectures]);

  ////// DATAVIEW //////

  const stuColumns = [
    {
      title: "수강생 이름(출생년도)",
      render: (data) => `${data.username}(${data.birth})`,
    },
    {
      title: "국가",
      dataIndex: "stuCountry",
    },
    {
      title: "수업료",
    },
    {
      title: "만기일",
    },
    {
      title: "메모",
    },
    {
      title: "출석률",
    },
  ];

  return (
    <AdminLayout>
      <PageHeader
        breadcrumbs={["클래스 관리", "클래스 상세보기"]}
        title={`클래스 상세보기`}
        subTitle={`클래스별 상세 설정을 할 수 있습니다.`}
      />

      <AdminContent>
        <Wrapper dr={`row`} ju={`flex-start`} margin={`0 0 10px`}>
          <Wrapper width={`4%`} padding={`11px 8px`}>
            <Image
              width={`33px`}
              src="https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/common/icon_lecture.png"
              alt="lecture_icon"
            />
          </Wrapper>
          <Wrapper width={`96%`} dr={`row`} ju={`flex-start`}>
            <Text fontSize={`24px`} fontWeight={`bold`}>
              수업 시간 / 요일
            </Text>
            <Text fontSize={`16px`} color={Theme.grey2_C} margin={`0 0 0 15px`}>
              NO.{router.query && router.query.id}
            </Text>
          </Wrapper>
        </Wrapper>
        <Wrapper dr={`row`} ju={`space-between`} margin={`0 0 14px`}>
          <Wrapper width={`50%`} dr={`row`} ju={`flex-start`}>
            <CustomSlide
              defaultValue={55}
              disabled={true}
              draggableTrack={true}
            />
            <Text>&nbsp;(55%)</Text>
          </Wrapper>
          <Wrapper width={`50%`} dr={`row`} ju={`flex-end`}>
            <CommonButton
              radius={`5px`}
              width={`200px`}
              margin={`0 6px`}
              kindOf={`white`}
            >
              지난 강의 동영상
            </CommonButton>
            <CommonButton
              radius={`5px`}
              width={`200px`}
              margin={`0 6px`}
              kindOf={`white`}
            >
              Class 별 게시판 / 쪽지
            </CommonButton>
          </Wrapper>
        </Wrapper>

        <Wrapper
          padding={`40px 30px 35px`}
          dr={`row`}
          ju={`flex-start`}
          bgColor={Theme.white_C}
          radius={`10px`}
          shadow={`0px 5px 15px rgba(0, 0, 0, 0.16)`}
          margin={`0 0 32px`}
        >
          <Wrapper width={`auto`} dr={`row`} ju={`flex-start`}>
            <Wrapper width={`auto`} margin={`0 10px 0 0`} padding={`8px`}>
              <Image
                width={`18px`}
                src="https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/common/icon_calender_b.png"
                alt="clender_icon"
              />
            </Wrapper>
            <Text fontSize={`18px`}>
              {detailLectures && detailLectures[0].viewDate}
              <SpanText
                fontWeight={`bold`}
                color={Theme.red_C}
                margin={`0 0 0 15px`}
              >
                D-5
              </SpanText>
            </Text>
          </Wrapper>
          <Wrapper
            width={`auto`}
            dr={`row`}
            ju={`flex-start`}
            margin={`0 100px 0 72px`}
          >
            <Wrapper width={`auto`} margin={`0 10px 0 0`} padding={`8px`}>
              <Image
                width={`18px`}
                src="https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/common/icon_name_yellow.png"
                alt="name_icon"
              />
            </Wrapper>

            <Text fontSize={`18px`}>
              {detailLectures && detailLectures[0].teacherName}
            </Text>
          </Wrapper>
          <Wrapper width={`auto`} dr={`row`} ju={`flex-start`}>
            <Wrapper width={`auto`} margin={`0 10px 0 0`} padding={`8px`}>
              <Image
                width={`18px`}
                src="https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/common/icon_book.png"
                alt="book_icon"
              />
            </Wrapper>
            <Text fontSize={`18px`}>Seoul National University book 1 / 6</Text>
          </Wrapper>

          <Wrapper
            width={`1px`}
            height={`48px`}
            borderLeft={`1px dashed ${Theme.grey_C}`}
            margin={`0 50px 0 130px`}
          />

          <Wrapper width={`auto`} al={`flex-start`} fontSize={`16px`}>
            <Text color={Theme.grey2_C}>
              <SpanText
                fontWeight={`bold`}
                margin={`0 33px 0 0`}
                color={Theme.black_C}
              >
                ZOOM ID
              </SpanText>
              4leafsoftware@gmail.com
            </Text>
            <Text color={Theme.grey2_C}>
              <SpanText
                fontWeight={`bold`}
                margin={`0 22px 0 0`}
                color={Theme.black_C}
              >
                Password
              </SpanText>
              12345687
            </Text>
          </Wrapper>
        </Wrapper>

        <Text fontSize={`18px`} fontWeight={`bold`}>
          수강 학생 목록
        </Text>

        <Table columns={stuColumns} rowSelection pagination={{ pageSize: 5 }} />

        <Wrapper al={`flex-end`}>
          <CommonButton kindOf={`white`} radius={`5px`}>
            추가하기
          </CommonButton>
        </Wrapper>
      </AdminContent>
    </AdminLayout>
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

    // 구현부 종료
    context.store.dispatch(END);
    console.log("🍀 SERVER SIDE PROPS END");
    await context.store.sagaTask.toPromise();
  }
);

export default DetailClass;
