import { all, call, delay, fork, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import {
  ///////////////////////////////// 회원 일반게시판 가져오기
  NORMAL_NOTICE_LIST_REQUEST,
  NORMAL_NOTICE_LIST_SUCCESS,
  NORMAL_NOTICE_LIST_FAILURE,
  ///////////////////////////////// 관리자 일반게시판 가져오기
  NORMAL_NOTICE_ADMIN_LIST_REQUEST,
  NORMAL_NOTICE_ADMIN_LIST_SUCCESS,
  NORMAL_NOTICE_ADMIN_LIST_FAILURE,
  ///////////////////////////////// 관리자 일반게시판 생성하기
  NORMAL_NOTICE_ADMIN_CREATE_REQUEST,
  NORMAL_NOTICE_ADMIN_CREATE_SUCCESS,
  NORMAL_NOTICE_ADMIN_CREATE_FAILURE,
} from "../reducers/normalNotice";

// ******************************************************************************************************************
// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************

async function normalNoticeListAPI(data) {
  return await axios.post(`/api/normalNotice/list`, data);
}

function* normalNoticeList(action) {
  try {
    const result = yield call(normalNoticeListAPI, action.data);

    yield put({
      type: NORMAL_NOTICE_LIST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: NORMAL_NOTICE_LIST_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// ******************************************************************************************************************
// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************

async function normalNoticeAdminListAPI(data) {
  console.log("listType", data);
  return await axios.post(`/api/normalNotice/admin/list`, data);
}

function* normalNoticeAdminList(action) {
  try {
    const result = yield call(normalNoticeAdminListAPI, action.data);

    yield put({
      type: NORMAL_NOTICE_ADMIN_LIST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: NORMAL_NOTICE_ADMIN_LIST_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// ******************************************************************************************************************
// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************

async function normalNoticeAdminCreateAPI(data) {
  return await axios.post(`/api/normalNotice/admin/create`, data);
}

function* normalNoticeAdminCreate(action) {
  try {
    const result = yield call(normalNoticeAdminCreateAPI, action.data);

    yield put({
      type: NORMAL_NOTICE_ADMIN_CREATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: NORMAL_NOTICE_ADMIN_CREATE_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

//////////////////////////////////////////////////////////////
function* watchNormalNoticeList() {
  yield takeLatest(NORMAL_NOTICE_LIST_REQUEST, normalNoticeList);
}

function* watchNormalNoticeAdminList() {
  yield takeLatest(NORMAL_NOTICE_ADMIN_LIST_REQUEST, normalNoticeAdminList);
}

function* watchNormalNoticeAdminCreate() {
  yield takeLatest(NORMAL_NOTICE_ADMIN_CREATE_REQUEST, normalNoticeAdminCreate);
}

//////////////////////////////////////////////////////////////
export default function* normalNoticeSaga() {
  yield all([
    fork(watchNormalNoticeList),
    fork(watchNormalNoticeAdminList),
    fork(watchNormalNoticeAdminCreate),
    //
  ]);
}
