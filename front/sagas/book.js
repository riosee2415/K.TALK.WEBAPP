import { all, call, delay, fork, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import {
  BOOK_FOLDER_LIST_REQUEST,
  BOOK_FOLDER_LIST_SUCCESS,
  BOOK_FOLDER_LIST_FAILURE,
  /////////////////////////////////
  BOOK_FOLDER_CREATE_REQUEST,
  BOOK_FOLDER_CREATE_SUCCESS,
  BOOK_FOLDER_CREATE_FAILURE,
  /////////////////////////////////
  BOOK_FOLDER_UPDATE_REQUEST,
  BOOK_FOLDER_UPDATE_SUCCESS,
  BOOK_FOLDER_UPDATE_FAILURE,
  /////////////////////////////////
  BOOK_FOLDER_DELETE_REQUEST,
  BOOK_FOLDER_DELETE_SUCCESS,
  BOOK_FOLDER_DELETE_FAILURE,
  /////////////////////////////////
  BOOK_LIST_REQUEST,
  BOOK_LIST_SUCCESS,
  BOOK_LIST_FAILURE,
  /////////////////////////////////
  BOOK_DETAIL_REQUEST,
  BOOK_DETAIL_SUCCESS,
  BOOK_DETAIL_FAILURE,
  /////////////////////////////////
  BOOK_UPLOAD_REQUEST,
  BOOK_UPLOAD_SUCCESS,
  BOOK_UPLOAD_FAILURE,
  /////////////////////////////////
  BOOK_UPLOAD_TH_REQUEST,
  BOOK_UPLOAD_TH_SUCCESS,
  BOOK_UPLOAD_TH_FAILURE,
  /////////////////////////////////
  BOOK_CREATE_REQUEST,
  BOOK_CREATE_SUCCESS,
  BOOK_CREATE_FAILURE,
  /////////////////////////////////
  BOOK_UPDATE_REQUEST,
  BOOK_UPDATE_SUCCESS,
  BOOK_UPDATE_FAILURE,
  /////////////////////////////////
  BOOK_DELETE_REQUEST,
  BOOK_DELETE_SUCCESS,
  BOOK_DELETE_FAILURE,
  /////////////////////////////////
} from "../reducers/book";

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function bookFolderListAPI(data) {
  return axios.get(`/api/book/folder/list`, data);
}

function* bookFolderList(action) {
  try {
    const result = yield call(bookFolderListAPI, action.data);

    yield put({
      type: BOOK_FOLDER_LIST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: BOOK_FOLDER_LIST_FAILURE,
      error: err.response.data,
    });
  }
}

//////////////////////////////////////////////////////////////
function bookFolderCreateAPI(data) {
  return axios.post(`/api/book/folder/create`, data);
}

function* bookFolderCreate(action) {
  try {
    const result = yield call(bookFolderCreateAPI, action.data);

    yield put({
      type: BOOK_FOLDER_CREATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: BOOK_FOLDER_CREATE_FAILURE,
      error: err.response.data,
    });
  }
}

//////////////////////////////////////////////////////////////
function bookFolderUpdateAPI(data) {
  return axios.patch(`/api/book/folder/update`, data);
}

function* bookFolderUpdate(action) {
  try {
    const result = yield call(bookFolderUpdateAPI, action.data);

    yield put({
      type: BOOK_FOLDER_UPDATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: BOOK_FOLDER_UPDATE_FAILURE,
      error: err.response.data,
    });
  }
}

//////////////////////////////////////////////////////////////
function bookFolderDeleteAPI(data) {
  return axios.delete(`/api/book/folder/delete/${data.folderId}`, data);
}

function* bookFolderDelete(action) {
  try {
    const result = yield call(bookFolderDeleteAPI, action.data);

    yield put({
      type: BOOK_FOLDER_DELETE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: BOOK_FOLDER_DELETE_FAILURE,
      error: err.response.data,
    });
  }
}
//////////////////////////////////////////////////////////////
function bookListAPI(data) {
  return axios.post(`/api/book/list`, data);
}

function* bookList(action) {
  try {
    const result = yield call(bookListAPI, action.data);

    yield put({
      type: BOOK_LIST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: BOOK_LIST_FAILURE,
      error: err.response.data,
    });
  }
}

//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////
function bookDetailAPI(data) {
  return axios.post(`/api/book/detail/${data.id}`, data);
}

function* bookDetail(action) {
  try {
    const result = yield call(bookDetailAPI, action.data);

    yield put({
      type: BOOK_DETAIL_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: BOOK_DETAIL_FAILURE,
      error: err.response.data,
    });
  }
}

//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////
function bookUploadAPI(data) {
  return axios.post(`/api/book/image`, data);
}

function* bookUpload(action) {
  try {
    const result = yield call(bookUploadAPI, action.data);

    yield put({
      type: BOOK_UPLOAD_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: BOOK_UPLOAD_FAILURE,
      error: err.response.data,
    });
  }
}
//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////
function bookUploadThAPI(data) {
  return axios.post(`/api/book/image`, data);
}

function* bookUploadTh(action) {
  try {
    const result = yield call(bookUploadThAPI, action.data);

    yield put({
      type: BOOK_UPLOAD_TH_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: BOOK_UPLOAD_TH_FAILURE,
      error: err.response.data,
    });
  }
}

//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////
function bookCreateAPI(data) {
  return axios.post(`/api/book/create`, data);
}

function* bookCreate(action) {
  try {
    const result = yield call(bookCreateAPI, action.data);

    yield put({
      type: BOOK_CREATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: BOOK_CREATE_FAILURE,
      error: err.response.data,
    });
  }
}

//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////
function bookUpdateAPI(data) {
  return axios.post(`/api/book/update`, data);
}

function* bookUpdate(action) {
  try {
    const result = yield call(bookUpdateAPI, action.data);

    yield put({
      type: BOOK_UPDATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: BOOK_UPDATE_FAILURE,
      error: err.response.data,
    });
  }
}

//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////
function bookDeleteAPI(data) {
  return axios.post(`/api/book/delete/${data.bookId}`, data);
}

function* bookDelete(action) {
  try {
    const result = yield call(bookDeleteAPI, action.data);

    yield put({
      type: BOOK_DELETE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: BOOK_DELETE_FAILURE,
      error: err.response.data,
    });
  }
}

//////////////////////////////////////////////////////////////

function* watchBookFolderList() {
  yield takeLatest(BOOK_FOLDER_LIST_REQUEST, bookFolderList);
}
function* watchBookFolderCreate() {
  yield takeLatest(BOOK_FOLDER_CREATE_REQUEST, bookFolderCreate);
}
function* watchBookFolderUpdate() {
  yield takeLatest(BOOK_FOLDER_UPDATE_REQUEST, bookFolderUpdate);
}
function* watchBookFolderDelete() {
  yield takeLatest(BOOK_FOLDER_DELETE_REQUEST, bookFolderDelete);
}
function* watchBookList() {
  yield takeLatest(BOOK_LIST_REQUEST, bookList);
}
function* watchBookDetail() {
  yield takeLatest(BOOK_DETAIL_REQUEST, bookDetail);
}
function* watchBookUpload() {
  yield takeLatest(BOOK_UPLOAD_REQUEST, bookUpload);
}
function* watchBookUploadTh() {
  yield takeLatest(BOOK_UPLOAD_TH_REQUEST, bookUploadTh);
}
function* watchBookCreate() {
  yield takeLatest(BOOK_CREATE_REQUEST, bookCreate);
}
function* watchBookUpdate() {
  yield takeLatest(BOOK_UPDATE_REQUEST, bookUpdate);
}
function* watchBookDelete() {
  yield takeLatest(BOOK_DELETE_REQUEST, bookDelete);
}

//////////////////////////////////////////////////////////////
export default function* bookSaga() {
  yield all([
    fork(watchBookFolderList),
    fork(watchBookFolderCreate),
    fork(watchBookFolderUpdate),
    fork(watchBookFolderDelete),
    fork(watchBookList),
    fork(watchBookDetail),
    fork(watchBookUpload),
    fork(watchBookUploadTh),
    fork(watchBookCreate),
    fork(watchBookUpdate),
    fork(watchBookDelete),
    //
  ]);
}
