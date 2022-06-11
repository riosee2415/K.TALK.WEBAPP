import { all, call, delay, fork, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import {
  COMMUNITY_UPLOAD_REQUEST,
  COMMUNITY_UPLOAD_SUCCESS,
  COMMUNITY_UPLOAD_FAILURE,
  //
  ////// TYPE //////
  //
  COMMUNITY_TYPE_LIST_REQUEST,
  COMMUNITY_TYPE_LIST_SUCCESS,
  COMMUNITY_TYPE_LIST_FAILURE,
  //
  COMMUNITY_TYPE_CREATE_REQUEST,
  COMMUNITY_TYPE_CREATE_SUCCESS,
  COMMUNITY_TYPE_CREATE_FAILURE,
  //
  COMMUNITY_TYPE_UPDATE_REQUEST,
  COMMUNITY_TYPE_UPDATE_SUCCESS,
  COMMUNITY_TYPE_UPDATE_FAILURE,
  //
  COMMUNITY_TYPE_DELETE_REQUEST,
  COMMUNITY_TYPE_DELETE_SUCCESS,
  COMMUNITY_TYPE_DELETE_FAILURE,
  //
  ////// COMMUNITY //////
  //
  COMMUNITY_LIST_REQUEST,
  COMMUNITY_LIST_SUCCESS,
  COMMUNITY_LIST_FAILURE,
  //
  COMMUNITY_DETAIL_REQUEST,
  COMMUNITY_DETAIL_SUCCESS,
  COMMUNITY_DETAIL_FAILURE,
  //
  COMMUNITY_CREATE_REQUEST,
  COMMUNITY_CREATE_SUCCESS,
  COMMUNITY_CREATE_FAILURE,
  //
  COMMUNITY_UPDATE_REQUEST,
  COMMUNITY_UPDATE_SUCCESS,
  COMMUNITY_UPDATE_FAILURE,
  //
  COMMUNITY_DELETE_REQUEST,
  COMMUNITY_DELETE_SUCCESS,
  COMMUNITY_DELETE_FAILURE,
  //
  ////// COMMENT //////
  //
  COMMUNITY_COMMENT_DETAIL_REQUEST,
  COMMUNITY_COMMENT_DETAIL_SUCCESS,
  COMMUNITY_COMMENT_DETAIL_FAILURE,
  //
  COMMUNITY_COMMENT_CREATE_REQUEST,
  COMMUNITY_COMMENT_CREATE_SUCCESS,
  COMMUNITY_COMMENT_CREATE_FAILURE,
  //
  COMMUNITY_COMMENT_UPDATE_REQUEST,
  COMMUNITY_COMMENT_UPDATE_SUCCESS,
  COMMUNITY_COMMENT_UPDATE_FAILURE,
  //
  COMMUNITY_COMMENT_DELETE_REQUEST,
  COMMUNITY_COMMENT_DELETE_SUCCESS,
  COMMUNITY_COMMENT_DELETE_FAILURE,
  //
} from "../reducers/community";

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function communityUploadAPI(data) {
  return axios.post(`/api/community/file`, data);
}

function* communityUpload(action) {
  try {
    const result = yield call(communityUploadAPI, action.data);

    yield put({
      type: COMMUNITY_UPLOAD_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: COMMUNITY_UPLOAD_FAILURE,
      error: err.response.data,
    });
  }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////// - TYPE - ////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function communityTypeListAPI(data) {
  return axios.get(`/api/community/type/list`, data);
}

function* communityTypeList(action) {
  try {
    const result = yield call(communityTypeListAPI, action.data);

    yield put({
      type: COMMUNITY_TYPE_LIST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: COMMUNITY_TYPE_LIST_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function communityTypeCreateAPI(data) {
  return axios.post(`/api/community/type/create`, data);
}

function* communityTypeCreate(action) {
  try {
    const result = yield call(communityTypeCreateAPI, action.data);

    yield put({
      type: COMMUNITY_TYPE_CREATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: COMMUNITY_TYPE_CREATE_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function communityTypeUpdateAPI(data) {
  return axios.patch(`/api/community/type/update`, data);
}

function* communityTypeUpdate(action) {
  try {
    const result = yield call(communityTypeUpdateAPI, action.data);

    yield put({
      type: COMMUNITY_TYPE_UPDATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: COMMUNITY_TYPE_UPDATE_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function communityTypeDeleteAPI(data) {
  return axios.delete(`/api/community/type/delete${data.typeId}`, data);
}

function* communityTypeDelete(action) {
  try {
    const result = yield call(communityTypeDeleteAPI, action.data);

    yield put({
      type: COMMUNITY_TYPE_DELETE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: COMMUNITY_TYPE_DELETE_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////// - COMMUNITY - /////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function communityListAPI(data) {
  return axios.post(`/api/community/list`, data);
}

function* communityList(action) {
  try {
    const result = yield call(communityListAPI, action.data);

    yield put({
      type: COMMUNITY_LIST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: COMMUNITY_LIST_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function communityDetailAPI(data) {
  return axios.get(`/api/community/detail/${data.communityId}`, data);
}

function* communityDetail(action) {
  try {
    const result = yield call(communityDetailAPI, action.data);

    yield put({
      type: COMMUNITY_DETAIL_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: COMMUNITY_DETAIL_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function communityCreateAPI(data) {
  return axios.post(`/api/community/create`, data);
}

function* communityCreate(action) {
  try {
    const result = yield call(communityCreateAPI, action.data);

    yield put({
      type: COMMUNITY_CREATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: COMMUNITY_CREATE_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function communityUpdateAPI(data) {
  return axios.patch(`/api/community/update`, data);
}

function* communityUpdate(action) {
  try {
    const result = yield call(communityUpdateAPI, action.data);

    yield put({
      type: COMMUNITY_UPDATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: COMMUNITY_UPDATE_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function communityDeleteAPI(data) {
  return axios.delete(`/api/community/delete/${data.communityId}`, data);
}

function* communityDelete(action) {
  try {
    const result = yield call(communityDeleteAPI, action.data);

    yield put({
      type: COMMUNITY_DELETE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: COMMUNITY_DELETE_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////// - COMMENT - //////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function communityCommentDetailAPI(data) {
  return axios.post(`/api/community/comment/detail`, data);
}

function* communityCommentDetail(action) {
  try {
    const result = yield call(communityCommentDetailAPI, action.data);

    yield put({
      type: COMMUNITY_COMMENT_DETAIL_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: COMMUNITY_COMMENT_DETAIL_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function communityCommentCreateAPI(data) {
  return axios.post(`/api/community/comment/create`, data);
}

function* communityCommentCreate(action) {
  try {
    const result = yield call(communityCommentCreateAPI, action.data);

    yield put({
      type: COMMUNITY_COMMENT_CREATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: COMMUNITY_COMMENT_CREATE_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function communityCommentUpdateAPI(data) {
  return axios.post(`/api/community/comment/update`, data);
}

function* communityCommentUpdate(action) {
  try {
    const result = yield call(communityCommentUpdateAPI, action.data);

    yield put({
      type: COMMUNITY_COMMENT_UPDATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: COMMUNITY_COMMENT_UPDATE_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function communityCommentDeleteAPI(data) {
  return axios.delete(`/api/community/comment/delete/${data.commentId}`, data);
}

function* communityCommentDelete(action) {
  try {
    const result = yield call(communityCommentDeleteAPI, action.data);

    yield put({
      type: COMMUNITY_COMMENT_DELETE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: COMMUNITY_COMMENT_DELETE_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

//////////////////////////////////////////////////////////////

function* watchCommunityUpload() {
  yield takeLatest(COMMUNITY_UPLOAD_REQUEST, communityUpload);
}

//type
function* watchCommunityTypeList() {
  yield takeLatest(COMMUNITY_TYPE_LIST_REQUEST, communityTypeList);
}
function* watchCommunityTypeCreate() {
  yield takeLatest(COMMUNITY_TYPE_CREATE_REQUEST, communityTypeCreate);
}
function* watchCommunityTypeUpdate() {
  yield takeLatest(COMMUNITY_TYPE_UPDATE_REQUEST, communityTypeUpdate);
}
function* watchCommunityTypeDelete() {
  yield takeLatest(COMMUNITY_TYPE_DELETE_REQUEST, communityTypeDelete);
}

//community
function* watchCommunityList() {
  yield takeLatest(COMMUNITY_LIST_REQUEST, communityList);
}
function* watchCommunityDetail() {
  yield takeLatest(COMMUNITY_DETAIL_REQUEST, communityDetail);
}
function* watchCommunityCreate() {
  yield takeLatest(COMMUNITY_CREATE_REQUEST, communityCreate);
}
function* watchCommunityUpdate() {
  yield takeLatest(COMMUNITY_UPDATE_REQUEST, communityUpdate);
}
function* watchCommunityDelete() {
  yield takeLatest(COMMUNITY_DELETE_REQUEST, communityDelete);
}

//comment
function* watchCommunityCommentDetail() {
  yield takeLatest(COMMUNITY_COMMENT_DETAIL_REQUEST, communityCommentDetail);
}
function* watchCommunityCommentCreate() {
  yield takeLatest(COMMUNITY_COMMENT_CREATE_REQUEST, communityCommentCreate);
}
function* watchCommunityCommentUpdate() {
  yield takeLatest(COMMUNITY_COMMENT_UPDATE_REQUEST, communityCommentUpdate);
}
function* watchCommunityCommentDelete() {
  yield takeLatest(COMMUNITY_COMMENT_DELETE_REQUEST, communityCommentDelete);
}

//////////////////////////////////////////////////////////////
export default function* communitySaga() {
  yield all([
    fork(watchCommunityUpload),
    //
    fork(watchCommunityTypeList),
    fork(watchCommunityTypeCreate),
    fork(watchCommunityTypeUpdate),
    fork(watchCommunityTypeDelete),
    //
    fork(watchCommunityList),
    fork(watchCommunityDetail),
    fork(watchCommunityCreate),
    fork(watchCommunityUpdate),
    fork(watchCommunityDelete),
    //
    fork(watchCommunityCommentDetail),
    fork(watchCommunityCommentCreate),
    fork(watchCommunityCommentUpdate),
    fork(watchCommunityCommentDelete),
  ]);
}
