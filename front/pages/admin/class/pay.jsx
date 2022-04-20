import React, { useCallback, useEffect, useRef, useState } from "react";
import AdminLayout from "../../../components/AdminLayout";
import PageHeader from "../../../components/admin/PageHeader";
import Theme from "../../../components/Theme";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  Button,
  Modal,
  Select,
  notification,
  message,
  Form,
  DatePicker,
  Popconfirm,
} from "antd";

import { useRouter, withRouter } from "next/router";
import wrapper from "../../../store/configureStore";
import { END } from "redux-saga";
import axios from "axios";
import {
  Wrapper,
  AdminContent,
  ModalBtn,
  GuideUl,
  GuideLi,
  Text,
  TextInput,
  TextArea,
} from "../../../components/commonComponents";
import { LOAD_MY_INFO_REQUEST, USERLIST_REQUEST } from "../../../reducers/user";
import {
  CREATE_MODAL_CLOSE_REQUEST,
  CREATE_MODAL_OPEN_REQUEST,
  PAY_CLASS_CREATE_REQUEST,
  PAY_CLASS_DELETE_REQUEST,
  PAY_CLASS_LIST_REQUEST,
} from "../../../reducers/payClass";
import {
  LECTURE_ALL_LIST_REQUEST,
  LECTURE_DETAIL_REQUEST,
} from "../../../reducers/lecture";
import moment from "moment";

const LoadNotification = (msg, content) => {
  notification.open({
    message: msg,
    description: content,
    onClick: () => {},
  });
};

const DateInput = styled(DatePicker)`
  width: ${(props) => props.width || `100%`};
  &::placeholder {
    color: ${Theme.grey2_C};
  }
`;

const CusotmInput = styled(TextInput)`
  width: ${(props) => props.width || `100%`};
  &::placeholder {
    color: ${Theme.grey2_C};
  }
`;

const CustomArea = styled(TextArea)`
  width: 100%;
  border-radius: 0;
  &::placeholder {
    color: ${Theme.grey2_C};
  }
  &:focus {
    border: 1px solid ${Theme.grey2_C};
  }
`;

const FormTag = styled(Form)`
  width: 80%;
`;
const FormItem = styled(Form.Item)`
  width: ${(props) => props.width || `calc(100% - 80px)`};
  margin: ${(props) => props.margin || `0`};
  display: flex;
  flex-direction: ${(props) => props.dr || ``};
`;

