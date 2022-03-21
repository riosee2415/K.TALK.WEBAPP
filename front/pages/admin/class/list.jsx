import React, { useCallback, useEffect, useState, useRef } from "react";
import AdminLayout from "../../../components/AdminLayout";
import AdminTop from "../../../components/admin/AdminTop";
import PageHeader from "../../../components/admin/PageHeader";
import styled from "styled-components";
import {
  Button,
  Table,
  Modal,
  Form,
  Input,
  Select,
  Switch,
  notification,
  Row,
  Col,
  message,
  Empty,
} from "antd";
import {
  CloseOutlined,
  CheckOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";

import { LECTURE_LIST_REQUEST } from "../../../reducers/lecture";

import { withRouter } from "next/router";
import useInput from "../../../hooks/useInput";

import { END } from "redux-saga";
import axios from "axios";
import { useRouter } from "next/router";
import { LOAD_MY_INFO_REQUEST } from "../../../reducers/user";
import wrapper from "../../../store/configureStore";
import {
  CommonButton,
  Image,
  Text,
  Wrapper,
} from "../../../components/commonComponents";
import Theme from "../../../components/Theme";
import useWidth from "../../../hooks/useWidth";

const AdminContent = styled.div`
  padding: 20px;
`;

const FileBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`;

const Filename = styled.span`
  margin-right: 15px;
  color: #555;
  font-size: 13px;
`;

const SearchRow = styled(Row)`
  margin-bottom: 10px;
`;

const LoadNotification = (msg, content) => {
  notification.open({
    message: msg,
    description: content,
    onClick: () => {},
  });
};

const List = ({ router }) => {
  // LOAD CURRENT INFO AREA /////////////////////////////////////////////
  const { me, st_loadMyInfoDone } = useSelector((state) => state.user);

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
  const width = useWidth();
  const [currentSort, setCurrentSort] = useState(1);

  ////// REDUX //////
  const dispatch = useDispatch();
  const { lectures } = useSelector((state) => state.lecture);

  ////// USEEFFECT //////
  useEffect(() => {
    dispatch({
      type: LECTURE_LIST_REQUEST,
      data: {
        sort: currentSort,
      },
    });
  }, [currentSort]);

  ////// HANDLER ///////

  const comboChangeHandler = useCallback((e) => {
    setCurrentSort(e);
  }, []);

  ////// TOGGLE ///////

  ////// DATAVIEW //////

  return (
    <AdminLayout>
      <PageHeader
        breadcrumbs={["클래스 관리", "클래스 목록, 검색, 정렬"]}
        title={`클래스 목록, 검색, 정렬`}
        subTitle={`클래스의 목록을 살펴볼 수 있고 클래스별 상세 설정을 할 수 있습니다.`}
      />

      <AdminContent>
        <Wrapper al={`flex-start`} margin={`0 0 10px`}>
          <Text fontSize={`18px`} fontWeight={`bold`} margin={`0 0 16px`}>
            클래스 목록
          </Text>
          <Select
            style={{ width: `200px` }}
            placeholder={`정렬을 선택해주세요.`}
            onChange={(e) => comboChangeHandler(e)}
          >
            <Select.Option value={`1`}>인원수순</Select.Option>
            <Select.Option value={`2`}>생성일순</Select.Option>
            <Select.Option value={`3`}>강의명순</Select.Option>
          </Select>
        </Wrapper>
        <Wrapper dr={`row`} ju={`flex-start`}>
          {lectures && lectures.length === 0 ? (
            <Wrapper>
              <Empty description={`조회된 강의가 없습니다.`} />
            </Wrapper>
          ) : (
            lectures &&
            lectures.map((data) => {
              return (
                <Wrapper
                  width={`calc(100% / 3 - 20px)`}
                  minHeight={`370px`}
                  radius={`10px`}
                  shadow={`0 5px 15px rgba(0,0,0,0.05)`}
                  margin={`0 20px 30px 0`}
                  padding={`20px`}
                  ju={`space-between`}
                >
                  <Wrapper>
                    <Wrapper
                      dr={`row`}
                      ju={`space-between`}
                      al={`flex-start`}
                      padding={`0 0 20px`}
                      borderBottom={`1px solid ${Theme.grey2_C}`}
                    >
                      <Wrapper width={`auto`}>
                        <Wrapper
                          dr={`row`}
                          ju={`flex-start`}
                          margin={`0 0 15px`}
                        >
                          <Wrapper
                            width={`34px`}
                            padding={`0 5px`}
                            margin={`0 10px 0 0`}
                          >
                            <Image
                              src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/common/icon_lecture.png`}
                              alt={`icon_lecture`}
                            />
                          </Wrapper>
                          <Text fontSize={`16px`} fontWeight={`700`}>
                            수업 시간 / 요일
                          </Text>
                        </Wrapper>

                        <Wrapper
                          dr={`row`}
                          ju={`flex-start`}
                          margin={`0 0 15px`}
                        >
                          <Wrapper
                            width={`34px`}
                            padding={`0 5px`}
                            margin={`0 10px 0 0`}
                          >
                            <Image
                              src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/common/icon_name_yellow.png`}
                              alt={`icon_lecture`}
                            />
                          </Wrapper>
                          <Text fontSize={`16px`} fontWeight={`700`}>
                            오민형
                          </Text>
                        </Wrapper>

                        <Wrapper dr={`row`} ju={`flex-start`}>
                          <Wrapper
                            width={`34px`}
                            padding={`0 5px`}
                            margin={`0 10px 0 0`}
                          >
                            <Image
                              src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/common/icon_lecture.png`}
                              alt={`icon_lecture`}
                            />
                          </Wrapper>
                          <Text fontSize={`16px`} fontWeight={`700`}>
                            NO.{data.id}
                          </Text>
                        </Wrapper>
                      </Wrapper>
                      <Wrapper
                        width={width < 1350 ? `100%` : `auto`}
                        fontSize={`15px`}
                        color={Theme.grey2_C}
                        al={width < 1350 ? `flex-start` : `flex-end`}
                        margin={width < 1350 ? `20px 0 0` : `0`}
                      >
                        <Text fontSize={`14px`} fontWeight={`bold`}>
                          1권 1페이지
                        </Text>
                        <Text>
                          수업 시작일 : {data.startDate.replace(/\//g, "-")}
                        </Text>
                      </Wrapper>
                    </Wrapper>
                    <Wrapper
                      margin={`20px 0 0`}
                      dr={`row`}
                      ju={`space-between`}
                    >
                      <Text width={`calc(100% / 2 - 10px)`} margin={`0 0 12px`}>
                        Julieta Lopez
                      </Text>
                      <Text width={`calc(100% / 2 - 10px)`} margin={`0 0 12px`}>
                        Julieta Lopez
                      </Text>
                      <Text width={`calc(100% / 2 - 10px)`} margin={`0 0 12px`}>
                        Julieta Lopez
                      </Text>
                      <Text width={`calc(100% / 2 - 10px)`} margin={`0 0 12px`}>
                        Julieta Lopez
                      </Text>
                      <Text width={`calc(100% / 2 - 10px)`} margin={`0 0 12px`}>
                        Julieta Lopez
                      </Text>
                      <Text width={`calc(100% / 2 - 10px)`} margin={`0 0 12px`}>
                        Julieta Lopez
                      </Text>
                      <Text width={`calc(100% / 2 - 10px)`} margin={`0 0 12px`}>
                        Julieta Lopez
                      </Text>
                      <Text width={`calc(100% / 2 - 10px)`} margin={`0 0 12px`}>
                        Julieta Lopez
                      </Text>
                    </Wrapper>
                  </Wrapper>

                  <CommonButton
                    padding={`0`}
                    width={`120px`}
                    height={`38px`}
                    radius={`5px`}
                  >
                    {" "}
                    자세히 보기
                  </CommonButton>
                </Wrapper>
              );
            })
          )}
        </Wrapper>
      </AdminContent>

      {/* CREATE MODAL */}
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

export default withRouter(List);
