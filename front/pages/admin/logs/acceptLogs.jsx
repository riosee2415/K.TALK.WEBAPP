import React, { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import AdminLayout from "../../../components/AdminLayout";
import PageHeader from "../../../components/admin/PageHeader";
import AdminTop from "../../../components/admin/AdminTop";
import styled from "styled-components";
import { Button, Tabs } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { ACCEPT_LOG_REQUEST } from "../../../reducers/accept";
import { LOAD_MY_INFO_REQUEST } from "../../../reducers/user";
const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});
import wrapper from "../../../store/configureStore";
import { END } from "redux-saga";
import axios from "axios";

const { TabPane } = Tabs;

const AdminContent = styled.div`
  padding: 20px;
`;

const AcceptLogs = () => {
  const [click, setClick] = useState(false);

  const { me, st_loadMyInfoDone } = useSelector((state) => state.user);
  const { acceptList } = useSelector((state) => state.accept);

  // LOAD CURRENT INFO AREA /////////////////////////////////////////////

  const [dataList, setDataList] = useState(
    acceptList.map((data) => data.count)
  );
  const [categoryList, setCategoryList] = useState(
    acceptList.map((data) => data.date)
  );

  const [chartConfig, setChartConfig] = useState({
    series: [
      {
        name: "AcceptLogs",
        data: dataList,
      },
    ],
    options: {
      chart: {
        height: 350,
        type: "line",
        zoom: {
          enabled: false,
        },
      },
      dataLabels: {
        enabled: true,
      },
      stroke: {
        curve: "straight",
      },
      title: {
        text: "Accpet Logs",
        align: "left",
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
          opacity: 0.5,
        },
      },
      xaxis: {
        categories: categoryList,
      },
    },
  });

  const setDataToConfig = useCallback(() => {
    const tempData = acceptList.map((data) => data.count);
    const tempCategory = acceptList.map((data) => data.date);

    setDataList(tempData);
    setCategoryList(tempCategory);
  }, [acceptList]);

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

  return (
    <AdminLayout>
      <PageHeader
        breadcrumbs={["접속자 관리", "접속자 통계"]}
        title={`접속자 통계`}
        subTitle={`접속자 통계를 확인할 수 있습니다.`}
      />
      {/* createButton<Boolean>,  createButtonAction*/}
      <AdminTop />

      <AdminContent>
        <Tabs type="card">
          <TabPane tab="최근 30일" key="1"></TabPane>
        </Tabs>

        <Chart
          options={chartConfig.options}
          series={chartConfig.series}
          type="line"
          height="550"
        />
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

    context.store.dispatch({
      type: ACCEPT_LOG_REQUEST,
      data: { typeId: "2" },
    });

    // 구현부 종료
    context.store.dispatch(END);
    console.log("🍀 SERVER SIDE PROPS END");
    await context.store.sagaTask.toPromise();
  }
);

export default AcceptLogs;
