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

//////////////////////////////////////////////////////////////
function* watchNormalNoticeList() {
  yield takeLatest(NORMAL_NOTICE_LIST_REQUEST, normalNoticeList);
}

function* watchNormalNoticeAdminList() {
  yield takeLatest(NORMAL_NOTICE_ADMIN_LIST_REQUEST, normalNoticeAdminList);
}

//////////////////////////////////////////////////////////////
export default function* normalNoticeSaga() {
  yield all([
    fork(watchNormalNoticeList),
    fork(watchNormalNoticeAdminList),
    //
  ]);
}
