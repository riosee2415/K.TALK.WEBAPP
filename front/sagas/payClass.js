import { all, call, delay, fork, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import {
  PAY_CLASS_LIST_REQUEST,
  PAY_CLASS_LIST_SUCCESS,
  PAY_CLASS_LIST_FAILURE,
  /////////////////////////////////
  PAY_CLASS_CREATE_REQUEST,
  PAY_CLASS_CREATE_SUCCESS,
  PAY_CLASS_CREATE_FAILURE,
  /////////////////////////////////
  PAY_CLASS_UPDATE_REQUEST,
  PAY_CLASS_UPDATE_SUCCESS,
  PAY_CLASS_UPDATE_FAILURE,
  /////////////////////////////////
  PAY_CLASS_DELETE_REQUEST,
  PAY_CLASS_DELETE_SUCCESS,
  PAY_CLASS_DELETE_FAILURE,
  /////////////////////////////////
  PAY_CLASS_DETAIL_REQUEST,
  PAY_CLASS_DETAIL_SUCCESS,
  PAY_CLASS_DETAIL_FAILURE,
} from "../reducers/payClass";

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function payClassListAPI(data) {
  return axios.get(`/api/payClass/list`, data);
}

function* payClassList(action) {
  try {
    const result = yield call(payClassListAPI, action.data);

    yield put({
      type: PAY_CLASS_LIST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: PAY_CLASS_LIST_FAILURE,
      error: err.response.data,
    });
  }
}

//////////////////////////////////////////////////////////////
function payClassCreateAPI(data) {
  return axios.post(`/api/payClass/create`, data);
}

function* payClassCreate(action) {
  try {
    const result = yield call(payClassCreateAPI, action.data);

    yield put({
      type: PAY_CLASS_CREATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: PAY_CLASS_CREATE_FAILURE,
      error: err.response.data,
    });
  }
}

//////////////////////////////////////////////////////////////
function payClassUpdateAPI(data) {
  return axios.patch(`/api/payClass/update`, data);
}

function* payClassUpdate(action) {
  try {
    const result = yield call(payClassUpdateAPI, action.data);

    yield put({
      type: PAY_CLASS_UPDATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: PAY_CLASS_UPDATE_FAILURE,
      error: err.response.data,
    });
  }
}

//////////////////////////////////////////////////////////////
function payClassDeleteAPI(data) {
  return axios.delete(`/api/payClass/delete/${data.classId}`, data);
}

function* payClassDelete(action) {
  try {
    const result = yield call(payClassDeleteAPI, action.data);

    yield put({
      type: PAY_CLASS_DELETE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: PAY_CLASS_DELETE_FAILURE,
      error: err.response.data,
    });
  }
}

//////////////////////////////////////////////////////////////
function payClassDetailAPI(data) {
  return axios.get(`/api/payclass/detail/${data.classId}`, data);
}

function* payClassDetail(action) {
  try {
    const result = yield call(payClassDetailAPI, action.data);

    yield put({
      type: PAY_CLASS_DETAIL_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: PAY_CLASS_DETAIL_FAILURE,
      error: err.response.data,
    });
  }
}
//////////////////////////////////////////////////////////////

function* watchPayClassList() {
  yield takeLatest(PAY_CLASS_LIST_REQUEST, payClassList);
}
function* watchPayClassCreate() {
  yield takeLatest(PAY_CLASS_CREATE_REQUEST, payClassCreate);
}
function* watchPayClassUpdate() {
  yield takeLatest(PAY_CLASS_UPDATE_REQUEST, payClassUpdate);
}
function* watchPayClassDelete() {
  yield takeLatest(PAY_CLASS_DELETE_REQUEST, payClassDelete);
}
function* watchPayClassDetail() {
  yield takeLatest(PAY_CLASS_DETAIL_REQUEST, payClassDetail);
}
//////////////////////////////////////////////////////////////
export default function* payClassSaga() {
  yield all([
    fork(watchPayClassList),
    fork(watchPayClassCreate),
    fork(watchPayClassUpdate),
    fork(watchPayClassDelete),
    fork(watchPayClassDetail),
  ]);
}
