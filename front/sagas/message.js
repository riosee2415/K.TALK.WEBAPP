import { all, call, delay, fork, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import {
  MESSAGE_USER_LIST_REQUEST,
  MESSAGE_USER_LIST_SUCCESS,
  MESSAGE_USER_LIST_FAILURE,

  /////////////////////////////////
  MESSAGE_ADMIN_LIST_REQUEST,
  MESSAGE_ADMIN_LIST_SUCCESS,
  MESSAGE_ADMIN_LIST_FAILURE,
  /////////////////////////////////
  MESSAGE_DETAIL_REQUEST,
  MESSAGE_DETAIL_SUCCESS,
  MESSAGE_DETAIL_FAILURE,

  /////////////////////////////////
  MESSAGE_TEACHER_LIST_REQUEST,
  MESSAGE_TEACHER_LIST_SUCCESS,
  MESSAGE_TEACHER_LIST_FAILURE,

  /////////////////////////////////////
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

  //////////////////////////////////
  MESSAGE_LECTURE_CREATE_REQUEST,
  MESSAGE_LECTURE_CREATE_SUCCESS,
  MESSAGE_LECTURE_CREATE_FAILURE,

  //////////////////////////////////
  MESSAGE_FOR_ADMIN_CREATE_REQUEST,
  MESSAGE_FOR_ADMIN_CREATE_SUCCESS,
  MESSAGE_FOR_ADMIN_CREATE_FAILURE,
  /////////////////////////////////
  MESSAGE_LECTURE_LIST_REQUEST,
  MESSAGE_LECTURE_LIST_SUCCESS,
  MESSAGE_LECTURE_LIST_FAILURE,
} from "../reducers/message";

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function messageUserListAPI(data) {
  return axios.get(`/api/message/user/list?page=${data.page}`);
}

function* messageUserList(action) {
  try {
    const result = yield call(messageUserListAPI, action.data);

    yield put({
      type: MESSAGE_USER_LIST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: MESSAGE_USER_LIST_FAILURE,
      error: err.response.data,
    });
  }
}

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function messageAdminListAPI(data) {
  return axios.post(`/api/message/admin/list`, data);
}

function* messageAdminList(action) {
  try {
    const result = yield call(messageAdminListAPI, action.data);

    yield put({
      type: MESSAGE_ADMIN_LIST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: MESSAGE_ADMIN_LIST_FAILURE,
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
function messageTearcherListAPI(data) {
  return axios.get(`/api/message/teacherList`);
}

function* messageTearcherList(action) {
  try {
    const result = yield call(messageTearcherListAPI, action.data);

    yield put({
      type: MESSAGE_TEACHER_LIST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: MESSAGE_TEACHER_LIST_FAILURE,
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

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function messageLectureCreateAPI(data) {
  return axios.post(`/api/message/lecture/create`, data);
}

function* messageLectureCreate(action) {
  try {
    const result = yield call(messageLectureCreateAPI, action.data);

    yield put({
      type: MESSAGE_LECTURE_CREATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: MESSAGE_LECTURE_CREATE_FAILURE,
      error: err.response.data,
    });
  }
}

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function messageForAdminCreateAPI(data) {
  return axios.post(`/api/message/forAdminCreate`, data);
}

function* messageForAdminCreate(action) {
  try {
    const result = yield call(messageForAdminCreateAPI, action.data);

    yield put({
      type: MESSAGE_FOR_ADMIN_CREATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: MESSAGE_FOR_ADMIN_CREATE_FAILURE,
      error: err.response.data,
    });
  }
}

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function messageLectureListAPI(data) {
  return axios.post(`/api/message/lecture/list`, data);
}

function* messageLectureList(action) {
  try {
    const result = yield call(messageLectureListAPI, action.data);

    yield put({
      type: MESSAGE_LECTURE_LIST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: MESSAGE_LECTURE_LIST_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

//////////////////////////////////////////////////////////////
function* watchMessageUserList() {
  yield takeLatest(MESSAGE_USER_LIST_REQUEST, messageUserList);
}

function* watchMessageAdminList() {
  yield takeLatest(MESSAGE_ADMIN_LIST_REQUEST, messageAdminList);
}

function* watchMessageDetail() {
  yield takeLatest(MESSAGE_DETAIL_REQUEST, messageDetail);
}

function* watchMessageTearcherList() {
  yield takeLatest(MESSAGE_TEACHER_LIST_REQUEST, messageTearcherList);
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

function* watchMessageLectureCreate() {
  yield takeLatest(MESSAGE_LECTURE_CREATE_REQUEST, messageLectureCreate);
}

function* watchMessageForAdminCreate() {
  yield takeLatest(MESSAGE_FOR_ADMIN_CREATE_REQUEST, messageForAdminCreate);
}

function* watchMessageLectureList() {
  yield takeLatest(MESSAGE_LECTURE_LIST_REQUEST, messageLectureList);
}

//////////////////////////////////////////////////////////////
export default function* messagerSaga() {
  yield all([
    fork(watchMessageUserList),
    fork(watchMessageAdminList),
    fork(watchMessageDetail),
    fork(watchMessageTearcherList),
    fork(watchMessageCreate),
    fork(watchMessageDelete),
    fork(watchMessageManyCreate),
    fork(watchMessageAllCreate),
    fork(watchMessageLectureCreate),
    fork(watchMessageForAdminCreate),
    fork(watchMessageLectureList),
    //
  ]);
}
