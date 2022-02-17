import produce from "../util/produce";

export const initailState = {
  gellerys: null,
  uploadGalleryPath: null,

  maxPage: 1,
  createModal: false,
  detailModal: false,
  //
  st_galleryListLoading: false, // 갤러리 가져오기
  st_galleryListDone: false,
  st_galleryListError: null,
  //
  st_galleryCreateLoading: false, // 갤러리 만들기
  st_galleryCreateDone: false,
  st_galleryCreateError: null,
  //
  st_galleryUpdateLoading: false, // 갤러리 업데이트
  st_galleryUpdateDone: false,
  st_galleryUpdateError: null,
  //
  st_galleryDeleteLoading: false, // 갤러리 삭제
  st_galleryDeleteDone: false,
  st_galleryDeleteError: null,
  //
};

export const GALLERY_LIST_REQUEST = "GALLERY_LIST_REQUEST";
export const GALLERY_LIST_SUCCESS = "GALLERY_LIST_SUCCESS";
export const GALLERY_LIST_FAILURE = "GALLERY_LIST_FAILURE";

export const GALLERY_UPLOAD_REQUEST = "GALLERY_UPLOAD_REQUEST";
export const GALLERY_UPLOAD_SUCCESS = "GALLERY_UPLOAD_SUCCESS";
export const GALLERY_UPLOAD_FAILURE = "GALLERY_UPLOAD_FAILURE";

export const GALLERY_CREATE_REQUEST = "GALLERY_CREATE_REQUEST";
export const GALLERY_CREATE_SUCCESS = "GALLERY_CREATE_SUCCESS";
export const GALLERY_CREATE_FAILURE = "GALLERY_CREATE_FAILURE";

export const GALLERY_UPDATE_REQUEST = "GALLERY_UPDATE_REQUEST";
export const GALLERY_UPDATE_SUCCESS = "GALLERY_UPDATE_SUCCESS";
export const GALLERY_UPDATE_FAILURE = "GALLERY_UPDATE_FAILURE";

export const GALLERY_DELETE_REQUEST = "GALLERY_DELETE_REQUEST";
export const GALLERY_DELETE_SUCCESS = "GALLERY_DELETE_SUCCESS";
export const GALLERY_DELETE_FAILURE = "GALLERY_DELETE_FAILURE";

export const CREATE_MODAL_OPEN_REQUEST = "CREATE_MODAL_OPEN_REQUEST";
export const CREATE_MODAL_CLOSE_REQUEST = "CREATE_MODAL_CLOSE_REQUEST";

export const DETAIL_MODAL_OPEN_REQUEST = "DETAIL_MODAL_OPEN_REQUEST";
export const DETAIL_MODAL_CLOSE_REQUEST = "DETAIL_MODAL_CLOSE_REQUEST";

export const UPDATE_GALLERY_PATH = "UPDATE_GALLERY_PATH";

const reducer = (state = initailState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case GALLERY_LIST_REQUEST: {
        draft.st_galleryListLoading = true;
        draft.st_galleryListDone = null;
        draft.st_galleryListError = false;
        break;
      }
      case GALLERY_LIST_SUCCESS: {
        draft.st_galleryListLoading = false;
        draft.st_galleryListDone = true;
        draft.gallerys = action.data.gallerys;
        draft.maxPage = action.data.lastPage;
        break;
      }
      case GALLERY_LIST_FAILURE: {
        draft.st_galleryListLoading = false;
        draft.st_galleryListDone = false;
        draft.st_galleryListError = action.error;
        break;
      }

      //////////////////////////////////////////////
      case GALLERY_UPLOAD_REQUEST: {
        draft.st_galleryUploadLoading = true;
        draft.st_galleryUploadDone = null;
        draft.st_galleryUploadError = false;
        break;
      }
      case GALLERY_UPLOAD_SUCCESS: {
        draft.st_galleryUploadLoading = false;
        draft.st_galleryUploadDone = true;
        draft.uploadGalleryPath = action.data.path;
        break;
      }
      case GALLERY_UPLOAD_FAILURE: {
        draft.st_galleryUploadLoading = false;
        draft.st_galleryUploadDone = false;
        draft.st_galleryUploadError = action.error;
        break;
      }

      ///////////////////////////////////////////////////////
      case GALLERY_CREATE_REQUEST: {
        draft.st_galleryCreateLoading = true;
        draft.st_galleryCreateDone = null;
        draft.st_galleryCreateError = false;
        break;
      }
      case GALLERY_CREATE_SUCCESS: {
        draft.st_galleryCreateLoading = false;
        draft.st_galleryCreateDone = true;
        draft.uploadGalleryPath = null;
        break;
      }
      case GALLERY_CREATE_FAILURE: {
        draft.st_galleryCreateLoading = false;
        draft.st_galleryCreateDone = false;
        draft.st_galleryCreateError = action.error;
        break;
      }
      ///////////////////////////////////////////////////////
      case GALLERY_UPDATE_REQUEST: {
        draft.st_galleryUpdateLoading = true;
        draft.st_galleryUpdateDone = null;
        draft.st_galleryUpdateError = false;
        break;
      }
      case GALLERY_UPDATE_SUCCESS: {
        draft.st_galleryUpdateLoading = false;
        draft.st_galleryUpdateDone = true;
        break;
      }
      case GALLERY_UPDATE_FAILURE: {
        draft.st_galleryUpdateLoading = false;
        draft.st_galleryUpdateDone = false;
        draft.st_galleryUpdateError = action.error;
        break;
      }
      ///////////////////////////////////////////////////////
      case GALLERY_DELETE_REQUEST: {
        draft.st_galleryDeleteLoading = true;
        draft.st_galleryDeleteDone = null;
        draft.st_galleryDeleteError = false;
        break;
      }
      case GALLERY_DELETE_SUCCESS: {
        draft.st_galleryDeleteLoading = false;
        draft.st_galleryDeleteDone = true;
        break;
      }
      case GALLERY_DELETE_FAILURE: {
        draft.st_galleryDeleteLoading = false;
        draft.st_galleryDeleteDone = false;
        draft.st_galleryDeleteError = action.error;
        break;
      }
      ///////////////////////////////////////////////////////
      ///////////////////////////////////////////////////////
      ///////////////////////////////////////////////////////

      case CREATE_MODAL_OPEN_REQUEST:
        draft.createModal = true;
        break;

      case CREATE_MODAL_CLOSE_REQUEST:
        draft.createModal = false;
        break;
      ///////////////////////////////////////////////////////

      case DETAIL_MODAL_OPEN_REQUEST:
        draft.detailModal = true;
        break;

      case DETAIL_MODAL_CLOSE_REQUEST:
        draft.detailModal = false;
        break;
      ///////////////////////////////////////////////////////
      case UPDATE_GALLERY_PATH:
        draft.uploadGalleryPath = action.data;
        break;

      default:
        break;
    }
  });

export default reducer;
