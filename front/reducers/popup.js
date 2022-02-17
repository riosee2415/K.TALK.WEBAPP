import produce from "../util/produce";

export const initailState = {
  popups: null,
  uploadImagePath: null,
  createModal: false,
  //
  st_popupLoading: false, // 팝업 가져오기
  st_popupDone: false,
  st_popupError: null,
  //
  st_popupImageUploadLoading: false, // 팝업 이미지 업로드
  st_popupImageUploadDone: false,
  st_popupImageUploadError: null,
  //
  st_popupCreateLoading: false, // 팝업 추가하기
  st_popupCreateDone: false,
  st_popupCreateError: null,
  //
  st_popupDeleteLoading: false, // 팝업 삭제하기
  st_popupDeleteDone: false,
  st_popupDeleteError: null,
  //
  st_popupUseUpdateLoading: false, // 팝업 Y/N 수정하기
  st_popupUseUpdateDone: false,
  st_popupUseUpdateError: null,
  //
  st_popupUpdateLoading: false, // 팝업 수정하기
  st_popupUpdateDone: false,
  st_popupUpdateError: null,
};

export const POPUP_GET_REQUEST = "POPUP_GET_REQUEST";
export const POPUP_GET_SUCCESS = "POPUP_GET_SUCCESS";
export const POPUP_GET_FAILURE = "POPUP_GET_FAILURE";

export const POPUP_IMAGE_UPLOAD_REQUEST = "POPUP_IMAGE_UPLOAD_REQUEST";
export const POPUP_IMAGE_UPLOAD_SUCCESS = "POPUP_IMAGE_UPLOAD_SUCCESS";
export const POPUP_IMAGE_UPLOAD_FAILURE = "POPUP_IMAGE_UPLOAD_FAILURE";

export const POPUP_CREATE_REQUEST = "POPUP_CREATE_REQUEST";
export const POPUP_CREATE_SUCCESS = "POPUP_CREATE_SUCCESS";
export const POPUP_CREATE_FAILURE = "POPUP_CREATE_FAILURE";

export const POPUP_DELETE_REQUEST = "POPUP_DELETE_REQUEST";
export const POPUP_DELETE_SUCCESS = "POPUP_DELETE_SUCCESS";
export const POPUP_DELETE_FAILURE = "POPUP_DELETE_FAILURE";

export const POPUP_USE_UPDATE_REQUEST = "POPUP_USE_UPDATE_REQUEST";
export const POPUP_USE_UPDATE_SUCCESS = "POPUP_USE_UPDATE_SUCCESS";
export const POPUP_USE_UPDATE_FAILURE = "POPUP_USE_UPDATE_FAILURE";

export const POPUP_UPDATE_REQUEST = "POPUP_UPDATE_REQUEST";
export const POPUP_UPDATE_SUCCESS = "POPUP_UPDATE_SUCCESS";
export const POPUP_UPDATE_FAILURE = "POPUP_UPDATE_FAILURE";

export const POPUP_CREATE_MODAL_TOGGLE = "POPUP_CREATE_MODAL_TOGGLE";

export const POPUP_IMAGE_INIT = "POPUP_IMAGE_INIT";

const reducer = (state = initailState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case POPUP_GET_REQUEST: {
        draft.st_popupLoading = true;
        draft.st_popupDone = null;
        draft.st_popupError = false;
        break;
      }
      case POPUP_GET_SUCCESS: {
        draft.st_popupLoading = false;
        draft.st_popupDone = true;
        draft.popups = action.data;
        break;
      }
      case POPUP_GET_FAILURE: {
        draft.st_popupLoading = false;
        draft.st_popupDone = false;
        draft.st_popupError = action.error;
        break;
      }
      ///////////////////////////////////////////////////////

      case POPUP_IMAGE_UPLOAD_REQUEST: {
        draft.st_popupImageUploadLoading = true;
        draft.st_popupImageUploadDone = null;
        draft.st_popupImageUploadError = false;
        break;
      }
      case POPUP_IMAGE_UPLOAD_SUCCESS: {
        draft.st_popupImageUploadLoading = false;
        draft.st_popupImageUploadDone = true;
        draft.uploadImagePath = action.data.path;
        break;
      }
      case POPUP_IMAGE_UPLOAD_FAILURE: {
        draft.st_popupImageUploadLoading = false;
        draft.st_popupImageUploadDone = false;
        draft.st_popupImageUploadError = action.error;
        break;
      }
      ///////////////////////////////////////////////////////

      case POPUP_CREATE_REQUEST: {
        draft.st_popupCreateLoading = true;
        draft.st_popupCreateDone = null;
        draft.st_popupCreateError = false;
        break;
      }
      case POPUP_CREATE_SUCCESS: {
        draft.st_popupCreateLoading = false;
        draft.st_popupCreateDone = true;
        draft.uploadImagePath = null;
        break;
      }
      case POPUP_CREATE_FAILURE: {
        draft.st_popupCreateLoading = false;
        draft.st_popupCreateDone = false;
        draft.st_popupCreateError = action.error;
        break;
      }
      ///////////////////////////////////////////////////////
      case POPUP_DELETE_REQUEST: {
        draft.st_popupDeleteLoading = true;
        draft.st_popupDeleteDone = null;
        draft.st_popupDeleteError = false;
        break;
      }
      case POPUP_DELETE_SUCCESS: {
        draft.st_popupDeleteLoading = false;
        draft.st_popupDeleteDone = true;
        draft.uploadImagePath = null;
        break;
      }
      case POPUP_DELETE_FAILURE: {
        draft.st_popupDeleteLoading = false;
        draft.st_popupDeleteDone = false;
        draft.st_popupDeleteError = action.error;
        break;
      }
      ///////////////////////////////////////////////////////
      case POPUP_USE_UPDATE_REQUEST: {
        draft.st_popupUseUpdateLoading = true;
        draft.st_popupUseUpdateDone = null;
        draft.st_popupUseUpdateError = false;
        break;
      }
      case POPUP_USE_UPDATE_SUCCESS: {
        draft.st_popupUseUpdateLoading = false;
        draft.st_popupUseUpdateDone = true;
        draft.uploadImagePath = null;
        break;
      }
      case POPUP_USE_UPDATE_FAILURE: {
        draft.st_popupUseUpdateLoading = false;
        draft.st_popupUseUpdateDone = false;
        draft.st_popupUseUpdateError = action.error;
        break;
      }
      ///////////////////////////////////////////////////////
      case POPUP_UPDATE_REQUEST: {
        draft.st_popupUpdateLoading = true;
        draft.st_popupUpdateDone = null;
        draft.st_popupUpdateError = false;
        break;
      }
      case POPUP_UPDATE_SUCCESS: {
        draft.st_popupUpdateLoading = false;
        draft.st_popupUpdateDone = true;
        draft.uploadImagePath = null;
        break;
      }
      case POPUP_UPDATE_FAILURE: {
        draft.st_popupUpdateLoading = false;
        draft.st_popupUpdateDone = false;
        draft.st_popupUpdateError = action.error;
        break;
      }
      ///////////////////////////////////////////////////////

      case POPUP_CREATE_MODAL_TOGGLE: {
        draft.createModal = !draft.createModal;
        break;
      }
      ///////////////////////////////////////////////////////

      case POPUP_IMAGE_INIT: {
        draft.uploadImagePath = null;
        break;
      }
      ///////////////////////////////////////////////////////

      default:
        break;
    }
  });

export default reducer;
