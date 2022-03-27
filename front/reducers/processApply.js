import produce from "../util/produce";

export const initialState = {
  processList: null,
  processDetail: null,
  //
  st_processListLoading: false,
  st_processListDone: false,
  st_processListError: null,
  //
  st_processDetailLoading: false,
  st_processDetailDone: false,
  st_processDetailError: null,
  //
  st_processCreateLoading: false,
  st_processCreateDone: false,
  st_processCreateError: null,
  //
  st_processUpdateLoading: false,
  st_processUpdateDone: false,
  st_processUpdateError: null,
};

export const PROCESS_LIST_REQUEST = "PROCESS_LIST_REQUEST";
export const PROCESS_LIST_SUCCESS = "PROCESS_LIST_SUCCESS";
export const PROCESS_LIST_FAILURE = "PROCESS_LIST_FAILURE";

export const PROCESS_DETAIL_REQUEST = "PROCESS_DETAIL_REQUEST";
export const PROCESS_DETAIL_SUCCESS = "PROCESS_DETAIL_SUCCESS";
export const PROCESS_DETAIL_FAILURE = "PROCESS_DETAIL_FAILURE";

export const PROCESS_CREATE_REQUEST = "PROCESS_CREATE_REQUEST";
export const PROCESS_CREATE_SUCCESS = "PROCESS_CREATE_SUCCESS";
export const PROCESS_CREATE_FAILURE = "PROCESS_CREATE_FAILURE";

export const PROCESS_UPDATE_REQUEST = "PROCESS_UPDATE_REQUEST";
export const PROCESS_UPDATE_SUCCESS = "PROCESS_UPDATE_SUCCESS";
export const PROCESS_UPDATE_FAILURE = "PROCESS_UPDATE_FAILURE";

const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case PROCESS_LIST_REQUEST: {
        draft.st_processListLoading = true;
        draft.st_processListDone = null;
        draft.st_processListError = false;
        break;
      }
      case PROCESS_LIST_SUCCESS: {
        draft.st_processListLoading = false;
        draft.st_processListDone = true;
        draft.acceptList = action.data.lists;
        break;
      }
      case PROCESS_LIST_FAILURE: {
        draft.st_processListLoading = false;
        draft.st_processListDone = false;
        draft.st_processListError = action.error;
        break;
      }

      //////////////////////////////////////////////

      case PROCESS_DETAIL_REQUEST: {
        draft.st_processDetailLoading = true;
        draft.st_processDetailDone = null;
        draft.st_processDetailError = false;
        break;
      }
      case PROCESS_DETAIL_SUCCESS: {
        draft.st_processDetailLoading = false;
        draft.st_processDetailDone = true;
        draft.processDetail = action.data.lists;
        break;
      }
      case PROCESS_DETAIL_FAILURE: {
        draft.st_processDetailLoading = false;
        draft.st_processDetailDone = false;
        draft.st_processDetailError = action.error;
        break;
      }

      //////////////////////////////////////////////

      case PROCESS_CREATE_REQUEST: {
        draft.st_processCreateLoading = true;
        draft.st_processCreateDone = null;
        draft.st_processCreateError = false;
        break;
      }
      case PROCESS_CREATE_SUCCESS: {
        draft.st_processCreateLoading = false;
        draft.st_processCreateDone = true;
        break;
      }
      case PROCESS_CREATE_FAILURE: {
        draft.st_processCreateLoading = false;
        draft.st_processCreateDone = false;
        draft.st_processCreateError = action.error;
        break;
      }

      //////////////////////////////////////////////

      case PROCESS_UPDATE_REQUEST: {
        draft.st_processUpdateLoading = true;
        draft.st_processUpdateDone = null;
        draft.st_processUpdateError = false;
        break;
      }
      case PROCESS_UPDATE_SUCCESS: {
        draft.st_processUpdateLoading = false;
        draft.st_processUpdateDone = true;
        break;
      }
      case PROCESS_UPDATE_FAILURE: {
        draft.st_processUpdateLoading = false;
        draft.st_processUpdateDone = false;
        draft.st_processUpdateError = action.error;
        break;
      }

      //////////////////////////////////////////////

      default:
        break;
    }
  });

export default reducer;
