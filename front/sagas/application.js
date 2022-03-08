import { all, call, delay, fork, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import {
  APP_CREATE_REQUEST,
  APP_CREATE_SUCCESS,
  APP_CREATE_FAILURE,
  /////////////////////////////
} from "../reducers/application";

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function appCreateAPI(data) {
  return axios.post(`/api/app/create`, data);
}

function* appCreate(action) {
  try {
    const result = yield call(appCreateAPI, action.data);

    yield put({
      type: APP_CREATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: APP_CREATE_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

//////////////////////////////////////////////////////////////
function* watchAppCreate() {
  yield takeLatest(APP_CREATE_REQUEST, appCreate);
}
//////////////////////////////////////////////////////////////
export default function* appSaga() {
  yield all([
    fork(watchAppCreate),
    //
  ]);
}
