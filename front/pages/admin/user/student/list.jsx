import React, { useCallback, useEffect, useState } from "react";
import AdminLayout from "../../../../components/AdminLayout";
import PageHeader from "../../../../components/admin/PageHeader";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import {
  LOAD_MY_INFO_REQUEST,
  CHANGE_CLASS_CLOSE_REQUEST,
  CHANGE_CLASS_OPEN_REQUEST,
  USER_ALL_LIST_REQUEST,
  USER_CLASS_CHANGE_REQUEST,
  CLASS_PART_CLOSE_REQUEST,
  CLASS_PART_OPEN_REQUEST,
} from "../../../../reducers/user";
import { Table, Button, message, Modal, Select, Input, Form } from "antd";
import { useRouter, withRouter } from "next/router";
import wrapper from "../../../../store/configureStore";
import { END } from "redux-saga";
import axios from "axios";
import {
  Combo,
  ComboOption,
  Text,
  Wrapper,
} from "../../../../components/commonComponents";
import { LECTURE_ALL_LIST_REQUEST } from "../../../../reducers/lecture";
import { CloseCircleOutlined } from "@ant-design/icons";
import {
  PARTICIPANT_CREATE_REQUEST,
  PARTICIPANT_DELETE_REQUEST,
} from "../../../../reducers/participant";
import useInput from "../../../../hooks//useInput";
import { SearchOutlined } from "@ant-design/icons";
import Theme from "../../../../components/Theme";
import { PAYMENT_LIST_REQUEST } from "../../../../reducers/payment";
import moment from "moment";

const AdminContent = styled.div`
  padding: 20px;
`;

