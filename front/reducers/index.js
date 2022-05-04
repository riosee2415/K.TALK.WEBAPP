import { HYDRATE } from "next-redux-wrapper";
import { combineReducers } from "redux";
import user from "./user";
import banner from "./banner";
import popup from "./popup";
import company from "./company";
import notice from "./notice";
import gallery from "./gallery";
import question from "./question";
import accept from "./accept";
import seo from "./seo";
import editor from "./editor";
import app from "./application";
import message from "./message";
import lecture from "./lecture";
import participant from "./participant";
import commute from "./commute";
import processApply from "./processApply";
import payment from "./payment";
import book from "./book";
import payClass from "./payClass";
import teacherPay from "./teacherpay";

const rootReducer = (state, action) => {
  switch (action.type) {
    case HYDRATE:
      console.log("HYDRATE", action);
      return action.payload;
    default: {
      const combinedReducer = combineReducers({
        user,
        banner,
        popup,
        company,
        notice,
        gallery,
        question,
        accept,
        seo,
        editor,
        app,
        message,
        lecture,
        participant,
        commute,
        processApply,
        book,
        payment,
        payClass,
        teacherPay,
      });
      return combinedReducer(state, action);
    }
  }
};

export default rootReducer;
