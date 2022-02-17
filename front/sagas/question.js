import { all, call, delay, fork, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import {
  QUESTION_GET_REQUEST,
  QUESTION_GET_SUCCESS,
  QUESTION_GET_FAILURE,
  //
  QUESTION_CREATE_REQUEST,
  QUESTION_CREATE_SUCCESS,
  QUESTION_CREATE_FAILURE,
  //
  QUESTION_DELETE_REQUEST,
  QUESTION_DELETE_SUCCESS,
  QUESTION_DELETE_FAILURE,
  //
  QUESTION_UPDATE_REQUEST,
  QUESTION_UPDATE_SUCCESS,
  QUESTION_UPDATE_FAILURE,
  // ************************************************
  QUESTION_TYPE_GET_REQUEST,
  QUESTION_TYPE_GET_SUCCESS,
  QUESTION_TYPE_GET_FAILURE,
  //
  QUESTION_TYPE_CREATE_REQUEST,
  QUESTION_TYPE_CREATE_SUCCESS,
  QUESTION_TYPE_CREATE_FAILURE,
  //
  QUESTION_TYPE_DELETE_REQUEST,
  QUESTION_TYPE_DELETE_SUCCESS,
  QUESTION_TYPE_DELETE_FAILURE,
  //
  QUESTION_TYPE_UPDATE_REQUEST,
  QUESTION_TYPE_UPDATE_SUCCESS,
  QUESTION_TYPE_UPDATE_FAILURE,
} from "../reducers/question";

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function questionGetAPI(data) {
  return axios.get(`/api/question/list/${data.listType}`);
}

function* questionGet(action) {
  try {
    const result = yield call(questionGetAPI, action.data);

    yield put({
      type: QUESTION_GET_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: QUESTION_GET_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function questionCreateAPI(data) {
  return axios.post(`/api/question/create`, data);
}

function* questionCreate(action) {
  try {
    const result = yield call(questionCreateAPI, action.data);

    yield put({
      type: QUESTION_CREATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: QUESTION_CREATE_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function questionDeleteAPI(data) {
  return axios.delete(`/api/question/delete/${data.questionId}`);
}

function* questionDelete(action) {
  try {
    const result = yield call(questionDeleteAPI, action.data);

    yield put({
      type: QUESTION_DELETE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: QUESTION_DELETE_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function questionUpdateAPI(data) {
  return axios.patch(`/api/question/update`, data);
}

function* questionUpdate(action) {
  try {
    const result = yield call(questionUpdateAPI, action.data);

    yield put({
      type: QUESTION_UPDATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: QUESTION_UPDATE_FAILURE,
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
// ******************************************************************************************************************

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function questionTypeGetAPI() {
  return axios.get(`/api/question/type/list`);
}

function* questionTypeGet() {
  try {
    const result = yield call(questionTypeGetAPI);

    yield put({
      type: QUESTION_TYPE_GET_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: QUESTION_TYPE_GET_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function questionTypeCreateAPI(data) {
  return axios.post(`/api/question/type/create`, data);
}

function* questionTypeCreate(action) {
  try {
    const result = yield call(questionTypeCreateAPI, action.data);

    yield put({
      type: QUESTION_TYPE_CREATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: QUESTION_TYPE_CREATE_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function questionTypeDeleteAPI(data) {
  return axios.delete(`/api/question/type/delete/${data.questionTypeId}`);
}

function* questionTypeDelete(action) {
  try {
    const result = yield call(questionTypeDeleteAPI, action.data);

    yield put({
      type: QUESTION_TYPE_DELETE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: QUESTION_TYPE_DELETE_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function questionTypeUpdateAPI(data) {
  return axios.patch(`/api/question/type/update`, data);
}

function* questionTypeUpdate(action) {
  try {
    const result = yield call(questionTypeUpdateAPI, action.data);

    yield put({
      type: QUESTION_TYPE_UPDATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: QUESTION_TYPE_UPDATE_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

//////////////////////////////////////////////////////////////

function* watchQuestionGet() {
  yield takeLatest(QUESTION_GET_REQUEST, questionGet);
}

function* watchQuestionCreate() {
  yield takeLatest(QUESTION_CREATE_REQUEST, questionCreate);
}

function* watchQuestionDelete() {
  yield takeLatest(QUESTION_DELETE_REQUEST, questionDelete);
}

function* watchQuestionUpdate() {
  yield takeLatest(QUESTION_UPDATE_REQUEST, questionUpdate);
}

// ****************************************************************

function* watchQuestionTypeGet() {
  yield takeLatest(QUESTION_TYPE_GET_REQUEST, questionTypeGet);
}

function* watchQuestionTypeCreate() {
  yield takeLatest(QUESTION_TYPE_CREATE_REQUEST, questionTypeCreate);
}

function* watchQuestionTypeDelete() {
  yield takeLatest(QUESTION_TYPE_DELETE_REQUEST, questionTypeDelete);
}

function* watchQuestionTypeUpdate() {
  yield takeLatest(QUESTION_TYPE_UPDATE_REQUEST, questionTypeUpdate);
}

//////////////////////////////////////////////////////////////
export default function* bannerSaga() {
  yield all([
    fork(watchQuestionGet),
    fork(watchQuestionCreate),
    fork(watchQuestionDelete),
    fork(watchQuestionUpdate),

    // ****************************************************************

    fork(watchQuestionTypeGet),
    fork(watchQuestionTypeCreate),
    fork(watchQuestionTypeDelete),
    fork(watchQuestionTypeUpdate),
    //
  ]);
}
