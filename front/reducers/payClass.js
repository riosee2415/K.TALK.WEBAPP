import produce from "../util/produce";

export const initailState = {
  payClassList: null,
  maxPage: 1,

  st_payClassListLoading: false,
  st_payClassListDone: false,
  st_payClassListError: null,
  //
  st_payClassCreateLoading: false,
  st_payClassCreateDone: false,
  st_payClassCreateError: null,
  //
  st_payClassUpdateLoading: false,
  st_payClassUpdateDone: false,
  st_payClassUpdateError: null,
  //
  st_payClassDeleteLoading: false,
  st_payClassDeleteDone: false,
  st_payClassDeleteError: null,
  //

  createModal: null,
};

export const PAY_CLASS_LIST_REQUEST = "PAY_CLASS_LIST_REQUEST";
export const PAY_CLASS_LIST_SUCCESS = "PAY_CLASS_LIST_SUCCESS";
export const PAY_CLASS_LIST_FAILURE = "PAY_CLASS_LIST_FAILURE";
//
export const PAY_CLASS_CREATE_REQUEST = "PAY_CLASS_CREATE_REQUEST";
export const PAY_CLASS_CREATE_SUCCESS = "PAY_CLASS_CREATE_SUCCESS";
export const PAY_CLASS_CREATE_FAILURE = "PAY_CLASS_CREATE_FAILURE";
//
export const PAY_CLASS_UPDATE_REQUEST = "PAY_CLASS_UPDATE_REQUEST";
export const PAY_CLASS_UPDATE_SUCCESS = "PAY_CLASS_UPDATE_SUCCESS";
export const PAY_CLASS_UPDATE_FAILURE = "PAY_CLASS_UPDATE_FAILURE";
//
export const PAY_CLASS_DELETE_REQUEST = "PAY_CLASS_DELETE_REQUEST";
export const PAY_CLASS_DELETE_SUCCESS = "PAY_CLASS_DELETE_SUCCESS";
export const PAY_CLASS_DELETE_FAILURE = "PAY_CLASS_DELETE_FAILURE";

export const CREATE_MODAL_OPEN_REQUEST = "CREATE_MODAL_OPEN_REQUEST";
export const CREATE_MODAL_CLOSE_REQUEST = "CREATE_MODAL_CLOSE_REQUEST";

const reducer = (state = initailState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case PAY_CLASS_LIST_REQUEST: {
        draft.st_payClassListLoading = true;
        draft.st_payClassListDone = null;
        draft.st_payClassListError = false;
        break;
      }
      case PAY_CLASS_LIST_SUCCESS: {
        draft.st_payClassListLoading = false;
        draft.st_payClassListDone = true;
        draft.payClassList = action.data;
        break;
      }
      case PAY_CLASS_LIST_FAILURE: {
        draft.st_payClassListLoading = false;
        draft.st_payClassListDone = false;
        draft.st_payClassListError = action.error;
        break;
      }
      ///////////////////////////////////////////////////////

      case PAY_CLASS_CREATE_REQUEST: {
        draft.st_payClassCreateLoading = true;
        draft.st_payClassCreateDone = null;
        draft.st_payClassCreateError = false;
        break;
      }
      case PAY_CLASS_CREATE_SUCCESS: {
        draft.st_payClassCreateLoading = false;
        draft.st_payClassCreateDone = true;

        break;
      }
      case PAY_CLASS_CREATE_FAILURE: {
        draft.st_payClassCreateLoading = false;
        draft.st_payClassCreateDone = false;
        draft.st_payClassCreateError = action.error;
        break;
      }
      ///////////////////////////////////////////////////////

      case PAY_CLASS_UPDATE_REQUEST: {
        draft.st_payClassUpdateLoading = true;
        draft.st_payClassUpdateDone = null;
        draft.st_payClassUpdateError = false;
        break;
      }
      case PAY_CLASS_UPDATE_SUCCESS: {
        draft.st_payClassUpdateLoading = false;
        draft.st_payClassUpdateDone = true;

        break;
      }
      case PAY_CLASS_UPDATE_FAILURE: {
        draft.st_payClassUpdateLoading = false;
        draft.st_payClassUpdateDone = false;
        draft.st_payClassUpdateError = action.error;
        break;
      }
      ///////////////////////////////////////////////////////

      case PAY_CLASS_DELETE_REQUEST: {
        draft.st_payClassDeleteLoading = true;
        draft.st_payClassDeleteDone = null;
        draft.st_payClassDeleteError = false;
        break;
      }
      case PAY_CLASS_DELETE_SUCCESS: {
        draft.st_payClassDeleteLoading = false;
        draft.st_payClassDeleteDone = true;
        break;
      }
      case PAY_CLASS_DELETE_FAILURE: {
        draft.st_payClassDeleteLoading = false;
        draft.st_payClassDeleteDone = false;
        draft.st_payClassDeleteError = action.error;
        break;
      }

      ///////////////////////////////////////////////////////

      case CREATE_MODAL_OPEN_REQUEST:
        draft.createModal = true;
        break;

      case CREATE_MODAL_CLOSE_REQUEST:
        draft.createModal = false;
        break;
      ///////////////////////////////////////////////////////

      default:
        break;
    }
  });

export default reducer;
