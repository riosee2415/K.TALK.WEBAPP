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
  //
  LECTURE_TEACHER_LIST_REQUEST,
  LECTURE_TEACHER_LIST_SUCCESS,
  LECTURE_TEACHER_LIST_FAILURE,
  //
  LECTURE_STUDENT_LIST_REQUEST,
  LECTURE_STUDENT_LIST_SUCCESS,
  LECTURE_STUDENT_LIST_FAILURE,
  //
  LECTURE_ALL_LIST_REQUEST,
  LECTURE_ALL_LIST_SUCCESS,
  LECTURE_ALL_LIST_FAILURE,
  //
  LECTURE_DETAIL_REQUEST,
  LECTURE_DETAIL_SUCCESS,
  LECTURE_DETAIL_FAILURE,
  //
  LECTURE_DIARY_LIST_REQUEST,
  LECTURE_DIARY_LIST_SUCCESS,
  LECTURE_DIARY_LIST_FAILURE,
  //
  LECTURE_DIARY_ADMIN_LIST_REQUEST,
  LECTURE_DIARY_ADMIN_LIST_SUCCESS,
  LECTURE_DIARY_ADMIN_LIST_FAILURE,
  //
  LECTURE_DIARY_CREATE_REQUEST,
  LECTURE_DIARY_CREATE_SUCCESS,
  LECTURE_DIARY_CREATE_FAILURE,
  //
  LECTURE_HOMEWORK_LIST_REQUEST,
  LECTURE_HOMEWORK_LIST_SUCCESS,
  LECTURE_HOMEWORK_LIST_FAILURE,
  //
  LECTURE_HOMEWORK_CREATE_REQUEST,
  LECTURE_HOMEWORK_CREATE_SUCCESS,
  LECTURE_HOMEWORK_CREATE_FAILURE,
  //
  LECTURE_FILE_REQUEST,
  LECTURE_FILE_SUCCESS,
  LECTURE_FILE_FAILURE,
  //
  LECTURE_SUBMIT_LIST_REQUEST,
  LECTURE_SUBMIT_LIST_SUCCESS,
  LECTURE_SUBMIT_LIST_FAILURE,
  //
  LECTURE_SUBMIT_CREATE_REQUEST,
  LECTURE_SUBMIT_CREATE_SUCCESS,
  LECTURE_SUBMIT_CREATE_FAILURE,
} from "../reducers/lecture";

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function lectureListAPI(data) {
  return axios.get(`/api/lecture/list/${data.sort}`, data);
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
function lectureAllListAPI(data) {
  return axios.get(`/api/lecture/allLectures/${data.listType}`, data);
}

function* lectureAllList(action) {
  try {
    const result = yield call(lectureAllListAPI, action.data);

    yield put({
      type: LECTURE_ALL_LIST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LECTURE_ALL_LIST_FAILURE,
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

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function lectureTeacherListAPI(data) {
  return axios.get(`/api/lecture/teacher/list/${data.TeacherId}`);
}

function* lectureTeacherList(action) {
  try {
    const result = yield call(lectureTeacherListAPI, action.data);

    yield put({
      type: LECTURE_TEACHER_LIST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LECTURE_TEACHER_LIST_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function lectureStudentListAPI(data) {
  return axios.post(`/api/lecture/student/list`, data);
}

function* lectureStudentList(action) {
  try {
    const result = yield call(lectureStudentListAPI, action.data);

    yield put({
      type: LECTURE_STUDENT_LIST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LECTURE_STUDENT_LIST_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function lectureDetailAPI(data) {
  return axios.get(`/api/lecture/detail/${data.LectureId}`);
}

function* lectureDetail(action) {
  try {
    const result = yield call(lectureDetailAPI, action.data);

    yield put({
      type: LECTURE_DETAIL_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LECTURE_DETAIL_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function lectureDiaryListAPI(data) {
  return axios.post(`/api/lecture/diary/list`, data);
}

function* lectureDiaryList(action) {
  try {
    const result = yield call(lectureDiaryListAPI, action.data);

    yield put({
      type: LECTURE_DIARY_LIST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LECTURE_DIARY_LIST_FAILURE,
      error: err.response.data,
    });
  }
}

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function lectureDiaryAdminListAPI(data) {
  return axios.post(`/api/lecture/diary/admin/list`, data);
}

function* lectureDiaryAdminList(action) {
  try {
    const result = yield call(lectureDiaryAdminListAPI, action.data);

    yield put({
      type: LECTURE_DIARY_ADMIN_LIST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LECTURE_DIARY_ADMIN_LIST_FAILURE,
      error: err.response.data,
    });
  }
}

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function lectureDiaryCreateAPI(data) {
  return axios.post(`/api/lecture/diary/create`, data);
}

function* lectureDiaryCreate(action) {
  try {
    const result = yield call(lectureDiaryCreateAPI, action.data);

    yield put({
      type: LECTURE_DIARY_CREATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LECTURE_DIARY_CREATE_FAILURE,
      error: err.response.data,
    });
  }
}

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function lectureHomeWorkListAPI(data) {
  return axios.post(`/api/lecture/homework/list`, data);
}

function* lectureHomeWorkList(action) {
  try {
    const result = yield call(lectureHomeWorkListAPI, action.data);

    yield put({
      type: LECTURE_HOMEWORK_LIST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LECTURE_HOMEWORK_LIST_FAILURE,
      error: err.response.data,
    });
  }
}

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function lectureHomeWorkCreateAPI(data) {
  return axios.post(`/api/lecture/homework/create`, data);
}

function* lectureHomeWorkCreate(action) {
  try {
    const result = yield call(lectureHomeWorkCreateAPI, action.data);

    yield put({
      type: LECTURE_HOMEWORK_CREATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LECTURE_HOMEWORK_CREATE_FAILURE,
      error: err.response.data,
    });
  }
}

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function lectureHomeWorkFileAPI(data) {
  return axios.post(`/api/lecture/file`, data);
}

function* lectureHomeWorkFile(action) {
  try {
    const result = yield call(lectureHomeWorkFileAPI, action.data);

    yield put({
      type: LECTURE_FILE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LECTURE_FILE_FAILURE,
      error: err.response.data,
    });
  }
}

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function lectureSubmitListAPI(data) {
  return axios.post(`/api/lecture/submit/list`, data);
}

function* lectureSubmitList(action) {
  try {
    const result = yield call(lectureSubmitListAPI, action.data);

    yield put({
      type: LECTURE_SUBMIT_LIST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LECTURE_SUBMIT_LIST_FAILURE,
      error: err.response.data,
    });
  }
}

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function lectureSubmitCreateAPI(data) {
  return axios.post(`/api/lecture/submit/create`, data);
}

function* lectureSubmitCreate(action) {
  try {
    const result = yield call(lectureSubmitCreateAPI, action.data);

    yield put({
      type: LECTURE_SUBMIT_CREATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LECTURE_SUBMIT_CREATE_FAILURE,
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

function* watchLectureAllList() {
  yield takeLatest(LECTURE_ALL_LIST_REQUEST, lectureAllList);
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

function* watchLectureTeacherList() {
  yield takeLatest(LECTURE_TEACHER_LIST_REQUEST, lectureTeacherList);
}

function* watchLectureStudentList() {
  yield takeLatest(LECTURE_STUDENT_LIST_REQUEST, lectureStudentList);
}

function* watchLectureDetail() {
  yield takeLatest(LECTURE_DETAIL_REQUEST, lectureDetail);
}

function* watchLectureDiaryList() {
  yield takeLatest(LECTURE_DIARY_LIST_REQUEST, lectureDiaryList);
}

function* watchLectureDiaryAdminList() {
  yield takeLatest(LECTURE_DIARY_ADMIN_LIST_REQUEST, lectureDiaryAdminList);
}

function* watchLectureDiaryCreate() {
  yield takeLatest(LECTURE_DIARY_CREATE_REQUEST, lectureDiaryCreate);
}

function* watchLectureHomeWorkList() {
  yield takeLatest(LECTURE_HOMEWORK_LIST_REQUEST, lectureHomeWorkList);
}

function* watchLectureHomeWorkCreate() {
  yield takeLatest(LECTURE_HOMEWORK_CREATE_REQUEST, lectureHomeWorkCreate);
}

function* watchLectureHomeWorkFile() {
  yield takeLatest(LECTURE_FILE_REQUEST, lectureHomeWorkFile);
}

function* watchLectureSubmitList() {
  yield takeLatest(LECTURE_SUBMIT_LIST_REQUEST, lectureSubmitList);
}

function* watchLectureSubmitCreate() {
  yield takeLatest(LECTURE_SUBMIT_CREATE_REQUEST, lectureSubmitCreate);
}

//////////////////////////////////////////////////////////////
export default function* lectureSaga() {
  yield all([
    fork(watchLectureList),
    fork(watchLectureAllList),
    fork(watchLectureCreate),
    fork(watchLectureUpdate),
    fork(watchLectureDelete),
    fork(watchLectureTeacherList),
    fork(watchLectureStudentList),
    fork(watchLectureDetail),
    fork(watchLectureDiaryList),
    fork(watchLectureDiaryAdminList),
    fork(watchLectureDiaryCreate),
    fork(watchLectureHomeWorkList),
    fork(watchLectureHomeWorkCreate),
    fork(watchLectureHomeWorkFile),
    fork(watchLectureSubmitList),
    fork(watchLectureSubmitCreate),
    //
  ]);
}
