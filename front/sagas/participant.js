import { all, call, delay, fork, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import {
  PARTICIPANT_LIST_REQUEST,
  PARTICIPANT_LIST_SUCCESS,
  PARTICIPANT_LIST_FAILURE,
  //////////////////////////////////////////////////////////
  PARTICIPANT_LECTURE_LIST_REQUEST,
  PARTICIPANT_LECTURE_LIST_SUCCESS,
  PARTICIPANT_LECTURE_LIST_FAILURE,
  //////////////////////////////////////////////////////////
  PARTICIPANT_ADMIN_LIST_REQUEST,
  PARTICIPANT_ADMIN_LIST_SUCCESS,
  PARTICIPANT_ADMIN_LIST_FAILURE,
  //////////////////////////////////////////////////////////
  PARTICIPANT_CREATE_REQUEST,
  PARTICIPANT_CREATE_SUCCESS,
  PARTICIPANT_CREATE_FAILURE,
  //////////////////////////////////////////////////////////
  PARTICIPANT_DELETE_REQUEST,
  PARTICIPANT_DELETE_SUCCESS,
  PARTICIPANT_DELETE_FAILURE,
} from "../reducers/participant";

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function participantListAPI(data) {
  return axios.get(`/api/part/list?page=${data.page}`);
}

function* participantList(action) {
  try {
    const result = yield call(participantListAPI, action.data);

    yield put({
      type: PARTICIPANT_LIST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: PARTICIPANT_LIST_FAILURE,
      error: err.response.data,
    });
  }
}

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function participantLectureListAPI(data) {
  return axios.post(`/api/part/leture/list`, data);
}

function* participantLectureList(action) {
  try {
    const result = yield call(participantLectureListAPI, action.data);

    yield put({
      type: PARTICIPANT_LECTURE_LIST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: PARTICIPANT_LECTURE_LIST_FAILURE,
      error: err.response.data,
    });
  }
}

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function participantAdminListAPI(data) {
  return axios.post(`/api/part/admin/list`, data);
}

function* participantAdminList(action) {
  try {
    const result = yield call(participantAdminListAPI, action.data);

    yield put({
      type: PARTICIPANT_ADMIN_LIST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: PARTICIPANT_ADMIN_LIST_FAILURE,
      error: err.response.data,
    });
  }
}

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function participantCreateAPI(data) {
  return axios.post(`/api/part/create`, data);
}

function* participantCreate(action) {
  try {
    const result = yield call(participantCreateAPI, action.data);

    yield put({
      type: PARTICIPANT_CREATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: PARTICIPANT_CREATE_FAILURE,
      error: err.response.data,
    });
  }
}

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function participantDeleteAPI(data) {
  return axios.post(`/api/part/delete`, data);
}

function* participantDelete(action) {
  try {
    const result = yield call(participantDeleteAPI, action.data);

    yield put({
      type: PARTICIPANT_DELETE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: PARTICIPANT_DELETE_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

//////////////////////////////////////////////////////////////

function* watchParticipantList() {
  yield takeLatest(PARTICIPANT_LIST_REQUEST, participantList);
}

function* watchParticipantLectureList() {
  yield takeLatest(PARTICIPANT_LECTURE_LIST_REQUEST, participantLectureList);
}

function* watchParticipantAdminList() {
  yield takeLatest(PARTICIPANT_ADMIN_LIST_REQUEST, participantAdminList);
}

function* watchParticipantCreate() {
  yield takeLatest(PARTICIPANT_CREATE_REQUEST, participantCreate);
}

function* watchParticipantDelete() {
  yield takeLatest(PARTICIPANT_DELETE_REQUEST, participantDelete);
}

//////////////////////////////////////////////////////////////
export default function* participantSaga() {
  yield all([
    fork(watchParticipantList),
    fork(watchParticipantLectureList),
    fork(watchParticipantAdminList),
    fork(watchParticipantCreate),
    fork(watchParticipantDelete),
    //
  ]);
}
