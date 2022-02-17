import { all, call, delay, fork, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import {
  GALLERY_LIST_REQUEST,
  GALLERY_LIST_SUCCESS,
  GALLERY_LIST_FAILURE,
  //
  GALLERY_UPLOAD_REQUEST,
  GALLERY_UPLOAD_SUCCESS,
  GALLERY_UPLOAD_FAILURE,
  //
  GALLERY_CREATE_REQUEST,
  GALLERY_CREATE_SUCCESS,
  GALLERY_CREATE_FAILURE,
  //
  GALLERY_UPDATE_REQUEST,
  GALLERY_UPDATE_SUCCESS,
  GALLERY_UPDATE_FAILURE,
  //
  GALLERY_DELETE_REQUEST,
  GALLERY_DELETE_SUCCESS,
  GALLERY_DELETE_FAILURE,
} from "../reducers/gallery";

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function galleryListAPI(data) {
  return axios.get(`/api/gallery/list/${data.qs}`, data);
}

function* galleryList(action) {
  try {
    const result = yield call(galleryListAPI, action.data);

    yield put({
      type: GALLERY_LIST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: GALLERY_LIST_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function galleryThumbnailAPI(data) {
  return axios.post(`/api/gallery/image`, data);
}

function* galleryThumbnail(action) {
  try {
    const result = yield call(galleryThumbnailAPI, action.data);

    yield put({
      type: GALLERY_UPLOAD_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: GALLERY_UPLOAD_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function galleryCreateAPI(data) {
  return axios.post(`/api/gallery/create`, data);
}

function* galleryCreate(action) {
  try {
    const result = yield call(galleryCreateAPI, action.data);

    yield put({
      type: GALLERY_CREATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: GALLERY_CREATE_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function galleryUpdateAPI(data) {
  return axios.patch(`/api/gallery/update`, data);
}

function* galleryUpdate(action) {
  try {
    const result = yield call(galleryUpdateAPI, action.data);

    yield put({
      type: GALLERY_UPDATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: GALLERY_UPDATE_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function galleryDeleteAPI(data) {
  return axios.delete(`/api/gallery/delete/${data.galleryId}`);
}

function* galleryDelete(action) {
  try {
    const result = yield call(galleryDeleteAPI, action.data);

    yield put({
      type: GALLERY_DELETE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: GALLERY_DELETE_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

//////////////////////////////////////////////////////////////
function* watchGalleryList() {
  yield takeLatest(GALLERY_LIST_REQUEST, galleryList);
}

function* watchGalleryUpload() {
  yield takeLatest(GALLERY_UPLOAD_REQUEST, galleryThumbnail);
}

function* watchGalleryCreate() {
  yield takeLatest(GALLERY_CREATE_REQUEST, galleryCreate);
}

function* watchGalleryUpdate() {
  yield takeLatest(GALLERY_UPDATE_REQUEST, galleryUpdate);
}

function* watchGalleryDelete() {
  yield takeLatest(GALLERY_DELETE_REQUEST, galleryDelete);
}

//////////////////////////////////////////////////////////////
export default function* gallerySaga() {
  yield all([
    fork(watchGalleryList),
    fork(watchGalleryUpload),
    fork(watchGalleryCreate),
    fork(watchGalleryUpdate),
    fork(watchGalleryDelete),
    //
  ]);
}
