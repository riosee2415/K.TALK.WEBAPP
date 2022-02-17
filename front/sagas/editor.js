import { all, call, delay, fork, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import {
  EDITOR_UPLOAD_REQUEST,
  EDITOR_UPLOAD_SUCCESS,
  EDITOR_UPLOAD_FAILURE,
} from "../reducers/editor";

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
async function editUploadAPI(data) {
  return await axios.post(`/api/edit/image`, data);
}

function* editUpload(action) {
  try {
    const result = yield call(editUploadAPI, action.data);

    yield put({
      type: EDITOR_UPLOAD_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: EDITOR_UPLOAD_FAILURE,
      error: err.response.data,
    });
  }
}
//////////////////////////////////////////////////////////////
function* watchEditUpload() {
  yield takeLatest(EDITOR_UPLOAD_REQUEST, editUpload);
}

//////////////////////////////////////////////////////////////
export default function* editSaga() {
  yield all([
    fork(watchEditUpload),
    //
  ]);
}
