import React, { useCallback, useEffect, useRef, useState } from "react";
import AdminLayout from "../../../../components/AdminLayout";
import PageHeader from "../../../../components/admin/PageHeader";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  Button,
  Modal,
  Select,
  notification,
  message,
  Input,
  Form,
} from "antd";

import { useRouter, withRouter } from "next/router";
import wrapper from "../../../../store/configureStore";
import { END } from "redux-saga";
import axios from "axios";
import {
  Wrapper,
  Image,
  Text,
  TextInput,
  GuideDiv,
} from "../../../../components/commonComponents";
import { LOAD_MY_INFO_REQUEST } from "../../../../reducers/user";
import {
  BOOK_CREATE_REQUEST,
  BOOK_ADMIN_DELETE_REQUEST,
  BOOK_FILE_INIT,
  BOOK_LIST_REQUEST,
  BOOK_ADMIN_UPDATE_REQUEST,
  BOOK_UPLOAD_REQUEST,
  BOOK_UPLOAD_TH_REQUEST,
} from "../../../../reducers/book";
import { saveAs } from "file-saver";
import useInput from "../../../../hooks/useInput";
import { LECTURE_ALL_LIST_REQUEST } from "../../../../reducers/lecture";
import Theme from "../../../../components/Theme";

const AdminContent = styled.div`
  padding: 20px;
`;

const LoadNotification = (msg, content) => {
  notification.open({
    message: msg,
    description: content,
    onClick: () => {},
  });
};

const FormTag = styled(Form)`
  width: auto;
  display: flex;
  flex-direction: row;
`;

const FormItem = styled(Form.Item)`
  width: auto;
  margin: 0 10px 0 0 !important;
`;