const Pay = ({}) => {
  const { st_loadMyInfoDone, me } = useSelector((state) => state.user);
  const {
    createModal,
    payClassList,
    st_payClassCreateDone,
    st_payClassCreateError,
    st_payClassDeleteDone,
    st_payClassDeleteError,
    st_payClassListDone,
    st_payClassListError,
  } = useSelector((state) => state.payClass);
  const { allLectures, st_lectureDetailDone, st_lectureDetailError } =
    useSelector((state) => state.lecture);

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
  const dispatch = useDispatch();
  const [cForm] = Form.useForm();
  const [updateData, setUpdateData] = useState(null);

  ////// USEEFFECT //////

  useEffect(() => {
    if (st_payClassListDone) {
      message.success("결제클래스가 조회되었습니다.");
    }
  }, [st_payClassListDone]);

  useEffect(() => {
    if (st_payClassListError) {
      message.error(st_payClassListError);
    }
  }, [st_payClassListError]);

  useEffect(() => {
    if (st_payClassCreateDone) {
      message.success("결제클래스가 생성되었습니다.");
      modalClose();
      dispatch({
        type: PAY_CLASS_LIST_REQUEST,
      });
    }
  }, [st_payClassCreateDone]);

  useEffect(() => {
    if (st_payClassCreateError) {
      message.error(st_payClassCreateError);
    }
  }, [st_payClassCreateError]);

  useEffect(() => {
    if (st_payClassDeleteDone) {
      dispatch({
        type: PAY_CLASS_LIST_REQUEST,
      });
      message.success("삭제되었습니다.");
    }
  }, [st_payClassDeleteDone]);

  useEffect(() => {
    if (st_payClassDeleteError) {
      message.error(st_payClassDeleteError);
    }
  }, [st_payClassDeleteError]);

  ////// HANDLER //////

  const modalOk = useCallback(() => {
    cForm.submit();
  }, [cForm]);

  const onSubmit = useCallback((data) => {
    dispatch({
      type: PAY_CLASS_CREATE_REQUEST,
      data: {
        name: data.course,
        price: data.price,
        discount: data.discount,
        memo: data.memo,
        startDate: data.startDate,
        week: data.week,
        LectureId: data.lecture,
        domain: "https://pinterleaf.com/payment",
      },
    });
  }, []);
  const onSubmitDelete = useCallback((data) => {
    dispatch({
      type: PAY_CLASS_DELETE_REQUEST,
      data: {
        classId: data.id,
      },
    });
  }, []);
  ////// TOGGLE //////
  const modalOpen = useCallback(() => {
    dispatch({
      type: CREATE_MODAL_OPEN_REQUEST,
    });
  }, []);
  const modalClose = useCallback(() => {
    dispatch({
      type: CREATE_MODAL_CLOSE_REQUEST,
    });
    cForm.resetFields();
  }, [cForm]);

  const updateModalOpen = useCallback(
    (data) => {
      dispatch({
        type: CREATE_MODAL_OPEN_REQUEST,
      });

      setTimeout(() => {
        cForm.setFieldsValue({
          course: data.name,
          price: data.price,
          discount: data.discount,
          link: data.link,
          memo: data.memo,
          startDate: moment(data.startDate, "YYYY-MM-DD"),
          week: data.week,
          lecture: data.LectureId,
        });
      }, 500);
      setUpdateData(data);
    },
    [cForm]
  );

  const updateModalClose = useCallback(() => {
    dispatch({
      type: CREATE_MODAL_CLOSE_REQUEST,
    });
    setUpdateData(null);
    cForm.resetFields();
  }, [cForm]);

  const onChangeDetail = useCallback((data) => {
    dispatch({
      type: LECTURE_DETAIL_REQUEST,
      data: {},
    });
  }, []);

  const copyTextHandler = useCallback(() => {
    const obj = document.getElementById("copyInput");

    obj.select();

    obj.setSelectionRange(0, 9999);

    navigator.clipboard.writeText(obj.value).then(() => {
      message.success("복사되었습니다.");
    });
  }, []);

  const openLinkHandler = useCallback((link) => {
    window.open(link);
  }, []);

  ////// DATAVIEW //////

  ////// DATA COLUMNS //////

  const columns = [
    {
      title: "번호",
      dataIndex: "id",
    },
    {
      title: "결제 강의",
      dataIndex: "name",
    },
    {
      title: "강의 제목",
      render: (data) => {
        return <Text>{data.Lecture.course}</Text>;
      },
    },
    {
      title: "가격",
      render: (data) => {
        return <Text>&#36;{data.price}</Text>;
      },
    },
    {
      title: "할인률",
      render: (data) => {
        return <Text>{data.discount}%</Text>;
      },
    },
    {
      title: "결제 금액",
      render: (data) => {
        return (
          <Text>
            &#36;{Math.floor(data.price - (data.price * data.discount) / 100)}
          </Text>
        );
      },
    },

    {
      title: "생성일",
      render: (data) => {
        return <Text>{data.createdAt.slice(0, 10)}</Text>;
      },
    },

    {
      title: "상세보기",
      render: (data) => {
        return (
          <Button
            type={`primary`}
            size={`small`}
            onClick={() => updateModalOpen(data)}
          >
            DETAIL
          </Button>
        );
      },
    },
    {
      title: "삭제",
      render: (data) => {
        return (
          <Popconfirm
            placement="rightTop"
            title={"삭제하시겠습니까?"}
            onConfirm={() => onSubmitDelete(data)}
            okText="Yes"
            cancelText="No"
          >
            <Button type={`danger`} size={`small`}>
              DELETE
            </Button>
          </Popconfirm>
        );
      },
    },
  ];

  return (
    <AdminLayout>
      <PageHeader
        breadcrumbs={["클래스 관리", "결제 클래스 관리"]}
        title={`결제 클래스 관리`}
        subTitle={`결제 클래스를 조회하고 관리할 수 있습니다.`}
      />

      <AdminContent>
        <Wrapper margin="0px 0px 20px 0px" dr="row" ju="flex-end">
          <ModalBtn type="primary" size="small" onClick={modalOpen}>
            + 추가
          </ModalBtn>
        </Wrapper>

        <Table
          rowKey="id"
          columns={columns}
          dataSource={payClassList}
          size="small"
        />
      </AdminContent>

      <Modal
        visible={createModal}
        width="900px"
        onOk={updateData ? updateModalClose : modalOk}
        onCancel={updateData ? updateModalClose : modalClose}
        title={updateData ? "상세보기" : "결제 클래스 생성"}
      >
        <Wrapper>
          <FormTag form={cForm} onFinish={onSubmit}>
            <Wrapper dr={`row`} margin={`0 0 20px`}>
              <Text width={`80px`}>제목</Text>
              <FormItem
                rules={[{ required: true, message: "강의명을 입력해주세요." }]}
                name={`course`}
              >
                <CusotmInput disabled={updateData ? true : false} />
              </FormItem>
            </Wrapper>

            <Wrapper dr={`row`} margin={`0 0 20px`}>
              <Text width={`80px`}>강의</Text>
              <FormItem
                rules={[{ required: true, message: "강사를 선택해주세요." }]}
                name={`lecture`}
              >
                <Select
                  size={`large`}
                  disabled={updateData ? true : false}
                  onChange={(e) => onChangeDetail(e)}
                >
                  {allLectures &&
                    allLectures.map((data) => {
                      return (
                        <Select.Option key={data.id} value={data.id}>
                          {data.course}
                        </Select.Option>
                      );
                    })}
                </Select>
              </FormItem>
            </Wrapper>

            <Wrapper dr={`row`} margin={`0 0 20px`}>
              <Text width={`80px`}>가격</Text>
              <Text width={`30px`} padding={`0 0 0 10px`}>
                $
              </Text>
              <FormItem
                rules={[
                  { required: true, message: "강의 기간을 입력해주세요." },
                ]}
                name={`price`}
                width={`calc(100% - 110px)`}
              >
                <CusotmInput
                  disabled={updateData ? true : false}
                  type={`number`}
                />
              </FormItem>
            </Wrapper>

            <Wrapper dr={`row`} margin={`0 0 20px`}>
              <Text width={`80px`}>할인률</Text>
              <FormItem
                rules={[{ required: true, message: "할인률을 입력해주세요." }]}
                name={`discount`}
                width={`calc(100% - 110px)`}
              >
                <CusotmInput
                  disabled={updateData ? true : false}
                  type={`number`}
                />
              </FormItem>
              <Text width={`30px`} padding={`0 0 0 10px`}>
                %
              </Text>
            </Wrapper>

            <Wrapper dr={`row`} margin={`0 0 20px`}>
              <Text width={`80px`}>시작 날짜</Text>
              <FormItem
                rules={[
                  { required: true, message: "시작 날짜를 입력해주세요." },
                ]}
                name={`startDate`}
              >
                <DateInput
                  disabled={updateData ? true : false}
                  format={`YYYY-MM-DD`}
                  size={`large`}
                />
              </FormItem>
            </Wrapper>

            <Wrapper dr={`row`} margin={`0 0 20px`}>
              <Text width={`80px`}>강의 기간</Text>
              <FormItem
                rules={[
                  { required: true, message: "강의 기간을 입력해주세요." },
                ]}
                name={`week`}
                width={`calc(100% - 110px)`}
              >
                <CusotmInput
                  disabled={updateData ? true : false}
                  type={`number`}
                />
              </FormItem>
              <Text width={`30px`} padding={`0 0 0 10px`}>
                주
              </Text>
            </Wrapper>

            <Wrapper dr={`row`} margin={`0 0 20px`} al={`flex-start`}>
              <Text width={`80px`} margin={`8px 0 0`}>
                메모
              </Text>
              <FormItem
                rules={[{ required: true, message: "메모를 작성해주세요." }]}
                name={`memo`}
              >
                <CustomArea disabled={updateData ? true : false} />
              </FormItem>
            </Wrapper>
            {updateData && (
              <Wrapper dr={`row`} margin={`0 0 20px`} al={`flex-start`}>
                <Text width={`80px`} margin={`8px 0 0`}>
                  결제창 링크
                </Text>
                <Wrapper
                  dr={`row`}
                  width={`calc(100% - 80px)`}
                  al={`flex-start`}
                >
                  <Wrapper width={`calc(100% - 100px)`}>
                    <Form.Item
                      style={{ width: `100%` }}
                      rules={[
                        { required: true, message: "메모를 작성해주세요." },
                      ]}
                      name={`link`}
                    >
                      <CusotmInput
                        id="copyInput"
                        height={`48px`}
                        disabled={updateData ? true : false}
                      />
                    </Form.Item>
                  </Wrapper>
                  <Wrapper width={`100px`}>
                    <Button
                      size="small"
                      type="primary"
                      style={{ width: `100px`, borderRadius: `0` }}
                      onClick={copyTextHandler}
                    >
                      복사하기
                    </Button>
                    <Button
                      size="small"
                      type="primary"
                      style={{ width: `100px`, borderRadius: `0` }}
                      onClick={() => openLinkHandler(updateData.link)}
                    >
                      이동하기
                    </Button>
                  </Wrapper>
                </Wrapper>
              </Wrapper>
            )}
          </FormTag>
        </Wrapper>
      </Modal>
      {/* 가격 할인 시작일 끝일 링크 메모 */}
      <Modal
        visible={false}
        width="900px"
        onOk={() => {}}
        onCancel={() => {}}
        title="주의사항"
      >
        <GuideUl>
          <GuideLi>asdfasdf</GuideLi>
          <GuideLi isImpo={true}>asdfasdf</GuideLi>
        </GuideUl>
      </Modal>
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
      type: PAY_CLASS_LIST_REQUEST,
    });
    context.store.dispatch({
      type: LECTURE_ALL_LIST_REQUEST,
      data: {
        TeacherId: "",
        time: "",
        startLv: "",
        studentName: "",
      },
    });

    // 구현부 종료
    context.store.dispatch(END);
    console.log("🍀 SERVER SIDE PROPS END");
    await context.store.sagaTask.toPromise();
  }
);

export default withRouter(Pay);
