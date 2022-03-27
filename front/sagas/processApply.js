import { all, call, delay, fork, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import {
  PROCESS_LIST_REQUEST,
  PROCESS_LIST_SUCCESS,
  PROCESS_LIST_FAILURE,
  /////////////////////////////////////////////////,
  PROCESS_DETAIL_REQUEST,
  PROCESS_DETAIL_SUCCESS,
  PROCESS_DETAIL_FAILURE,
  /////////////////////////////////////////////////,
  PROCESS_CREATE_REQUEST,
  PROCESS_CREATE_SUCCESS,
  PROCESS_CREATE_FAILURE,
  /////////////////////////////////////////////////,
  PROCESS_UPDATE_REQUEST,
  PROCESS_UPDATE_SUCCESS,
  PROCESS_UPDATE_FAILURE,
} from "../reducers/processApply";

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function processListAPI(data) {
  return axios.post(`/api/apply/list`, data);
}

function* processList(action) {
  try {
    const result = yield call(processListAPI, action.data);

    yield put({
      type: PROCESS_LIST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: PROCESS_LIST_FAILURE,
      error: err.response.data,
    });
  }
}

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function processDetailAPI(data) {
  return axios.get(`/api/apply/detail/${data.apply}`);
}

function* processDetail(action) {
  try {
    const result = yield call(processDetailAPI, action.data);

    yield put({
      type: PROCESS_DETAIL_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: PROCESS_DETAIL_FAILURE,
      error: err.response.data,
    });
  }
}

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function processCreateAPI(data) {
  return axios.post(`/api/apply/create`, data);
}

function* processCreate(action) {
  try {
    const result = yield call(processCreateAPI, action.data);

    yield put({
      type: PROCESS_CREATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: PROCESS_CREATE_FAILURE,
      error: err.response.data,
    });
  }
}

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function processUpdateAPI(data) {
  return axios.patch(`/api/apply/update`, data);
}

function* processUpdate(action) {
  try {
    const result = yield call(processUpdateAPI, action.data);

    yield put({
      type: PROCESS_UPDATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: PROCESS_UPDATE_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

//////////////////////////////////////////////////////////////
function* watchProcessList() {
  yield takeLatest(PROCESS_LIST_REQUEST, processList);
}

function* watchProcessDetail() {
  yield takeLatest(PROCESS_DETAIL_REQUEST, processDetail);
}

function* watchProcessCreate() {
  yield takeLatest(PROCESS_CREATE_REQUEST, processCreate);
}

function* watchProcessUpdate() {
  yield takeLatest(PROCESS_UPDATE_REQUEST, processUpdate);
}

//////////////////////////////////////////////////////////////
export default function* bannerSaga() {
  yield all([
    fork(watchProcessList),
    fork(watchProcessDetail),
    fork(watchProcessCreate),
    fork(watchProcessUpdate),
    //
  ]);
}
