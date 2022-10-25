import produce from "../util/produce";

export const initialState = {
  applicationList: null,
  applicationDetail: null,
  //
  st_appCreateLoading: false, // 신청서 생성
  st_appCreateDone: false,
  st_appCreateError: null,
  //
  st_appUpdateLoading: false, // 신청서 생성
  st_appUpdateDone: false,
  st_appUpdateError: null,
  //
  st_appListLoading: false, // 신청서 생성
  st_appListDone: false,
  st_appListError: null,
  //
  st_appDetailLoading: false,
  st_appDetailDone: false,
  st_appDetailError: null,
  //
  st_appUseUpdateLoading: false,
  st_appUseUpdateDone: false,
  st_appUseUpdateError: null,
  //
  updateModal: false,
};

export const APP_CREATE_REQUEST = "APP_CREATE_REQUEST";
export const APP_CREATE_SUCCESS = "APP_CREATE_SUCCESS";
export const APP_CREATE_FAILURE = "APP_CREATE_FAILURE";

export const APP_LIST_REQUEST = "APP_LIST_REQUEST";
export const APP_LIST_SUCCESS = "APP_LIST_SUCCESS";
export const APP_LIST_FAILURE = "APP_LIST_FAILURE";

export const APP_UPDATE_REQUEST = "APP_UPDATE_REQUEST";
export const APP_UPDATE_SUCCESS = "APP_UPDATE_SUCCESS";
export const APP_UPDATE_FAILURE = "APP_UPDATE_FAILURE";

export const APP_DETAIL_REQUEST = "APP_DETAIL_REQUEST";
export const APP_DETAIL_SUCCESS = "APP_DETAIL_SUCCESS";
export const APP_DETAIL_FAILURE = "APP_DETAIL_FAILURE";

export const APP_USE_UPDATE_REQUEST = "APP_USE_UPDATE_REQUEST";
export const APP_USE_UPDATE_SUCCESS = "APP_USE_UPDATE_SUCCESS";
export const APP_USE_UPDATE_FAILURE = "APP_USE_UPDATE_FAILURE";

export const UPDATE_MODAL_CLOSE_REQUEST = "UPDATE_MODAL_CLOSE_REQUEST";
export const UPDATE_MODAL_OPEN_REQUEST = "UPDATE_MODAL_OPEN_REQUEST";

const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      //////////////////////////////////////////////

      case APP_CREATE_REQUEST: {
        draft.st_appCreateLoading = true;
        draft.st_appCreateDone = false;
        draft.st_appCreateError = null;
        break;
      }
      case APP_CREATE_SUCCESS: {
        draft.st_appCreateLoading = false;
        draft.st_appCreateDone = true;
        break;
      }
      case APP_CREATE_FAILURE: {
        draft.st_appCreateLoading = false;
        draft.st_appCreateDone = false;
        draft.st_appCreateError = action.error;
        break;
      }

      //////////////////////////////////////////////

      case APP_LIST_REQUEST: {
        draft.st_appListLoading = true;
        draft.st_appListDone = false;
        draft.st_appListError = null;
        break;
      }
      case APP_LIST_SUCCESS: {
        draft.st_appListLoading = false;
        draft.st_appListDone = true;
        draft.applicationList = action.data.lists;
        break;
      }
      case APP_LIST_FAILURE: {
        draft.st_appListLoading = false;
        draft.st_appListDone = false;
        draft.st_appListError = action.error;
        break;
      }

      //////////////////////////////////////////////

      case APP_UPDATE_REQUEST: {
        draft.st_appUpdateLoading = true;
        draft.st_appUpdateDone = false;
        draft.st_appUpdateError = null;
        break;
      }
      case APP_UPDATE_SUCCESS: {
        draft.st_appUpdateLoading = false;
        draft.st_appUpdateDone = true;
        break;
      }
      case APP_UPDATE_FAILURE: {
        draft.st_appUpdateLoading = false;
        draft.st_appUpdateDone = false;
        draft.st_appUpdateError = action.error;
        break;
      }

      //////////////////////////////////////////////

      case APP_DETAIL_REQUEST: {
        draft.st_appDetailLoading = true;
        draft.st_appDetailDone = false;
        draft.st_appDetailError = null;
        break;
      }
      case APP_DETAIL_SUCCESS: {
        draft.st_appDetailLoading = false;
        draft.st_appDetailDone = true;
        draft.st_appDetailError = null;
        draft.applicationDetail = action.data.lists;
        break;
      }
      case APP_DETAIL_FAILURE: {
        draft.st_appDetailLoading = false;
        draft.st_appDetailDone = false;
        draft.st_appDetailError = action.error;
        break;
      }

      ///////////////////////////////////////////////////////

      case APP_USE_UPDATE_REQUEST: {
        draft.st_appUseUpdateLoading = true;
        draft.st_appUseUpdateDone = null;
        draft.st_appUseUpdateError = false;
        break;
      }
      case APP_USE_UPDATE_SUCCESS: {
        draft.st_appUseUpdateLoading = false;
        draft.st_appUseUpdateDone = true;
        draft.st_appUseUpdateError = null;
        break;
      }
      case APP_USE_UPDATE_FAILURE: {
        draft.st_appUseUpdateLoading = false;
        draft.st_appUseUpdateDone = false;
        draft.st_appUseUpdateError = action.error;
        break;
      }

      //////////////////////////////////////////////
      case UPDATE_MODAL_CLOSE_REQUEST: {
        draft.updateModal = false;
        break;
      }
      case UPDATE_MODAL_OPEN_REQUEST: {
        draft.updateModal = true;
        break;
      }

      default:
        break;
    }
  });

export default reducer;