const UserList = ({}) => {
  const { Option } = Select;
  // LOAD CURRENT INFO AREA /////////////////////////////////////////////

  const { allLectures } = useSelector((state) => state.lecture);

  const {
    me,
    st_loadMyInfoDone,

    allUsers,
    classChangeModal,
    classPartModal,
    //
    st_userListError,
    //
    st_userChangeDone,
    st_userChangeError,
  } = useSelector((state) => state.user);

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

  const {
    st_participantCreateDone,
    st_participantCreateError,
    st_participantDeleteDone,
    st_participantDeleteError,
  } = useSelector((state) => state.participant);

  const { paymentList, st_paymentListDone, st_paymentListError } = useSelector(
    (state) => state.payment
  );

  const [paymentData, setPaymentData] = useState([]);
  const [updateData, setUpdateData] = useState(null);
  const [lectureList, setLectureList] = useState(null);
  const [selectedList, setSelectedList] = useState([]);

  const [detailDatum, setDetailDatum] = useState([]);

  const [opt2, setOpt2] = useState(null);
  const [opt4, setOpt4] = useState(null);

  const [detailToggle, setDetailToggle] = useState(false);
  const [classPartEndModal, setClassPartEndModal] = useState(false);

  const [parData, setParData] = useState(null);
  const [parEndData, setParEndData] = useState(null);

  const [form] = Form.useForm();
  const [updateClassform] = Form.useForm();
  const [updateEndClassform] = Form.useForm();

  const inputName = useInput("");
  const inputEmail = useInput("");

  ////// USEEFFECT //////

  useEffect(() => {
    dispatch({
      type: USER_ALL_LIST_REQUEST,
      data: {
        type: 1,
        name: "",
        email: "",
      },
    });

    dispatch({
      type: LECTURE_ALL_LIST_REQUEST,
      data: {
        listType: 2,
        TeacherId: "",
      },
    });
  }, [router.query, st_participantDeleteDone, st_participantCreateDone]);

  useEffect(() => {
    if (st_userChangeDone) {
      dispatch({
        type: USER_ALL_LIST_REQUEST,
        data: {
          type: 1,
          name: "",
          email: "",
        },
      });

      dispatch({
        type: LECTURE_ALL_LIST_REQUEST,
        data: {
          listType: 2,
          TeacherId: "",
        },
      });
      classChangeModalClose();
      return message.success("학생의 반이 옮겨졌습니다.");
    }
  }, [st_userChangeDone]);

  useEffect(() => {
    if (st_userListError) {
      return message.error(st_userListError);
    }
  }, [st_userListError]);

  useEffect(() => {
    if (st_userChangeError) {
      return message.error(st_userChangeError);
    }
  }, [st_userChangeError]);

  useEffect(() => {
    if (st_participantCreateDone) {
      classPartModalClose();
      return message.success("해당 학생을 수업에 참여시켰습니다.");
    }
  }, [st_participantCreateDone]);

  useEffect(() => {
    if (st_participantCreateError) {
      return message.error(st_participantCreateError);
    }
  }, [st_participantCreateError]);

  useEffect(() => {
    // console.log(parData.Participants, "aaaa");

    setOpt2(
      paymentList &&
        paymentList.map((data) => {
          if (data.UserId) return;
          return (
            <Option
              key={data.id}
              value={`${data.id},${data.LetureId},${data.week}`}>
              {data.createdAt.slice(0, 10)} | {data.course} | &#36;
              {data.price} | &nbsp;{data.email}
            </Option>
          );
        })
    );
  }, [paymentList]);

  useEffect(() => {
    setOpt4(
      allLectures &&
        allLectures.map((data) => {
          return (
            <Option key={data.id} value={data.id}>
              {data.course}
            </Option>
          );
        })
    );
  }, [allLectures]);

  useEffect(() => {
    if (st_paymentListError) {
      return message.error(st_paymentListError);
    }
  }, [st_paymentListError]);

  useEffect(() => {
    if (st_participantDeleteDone) {
      classPartEndModalClose();
      return message.success("해당 학생이 수업에서 제외되었습니다.");
    }
  }, [st_participantDeleteDone]);

  useEffect(() => {
    if (st_participantDeleteError) {
      return message.error(st_participantDeleteError);
    }
  }, [st_participantDeleteError]);

  ////// TOGGLE //////
  const classChangeModalOpen = useCallback(
    (data) => {
      dispatch({
        type: CHANGE_CLASS_OPEN_REQUEST,
      });

      setUpdateData(data);
    },
    [classChangeModal]
  );

  const classChangeModalClose = useCallback(() => {
    dispatch({
      type: CHANGE_CLASS_CLOSE_REQUEST,
    });
    setUpdateData(null);
    form.resetFields();
  }, [classChangeModal, form]);

  const classPartModalOpen = useCallback(
    (data) => {
      dispatch({
        type: CLASS_PART_OPEN_REQUEST,
      });

      dispatch({
        type: PAYMENT_LIST_REQUEST,
        data: {
          email: data.email,
        },
      });

      updateClassform.resetFields();
      setParData(data);
    },
    [classPartModal]
  );

  const classPartModalClose = useCallback(
    (data) => {
      dispatch({
        type: CLASS_PART_CLOSE_REQUEST,
      });

      setParData(null);
    },
    [classPartModal]
  );

  const classPartEndModalOpen = useCallback((data) => {
    setClassPartEndModal(true);

    updateEndClassform.resetFields();

    onFillEnd(data);
    setParEndData(data);
  }, []);

  const classPartEndModalClose = useCallback((data) => {
    setClassPartEndModal(false);
    setParEndData(null);
  }, []);

  const onFillEnd = useCallback((data) => {
    updateEndClassform.setFieldsValue({
      userName: data.username,
    });
  }, []);

  ////// HANDLER //////

  const onSubmitEnd = useCallback(() => {
    updateEndClassform.submit();
  }, []);

  const onModalOk = useCallback(() => {
    form.submit();
  }, [form]);

  const onModalChangeOk = useCallback(() => {
    updateClassform.submit();
  }, [form]);

  const onSubmit = useCallback(
    async (data) => {
      if (!data.lecture) {
        return message.error(`현재 강의를 선택해주세요.`);
      }
      if (!data.changelecture) {
        return message.error(`바꿀 강의를 선택해주세요.`);
      }

      let LectureId = data.lecture.split(",")[0];
      let endDate = data.lecture.split(",")[2];

      let Day = Math.abs(
        parseInt(moment.duration(moment().diff(moment(endDate))).asDays())
      );

      dispatch({
        type: USER_CLASS_CHANGE_REQUEST,
        data: {
          UserId: updateData.id,
          LectureId: LectureId,
          ChangeLectureId: data.changelecture,
          date: Day,
          endDate: endDate,
        },
      });
    },
    [selectedList, updateData, paymentList]
  );

  const onUpdateClassSubmit = useCallback(
    (data) => {
      // if (paymentData.length !== 0) {
      //   day = paymentData[0].week * 7;
      //   saveData = moment().add(day, "days").format("YYYY-MM-DD");
      // }

      console.log(data, "data");
      console.log(parData, "parData");

      let PaymentId = data.partLecture.split(",")[0];
      let LectureId = data.partLecture.split(",")[1];
      let date = parseInt(data.partLecture.split(",")[2]) * 7;
      let saveData = moment().add(date, "days").format("YYYY-MM-DD");

      dispatch({
        type: PARTICIPANT_CREATE_REQUEST,
        data: {
          UserId: parData.id,
          LectureId: LectureId,
          date: date,
          endDate: saveData,
          PaymentId,
        },
      });
    },
    [parData, allLectures]
  );

  const onEndClassSubmit = useCallback(
    (data) => {
      dispatch({
        type: PARTICIPANT_DELETE_REQUEST,
        data: {
          UserId: parEndData.id,
          LectureId: data.partLecture,
        },
      });
    },
    [parEndData]
  );

  const onSeachStuHandler = useCallback(() => {
    dispatch({
      type: USER_ALL_LIST_REQUEST,
      data: {
        type: 1,
        name: inputName.value,
        email: inputEmail.value,
      },
    });
  }, [inputName.value, inputEmail.value]);

  const selectChangeHandler = useCallback(
    (e) => {
      const id = parseInt(e.split(`.`)[0]);
      setLectureList(lectureList.filter((data) => data.id !== id));

      const state = selectedList;
      state.push(lectureList.filter((data) => data.id === id)[0]);
      setSelectedList(state);
    },
    [lectureList, selectedList]
  );

  const selectCancelHandler = useCallback(
    (cancelData) => {
      setSelectedList(selectedList.filter((data) => data.id !== cancelData.id));

      const state = lectureList;
      state.push(cancelData);
      setLectureList(state);
    },
    [lectureList, selectedList]
  );

  const onSeachHandler = useCallback((LectureId, paymentData) => {
    let arr = [];

    paymentData.map((data, idx) => {
      if (data.LetureId === LectureId) {
        arr.push({
          id: data.id,
          week: data.week,
        });
      }
    });

    setPaymentData(arr);
  }, []);

  const detailModalOpen = useCallback((data) => {
    setDetailToggle(true);

    let save = data.Participants.filter((Datum, idx) => {
      return !Datum.isChange && !Datum.isDelete;
    });

    setDetailDatum(save);
  }, []);

  ////// DATAVIEW //////

  const column = [
    {
      title: "번호",
      dataIndex: "id",
    },

    {
      title: "회원이름",
      render: (data) => <div>{data.username}</div>,
    },
    {
      title: "회원아이디",
      render: (data) => <div>{data.userId}</div>,
    },
    {
      title: "이메일",
      render: (data) => <div>{data.email}</div>,
    },
    {
      title: "전화번호",
      render: (data) => <div>{data.mobile}</div>,
    },
    {
      title: "권한",
      render: (data) => (
        <div>
          {data.level === 1
            ? "일반학생"
            : data.level === 2
            ? "강사"
            : data.level === 3
            ? "운영자"
            : data.level === 4
            ? "최고관리자"
            : "개발사"}
        </div>
      ),
    },
    {
      title: "기능",
      render: (data) => (
        <Wrapper>
          <Button
            size="small"
            type="primary"
            onClick={() =>
              data.level === 5
                ? message.error("개발사는 권한을 수정할 수 없습니다.")
                : classChangeModalOpen(data)
            }>
            반 옮기기
          </Button>

          <Button
            size="small"
            onClick={() =>
              data.level === 5
                ? message.error("개발사는 권한을 수정할 수 없습니다.")
                : classPartModalOpen(data)
            }>
            수업참여
          </Button>

          <Button
            size="small"
            type="primary"
            onClick={() =>
              data.level === 5
                ? message.error("개발사는 권한을 수정할 수 없습니다.")
                : classPartEndModalOpen(data)
            }>
            수업뺴기
          </Button>
        </Wrapper>
      ),
    },

    {
      title: "참가중인 강의",
      render: (data) => (
        <Button
          size="small"
          type="primary"
          onClick={() => detailModalOpen(data)}>
          참가중인 강의
        </Button>
      ),
    },

    // {
    //   title: "DELETE",
    //   render: (data) => (
    //     <Button type="danger" onClick={deletePopToggle(data.id)}>
    //       DEL
    //     </Button>
    //   ),
    // },
  ];

  const columnsList = [
    {
      title: "No",
      dataIndex: "id",
    },

    {
      title: "수업 이름",
      render: (data) => <div>{data.Lecture && data.Lecture.course}</div>,
    },

    {
      title: "요일",
      render: (data) => <div>{data.Lecture && data.Lecture.day}</div>,
    },

    {
      title: "시간",
      render: (data) => <div>{data.Lecture && data.Lecture.time}</div>,
    },

    {
      title: "총 강의 수",
      render: (data) => <div>{data.Lecture && data.Lecture.count}</div>,
    },
  ];
  return (
    <AdminLayout>
      <PageHeader
        breadcrumbs={["회원 관리", "관리"]}
        title={`학생 목록`}
        subTitle={`홈페이지에 가입한 학생을 확인할 수 있습니다.`}
      />
      {/* <AdminTop createButton={true} createButtonAction={() => {})} /> */}

      <AdminContent>
        <Wrapper dr={`row`} ju={`flex-start`} margin={`0 0 10px`}>
          <Input
            size="small"
            style={{ width: "20%" }}
            placeholder="사용자명"
            {...inputName}
          />
          <Input
            size="small"
            style={{ width: "20%" }}
            placeholder="이메일"
            {...inputEmail}
          />
          <Button size="small" onClick={() => onSeachStuHandler()}>
            <SearchOutlined />
            검색
          </Button>
        </Wrapper>

        <Table
          rowKey="id"
          columns={column}
          dataSource={allUsers ? allUsers : []}
          size="small"
        />
      </AdminContent>

      <Modal
        visible={classChangeModal}
        width={`400px`}
        title={`학생 수업 변경`}
        onCancel={classChangeModalClose}
        onOk={onModalOk}>
        <Wrapper padding={`10px`} al={`flex-start`}>
          <Form
            form={form}
            style={{ width: `100%` }}
            onFinish={(data) => onSubmit(data)}>
            <Form.Item label={`학생`}>
              <Input disabled value={updateData && updateData.username} />
            </Form.Item>

            <Form.Item label={`현재 강의`} name={`lecture`}>
              <Select
                width={`100%`}
                height={`32px`}
                showSearch
                placeholder="Select a Lecture">
                {updateData &&
                  updateData.Participants.map((data, idx) => {
                    if (data.isDelete) {
                      return null;
                    } else if (data.isChange) {
                      return null;
                    }

                    return (
                      <Option
                        key={data.id}
                        value={`${data.LectureId},${data.date},${data.endDate}`}>
                        {data.Lecture?.course}
                      </Option>
                    );
                  })}
              </Select>
            </Form.Item>

            <Form.Item label={`바뀔 강의`} name={`changelecture`}>
              <Select
                width={`100%`}
                height={`32px`}
                showSearch
                placeholder="Select a Lecture"
                // name={`changelecture`}
              >
                {opt4}
              </Select>
            </Form.Item>
          </Form>
        </Wrapper>
      </Modal>

      <Modal
        visible={classPartModal}
        width={`800px`}
        title={`학생 수업 참여`}
        onCancel={classPartModalClose}
        onOk={onModalChangeOk}>
        <Wrapper padding={`10px`} al={`flex-start`}>
          <Form
            form={updateClassform}
            style={{ width: `100%` }}
            onFinish={onUpdateClassSubmit}>
            <Form.Item label={`학생`}>
              <Input disabled value={parData && parData.username} />
            </Form.Item>

            <Form.Item
              label={`참여할 강의`}
              name={`partLecture`}
              rules={[
                { required: true, message: "참가시킬 강의를 선택해주세요." },
              ]}>
              <Select
                width={`100%`}
                height={`32px`}
                showSearch
                onChange={(LectureId) => onSeachHandler(LectureId, paymentList)}
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
                placeholder="Select a Lecture">
                {opt2}
              </Select>
            </Form.Item>
          </Form>
        </Wrapper>
      </Modal>

      <Modal
        visible={classPartEndModal}
        width={`400px`}
        title={`학생 수업 변경`}
        onCancel={classPartEndModalClose}
        onOk={onSubmitEnd}>
        <Wrapper padding={`10px`} al={`flex-start`}>
          <Form
            form={updateEndClassform}
            style={{ width: `100%` }}
            onFinish={onEndClassSubmit}>
            <Form.Item label={`학생`} name={`userName`}>
              <Input disabled value={parEndData && parEndData.username} />
            </Form.Item>

            <Form.Item label={`종료할 강의`} name={`partLecture`}>
              <Select
                width={`100%`}
                height={`32px`}
                showSearch
                placeholder="Select a Lecture">
                {parEndData &&
                  parEndData.Participants.map((data, idx) => {
                    if (data.isDelete) {
                      return null;
                    } else if (data.isChange) {
                      return null;
                    }

                    return (
                      <Option key={data.id} value={data.LectureId}>
                        {data.Lecture?.course}
                      </Option>
                    );
                  })}
              </Select>
            </Form.Item>
          </Form>
        </Wrapper>
      </Modal>

      <Modal
        visible={detailToggle}
        width={`80%`}
        title={`학생 강의 목록`}
        footer={null}
        onCancel={() => setDetailToggle(false)}>
        <Table
          rowKey="id"
          columns={columnsList}
          dataSource={detailDatum}
          size="small"
        />
        <Text
          padding={`16px 0px`}
          color={Theme.black_2C}
          fontSize={`16px`}
          fontWeight={`500`}>
          학생강의 참여 및 이동 기록
        </Text>

        {/* <Table
          rowKey="id"
          columns={columnsList}
          dataSource={detailDatum}
          size="small"
        /> */}
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

    // 구현부 종료
    context.store.dispatch(END);
    console.log("🍀 SERVER SIDE PROPS END");
    await context.store.sagaTask.toPromise();
  }
);

export default withRouter(UserList);
