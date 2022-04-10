import { all, call, fork, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  /////////////////////////////
  LOGOUT_REQUEST,
  LOGOUT_SUCCESS,
  LOGOUT_FAILURE,
  /////////////////////////////
  LOGIN_ADMIN_REQUEST,
  LOGIN_ADMIN_SUCCESS,
  LOGIN_ADMIN_FAILURE,
  /////////////////////////////
  SIGNUP_REQUEST,
  SIGNUP_SUCCESS,
  SIGNUP_FAILURE,
  /////////////////////////////
  USERLIST_REQUEST,
  USERLIST_SUCCESS,
  USERLIST_FAILURE,
  /////////////////////////////
  USER_ALL_LIST_REQUEST,
  USER_ALL_LIST_SUCCESS,
  USER_ALL_LIST_FAILURE,
  /////////////////////////////
  USERLIST_UPDATE_REQUEST,
  USERLIST_UPDATE_SUCCESS,
  USERLIST_UPDATE_FAILURE,
  /////////////////////////////
  LOAD_MY_INFO_REQUEST,
  LOAD_MY_INFO_SUCCESS,
  LOAD_MY_INFO_FAILURE,
  /////////////////////////////
  KAKAO_LOGIN_REQUEST,
  KAKAO_LOGIN_SUCCESS,
  KAKAO_LOGIN_FAILURE,
  /////////////////////////////
  USER_CREATE_REQUEST,
  USER_CREATE_SUCCESS,
  USER_CREATE_FAILURE,
  /////////////////////////////
  USER_STU_CREATE_REQUEST,
  USER_STU_CREATE_SUCCESS,
  USER_STU_CREATE_FAILURE,
  /////////////////////////////
  USER_TEA_CREATE_REQUEST,
  USER_TEA_CREATE_SUCCESS,
  USER_TEA_CREATE_FAILURE,
  /////////////////////////////
  USER_UPDATE_REQUEST,
  USER_UPDATE_SUCCESS,
  USER_UPDATE_FAILURE,
  /////////////////////////////
  USER_PROFILE_UPLOAD_REQUEST,
  USER_PROFILE_UPLOAD_SUCCESS,
  USER_PROFILE_UPLOAD_FAILURE,
  /////////////////////////////
  USER_TEA_UPDATE_REQUEST,
  USER_TEA_UPDATE_SUCCESS,
  USER_TEA_UPDATE_FAILURE,
  USER_CLASS_CHANGE_SUCCESS,
  USER_CLASS_CHANGE_REQUEST,
  USER_CLASS_CHANGE_FAILURE,
  /////////////////////////////
  USER_TEACHER_LIST_REQUEST,
  USER_TEACHER_LIST_SUCCESS,
  USER_TEACHER_LIST_FAILURE,
  /////////////////////////////
  USER_FIND_EMAIL_BY_REQUEST,
  USER_FIND_EMAIL_BY_SUCCESS,
  USER_FIND_EMAIL_BY_FAILURE,
} from "../reducers/user";

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function loadMyInfoAPI(data) {
  return axios.get("/api/user/signin", data);
}

