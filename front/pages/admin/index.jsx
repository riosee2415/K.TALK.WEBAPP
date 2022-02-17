import { Button, Input, message } from "antd";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AdminLayout from "../../components/AdminLayout";
import {
  Wrapper,
  Image,
  CommonButton,
  RowWrapper,
  ColWrapper,
} from "../../components/commonComponents";
import useInput from "../../hooks/useInput";
import { LOAD_MY_INFO_REQUEST, LOGIN_ADMIN_REQUEST } from "../../reducers/user";
import { ACCEPT_LOG_REQUEST } from "../../reducers/accept";
import Theme from "../../components/Theme";
import wrapper from "../../store/configureStore";
import { END } from "redux-saga";
import axios from "axios";
import Link from "next/link";

// let Line;

// if (typeof window !== "undefined") {
//   const { Line: prevLine } = require("@ant-design/charts");

//   Line = prevLine;
// }

const AdminHome = () => {
  const dispatch = useDispatch();

  const {
    me,
    //
    st_loginAdminError,
    st_loginAdminDone,
  } = useSelector((state) => state.user);

  const { acceptList } = useSelector((state) => state.accept);

  const inputId = useInput("");
  const inputPw = useInput("");

  const onLoginHandler = () => {
    dispatch({
      type: LOGIN_ADMIN_REQUEST,
      data: { email: inputId.value, password: inputPw.value },
    });
  };

  useEffect(() => {
    if (st_loginAdminError) {
      return message.error(
        st_loginAdminError.reason
          ? st_loginAdminError.reason
          : "로그인을 실패하였습니다."
      );
    }
  }, [st_loginAdminError]);

  // const config = {
  //   data: acceptList,
  //   height: 400,
  //   xField: "date",
  //   yField: "count",
  //   point: {
  //     size: 5,
  //     shape: "diamond",
  //   },
  //   label: {
  //     style: {
  //       fill: "#aaa",
  //     },
  //   },
  // };

  return (
    <>
      {me && me.level > 3 ? (
        <AdminLayout>
          <Wrapper height={`100%`} padding={`30px`}>
            <Image
              alt="logo"
              src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/SOUL/assets/images/logo/logo_long_black_W.jpg`}
              width={`300px`}
            />
            <Wrapper width={`80%`}>
              <Wrapper margin={`20px 0`}>
                <Image
                  alt="logo"
                  src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/SOUL/assets/images/logo/Mar-Business_1.jpg`}
                  width={`500px`}
                />
              </Wrapper>
              <RowWrapper gutter={[10, 10]}>
                <ColWrapper span={6}>
                  <Link href={`/admin/logs/acceptLogs`}>
                    <CommonButton width={`200px`}>
                      접속자 통계 바로가기
                    </CommonButton>
                  </Link>
                </ColWrapper>
                <ColWrapper span={6}>
                  <Link href={`/admin/info/businessInformation`}>
                    <CommonButton width={`200px`}>
                      사업자정보 관리 바로가기
                    </CommonButton>
                  </Link>
                </ColWrapper>
                <ColWrapper span={6}>
                  <Link href={`/admin/info/popup`}>
                    <CommonButton width={`200px`}>
                      팝업 관리 바로가기
                    </CommonButton>
                  </Link>
                </ColWrapper>
                <ColWrapper span={6}>
                  <Link href={`/admin/board/notice/list`}>
                    <CommonButton width={`200px`}>
                      공지사항 관리 바로가기
                    </CommonButton>
                  </Link>
                </ColWrapper>
                {/* <ColWrapper span={8}>
                  <Link href={``}>
                    <CommonButton width={`200px`}>
                      회원 리스트 관리 바로가기
                    </CommonButton>
                  </Link>
                </ColWrapper>
                <ColWrapper span={8}>
                  <Link href={``}>
                    <CommonButton width={`200px`}>
                      문의 리스트 관리 바로가기
                    </CommonButton>
                  </Link>
                </ColWrapper> */}
              </RowWrapper>
            </Wrapper>
          </Wrapper>
        </AdminLayout>
      ) : (
        <>
          <Wrapper dr={`row`} height={`100vh`}>
            <Wrapper
              width={`50%`}
              height={`100%`}
              bgImg={`url("https://firebasestorage.googleapis.com/v0/b/storage-4leaf.appspot.com/o/4leaf%2F5137894.jpg?alt=media&token=99858357-4602-44aa-b32a-e6c9867788ff")`}
            >
              <Image
                width={`300px`}
                alt="logo"
                src={`https://firebasestorage.googleapis.com/v0/b/storage-4leaf.appspot.com/o/4leaf%2Flogo%2F4leafsoftware_logo_LW.png?alt=media&token=bc68284c-e82a-42ee-b4c4-a95e0ebc699e`}
              />
              <Wrapper
                color={Theme.white_C}
                margin={`15px 0 0`}
                fontSize={`1.1rem`}
              >
                관리자페이지에 오신걸 환영합니다.
              </Wrapper>
            </Wrapper>
            <Wrapper width={`50%`}>
              <Wrapper width={`50%`}>
                <Wrapper
                  fontSize={`2rem`}
                  fontWeight={`bold`}
                  margin={`0 0 30px`}
                  al={`flex-start`}
                >
                  Log in
                </Wrapper>
                <Wrapper al={`flex-start`}>이메일</Wrapper>
                <Wrapper>
                  <Input
                    {...inputId}
                    onKeyDown={(e) => e.keyCode === 13 && onLoginHandler()}
                  />
                </Wrapper>
                <Wrapper al={`flex-start`} margin={`15px 0 0`}>
                  비밀번호
                </Wrapper>
                <Wrapper margin={`0 0 15px`}>
                  <Input
                    {...inputPw}
                    type={`password`}
                    onKeyDown={(e) => e.keyCode === 13 && onLoginHandler()}
                  />
                </Wrapper>
                <CommonButton width={`100%`} onClick={onLoginHandler}>
                  로그인
                </CommonButton>
              </Wrapper>
            </Wrapper>
          </Wrapper>
        </>
      )}
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

    // context.store.dispatch({
    //   type: ACCEPT_LOG_REQUEST,
    //   data: { typeId: "1" },
    // });

    // 구현부 종료
    context.store.dispatch(END);
    console.log("🍀 SERVER SIDE PROPS END");
    await context.store.sagaTask.toPromise();
  }
);

export default AdminHome;
