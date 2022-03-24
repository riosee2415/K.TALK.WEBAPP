import produce from "../util/produce";

export const initailState = {
  noticeLectureList: null,
  noticeLectureLastPage: 1,

  noticeList: null,
  noticeLastPage: 1,

  noticeAdminList: null,

  createModal: false,
  detailModal: false,
  //
  st_noticeLectureListLoading: false,
  st_noticeLectureListDone: false,
  st_noticeLectureListError: null,
  //
  st_noticeListLoading: false,
  st_noticeListDone: false,
  st_noticeListError: null,
  //
  st_noticeDetailLoading: false,
  st_noticeDetailDone: false,
  st_noticeDetailError: null,
  //
  st_noticeAdminListLoading: false,
  st_noticeAdminListDone: false,
  st_noticeAdminListError: null,
  //
  st_noticeCreateLoading: false,
  st_noticeCreateDone: false,
  st_noticeCreateError: null,
  //
  st_noticeAdminCreateLoading: false,
  st_noticeAdminCreateDone: false,
  st_noticeAdminCreateError: null,
  //
  st_noticeUpdateLoading: false,
  st_noticeUpdateDone: false,
  st_noticeUpdateError: null,
  //
  st_noticeDeleteLoading: false,
  st_noticeDeleteDone: false,
  st_noticeDeleteError: null,
  //
  st_noticeNextLoading: false,
  st_noticeNextDone: false,
  st_noticeNextError: null,
  //
  st_noticePrevLoading: false,
  st_noticePrevDone: false,
  st_noticePrevError: null,
};

export const NOTICE_LECTURE_LIST_REQUEST = "NOTICE_LECTURE_LIST_REQUEST";
export const NOTICE_LECTURE_LIST_SUCCESS = "NOTICE_LECTURE_LIST_SUCCESS";
export const NOTICE_LECTURE_LIST_FAILURE = "NOTICE_LECTURE_LIST_FAILURE";
//
export const NOTICE_LIST_REQUEST = "NOTICE_LIST_REQUEST";
export const NOTICE_LIST_SUCCESS = "NOTICE_LIST_SUCCESS";
export const NOTICE_LIST_FAILURE = "NOTICE_LIST_FAILURE";
//
export const NOTICE_DETAIL_REQUEST = "NOTICE_DETAIL_REQUEST";
export const NOTICE_DETAIL_SUCCESS = "NOTICE_DETAIL_SUCCESS";
export const NOTICE_DETAIL_FAILURE = "NOTICE_DETAIL_FAILURE";
//
export const NOTICE_ADMIN_LIST_REQUEST = "NOTICE_ADMIN_LIST_REQUEST";
export const NOTICE_ADMIN_LIST_SUCCESS = "NOTICE_ADMIN_LIST_SUCCESS";
export const NOTICE_ADMIN_LIST_FAILURE = "NOTICE_ADMIN_LIST_FAILURE";
//
export const NOTICE_CREATE_REQUEST = "NOTICE_CREATE_REQUEST";
export const NOTICE_CREATE_SUCCESS = "NOTICE_CREATE_SUCCESS";
export const NOTICE_CREATE_FAILURE = "NOTICE_CREATE_FAILURE";
//
export const NOTICE_ADMIN_CREATE_REQUEST = "NOTICE_ADMIN_CREATE_REQUEST";
export const NOTICE_ADMIN_CREATE_SUCCESS = "NOTICE_ADMIN_CREATE_SUCCESS";
export const NOTICE_ADMIN_CREATE_FAILURE = "NOTICE_ADMIN_CREATE_FAILURE";
//
export const NOTICE_UPDATE_REQUEST = "NOTICE_UPDATE_REQUEST";
export const NOTICE_UPDATE_SUCCESS = "NOTICE_UPDATE_SUCCESS";
export const NOTICE_UPDATE_FAILURE = "NOTICE_UPDATE_FAILURE";
//
export const NOTICE_DELETE_REQUEST = "NOTICE_DELETE_REQUEST";
export const NOTICE_DELETE_SUCCESS = "NOTICE_DELETE_SUCCESS";
export const NOTICE_DELETE_FAILURE = "NOTICE_DELETE_FAILURE";
//
export const NOTICE_NEXT_REQUEST = "NOTICE_NEXT_REQUEST";
export const NOTICE_NEXT_SUCCESS = "NOTICE_NEXT_SUCCESS";
export const NOTICE_NEXT_FAILURE = "NOTICE_NEXT_FAILURE";
//
export const NOTICE_PREV_REQUEST = "NOTICE_PREV_REQUEST";
export const NOTICE_PREV_SUCCESS = "NOTICE_PREV_SUCCESS";
export const NOTICE_PREV_FAILURE = "NOTICE_PREV_FAILURE";
//
export const CREATE_MODAL_OPEN_REQUEST = "CREATE_MODAL_OPEN_REQUEST";
export const CREATE_MODAL_CLOSE_REQUEST = "CREATE_MODAL_CLOSE_REQUEST";

export const DETAIL_MODAL_OPEN_REQUEST = "DETAIL_MODAL_OPEN_REQUEST";
export const DETAIL_MODAL_CLOSE_REQUEST = "DETAIL_MODAL_CLOSE_REQUEST";

