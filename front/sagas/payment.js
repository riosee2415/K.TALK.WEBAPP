import { all, call, delay, fork, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import {
  PAYMENT_LIST_REQUEST,
  PAYMENT_LIST_SUCCESS,
  PAYMENT_LIST_FAILURE,
  //////////////////////////
  PAYMENT_CREATE_REQUEST,
  PAYMENT_CREATE_SUCCESS,
  PAYMENT_CREATE_FAILURE,
} from "../reducers/payment";

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function paymentListAPI(data) {
  return axios.post(`/api/payment/list`);
}

function* paymentList(action) {
  try {
    const result = yield call(paymentListAPI, action.data);

    yield put({
      type: PAYMENT_LIST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: PAYMENT_LIST_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function paymentCreateAPI(data) {
  return axios.post(`/api/payment/create`, data);
}

function* paymentCreate(action) {
  try {
    const result = yield call(paymentCreateAPI, action.data);

    yield put({
      type: PAYMENT_CREATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: PAYMENT_CREATE_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

//////////////////////////////////////////////////////////////
function* watchPaymentList() {
  yield takeLatest(PAYMENT_LIST_REQUEST, paymentList);
}

function* watchPaymentCreate() {
  yield takeLatest(PAYMENT_CREATE_REQUEST, paymentCreate);
}

//////////////////////////////////////////////////////////////
export default function* bannerSaga() {
  yield all([
    fork(watchPaymentList),
    fork(watchPaymentCreate),
    //
  ]);
}
