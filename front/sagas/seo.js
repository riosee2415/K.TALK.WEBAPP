import { all, call, fork, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import {
  SEO_LIST_REQUEST,
  SEO_LIST_SUCCESS,
  SEO_LIST_FAILURE,
  /////////////////////////
  SEO_TITLE_UPDATE_REQUEST,
  SEO_TITLE_UPDATE_SUCCESS,
  SEO_TITLE_UPDATE_FAILURE,
  /////////////////////////
  SEO_THUMBNAIL_UPDATE_REQUEST,
  SEO_THUMBNAIL_UPDATE_SUCCESS,
  SEO_THUMBNAIL_UPDATE_FAILURE,
  /////////////////////////
  SEO_THUMBNAIL_UPDATE2_REQUEST,
  SEO_THUMBNAIL_UPDATE2_SUCCESS,
  SEO_THUMBNAIL_UPDATE2_FAILURE,
  /////////////////////////
  SEO_KEYWORD_UPDATE_REQUEST,
  SEO_KEYWORD_UPDATE_SUCCESS,
  SEO_KEYWORD_UPDATE_FAILURE,
  /////////////////////////
  SEO_KEYWORD_DELETE_REQUEST,
  SEO_KEYWORD_DELETE_SUCCESS,
  SEO_KEYWORD_DELETE_FAILURE,
  /////////////////////////
  SEO_KEYWORD_CREATE_REQUEST,
  SEO_KEYWORD_CREATE_SUCCESS,
  SEO_KEYWORD_CREATE_FAILURE,
  /////////////////////////
  SEO_DESC_UPDATE_REQUEST,
  SEO_DESC_UPDATE_SUCCESS,
  SEO_DESC_UPDATE_FAILURE,
} from "../reducers/seo";

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function seoListAPI() {
  return axios.get(`/api/seo/list`);
}

function* seoList() {
  try {
    const result = yield call(seoListAPI);

    yield put({
      type: SEO_LIST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: SEO_LIST_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function seoTitleUpdateAPI(data) {
  return axios.patch(`/api/seo/update/title`, data);
}

function* seoTitleUpdate(action) {
  try {
    const result = yield call(seoTitleUpdateAPI, action.data);

    yield put({
      type: SEO_TITLE_UPDATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: SEO_TITLE_UPDATE_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function seoThumbnailUpdateAPI(data) {
  return axios.post(`/api/seo/image`, data);
}

function* seoThumbnailUpdate(action) {
  try {
    const result = yield call(seoThumbnailUpdateAPI, action.data);

    yield put({
      type: SEO_THUMBNAIL_UPDATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: SEO_THUMBNAIL_UPDATE_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function seoThumbnailUpdate2API(data) {
  return axios.patch(`/api/seo/update/thumbnail`, data);
}

function* seoThumbnailUpdate2(action) {
  try {
    const result = yield call(seoThumbnailUpdate2API, action.data);

    yield put({
      type: SEO_THUMBNAIL_UPDATE2_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: SEO_THUMBNAIL_UPDATE2_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function seoKeywordUpdateAPI(data) {
  return axios.patch(`/api/seo/update/keyword`, data);
}

function* seoKeywordUpdate(action) {
  try {
    const result = yield call(seoKeywordUpdateAPI, action.data);

    yield put({
      type: SEO_KEYWORD_UPDATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: SEO_KEYWORD_UPDATE_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function seoKeywordDeleteAPI(data) {
  return axios.delete(`/api/seo/delete/keyword/${data.id}`, data);
}

function* seoKeywordDelete(action) {
  try {
    const result = yield call(seoKeywordDeleteAPI, action.data);

    yield put({
      type: SEO_KEYWORD_DELETE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: SEO_KEYWORD_DELETE_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function seoKeywordCreateAPI(data) {
  return axios.post(`/api/seo/create/keyword`, data);
}

function* seoKeywordCreate(action) {
  try {
    const result = yield call(seoKeywordCreateAPI, action.data);

    yield put({
      type: SEO_KEYWORD_CREATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: SEO_KEYWORD_CREATE_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function seoDescUpdateAPI(data) {
  return axios.patch(`/api/seo/update/desc`, data);
}

function* seoDescUpdate(action) {
  try {
    const result = yield call(seoDescUpdateAPI, action.data);

    yield put({
      type: SEO_DESC_UPDATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: SEO_DESC_UPDATE_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

//////////////////////////////////////////////////////////////

function* watchSeoList() {
  yield takeLatest(SEO_LIST_REQUEST, seoList);
}
function* watchSeoTitleUpdate() {
  yield takeLatest(SEO_TITLE_UPDATE_REQUEST, seoTitleUpdate);
}

function* watchSeoThumbnailUpdate() {
  yield takeLatest(SEO_THUMBNAIL_UPDATE_REQUEST, seoThumbnailUpdate);
}

function* watchSeoThumbnailUpdate2() {
  yield takeLatest(SEO_THUMBNAIL_UPDATE2_REQUEST, seoThumbnailUpdate2);
}

function* watchSeoKeywordUpdate() {
  yield takeLatest(SEO_KEYWORD_UPDATE_REQUEST, seoKeywordUpdate);
}

function* watchSeoKeywordDelete() {
  yield takeLatest(SEO_KEYWORD_DELETE_REQUEST, seoKeywordDelete);
}

function* watchSeoKeywordCreate() {
  yield takeLatest(SEO_KEYWORD_CREATE_REQUEST, seoKeywordCreate);
}

function* watchSeoDescUpdate() {
  yield takeLatest(SEO_DESC_UPDATE_REQUEST, seoDescUpdate);
}

//////////////////////////////////////////////////////////////
export default function* userSaga() {
  yield all([
    fork(watchSeoList),
    fork(watchSeoTitleUpdate),
    fork(watchSeoThumbnailUpdate),
    fork(watchSeoThumbnailUpdate2),
    fork(watchSeoKeywordUpdate),
    fork(watchSeoKeywordDelete),
    fork(watchSeoKeywordCreate),
    fork(watchSeoDescUpdate),
    //
  ]);
}
