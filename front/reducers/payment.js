import produce from "../util/produce";

export const initialState = {
  paymentList: [],
  //
  st_paymentListLoading: false,
  st_paymentListDone: false,
  st_paymentListError: null,

  st_paymentCreateLoading: false,
  st_paymentCreateDone: false,
  st_paymentCreateError: null,
};

export const PAYMENT_LIST_REQUEST = "PAYMENT_LIST_REQUEST";
export const PAYMENT_LIST_SUCCESS = "PAYMENT_LIST_SUCCESS";
export const PAYMENT_LIST_FAILURE = "PAYMENT_LIST_FAILURE";

export const PAYMENT_CREATE_REQUEST = "PAYMENT_CREATE_REQUEST";
export const PAYMENT_CREATE_SUCCESS = "PAYMENT_CREATE_SUCCESS";
export const PAYMENT_CREATE_FAILURE = "PAYMENT_CREATE_FAILURE";

const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case PAYMENT_LIST_REQUEST: {
        draft.st_paymentListLoading = true;
        draft.st_paymentListDone = null;
        draft.st_paymentListError = false;
        break;
      }
      case PAYMENT_LIST_SUCCESS: {
        draft.st_paymentListLoading = false;
        draft.st_paymentListDone = true;
        draft.paymentList = action.data.list;
        break;
      }
      case PAYMENT_LIST_FAILURE: {
        draft.st_paymentListLoading = false;
        draft.st_paymentListDone = false;
        draft.st_paymentListError = action.error;
        break;
      }

      //////////////////////////////////////////////

      case PAYMENT_CREATE_REQUEST: {
        draft.st_paymentCreateLoading = true;
        draft.st_paymentCreateDone = null;
        draft.st_paymentCreateError = false;
        break;
      }
      case PAYMENT_CREATE_SUCCESS: {
        draft.st_paymentCreateLoading = false;
        draft.st_paymentCreateDone = true;
        draft.st_paymentCreateError = false;
        break;
      }
      case PAYMENT_CREATE_FAILURE: {
        draft.st_paymentCreateLoading = false;
        draft.st_paymentCreateDone = false;
        draft.st_paymentCreateError = action.error;
        break;
      }
      //////////////////////////////////////////////

      default:
        break;
    }
  });

export default reducer;
