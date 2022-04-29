import produce from "../util/produce";

export const initialState = {
  teacherPayList: [],
  teacherPayLastPage: [],

  teacherPayAdminList: [],
  teacherPayAdminPrice: 0,
  //
  st_teacherPayListLoading: false,
  st_teacherPayListDone: false,
  st_teacherPayListError: null,
  //
  st_teacherAdminPayListLoading: false,
  st_teacherAdminPayListDone: false,
  st_teacherAdminPayListError: null,
  //
  st_teacherCreateLoading: false,
  st_teacherCreateDone: false,
  st_teacherCreateError: null,
};

export const TEACHER_PAY_LIST_REQUEST = "TEACHER_PAY_LIST_REQUEST";
export const TEACHER_PAY_LIST_SUCCESS = "TEACHER_PAY_LIST_SUCCESS";
export const TEACHER_PAY_LIST_FAILURE = "TEACHER_PAY_LIST_FAILURE";

export const TEACHER_ADMIN_PAY_LIST_REQUEST = "TEACHER_ADMIN_PAY_LIST_REQUEST";
export const TEACHER_ADMIN_PAY_LIST_SUCCESS = "TEACHER_ADMIN_PAY_LIST_SUCCESS";
export const TEACHER_ADMIN_PAY_LIST_FAILURE = "TEACHER_ADMIN_PAY_LIST_FAILURE";

export const TEACHER_PAY_CREATE_REQUEST = "TEACHER_PAY_CREATE_REQUEST";
export const TEACHER_PAY_CREATE_SUCCESS = "TEACHER_PAY_CREATE_SUCCESS";
export const TEACHER_PAY_CREATE_FAILURE = "TEACHER_PAY_CREATE_FAILURE";

const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case TEACHER_PAY_LIST_REQUEST: {
        draft.teacherPayListLoading = true;
        draft.teacherPayListDone = null;
        draft.teacherPayListError = false;
        break;
      }
      case TEACHER_PAY_LIST_SUCCESS: {
        draft.teacherPayListLoading = false;
        draft.teacherPayListDone = true;
        draft.teacherPayList = action.data.teacherPay;
        draft.teacherPayLastPage = action.data.lastPage;
        break;
      }
      case TEACHER_PAY_LIST_FAILURE: {
        draft.teacherPayListLoading = false;
        draft.teacherPayListDone = false;
        draft.teacherPayListError = action.error;
        break;
      }

      //////////////////////////////////////////////

      case TEACHER_ADMIN_PAY_LIST_REQUEST: {
        draft.teacherAdminPayListLoading = true;
        draft.teacherAdminPayListDone = null;
        draft.teacherAdminPayListError = false;
        break;
      }
      case TEACHER_ADMIN_PAY_LIST_SUCCESS: {
        draft.teacherAdminPayListLoading = false;
        draft.teacherAdminPayListDone = true;
        draft.teacherAdminPayListList = action.data.teacherPay;
        draft.teacherPayAdminPrice = action.data.price;
        break;
      }
      case TEACHER_ADMIN_PAY_LIST_FAILURE: {
        draft.teacherAdminPayListLoading = false;
        draft.teacherAdminPayListDone = false;
        draft.teacherAdminPayListError = action.error;
        break;
      }

      //////////////////////////////////////////////

      case TEACHER_PAY_CREATE_REQUEST: {
        draft.teacherCreateLoading = true;
        draft.teacherCreateDone = null;
        draft.teacherCreateError = false;
        break;
      }
      case TEACHER_PAY_CREATE_SUCCESS: {
        draft.teacherCreateLoading = false;
        draft.teacherCreateDone = true;
        break;
      }
      case TEACHER_PAY_CREATE_FAILURE: {
        draft.teacherCreateLoading = false;
        draft.teacherCreateDone = false;
        draft.teacherCreateError = action.error;
        break;
      }

      //////////////////////////////////////////////

      default:
        break;
    }
  });

export default reducer;