function* loadMyInfo(action) {
  try {
    const result = yield call(loadMyInfoAPI, action.data);
    yield put({
      type: LOAD_MY_INFO_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LOAD_MY_INFO_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// *****

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function signinPI(data) {
  return axios.post(`/api/user/signin`, data);
}

function* signin(action) {
  try {
    const result = yield call(signinPI, action.data);
    yield put({
      type: LOGIN_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LOGIN_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// *****

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function logoutPI(data) {
  return axios.get(`/api/user/logout`);
}

function* logout(action) {
  try {
    const result = yield call(logoutPI, action.data);
    yield put({
      type: LOGOUT_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LOGOUT_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function signinAdminPI(data) {
  return axios.post(`/api/user/signin/admin`, data);
}

function* signinAdmin(action) {
  try {
    const result = yield call(signinAdminPI, action.data);
    yield put({
      type: LOGIN_ADMIN_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LOGIN_ADMIN_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function signUpAPI(data) {
  return axios.post(`/api/user/signup`, data);
}

function* signUp(action) {
  try {
    const result = yield call(signUpAPI, action.data);
    yield put({
      type: SIGNUP_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: SIGNUP_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function userCreateAPI(data) {
  return axios.post(`/api/user/seq/create`, data);
}

function* userCreate(action) {
  try {
    const result = yield call(userCreateAPI, action.data);

    yield put({
      type: USER_CREATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: USER_CREATE_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function userListAPI(data) {
  return axios.get(
    `/api/user/list/${data.listType}?name=${data.name}&email=${data.email}`
  );
}

function* userList(action) {
  try {
    const result = yield call(userListAPI, action.data);
    yield put({
      type: USERLIST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: USERLIST_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function userAllListAPI(data) {
  return axios.get(
    `/api/user/allUsers/${data.type}?name=${
      data.name ? `${data.name}` : ``
    }&email=${data.email ? `${data.email}` : ``}`
  );
}
// 1 => 학생 리스트
// 2 => 강사 리스트
// 3 => 전체 리스트

function* userAllList(action) {
  try {
    const result = yield call(userAllListAPI, action.data);
    yield put({
      type: USER_ALL_LIST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: USER_ALL_LIST_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function userTeacherListAPI(data) {
  return axios.get(`/api/user/allUsers/2`);
}

function* userTeacherList(action) {
  try {
    const result = yield call(userTeacherListAPI, action.data);
    yield put({
      type: USER_TEACHER_LIST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: USER_TEACHER_LIST_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function userListUpdateAPI(data) {
  return axios.patch(`/api/user/level/update`, data);
}

function* userListUpdate(action) {
  try {
    const result = yield call(userListUpdateAPI, action.data);
    yield put({
      type: USERLIST_UPDATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: USERLIST_UPDATE_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function kakaoLoginAPI() {
  return axios.get(`/api/user/kakaoLogin`);
}

function* kakaoLogin() {
  try {
    const result = yield call(kakaoLoginAPI);

    yield put({
      type: KAKAO_LOGIN_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: KAKAO_LOGIN_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function stuCreateAPI(data) {
  return axios.post(`/api/user/student/create`, data);
}

function* stuCreate(action) {
  try {
    const result = yield call(stuCreateAPI, action.data);

    yield put({
      type: USER_STU_CREATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: USER_STU_CREATE_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function teaCreateAPI(data) {
  return axios.post(`/api/user/teacher/create`, data);
}

function* teaCreate(action) {
  try {
    const result = yield call(teaCreateAPI, action.data);

    yield put({
      type: USER_TEA_CREATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: USER_TEA_CREATE_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function meUpdateAPI(data) {
  return axios.post(`/api/user/me/update`, data);
}

function* meUpdate(action) {
  try {
    const result = yield call(meUpdateAPI, action.data);

    yield put({
      type: USER_UPDATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: USER_UPDATE_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function profileUploadAPI(data) {
  return axios.post(`/api/user/image`, data);
}

function* profileUpload(action) {
  try {
    const result = yield call(profileUploadAPI, action.data);

    yield put({
      type: USER_PROFILE_UPLOAD_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: USER_PROFILE_UPLOAD_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function teaUpdateAPI(data) {
  return axios.patch(`/api/user/teaMemo/update`, data);
}

function* teaUpdate(action) {
  try {
    const result = yield call(teaUpdateAPI, action.data);

    yield put({
      type: USER_TEA_UPDATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: USER_TEA_UPDATE_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function changeClassAPI(data) {
  return axios.patch(`/api/user/class/update`, data);
}

function* changeClass(action) {
  try {
    const result = yield call(changeClassAPI, action.data);

    yield put({
      type: USER_CLASS_CHANGE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: USER_CLASS_CHANGE_FAILURE,
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
function findEmailByAPI(data) {
  return axios.post(`/api/user/findUserByEmail`, data);
}

function* findEmailBy(action) {
  try {
    const result = yield call(findEmailByAPI, action.data);

    yield put({
      type: USER_FIND_EMAIL_BY_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: USER_FIND_EMAIL_BY_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

//////////////////////////////////////////////////////////////

function* watchLoadMyInfo() {
  yield takeLatest(LOAD_MY_INFO_REQUEST, loadMyInfo);
}

function* watchSignin() {
  yield takeLatest(LOGIN_REQUEST, signin);
}

function* watchLogout() {
  yield takeLatest(LOGOUT_REQUEST, logout);
}

function* watchSigninAdmin() {
  yield takeLatest(LOGIN_ADMIN_REQUEST, signinAdmin);
}

function* watchSignUp() {
  yield takeLatest(SIGNUP_REQUEST, signUp);
}

function* watchUserCreate() {
  yield takeLatest(USER_CREATE_REQUEST, userCreate);
}

function* watchUserList() {
  yield takeLatest(USERLIST_REQUEST, userList);
}

function* watchAllUserList() {
  yield takeLatest(USER_ALL_LIST_REQUEST, userAllList);
}

function* watchUserListUpdate() {
  yield takeLatest(USERLIST_UPDATE_REQUEST, userListUpdate);
}

function* watchKakaoLogin() {
  yield takeLatest(KAKAO_LOGIN_REQUEST, kakaoLogin);
}

function* watchStuCreate() {
  yield takeLatest(USER_STU_CREATE_REQUEST, stuCreate);
}

function* watchTeaCreate() {
  yield takeLatest(USER_TEA_CREATE_REQUEST, teaCreate);
}

function* watchMeUpdate() {
  yield takeLatest(USER_UPDATE_REQUEST, meUpdate);
}

function* watchProfileUpload() {
  yield takeLatest(USER_PROFILE_UPLOAD_REQUEST, profileUpload);
}

function* watchTeaUpdate() {
  yield takeLatest(USER_TEA_UPDATE_REQUEST, teaUpdate);
}

function* watchClassChange() {
  yield takeLatest(USER_CLASS_CHANGE_REQUEST, changeClass);
}

function* watchTeacherList() {
  yield takeLatest(USER_TEACHER_LIST_REQUEST, userTeacherList);
}

function* watchFindEmailBy() {
  yield takeLatest(USER_FIND_EMAIL_BY_REQUEST, findEmailBy);
}

//////////////////////////////////////////////////////////////
export default function* userSaga() {
  yield all([
    fork(watchLoadMyInfo),
    fork(watchSignin),
    fork(watchLogout),
    fork(watchSigninAdmin),
    fork(watchSignUp),
    fork(watchUserCreate),
    fork(watchUserList),
    fork(watchAllUserList),
    fork(watchUserListUpdate),
    fork(watchKakaoLogin),
    fork(watchStuCreate),
    fork(watchTeaCreate),
    fork(watchMeUpdate),
    fork(watchProfileUpload),
    fork(watchTeaUpdate),
    fork(watchClassChange),
    fork(watchTeacherList),
    fork(watchFindEmailBy),
    //
  ]);
}
