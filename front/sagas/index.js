import { all, fork } from "redux-saga/effects";
import bannerSaga from "./banner";
import userSaga from "./user";
import popupSaga from "./popup";
import companySaga from "./company";
import noticeSage from "./notice";
import gallerySage from "./gallery";
import questionSage from "./question";
import acceptSaga from "./accept";
import seoSaga from "./seo";
import editSaga from "./editor";
import appSaga from "./application";
import messagerSaga from "./message";
import lectureSaga from "./lecture";
import participantSaga from "./participant";
import commuteSaga from "./commute";
import processApplySaga from "./processApply";
import paymentSaga from "./payment";
import bookSaga from "./book";
import payClassSaga from "./payClass";
import teacherPaySaga from "./teacherPay";
import lectureMemoSaga from "./lectureMemo";
import communitySaga from "./community";
import normalNoticeSaga from "./normalNotice";
import lectureNoticeSaga from "./lectureNotice";
//
import axios from "axios";
import backURL from "../config/config";

axios.defaults.baseURL = backURL;
axios.defaults.withCredentials = true;

export default function* rootSaga() {
  yield all([
    fork(bannerSaga),
    fork(userSaga),
    fork(popupSaga),
    fork(companySaga),
    fork(noticeSage),
    fork(gallerySage),
    fork(questionSage),
    fork(acceptSaga),
    fork(seoSaga),
    fork(editSaga),
    fork(appSaga),
    fork(messagerSaga),
    fork(lectureSaga),
    fork(participantSaga),
    fork(commuteSaga),
    fork(processApplySaga),
    fork(paymentSaga),
    fork(bookSaga),
    fork(payClassSaga),
    fork(teacherPaySaga),
    fork(lectureMemoSaga),
    fork(communitySaga),
    fork(normalNoticeSaga),
    fork(lectureNoticeSaga),
  ]);
}
