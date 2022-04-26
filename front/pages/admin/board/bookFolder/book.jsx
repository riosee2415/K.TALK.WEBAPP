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
  SearchForm,
  SearchFormItem,
  ModalBtn,
  GuideUl,
  GuideLi,
  Image,
  Text,
  TextInput,
} from "../../../../components/commonComponents";
import {
  LOAD_MY_INFO_REQUEST,
  USERLIST_REQUEST,
} from "../../../../reducers/user";
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
import { SearchOutlined, SolutionOutlined } from "@ant-design/icons";
import useInput from "../../../../hooks/useInput";
import { LECTURE_ALL_LIST_REQUEST } from "../../../../reducers/lecture";

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

const UserDeliAddress = ({}) => {
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
    setBookMenuId(data.id);
    setCurrentPage(1);
    dispatch({
      type: BOOK_LIST_REQUEST,
      data: {
        LectureId: data.id,
        search: "",
        page: "",
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
      dispatch({
        type: BOOK_LIST_REQUEST,
        data: {
          LectureId: bookMenuId,
          search: "",
          page: "",
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

  const onSearchBookNameHandler = useCallback(() => {
    dispatch({
      type: BOOK_LIST_REQUEST,
      data: {
        LectureId: bookMenuId,
        search: inputBookName.value,
      },
    });
  }, [inputBookName.value, bookMenuId]);

  const onSubmit = useCallback(
    (data) => {
      if (!imagePathTh || imagePathTh.trim() === "") {
        return message.error("이미지를 업로드 해주세요.");
      }

      if (!filename.value || filename.value.trim() === "") {
        return message.error("파일을 업로드 해주세요.");
      }

      dispatch({
        type: BOOK_CREATE_REQUEST,
        data: {
          thumbnail: uploadPathTh,
          title: data.title,
          file: uploadPath,
          LectureId: data.folder,
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
      title: "강의 이름",
      render: (data) => <Text>{data.course}</Text>,
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
          onClick={() => fileDownloadHandler(data.file)}
          size={`small`}
          pri
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
        {/* <SearchForm layout="inline">
          <SearchFormItem label="사용자명" name="selectUserId">
            <Select size="small" style={{ width: "200px" }}>
              <Select.Option value="1">dasdasdasdd</Select.Option>
            </Select>
          </SearchFormItem>

          <SearchFormItem>
            <Button size="small" type="primary" htmlType="submit">
              검색
            </Button>
          </SearchFormItem>
        </SearchForm> */}

        <Wrapper margin={"0px 0px 20px 0px"} dr={"row"}>
          <Wrapper dr={`row`} margin={`0 0 10px`} ju={`space-between`}>
            <Wrapper dr={`row`} ju={`flex-start`} width={`50%`}>
              <Input
                size="small"
                style={{ width: "50%" }}
                placeholder="교재 검색"
                {...inputBookName}
                onKeyDown={(e) =>
                  e.key === "Enter" && onSearchBookNameHandler()
                }
              />
              <Button size="small" onClick={() => onSearchBookNameHandler()}>
                <SearchOutlined />
                검색
              </Button>
            </Wrapper>

            <Button size="small" onClick={() => setCreateModal(true)}>
              자료 올리기
            </Button>
          </Wrapper>

          <Wrapper dr={`row`} ju={`flex-start`}>
            <Select
              style={{ width: `200px` }}
              onChange={(e) => onClickBookFolder(e)}
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
                      onClick={() => onClickBookFolder(data)}
                    >
                      {data.course}
                    </Select.Option>
                  );
                })}
            </Select>
          </Wrapper>
        </Wrapper>

        <Table
          rowKey="id"
          columns={columns}
          dataSource={bookList ? bookList : []}
          size="small"
          render={12}
          pagination={{
            current: parseInt(currentPage),
            total: bookMaxLength * 10,
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
      >
        <Wrapper al={`flex-start`}>
          <Form
            form={form}
            ref={formRef}
            onFinish={updateData ? updateSubmit : onSubmit}
          >
            <Form.Item
              rules={[{ required: true, message: "교재 제목을 입력해주세요." }]}
              label={`교재 제목`}
              name={`title`}
            >
              <TextInput height={`30px`} />
            </Form.Item>
            <Form.Item
              rules={[{ required: true, message: "강의를 선택해주세요." }]}
              label={`강의 선택`}
              name={`folder`}
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
                        {data.course}
                      </Select.Option>
                    );
                  })}
              </Select>
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
            <Button type="primary" onClick={fileUploadClick2}>
              썸네일 이미지 업로드
            </Button>
          </Wrapper>

          <Wrapper width={`60%`} margin={`20px 0 0`} dr={`row`} ju={`flex-end`}>
            <input
              type="file"
              name="file"
              hidden
              ref={fileRef}
              onChange={fileChangeHandler}
            />
            <Text margin={`0 5px 0 0`} width={`calc(100% - 130px - 5px)`}>
              {filename.value ? filename.value : `파일을 선택해주세요.`}
            </Text>
            <Button type="primary" onClick={fileUploadClick}>
              교재 파일 업로드
            </Button>
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

export default withRouter(UserDeliAddress);
