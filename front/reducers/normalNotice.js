import produce from "../util/produce";

export const initialState = {
  // value
  normalNoticeList: null,
  normalNoticeLastPage: 1,
  //
  normalNoticeAdminList: null,

  // status
  normalNoticeListLoading: false, // 회원 일반게시판 가져오기
  normalNoticeListDone: false,
  normalNoticeListError: false,

  normalNoticeAdminListLoading: false, // 관리자 일반게시판 가져오기
  normalNoticeAdminListDone: false,
  normalNoticeAdminListError: false,
};

export const NORMAL_NOTICE_LIST_REQUEST = "NORMAL_NOTICE_LIST_REQUEST";
export const NORMAL_NOTICE_LIST_SUCCESS = "NORMAL_NOTICE_LIST_SUCCESS";
export const NORMAL_NOTICE_LIST_FAILURE = "NORMAL_NOTICE_LIST_FAILURE";

export const NORMAL_NOTICE_ADMIN_LIST_REQUEST =
  "NORMAL_NOTICE_ADMIN_LIST_REQUEST";
export const NORMAL_NOTICE_ADMIN_LIST_SUCCESS =
  "NORMAL_NOTICE_ADMIN_LIST_SUCCESS";
export const NORMAL_NOTICE_ADMIN_LIST_FAILURE =
  "NORMAL_NOTICE_ADMIN_LIST_FAILURE";

const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      //////////////////////////////////////////////    회원 일반게시판 가져오기
      case NORMAL_NOTICE_LIST_REQUEST: {
        draft.normalNoticeListLoading = true;
        draft.normalNoticeListDone = false;
        draft.normalNoticeListError = null;
        break;
      }
      case NORMAL_NOTICE_LIST_SUCCESS: {
        draft.normalNoticeListLoading = false;
        draft.normalNoticeListDone = true;
        draft.normalNoticeListError = null;
        draft.normalNoticeList = action.data.notice;
        draft.normalNoticeLastPage = action.data.lastPage;
        break;
      }
      case NORMAL_NOTICE_LIST_FAILURE: {
        draft.normalNoticeListLoading = false;
        draft.normalNoticeListDone = false;
        draft.normalNoticeListError = action.error;
        break;
      }

      //////////////////////////////////////////////    관리자 일반게시판 가져오기
      case NORMAL_NOTICE_LIST_REQUEST: {
        draft.normalNoticeAdminListLoading = true;
        draft.normalNoticeAdminListDone = false;
        draft.normalNoticeAdminListError = null;
        break;
      }
      case NORMAL_NOTICE_LIST_SUCCESS: {
        draft.normalNoticeAdminListLoading = false;
        draft.normalNoticeAdminListDone = true;
        draft.normalNoticeAdminListError = null;
        draft.normalNoticeAdminList = action.data.notice;
        break;
      }
      case NORMAL_NOTICE_LIST_FAILURE: {
        draft.normalNoticeAdminListLoading = false;
        draft.normalNoticeAdminListDone = false;
        draft.normalNoticeAdminListError = action.error;
        break;
      }

      //////////////////////////////////////////////

      default:
        break;
    }
  });

export default reducer;
