import { all, call, delay, fork, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import {
  TEACHER_PAY_LIST_REQUEST,
  TEACHER_PAY_LIST_SUCCESS,
  TEACHER_PAY_LIST_FAILURE,
  //
  TEACHER_ADMIN_PAY_LIST_REQUEST,
  TEACHER_ADMIN_PAY_LIST_SUCCESS,
  TEACHER_ADMIN_PAY_LIST_FAILURE,
  //
  TEACHER_PAY_CREATE_REQUEST,
  TEACHER_PAY_CREATE_SUCCESS,
  TEACHER_PAY_CREATE_FAILURE,
} from "../reducers/teacherpay";

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function teacherPayListAPI(data) {
  return axios.post(`/api/teacherPay/teacher/list`, data);
}

function* teacherPayList(action) {
  try {
    const result = yield call(teacherPayListAPI, action.data);

    yield put({
      type: TEACHER_PAY_LIST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: TEACHER_PAY_LIST_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function teacherPayAdminListAPI(data) {
  return axios.post(`/api/teacherPay/admin/list`, data);
}

function* teacherPayAdminList(action) {
  try {
    const result = yield call(teacherPayAdminListAPI, action.data);

    yield put({
      type: TEACHER_ADMIN_PAY_LIST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: TEACHER_ADMIN_PAY_LIST_FAILURE,
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
function teacherPayCreateAPI(data) {
  return axios.post(`/api/teacherPay/create`, data);
}

function* teacherPayCreate(action) {
  try {
    const result = yield call(teacherPayCreateAPI, action.data);

    yield put({
      type: TEACHER_PAY_CREATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: TEACHER_PAY_CREATE_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

//////////////////////////////////////////////////////////////
function* watchTeacherPayList() {
  yield takeLatest(TEACHER_PAY_LIST_REQUEST, teacherPayList);
}

function* watchTeacherPayAdminList() {
  yield takeLatest(TEACHER_ADMIN_PAY_LIST_REQUEST, teacherPayAdminList);
}

function* watchTeacherPayCreate() {
  yield takeLatest(TEACHER_PAY_CREATE_REQUEST, teacherPayCreate);
}

//////////////////////////////////////////////////////////////
export default function* teacherPaySaga() {
  yield all([
    fork(watchTeacherPayList),
    fork(watchTeacherPayAdminList),
    fork(watchTeacherPayCreate),
    //
  ]);
}
