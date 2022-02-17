import { all, call, delay, fork, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import {
  COMPANY_GET_REQUEST,
  COMPANY_GET_SUCCESS,
  COMPANY_GET_FAILURE,
  //
  COMPANY_CREATE_REQUEST,
  COMPANY_CREATE_SUCCESS,
  COMPANY_CREATE_FAILURE,
  //
  COMPANY_DELETE_REQUEST,
  COMPANY_DELETE_SUCCESS,
  COMPANY_DELETE_FAILURE,
  //
  COMPANY_UPDATE_REQUEST,
  COMPANY_UPDATE_SUCCESS,
  COMPANY_UPDATE_FAILURE,
} from "../reducers/company";

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function companyGetAPI() {
  return axios.get(`/api/company/list`);
}

function* companyGet() {
  try {
    const result = yield call(companyGetAPI);

    yield put({
      type: COMPANY_GET_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: COMPANY_GET_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function companyCreateAPI(data) {
  return axios.post(`/api/company/create`, data);
}

function* companyCreate(action) {
  try {
    const result = yield call(companyCreateAPI, action.data);

    yield put({
      type: COMPANY_CREATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: COMPANY_CREATE_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function companyDeleteAPI(data) {
  return axios.delete(`/api/company/delete/${data.companyId}`);
}

function* companyDelete(action) {
  try {
    const result = yield call(companyDeleteAPI, action.data);

    yield put({
      type: COMPANY_DELETE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: COMPANY_DELETE_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function companyUpdateAPI(data) {
  return axios.patch(`/api/company/update`, data);
}

function* companyUpdate(action) {
  try {
    const result = yield call(companyUpdateAPI, action.data);

    yield put({
      type: COMPANY_UPDATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: COMPANY_UPDATE_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

//////////////////////////////////////////////////////////////
function* watchCompanyGet() {
  yield takeLatest(COMPANY_GET_REQUEST, companyGet);
}

function* watchCompanyCreate() {
  yield takeLatest(COMPANY_CREATE_REQUEST, companyCreate);
}

function* watchCompanyDelete() {
  yield takeLatest(COMPANY_DELETE_REQUEST, companyDelete);
}

function* watchCompanyUpdate() {
  yield takeLatest(COMPANY_UPDATE_REQUEST, companyUpdate);
}

//////////////////////////////////////////////////////////////
export default function* bannerSaga() {
  yield all([
    fork(watchCompanyGet),
    fork(watchCompanyCreate),
    fork(watchCompanyDelete),
    fork(watchCompanyUpdate),
    //
  ]);
}
