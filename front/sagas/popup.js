import { all, call, delay, fork, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import {
  POPUP_GET_REQUEST,
  POPUP_GET_SUCCESS,
  POPUP_GET_FAILURE,
  //
  POPUP_IMAGE_UPLOAD_REQUEST,
  POPUP_IMAGE_UPLOAD_SUCCESS,
  POPUP_IMAGE_UPLOAD_FAILURE,
  //
  POPUP_CREATE_REQUEST,
  POPUP_CREATE_SUCCESS,
  POPUP_CREATE_FAILURE,
  //
  POPUP_DELETE_REQUEST,
  POPUP_DELETE_SUCCESS,
  POPUP_DELETE_FAILURE,
  //
  POPUP_USE_UPDATE_REQUEST,
  POPUP_USE_UPDATE_SUCCESS,
  POPUP_USE_UPDATE_FAILURE,
  //
  POPUP_UPDATE_REQUEST,
  POPUP_UPDATE_SUCCESS,
  POPUP_UPDATE_FAILURE,
} from "../reducers/popup";

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function popupGetAPI() {
  return axios.get(`/api/popup/get`);
}

function* popupGet() {
  try {
    const result = yield call(popupGetAPI);

    yield put({
      type: POPUP_GET_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: POPUP_GET_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function popupImageUploadAPI(data) {
  return axios.post(`/api/popup/image`, data);
}

function* popupImageUpload(action) {
  try {
    const result = yield call(popupImageUploadAPI, action.data);

    yield put({
      type: POPUP_IMAGE_UPLOAD_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: POPUP_IMAGE_UPLOAD_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function popupCreateAPI(data) {
  return axios.post(`/api/popup/create`, data);
}

function* popupCreate(action) {
  try {
    const result = yield call(popupCreateAPI, action.data);

    yield put({
      type: POPUP_CREATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: POPUP_CREATE_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function popupDeleteAPI(data) {
  return axios.delete(`/api/popup/delete/${data.popupId}`);
}

function* popupDelete(action) {
  try {
    const result = yield call(popupDeleteAPI, action.data);

    yield put({
      type: POPUP_DELETE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: POPUP_DELETE_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function popupUseUpdateAPI(data) {
  return axios.post(`/api/popup/useUpdate`, data);
}

function* popupUseUpdate(action) {
  try {
    const result = yield call(popupUseUpdateAPI, action.data);

    yield put({
      type: POPUP_USE_UPDATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: POPUP_USE_UPDATE_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function popupUpdateAPI(data) {
  return axios.post(`/api/popup/update`, data);
}

function* popupUpdate(action) {
  try {
    const result = yield call(popupUpdateAPI, action.data);

    yield put({
      type: POPUP_UPDATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: POPUP_UPDATE_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

//////////////////////////////////////////////////////////////
function* watchPopupGet() {
  yield takeLatest(POPUP_GET_REQUEST, popupGet);
}

function* watchPopupImageUpload() {
  yield takeLatest(POPUP_IMAGE_UPLOAD_REQUEST, popupImageUpload);
}

function* watchPopupCreate() {
  yield takeLatest(POPUP_CREATE_REQUEST, popupCreate);
}

function* watchPopupDelete() {
  yield takeLatest(POPUP_DELETE_REQUEST, popupDelete);
}

function* watchPopupUseUpdate() {
  yield takeLatest(POPUP_USE_UPDATE_REQUEST, popupUseUpdate);
}

function* watchPopupUpdate() {
  yield takeLatest(POPUP_UPDATE_REQUEST, popupUpdate);
}

//////////////////////////////////////////////////////////////
export default function* bannerSaga() {
  yield all([
    fork(watchPopupGet),
    fork(watchPopupImageUpload),
    fork(watchPopupCreate),
    fork(watchPopupDelete),
    fork(watchPopupUseUpdate),
    fork(watchPopupUpdate),
    //
  ]);
}