const Book = ({}) => {
  const { st_loadMyInfoDone, me } = useSelector((state) => state.user);

  const {
    bookList,
    bookMaxLength,
    uploadPath,
    uploadPathTh,
    st_bookCreateDone,
    st_bookCreateError,
    st_bookAdminUpdateDone,
    st_bookAdminUpdateError,
    st_bookAdminDeleteDone,
    st_bookAdminDeleteError,
    st_bookUploadThDone,
  } = useSelector((state) => state.book);

  const { allLectures } = useSelector((state) => state.lecture);

  const inputBookName = useInput("");
  const filename = useInput("");

  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();

  const router = useRouter();
  const fileRef = useRef();
  const fileRef2 = useRef();
  const formRef = useRef();
  const [createModal, setCreateModal] = useState(false);
  const [updateData, setUpdateData] = useState(null);

  const [bookMenuId, setBookMenuId] = useState("");

  const [deletePopVisible, setDeletePopVisible] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);

  const [imagePathTh, setImagePathTh] = useState("");

  const [currentModalStage, setCurrentModalStage] = useState(null);
  const [currentModalLevel, setCurrentModalLevel] = useState(null);
  const [currentModalKinds, setCurrentModalKinds] = useState(null);

  const [currentSearchStage, setCurrentSearchStage] = useState(null);
  const [currentSearchLevel, setCurrentSearchLevel] = useState(null);
  const [currentSearchKinds, setCurrentSearchKinds] = useState(null);

  const deletePopToggle = useCallback(
    (data) => {
      setDeletePopVisible(true);
      setDeleteId(data.id);
    },
    [deletePopVisible, deleteId]
  );

  const deleteBookHandler = useCallback(() => {
    if (!deleteId) {
      return message.error(
        "일시적인 장애가 발생되었습니다. 잠시 후 다시 시도해주세요."
      );
    }
    dispatch({
      type: BOOK_ADMIN_DELETE_REQUEST,
      data: { bookId: deleteId },
    });

    setDeleteId(null);
    setDeletePopVisible(false);
  }, [deleteId]);

  const moveLinkHandler = useCallback((link) => {
    router.push(link);
  }, []);

  const onClickBookFolder = useCallback((data) => {
    setBookMenuId(data.lectureId);
    setCurrentPage(1);
    dispatch({
      type: BOOK_LIST_REQUEST,
      data: {
        LectureId: data.lectureId,
        search: data.search,
        page: "",
        level: data.level,
        stage: data.stage,
        kinds: data.kinds,
        link: data.link,
      },
    });
  }, []);

  useEffect(() => {
    if (st_loadMyInfoDone) {
      if (!me || parseInt(me.level) < 3) {
        moveLinkHandler(`/admin`);
      }
    }
  }, [st_loadMyInfoDone]);

  useEffect(() => {
    if (st_bookUploadThDone) {
      setImagePathTh(uploadPathTh);
    }
  }, [st_bookUploadThDone]);

  useEffect(() => {
    if (st_bookCreateDone) {
      form.resetFields();
      setImagePathTh("");
      setCreateModal(false);
      filename.setValue("");
      searchForm.resetFields();
      setCurrentModalKinds(null);
      setCurrentModalLevel(null);
      setCurrentModalStage(null);
      dispatch({
        type: BOOK_LIST_REQUEST,
        data: {
          LectureId: "",
          search: "",
          page: "",
          level: "",
          stage: "",
          kinds: "",
        },
      });
      return message.success("교재를 업로드 했습니다.");
    }
  }, [st_bookCreateDone]);

  useEffect(() => {
    if (st_bookCreateError) {
      return message.error(st_bookCreateError);
    }
  }, [st_bookCreateError]);

  useEffect(() => {
    if (st_bookAdminDeleteDone) {
      dispatch({
        type: BOOK_LIST_REQUEST,
        data: {
          LectureId: bookMenuId,
          search: "",
          page: "",
          level: "",
          stage: "",
          kinds: "",
        },
      });
    }
  }, [st_bookAdminDeleteDone, bookMenuId]);

  useEffect(() => {
    if (st_bookAdminDeleteError) {
      return message.error(st_bookAdminDeleteError);
    }
  }, [st_bookAdminDeleteError]);

  useEffect(() => {
    if (st_bookAdminUpdateDone) {
      dispatch({
        type: BOOK_LIST_REQUEST,
        data: {
          LectureId: bookMenuId,
          search: "",
          page: "",
          level: "",
          stage: "",
          kinds: "",
        },
      });
      setCurrentModalKinds(null);
      setCurrentModalLevel(null);
      setCurrentModalStage(null);
      form.resetFields();
      searchForm.resetFields();
      setImagePathTh("");
      setCreateModal(false);
      filename.setValue("");
      setCreateModal(false);
      setUpdateData(null);

      return message.success("교재가 수정 되었습니다.");
    }
  }, [st_bookAdminUpdateDone]);

  useEffect(() => {
    if (st_bookAdminUpdateError) {
      return message.error(st_bookAdminUpdateError);
    }
  }, [st_bookAdminUpdateError]);

  /////////////////////////////////////////////////////////////////////////

  ////// HOOKS //////
  const dispatch = useDispatch();

  ////// USEEFFECT //////

  ////// HANDLER //////

  const onFillBookData = useCallback((data) => {
    form.setFieldsValue({
      title: data.title,
      folder: data.LectureId,
      level: data.level,
      stage: data.stage,
      kinds: data.kinds,
      link: data.link,
    });

    setImagePathTh(data.thumbnail);
  }, []);

  const fileUploadClick = useCallback(() => {
    fileRef.current.click();
  }, [fileRef.current]);

  const modalOk = useCallback(() => {
    form.submit();
  }, [form]);

  const fileUploadClick2 = useCallback(() => {
    fileRef2.current.click();
  }, [fileRef2.current]);

  const fileDownloadHandler = useCallback(async (filePath) => {
    let blob = await fetch(filePath).then((r) => r.blob());

    const file = new Blob([blob]);

    const ext = filePath.substring(
      filePath.lastIndexOf(".") + 1,
      filePath.length
    );

    const originName = `첨부파일.${ext}`;

    saveAs(file, originName);
  }, []);

  const fileChangeHandler2 = useCallback((e) => {
    const formData = new FormData();

    [].forEach.call(e.target.files, (file) => {
      formData.append("image", file);
    });

    dispatch({
      type: BOOK_UPLOAD_TH_REQUEST,
      data: formData,
    });
  }, []);

  const fileChangeHandler = useCallback((e) => {
    if (e.target.files[0].size > 104857600) {
      message.error("파일 용량 제한 (최대 100MB)");
      return;
    }

    const formData = new FormData();
    filename.setValue(e.target.files[0].name);

    [].forEach.call(e.target.files, (file) => {
      formData.append("image", file);
    });

    dispatch({
      type: BOOK_UPLOAD_REQUEST,
      data: formData,
    });
  }, []);

  const onSubmit = useCallback(
    (data) => {
      if (!data.title) {
        return message.error("교재 제목을 입력해주세요.");
      }

      if (!data.link) {
        return message.error("링크를 입력해주세요.");
      }

      if (!uploadPathTh) {
        return message.error("썸네일을 업로드해주세요.");
      }

      dispatch({
        type: BOOK_CREATE_REQUEST,
        data: {
          thumbnail: uploadPathTh,
          title: data.title,
          file: uploadPath,
          LectureId: data.folder,
          level: data.level,
          stage: data.stage,
          kinds: data.kinds,
          link: data.link,
        },
      });
    },
    [imagePathTh, uploadPath]
  );

  const updateSubmit = useCallback(
    (data) => {
      dispatch({
        type: BOOK_ADMIN_UPDATE_REQUEST,
        data: {
          id: updateData.id,
          thumbnail: uploadPathTh ? uploadPathTh : updateData.thumbnail,
          title: data.title,
          file: uploadPath ? uploadPath : updateData.file,
          LectureId: data.folder,
          level: data.level,
          stage: data.stage,
          kinds: data.kinds,
          link: data.link,
        },
      });
    },
    [uploadPath, uploadPathTh, updateData]
  );

  const updateBookModal = useCallback((data) => {
    setCreateModal(true);
    setUpdateData(data);
    onFillBookData(data);
  }, []);

  const modalClose = useCallback(() => {
    form.resetFields();
    setCreateModal(false);
    setImagePathTh("");
    setCurrentModalKinds(null);
    setCurrentModalLevel(null);
    setCurrentModalStage(null);
    filename.setValue(``);
  }, []);

  const updateModalClose = useCallback(
    (data) => {
      dispatch({
        type: BOOK_FILE_INIT,
      });

      setCreateModal(false);
      setUpdateData(null);
      setImagePathTh("");
      form.resetFields();
      filename.setValue(``);
      setCurrentModalKinds(null);
      setCurrentModalLevel(null);
      setCurrentModalStage(null);
    },
    [form]
  );

  const onChangeBookPage = useCallback(
    (page) => {
      setCurrentPage(page);

      dispatch({
        type: BOOK_LIST_REQUEST,
        data: {
          LectureId: bookMenuId,
          search: inputBookName.value,
          page,
          level: searchForm.getFieldValue(`level`),
          stage: searchForm.getFieldValue(`stage`),
          kinds: searchForm.getFieldValue(`kinds`),
        },
      });
    },
    [inputBookName.value, bookMenuId]
  );

  ////// DATAVIEW //////

  ////// DATA COLUMNS //////

  const columns = [
    {
      title: "번호",
      dataIndex: "id",
      width: 100,
    },

    {
      title: "표지",
      width: 100,
      render: (data) => (
        <Image
          width={`50px`}
          height={`50px`}
          src={data.thumbnail}
          alt="thumbnail"
        />
      ),
    },

    {
      title: "교재 이름",
      render: (data) => <Text>{data.title}</Text>,
    },

    {
      title: "링크",
      render: (data) => (
        <Text>
          <a href={data.link} target={`_blank`}>
            {data.link}
          </a>
        </Text>
      ),
    },

    // {
    //   title: "종류",
    //   render: (data) => <Text>{data.kinds}</Text>,
    // },

    // {
    //   title: "레벨",
    //   render: (data) => <Text>{`${data.level}권${data.stage}단원`}</Text>,
    // },
    {
      title: "강의 이름",
      render: (data) => <Text>{data.course}</Text>,
    },

    {
      title: "강사 이름",
      render: (data) => <Text>{data.username}</Text>,
    },

    {
      title: "수정",
      width: 100,
      render: (data) => (
        <Button
          type="primary"
          onClick={() => updateBookModal(data)}
          size={`small`}
          pri
        >
          수정
        </Button>
      ),
    },

    {
      title: "파일",
      width: 100,
      render: (data) => (
        <Button
          type="primary"
          disabled={data.file ? false : true}
          onClick={() => fileDownloadHandler(data.file)}
          size={`small`}
        >
          다운로드
        </Button>
      ),
    },

    {
      title: "삭제",
      width: 100,
      render: (data) => (
        <Button
          type="danger"
          onClick={() => deletePopToggle(data)}
          size={`small`}
          pri
        >
          삭제
        </Button>
      ),
    },
  ];

  return (
    <AdminLayout>
      <PageHeader
        breadcrumbs={["교재 관리", "교재 업로드"]}
        title={`교재 업로드`}
        subTitle={`교재를 확인하고 관리할 수 있습니다.`}
      />

      <AdminContent>
        <Wrapper al={`flex-end`} margin={`0 0 10px`}>
          <Button
            size="small"
            type={`primary`}
            onClick={() => setCreateModal(true)}
          >
            자료 올리기
          </Button>
        </Wrapper>
        <Wrapper margin={"0px 0px 20px 0px"} dr={"row"} ju={`space-between`}>
          <Wrapper
            margin={`0px 0px 10px 0px`}
            radius="5px"
            bgColor={Theme.lightGrey_C}
            padding="5px"
            fontSize="13px"
            al="flex-start"
          >
            <GuideDiv isImpo={true}>
              작성한 교재의 상세내역을 보시려면 수정버튼을 누르세요.
            </GuideDiv>
            <GuideDiv isImpo={true}>
              교재 수정시 즉시 반영되기 때문에 수정 할 시 신중하게 처리바랍니다.
            </GuideDiv>
          </Wrapper>
          <FormTag form={searchForm} onFinish={onClickBookFolder}>
            <FormItem name={`search`} label={`검색`}>
              <Wrapper dr={`row`} ju={`flex-start`}>
                <Input size={`small`} />
              </Wrapper>
            </FormItem>
            <FormItem name={`lectureId`} label={`강의`}>
              <Select
                size={`small`}
                style={{ width: `200px` }}
                defaultValue={null}
              >
                <Select.Option value={null} type="primary" size="small">
                  전체
                </Select.Option>
                {allLectures &&
                  allLectures.map((data, idx) => {
                    return (
                      <Select.Option
                        value={data.id}
                        key={data.id}
                        type="primary"
                        size="small"
                      >
                        {`(${data.number}) ${data.course}`}
                      </Select.Option>
                    );
                  })}
              </Select>
            </FormItem>
            <FormItem
              onBlur={() =>
                searchForm.getFieldValue(`level`) === "" &&
                setCurrentSearchLevel(null)
              }
              name={`level`}
              label={`권`}
            >
              {currentSearchLevel === "기타" ? (
                <Input size={`small`} />
              ) : (
                <Select
                  size={`small`}
                  style={{ width: `200px` }}
                  defaultValue={null}
                  onSelect={(e) => setCurrentSearchLevel(e)}
                >
                  <Select.Option value={null} type="primary" size="small">
                    전체
                  </Select.Option>
                  <Select.Option value={`기타`}>기타</Select.Option>
                  <Select.Option value={`1`}>1</Select.Option>
                  <Select.Option value={`2`}>2</Select.Option>
                  <Select.Option value={`3`}>3</Select.Option>
                  <Select.Option value={`4`}>4</Select.Option>
                  <Select.Option value={`5`}>5</Select.Option>
                  <Select.Option value={`6`}>6</Select.Option>
                </Select>
              )}
            </FormItem>
            <FormItem
              onBlur={() =>
                searchForm.getFieldValue(`stage`) === "" &&
                setCurrentSearchStage(null)
              }
              name={`stage`}
              label={`단원`}
            >
              {currentSearchStage === "기타" ? (
                <Input size={`small`} />
              ) : (
                <Select
                  size={`small`}
                  style={{ width: `200px` }}
                  defaultValue={null}
                  onSelect={(e) => setCurrentSearchStage(e)}
                >
                  <Select.Option value={null} type="primary" size="small">
                    전체
                  </Select.Option>
                  <Select.Option value={`기타`}>기타</Select.Option>
                  <Select.Option value={`1`}>1</Select.Option>
                  <Select.Option value={`2`}>2</Select.Option>
                  <Select.Option value={`3`}>3</Select.Option>
                  <Select.Option value={`4`}>4</Select.Option>
                  <Select.Option value={`5`}>5</Select.Option>
                  <Select.Option value={`6`}>6</Select.Option>
                  <Select.Option value={`7`}>7</Select.Option>
                  <Select.Option value={`8`}>8</Select.Option>
                  <Select.Option value={`9`}>9</Select.Option>
                  <Select.Option value={`10`}>10</Select.Option>
                  <Select.Option value={`11`}>11</Select.Option>
                  <Select.Option value={`12`}>12</Select.Option>
                </Select>
              )}
            </FormItem>

            <FormItem
              onBlur={() =>
                searchForm.getFieldValue(`kinds`) === "" &&
                setCurrentSearchKinds(null)
              }
              name={`kinds`}
              label={`교재 종류`}
            >
              {currentSearchKinds === "기타" ? (
                <Input size={`small`} />
              ) : (
                <Select
                  size={`small`}
                  style={{ width: `200px` }}
                  defaultValue={null}
                  onSelect={(e) => setCurrentSearchKinds(e)}
                >
                  <Select.Option value={null} type="primary" size="small">
                    전체
                  </Select.Option>
                  {[`기타`, `교과서`, `워크북`, `듣기파일`, `토픽`].map(
                    (data, idx) => {
                      return (
                        <Select.Option value={data} key={idx}>
                          {data}
                        </Select.Option>
                      );
                    }
                  )}
                </Select>
              )}
            </FormItem>
            <Wrapper width={`auto`}>
              <Button type={`primary`} htmlType={`submit`} size={`small`}>
                검색
              </Button>
            </Wrapper>
          </FormTag>
        </Wrapper>

        <Table
          rowKey="id"
          columns={columns}
          dataSource={bookList ? bookList : []}
          size="small"
          render={12}
          pagination={{
            current: parseInt(currentPage),
            total: bookMaxLength * 12,
            onChange: (page) => onChangeBookPage(page),
            pageSize: 12,
          }}
        />
      </AdminContent>

      <Modal
        visible={deletePopVisible}
        onOk={deleteBookHandler}
        onCancel={() => setDeletePopVisible(false)}
        title="정말 삭제하시겠습니까?"
      >
        <Wrapper>삭제 된 데이터는 다시 복구할 수 없습니다.</Wrapper>
        <Wrapper>정말 삭제하시겠습니까?</Wrapper>
      </Modal>

      <Modal
        visible={createModal}
        onCancel={updateData ? updateModalClose : () => modalClose()}
        onOk={modalOk}
        title="교재 등록"
        okText="등록"
        cancelText="취소"
      >
        <Wrapper al={`flex-start`}>
          <Form
            form={form}
            ref={formRef}
            onFinish={updateData ? updateSubmit : onSubmit}
            style={{ width: `100%` }}
          >
            <Form.Item
              rules={[{ required: true, message: "교재 제목을 입력해주세요." }]}
              label={`교재 제목`}
              name={`title`}
              labelCol={{ span: 5 }}
              labelAlign={`left`}
            >
              <Input placeholder="교재 제목을 입력해주세요." />
            </Form.Item>
            <Form.Item
              rules={[{ required: true, message: "강의를 선택해주세요." }]}
              label={`강의 선택`}
              name={`folder`}
              labelCol={{ span: 5 }}
              labelAlign={`left`}
            >
              <Select
                placeholder="Select a Lecture"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                {allLectures &&
                  allLectures.map((data) => {
                    return (
                      <Select.Option key={data.id} value={data.id}>
                        {`(${data.number}) ${data.course}`}
                      </Select.Option>
                    );
                  })}
              </Select>
            </Form.Item>

            <Form.Item
              // rules={[{ required: true, message: "권을 선택해주세요." }]}
              label={`권`}
              name={`level`}
              onBlur={() =>
                form.getFieldValue(`level`) === "" && setCurrentModalLevel(null)
              }
              labelCol={{ span: 5 }}
              labelAlign={`left`}
            >
              {currentModalLevel === "기타" ? (
                <Input />
              ) : (
                <Select onSelect={(e) => setCurrentModalLevel(e)}>
                  {["기타", 1, 2, 3, 4, 5, 6].map((data, idx) => {
                    return (
                      <Select.Option value={data} key={idx}>
                        {data}
                      </Select.Option>
                    );
                  })}
                </Select>
              )}
            </Form.Item>
            <Form.Item
              // rules={[{ required: true, message: "단원을 선택해주세요." }]}
              label={`단원`}
              name={`stage`}
              onBlur={() =>
                form.getFieldValue(`stage`) === "" && setCurrentModalStage(null)
              }
              labelCol={{ span: 5 }}
              labelAlign={`left`}
            >
              {currentModalStage === "기타" ? (
                <Input />
              ) : (
                <Select onSelect={(e) => setCurrentModalStage(e)}>
                  {["기타", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(
                    (data, idx) => {
                      return (
                        <Select.Option value={data} key={idx}>
                          {data}
                        </Select.Option>
                      );
                    }
                  )}
                </Select>
              )}
            </Form.Item>

            <Form.Item
              // rules={[{ required: true, message: "유형을 선택해주세요." }]}
              label={`유형`}
              name={`kinds`}
              onBlur={() =>
                form.getFieldValue(`stage`) === "" && setCurrentModalStage(null)
              }
              labelCol={{ span: 5 }}
              labelAlign={`left`}
            >
              {currentModalKinds === "기타" ? (
                <Input />
              ) : (
                <Select onSelect={(e) => setCurrentModalKinds(e)}>
                  {[`기타`, `교과서`, `워크북`, `듣기파일`, `토픽`].map(
                    (data, idx) => {
                      return (
                        <Select.Option value={data} key={idx}>
                          {data}
                        </Select.Option>
                      );
                    }
                  )}
                </Select>
              )}
            </Form.Item>

            <Form.Item
              labelCol={{ span: 5 }}
              labelAlign={`left`}
              rules={[{ required: true, message: "링크를 입력해주세요." }]}
              label={`링크`}
              name={`link`}
            >
              <TextInput
                width={`100%`}
                placeholder="링크를 입력해주세요."
                height={`30px`}
              />
            </Form.Item>
          </Form>
        </Wrapper>
        <Wrapper dr={`row`} ju={`space-between`} al={`flex-end`}>
          <Wrapper width={`40%`} margin={`20px 0 0`}>
            <input
              type="file"
              name="file"
              accept=".png, .jpg"
              hidden
              ref={fileRef2}
              onChange={fileChangeHandler2}
            />
            <Wrapper width={`150px`} margin={`0 0 10px`}>
              <Image
                src={
                  imagePathTh
                    ? `${imagePathTh}`
                    : updateData
                    ? updateData.thumbnail
                    : `https://via.placeholder.com/${`80`}x${`100`}`
                }
                alt={`thumbnail`}
              />
            </Wrapper>
            <Button type="primary" onClick={fileUploadClick2} size="small">
              썸네일 이미지 업로드
            </Button>
          </Wrapper>

          <Wrapper margin={`20px 0 0`} dr={`row`} ju={`flex-start`}>
            <input
              type="file"
              name="file"
              hidden
              ref={fileRef}
              onChange={fileChangeHandler}
            />

            <Button type="primary" onClick={fileUploadClick} size="small">
              교재 파일 업로드
            </Button>

            <Text margin={`0 0 0 5px`}>
              {filename.value ? filename.value : `파일을 선택해주세요.`}
            </Text>
          </Wrapper>
        </Wrapper>
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
      type: BOOK_LIST_REQUEST,
      data: {
        LectureId: null,
        search: "",
        page: "",
      },
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

export default withRouter(Book);
