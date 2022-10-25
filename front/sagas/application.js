import { all, call, delay, fork, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import {
  APP_CREATE_REQUEST,
  APP_CREATE_SUCCESS,
  APP_CREATE_FAILURE,
  //
  APP_LIST_REQUEST,
  APP_LIST_SUCCESS,
  APP_LIST_FAILURE,
  //
  APP_UPDATE_REQUEST,
  APP_UPDATE_SUCCESS,
  APP_UPDATE_FAILURE,
  //
  APP_DETAIL_REQUEST,
  APP_DETAIL_SUCCESS,
  APP_DETAIL_FAILURE,
  //
  APP_USE_UPDATE_REQUEST,
  APP_USE_UPDATE_SUCCESS,
  APP_USE_UPDATE_FAILURE,
  //
  APP_USE_LIST_REQUEST,
  APP_USE_LIST_SUCCESS,
  APP_USE_LIST_FAILURE,
  /////////////////////////////
} from "../reducers/application";

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function appCreateAPI(data) {
  return axios.post(`/api/app/create`, data);
}

function* appCreate(action) {
  try {
    const result = yield call(appCreateAPI, action.data);

    yield put({
      type: APP_CREATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: APP_CREATE_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************

// ******************************************************************************************************************
// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function appListAPI(data) {
  return axios.post(`/api/app/list`, data);
}

function* appList(action) {
  try {
    const result = yield call(appListAPI, action.data);

    yield put({
      type: APP_LIST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: APP_LIST_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function appUpdateAPI(data) {
  return axios.patch(`/api/app/update`, data);
}

function* appUpdate(action) {
  try {
    const result = yield call(appUpdateAPI, action.data);

    yield put({
      type: APP_UPDATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: APP_UPDATE_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function appDetailAPI(data) {
  return axios.post(`/api/app/detail`, data);
}

function* appDetail(action) {
  try {
    const result = yield call(appDetailAPI, action.data);

    yield put({
      type: APP_DETAIL_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: APP_DETAIL_FAILURE,
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
async function appUseUpdateAPI(data) {
  return await axios.post(`/api/app/useYn`, data);
}

function* appUseUpdate(action) {
  try {
    const result = yield call(appUseUpdateAPI, action.data);

    yield put({
      type: APP_USE_UPDATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: APP_USE_UPDATE_FAILURE,
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
async function appUseListAPI(data) {
  return await axios.post(`/api/app/useYn/data`, data);
}

function* appUseList(action) {
  try {
    const result = yield call(appUseListAPI, action.data);

    yield put({
      type: APP_USE_LIST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: APP_USE_LIST_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

//////////////////////////////////////////////////////////////
function* watchAppCreate() {
  yield takeLatest(APP_CREATE_REQUEST, appCreate);
}

function* watchAppList() {
  yield takeLatest(APP_LIST_REQUEST, appList);
}

function* watchAppUpdate() {
  yield takeLatest(APP_UPDATE_REQUEST, appUpdate);
}

function* watchAppDetail() {
  yield takeLatest(APP_DETAIL_REQUEST, appDetail);
}

function* watchAppUseUpdate() {
  yield takeLatest(APP_USE_UPDATE_REQUEST, appUseUpdate);
}

function* watchAppUseList() {
  yield takeLatest(APP_USE_LIST_REQUEST, appUseList);
}

//////////////////////////////////////////////////////////////
export default function* appSaga() {
  yield all([
    fork(watchAppCreate),
    fork(watchAppList),
    fork(watchAppUpdate),
    fork(watchAppDetail),
    fork(watchAppUseUpdate),
    fork(watchAppUseList),
    //
  ]);
}
