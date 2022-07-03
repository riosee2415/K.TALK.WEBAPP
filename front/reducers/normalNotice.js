import produce from "../util/produce";

export const initialState = {
  // value
  normalNoticeList: null, // 게시판
  normalNoticeLastPage: 1, // 게시판 페이지네이션
  //
  normalNoticeAdminList: null, // 관리자 게시판
  //
  normalCommentList: null, // 댓글
  //
  normalNoticeDetailData: null, // 디테일 데이터
  normalNoticeDetailReceviers: null, // 받는자
  normalComments: null, // 댓글
  normalCommentsLen: 0, // 댓글 개수
  //
  normalNoticeFilePath: null, // 파일
  //
  editorRender: null, // 에디터

  // modal
  normalNoticeModal: false,
  normalNoticeDetailModal: false,

  // status
  normalNoticeListLoading: false, // 일반게시판 가져오기
  normalNoticeListDone: false,
  normalNoticeListError: null,

  normalNoticeDetailLoading: false, // 일반게시판 상세 가져오기
  normalNoticeDetailDone: false,
  normalNoticeDetailError: null,

  normalNoticeAdminListLoading: false, // 관리자 일반게시판 가져오기
  normalNoticeAdminListDone: false,
  normalNoticeAdminListError: null,

  normalNoticeAdminCreateLoading: false, // 관리자 일반게시판 생성
  normalNoticeAdminCreateDone: false,
  normalNoticeAdminCreateError: null,

  normalNoticeStuCreateLoading: false, // 학생 일반게시판 생성
  normalNoticeStuCreateDone: false,
  normalNoticeStuCreateError: null,

  normalNoticeTeacherCreateLoading: false, // 선생 일반게시판 생성
  normalNoticeTeacherCreateDone: false,
  normalNoticeTeacherCreateError: null,

  normalNoticeUpdateLoading: false, // 일반게시판 수정
  normalNoticeUpdateDone: false,
  normalNoticeUpdateError: null,

  normalNoticeDeleteLoading: false, // 일반게시판 삭제
  normalNoticeDeleteDone: false,
  normalNoticeDeleteError: null,

  normalCommentListLoading: false, // 대댓글 가져오기
  normalCommentListDone: false,
  normalCommentListError: null,

  normalCommentCreateLoading: false, // 대댓글 생성
  normalCommentCreateDone: false,
  normalCommentCreateError: null,

  normalCommentUpdateLoading: false, // 대댓글 수정
  normalCommentUpdateDone: false,
  normalCommentUpdateError: null,

  normalCommentDeleteLoading: false, // 대댓글 삭제
  normalCommentDeleteDone: false,
  normalCommentDeleteError: null,

  normalNoticeFileUploadLoading: false, // 파일 업로드
  normalNoticeFileUploadDone: false,
  normalNoticeFileUploadError: null,
};

export const NORMAL_NOTICE_LIST_REQUEST = "NORMAL_NOTICE_LIST_REQUEST";
export const NORMAL_NOTICE_LIST_SUCCESS = "NORMAL_NOTICE_LIST_SUCCESS";
export const NORMAL_NOTICE_LIST_FAILURE = "NORMAL_NOTICE_LIST_FAILURE";

export const NORMAL_NOTICE_DETAIL_REQUEST = "NORMAL_NOTICE_DETAIL_REQUEST";
export const NORMAL_NOTICE_DETAIL_SUCCESS = "NORMAL_NOTICE_DETAIL_SUCCESS";
export const NORMAL_NOTICE_DETAIL_FAILURE = "NORMAL_NOTICE_DETAIL_FAILURE";

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

export const NORMAL_COMMENT_LIST_REQUEST = "NORMAL_COMMENT_LIST_REQUEST";
export const NORMAL_COMMENT_LIST_SUCCESS = "NORMAL_COMMENT_LIST_SUCCESS";
export const NORMAL_COMMENT_LIST_FAILURE = "NORMAL_COMMENT_LIST_FAILURE";

export const NORMAL_COMMENT_CREATE_REQUEST = "NORMAL_COMMENT_CREATE_REQUEST";
export const NORMAL_COMMENT_CREATE_SUCCESS = "NORMAL_COMMENT_CREATE_SUCCESS";
export const NORMAL_COMMENT_CREATE_FAILURE = "NORMAL_COMMENT_CREATE_FAILURE";

export const NORMAL_COMMENT_UPDATE_REQUEST = "NORMAL_COMMENT_UPDATE_REQUEST";
export const NORMAL_COMMENT_UPDATE_SUCCESS = "NORMAL_COMMENT_UPDATE_SUCCESS";
export const NORMAL_COMMENT_UPDATE_FAILURE = "NORMAL_COMMENT_UPDATE_FAILURE";

export const NORMAL_COMMENT_DELETE_REQUEST = "NORMAL_COMMENT_DELETE_REQUEST";
export const NORMAL_COMMENT_DELETE_SUCCESS = "NORMAL_COMMENT_DELETE_SUCCESS";
export const NORMAL_COMMENT_DELETE_FAILURE = "NORMAL_COMMENT_DELETE_FAILURE";

export const NORMAL_FILE_UPLOAD_REQUEST = "NORMAL_FILE_UPLOAD_REQUEST";
export const NORMAL_FILE_UPLOAD_SUCCESS = "NORMAL_FILE_UPLOAD_SUCCESS";
export const NORMAL_FILE_UPLOAD_FAILURE = "NORMAL_FILE_UPLOAD_FAILURE";

export const NORMAL_NOTICE_MODAL_TOGGLE = "NORMAL_NOTICE_MODAL_TOGGLE";

