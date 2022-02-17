import { all, call, delay, fork, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import {
  NOTICE_LIST_REQUEST,
  NOTICE_LIST_SUCCESS,
  NOTICE_LIST_FAILURE,
  //
  NOTICE_CREATE_REQUEST,
  NOTICE_CREATE_SUCCESS,
  NOTICE_CREATE_FAILURE,
  //
  NOTICE_UPDATE_REQUEST,
  NOTICE_UPDATE_SUCCESS,
  NOTICE_UPDATE_FAILURE,
  //
  NOTICE_DELETE_REQUEST,
  NOTICE_DELETE_SUCCESS,
  NOTICE_DELETE_FAILURE,
} from "../reducers/notice";

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function noticeListAPI(data) {
  return axios.get(`/api/notice/list/${data.qs}`, data);
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

//////////////////////////////////////////////////////////////
function* watchNoticeList() {
  yield takeLatest(NOTICE_LIST_REQUEST, noticeList);
}

function* watchNoticeCreate() {
  yield takeLatest(NOTICE_CREATE_REQUEST, noticeCreate);
}

function* watchNoticeUpdate() {
  yield takeLatest(NOTICE_UPDATE_REQUEST, noticeUpdate);
}

function* watchNoticeDelete() {
  yield takeLatest(NOTICE_DELETE_REQUEST, noticeDelete);
}

//////////////////////////////////////////////////////////////
export default function* noticeSaga() {
  yield all([
    fork(watchNoticeList),
    fork(watchNoticeCreate),
    fork(watchNoticeUpdate),
    fork(watchNoticeDelete),
    //
  ]);
}
