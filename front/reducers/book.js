import produce from "../util/produce";

export const initailState = {
  bookList: null,
  bookDetail: null,

  bookMaxLength: 1,

  bookAllList: null,

  st_bookListLoading: false,
  st_bookListDone: false,
  st_bookListError: null,
  //
  st_bookDetailLoading: false,
  st_bookDetailDone: false,
  st_bookDetailError: null,
  //
  st_bookUploadLoading: false,
  st_bookUploadDone: false,
  st_bookUploadError: null,
  //
  st_bookUploadThLoading: false,
  st_bookUploadThDone: false,
  st_bookUploadThError: null,
  //
  st_bookCreateLoading: false,
  st_bookCreateDone: false,
  st_bookCreateError: null,
  //
  st_bookUpdateLoading: false,
  st_bookUpdateDone: false,
  st_bookUpdateError: null,
  //
  st_bookDeleteLoading: false,
  st_bookDeleteDone: false,
  st_bookDeleteError: null,
  //
  st_bookAdminUpdateLoading: false,
  st_bookAdminUpdateDone: false,
  st_bookAdminUpdateError: null,
  //
  st_bookAdminDeleteLoading: false,
  st_bookAdminDeleteDone: false,
  st_bookAdminDeleteError: null,
  //
  st_bookAllListLoading: false,
  st_bookAllListDone: false,
  st_bookAllListError: null,
  //
  createModal: null,
  //
  uploadPath: null,
  uploadPathTh: null,
  //
};

export const BOOK_LIST_REQUEST = "BOOK_LIST_REQUEST";
export const BOOK_LIST_SUCCESS = "BOOK_LIST_SUCCESS";
export const BOOK_LIST_FAILURE = "BOOK_LIST_FAILURE";
//
export const BOOK_DETAIL_REQUEST = "BOOK_DETAIL_REQUEST";
export const BOOK_DETAIL_SUCCESS = "BOOK_DETAIL_SUCCESS";
export const BOOK_DETAIL_FAILURE = "BOOK_DETAIL_FAILURE";
//
export const BOOK_UPLOAD_REQUEST = "BOOK_UPLOAD_REQUEST";
export const BOOK_UPLOAD_SUCCESS = "BOOK_UPLOAD_SUCCESS";
export const BOOK_UPLOAD_FAILURE = "BOOK_UPLOAD_FAILURE";
//
export const BOOK_UPLOAD_TH_REQUEST = "BOOK_UPLOAD_TH_REQUEST";
export const BOOK_UPLOAD_TH_SUCCESS = "BOOK_UPLOAD_TH_SUCCESS";
export const BOOK_UPLOAD_TH_FAILURE = "BOOK_UPLOAD_TH_FAILURE";
//
export const BOOK_CREATE_REQUEST = "BOOK_CREATE_REQUEST";
export const BOOK_CREATE_SUCCESS = "BOOK_CREATE_SUCCESS";
export const BOOK_CREATE_FAILURE = "BOOK_CREATE_FAILURE";
//
export const BOOK_UPDATE_REQUEST = "BOOK_UPDATE_REQUEST";
export const BOOK_UPDATE_SUCCESS = "BOOK_UPDATE_SUCCESS";
export const BOOK_UPDATE_FAILURE = "BOOK_UPDATE_FAILURE";
//
export const BOOK_DELETE_REQUEST = "BOOK_DELETE_REQUEST";
export const BOOK_DELETE_SUCCESS = "BOOK_DELETE_SUCCESS";
export const BOOK_DELETE_FAILURE = "BOOK_DELETE_FAILURE";
//
export const BOOK_ADMIN_UPDATE_REQUEST = "BOOK_ADMIN_UPDATE_REQUEST";
export const BOOK_ADMIN_UPDATE_SUCCESS = "BOOK_ADMIN_UPDATE_SUCCESS";
export const BOOK_ADMIN_UPDATE_FAILURE = "BOOK_ADMIN_UPDATE_FAILURE";
//
export const BOOK_ADMIN_DELETE_REQUEST = "BOOK_ADMIN_DELETE_REQUEST";
export const BOOK_ADMIN_DELETE_SUCCESS = "BOOK_ADMIN_DELETE_SUCCESS";
export const BOOK_ADMIN_DELETE_FAILURE = "BOOK_ADMIN_DELETE_FAILURE";
//