export const NORMAL_NOTICE_EDITOR_RENDER = "NORMAL_NOTICE_EDITOR_RENDER";

export const NORMAL_NOTICE_DETAIL_MODAL_TOGGLE =
  "NORMAL_NOTICE_DETAIL_MODAL_TOGGLE";

export const NORMAL_NOTICE_FILE_STATE = "NORMAL_NOTICE_FILE_STATE";

const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      //////////////////////////////////////////////    일반게시판 가져오기
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

      //////////////////////////////////////////////    일반게시판 상세 가져오기
      case NORMAL_NOTICE_DETAIL_REQUEST: {
        draft.normalNoticeDetailLoading = true;
        draft.normalNoticeDetailDone = false;
        draft.normalNoticeDetailError = null;
        break;
      }
      case NORMAL_NOTICE_DETAIL_SUCCESS: {
        draft.normalNoticeDetailLoading = false;
        draft.normalNoticeDetailDone = true;
        draft.normalNoticeDetailError = null;
        draft.normalNoticeDetailData = action.data.detailData;
        draft.normalNoticeDetailReceviers = action.data.receviers;
        draft.normalComments = action.data.comments;
        draft.normalCommentsLen = action.data.commentsLen;
        break;
      }
      case NORMAL_NOTICE_DETAIL_FAILURE: {
        draft.normalNoticeDetailLoading = false;
        draft.normalNoticeDetailDone = false;
        draft.normalNoticeDetailError = action.error;
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

      //////////////////////////////////////////////    대댓글 가져오기
      case NORMAL_COMMENT_LIST_REQUEST: {
        draft.normalCommentListLoading = true;
        draft.normalCommentListDone = false;
        draft.normalCommentListError = null;
        break;
      }
      case NORMAL_COMMENT_LIST_SUCCESS: {
        draft.normalCommentListLoading = false;
        draft.normalCommentListDone = true;
        draft.normalCommentListError = null;
        draft.normalCommentList = action.data.list;
        break;
      }
      case NORMAL_COMMENT_LIST_FAILURE: {
        draft.normalCommentListLoading = false;
        draft.normalCommentListDone = false;
        draft.normalCommentListError = action.error;
        break;
      }

      //////////////////////////////////////////////    대댓글 생성
      case NORMAL_COMMENT_CREATE_REQUEST: {
        draft.normalCommentCreateLoading = true;
        draft.normalCommentCreateDone = false;
        draft.normalCommentCreateError = null;
        break;
      }
      case NORMAL_COMMENT_CREATE_SUCCESS: {
        draft.normalCommentCreateLoading = false;
        draft.normalCommentCreateDone = true;
        draft.normalCommentCreateError = null;
        break;
      }
      case NORMAL_COMMENT_CREATE_FAILURE: {
        draft.normalCommentCreateLoading = false;
        draft.normalCommentCreateDone = false;
        draft.normalCommentCreateError = action.error;
        break;
      }

      //////////////////////////////////////////////    대댓글 수정
      case NORMAL_COMMENT_UPDATE_REQUEST: {
        draft.normalCommentUpdateLoading = true;
        draft.normalCommentUpdateDone = false;
        draft.normalCommentUpdateError = null;
        break;
      }
      case NORMAL_COMMENT_UPDATE_SUCCESS: {
        draft.normalCommentUpdateLoading = false;
        draft.normalCommentUpdateDone = true;
        draft.normalCommentUpdateError = null;
        break;
      }
      case NORMAL_COMMENT_UPDATE_FAILURE: {
        draft.normalCommentUpdateLoading = false;
        draft.normalCommentUpdateDone = false;
        draft.normalCommentUpdateError = action.error;
        break;
      }
      //////////////////////////////////////////////    대댓글 삭제하기
      case NORMAL_COMMENT_DELETE_REQUEST: {
        draft.normalCommentDeleteLoading = true;
        draft.normalCommentDeleteDone = false;
        draft.normalCommentDeleteError = null;
        break;
      }
      case NORMAL_COMMENT_DELETE_SUCCESS: {
        draft.normalCommentDeleteLoading = false;
        draft.normalCommentDeleteDone = true;
        draft.normalCommentDeleteError = null;
        break;
      }
      case NORMAL_COMMENT_DELETE_FAILURE: {
        draft.normalCommentDeleteLoading = false;
        draft.normalCommentDeleteDone = false;
        draft.normalCommentDeleteError = action.error;
        break;
      }

      //////////////////////////////////////////////    파일 업로드
      case NORMAL_FILE_UPLOAD_REQUEST: {
        draft.normalNoticeFileUploadLoading = true;
        draft.normalNoticeFileUploadDone = false;
        draft.normalNoticeFileUploadError = null;
        break;
      }
      case NORMAL_FILE_UPLOAD_SUCCESS: {
        draft.normalNoticeFileUploadLoading = false;
        draft.normalNoticeFileUploadDone = true;
        draft.normalNoticeFileUploadError = null;
        draft.normalNoticeFilePath = action.data.path;
        break;
      }
      case NORMAL_FILE_UPLOAD_FAILURE: {
        draft.normalNoticeFileUploadLoading = false;
        draft.normalNoticeFileUploadDone = false;
        draft.normalNoticeFileUploadError = action.error;
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

      //////////////////////////////////////////////    에디터 랜더링

      case NORMAL_NOTICE_EDITOR_RENDER: {
        draft.editorRender = action.data;
        break;
      }

      //////////////////////////////////////////////

      case NORMAL_NOTICE_FILE_STATE: {
        draft.normalNoticeFilePath = action.data;
        break;
      }


      //////////////////////////////////////////////

      default:
        break;
    }
  });

export default reducer;
