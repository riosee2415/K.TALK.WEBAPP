import { all, call, delay, fork, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import {
  ///////////////////////////////// 일반게시판 가져오기
  NORMAL_NOTICE_LIST_REQUEST,
  NORMAL_NOTICE_LIST_SUCCESS,
  NORMAL_NOTICE_LIST_FAILURE,
  ///////////////////////////////// 일반게시판 상세 가져오기
  NORMAL_NOTICE_DETAIL_REQUEST,
  NORMAL_NOTICE_DETAIL_SUCCESS,
  NORMAL_NOTICE_DETAIL_FAILURE,
  ///////////////////////////////// 관리자 일반게시판 가져오기
  NORMAL_NOTICE_ADMIN_LIST_REQUEST,
  NORMAL_NOTICE_ADMIN_LIST_SUCCESS,
  NORMAL_NOTICE_ADMIN_LIST_FAILURE,
  ///////////////////////////////// 관리자 일반게시판 생성하기
  NORMAL_NOTICE_ADMIN_CREATE_REQUEST,
  NORMAL_NOTICE_ADMIN_CREATE_SUCCESS,
  NORMAL_NOTICE_ADMIN_CREATE_FAILURE,
  ///////////////////////////////// 학생 일반게시판 생성하기
  NORMAL_NOTICE_STU_CREATE_REQUEST,
  NORMAL_NOTICE_STU_CREATE_SUCCESS,
  NORMAL_NOTICE_STU_CREATE_FAILURE,
  ///////////////////////////////// 선생 일반게시판 생성하기
  NORMAL_NOTICE_TEACHER_CREATE_REQUEST,
  NORMAL_NOTICE_TEACHER_CREATE_SUCCESS,
  NORMAL_NOTICE_TEACHER_CREATE_FAILURE,
  ///////////////////////////////// 일반게시판 수정하기
  NORMAL_NOTICE_UPDATE_REQUEST,
  NORMAL_NOTICE_UPDATE_SUCCESS,
  NORMAL_NOTICE_UPDATE_FAILURE,
  ///////////////////////////////// 일반게시판 삭제하기
  NORMAL_NOTICE_DELETE_REQUEST,
  NORMAL_NOTICE_DELETE_SUCCESS,
  NORMAL_NOTICE_DELETE_FAILURE,
  ///////////////////////////////// 대댓글 삭제하기
  NORMAL_COMMENT_LIST_REQUEST,
  NORMAL_COMMENT_LIST_SUCCESS,
  NORMAL_COMMENT_LIST_FAILURE,
  ///////////////////////////////// 대댓글 삭제하기
  NORMAL_COMMENT_CREATE_REQUEST,
  NORMAL_COMMENT_CREATE_SUCCESS,
  NORMAL_COMMENT_CREATE_FAILURE,
  ///////////////////////////////// 대댓글 삭제하기
  NORMAL_COMMENT_UPDATE_REQUEST,
  NORMAL_COMMENT_UPDATE_SUCCESS,
  NORMAL_COMMENT_UPDATE_FAILURE,
  ///////////////////////////////// 대댓글 삭제하기
  NORMAL_COMMENT_DELETE_REQUEST,
  NORMAL_COMMENT_DELETE_SUCCESS,
  NORMAL_COMMENT_DELETE_FAILURE,
  ///////////////////////////////// 파일 업로드
  NORMAL_FILE_UPLOAD_REQUEST,
  NORMAL_FILE_UPLOAD_SUCCESS,
  NORMAL_FILE_UPLOAD_FAILURE,
} from "../reducers/normalNotice";

// ******************************************************************************************************************
// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************

async function normalNoticeListAPI(data) {
  return await axios.post(`/api/normalNotice/list`, data);
}

function* normalNoticeList(action) {
  try {
    const result = yield call(normalNoticeListAPI, action.data);

    yield put({
      type: NORMAL_NOTICE_LIST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: NORMAL_NOTICE_LIST_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// ******************************************************************************************************************
// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************

async function normalNoticeDetailAPI(data) {
  return await axios.post(`/api/normalNotice/detail`, data);
}

function* normalNoticeDetail(action) {
  try {
    const result = yield call(normalNoticeDetailAPI, action.data);

    yield put({
      type: NORMAL_NOTICE_DETAIL_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: NORMAL_NOTICE_DETAIL_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// ******************************************************************************************************************
// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************

async function normalNoticeAdminListAPI(data) {
  return await axios.post(`/api/normalNotice/admin/list`, data);
}

function* normalNoticeAdminList(action) {
  try {
    const result = yield call(normalNoticeAdminListAPI, action.data);

    yield put({
      type: NORMAL_NOTICE_ADMIN_LIST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: NORMAL_NOTICE_ADMIN_LIST_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// ******************************************************************************************************************
// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************

async function normalNoticeAdminCreateAPI(data) {
  return await axios.post(`/api/normalNotice/admin/create`, data);
}

function* normalNoticeAdminCreate(action) {
  try {
    const result = yield call(normalNoticeAdminCreateAPI, action.data);

    yield put({
      type: NORMAL_NOTICE_ADMIN_CREATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: NORMAL_NOTICE_ADMIN_CREATE_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// ******************************************************************************************************************
// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************

async function normalNoticeStuCreateAPI(data) {
  return await axios.post(`/api/normalNotice/student/create`, data);
}

function* normalNoticeStuCreate(action) {
  try {
    const result = yield call(normalNoticeStuCreateAPI, action.data);

    yield put({
      type: NORMAL_NOTICE_STU_CREATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: NORMAL_NOTICE_STU_CREATE_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// ******************************************************************************************************************
// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************

async function normalNoticeTeacherCreateAPI(data) {
  return await axios.post(`/api/normalNotice/teacher/create`, data);
}

function* normalNoticeTeacherCreate(action) {
  try {
    const result = yield call(normalNoticeTeacherCreateAPI, action.data);

    yield put({
      type: NORMAL_NOTICE_TEACHER_CREATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: NORMAL_NOTICE_TEACHER_CREATE_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// ******************************************************************************************************************
// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************

async function normalNoticeUpdateAPI(data) {
  return await axios.patch(`/api/normalNotice/update`, data);
}

function* normalNoticeUpdate(action) {
  try {
    const result = yield call(normalNoticeUpdateAPI, action.data);

    yield put({
      type: NORMAL_NOTICE_UPDATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: NORMAL_NOTICE_UPDATE_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// ******************************************************************************************************************
// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************

async function normalNoticeDeleteAPI(data) {
  return await axios.patch(`/api/normalNotice/delete`, data);
}

function* normalNoticeDelete(action) {
  try {
    const result = yield call(normalNoticeDeleteAPI, action.data);

    yield put({
      type: NORMAL_NOTICE_DELETE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: NORMAL_NOTICE_DELETE_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// ******************************************************************************************************************
// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************

async function normalCommentListAPI(data) {
  return await axios.post(`/api/normalNotice/comment/detail`, data);
}

function* normalCommentList(action) {
  try {
    const result = yield call(normalCommentListAPI, action.data);

    yield put({
      type: NORMAL_COMMENT_LIST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: NORMAL_COMMENT_LIST_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// ******************************************************************************************************************
// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************

async function normalCommentCreateAPI(data) {
  return await axios.post(`/api/normalNotice/comment/create`, data);
}

function* normalCommentCreate(action) {
  try {
    const result = yield call(normalCommentCreateAPI, action.data);

    yield put({
      type: NORMAL_COMMENT_CREATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: NORMAL_COMMENT_CREATE_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// ******************************************************************************************************************
// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************

async function normalCommentUpdateAPI(data) {
  return await axios.post(`/api/normalNotice/comment/update`, data);
}

function* normalCommentUpdate(action) {
  try {
    const result = yield call(normalCommentUpdateAPI, action.data);

    yield put({
      type: NORMAL_COMMENT_UPDATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: NORMAL_COMMENT_UPDATE_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// ******************************************************************************************************************
// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************

async function normalCommentDeleteAPI(data) {
  return await axios.delete(
    `/api/normalNotice/comment/delete/${data.commentId}`
  );
}

function* normalCommentDelete(action) {
  try {
    const result = yield call(normalCommentDeleteAPI, action.data);

    yield put({
      type: NORMAL_COMMENT_DELETE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: NORMAL_COMMENT_DELETE_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// ******************************************************************************************************************
// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************

async function normalNoticeFileUploadAPI(data) {
  return await axios.post(`/api/normalNotice/file`, data);
}

function* normalNoticeFileUpload(action) {
  try {
    const result = yield call(normalNoticeFileUploadAPI, action.data);

    yield put({
      type: NORMAL_FILE_UPLOAD_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: NORMAL_FILE_UPLOAD_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

//////////////////////////////////////////////////////////////
function* watchNormalNoticeList() {
  yield takeLatest(NORMAL_NOTICE_LIST_REQUEST, normalNoticeList);
}

function* watchNormalNoticeDetail() {
  yield takeLatest(NORMAL_NOTICE_DETAIL_REQUEST, normalNoticeDetail);
}

function* watchNormalNoticeAdminList() {
  yield takeLatest(NORMAL_NOTICE_ADMIN_LIST_REQUEST, normalNoticeAdminList);
}

function* watchNormalNoticeAdminCreate() {
  yield takeLatest(NORMAL_NOTICE_ADMIN_CREATE_REQUEST, normalNoticeAdminCreate);
}

function* watchNormalNoticeStuCreate() {
  yield takeLatest(NORMAL_NOTICE_STU_CREATE_REQUEST, normalNoticeStuCreate);
}

function* watchNormalNoticeTeacherCreate() {
  yield takeLatest(
    NORMAL_NOTICE_TEACHER_CREATE_REQUEST,
    normalNoticeTeacherCreate
  );
}

function* watchNormalNoticeUpdate() {
  yield takeLatest(NORMAL_NOTICE_UPDATE_REQUEST, normalNoticeUpdate);
}

function* watchNormalNoticeDelete() {
  yield takeLatest(NORMAL_NOTICE_DELETE_REQUEST, normalNoticeDelete);
}

function* watchNormalCommentList() {
  yield takeLatest(NORMAL_COMMENT_LIST_REQUEST, normalCommentList);
}

function* watchNormalCommentCreate() {
  yield takeLatest(NORMAL_COMMENT_CREATE_REQUEST, normalCommentCreate);
}

function* watchNormalCommentUpdate() {
  yield takeLatest(NORMAL_COMMENT_UPDATE_REQUEST, normalCommentUpdate);
}

function* watchNormalCommentDelete() {
  yield takeLatest(NORMAL_COMMENT_DELETE_REQUEST, normalCommentDelete);
}

function* watchNormalNoticeFileUpload() {
  yield takeLatest(NORMAL_FILE_UPLOAD_REQUEST, normalNoticeFileUpload);
}

//////////////////////////////////////////////////////////////
export default function* normalNoticeSaga() {
  yield all([
    fork(watchNormalNoticeList),
    fork(watchNormalNoticeDetail),
    fork(watchNormalNoticeAdminList),
    fork(watchNormalNoticeAdminCreate),
    fork(watchNormalNoticeStuCreate),
    fork(watchNormalNoticeTeacherCreate),
    fork(watchNormalNoticeUpdate),
    fork(watchNormalNoticeDelete),
    fork(watchNormalCommentList),
    fork(watchNormalCommentCreate),
    fork(watchNormalCommentUpdate),
    fork(watchNormalCommentDelete),
    fork(watchNormalNoticeFileUpload),
    //
  ]);
}
