import produce from "../util/produce";

export const initailState = {
  lectureNotices: null,
  lectureNoticeDetail: null, // 디테일 데이터
  lecNoticeDetailReceviers: null, // 받는자
  lectureNoticeComment: null, // 댓글
  commentLen: null, // 댓글 갯수

  adminLectureNotices: null, // 관리자용
  adminLecNoticeDetail: null, // 관리자 디테일 데이터
  adminLecNoticeDetailReceviers: null, // 관리자 받는자
  adminLecNoticeComment: null, // 관리자 댓글

  uploadLectureNoticePath: null,
  maxPage: 1, // 게시판 갯수

  lecNoticeCommentDetails: null, // 대댓글 데이터

  lectureNoticeModal: false,

  ////////////////////////////// NOTICE //////////////////////////////
  st_lectureNoticeListLoading: false, // 강의 게시판 가져오기
  st_lectureNoticeListDone: false,
  st_lectureNoticeListError: null,
  //
  st_lectureNoticeDetailListLoading: false, // 강의 게시판 디테일 가져오기
  st_lectureNoticeDetailListDone: false,
  st_lectureNoticeDetailListError: null,
  //
  st_lectureNoticeAdminListLoading: false, // 관리자 강의 게시판 가져오기
  st_lectureNoticeAdminListDone: false,
  st_lectureNoticeAdminListError: null,
  //
  st_lecNoticeAdminDetailLoading: false, // 관리자 강의 게시판 디테일 가져오기
  st_lecNoticeAdminDetailDone: false,
  st_lecNoticeAdminDetailError: null,
  //
  st_lectureNoticeCreateLoading: false, // 강의 게시판 만들기
  st_lectureNoticeCreateDone: false,
  st_lectureNoticeCreateError: null,
  //
  st_lectureNoticeUpdateLoading: false, // 강의 게시판 업데이트
  st_lectureNoticeUpdateDone: false,
  st_lectureNoticeUpdateError: null,
  //
  st_lectureNoticeDeleteLoading: false, // 강의 게시판 삭제
  st_lectureNoticeDeleteDone: false,
  st_lectureNoticeDeleteError: null,

  ////////////////////////////// COMMENT //////////////////////////////
  st_lecNoticeCommentDetailLoading: false, // 강의 게시판 대댓글 가져오기
  st_lecNoticeCommentDetailDone: false,
  st_lecNoticeCommentDetailError: null,
  //
  st_lecNoticeCommentCreateLoading: false, // 강의 게시판 댓글 작성
  st_lecNoticeCommentCreateDone: false,
  st_lecNoticeCommentCreateError: null,
  //
  st_lecNoticeCommentUpdateLoading: false, // 강의 게시판 대댓글 수정
  st_lecNoticeCommentUpdateDone: false,
  st_lecNoticeCommentUpdateError: null,
  //
  st_lecNoticeCommentDeleteLoading: false, // 강의 게시판 대댓글 삭제
  st_lecNoticeCommentDeleteDone: false,
  st_lecNoticeCommentDeleteError: null,
};

////////////////////////////// NOTICE //////////////////////////////
export const LECTURE_NOTICE_LIST_REQUEST = "LECTURE_NOTICE_LIST_REQUEST";
export const LECTURE_NOTICE_LIST_SUCCESS = "LECTURE_NOTICE_LIST_SUCCESS";
export const LECTURE_NOTICE_LIST_FAILURE = "LECTURE_NOTICE_LIST_FAILURE";

export const LECTURE_NOTICE_DETAIL_LIST_REQUEST =
  "LECTURE_NOTICE_DETAIL_LIST_REQUEST";
export const LECTURE_NOTICE_DETAIL_LIST_SUCCESS =
  "LECTURE_NOTICE_DETAIL_LIST_SUCCESS";
export const LECTURE_NOTICE_DETAIL_LIST_FAILURE =
  "LECTURE_NOTICE_DETAIL_LIST_FAILURE";

export const LECTURE_NOTICE_ADMIN_LIST_REQUEST =
  "LECTURE_NOTICE_ADMIN_LIST_REQUEST";
