import { all, call, delay, fork, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import {
  LECTURE_LIST_REQUEST,
  LECTURE_LIST_SUCCESS,
  LECTURE_LIST_FAILURE,
  //
  LECTURE_CREATE_REQUEST,
  LECTURE_CREATE_SUCCESS,
  LECTURE_CREATE_FAILURE,
  //
  LECTURE_UPDATE_REQUEST,
  LECTURE_UPDATE_SUCCESS,
  LECTURE_UPDATE_FAILURE,
  //
  LECTURE_DELETE_REQUEST,
  LECTURE_DELETE_SUCCESS,
  LECTURE_DELETE_FAILURE,
} from "../reducers/ledture";

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function lectureListAPI(data) {
  return axios.get(`/api/lecture/list/${data.qs}`, data);
}

function* lectureList(action) {
  try {
    const result = yield call(lectureListAPI, action.data);

    yield put({
      type: LECTURE_LIST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LECTURE_LIST_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function lectureCreateAPI(data) {
  return axios.post(`/api/lecture/create`, data);
}

function* lectureCreate(action) {
  try {
    const result = yield call(lectureCreateAPI, action.data);

    yield put({
      type: LECTURE_CREATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LECTURE_CREATE_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function lectureUpdateAPI(data) {
  return axios.patch(`/api/lecture/update`, data);
}

function* lectureUpdate(action) {
  try {
    const result = yield call(lectureUpdateAPI, action.data);

    yield put({
      type: LECTURE_UPDATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LECTURE_UPDATE_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function lectureDeleteAPI(data) {
  return axios.delete(`/api/lecture/delete/${data.lectureId}`);
}

function* lectureDelete(action) {
  try {
    const result = yield call(lectureDeleteAPI, action.data);

    yield put({
      type: LECTURE_DELETE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LECTURE_DELETE_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

//////////////////////////////////////////////////////////////
function* watchLectureList() {
  yield takeLatest(LECTURE_LIST_REQUEST, lectureList);
}

function* watchLectureCreate() {
  yield takeLatest(LECTURE_CREATE_REQUEST, lectureCreate);
}

function* watchLectureUpdate() {
  yield takeLatest(LECTURE_UPDATE_REQUEST, lectureUpdate);
}

function* watchLectureDelete() {
  yield takeLatest(LECTURE_DELETE_REQUEST, lectureDelete);
}

//////////////////////////////////////////////////////////////
export default function* lectureSaga() {
  yield all([
    fork(watchLectureList),
    fork(watchLectureCreate),
    fork(watchLectureUpdate),
    fork(watchLectureDelete),
    //
  ]);
}
