import { all, call, delay, fork, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import {
  MESSAGE_LIST_REQUEST,
  MESSAGE_LIST_SUCCESS,
  MESSAGE_LIST_FAILURE,

  /////////////////////////////////
  MESSAGE_DETAIL_REQUEST,
  MESSAGE_DETAIL_SUCCESS,
  MESSAGE_DETAIL_FAILURE,

  /////////////////////////////////
  MESSAGE_CREATE_REQUEST,
  MESSAGE_CREATE_SUCCESS,
  MESSAGE_CREATE_FAILURE,

  /////////////////////////////////
  MESSAGE_DELETE_REQUEST,
  MESSAGE_DELETE_SUCCESS,
  MESSAGE_DELETE_FAILURE,

  /////////////////////////////////
  MESSAGE_MANY_CREATE_REQUEST,
  MESSAGE_MANY_CREATE_SUCCESS,
  MESSAGE_MANY_CREATE_FAILURE,

  /////////////////////////////////
  MESSAGE_ALL_CREATE_REQUEST,
  MESSAGE_ALL_CREATE_SUCCESS,
  MESSAGE_ALL_CREATE_FAILURE,
} from "../reducers/message";

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function messageListAPI(data) {
  return axios.get(`/api/message/list`);
}

function* messageList(action) {
  try {
    const result = yield call(messageListAPI, action.data);

    yield put({
      type: MESSAGE_LIST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: MESSAGE_LIST_FAILURE,
      error: err.response.data,
    });
  }
}

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function messageDetailAPI(data) {
  return axios.get(`/api/message/detail/${data.messageId}`);
}

function* messageDetail(action) {
  try {
    const result = yield call(messageDetailAPI, action.data);

    yield put({
      type: MESSAGE_DETAIL_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: MESSAGE_DETAIL_FAILURE,
      error: err.response.data,
    });
  }
}

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function messageCreateAPI(data) {
  return axios.post(`/api/message/create`, data);
}

function* messageCreate(action) {
  try {
    const result = yield call(messageCreateAPI, action.data);

    yield put({
      type: MESSAGE_CREATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: MESSAGE_CREATE_FAILURE,
      error: err.response.data,
    });
  }
}

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function messageDeleteAPI(data) {
  return axios.delete(`/api/message/delete/${data.messageId}`, data);
}

function* messageDelete(action) {
  try {
    const result = yield call(messageDeleteAPI, action.data);

    yield put({
      type: MESSAGE_DELETE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: MESSAGE_DELETE_FAILURE,
      error: err.response.data,
    });
  }
}

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function messageManyCreateAPI(data) {
  return axios.post(`/api/message/many/create`, data);
}

function* messageManyCreate(action) {
  try {
    const result = yield call(messageManyCreateAPI, action.data);

    yield put({
      type: MESSAGE_MANY_CREATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: MESSAGE_MANY_CREATE_FAILURE,
      error: err.response.data,
    });
  }
}

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function messageAllCreateAPI(data) {
  return axios.post(`/api/message/all/create`, data);
}

function* messageAllCreate(action) {
  try {
    const result = yield call(messageAllCreateAPI, action.data);

    yield put({
      type: MESSAGE_ALL_CREATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: MESSAGE_ALL_CREATE_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

//////////////////////////////////////////////////////////////
function* watchMessageList() {
  yield takeLatest(MESSAGE_LIST_REQUEST, messageList);
}

function* watchMessageDetail() {
  yield takeLatest(MESSAGE_DETAIL_REQUEST, messageDetail);
}

function* watchMessageCreate() {
  yield takeLatest(MESSAGE_CREATE_REQUEST, messageCreate);
}

function* watchMessageDelete() {
  yield takeLatest(MESSAGE_DELETE_REQUEST, messageDelete);
}

function* watchMessageManyCreate() {
  yield takeLatest(MESSAGE_MANY_CREATE_REQUEST, messageManyCreate);
}

function* watchMessageAllCreate() {
  yield takeLatest(MESSAGE_ALL_CREATE_REQUEST, messageAllCreate);
}

//////////////////////////////////////////////////////////////
export default function* messagerSaga() {
  yield all([
    fork(watchMessageList),
    fork(watchMessageDetail),
    fork(watchMessageCreate),
    fork(watchMessageDelete),
    fork(watchMessageManyCreate),
    fork(watchMessageAllCreate),
    //
  ]);
}
