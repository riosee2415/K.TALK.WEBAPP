import { all, call, delay, fork, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import {
  LECTURE_MEMO_LIST_REQUEST,
  LECTURE_MEMO_LIST_SUCCESS,
  LECTURE_MEMO_LIST_FAILURE,
  //
  LECTURE_MEMO_CREATE_REQUEST,
  LECTURE_MEMO_CREATE_SUCCESS,
  LECTURE_MEMO_CREATE_FAILURE,
  //
  LECTURE_MEMO_UDPATE_REQUEST,
  LECTURE_MEMO_UDPATE_SUCCESS,
  LECTURE_MEMO_UDPATE_FAILURE,
  //
  LECTURE_MEMO_DELETE_REQUEST,
  LECTURE_MEMO_DELETE_SUCCESS,
  LECTURE_MEMO_DELETE_FAILURE,
} from "../reducers/lectureMemo";

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function lectureMemoListAPI(data) {
  return axios.post(`/api/lectureMemo/list`, data);
}

function* lectureMemoList(action) {
  try {
    const result = yield call(lectureMemoListAPI, action.data);

    yield put({
      type: LECTURE_MEMO_LIST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LECTURE_MEMO_LIST_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function lectureMemoCreateAPI(data) {
  return axios.post(`/api/lectureMemo/create`, data);
}

function* lectureMemoCreate(action) {
  try {
    const result = yield call(lectureMemoCreateAPI, action.data);

    yield put({
      type: LECTURE_MEMO_CREATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LECTURE_MEMO_CREATE_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function lectureMemoUpdateAPI(data) {
  return axios.patch(`/api/lectureMemo/update`, data);
}

function* lectureMemoUpdate(action) {
  try {
    const result = yield call(lectureMemoUpdateAPI, action.data);

    yield put({
      type: LECTURE_MEMO_UDPATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LECTURE_MEMO_UDPATE_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function lectureMemoDeleteAPI(data) {
  return axios.delete(`/api/lectureMemo/delete/${data.memoId}`, data);
}

function* lectureMemoDelete(action) {
  try {
    const result = yield call(lectureMemoDeleteAPI, action.data);

    yield put({
      type: LECTURE_MEMO_DELETE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LECTURE_MEMO_DELETE_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

//////////////////////////////////////////////////////////////
function* watchLectureMemoList() {
  yield takeLatest(LECTURE_MEMO_LIST_REQUEST, lectureMemoList);
}

function* watchLectureMemoCreate() {
  yield takeLatest(LECTURE_MEMO_CREATE_REQUEST, lectureMemoCreate);
}

function* watchLectureMemoUpdate() {
  yield takeLatest(LECTURE_MEMO_UDPATE_REQUEST, lectureMemoUpdate);
}

function* watchLectureMemoDelete() {
  yield takeLatest(LECTURE_MEMO_DELETE_REQUEST, lectureMemoDelete);
}

//////////////////////////////////////////////////////////////
export default function* lectureMemoSaga() {
  yield all([
    fork(watchLectureMemoList),
    fork(watchLectureMemoCreate),
    fork(watchLectureMemoUpdate),
    fork(watchLectureMemoDelete),
    //
  ]);
}
