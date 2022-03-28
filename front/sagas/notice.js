import { all, call, delay, fork, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import {
  NOTICE_LECTURE_LIST_REQUEST,
  NOTICE_LECTURE_LIST_SUCCESS,
  NOTICE_LECTURE_LIST_FAILURE,
  //////////////////////////////////////,
  NOTICE_LIST_REQUEST,
  NOTICE_LIST_SUCCESS,
  NOTICE_LIST_FAILURE,
  //////////////////////////////////////,
  NOTICE_DETAIL_REQUEST,
  NOTICE_DETAIL_SUCCESS,
  NOTICE_DETAIL_FAILURE,
  //////////////////////////////////////,
  NOTICE_ADMIN_LIST_REQUEST,
  NOTICE_ADMIN_LIST_SUCCESS,
  NOTICE_ADMIN_LIST_FAILURE,
  //////////////////////////////////////,
  NOTICE_CREATE_REQUEST,
  NOTICE_CREATE_SUCCESS,
  NOTICE_CREATE_FAILURE,
  //////////////////////////////////////,
  NOTICE_ADMIN_CREATE_REQUEST,
  NOTICE_ADMIN_CREATE_SUCCESS,
  NOTICE_ADMIN_CREATE_FAILURE,
  //////////////////////////////////////,
  NOTICE_UPDATE_REQUEST,
  NOTICE_UPDATE_SUCCESS,
  NOTICE_UPDATE_FAILURE,
  //////////////////////////////////////,
  NOTICE_DELETE_REQUEST,
  NOTICE_DELETE_SUCCESS,
  NOTICE_DELETE_FAILURE,
  //////////////////////////////////////,
  NOTICE_NEXT_REQUEST,
  NOTICE_NEXT_SUCCESS,
  NOTICE_NEXT_FAILURE,
  //////////////////////////////////////,
  NOTICE_PREV_REQUEST,
  NOTICE_PREV_SUCCESS,
  NOTICE_PREV_FAILURE,
  //////////////////////////////////////,
  NOTICE_UPLOAD_REQUEST,
  NOTICE_UPLOAD_SUCCESS,
  NOTICE_UPLOAD_FAILURE,
  //////////////////////////////////////,
  NOTICE_LECTURE_CREATE_REQUEST,
  NOTICE_LECTURE_CREATE_SUCCESS,
  NOTICE_LECTURE_CREATE_FAILURE,
} from "../reducers/notice";

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function noticeLectureListAPI(data) {
  return axios.post(`/api/notice/lecture/list?page${data.page}`, data);
}

function* noticeLectureList(action) {
  try {
    const result = yield call(noticeLectureListAPI, action.data);

    yield put({
      type: NOTICE_LECTURE_LIST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: NOTICE_LECTURE_LIST_FAILURE,
      error: err.response.data,
    });
  }
}

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function noticeListAPI(data) {
  return axios.get(`/api/notice/list?${data.page}`, data);
}

function* noticeList(action) {
  try {
    const result = yield call(noticeListAPI, action.data);

    yield put({
      type: NOTICE_LIST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: NOTICE_LIST_FAILURE,
      error: err.response.data,
    });
  }
}

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function noticeDetailAPI(data) {
  return axios.get(`/api/notice/detail/${data.noticeId}`, data);
}

function* noticeDetail(action) {
  try {
    const result = yield call(noticeDetailAPI, action.data);

    yield put({
      type: NOTICE_DETAIL_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: NOTICE_DETAIL_FAILURE,
      error: err.response.data,
    });
  }
}

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function noticeAdminListAPI(data) {
  return axios.post(`/api/notice/admin/list`, data);
}
function* noticeAdminList(action) {
  try {
    const result = yield call(noticeAdminListAPI, action.data);

    yield put({
      type: NOTICE_ADMIN_LIST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: NOTICE_ADMIN_LIST_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function noticeCreateAPI(data) {
  return axios.post(`/api/notice/create`, data);
}

function* noticeCreate(action) {
  try {
    const result = yield call(noticeCreateAPI, action.data);

    yield put({
      type: NOTICE_CREATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: NOTICE_CREATE_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function noticeAdminCreateAPI(data) {
  return axios.post(`/api/notice/admin/create`, data);
}

function* noticeAdminCreate(action) {
  try {
    const result = yield call(noticeAdminCreateAPI, action.data);

    yield put({
      type: NOTICE_ADMIN_CREATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: NOTICE_ADMIN_CREATE_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function noticeLectureCreateAPI(data) {
  return axios.post(`/api/notice/admin/lecture/create`, data);
}

function* noticeLectureCreate(action) {
  try {
    const result = yield call(noticeLectureCreateAPI, action.data);

    yield put({
      type: NOTICE_LECTURE_CREATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: NOTICE_LECTURE_CREATE_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function noticeFileAPI(data) {
  return axios.post(`/api/notice/file`, data);
}

function* noticeFile(action) {
  try {
    const result = yield call(noticeFileAPI, action.data);

    yield put({
      type: NOTICE_UPLOAD_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: NOTICE_UPLOAD_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function noticeUpdateAPI(data) {
  return axios.patch(`/api/notice/update`, data);
}

function* noticeUpdate(action) {
  try {
    const result = yield call(noticeUpdateAPI, action.data);

    yield put({
      type: NOTICE_UPDATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: NOTICE_UPDATE_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function noticeDeleteAPI(data) {
  return axios.delete(`/api/notice/delete/${data.noticeId}`);
}

function* noticeDelete(action) {
  try {
    const result = yield call(noticeDeleteAPI, action.data);

    yield put({
      type: NOTICE_DELETE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: NOTICE_DELETE_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function noticeNextAPI(data) {
  return axios.get(`/api/notice/next/${data.noticeId}`);
}

function* noticeNext(action) {
  try {
    const result = yield call(noticeNextAPI, action.data);

    yield put({
      type: NOTICE_NEXT_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: NOTICE_NEXT_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function noticePrevAPI(data) {
  return axios.get(`/api/notice/prev/${data.noticeId}`);
}

function* noticePrev(action) {
  try {
    const result = yield call(noticePrevAPI, action.data);

    yield put({
      type: NOTICE_PREV_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: NOTICE_PREV_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

//////////////////////////////////////////////////////////////

function* watchNoticeLectureList() {
  yield takeLatest(NOTICE_LECTURE_LIST_REQUEST, noticeLectureList);
}

function* watchNoticeList() {
  yield takeLatest(NOTICE_LIST_REQUEST, noticeList);
}

function* watchNoticeDetail() {
  yield takeLatest(NOTICE_DETAIL_REQUEST, noticeDetail);
}

function* watchNoticeAdminList() {
  yield takeLatest(NOTICE_ADMIN_LIST_REQUEST, noticeAdminList);
}

function* watchNoticeCreate() {
  yield takeLatest(NOTICE_CREATE_REQUEST, noticeCreate);
}

function* watchNoticeAdminCreate() {
  yield takeLatest(NOTICE_ADMIN_CREATE_REQUEST, noticeAdminCreate);
}

function* watchNoticeLectureCreate() {
  yield takeLatest(NOTICE_LECTURE_CREATE_REQUEST, noticeLectureCreate);
}

function* watchNoticeFileCreate() {
  yield takeLatest(NOTICE_UPLOAD_REQUEST, noticeFile);
}

function* watchNoticeUpdate() {
  yield takeLatest(NOTICE_UPDATE_REQUEST, noticeUpdate);
}

function* watchNoticeDelete() {
  yield takeLatest(NOTICE_DELETE_REQUEST, noticeDelete);
}

function* watchNoticeNext() {
  yield takeLatest(NOTICE_NEXT_REQUEST, noticeNext);
}

function* watchNoticePrev() {
  yield takeLatest(NOTICE_PREV_REQUEST, noticePrev);
}

//////////////////////////////////////////////////////////////
export default function* noticeSaga() {
  yield all([
    fork(watchNoticeLectureList),
    fork(watchNoticeList),
    fork(watchNoticeDetail),
    fork(watchNoticeAdminList),
    fork(watchNoticeCreate),
    fork(watchNoticeAdminCreate),
    fork(watchNoticeLectureCreate),
    fork(watchNoticeFileCreate),
    fork(watchNoticeUpdate),
    fork(watchNoticeDelete),
    fork(watchNoticeNext),
    fork(watchNoticePrev),

    //
  ]);
}
