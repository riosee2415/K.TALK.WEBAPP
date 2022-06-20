import produce from "../util/produce";

export const initialState = {
  // value
  normalNoticeList: null,
  normalNoticeLastPage: 1,
  //
  normalNoticeAdminList: null,

  // modal
  normalNoticeModal: false,
  normalNoticeDetailModal: false,

  // status
  normalNoticeListLoading: false, // 회원 일반게시판 가져오기
  normalNoticeListDone: false,
  normalNoticeListError: false,

  normalNoticeAdminListLoading: false, // 관리자 일반게시판 가져오기
  normalNoticeAdminListDone: false,
  normalNoticeAdminListError: false,

  normalNoticeAdminCreateLoading: false, // 관리자 일반게시판 생성
  normalNoticeAdminCreateDone: false,
  normalNoticeAdminCreateError: false,

  normalNoticeStuCreateLoading: false, // 학생 일반게시판 생성
  normalNoticeStuCreateDone: false,
  normalNoticeStuCreateError: false,

  normalNoticeTeacherCreateLoading: false, // 선생 일반게시판 생성
  normalNoticeTeacherCreateDone: false,
  normalNoticeTeacherCreateError: false,

  normalNoticeUpdateLoading: false, // 일반게시판 수정
  normalNoticeUpdateDone: false,
  normalNoticeUpdateError: false,

  normalNoticeDeleteLoading: false, // 일반게시판 삭제
  normalNoticeDeleteDone: false,
  normalNoticeDeleteError: false,
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

export const NORMAL_NOTICE_ADMIN_CREATE_REQUEST =
  "NORMAL_NOTICE_ADMIN_CREATE_REQUEST";
export const NORMAL_NOTICE_ADMIN_CREATE_SUCCESS =
  "NORMAL_NOTICE_ADMIN_CREATE_SUCCESS";
export const NORMAL_NOTICE_ADMIN_CREATE_FAILURE =
  "NORMAL_NOTICE_ADMIN_CREATE_FAILURE";

export const NORMAL_NOTICE_STU_CREATE_REQUEST =
  "NORMAL_NOTICE_STU_CREATE_REQUEST";
export const NORMAL_NOTICE_STU_CREATE_SUCCESS =
  "NORMAL_NOTICE_STU_CREATE_SUCCESS";
export const NORMAL_NOTICE_STU_CREATE_FAILURE =
  "NORMAL_NOTICE_STU_CREATE_FAILURE";

export const NORMAL_NOTICE_TEACHER_CREATE_REQUEST =
  "NORMAL_NOTICE_TEACHER_CREATE_REQUEST";
export const NORMAL_NOTICE_TEACHER_CREATE_SUCCESS =
  "NORMAL_NOTICE_TEACHER_CREATE_SUCCESS";
export const NORMAL_NOTICE_TEACHER_CREATE_FAILURE =
  "NORMAL_NOTICE_TEACHER_CREATE_FAILURE";

export const NORMAL_NOTICE_UPDATE_REQUEST = "NORMAL_NOTICE_UPDATE_REQUEST";
export const NORMAL_NOTICE_UPDATE_SUCCESS = "NORMAL_NOTICE_UPDATE_SUCCESS";
export const NORMAL_NOTICE_UPDATE_FAILURE = "NORMAL_NOTICE_UPDATE_FAILURE";

export const NORMAL_NOTICE_DELETE_REQUEST = "NORMAL_NOTICE_DELETE_REQUEST";
export const NORMAL_NOTICE_DELETE_SUCCESS = "NORMAL_NOTICE_DELETE_SUCCESS";
export const NORMAL_NOTICE_DELETE_FAILURE = "NORMAL_NOTICE_DELETE_FAILURE";

export const NORMAL_NOTICE_MODAL_TOGGLE = "NORMAL_NOTICE_MODAL_TOGGLE";

export const NORMAL_NOTICE_DETAIL_MODAL_TOGGLE =
  "NORMAL_NOTICE_DETAIL_MODAL_TOGGLE";

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
      case NORMAL_NOTICE_ADMIN_LIST_REQUEST: {
        draft.normalNoticeAdminListLoading = true;
        draft.normalNoticeAdminListDone = false;
        draft.normalNoticeAdminListError = null;
        break;
      }
      case NORMAL_NOTICE_ADMIN_LIST_SUCCESS: {
        draft.normalNoticeAdminListLoading = false;
        draft.normalNoticeAdminListDone = true;
        draft.normalNoticeAdminListError = null;
        draft.normalNoticeAdminList = action.data.notice;
        break;
      }
      case NORMAL_NOTICE_ADMIN_LIST_FAILURE: {
        draft.normalNoticeAdminListLoading = false;
        draft.normalNoticeAdminListDone = false;
        draft.normalNoticeAdminListError = action.error;
        break;
      }

      //////////////////////////////////////////////    관리자 일반게시판 작성하기
      case NORMAL_NOTICE_ADMIN_CREATE_REQUEST: {
        draft.normalNoticeAdminCreateLoading = true;
        draft.normalNoticeAdminCreateDone = false;
        draft.normalNoticeAdminCreateError = null;
        break;
      }
      case NORMAL_NOTICE_ADMIN_CREATE_SUCCESS: {
        draft.normalNoticeAdminCreateLoading = false;
        draft.normalNoticeAdminCreateDone = true;
        draft.normalNoticeAdminCreateError = null;
        break;
      }
      case NORMAL_NOTICE_ADMIN_CREATE_FAILURE: {
        draft.normalNoticeAdminCreateLoading = false;
        draft.normalNoticeAdminCreateDone = false;
        draft.normalNoticeAdminCreateError = action.error;
        break;
      }

      //////////////////////////////////////////////    학생 일반게시판 작성하기
      case NORMAL_NOTICE_STU_CREATE_REQUEST: {
        draft.normalNoticeStuCreateLoading = true;
        draft.normalNoticeStuCreateDone = false;
        draft.normalNoticeStuCreateError = null;
        break;
      }
      case NORMAL_NOTICE_STU_CREATE_SUCCESS: {
        draft.normalNoticeStuCreateLoading = false;
        draft.normalNoticeStuCreateDone = true;
        draft.normalNoticeStuCreateError = null;
        break;
      }
      case NORMAL_NOTICE_STU_CREATE_FAILURE: {
        draft.normalNoticeStuCreateLoading = false;
        draft.normalNoticeStuCreateDone = false;
        draft.normalNoticeStuCreateError = action.error;
        break;
      }

      //////////////////////////////////////////////    선생 일반게시판 작성하기
      case NORMAL_NOTICE_TEACHER_CREATE_REQUEST: {
        draft.normalNoticeTeacherCreateLoading = true;
        draft.normalNoticeTeacherCreateDone = false;
        draft.normalNoticeTeacherCreateError = null;
        break;
      }
      case NORMAL_NOTICE_TEACHER_CREATE_SUCCESS: {
        draft.normalNoticeTeacherCreateLoading = false;
        draft.normalNoticeTeacherCreateDone = true;
        draft.normalNoticeTeacherCreateError = null;
        break;
      }
      case NORMAL_NOTICE_TEACHER_CREATE_FAILURE: {
        draft.normalNoticeTeacherCreateLoading = false;
        draft.normalNoticeTeacherCreateDone = false;
        draft.normalNoticeTeacherCreateError = action.error;
        break;
      }

      //////////////////////////////////////////////    일반게시판 수정하기
      case NORMAL_NOTICE_UPDATE_REQUEST: {
        draft.normalNoticeUpdateLoading = true;
        draft.normalNoticeUpdateDone = false;
        draft.normalNoticeUpdateError = null;
        break;
      }
      case NORMAL_NOTICE_UPDATE_SUCCESS: {
        draft.normalNoticeUpdateLoading = false;
        draft.normalNoticeUpdateDone = true;
        draft.normalNoticeUpdateError = null;
        break;
      }
      case NORMAL_NOTICE_UPDATE_FAILURE: {
        draft.normalNoticeUpdateLoading = false;
        draft.normalNoticeUpdateDone = false;
        draft.normalNoticeUpdateError = action.error;
        break;
      }

      //////////////////////////////////////////////    일반게시판 삭제하기
      case NORMAL_NOTICE_DELETE_REQUEST: {
        draft.normalNoticeDeleteLoading = true;
        draft.normalNoticeDeleteDone = false;
        draft.normalNoticeDeleteError = null;
        break;
      }
      case NORMAL_NOTICE_DELETE_SUCCESS: {
        draft.normalNoticeDeleteLoading = false;
        draft.normalNoticeDeleteDone = true;
        draft.normalNoticeDeleteError = null;
        break;
      }
      case NORMAL_NOTICE_DELETE_FAILURE: {
        draft.normalNoticeDeleteLoading = false;
        draft.normalNoticeDeleteDone = false;
        draft.normalNoticeDeleteError = action.error;
        break;
      }

      //////////////////////////////////////////////    일반게시판 모델

      case NORMAL_NOTICE_MODAL_TOGGLE: {
        draft.normalNoticeModal = !draft.normalNoticeModal;
        break;
      }

      //////////////////////////////////////////////    일반게시판 모델

      case NORMAL_NOTICE_DETAIL_MODAL_TOGGLE: {
        draft.normalNoticeDetailModal = !draft.normalNoticeDetailModal;
        break;
      }

      //////////////////////////////////////////////

      default:
        break;
    }
  });

export default reducer;
