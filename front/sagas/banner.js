import { all, call, delay, fork, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import {
  MAIN_BANNER_REQUEST,
  MAIN_BANNER_SUCCESS,
  MAIN_BANNER_FAILURE,
  /////////////////////////////
  BANNER_UPLOAD_REQUEST,
  BANNER_UPLOAD_SUCCESS,
  BANNER_UPLOAD_FAILURE,
  /////////////////////////////
  BANNER_UPDATE_REQUEST,
  BANNER_UPDATE_SUCCESS,
  BANNER_UPDATE_FAILURE,
  /////////////////////////////
  BANNER_CREATE_REQUEST,
  BANNER_CREATE_SUCCESS,
  BANNER_CREATE_FAILURE,
  /////////////////////////////
  BANNER_DELETE_REQUEST,
  BANNER_DELETE_SUCCESS,
  BANNER_DELETE_FAILURE,
} from "../reducers/banner";

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function mainBannerAPI() {
  return axios.get(`/api/banner/list`);
}

function* mainBanner() {
  try {
    const result = yield call(mainBannerAPI);

    yield put({
      type: MAIN_BANNER_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: MAIN_BANNER_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function bannerUploadAPI(data) {
  return axios.post(`/api/banner/image`, data);
}

function* bannerUpload(action) {
  try {
    const result = yield call(bannerUploadAPI, action.data);

    yield put({
      type: BANNER_UPLOAD_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: BANNER_UPLOAD_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function bannerUpdateAPI(data) {
  return axios.post(`/api/banner/update`, data);
}

function* bannerUpdate(action) {
  try {
    const result = yield call(bannerUpdateAPI, action.data);

    yield put({
      type: BANNER_UPDATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: BANNER_UPDATE_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function bannerCreateAPI(data) {
  return axios.post(`/api/banner/create`, data);
}

function* bannerCreate(action) {
  try {
    const result = yield call(bannerCreateAPI, action.data);

    yield put({
      type: BANNER_CREATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: BANNER_CREATE_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function bannerDeleteAPI(data) {
  return axios.delete(`/api/banner/delete/${data.id}`);
}

function* bannerDelete(action) {
  try {
    const result = yield call(bannerDeleteAPI, action.data);

    yield put({
      type: BANNER_DELETE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: BANNER_DELETE_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

//////////////////////////////////////////////////////////////
function* watchMainBanner() {
  yield takeLatest(MAIN_BANNER_REQUEST, mainBanner);
}

function* watchMainBannerUpdate() {
  yield takeLatest(BANNER_UPDATE_REQUEST, bannerUpdate);
}

// 베너 이미지만 업로드 하는 코드 (데이터베이스에는 접근하지 않습니다.)
function* watchBannerUpload() {
  yield takeLatest(BANNER_UPLOAD_REQUEST, bannerUpload);
}

function* watchBannerCreate() {
  yield takeLatest(BANNER_CREATE_REQUEST, bannerCreate);
}

function* watchBannerDelete() {
  yield takeLatest(BANNER_DELETE_REQUEST, bannerDelete);
}

//////////////////////////////////////////////////////////////
export default function* bannerSaga() {
  yield all([
    fork(watchMainBanner),
    fork(watchBannerUpload),
    fork(watchMainBannerUpdate),
    fork(watchBannerCreate),
    fork(watchBannerDelete),
    //
  ]);
}
