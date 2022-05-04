import { all, call, delay, fork, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import {
  COMMUTE_LIST_REQUEST,
  COMMUTE_LIST_SUCCESS,
  COMMUTE_LIST_FAILURE,
  //////////////////////////
  COMMUTE_CREATE_REQUEST,
  COMMUTE_CREATE_SUCCESS,
  COMMUTE_CREATE_FAILURE,
  //////////////////////////
  COMMUTE_ADMIN_LIST_REQUEST,
  COMMUTE_ADMIN_LIST_SUCCESS,
  COMMUTE_ADMIN_LIST_FAILURE,
} from "../reducers/commute";

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function commuteListAPI(data) {
  return axios.post(`/api/commute/list`, data);
}

function* commuteList(action) {
  try {
    const result = yield call(commuteListAPI, action.data);

    yield put({
      type: COMMUTE_LIST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: COMMUTE_LIST_FAILURE,
      error: err.response.data,
    });
  }
}

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function commuteCreateAPI(data) {
  return axios.post(`/api/commute/create`, data);
}

function* commuteCreate(action) {
  try {
    const result = yield call(commuteCreateAPI, action.data);

    yield put({
      type: COMMUTE_CREATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: COMMUTE_CREATE_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function commuteAdminListAPI(data) {
  return axios.post(`/api/commute/admin/list`, data);
}

function* commuteAdminList(action) {
  try {
    const result = yield call(commuteAdminListAPI, action.data);

    yield put({
      type: COMMUTE_ADMIN_LIST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: COMMUTE_ADMIN_LIST_FAILURE,
      error: err.response.data,
    });
  }
}

//////////////////////////////////////////////////////////////
function* watchCommuteList() {
  yield takeLatest(COMMUTE_LIST_REQUEST, commuteList);
}

function* watchCommuteCreate() {
  yield takeLatest(COMMUTE_CREATE_REQUEST, commuteCreate);
}

function* watchCommuteAdminList() {
  yield takeLatest(COMMUTE_ADMIN_LIST_REQUEST, commuteAdminList);
}

//////////////////////////////////////////////////////////////
export default function* bannerSaga() {
  yield all([
    fork(watchCommuteList),
    fork(watchCommuteCreate),
    fork(watchCommuteAdminList),
    //
  ]);
}
