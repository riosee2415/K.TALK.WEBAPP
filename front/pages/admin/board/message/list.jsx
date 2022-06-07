import React, { useCallback, useEffect, useState, useRef } from "react";

import { END } from "redux-saga";
import axios from "axios";
import wrapper from "../../../../store/configureStore";

import AdminLayout from "../../../../components/AdminLayout";
import AdminTop from "../../../../components/admin/AdminTop";
import PageHeader from "../../../../components/admin/PageHeader";
import styled from "styled-components";
import {
  Button,
  Table,
  Modal,
  Form,
  Input,
  Select,
  notification,
  message,
  Empty,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import {
  Wrapper,
  TextInput,
  Text,
  CommonButton,
} from "../../../../components/commonComponents";

import {
  MESSAGE_ADMIN_LIST_REQUEST,
  MESSAGE_ALL_CREATE_REQUEST,
  MESSAGE_CREATE_REQUEST,
  MESSAGE_LECTURE_CREATE_REQUEST,
  MESSAGE_MANY_CREATE_REQUEST,
} from "../../../../reducers/message";
import { LECTURE_ALL_LIST_REQUEST } from "../../../../reducers/lecture";
import { LOAD_MY_INFO_REQUEST } from "../../../../reducers/user";
import { PARTICIPANT_USER_LIMIT_LIST_REQUEST } from "../../../../reducers/participant";

import { useDispatch, useSelector } from "react-redux";
import { withRouter } from "next/router";
import useInput from "../../../../hooks/useInput";
import useWidth from "../../../../hooks/useWidth";
import Theme from "../../../../components/Theme";
import moment from "moment";

const CustomForm = styled(Form)`
  width: 100%;

  & .ant-form-item {
    width: 100%;
  }
`;

const CusotmInput = styled(TextInput)`
  border: none;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.15);

  &::placeholder {
    color: ${Theme.grey2_C};
  }

  &:focus {
    border: 1px solid ${Theme.basicTheme_C};
  }
`;

const AdminContent = styled.div`
  padding: 20px;
`;

const CustomModal = styled(Modal)`
  & .ant-modal-body {
    min-height: ${(props) => props.minHeight};
  }

  & .ant-modal-header,
  & .ant-modal-content {
    border-radius: 5px;
  }

  & .ant-modal-title {
    font-size: 20px;
    font-weight: bold;
  }

  @media (max-width: 700px) {
    & .ant-modal-title {
      font-size: 16px;
    }
  }
`;

const LoadNotification = (msg, content) => {
  notification.open({
    message: msg,
    description: content,
    onClick: () => {},
  });
};

const List = ({ router }) => {
  const { Option } = Select;

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
  const dispatch = useDispatch();

  const formRef = useRef();

  const inputSearch = useInput("");

  const [form] = Form.useForm();
  const [Allform] = Form.useForm();
  const [groupform] = Form.useForm();
  const [lectureform] = Form.useForm();
  const [lectureEndform] = Form.useForm();

  const [selectValue, setSelectValue] = useState("");

  const [updateData, setUpdateData] = useState(null);
  const [contentViewToggle, setContentViewToggle] = useState(false);
  const [contentData, setContentData] = useState(null);

  const [allSendToggle, setAllSendToggle] = useState(false);
  const [lectureToggle, setLectureToggle] = useState(false);
  const [manySendToggle, setManySendToggle] = useState(false);

  const [deletePopVisible, setDeletePopVisible] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [listType, setListType] = useState("");

  const [answerModal, setAnswerModal] = useState(false);

  const [currentChecks, setCurrentChecks] = useState([]);
  const [currentCheckDatum, setCurrentCheckDatum] = useState([]);

  const [lectureEndModal, setLectureEndModal] = useState(false);

  const [lectureEndChecks, setLectureEndChecks] = useState([]);
  const [lectureEndCheckDatum, setLectureEndCheckDatum] = useState([]);

  ////// REDUX //////
  const {
    messageAdminList,

    st_messageAdminListDone,
    st_messageAdminListError,

    st_messageCreateDone,
    st_messageCreateError,

    st_messageAllCreateDone,
    st_messageAllCreateError,

    st_messageLectureCreateDone,
    st_messageLectureCreateError,

    st_messageManyCreateDone,
    st_messageManyCreateError,
  } = useSelector((state) => state.message);

  const {
    partUserLimitList,
    st_participantUserLimitListDone,
    st_participantUserLimitListError,
  } = useSelector((state) => state.participant);

  const { allLectures, st_lectureAllListError } = useSelector(
    (state) => state.lecture
  );

  ////// USEEFFECT //////

  useEffect(() => {
    if (router.query.type) {
      if (router.query.type === "all") {
        listTypeHandler(3);
      }
      if (router.query.type === "stu") {
        listTypeHandler(1);
      }
      if (router.query.type === "tea") {
        listTypeHandler(2);
      }
    }
  }, [router.query]);

  useEffect(() => {
    if (st_lectureAllListError) {
      return message.error(st_lectureAllListError);
    }
  }, [st_lectureAllListError]);

  useEffect(() => {
    if (st_messageLectureCreateDone) {
      onReset();
    }
  }, [st_messageLectureCreateDone]);

  useEffect(() => {
    if (st_messageAllCreateDone) {
      onReset();
      return message.success("쪽지를 보냈습니다.");
    }
  }, [st_messageAllCreateDone]);

  useEffect(() => {
    if (st_messageAllCreateError) {
      return message.error(st_messageAllCreateError);
    }
  }, [st_messageAllCreateError]);

  useEffect(() => {
    if (st_messageCreateDone) {
      onReset();
      return message.success("쪽지를 보냈습니다.");
    }
  }, [st_messageCreateDone]);

  useEffect(() => {
    if (st_messageAdminListError) {
      return message.error(st_messageAdminListError);
    }
  }, [st_messageAdminListError]);

  useEffect(() => {
    if (st_messageLectureCreateDone) {
      return message.success("쪽지를 보냈습니다.");
    }
  }, [st_messageLectureCreateDone]);

  useEffect(() => {
    if (st_messageManyCreateDone) {
      onReset();
      setCurrentCheckDatum([]);
      setCurrentChecks([]);

      return message.success("쪽지를 보냈습니다.");
    }
  }, [st_messageManyCreateDone]);

  useEffect(() => {
    if (st_messageManyCreateError) {
      return message.error(st_messageManyCreateError);
    }
  }, [st_messageManyCreateError]);

  useEffect(() => {
    if (st_participantUserLimitListError) {
      return message.error(st_participantUserLimitListError);
    }
  }, [st_participantUserLimitListError]);

  useEffect(() => {
    if (st_messageCreateError) {
      return message.error(st_messageCreateError);
    }
  }, [st_messageCreateError]);

  useEffect(() => {
    if (st_messageAdminListDone) {
    }
  }, [st_messageAdminListDone]);

  useEffect(() => {
    if (st_participantUserLimitListDone) {
      setLectureEndModal(true);
    }
  }, [st_participantUserLimitListDone]);

  useEffect(() => {
    if (st_messageLectureCreateError) {
      return message.error(st_messageLectureCreateError);
    }
  }, [st_messageLectureCreateError]);

  ////// TOGGLE ///////

  const updateModalOpen = useCallback((data) => {
    setAnswerModal(true);
    setUpdateData(data);
    onFill(data);
  }, []);

  const contentViewOpen = useCallback((data) => {
    setContentViewToggle(true);
    setContentData(data);
  }, []);

  const sendManyToggleHandler = useCallback(() => {
    if (currentChecks.length !== 0) {
      setManySendToggle(true);
    } else {
      return message.error("체크 박스를 선택해주세요.");
    }
  }, [currentChecks.length]);

  const sendAllToggleHandler = useCallback(() => {
    setAllSendToggle(true);
  }, []);

  const lectureToggleHandler = useCallback(() => {
    setLectureToggle(true);
  }, []);

  const deletePopToggle = useCallback(
    (id) => () => {
      setDeleteId(id);
      setDeletePopVisible((prev) => !prev);
    },
    [deletePopVisible, deleteId]
  );

  const onFill = useCallback((data) => {
    if (data) {
      form.setFieldsValue({
        receivePerson: data.author,
      });
    }
  }, []);

  const onSubmit = useCallback(
    (value) => {
      dispatch({
        type: MESSAGE_CREATE_REQUEST,
        data: {
          title: value.title1,
          author: me && me.username,
          senderId: me && me.id,
          receiverId: updateData.senderId,
          content: value.content1,
          level: updateData.userLevel,
        },
      });
    },
    [updateData, me]
  );

  const onAllSubmit = useCallback(
    (value) => {
      dispatch({
        type: MESSAGE_ALL_CREATE_REQUEST,
        data: {
          type: parseInt(value.type),
          title: value.title,
          author: me.username,
          content: value.content,
        },
      });
    },
    [me, selectValue]
  );

  const onLectureSubmit = useCallback(
    (value) => {
      dispatch({
        type: MESSAGE_LECTURE_CREATE_REQUEST,
        data: {
          title: value.title,
          content: value.content,
          author: me.username,
          LectureId: value.lectureId,
        },
      });
    },
    [me]
  );

  const onManySubmit = useCallback(
    (value) => {
      let level = currentCheckDatum.map((data) => data.userLevel);
      let receiverId = currentCheckDatum.map((data) => data.senderId);

      dispatch({
        type: MESSAGE_MANY_CREATE_REQUEST,
        data: {
          title: value.title,
          author: me.username,
          content: value.content,
          receiverId: receiverId,
          level: level,
        },
      });
    },
    [me, currentCheckDatum]
  );

  const onReset = useCallback(() => {
    form.resetFields();
    Allform.resetFields();
    groupform.resetFields();
    lectureform.resetFields();
    lectureEndform.resetFields();

    setLectureEndCheckDatum([]);
    setLectureEndChecks([]);
    setLectureEndModal(false);
    setAnswerModal(false);
    setAllSendToggle(false);
    setLectureToggle(false);
    setManySendToggle(false);
    setContentViewToggle(false);
    setContentData(null);
  }, []);

  function handleChange(value) {
    setSelectValue(value);
  }

  const deleteNoticeHandler = useCallback(() => {
    if (!deleteId) {
      return LoadNotification(
        "ADMIN SYSTEM ERROR",
        "일시적인 장애가 발생되었습니다. 잠시 후 다시 시도해주세요."
      );
    }
    dispatch({
      type: NOTICE_DELETE_REQUEST,
      data: { noticeId: deleteId },
    });

    setDeleteId(null);
    setDeletePopVisible((prev) => !prev);
  }, [deleteId]);

  const searchHandler = useCallback(() => {
    dispatch({
      type: MESSAGE_ADMIN_LIST_REQUEST,
      data: {
        listType: listType,
        search: inputSearch.value,
      },
    });
  }, [inputSearch.value, listType]);

  const listTypeHandler = useCallback(
    (listType) => {
      dispatch({
        type: MESSAGE_ADMIN_LIST_REQUEST,
        data: {
          listType: listType,
          search: inputSearch.value,
        },
      });

      setListType(listType);
    },
    [inputSearch.value, listType]
  );

  const rowSelection = {
    selectedRowKeys: currentChecks,
    onChange: (selectedRowKeys, selectedRowDaum) => {
      setCurrentChecks(selectedRowKeys);
      setCurrentCheckDatum(selectedRowDaum);
    },
  };

  const lectureEndHandler = useCallback(() => {
    dispatch({
      type: PARTICIPANT_USER_LIMIT_LIST_REQUEST,
    });
  }, []);

  const rowLectureSelection = {
    selectedRowKeys: lectureEndChecks,
    onChange: (selectedRowKeys, selectedRowDaum) => {
      setLectureEndChecks(selectedRowKeys);
      setLectureEndCheckDatum(selectedRowDaum);
    },
  };

  const lectureEndSubmit = useCallback(
    (data) => {
      let receiverId = lectureEndCheckDatum.map((data) => data.UserId);
      let level = new Array(lectureEndCheckDatum.length).fill(1);

      dispatch({
        type: MESSAGE_MANY_CREATE_REQUEST,
        data: {
          title: data.title,
          author: me.username,
          content: data.content,
          receiverId: receiverId,
          level: level,
        },
      });
    },
    [lectureEndCheckDatum, lectureEndChecks, me]
  );

  ////// DATAVIEW //////
  const columns = [
    {
      title: "번호",
      dataIndex: "id",
    },
    {
      title: "제목",
      dataIndex: "title",
    },

    {
      title: "작성자",
      dataIndex: "author",
    },

    {
      title: "생성일",
      render: (data) => <div>{data.createdAt.substring(0, 14)}</div>,
    },
    {
      title: "상세보기",
      render: (data) => (
        <Button
          type="primary"
          size="small"
          onClick={() => contentViewOpen(data)}
        >
          확인
        </Button>
      ),
    },
    {
      title: "답변하기",
      render: (data) => (
        <Button
          type="primary"
          size="small"
          onClick={() => updateModalOpen(data)}
        >
          답변하기
        </Button>
      ),
    },
  ];

  const columnsLectureEnd = [
    {
      title: "학생이름",
      dataIndex: "studentName",
    },

    {
      title: "이메일",
      dataIndex: "email",
    },

    {
      title: "핸드폰번호",
      dataIndex: "mobile",
    },

    {
      title: "강의이름",
      dataIndex: "course",
    },

    {
      title: "강의 번호",
      dataIndex: "number",
    },

    {
      title: "남은 일수",
      render: (data) => (
        <div>
          {data.limitDate < 0
            ? `D+${Math.abs(data.limitDate)}`
            : data.limitDate === 0
            ? `D-day`
            : `D-${data.limitDate}`}
        </div>
      ),
    },

    {
      title: "결제 만료일",
      render: (data) => <div>{`${data.compareDate}`}</div>,
    },
  ];

  return (
    <AdminLayout>
      <PageHeader
        breadcrumbs={["게시판 관리", "쪽지 관리"]}
        title={`쪽지 목록`}
        subTitle={`사용자에게 제공하는 쪽지를 관리할 수 있습니다.`}
      />

      {/* <AdminTop createButton={true} createButtonAction={Open} /> */}

      <AdminContent>
        <Wrapper margin={`0 0 10px 0`} ju={`flex-start`} dr={`row`}>
          <Button
            style={{ margin: "0 5px 0 0" }}
            size="small"
            onClick={() => sendAllToggleHandler()}
          >
            전체 보내기
          </Button>

          <Button
            style={{ margin: "0 5px 0 0" }}
            size="small"
            onClick={() => sendManyToggleHandler()}
          >
            단체로 보내기
          </Button>

          {/* <Button size="small" onClick={() => lectureToggleHandler()}>
            강의 단위 보내기
          </Button> */}
        </Wrapper>
        <Wrapper dr={`row`} ju={`space-between`} margin={`0 0 10px 0`}>
          <Wrapper dr={`row`} width={`auto`}>
            <Input
              style={{ width: "300px" }}
              placeholder="작성자"
              {...inputSearch}
            />

            <Button onClick={() => searchHandler()}>
              <SearchOutlined />
              검색
            </Button>
          </Wrapper>

          <Wrapper dr={`row`} width={`auto`}>
            <Button
              style={{ margin: "0 5px" }}
              onClick={() => lectureEndHandler()}
              size="small"
            >
              수업 종료 7일이하
            </Button>

            <Button
              type={listType === 3 && "primary"}
              onClick={() => listTypeHandler(3)}
              size="small"
            >
              모든 쪽지
            </Button>
            <Button
              type={listType === 1 && "primary"}
              style={{ margin: "0 5px" }}
              onClick={() => listTypeHandler(1)}
              size="small"
            >
              학생에게 보낸 쪽지
            </Button>
            <Button
              type={listType === 2 && "primary"}
              onClick={() => listTypeHandler(2)}
              size="small"
            >
              강사에게 보낸 쪽지
            </Button>
          </Wrapper>
        </Wrapper>

        <Table
          rowKey="id"
          rowSelection={rowSelection}
          columns={columns}
          dataSource={messageAdminList ? messageAdminList : []}
          size="small"
        />
      </AdminContent>

      {/* MODAL */}

      <CustomModal
        visible={answerModal}
        width={`1100px`}
        title={`답변하기`}
        onCancel={() => onReset()}
        footer={null}
      >
        <Wrapper padding={`10px`}>
          <CustomForm ref={formRef} form={form} onFinish={onSubmit}>
            <Text
              fontSize={width < 700 ? `14px` : `18px`}
              fontWeight={`bold`}
              margin={`0 0 10px`}
            >
              받는 사람
            </Text>
            <Form.Item name="receivePerson" rules={[{ required: true }]}>
              <Select
                value={selectValue}
                style={{ width: `100%` }}
                onChange={handleChange}
              >
                {/* <Option value="jack">Jack</Option> */}
              </Select>
            </Form.Item>
            <Text
              fontSize={width < 700 ? `14px` : `18px`}
              fontWeight={`bold`}
              margin={`0 0 10px`}
            >
              제목
            </Text>
            <Form.Item
              name="title1"
              rules={[{ required: true, message: "제목을 입력해주세요." }]}
            >
              <CusotmInput width={`100%`} />
            </Form.Item>
            <Text
              fontSize={width < 700 ? `14px` : `18px`}
              fontWeight={`bold`}
              margin={`0 0 10px`}
            >
              내용
            </Text>
            <Form.Item
              name="content1"
              rules={[{ required: true, message: "내용을 입력해주세요." }]}
            >
              <Input.TextArea style={{ height: `360px` }} />
            </Form.Item>
            <Wrapper dr={`row`}>
              <CommonButton
                margin={`0 5px 0 0`}
                kindOf={`grey`}
                color={Theme.darkGrey_C}
                radius={`5px`}
                onClick={() => onReset()}
              >
                돌아가기
                {/* cancelNoteSendHanlder() */}
              </CommonButton>
              <CommonButton
                margin={`0 0 0 5px`}
                radius={`5px`}
                htmlType="submit"
              >
                답변 하기
              </CommonButton>
            </Wrapper>
          </CustomForm>
        </Wrapper>
      </CustomModal>

      <CustomModal
        visible={allSendToggle}
        width={`1100px`}
        title={`전체 보내기`}
        onCancel={() => onReset()}
        footer={null}
      >
        <Wrapper padding={`10px`}>
          <CustomForm form={Allform} onFinish={onAllSubmit}>
            <Text
              fontSize={width < 700 ? `14px` : `18px`}
              fontWeight={`bold`}
              margin={`0 0 10px`}
            >
              받는 사람
            </Text>
            <Form.Item
              name="type"
              rules={[{ required: true, message: "받는 사람을 선택해주세요." }]}
            >
              <Select
                value={selectValue}
                style={{ width: `100%` }}
                onChange={handleChange}
              >
                <Option value="1">학생</Option>
                <Option value="2">강사</Option>
                <Option value="3">전체</Option>
              </Select>
            </Form.Item>
            <Text
              fontSize={width < 700 ? `14px` : `18px`}
              fontWeight={`bold`}
              margin={`0 0 10px`}
            >
              제목
            </Text>
            <Form.Item
              name="title"
              rules={[{ required: true, message: "제목을 입력해주세요." }]}
            >
              <CusotmInput width={`100%`} />
            </Form.Item>
            <Text
              fontSize={width < 700 ? `14px` : `18px`}
              fontWeight={`bold`}
              margin={`0 0 10px`}
            >
              내용
            </Text>
            <Form.Item
              name="content"
              rules={[{ required: true, message: "내용을 입력해주세요." }]}
            >
              <Input.TextArea style={{ height: `360px` }} />
            </Form.Item>
            <Wrapper dr={`row`}>
              <CommonButton
                margin={`0 5px 0 0`}
                kindOf={`grey`}
                color={Theme.darkGrey_C}
                radius={`5px`}
                onClick={() => onReset()}
              >
                돌아가기
                {/* cancelNoteSendHanlder() */}
              </CommonButton>
              <CommonButton
                margin={`0 0 0 5px`}
                radius={`5px`}
                htmlType="submit"
              >
                답변 하기
              </CommonButton>
            </Wrapper>
          </CustomForm>
        </Wrapper>
      </CustomModal>

      <CustomModal
        visible={manySendToggle}
        width={`1100px`}
        title={`단체로 보내기`}
        onCancel={() => onReset()}
        footer={null}
      >
        <Wrapper padding={`10px`}>
          <CustomForm form={groupform} onFinish={onManySubmit}>
            <Text
              fontSize={width < 700 ? `14px` : `18px`}
              fontWeight={`bold`}
              margin={`0 0 10px`}
            >
              받는 사람
            </Text>
            <Wrapper al={`flex-start`} margin={`15px 0`}>
              {currentCheckDatum && currentCheckDatum.length === 0 ? (
                <Wrapper></Wrapper>
              ) : (
                <Wrapper dr={`row`} width={`auto`} ju={`flex-start`}>
                  {currentCheckDatum &&
                    currentCheckDatum.map((data, idx) => {
                      return (
                        <Text margin={`0 5px 0`} color={Theme.basicTheme_C}>
                          {data.author}
                        </Text>
                      );
                    })}
                </Wrapper>
              )}
            </Wrapper>
            <Text
              fontSize={width < 700 ? `14px` : `18px`}
              fontWeight={`bold`}
              margin={`0 0 10px`}
            >
              제목
            </Text>
            <Form.Item
              name="title"
              rules={[{ required: true, message: "제목을 입력해주세요." }]}
            >
              <CusotmInput width={`100%`} />
            </Form.Item>
            <Text
              fontSize={width < 700 ? `14px` : `18px`}
              fontWeight={`bold`}
              margin={`0 0 10px`}
            >
              내용
            </Text>
            <Form.Item
              name="content"
              rules={[{ required: true, message: "내용을 입력해주세요." }]}
            >
              <Input.TextArea style={{ height: `360px` }} />
            </Form.Item>
            <Wrapper dr={`row`}>
              <CommonButton
                margin={`0 5px 0 0`}
                kindOf={`grey`}
                color={Theme.darkGrey_C}
                radius={`5px`}
                onClick={() => onReset()}
              >
                돌아가기
                {/* cancelNoteSendHanlder() */}
              </CommonButton>
              <CommonButton
                margin={`0 0 0 5px`}
                radius={`5px`}
                htmlType="submit"
              >
                답변 하기
              </CommonButton>
            </Wrapper>
          </CustomForm>
        </Wrapper>
      </CustomModal>

      <CustomModal
        visible={lectureToggle}
        width={`1100px`}
        title={`강의 단위 보내기`}
        onCancel={() => onReset()}
        footer={null}
      >
        <Wrapper padding={`10px`}>
          <CustomForm
            ref={formRef}
            form={lectureform}
            onFinish={onLectureSubmit}
          >
            <Text
              fontSize={width < 700 ? `14px` : `18px`}
              fontWeight={`bold`}
              margin={`0 0 10px`}
            >
              받는 사람
            </Text>
            <Form.Item
              name="lectureId"
              rules={[{ required: true, message: "강의를 선택해주세요." }]}
            >
              <Select
                value={selectValue}
                style={{ width: `100%` }}
                onChange={handleChange}
              >
                {allLectures && allLectures.length === 0 ? (
                  <Option value={"0"}>진행 중인 강의가 없습니다.</Option>
                ) : (
                  allLectures &&
                  allLectures.map((data, idx) => {
                    return (
                      <Option key={`${data.id}${idx}`} value={data.id}>
                        {data.course}
                      </Option>
                    );
                  })
                )}
              </Select>
            </Form.Item>
            <Text
              fontSize={width < 700 ? `14px` : `18px`}
              fontWeight={`bold`}
              margin={`0 0 10px`}
            >
              제목
            </Text>
            <Form.Item
              name="title"
              rules={[{ required: true, message: "제목을 입력해주세요." }]}
            >
              <CusotmInput width={`100%`} />
            </Form.Item>
            <Text
              fontSize={width < 700 ? `14px` : `18px`}
              fontWeight={`bold`}
              margin={`0 0 10px`}
            >
              내용
            </Text>
            <Form.Item
              name="content"
              rules={[{ required: true, message: "내용을 입력해주세요." }]}
            >
              <Input.TextArea style={{ height: `360px` }} />
            </Form.Item>
            <Wrapper dr={`row`}>
              <CommonButton
                margin={`0 5px 0 0`}
                kindOf={`grey`}
                color={Theme.darkGrey_C}
                radius={`5px`}
                onClick={() => onReset()}
              >
                돌아가기
                {/* cancelNoteSendHanlder() */}
              </CommonButton>
              <CommonButton
                margin={`0 0 0 5px`}
                radius={`5px`}
                htmlType="submit"
              >
                답변 하기
              </CommonButton>
            </Wrapper>
          </CustomForm>
        </Wrapper>
      </CustomModal>

      {/* 여기부터!! */}

      <CustomModal
        visible={contentViewToggle}
        width={`1350px`}
        title={"쪽지함"}
        footer={null}
        closable={false}
      >
        <CustomForm>
          <Wrapper
            dr={`row`}
            ju={`space-between`}
            margin={`0 0 35px`}
            fontSize={width < 700 ? `14px` : `16px`}
          >
            <Text margin={`0 54px 0 0`}>
              {`작성자 :${contentData && contentData.author}`}
            </Text>
            <Text>{`날짜: ${
              contentData &&
              moment(contentData.createdAt, "YYYY/MM/DD").format("YYYY/MM/DD")
            }`}</Text>
          </Wrapper>
          <Text fontSize={`18px`} fontWeight={`bold`}>
            제목
          </Text>
          <Wrapper
            padding={`10px`}
            al={`flex-start`}
            fontSize={width < 700 ? `14px` : `16px`}
          >
            <Text>{contentData && contentData.title}</Text>
          </Wrapper>
          <Text fontSize={`18px`} fontWeight={`bold`}>
            내용
          </Text>
          <Wrapper
            padding={`10px`}
            al={`flex-start`}
            fontSize={width < 700 ? `14px` : `16px`}
          >
            <Text minHeight={`360px`}>
              {contentData &&
                contentData.content.split("\n").map((data, idx) => {
                  return (
                    <Text key={`${data}${idx}`}>
                      {data}
                      <br />
                    </Text>
                  );
                })}
            </Text>
          </Wrapper>
          <Wrapper dr={`row`}>
            <CommonButton
              margin={`0 5px 0 0`}
              kindOf={`grey`}
              color={Theme.darkGrey_C}
              radius={`5px`}
              onClick={() => onReset()}
            >
              돌아가기
            </CommonButton>
          </Wrapper>
        </CustomForm>
      </CustomModal>

      <CustomModal
        visible={lectureEndModal}
        onCancel={() => onReset()}
        footer={null}
        width={`80%`}
        minHeight={`500px`}
        title="일주일 이하 수업 목록"
      >
        <Table
          rowKey="id"
          rowSelection={rowLectureSelection}
          columns={columnsLectureEnd}
          dataSource={partUserLimitList ? partUserLimitList : []}
          size="small"
        />

        {lectureEndCheckDatum && lectureEndCheckDatum.length !== 0 && (
          <Wrapper padding={`10px`}>
            <CustomForm form={lectureEndform} onFinish={lectureEndSubmit}>
              <Text
                fontSize={width < 700 ? `14px` : `18px`}
                fontWeight={`bold`}
                margin={`0 0 10px`}
              >
                받는 사람
              </Text>
              <Wrapper al={`flex-start`} margin={`15px 0`}>
                {lectureEndCheckDatum && lectureEndCheckDatum.length === 0 ? (
                  <Wrapper>
                    <Empty description="단체로 선택하신 박스가 없습니다." />
                  </Wrapper>
                ) : (
                  <Wrapper dr={`row`} width={`auto`} ju={`flex-start`}>
                    {lectureEndCheckDatum &&
                      lectureEndCheckDatum.map((data, idx) => {
                        return (
                          <Text
                            key={data.id}
                            margin={`0 5px 0`}
                            color={Theme.basicTheme_C}
                          >
                            {data.studentName}
                          </Text>
                        );
                      })}
                  </Wrapper>
                )}
              </Wrapper>
              <Text
                fontSize={width < 700 ? `14px` : `18px`}
                fontWeight={`bold`}
                margin={`0 0 10px`}
              >
                제목
              </Text>
              <Form.Item
                name="title"
                rules={[{ required: true, message: "제목을 입력해주세요." }]}
              >
                <CusotmInput width={`100%`} />
              </Form.Item>
              <Text
                fontSize={width < 700 ? `14px` : `18px`}
                fontWeight={`bold`}
                margin={`0 0 10px`}
              >
                내용
              </Text>
              <Form.Item
                name="content"
                rules={[{ required: true, message: "내용을 입력해주세요." }]}
              >
                <Input.TextArea style={{ height: `360px` }} />
              </Form.Item>
              <Wrapper dr={`row`}>
                {/* <Button
                  type="primary"
                  onClick={() => lectureSendMessageHandler()}>
                  쪽지 보내기
                </Button> */}

                <CommonButton
                  margin={`0 5px 0 0`}
                  kindOf={`grey`}
                  color={Theme.darkGrey_C}
                  radius={`5px`}
                  onClick={() => onReset()}
                >
                  돌아가기
                </CommonButton>
                <CommonButton
                  margin={`0 0 0 5px`}
                  radius={`5px`}
                  htmlType="submit"
                >
                  쪽지 보내기
                </CommonButton>
              </Wrapper>
            </CustomForm>
          </Wrapper>
        )}
      </CustomModal>
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
      type: MESSAGE_ADMIN_LIST_REQUEST,
      data: {
        listType: "",
        search: "",
      },
    });

    context.store.dispatch({
      type: LECTURE_ALL_LIST_REQUEST,
      data: {
        TeacherId: "",
        studentName: "",
        time: "",
        startLv: "",
      },
    });

    // 구현부 종료
    context.store.dispatch(END);
    console.log("🍀 SERVER SIDE PROPS END");
    await context.store.sagaTask.toPromise();
  }
);

export default withRouter(List);