export const BOOK_ALL_LIST_REQUEST = "BOOK_ALL_LIST_REQUEST";
export const BOOK_ALL_LIST_SUCCESS = "BOOK_ALL_LIST_SUCCESS";
export const BOOK_ALL_LIST_FAILURE = "BOOK_ALL_LIST_FAILURE";
//

export const CREATE_MODAL_OPEN_REQUEST = "CREATE_MODAL_OPEN_REQUEST";
export const CREATE_MODAL_CLOSE_REQUEST = "CREATE_MODAL_CLOSE_REQUEST";
export const BOOK_FILE_INIT = "BOOK_FILE_INIT";

const reducer = (state = initailState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case BOOK_LIST_REQUEST: {
        draft.st_bookListLoading = true;
        draft.st_bookListDone = null;
        draft.st_bookListError = false;
        break;
      }
      case BOOK_LIST_SUCCESS: {
        draft.st_bookListLoading = false;
        draft.st_bookListDone = true;
        draft.bookList = action.data.books;
        draft.bookMaxLength = action.data.lastPage;
        break;
      }
      case BOOK_LIST_FAILURE: {
        draft.st_bookListLoading = false;
        draft.st_bookListDone = false;
        draft.st_bookListError = action.error;
        break;
      }
      ///////////////////////////////////////////////////////
      case BOOK_DETAIL_REQUEST: {
        draft.st_bookDetailLoading = true;
        draft.st_bookDetailDone = null;
        draft.st_bookDetailError = false;
        break;
      }
      case BOOK_DETAIL_SUCCESS: {
        draft.st_bookDetailLoading = false;
        draft.st_bookDetailDone = true;
        break;
      }
      case BOOK_DETAIL_FAILURE: {
        draft.st_bookDetailLoading = false;
        draft.st_bookDetailDone = false;
        draft.st_bookDetailError = action.error;
        break;
      }
      ///////////////////////////////////////////////////////
      case BOOK_UPLOAD_REQUEST: {
        draft.st_bookUploadLoading = true;
        draft.st_bookUploadDone = null;
        draft.st_bookUploadError = false;
        break;
      }
      case BOOK_UPLOAD_SUCCESS: {
        draft.st_bookUploadLoading = false;
        draft.st_bookUploadDone = true;
        draft.uploadPath = action.data.path;
        break;
      }
      case BOOK_UPLOAD_FAILURE: {
        draft.st_bookUploadLoading = false;
        draft.st_bookUploadDone = false;
        draft.st_bookUploadError = action.error;
        break;
      }
      ///////////////////////////////////////////////////////
      case BOOK_UPLOAD_TH_REQUEST: {
        draft.st_bookUploadThLoading = true;
        draft.st_bookUploadThDone = null;
        draft.st_bookUploadThError = false;
        break;
      }
      case BOOK_UPLOAD_TH_SUCCESS: {
        draft.st_bookUploadThLoading = false;
        draft.st_bookUploadThDone = true;
        draft.uploadPathTh = action.data.path;
        break;
      }
      case BOOK_UPLOAD_TH_FAILURE: {
        draft.st_bookUploadThLoading = false;
        draft.st_bookUploadThDone = false;
        draft.st_bookUploadThError = action.error;
        break;
      }
      ///////////////////////////////////////////////////////

      case BOOK_CREATE_REQUEST: {
        draft.st_bookCreateLoading = true;
        draft.st_bookCreateDone = null;
        draft.st_bookCreateError = false;
        break;
      }
      case BOOK_CREATE_SUCCESS: {
        draft.st_bookCreateLoading = false;
        draft.st_bookCreateDone = true;
        break;
      }
      case BOOK_CREATE_FAILURE: {
        draft.st_bookCreateLoading = false;
        draft.st_bookCreateDone = false;
        draft.st_bookCreateError = action.error;
        break;
      }
      ///////////////////////////////////////////////////////

      case BOOK_UPDATE_REQUEST: {
        draft.st_bookUpdateLoading = true;
        draft.st_bookUpdateDone = null;
        draft.st_bookUpdateError = false;
        break;
      }
      case BOOK_UPDATE_SUCCESS: {
        draft.st_bookUpdateLoading = false;
        draft.st_bookUpdateDone = true;

        break;
      }
      case BOOK_UPDATE_FAILURE: {
        draft.st_bookUpdateLoading = false;
        draft.st_bookUpdateDone = false;
        draft.st_bookUpdateError = action.error;
        break;
      }
      ///////////////////////////////////////////////////////

      case BOOK_DELETE_REQUEST: {
        draft.st_bookDeleteLoading = true;
        draft.st_bookDeleteDone = null;
        draft.st_bookDeleteError = false;
        break;
      }
      case BOOK_DELETE_SUCCESS: {
        draft.st_bookDeleteLoading = false;
        draft.st_bookDeleteDone = true;
        break;
      }
      case BOOK_DELETE_FAILURE: {
        draft.st_bookDeleteLoading = false;
        draft.st_bookDeleteDone = false;
        draft.st_bookDeleteError = action.error;
        break;
      }
      ///////////////////////////////////////////////////////

      case BOOK_ADMIN_UPDATE_REQUEST: {
        draft.st_bookAdminUpdateLoading = true;
        draft.st_bookAdminUpdateDone = null;
        draft.st_bookAdminUpdateError = false;
        break;
      }
      case BOOK_ADMIN_UPDATE_SUCCESS: {
        draft.st_bookAdminUpdateLoading = false;
        draft.st_bookAdminUpdateDone = true;

        break;
      }
      case BOOK_ADMIN_UPDATE_FAILURE: {
        draft.st_bookAdminUpdateLoading = false;
        draft.st_bookAdminUpdateDone = false;
        draft.st_bookAdminUpdateError = action.error;
        break;
      }
      ///////////////////////////////////////////////////////

      case BOOK_ADMIN_DELETE_REQUEST: {
        draft.st_bookAdminDeleteLoading = true;
        draft.st_bookAdminDeleteDone = null;
        draft.st_bookAdminDeleteError = false;
        break;
      }
      case BOOK_ADMIN_DELETE_SUCCESS: {
        draft.st_bookAdminDeleteLoading = false;
        draft.st_bookAdminDeleteDone = true;
        break;
      }
      case BOOK_ADMIN_DELETE_FAILURE: {
        draft.st_bookAdminDeleteLoading = false;
        draft.st_bookAdminDeleteDone = false;
        draft.st_bookAdminDeleteError = action.error;
        break;
      }

      ///////////////////////////////////////////////////////

      case BOOK_ALL_LIST_REQUEST: {
        draft.st_bookAllListLoading = true;
        draft.st_bookAllListDone = null;
        draft.st_bookAllListError = false;
        break;
      }
      case BOOK_ALL_LIST_SUCCESS: {
        draft.st_bookAllListLoading = false;
        draft.st_bookAllListDone = true;
        draft.bookAllList = action.data;
        break;
      }
      case BOOK_ALL_LIST_FAILURE: {
        draft.st_bookAllListLoading = false;
        draft.st_bookAllListDone = false;
        draft.st_bookAllListError = action.error;
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

      case BOOK_FILE_INIT:
        draft.uploadPath = null;
        draft.uploadPathTh = null;
        break;

      default:
        break;
    }
  });

export default reducer;
