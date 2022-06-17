import { all, call, delay, fork, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import {
  LECTURE_NOTICE_LIST_REQUEST,
  LECTURE_NOTICE_LIST_SUCCESS,
  LECTURE_NOTICE_LIST_FAILURE,
  //
  LECTURE_NOTICE_ADMIN_LIST_REQUEST,
  LECTURE_NOTICE_ADMIN_LIST_SUCCESS,
  LECTURE_NOTICE_ADMIN_LIST_FAILURE,
  //
  LECTURE_NOTICE_DETAIL_LIST_REQUEST,
  LECTURE_NOTICE_DETAIL_LIST_SUCCESS,
  LECTURE_NOTICE_DETAIL_LIST_FAILURE,
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
} from "../reducers/lectureNotice";

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

//////////////////////////////////////////////////////////////

function* watchLectureNoticeList() {
  yield takeLatest(LECTURE_NOTICE_LIST_REQUEST, lectureNoticeList);
}

function* watchLectureNoticeAdminList() {
  yield takeLatest(LECTURE_NOTICE_ADMIN_LIST_REQUEST, lectureNoticeAdminList);
}

function* watchLectureNoticeDetailList() {
  yield takeLatest(LECTURE_NOTICE_DETAIL_LIST_REQUEST, lectureNoticeDetailList);
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

//////////////////////////////////////////////////////////////
export default function* lectureNoticeSaga() {
  yield all([
    fork(watchLectureNoticeList),
    fork(watchLectureNoticeAdminList),
    fork(watchLectureNoticeDetailList),
    fork(watchLectureNoticeUpload),
    fork(watchLectureNoticeCreate),
    fork(watchLectureNoticeUpdate),
    fork(watchLectureNoticeDelete),
    //
  ]);
}
