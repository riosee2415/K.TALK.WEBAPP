import { all, call, delay, fork, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import {
  ////////////////////////////// NOTICE //////////////////////////////
  LECTURE_NOTICE_LIST_REQUEST,
  LECTURE_NOTICE_LIST_SUCCESS,
  LECTURE_NOTICE_LIST_FAILURE,
  //
  LECTURE_NOTICE_DETAIL_LIST_REQUEST,
  LECTURE_NOTICE_DETAIL_LIST_SUCCESS,
  LECTURE_NOTICE_DETAIL_LIST_FAILURE,
  //
  LECTURE_NOTICE_ADMIN_LIST_REQUEST,
  LECTURE_NOTICE_ADMIN_LIST_SUCCESS,
  LECTURE_NOTICE_ADMIN_LIST_FAILURE,
  //
  LECNOTICE_ADMIN_DETAIL_REQUEST,
  LECNOTICE_ADMIN_DETAIL_SUCCESS,
  LECNOTICE_ADMIN_DETAIL_FAILURE,
  //
  LECTURE_NOTICE_UPLOAD_REQUEST,
  LECTURE_NOTICE_UPLOAD_SUCCESS,
  LECTURE_NOTICE_UPLOAD_FAILURE,
  //
  LECTURE_NOTICE_CREATE_REQUEST,
  LECTURE_NOTICE_CREATE_SUCCESS,
  LECTURE_NOTICE_CREATE_FAILURE,
  //
  LECTURE_NOTICE_UPDATE_REQUEST,
  LECTURE_NOTICE_UPDATE_SUCCESS,
  LECTURE_NOTICE_UPDATE_FAILURE,
  //
  LECTURE_NOTICE_DELETE_REQUEST,
  LECTURE_NOTICE_DELETE_SUCCESS,
  LECTURE_NOTICE_DELETE_FAILURE,

  ////////////////////////////// COMMENT //////////////////////////////
  LECNOTICE_COMMENT_DETAIL_REQUEST,
  LECNOTICE_COMMENT_DETAIL_SUCCESS,
  LECNOTICE_COMMENT_DETAIL_FAILURE,
  //
  LECNOTICE_COMMENT_CREATE_REQUEST,
  LECNOTICE_COMMENT_CREATE_SUCCESS,
  LECNOTICE_COMMENT_CREATE_FAILURE,
  //
  LECNOTICE_COMMENT_UPDATE_REQUEST,
  LECNOTICE_COMMENT_UPDATE_SUCCESS,
  LECNOTICE_COMMENT_UPDATE_FAILURE,
  //
  LECNOTICE_COMMENT_DELETE_REQUEST,
  LECNOTICE_COMMENT_DELETE_SUCCESS,
  LECNOTICE_COMMENT_DELETE_FAILURE,
} from "../reducers/lectureNotice";

////////////////////////////////////////////////////////////////////
////////////////////////////// NOTICE //////////////////////////////
////////////////////////////////////////////////////////////////////

// ******************************************************************************************************************
// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
async function lectureNoticeListAPI(data) {
  return await axios.post(`/api/lectureNotice/list`, data);
}

function* lectureNoticeList(action) {
  try {
    const result = yield call(lectureNoticeListAPI, action.data);

    yield put({
      type: LECTURE_NOTICE_LIST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LECTURE_NOTICE_LIST_FAILURE,
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
async function lectureNoticeDetailListAPI(data) {
  return await axios.post(`/api/lectureNotice/detail`, data);
}

function* lectureNoticeDetailList(action) {
  try {
    const result = yield call(lectureNoticeDetailListAPI, action.data);

    yield put({
      type: LECTURE_NOTICE_DETAIL_LIST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LECTURE_NOTICE_DETAIL_LIST_FAILURE,
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
async function lectureNoticeAdminListAPI(data) {
  return await axios.post(`/api/lectureNotice/admin/list`, data);
}

function* lectureNoticeAdminList(action) {
  try {
    const result = yield call(lectureNoticeAdminListAPI, action.data);

    yield put({
      type: LECTURE_NOTICE_ADMIN_LIST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LECTURE_NOTICE_ADMIN_LIST_FAILURE,
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
async function lecNoticeAdminDetailAPI(data) {
  return await axios.post(`/api/lectureNotice/admin/detail`, data);
}

function* lecNoticeAdminDetail(action) {
  try {
    const result = yield call(lecNoticeAdminDetailAPI, action.data);

    yield put({
      type: LECNOTICE_ADMIN_DETAIL_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LECNOTICE_ADMIN_DETAIL_FAILURE,
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
async function lectureNoticeThumbnailAPI(data) {
  return await axios.post(`/api/lectureNotice/file`, data);
}

function* lectureNoticeThumbnail(action) {
  try {
    const result = yield call(lectureNoticeThumbnailAPI, action.data);

    yield put({
      type: LECTURE_NOTICE_UPLOAD_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LECTURE_NOTICE_UPLOAD_FAILURE,
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
async function lectureNoticeCreateAPI(data) {
  return await axios.post(`/api/lectureNotice/create`, data);
}

function* lectureNoticeCreate(action) {
  try {
    const result = yield call(lectureNoticeCreateAPI, action.data);

    yield put({
      type: LECTURE_NOTICE_CREATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LECTURE_NOTICE_CREATE_FAILURE,
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
async function lectureNoticeUpdateAPI(data) {
  return await axios.patch(`/api/lectureNotice/update`, data);
}

function* lectureNoticeUpdate(action) {
  try {
    const result = yield call(lectureNoticeUpdateAPI, action.data);

    yield put({
      type: LECTURE_NOTICE_UPDATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LECTURE_NOTICE_UPDATE_FAILURE,
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
async function lectureNoticeDeleteAPI(data) {
  return await axios.patch(`/api/lectureNotice/delete`, data);
}

function* lectureNoticeDelete(action) {
  try {
    const result = yield call(lectureNoticeDeleteAPI, action.data);

    yield put({
      type: LECTURE_NOTICE_DELETE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LECTURE_NOTICE_DELETE_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

/////////////////////////////////////////////////////////////////////
////////////////////////////// COMMENT //////////////////////////////
/////////////////////////////////////////////////////////////////////

// ******************************************************************************************************************
// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
async function lecNoticeCommentDetailAPI(data) {
  return await axios.post(`/api/lectureNotice/comment/detail`, data);
}

function* lecNoticeCommentDetail(action) {
  try {
    const result = yield call(lecNoticeCommentDetailAPI, action.data);

    yield put({
      type: LECNOTICE_COMMENT_DETAIL_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LECNOTICE_COMMENT_DETAIL_FAILURE,
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
async function lecNoticeCommentCreateAPI(data) {
  return await axios.post(`/api/lectureNotice/comment/create`, data);
}

function* lecNoticeCommentCreate(action) {
  try {
    const result = yield call(lecNoticeCommentCreateAPI, action.data);

    yield put({
      type: LECNOTICE_COMMENT_CREATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LECNOTICE_COMMENT_CREATE_FAILURE,
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
async function lecNoticeCommentUpdateAPI(data) {
  return await axios.post(`/api/lectureNotice/comment/update`, data);
}

function* lecNoticeCommentUpdate(action) {
  try {
    const result = yield call(lecNoticeCommentUpdateAPI, action.data);

    yield put({
      type: LECNOTICE_COMMENT_UPDATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LECNOTICE_COMMENT_UPDATE_FAILURE,
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
async function lecNoticeCommentDeleteAPI(data) {
  return await axios.delete(
    `/api/lectureNotice/comment/delete/${data.commentId}`,
    data
  );
}

function* lecNoticeCommentDelete(action) {
  try {
    const result = yield call(lecNoticeCommentDeleteAPI, action.data);

    yield put({
      type: LECNOTICE_COMMENT_DELETE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LECNOTICE_COMMENT_DELETE_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

//////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////
////////////////////////////// NOTICE //////////////////////////////
////////////////////////////////////////////////////////////////////

function* watchLectureNoticeList() {
  yield takeLatest(LECTURE_NOTICE_LIST_REQUEST, lectureNoticeList);
}

function* watchLectureNoticeDetailList() {
  yield takeLatest(LECTURE_NOTICE_DETAIL_LIST_REQUEST, lectureNoticeDetailList);
}

function* watchLectureNoticeAdminList() {
  yield takeLatest(LECTURE_NOTICE_ADMIN_LIST_REQUEST, lectureNoticeAdminList);
}

function* watchLecNoticeAdminDetail() {
  yield takeLatest(LECNOTICE_ADMIN_DETAIL_REQUEST, lecNoticeAdminDetail);
}

function* watchLectureNoticeUpload() {
  yield takeLatest(LECTURE_NOTICE_UPLOAD_REQUEST, lectureNoticeThumbnail);
}

function* watchLectureNoticeCreate() {
  yield takeLatest(LECTURE_NOTICE_CREATE_REQUEST, lectureNoticeCreate);
}

function* watchLectureNoticeUpdate() {
  yield takeLatest(LECTURE_NOTICE_UPDATE_REQUEST, lectureNoticeUpdate);
}

function* watchLectureNoticeDelete() {
  yield takeLatest(LECTURE_NOTICE_DELETE_REQUEST, lectureNoticeDelete);
}

/////////////////////////////////////////////////////////////////////
////////////////////////////// COMMENT //////////////////////////////
/////////////////////////////////////////////////////////////////////

function* watchLecNoticeCommentDetail() {
  yield takeLatest(LECNOTICE_COMMENT_DETAIL_REQUEST, lecNoticeCommentDetail);
}

function* watchLecNoticeCommentCreate() {
  yield takeLatest(LECNOTICE_COMMENT_CREATE_REQUEST, lecNoticeCommentCreate);
}

function* watchLecNoticeCommentUpdate() {
  yield takeLatest(LECNOTICE_COMMENT_UPDATE_REQUEST, lecNoticeCommentUpdate);
}

function* watchLecNoticeCommentDelete() {
  yield takeLatest(LECNOTICE_COMMENT_DELETE_REQUEST, lecNoticeCommentDelete);
}

//////////////////////////////////////////////////////////////
export default function* lectureNoticeSaga() {
  yield all([
    ////////////////////////////////////////////////////////////////////
    ////////////////////////////// NOTICE //////////////////////////////
    ////////////////////////////////////////////////////////////////////
    fork(watchLectureNoticeList),
    fork(watchLectureNoticeDetailList),
    fork(watchLectureNoticeAdminList),
    fork(watchLecNoticeAdminDetail),
    fork(watchLectureNoticeUpload),
    fork(watchLectureNoticeCreate),
    fork(watchLectureNoticeUpdate),
    fork(watchLectureNoticeDelete),

    /////////////////////////////////////////////////////////////////////
    ////////////////////////////// COMMENT //////////////////////////////
    /////////////////////////////////////////////////////////////////////
    fork(watchLecNoticeCommentDetail),
    fork(watchLecNoticeCommentCreate),
    fork(watchLecNoticeCommentUpdate),
    fork(watchLecNoticeCommentDelete),
  ]);
}
