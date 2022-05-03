import produce from "../util/produce";

export const initialState = {
  teacherPayList: [],
  teacherPayLastPage: [],

  teacherAdminPayListList: [],
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
        draft.st_teacherPayListLoading = true;
        draft.st_teacherPayListDone = null;
        draft.st_teacherPayListError = false;
        break;
      }
      case TEACHER_PAY_LIST_SUCCESS: {
        draft.st_teacherPayListLoading = false;
        draft.st_teacherPayListDone = true;
        draft.teacherPayList = action.data.teacherPay;
        draft.teacherPayLastPage = action.data.lastPage;
        break;
      }
      case TEACHER_PAY_LIST_FAILURE: {
        draft.st_teacherPayListLoading = false;
        draft.st_teacherPayListDone = false;
        draft.st_teacherPayListError = action.error;
        break;
      }

      //////////////////////////////////////////////

      case TEACHER_ADMIN_PAY_LIST_REQUEST: {
        draft.st_teacherAdminPayListLoading = true;
        draft.st_teacherAdminPayListDone = null;
        draft.st_teacherAdminPayListError = false;
        break;
      }
      case TEACHER_ADMIN_PAY_LIST_SUCCESS: {
        draft.st_teacherAdminPayListLoading = false;
        draft.st_teacherAdminPayListDone = true;
        draft.teacherAdminPayListList = action.data.teacherPay;
        draft.teacherPayAdminPrice = action.data.newprice;
        break;
      }
      case TEACHER_ADMIN_PAY_LIST_FAILURE: {
        draft.st_teacherAdminPayListLoading = false;
        draft.st_teacherAdminPayListDone = false;
        draft.st_teacherAdminPayListError = action.error;
        break;
      }

      //////////////////////////////////////////////

      case TEACHER_PAY_CREATE_REQUEST: {
        draft.st_teacherCreateLoading = true;
        draft.st_teacherCreateDone = null;
        draft.st_teacherCreateError = false;
        break;
      }
      case TEACHER_PAY_CREATE_SUCCESS: {
        draft.st_teacherCreateLoading = false;
        draft.st_teacherCreateDone = true;
        break;
      }
      case TEACHER_PAY_CREATE_FAILURE: {
        draft.st_teacherCreateLoading = false;
        draft.st_teacherCreateDone = false;
        draft.st_teacherCreateError = action.error;
        break;
      }

      //////////////////////////////////////////////

      
      default:
        break;
    }
  });

export default reducer;
