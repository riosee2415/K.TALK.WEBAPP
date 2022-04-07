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
import { PARTICIPANT_CREATE_REQUEST } from "../../../../reducers/participant";
import useInput from "../../../../hooks//useInput";
import { SearchOutlined } from "@ant-design/icons";
import Theme from "../../../../components/Theme";

const AdminContent = styled.div`
  padding: 20px;
`;

const UserList = ({}) => {
  const { Option } = Select;
  // LOAD CURRENT INFO AREA /////////////////////////////////////////////
  const { me, st_loadMyInfoDone } = useSelector((state) => state.user);
  const { allLectures } = useSelector((state) => state.lecture);

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
    allUsers,
    classChangeModal,
    classPartModal,
    //
    st_userListError,
    //
    st_userChangeDone,
    st_userChangeError,
  } = useSelector((state) => state.user);

  const { st_participantCreateDone, st_participantCreateError } = useSelector(
    (state) => state.participant
  );

  const [updateData, setUpdateData] = useState(null);
  const [lectureList, setLectureList] = useState(null);
  const [selectedList, setSelectedList] = useState([]);

  const [detailDatum, setDetailDatum] = useState([]);

  const [opt1, setOpt1] = useState(null);
  const [opt2, setOpt2] = useState(null);
  const [opt3, setOpt3] = useState(null);

  const [detailToggle, setDetailToggle] = useState(false);

  const [parData, setParData] = useState(null);

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
  }, [router.query]);

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
    setOpt1(
      updateData &&
        updateData.Participants.map((data) => {
          return <Option value={data.LectureId}>{data.Lecture.course}</Option>;
        })
    );
  }, [updateData]);

  useEffect(() => {
    setOpt3(
      parData &&
        parData.Participants.map((data) => {
          return <Option value={data.LectureId}>{data.Lecture.course}</Option>;
        })
    );
  }, [parData]);

  useEffect(() => {
    setOpt2(
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

  ////// HANDLER //////

  const onModalOk = useCallback(() => {
    form.submit();
  }, [form]);

  const onModalChangeOk = useCallback(() => {
    updateClassform.submit();
  }, [form]);

  const onSubmit = useCallback(
    (data) => {
      if (!data.lecture || data.lecture === "--- 선택 ---") {
        return message.error(`현재 강의를 선택해주세요.`);
      }
      if (!data.changelecture || data.changelecture === "--- 선택 ---") {
        return message.error(`바꿀 강의를 선택해주세요.`);
      }

      dispatch({
        type: USER_CLASS_CHANGE_REQUEST,
        data: {
          UserId: updateData.id,
          LectureId: data.lecture,
          ChangeLectureId: data.changelecture,
        },
      });
    },
    [selectedList, updateData]
  );

  const onUpdateClassSubmit = useCallback(
    (data) => {
      dispatch({
        type: PARTICIPANT_CREATE_REQUEST,
        data: {
          UserId: parData.id,
          LectureId: data.partLecture,
        },
      });
    },
    [parData]
  );

  const onUpdateEndClassSubmit = useCallback(
    (data) => {
      if (!data.lecture || data.lecture === "--- 선택 ---") {
        return message.error(`현재 강의를 선택해주세요.`);
      }
      if (!data.changelecture || data.changelecture === "--- 선택 ---") {
        return message.error(`바꿀 강의를 선택해주세요.`);
      }

      dispatch({
        type: USER_CLASS_CHANGE_REQUEST,
        data: {
          UserId: updateData.id,
          LectureId: data.lecture,
          ChangeLectureId: data.changelecture,
        },
      });
    },

    []
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

  // const selectChangeHandler = useCallback(
  //   (e) => {
  //     const id = parseInt(e.split(`.`)[0]);
  //     setLectureList(lectureList.filter((data) => data.id !== id));

  //     const state = selectedList;
  //     state.push(lectureList.filter((data) => data.id === id)[0]);
  //     setSelectedList(state);
  //   },
  //   [lectureList, selectedList]
  // );

  // const selectCancelHandler = useCallback(
  //   (cancelData) => {
  //     setSelectedList(selectedList.filter((data) => data.id !== cancelData.id));

  //     const state = lectureList;
  //     state.push(cancelData);
  //     setLectureList(state);
  //   },
  //   [lectureList, selectedList]
  // );

  const onSeachHandler = useCallback((value) => {
    console.log(value);
  }, []);

  const detailModalOpen = useCallback((data) => {
    console.log(data, "data");
    setDetailToggle(true);
    setDetailDatum(data.Participants);
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
      title: "반 옮기기",
      render: (data) => (
        <Button
          size="small"
          type="primary"
          onClick={() =>
            data.level === 5
              ? message.error("개발사는 권한을 수정할 수 없습니다.")
              : classChangeModalOpen(data)
          }
        >
          반 옮기기
        </Button>
      ),
    },

    {
      title: "수업참여",
      render: (data) => (
        <Button
          size="small"
          type="primary"
          onClick={() =>
            data.level === 5
              ? message.error("개발사는 권한을 수정할 수 없습니다.")
              : classPartModalOpen(data)
          }
        >
          수업참여
        </Button>
      ),
    },

    {
      title: "수업종료",
      render: (data) => (
        <Button
          size="small"
          type="primary"
          onClick={() =>
            data.level === 5
              ? message.error("개발사는 권한을 수정할 수 없습니다.")
              : classPartModalOpen(data)
          }
        >
          수업종료
        </Button>
      ),
    },

    {
      title: "참가중인 강의",
      render: (data) => (
        <Button
          size="small"
          type="primary"
          onClick={() => detailModalOpen(data)}
        >
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
      render: (data) => <div>{data.Lecture.course}</div>,
    },

    {
      title: "요일",
      render: (data) => <div>{data.Lecture.day}</div>,
    },

    {
      title: "시간",
      render: (data) => <div>{data.Lecture.time}</div>,
    },

    {
      title: "총 강의 수",
      render: (data) => <div>{data.Lecture.lecDate * data.Lecture.count}</div>,
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
        onOk={onModalOk}
      >
        <Wrapper padding={`10px`} al={`flex-start`}>
          <Form form={form} style={{ width: `100%` }} onFinish={onSubmit}>
            <Form.Item label={`학생`}>
              <Input disabled value={updateData && updateData.username} />
            </Form.Item>

            <Form.Item label={`현재 강의`} name={`lecture`}>
              <Select
                width={`100%`}
                height={`32px`}
                showSearch
                placeholder="Select a Lecture"
              >
                {opt1}
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
                {opt2}
              </Select>
            </Form.Item>
          </Form>
        </Wrapper>
      </Modal>

      <Modal
        visible={classPartModal}
        width={`400px`}
        title={`학생 수업 참여`}
        onCancel={classPartModalClose}
        onOk={onModalChangeOk}
      >
        <Wrapper padding={`10px`} al={`flex-start`}>
          <Form
            form={updateClassform}
            style={{ width: `100%` }}
            onFinish={onUpdateClassSubmit}
          >
            <Form.Item label={`학생`}>
              <Input disabled value={parData && parData.username} />
            </Form.Item>

            <Form.Item label={`참여할 강의`} name={`partLecture`}>
              <Select
                width={`100%`}
                height={`32px`}
                showSearch
                onChange={onSeachHandler}
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
                placeholder="Select a Lecture"
              >
                {opt2}
              </Select>
            </Form.Item>
          </Form>
        </Wrapper>
      </Modal>

      <Modal
        visible={classPartModal}
        width={`400px`}
        title={`학생 수업 종료`}
        onCancel={classPartModalClose}
        onOk={onModalChangeOk}
      >
        <Wrapper padding={`10px`} al={`flex-start`}>
          <Form
            form={updateEndClassform}
            style={{ width: `100%` }}
            onFinish={onUpdateEndClassSubmit}
          >
            <Form.Item label={`학생`}>
              <Input disabled value={parData && parData.username} />
            </Form.Item>

            <Form.Item label={`종료할 강의`} name={`partLecture`}>
              <Select
                width={`100%`}
                height={`32px`}
                showSearch
                onChange={onSeachHandler}
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
                placeholder="Select a Lecture"
              >
                {opt3}
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
        onCancel={() => setDetailToggle(false)}
      >
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
          fontWeight={`500`}
        >
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
