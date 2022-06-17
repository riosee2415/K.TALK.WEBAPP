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

  normalNoticeListLoading: false, // 회원 일반게시판 가져오기
  normalNoticeListDone: false,
  normalNoticeListError: false,
};

export const NORMAL_NOTICE_LIST_REQUEST = "NORMAL_NOTICE_LIST_REQUEST";
export const NORMAL_NOTICE_LIST_SUCCESS = "NORMAL_NOTICE_LIST_SUCCESS";
export const NORMAL_NOTICE_LIST_FAILURE = "NORMAL_NOTICE_LIST_FAILURE";

const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case NORMAL_NOTICE_LIST_REQUEST: {
        break;
      }
      case NORMAL_NOTICE_LIST_SUCCESS: {
        break;
      }
      case NORMAL_NOTICE_LIST_FAILURE: {
        break;
      }

      //////////////////////////////////////////////

      default:
        break;
    }
  });

export default reducer;
