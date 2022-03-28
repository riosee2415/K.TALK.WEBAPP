import produce from "../util/produce";

export const initailState = {
  bookFolderList: null,
  bookList: null,
  bookDetail: null,

  st_bookFolderListLoading: false,
  st_bookFolderListDone: false,
  st_bookFolderListError: null,
  //
  st_bookFolderCreateLoading: false,
  st_bookFolderCreateDone: false,
  st_bookFolderCreateError: null,
  //
  st_bookFolderUpdateLoading: false,
  st_bookFolderUpdateDone: false,
  st_bookFolderUpdateError: null,
  //
  st_bookFolderDeleteLoading: false,
  st_bookFolderDeleteDone: false,
  st_bookFolderDeleteError: null,
  //
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
  createModal: null,
  //
  uploadPath: null,
  //
};

export const BOOK_FOLDER_LIST_REQUEST = "BOOK_FOLDER_LIST_REQUEST";
export const BOOK_FOLDER_LIST_SUCCESS = "BOOK_FOLDER_LIST_SUCCESS";
export const BOOK_FOLDER_LIST_FAILURE = "BOOK_FOLDER_LIST_FAILURE";
//
export const BOOK_FOLDER_CREATE_REQUEST = "BOOK_FOLDER_CREATE_REQUEST";
export const BOOK_FOLDER_CREATE_SUCCESS = "BOOK_FOLDER_CREATE_SUCCESS";
export const BOOK_FOLDER_CREATE_FAILURE = "BOOK_FOLDER_CREATE_FAILURE";
//
export const BOOK_FOLDER_UPDATE_REQUEST = "BOOK_FOLDER_UPDATE_REQUEST";
export const BOOK_FOLDER_UPDATE_SUCCESS = "BOOK_FOLDER_UPDATE_SUCCESS";
export const BOOK_FOLDER_UPDATE_FAILURE = "BOOK_FOLDER_UPDATE_FAILURE";
//
export const BOOK_FOLDER_DELETE_REQUEST = "BOOK_FOLDER_DELETE_REQUEST";
export const BOOK_FOLDER_DELETE_SUCCESS = "BOOK_FOLDER_DELETE_SUCCESS";
export const BOOK_FOLDER_DELETE_FAILURE = "BOOK_FOLDER_DELETE_FAILURE";
//
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
export const CREATE_MODAL_OPEN_REQUEST = "CREATE_MODAL_OPEN_REQUEST";
export const CREATE_MODAL_CLOSE_REQUEST = "CREATE_MODAL_CLOSE_REQUEST";
export const BOOK_FILE_INIT = "BOOK_FILE_INIT";

const reducer = (state = initailState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case BOOK_FOLDER_LIST_REQUEST: {
        draft.st_bookFolderListLoading = true;
        draft.st_bookFolderListDone = null;
        draft.st_bookFolderListError = false;
        break;
      }
      case BOOK_FOLDER_LIST_SUCCESS: {
        draft.st_bookFolderListLoading = false;
        draft.st_bookFolderListDone = true;
        draft.bookFolderList = action.data;
        break;
      }
      case BOOK_FOLDER_LIST_FAILURE: {
        draft.st_bookFolderListLoading = false;
        draft.st_bookFolderListDone = false;
        draft.st_bookFolderListError = action.error;
        break;
      }
      ///////////////////////////////////////////////////////

      case BOOK_FOLDER_CREATE_REQUEST: {
        draft.st_bookFolderCreateLoading = true;
        draft.st_bookFolderCreateDone = null;
        draft.st_bookFolderCreateError = false;
        break;
      }
      case BOOK_FOLDER_CREATE_SUCCESS: {
        draft.st_bookFolderCreateLoading = false;
        draft.st_bookFolderCreateDone = true;

        break;
      }
      case BOOK_FOLDER_CREATE_FAILURE: {
        draft.st_bookFolderCreateLoading = false;
        draft.st_bookFolderCreateDone = false;
        draft.st_bookFolderCreateError = action.error;
        break;
      }
      ///////////////////////////////////////////////////////

      case BOOK_FOLDER_UPDATE_REQUEST: {
        draft.st_bookFolderUpdateLoading = true;
        draft.st_bookFolderUpdateDone = null;
        draft.st_bookFolderUpdateError = false;
        break;
      }
      case BOOK_FOLDER_UPDATE_SUCCESS: {
        draft.st_bookFolderUpdateLoading = false;
        draft.st_bookFolderUpdateDone = true;

        break;
      }
      case BOOK_FOLDER_UPDATE_FAILURE: {
        draft.st_bookFolderUpdateLoading = false;
        draft.st_bookFolderUpdateDone = false;
        draft.st_bookFolderUpdateError = action.error;
        break;
      }
      ///////////////////////////////////////////////////////

      case BOOK_FOLDER_DELETE_REQUEST: {
        draft.st_bookFolderDeleteLoading = true;
        draft.st_bookFolderDeleteDone = null;
        draft.st_bookFolderDeleteError = false;
        break;
      }
      case BOOK_FOLDER_DELETE_SUCCESS: {
        draft.st_bookFolderDeleteLoading = false;
        draft.st_bookFolderDeleteDone = true;
        break;
      }
      case BOOK_FOLDER_DELETE_FAILURE: {
        draft.st_bookFolderDeleteLoading = false;
        draft.st_bookFolderDeleteDone = false;
        draft.st_bookFolderDeleteError = action.error;
        break;
      }
      ///////////////////////////////////////////////////////
      case BOOK_LIST_REQUEST: {
        draft.st_bookListLoading = true;
        draft.st_bookListDone = null;
        draft.st_bookListError = false;
        break;
      }
      case BOOK_LIST_SUCCESS: {
        draft.st_bookListLoading = false;
        draft.st_bookListDone = true;
        draft.bookList = action.data.list;
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
        draft.uploadPath = action.data;
        break;
      }
      case BOOK_UPLOAD_FAILURE: {
        draft.st_bookUploadLoading = false;
        draft.st_bookUploadDone = false;
        draft.st_bookUploadError = action.error;
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

      case CREATE_MODAL_OPEN_REQUEST:
        draft.createModal = true;
        break;

      case CREATE_MODAL_CLOSE_REQUEST:
        draft.createModal = false;
        break;
      ///////////////////////////////////////////////////////

      case BOOK_FILE_INIT:
        draft.uploadPath = null;
        break;

      default:
        break;
    }
  });

export default reducer;
