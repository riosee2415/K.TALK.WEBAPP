import produce from "../util/produce";

export const initailState = {
  companys: null,
  createModal: false, // create 모달 실행
  //
  st_companyLoading: false, // 하단 정보 가져오기
  st_companyDone: false,
  st_companyError: null,
  //
  st_companyCreateLoading: false, // 하단 정보 추가하기
  st_companyCreateDone: false,
  st_companyCreateError: null,
  //
  st_companyDeleteLoading: false, // 하단 정보 삭제하기
  st_companyDeleteDone: false,
  st_companyDeleteError: null,
  //
  st_companyUpdateLoading: false, // 하단 정보 수정하기
  st_companyUpdateDone: false,
  st_companyUpdateError: null,
};

export const COMPANY_GET_REQUEST = "COMPANY_GET_REQUEST";
export const COMPANY_GET_SUCCESS = "COMPANY_GET_SUCCESS";
export const COMPANY_GET_FAILURE = "COMPANY_GET_FAILURE";

export const COMPANY_CREATE_REQUEST = "COMPANY_CREATE_REQUEST";
export const COMPANY_CREATE_SUCCESS = "COMPANY_CREATE_SUCCESS";
export const COMPANY_CREATE_FAILURE = "COMPANY_CREATE_FAILURE";

export const COMPANY_DELETE_REQUEST = "COMPANY_DELETE_REQUEST";
export const COMPANY_DELETE_SUCCESS = "COMPANY_DELETE_SUCCESS";
export const COMPANY_DELETE_FAILURE = "COMPANY_DELETE_FAILURE";

export const COMPANY_UPDATE_REQUEST = "COMPANY_UPDATE_REQUEST";
export const COMPANY_UPDATE_SUCCESS = "COMPANY_UPDATE_SUCCESS";
export const COMPANY_UPDATE_FAILURE = "COMPANY_UPDATE_FAILURE";

export const COMPANY_CREATE_MODAL_TOGGLE = "COMPANY_CREATE_MODAL_TOGGLE";

const reducer = (state = initailState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case COMPANY_GET_REQUEST: {
        draft.st_companyLoading = true;
        draft.st_companyDone = null;
        draft.st_companyError = false;
        break;
      }
      case COMPANY_GET_SUCCESS: {
        draft.st_companyLoading = false;
        draft.st_companyDone = true;
        draft.companys = action.data;
        break;
      }
      case COMPANY_GET_FAILURE: {
        draft.st_companyLoading = false;
        draft.st_companyDone = false;
        draft.st_companyError = action.error;
        break;
      }
      ///////////////////////////////////////////////////////

      case COMPANY_CREATE_REQUEST: {
        draft.st_companyCreateLoading = true;
        draft.st_companyCreateDone = null;
        draft.st_companyCreateError = false;
        break;
      }
      case COMPANY_CREATE_SUCCESS: {
        draft.st_companyCreateLoading = false;
        draft.st_companyCreateDone = true;
        draft.uploadImagePath = null;
        break;
      }
      case COMPANY_CREATE_FAILURE: {
        draft.st_companyCreateLoading = false;
        draft.st_companyCreateDone = false;
        draft.st_companyCreateError = action.error;
        break;
      }

      ///////////////////////////////////////////////////////

      case COMPANY_DELETE_REQUEST: {
        draft.st_companyDeleteLoading = true;
        draft.st_companyDeleteDone = null;
        draft.st_companyDeleteError = false;
        break;
      }
      case COMPANY_DELETE_SUCCESS: {
        draft.st_companyDeleteLoading = false;
        draft.st_companyDeleteDone = true;
        draft.uploadImagePath = null;
        break;
      }
      case COMPANY_DELETE_FAILURE: {
        draft.st_companyDeleteLoading = false;
        draft.st_companyDeleteDone = false;
        draft.st_companyDeleteError = action.error;
        break;
      }

      ///////////////////////////////////////////////////////

      case COMPANY_UPDATE_REQUEST: {
        draft.st_companyUpdateLoading = true;
        draft.st_companyUpdateDone = null;
        draft.st_companyUpdateError = false;
        break;
      }
      case COMPANY_UPDATE_SUCCESS: {
        draft.st_companyUpdateLoading = false;
        draft.st_companyUpdateDone = true;
        draft.uploadImagePath = null;
        break;
      }
      case COMPANY_UPDATE_FAILURE: {
        draft.st_companyUpdateLoading = false;
        draft.st_companyUpdateDone = false;
        draft.st_companyUpdateError = action.error;
        break;
      }

      ///////////////////////////////////////////////////////

      case COMPANY_CREATE_MODAL_TOGGLE: {
        draft.createModal = !draft.createModal;
        break;
      }
      ///////////////////////////////////////////////////////

      default:
        break;
    }
  });

export default reducer;
