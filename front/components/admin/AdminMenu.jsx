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
import { Wrapper, Image } from "../commonComponents";

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

  return (
    <>
      <Menu
        theme={mode}
        onClick={clickAction}
        style={{ width: `100%` }}
        defaultOpenKeys={currentAdminMenu}
        mode="inline"
        selectedKeys={router.pathname}
        disabled={false}>
        <Wrapper margin={`20px 0 10px`}>
          <Image
            alt="logo"
            src={`https://firebasestorage.googleapis.com/v0/b/storage-4leaf.appspot.com/o/4leaf%2Flogo%2Ffavicon.ico?alt=media&token=22fe389b-44d2-45c2-8735-2baf77e55651`}
            width={`50px`}
            height={`50px`}
            radius={`100%`}
          />
        </Wrapper>
        <Wrapper height={`30px`} fontSize={`0.8rem`}>
          {me && me.nickname}
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
          <MenuName>관리자 메인</MenuName>
        </Menu.Item>
        <SubMenu
          key="sub1"
          icon={<BarChartOutlined />}
          title="접속자 관리"
          onTitleClick={titleClickHandler("sub1")}>
          <Menu.Item key="/admin/logs/acceptLogs">
            <MenuName>접속자 통계</MenuName>
          </Menu.Item>
        </SubMenu>
        <SubMenu
          key="sub2"
          icon={<InfoCircleOutlined />}
          title="기초 관리"
          onTitleClick={titleClickHandler("sub2")}>
          <Menu.Item key="/admin/info/businessInformation">
            <MenuName>사업자정보 관리</MenuName>
          </Menu.Item>
          <Menu.Item key="/admin/info/popup">
            <MenuName>팝업 관리</MenuName>
          </Menu.Item>

          {/* <SubMenu key="sub3" title="Submenu">
            <Menu.Item key="7">Option 7</Menu.Item>
            <Menu.Item key="8">Option 8</Menu.Item>
          </SubMenu> */}
        </SubMenu>

        <SubMenu
          key="sub20"
          icon={<MoneyCollectOutlined />}
          title="결제내역 관리"
          onTitleClick={titleClickHandler("sub8")}>
          <Menu.Item key="/admin/payment/list">
            <MenuName>결제 목록 관리</MenuName>
          </Menu.Item>
        </SubMenu>
        <SubMenu
          key="sub8"
          icon={<AppstoreOutlined />}
          title="클래스 관리"
          onTitleClick={titleClickHandler("sub8")}>
          <Menu.Item key="/admin/class/list">
            <MenuName>클래스 목록, 검색, 정렬</MenuName>
          </Menu.Item>
          <Menu.Item key="/admin/class/pay">
            <MenuName>결제 클래스 관리</MenuName>
          </Menu.Item>
          <Menu.Item key="/admin/class/create">
            <MenuName>클래스 추가</MenuName>
          </Menu.Item>

          {/* <SubMenu key="sub3" title="Submenu">
            <Menu.Item key="7">Option 7</Menu.Item>
            <Menu.Item key="8">Option 8</Menu.Item>
          </SubMenu> */}
        </SubMenu>
        <SubMenu
          key="sub9"
          icon={<FolderOutlined />}
          title="교재 관리"
          onTitleClick={titleClickHandler("sub9")}>
          <Menu.Item key="/admin/board/bookFolder/list">
            <MenuName>교재 폴더 관리</MenuName>
          </Menu.Item>

          <Menu.Item key="/admin/board/bookFolder/book">
            <MenuName>교재 관리</MenuName>
          </Menu.Item>
        </SubMenu>
        <SubMenu
          key="sub3"
          icon={<BookOutlined />}
          title="게시판/쪽지 관리"
          onTitleClick={titleClickHandler("sub3")}>
          <Menu.Item key="/admin/board/notice/list">
            <MenuName>공지사항 관리</MenuName>
          </Menu.Item>

          <Menu.Item key="/admin/board/message/list">
            <MenuName>쪽지 관리</MenuName>
          </Menu.Item>
        </SubMenu>

        <SubMenu
          key="sub5"
          icon={<UserOutlined />}
          title="회원 관리"
          onTitleClick={titleClickHandler("sub5")}>
          <Menu.Item key="/admin/user/userList">
            <MenuName>회원 리스트</MenuName>
          </Menu.Item>
          <Menu.Item key="/admin/user/student/list">
            <MenuName>학생 관리</MenuName>
          </Menu.Item>
        </SubMenu>
        <SubMenu
          key="sub6"
          icon={<PhoneOutlined />}
          title="신청서 관리"
          onTitleClick={titleClickHandler("sub6")}>
          <Menu.Item key="/admin/application/list">
            <MenuName>Application Form</MenuName>
          </Menu.Item>
          <Menu.Item key="/admin/processApply/list">
            <MenuName>설명회 참가신청서</MenuName>
          </Menu.Item>
          <Menu.Item key="/admin/processApply2/list">
            <MenuName>정규과정 등록신청서</MenuName>
          </Menu.Item>
        </SubMenu>

        {/* <SubMenu
          key="sub7"
          icon={<SettingOutlined />}
          title="환경 설정"
          onTitleClick={titleClickHandler("sub7")}
        >
          <Menu.Item key="/admin/envv/seo">
            <MenuName>SEO 설정</MenuName>
          </Menu.Item>
        </SubMenu> */}
      </Menu>
    </>
  );
};

export default AdminMenu;