export const LECTURE_NOTICE_ADMIN_LIST_SUCCESS =
  "LECTURE_NOTICE_ADMIN_LIST_SUCCESS";
export const LECTURE_NOTICE_ADMIN_LIST_FAILURE =
  "LECTURE_NOTICE_ADMIN_LIST_FAILURE";

export const LECNOTICE_ADMIN_DETAIL_REQUEST = "LECNOTICE_ADMIN_DETAIL_REQUEST";
export const LECNOTICE_ADMIN_DETAIL_SUCCESS = "LECNOTICE_ADMIN_DETAIL_SUCCESS";
export const LECNOTICE_ADMIN_DETAIL_FAILURE = "LECNOTICE_ADMIN_DETAIL_FAILURE";

export const LECTURE_NOTICE_UPLOAD_REQUEST = "LECTURE_NOTICE_UPLOAD_REQUEST";
export const LECTURE_NOTICE_UPLOAD_SUCCESS = "LECTURE_NOTICE_UPLOAD_SUCCESS";
export const LECTURE_NOTICE_UPLOAD_FAILURE = "LECTURE_NOTICE_UPLOAD_FAILURE";

export const LECTURE_NOTICE_CREATE_REQUEST = "LECTURE_NOTICE_CREATE_REQUEST";
export const LECTURE_NOTICE_CREATE_SUCCESS = "LECTURE_NOTICE_CREATE_SUCCESS";
export const LECTURE_NOTICE_CREATE_FAILURE = "LECTURE_NOTICE_CREATE_FAILURE";

export const LECTURE_NOTICE_UPDATE_REQUEST = "LECTURE_NOTICE_UPDATE_REQUEST";
export const LECTURE_NOTICE_UPDATE_SUCCESS = "LECTURE_NOTICE_UPDATE_SUCCESS";
export const LECTURE_NOTICE_UPDATE_FAILURE = "LECTURE_NOTICE_UPDATE_FAILURE";

export const LECTURE_NOTICE_DELETE_REQUEST = "LECTURE_NOTICE_DELETE_REQUEST";
export const LECTURE_NOTICE_DELETE_SUCCESS = "LECTURE_NOTICE_DELETE_SUCCESS";
export const LECTURE_NOTICE_DELETE_FAILURE = "LECTURE_NOTICE_DELETE_FAILURE";

////////////////////////////// COMMENT //////////////////////////////
export const LECNOTICE_COMMENT_DETAIL_REQUEST =
  "LECNOTICE_COMMENT_DETAIL_REQUEST";
export const LECNOTICE_COMMENT_DETAIL_SUCCESS =
  "LECNOTICE_COMMENT_DETAIL_SUCCESS";
export const LECNOTICE_COMMENT_DETAIL_FAILURE =
  "LECNOTICE_COMMENT_DETAIL_FAILURE";

export const LECNOTICE_COMMENT_CREATE_REQUEST =
  "LECNOTICE_COMMENT_CREATE_REQUEST";
export const LECNOTICE_COMMENT_CREATE_SUCCESS =
  "LECNOTICE_COMMENT_CREATE_SUCCESS";
export const LECNOTICE_COMMENT_CREATE_FAILURE =
  "LECNOTICE_COMMENT_CREATE_FAILURE";

export const LECNOTICE_COMMENT_UPDATE_REQUEST =
  "LECNOTICE_COMMENT_UPDATE_REQUEST";
export const LECNOTICE_COMMENT_UPDATE_SUCCESS =
  "LECNOTICE_COMMENT_UPDATE_SUCCESS";
export const LECNOTICE_COMMENT_UPDATE_FAILURE =
  "LECNOTICE_COMMENT_UPDATE_FAILURE";

export const LECNOTICE_COMMENT_DELETE_REQUEST =
  "LECNOTICE_COMMENT_DELETE_REQUEST";
export const LECNOTICE_COMMENT_DELETE_SUCCESS =
  "LECNOTICE_COMMENT_DELETE_SUCCESS";
