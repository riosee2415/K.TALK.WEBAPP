import React, { useState, useCallback } from "react";
import { Menu, Switch } from "antd";
import {
  InfoCircleOutlined,
  AppstoreOutlined,
  SettingOutlined,
  BarChartOutlined,
  UserOutlined,
  BookOutlined,
  PhoneOutlined,
  FolderOutlined,
  MoneyCollectOutlined,
} from "@ant-design/icons";
import styled from "styled-components";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { CURRENT_ADMINMENU_STATUS } from "../../reducers/user";
import { Wrapper, Image, ATag } from "../commonComponents";

const { SubMenu } = Menu;
const MenuName = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`;

const AdminMenu = () => {
  const { currentAdminMenu, me } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const router = useRouter();

  const [mode, setMode] = useState(`dark`);

  const [current, setCurrent] = useState(`1`);

  const clickAction = useCallback((e) => {
    router.replace(e.key);
    setCurrent(e.key);
  }, []);

  const titleClickHandler = useCallback(
    (key) => () => {
      dispatch({
        type: CURRENT_ADMINMENU_STATUS,
        data: { key },
      });
    },
    [currentAdminMenu]
  );

  const moveLinkHandler = useCallback((link) => {
    router.push(link);
  }, []);

  return (
    <>
      <Menu
        theme={mode}
        onClick={clickAction}
        style={{ width: `100%` }}
        defaultOpenKeys={currentAdminMenu}
        mode="inline"
        selectedKeys={router.pathname}
        disabled={false}
      >
        <Wrapper margin={`20px 0 10px`}>
          <ATag href={`/`} width={`auto`}>
            <Image
              alt="logo"
              src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/ktalk/assets/images/logo/favicon.png`}
              width={`50px`}
              height={`50px`}
              radius={`100%`}
            />
          </ATag>
        </Wrapper>
        <Wrapper height={`30px`} fontSize={`0.8rem`}>
          {me && me.username}
        </Wrapper>
        <Wrapper height={`30px`} fontSize={`0.8rem`} margin={`0 0 20px`}>
          {me &&
            (parseInt(me.level) === 5
              ? `개발사`
              : parseInt(me.level) === 4
              ? `최고관리자`
              : parseInt(me.level) === 3
              ? `운영자`
              : ``)}
        </Wrapper>
        <Menu.Item key="/admin">
          <MenuName>관리자 메인 (클래스 관리)</MenuName>
        </Menu.Item>

        <Menu.Item key="/admin/class/pay">
          <MenuName>결제 클래스 관리</MenuName>
        </Menu.Item>

        <Menu.Item key="/admin/user/student/list">
          <MenuName>학생 관리</MenuName>
        </Menu.Item>

        <Menu.Item key="/admin/user/teacher/list">
          <MenuName>강사 관리</MenuName>
        </Menu.Item>

        <Menu.Item key="/admin/user/teacher/pay/list">
          <MenuName>강사료 산정 관리</MenuName>
        </Menu.Item>

        <Menu.Item key="/admin/user/userList">
          <MenuName>회원 목록</MenuName>
        </Menu.Item>

        <Menu.Item key="/admin/lectureDay/list">
          <MenuName>수업 만료일 관리</MenuName>
        </Menu.Item>

        <Menu.Item key="/admin/payment/list">
          <MenuName>입금 관리</MenuName>
        </Menu.Item>

        <Menu.Item key="/admin/application/list">
          <MenuName>Application Form</MenuName>
        </Menu.Item>

        <Menu.Item key="/admin/board/bookFolder/book">
          <MenuName>교재 관리</MenuName>
        </Menu.Item>

        <Menu.Item key="/admin/board/notice/list">
          <MenuName>게시판 관리</MenuName>
        </Menu.Item>

        <Menu.Item key="/admin/board/message/list">
          <MenuName>쪽지 관리</MenuName>
        </Menu.Item>

        <Menu.Item key="/admin/board/community/list">
          <MenuName>자유게시판 관리</MenuName>
        </Menu.Item>

        {/* <Menu.Item key="/admin/processApply/list">
          <MenuName>설명회 참가신청서</MenuName>
        </Menu.Item>

        <Menu.Item key="/admin/processApply2/list">
          <MenuName>정규과정 등록신청서</MenuName>
        </Menu.Item> */}

        <Menu.Item key="/admin/logs/acceptLogs">
          <MenuName>접속자 통계</MenuName>
        </Menu.Item>
      </Menu>
    </>
  );
};

export default AdminMenu;
