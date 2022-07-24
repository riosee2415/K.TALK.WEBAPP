import produce from "../util/produce";

export const initialState = {
  commuteList: [],
  commuteLastPage: 1,
  commuteAdminList: [],
  //
  st_commuteListLoading: false,
  st_commuteListDone: false,
  st_commuteListError: null,
  //
  st_commuteCreateLoading: false,
  st_commuteCreateDone: false,
  st_commuteCreateError: null,
  //
  st_commuteAdminListLoading: false,
  st_commuteAdminListDone: false,
  st_commuteAdminListError: null,
  //
  st_commuteUpdateLoading: false,
  st_commuteUpdateDone: false,
  st_commuteUpdateError: null,
};

export const COMMUTE_LIST_REQUEST = "COMMUTE_LIST_REQUEST";
export const COMMUTE_LIST_SUCCESS = "COMMUTE_LIST_SUCCESS";
export const COMMUTE_LIST_FAILURE = "COMMUTE_LIST_FAILURE";

export const COMMUTE_CREATE_REQUEST = "COMMUTE_CREATE_REQUEST";
export const COMMUTE_CREATE_SUCCESS = "COMMUTE_CREATE_SUCCESS";
export const COMMUTE_CREATE_FAILURE = "COMMUTE_CREATE_FAILURE";

export const COMMUTE_ADMIN_LIST_REQUEST = "COMMUTE_ADMIN_LIST_REQUEST";
export const COMMUTE_ADMIN_LIST_SUCCESS = "COMMUTE_ADMIN_LIST_SUCCESS";
export const COMMUTE_ADMIN_LIST_FAILURE = "COMMUTE_ADMIN_LIST_FAILURE";

export const COMMUTE_UPDATE_REQUEST = "COMMUTE_UPDATE_REQUEST";
export const COMMUTE_UPDATE_SUCCESS = "COMMUTE_UPDATE_SUCCESS";
export const COMMUTE_UPDATE_FAILURE = "COMMUTE_UPDATE_FAILURE";

const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case COMMUTE_LIST_REQUEST: {
        draft.st_commuteListLoading = true;
        draft.st_commuteListDone = null;
        draft.st_commuteListError = false;
        break;
      }
      case COMMUTE_LIST_SUCCESS: {
        draft.st_commuteListLoading = false;
        draft.st_commuteListDone = true;
        draft.commuteList = action.data.commute;
        draft.commuteLastPage = action.data.lastPage;
        break;
      }
      case COMMUTE_LIST_FAILURE: {
        draft.st_commuteListLoading = false;
        draft.st_commuteListDone = false;
        draft.st_commuteListError = action.error;
        break;
      }

      //////////////////////////////////////////////

      case COMMUTE_CREATE_REQUEST: {
        draft.st_commuteCreateLoading = true;
        draft.st_commuteCreateDone = null;
        draft.st_commuteCreateError = false;
        break;
      }
      case COMMUTE_CREATE_SUCCESS: {
        draft.st_commuteCreateLoading = false;
        draft.st_commuteCreateDone = true;
        break;
      }
      case COMMUTE_CREATE_FAILURE: {
        draft.st_commuteCreateLoading = false;
        draft.st_commuteCreateDone = false;
        draft.st_commuteCreateError = action.error;
        break;
      }
      //////////////////////////////////////////////

      case COMMUTE_ADMIN_LIST_REQUEST: {
        draft.st_commuteAdminListLoading = true;
        draft.st_commuteAdminListDone = null;
        draft.st_commuteAdminListError = false;
        break;
      }
      case COMMUTE_ADMIN_LIST_SUCCESS: {
        draft.st_commuteAdminListLoading = false;
        draft.st_commuteAdminListDone = true;
        draft.commuteAdminList = action.data.commute;
        break;
      }
      case COMMUTE_ADMIN_LIST_FAILURE: {
        draft.st_commuteAdminListLoading = false;
        draft.st_commuteAdminListDone = false;
        draft.st_commuteAdminListError = action.error;
        break;
      }
      //////////////////////////////////////////////

      case COMMUTE_UPDATE_REQUEST: {
        draft.st_commuteUpdateLoading = true;
        draft.st_commuteUpdateDone = false;
        draft.st_commuteUpdateError = null;
        break;
      }
      case COMMUTE_UPDATE_SUCCESS: {
        draft.st_commuteUpdateLoading = false;
        draft.st_commuteUpdateDone = true;
        draft.st_commuteUpdateError = null;
        break;
      }
      case COMMUTE_UPDATE_FAILURE: {
        draft.st_commuteUpdateLoading = false;
        draft.st_commuteUpdateDone = false;
        draft.st_commuteUpdateError = action.error;
        break;
      }
      //////////////////////////////////////////////

      default:
        break;
    }
  });

export default reducer;
