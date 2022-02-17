import produce from "../util/produce";

export const initailState = {
  banners: null,
  viewModal: false,
  createModal: false,
  uploadBannerPath: null,
  //
  st_mainBannerLoading: false, // 메인배너 가져오기
  st_mainBannerDone: false,
  st_mainBannerError: null,
  //
  st_bannerUploadLoading: false, // 메인베너 이미지 업로드
  st_bannerUploadDone: false,
  st_bannerUploadError: null,
  //
  st_bannerUpdateLoading: false, // 메인베너 정보 수정
  st_bannerUpdateDone: false,
  st_bannerUpdateError: null,
  //
  st_bannerCreateLoading: false, // 메인베너 생성
  st_bannerCreateDone: false,
  st_bannerCreateError: null,
  //
  st_bannerDeleteLoading: false, // 메인베너 삭제
  st_bannerDeleteDone: false,
  st_bannerDeleteError: null,
};

export const MAIN_BANNER_REQUEST = "MAIN_BANNER_REQUEST";
export const MAIN_BANNER_SUCCESS = "MAIN_BANNER_SUCCESS";
export const MAIN_BANNER_FAILURE = "MAIN_BANNER_FAILURE";

export const BANNER_UPLOAD_REQUEST = "BANNER_UPLOAD_REQUEST";
export const BANNER_UPLOAD_SUCCESS = "BANNER_UPLOAD_SUCCESS";
export const BANNER_UPLOAD_FAILURE = "BANNER_UPLOAD_FAILURE";

export const BANNER_UPDATE_REQUEST = "BANNER_UPDATE_REQUEST";
export const BANNER_UPDATE_SUCCESS = "BANNER_UPDATE_SUCCESS";
export const BANNER_UPDATE_FAILURE = "BANNER_UPDATE_FAILURE";

export const BANNER_CREATE_REQUEST = "BANNER_CREATE_REQUEST";
export const BANNER_CREATE_SUCCESS = "BANNER_CREATE_SUCCESS";
export const BANNER_CREATE_FAILURE = "BANNER_CREATE_FAILURE";

export const BANNER_DELETE_REQUEST = "BANNER_DELETE_REQUEST";
export const BANNER_DELETE_SUCCESS = "BANNER_DELETE_SUCCESS";
export const BANNER_DELETE_FAILURE = "BANNER_DELETE_FAILURE";

export const VIEW_MODAL_REQUEST = "VIEW_MODAL_REQUEST";

export const VIEW_CREATE_MODAL_REQUEST = "VIEW_CREATE_MODAL_REQUEST";

export const UPLOAD_BANNER_INIT_REQUEST = "UPLOAD_BANNER_INIT_REQUEST";

const reducer = (state = initailState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case MAIN_BANNER_REQUEST: {
        draft.st_mainBannerLoading = true;
        draft.st_mainBannerDone = null;
        draft.st_mainBannerError = false;
        break;
      }
      case MAIN_BANNER_SUCCESS: {
        draft.st_mainBannerLoading = false;
        draft.st_mainBannerDone = true;
        draft.banners = action.data;
        break;
      }
      case MAIN_BANNER_FAILURE: {
        draft.st_mainBannerLoading = false;
        draft.st_mainBannerDone = false;
        draft.st_mainBannerError = action.error;
        break;
      }
      //////////////////////////////////////////////

      case BANNER_UPLOAD_REQUEST: {
        draft.st_bannerUploadLoading = true;
        draft.st_bannerUploadDone = null;
        draft.st_bannerUploadError = false;
        break;
      }
      case BANNER_UPLOAD_SUCCESS: {
        draft.st_bannerUploadLoading = false;
        draft.st_bannerUploadDone = true;
        draft.uploadBannerPath = action.data.path;
        break;
      }
      case BANNER_UPLOAD_FAILURE: {
        draft.st_bannerUploadLoading = false;
        draft.st_bannerUploadDone = false;
        draft.st_bannerUploadError = action.error;
        break;
      }
      //////////////////////////////////////////////

      case BANNER_UPDATE_REQUEST: {
        draft.st_bannerUpdateLoading = true;
        draft.st_bannerUpdateDone = null;
        draft.st_bannerUpdateError = false;
        break;
      }
      case BANNER_UPDATE_SUCCESS: {
        draft.st_bannerUpdateLoading = false;
        draft.st_bannerUpdateDone = true;
        draft.uploadBannerPath = null;
        break;
      }
      case BANNER_UPDATE_FAILURE: {
        draft.st_bannerUpdateLoading = false;
        draft.st_bannerUpdateDone = false;
        draft.st_bannerUpdateError = action.error;
        break;
      }
      //////////////////////////////////////////////

      case BANNER_CREATE_REQUEST: {
        draft.st_bannerCreateLoading = true;
        draft.st_bannerCreateDone = null;
        draft.st_bannerCreateError = false;
        break;
      }
      case BANNER_CREATE_SUCCESS: {
        draft.st_bannerCreateLoading = false;
        draft.st_bannerCreateDone = true;
        draft.uploadBannerPath = null;
        break;
      }
      case BANNER_CREATE_FAILURE: {
        draft.st_bannerCreateLoading = false;
        draft.st_bannerCreateDone = false;
        draft.st_bannerCreateError = action.error;
        break;
      }
      //////////////////////////////////////////////

      case BANNER_DELETE_REQUEST: {
        draft.st_bannerDeleteLoading = true;
        draft.st_bannerDeleteDone = null;
        draft.st_bannerDeleteError = false;
        break;
      }
      case BANNER_DELETE_SUCCESS: {
        draft.st_bannerDeleteLoading = false;
        draft.st_bannerDeleteDone = true;
        draft.uploadBannerPath = null;
        break;
      }
      case BANNER_DELETE_FAILURE: {
        draft.st_bannerDeleteLoading = false;
        draft.st_bannerDeleteDone = false;
        draft.st_bannerDeleteError = action.error;
        break;
      }
      //////////////////////////////////////////////

      case VIEW_MODAL_REQUEST: {
        draft.viewModal = !draft.viewModal;
        break;
      }
      //////////////////////////////////////////////

      case VIEW_CREATE_MODAL_REQUEST: {
        draft.createModal = !draft.createModal;
        break;
      }
      //////////////////////////////////////////////

      case UPLOAD_BANNER_INIT_REQUEST: {
        draft.uploadBannerPath = null;
        break;
      }
      //////////////////////////////////////////////

      default:
        break;
    }
  });

export default reducer;