export const LECNOTICE_COMMENT_DELETE_FAILURE =
  "LECNOTICE_COMMENT_DELETE_FAILURE";

/////////////////////////////////////////////////////////////////////

export const LECTURE_NOTICE_MODAL_TOGGLE = "LECTURE_NOTICE_MODAL_TOGGLE";

export const UPDATE_LECTURE_NOTICE_PATH = "UPDATE_LECTURE_NOTICE_PATH";

export const RESET_LECTURE_NOTICE_PATH = "RESET_LECTURE_NOTICE_PATH";

export const LECNOTICE_COMMENT_LIST_INIT = "LECNOTICE_COMMENT_LIST_INIT";

const reducer = (state = initailState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      ////////////////////////////// NOTICE //////////////////////////////
      case LECTURE_NOTICE_LIST_REQUEST: {
        draft.st_lectureNoticeListLoading = true;
        draft.st_lectureNoticeListDone = false;
        draft.st_lectureNoticeListError = null;
        break;
      }
      case LECTURE_NOTICE_LIST_SUCCESS: {
        draft.st_lectureNoticeListLoading = false;
        draft.st_lectureNoticeListDone = true;
        draft.st_lectureNoticeListError = null;
        draft.lectureNotices = action.data.notice;
        draft.maxPage = action.data.lastPage;
        break;
      }
      case LECTURE_NOTICE_LIST_FAILURE: {
        draft.st_lectureNoticeListLoading = false;
        draft.st_lectureNoticeListDone = false;
        draft.st_lectureNoticeListError = action.error;
        break;
      }

      //////////////////////////////////////////////

      case LECTURE_NOTICE_DETAIL_LIST_REQUEST: {
        draft.st_lectureNoticeDetailListLoading = true;
        draft.st_lectureNoticeDetailListDone = false;
        draft.st_lectureNoticeDetailListError = null;
        break;
      }
      case LECTURE_NOTICE_DETAIL_LIST_SUCCESS: {
        draft.st_lectureNoticeDetailListLoading = false;
        draft.st_lectureNoticeDetailListDone = true;
        draft.st_lectureNoticeDetailListError = null;
        draft.lectureNoticeDetail = action.data.detailData;
        draft.lecNoticeDetailReceviers = action.data.users;
        draft.lectureNoticeComment = action.data.comments;
        draft.commentLen = action.data.commentsLen;
        break;
      }
      case LECTURE_NOTICE_DETAIL_LIST_FAILURE: {
        draft.st_lectureNoticeDetailListLoading = false;
        draft.st_lectureNoticeDetailListDone = false;
        draft.st_lectureNoticeDetailListError = action.error;
        break;
      }

      //////////////////////////////////////////////

      case LECTURE_NOTICE_ADMIN_LIST_REQUEST: {
        draft.st_lectureNoticeAdminListLoading = true;
        draft.st_lectureNoticeAdminListDone = false;
        draft.st_lectureNoticeAdminListError = null;
        break;
      }
      case LECTURE_NOTICE_ADMIN_LIST_SUCCESS: {
        draft.st_lectureNoticeAdminListLoading = false;
        draft.st_lectureNoticeAdminListDone = true;
        draft.st_lectureNoticeAdminListError = null;
        draft.adminLectureNotices = action.data.notice;
        break;
      }
      case LECTURE_NOTICE_ADMIN_LIST_FAILURE: {
        draft.st_lectureNoticeAdminListLoading = false;
        draft.st_lectureNoticeAdminListDone = false;
        draft.st_lectureNoticeAdminListError = action.error;
        break;
      }

      //////////////////////////////////////////////

      case LECNOTICE_ADMIN_DETAIL_REQUEST: {
        draft.st_lecNoticeAdminDetailLoading = true;
        draft.st_lecNoticeAdminDetailDone = false;
        draft.st_lecNoticeAdminDetailError = null;
        break;
      }
      case LECNOTICE_ADMIN_DETAIL_SUCCESS: {
        draft.st_lecNoticeAdminDetailLoading = false;
        draft.st_lecNoticeAdminDetailDone = true;
        draft.st_lecNoticeAdminDetailError = null;
        draft.adminLecNoticeDetail = action.data.detailData;
        draft.adminLecNoticeDetailReceviers = action.data.users;
        draft.adminLecNoticeComment = action.data.comments;
        break;
      }
      case LECNOTICE_ADMIN_DETAIL_FAILURE: {
        draft.st_lecNoticeAdminDetailLoading = false;
        draft.st_lecNoticeAdminDetailDone = false;
        draft.st_lecNoticeAdminDetailError = action.error;
        break;
      }

      //////////////////////////////////////////////

      case LECTURE_NOTICE_UPLOAD_REQUEST: {
        draft.st_lectureNoticeUploadLoading = true;
        draft.st_lectureNoticeUploadDone = false;
        draft.st_lectureNoticeUploadError = null;
        break;
      }
      case LECTURE_NOTICE_UPLOAD_SUCCESS: {
        draft.st_lectureNoticeUploadLoading = false;
        draft.st_lectureNoticeUploadDone = true;
        draft.st_lectureNoticeUploadError = null;
        draft.uploadLectureNoticePath = action.data.path;
        break;
      }
      case LECTURE_NOTICE_UPLOAD_FAILURE: {
        draft.st_lectureNoticeUploadLoading = false;
        draft.st_lectureNoticeUploadDone = false;
        draft.st_lectureNoticeUploadError = action.error;
        break;
      }

      ///////////////////////////////////////////////////////
      case LECTURE_NOTICE_CREATE_REQUEST: {
        draft.st_lectureNoticeCreateLoading = true;
        draft.st_lectureNoticeCreateDone = false;
        draft.st_lectureNoticeCreateError = null;
        break;
      }
      case LECTURE_NOTICE_CREATE_SUCCESS: {
        draft.st_lectureNoticeCreateLoading = false;
        draft.st_lectureNoticeCreateDone = true;
        draft.st_lectureNoticeCreateError = null;
        break;
      }
      case LECTURE_NOTICE_CREATE_FAILURE: {
        draft.st_lectureNoticeCreateLoading = false;
        draft.st_lectureNoticeCreateDone = false;
        draft.st_lectureNoticeCreateError = action.error;
        break;
      }
      ///////////////////////////////////////////////////////
      case LECTURE_NOTICE_UPDATE_REQUEST: {
        draft.st_lectureNoticeUpdateLoading = true;
        draft.st_lectureNoticeUpdateDone = false;
        draft.st_lectureNoticeUpdateError = null;
        break;
      }
      case LECTURE_NOTICE_UPDATE_SUCCESS: {
        draft.st_lectureNoticeUpdateLoading = false;
        draft.st_lectureNoticeUpdateDone = true;
        draft.st_lectureNoticeUpdateError = null;
        break;
      }
      case LECTURE_NOTICE_UPDATE_FAILURE: {
        draft.st_lectureNoticeUpdateLoading = false;
        draft.st_lectureNoticeUpdateDone = false;
        draft.st_lectureNoticeUpdateError = action.error;
        break;
      }
      ///////////////////////////////////////////////////////
      case LECTURE_NOTICE_DELETE_REQUEST: {
        draft.st_lectureNoticeDeleteLoading = true;
        draft.st_lectureNoticeDeleteDone = false;
        draft.st_lectureNoticeDeleteError = null;
        break;
      }
      case LECTURE_NOTICE_DELETE_SUCCESS: {
        draft.st_lectureNoticeDeleteLoading = false;
        draft.st_lectureNoticeDeleteDone = true;
        draft.st_lectureNoticeDeleteError = null;
        break;
      }
      case LECTURE_NOTICE_DELETE_FAILURE: {
        draft.st_lectureNoticeDeleteLoading = false;
        draft.st_lectureNoticeDeleteDone = false;
        draft.st_lectureNoticeDeleteError = action.error;
        break;
      }
      ////////////////////////////// COMMENT //////////////////////////////
      case LECNOTICE_COMMENT_DETAIL_REQUEST: {
        draft.st_lecNoticeCommentDetailLoading = true;
        draft.st_lecNoticeCommentDetailDone = false;
        draft.st_lecNoticeCommentDetailError = null;
        break;
      }
      case LECNOTICE_COMMENT_DETAIL_SUCCESS: {
        draft.st_lecNoticeCommentDetailLoading = false;
        draft.st_lecNoticeCommentDetailDone = true;
        draft.st_lecNoticeCommentDetailError = null;
        draft.lecNoticeCommentDetails = action.data.list;
        break;
      }
      case LECNOTICE_COMMENT_DETAIL_FAILURE: {
        draft.st_lecNoticeCommentDetailLoading = false;
        draft.st_lecNoticeCommentDetailDone = false;
        draft.st_lecNoticeCommentDetailError = action.error;
        break;
      }
      //////////////////////////////////////////////

      case LECNOTICE_COMMENT_CREATE_REQUEST: {
        draft.st_lecNoticeCommentCreateLoading = true;
        draft.st_lecNoticeCommentCreateDone = false;
        draft.st_lecNoticeCommentCreateError = null;
        break;
      }
      case LECNOTICE_COMMENT_CREATE_SUCCESS: {
        draft.st_lecNoticeCommentCreateLoading = false;
        draft.st_lecNoticeCommentCreateDone = true;
        draft.st_lecNoticeCommentCreateError = null;
        break;
      }
      case LECNOTICE_COMMENT_CREATE_FAILURE: {
        draft.st_lecNoticeCommentCreateLoading = false;
        draft.st_lecNoticeCommentCreateDone = false;
        draft.st_lecNoticeCommentCreateError = action.error;
        break;
      }
      //////////////////////////////////////////////

      case LECNOTICE_COMMENT_UPDATE_REQUEST: {
        draft.st_lecNoticeCommentUpdateLoading = true;
        draft.st_lecNoticeCommentUpdateDone = false;
        draft.st_lecNoticeCommentUpdateError = null;
        break;
      }
      case LECNOTICE_COMMENT_UPDATE_SUCCESS: {
        draft.st_lecNoticeCommentUpdateLoading = false;
        draft.st_lecNoticeCommentUpdateDone = true;
        draft.st_lecNoticeCommentUpdateError = null;
        break;
      }
      case LECNOTICE_COMMENT_UPDATE_FAILURE: {
        draft.st_lecNoticeCommentUpdateLoading = false;
        draft.st_lecNoticeCommentUpdateDone = false;
        draft.st_lecNoticeCommentUpdateError = action.error;
        break;
      }
      //////////////////////////////////////////////

      case LECNOTICE_COMMENT_DELETE_REQUEST: {
        draft.st_lecNoticeCommentDeleteLoading = true;
        draft.st_lecNoticeCommentDeleteDone = false;
        draft.st_lecNoticeCommentDeleteError = null;
        break;
      }
      case LECNOTICE_COMMENT_DELETE_SUCCESS: {
        draft.st_lecNoticeCommentDeleteLoading = false;
        draft.st_lecNoticeCommentDeleteDone = true;
        draft.st_lecNoticeCommentDeleteError = null;
        break;
      }
      case LECNOTICE_COMMENT_DELETE_FAILURE: {
        draft.st_lecNoticeCommentDeleteLoading = false;
        draft.st_lecNoticeCommentDeleteDone = false;
        draft.st_lecNoticeCommentDeleteError = action.error;
        break;
      }

      ///////////////////////////////////////////////////////
      ///////////////////////////////////////////////////////
      ///////////////////////////////////////////////////////

      case LECTURE_NOTICE_MODAL_TOGGLE:
        draft.lectureNoticeModal = !draft.lectureNoticeModal;
        break;

      case UPDATE_LECTURE_NOTICE_PATH:
        draft.uploadLectureNoticePath = action.data;
        break;

      case RESET_LECTURE_NOTICE_PATH:
        draft.uploadLectureNoticePath = null;
        break;

      case LECNOTICE_COMMENT_LIST_INIT: {
        draft.lecNoticeCommentDetails = null;
        break;
      }

      default:
        break;
    }
  });

export default reducer;
