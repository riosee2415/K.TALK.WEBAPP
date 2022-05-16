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
  //////////////////////////////////////////////////////////
  PARTICIPANT_USER_DELETE_LIST_REQUEST,
  PARTICIPANT_USER_DELETE_LIST_SUCCESS,
  PARTICIPANT_USER_DELETE_LIST_FAILURE,
  //////////////////////////////////////////////////////////
  PARTICIPANT_USER_MOVE_LIST_REQUEST,
  PARTICIPANT_USER_MOVE_LIST_SUCCESS,
  PARTICIPANT_USER_MOVE_LIST_FAILURE,
  //////////////////////////////////////////////////////////
  PARTICIPANT_USER_LIMIT_LIST_REQUEST,
  PARTICIPANT_USER_LIMIT_LIST_SUCCESS,
  PARTICIPANT_USER_LIMIT_LIST_FAILURE,
  //////////////////////////////////////////////////////////
  PARTICIPANT_USER_CURRENT_LIST_REQUEST,
  PARTICIPANT_USER_CURRENT_LIST_SUCCESS,
  PARTICIPANT_USER_CURRENT_LIST_FAILURE,
  //////////////////////////////////////////////////////////
  PARTICIPANT_LASTDATE_LIST_REQUEST,
  PARTICIPANT_LASTDATE_LIST_SUCCESS,
  PARTICIPANT_LASTDATE_LIST_FAILURE,
  //////////////////////////////////////////////////////////
  TEACHER_PARTICIPANT_LIST_REQUEST,
  TEACHER_PARTICIPANT_LIST_SUCCESS,
  TEACHER_PARTICIPANT_LIST_FAILURE,
  //////////////////////////////////////////////////////////
  PARTICIPANT_UPDATE_REQUEST,
  PARTICIPANT_UPDATE_SUCCESS,
  PARTICIPANT_UPDATE_FAILURE,
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
  return axios.post(`/api/part/lecture/list`, data);
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

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function participantUserDeleteListAPI(data) {
  return axios.post(`/api/part/user/delete/list`, data);
}

function* participantUserDeleteList(action) {
  try {
    const result = yield call(participantUserDeleteListAPI, action.data);

    yield put({
      type: PARTICIPANT_USER_DELETE_LIST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: PARTICIPANT_USER_DELETE_LIST_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function participantUserMoveListAPI(data) {
  return axios.post(`/api/part/user/delete/list`, data);
}

function* participantUserMoveList(action) {
  try {
    const result = yield call(participantUserMoveListAPI, action.data);

    yield put({
      type: PARTICIPANT_USER_MOVE_LIST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: PARTICIPANT_USER_MOVE_LIST_FAILURE,
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
function participantUserLimitListAPI(data) {
  return axios.post(`/api/part/user/limit/list`, data);
}

function* participantUserLimitList(action) {
  try {
    const result = yield call(participantUserLimitListAPI, action.data);

    yield put({
      type: PARTICIPANT_USER_LIMIT_LIST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: PARTICIPANT_USER_LIMIT_LIST_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function participantUserCurrentListAPI(data) {
  return axios.post(`/api/part/user/delete/list`, data);
}

function* participantUserCurrentList(action) {
  try {
    const result = yield call(participantUserCurrentListAPI, action.data);

    yield put({
      type: PARTICIPANT_USER_CURRENT_LIST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: PARTICIPANT_USER_CURRENT_LIST_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function participantUserLastDateListAPI(data) {
  return axios.post(`/api/part/lastDate/list`, data);
}

function* participantUserLastDateList(action) {
  try {
    const result = yield call(participantUserLastDateListAPI, action.data);

    yield put({
      type: PARTICIPANT_LASTDATE_LIST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: PARTICIPANT_LASTDATE_LIST_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function teacherParticipantListAPI(data) {
  return axios.post(`/api/teahcer/list`, data);
}

function* teacherParticipantList(action) {
  try {
    const result = yield call(teacherParticipantListAPI, action.data);

    yield put({
      type: TEACHER_PARTICIPANT_LIST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: TEACHER_PARTICIPANT_LIST_FAILURE,
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
function participantUpdateAPI(data) {
  return axios.patch(`/api/part/update`, data);
}

function* participantUpdate(action) {
  try {
    const result = yield call(participantUpdateAPI, action.data);

    yield put({
      type: PARTICIPANT_UPDATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: PARTICIPANT_UPDATE_FAILURE,
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

function* watchParticipantUserDeleteList() {
  yield takeLatest(
    PARTICIPANT_USER_DELETE_LIST_REQUEST,
    participantUserDeleteList
  );
}

function* watchParticipantUserMoveList() {
  yield takeLatest(PARTICIPANT_USER_MOVE_LIST_REQUEST, participantUserMoveList);
}

function* watchParticipantUserLimitList() {
  yield takeLatest(
    PARTICIPANT_USER_LIMIT_LIST_REQUEST,
    participantUserLimitList
  );
}

function* watchParticipantUserLastDateList() {
  yield takeLatest(
    PARTICIPANT_LASTDATE_LIST_REQUEST,
    participantUserLastDateList
  );
}
function* watchParticipantTeacherList() {
  yield takeLatest(TEACHER_PARTICIPANT_LIST_REQUEST, teacherParticipantList);
}

function* watchParticipantUserCurrentList() {
  yield takeLatest(
    PARTICIPANT_USER_CURRENT_LIST_REQUEST,
    participantUserCurrentList
  );
}
function* watchParticipantUpdate() {
  yield takeLatest(PARTICIPANT_UPDATE_REQUEST, participantUpdate);
}

//////////////////////////////////////////////////////////////
export default function* participantSaga() {
  yield all([
    fork(watchParticipantList),
    fork(watchParticipantLectureList),
    fork(watchParticipantAdminList),
    fork(watchParticipantCreate),
    fork(watchParticipantDelete),
    fork(watchParticipantUserDeleteList),
    fork(watchParticipantUserMoveList),
    fork(watchParticipantUserLimitList),
    fork(watchParticipantUserCurrentList),
    fork(watchParticipantUserLastDateList),
    fork(watchParticipantTeacherList),
    fork(watchParticipantUpdate),

    //
  ]);
}