const reducer = (state = initailState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case NOTICE_LECTURE_LIST_REQUEST: {
        draft.st_noticeListLoading = true;
        draft.st_noticeListDone = null;
        draft.st_noticeListError = false;
        break;
      }
      case NOTICE_LECTURE_LIST_SUCCESS: {
        draft.st_noticeListLoading = false;
        draft.st_noticeListDone = true;
        draft.notices = action.data.notices;
        draft.maxPage = action.data.lastPage;
        break;
      }
      case NOTICE_LECTURE_LIST_FAILURE: {
        draft.st_noticeListLoading = false;
        draft.st_noticeListDone = false;
        draft.st_noticeListError = action.error;
        break;
      }

      ///////////////////////////////////////////////////////

      case NOTICE_LIST_REQUEST: {
        draft.st_noticeListLoading = true;
        draft.st_noticeListDone = null;
        draft.st_noticeListError = false;
        break;
      }
      case NOTICE_LIST_SUCCESS: {
        draft.st_noticeListLoading = false;
        draft.st_noticeListDone = true;
        draft.notices = action.data.notices;
        draft.maxPage = action.data.lastPage;
        break;
      }
      case NOTICE_LIST_FAILURE: {
        draft.st_noticeListLoading = false;
        draft.st_noticeListDone = false;
        draft.st_noticeListError = action.error;
        break;
      }

      ///////////////////////////////////////////////////////

      case NOTICE_DETAIL_REQUEST: {
        draft.st_noticeListLoading = true;
        draft.st_noticeListDone = null;
        draft.st_noticeListError = false;
        break;
      }
      case NOTICE_DETAIL_SUCCESS: {
        draft.st_noticeListLoading = false;
        draft.st_noticeListDone = true;
        draft.notices = action.data.notices;
        draft.maxPage = action.data.lastPage;
        break;
      }
      case NOTICE_DETAIL_FAILURE: {
        draft.st_noticeListLoading = false;
        draft.st_noticeListDone = false;
        draft.st_noticeListError = action.error;
        break;
      }

      ///////////////////////////////////////////////////////

      case NOTICE_ADMIN_LIST_REQUEST: {
        draft.st_noticeListLoading = true;
        draft.st_noticeListDone = null;
        draft.st_noticeListError = false;
        break;
      }
      case NOTICE_ADMIN_LIST_SUCCESS: {
        draft.st_noticeListLoading = false;
        draft.st_noticeListDone = true;
        draft.notices = action.data.notices;
        draft.maxPage = action.data.lastPage;
        break;
      }
      case NOTICE_ADMIN_LIST_FAILURE: {
        draft.st_noticeListLoading = false;
        draft.st_noticeListDone = false;
        draft.st_noticeListError = action.error;
        break;
      }

      ///////////////////////////////////////////////////////

      case NOTICE_UPDATE_REQUEST: {
        draft.st_noticeUpdateLoading = true;
        draft.st_noticeUpdateDone = null;
        draft.st_noticeUpdateError = false;
        break;
      }
      case NOTICE_UPDATE_SUCCESS: {
        draft.st_noticeUpdateLoading = false;
        draft.st_noticeUpdateDone = true;
        draft.notices = action.data.notices;
        draft.maxPage = action.data.lastPage;
        break;
      }
      case NOTICE_UPDATE_FAILURE: {
        draft.st_noticeUpdateLoading = false;
        draft.st_noticeUpdateDone = false;
        draft.st_noticeUpdateError = action.error;
        break;
      }

      ///////////////////////////////////////////////////////

      case NOTICE_CREATE_REQUEST: {
        draft.st_noticeCreateLoading = true;
        draft.st_noticeCreateDone = null;
        draft.st_noticeCreateError = false;
        break;
      }
      case NOTICE_CREATE_SUCCESS: {
        draft.st_noticeCreateLoading = false;
        draft.st_noticeCreateDone = true;
        break;
      }
      case NOTICE_CREATE_FAILURE: {
        draft.st_noticeCreateLoading = false;
        draft.st_noticeCreateDone = false;
        draft.st_noticeCreateError = action.error;
        break;
      }
      ///////////////////////////////////////////////////////

      case NOTICE_ADMIN_CREATE_REQUEST: {
        draft.st_noticeCreateLoading = true;
        draft.st_noticeCreateDone = null;
        draft.st_noticeCreateError = false;
        break;
      }
      case NOTICE_ADMIN_CREATE_SUCCESS: {
        draft.st_noticeCreateLoading = false;
        draft.st_noticeCreateDone = true;
        break;
      }
      case NOTICE_ADMIN_CREATE_FAILURE: {
        draft.st_noticeCreateLoading = false;
        draft.st_noticeCreateDone = false;
        draft.st_noticeCreateError = action.error;
        break;
      }

      ///////////////////////////////////////////////////////
      case NOTICE_NEXT_REQUEST: {
        draft.st_noticeNextLoading = true;
        draft.st_noticeNextDone = null;
        draft.st_noticeNextError = false;
        break;
      }
      case NOTICE_NEXT_REQUEST: {
        draft.st_noticeNextLoading = false;
        draft.st_noticeNextDone = true;
        break;
      }
      case NOTICE_NEXT_REQUEST: {
        draft.st_noticeNextLoading = false;
        draft.st_noticeNextDone = false;
        draft.st_noticeNextError = action.error;
        break;
      }
      ///////////////////////////////////////////////////////

      case NOTICE_PREV_REQUEST: {
        draft.st_noticePrevLoading = true;
        draft.st_noticePrevDone = null;
        draft.st_noticePrevError = false;
        break;
      }
      case NOTICE_PREV_SUCCESS: {
        draft.st_noticePrevLoading = false;
        draft.st_noticePrevDone = true;
        break;
      }
      case NOTICE_PREV_FAILURE: {
        draft.st_noticePrevLoading = false;
        draft.st_noticePrevDone = false;
        draft.st_noticePrevError = action.error;
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

      default:
        break;
    }
  });

export default reducer;
