import produce from "../util/produce";

export const initialState = {
  communityTypes: [],
  communityList: [],
  communityDetail: null,
  communityComment: null,

  communityCommentDetail: null,
  filePath: null,

  // upload
  st_communityUploadLoading: false,
  st_communityUploadDone: false,
  st_communityUploadError: null,

  // type
  st_communityTypeListLoading: false,
  st_communityTypeListDone: false,
  st_communityTypeListError: null,
  //
  st_communityTypeCreateLoading: false,
  st_communityTypeCreateDone: false,
  st_communityTypeCreateError: null,
  //
  st_communityTypeUpdateLoading: false,
  st_communityTypeUpdateDone: false,
  st_communityTypeUpdateError: null,
  //
  st_communityTypeDeleteLoading: false,
  st_communityTypeDeleteDone: false,
  st_communityTypeDeleteError: null,

  //community
  st_communityListLoading: false,
  st_communityListDone: false,
  st_communityListError: null,
  //
  st_communityDetailLoading: false,
  st_communityDetailDone: false,
  st_communityDetailError: null,
  //
  st_communityCreateLoading: false,
  st_communityCreateDone: false,
  st_communityCreateError: null,
  //
  st_communityUpdateLoading: false,
  st_communityUpdateDone: false,
  st_communityUpdateError: null,
  //
  st_communityDeleteLoading: false,
  st_communityDeleteDone: false,
  st_communityDeleteError: null,
  //
  communityMaxLength: null,

  //comment
  st_communityCommentDetailLoading: false,
  st_communityCommentDetailDone: false,
  st_communityCommentDetailError: null,
  //
  st_communityCommentCreateLoading: false,
  st_communityCommentCreateDone: false,
  st_communityCommentCreateError: null,
  //
  st_communityCommentUpdateLoading: false,
  st_communityCommentUpdateDone: false,
  st_communityCommentUpdateError: null,
  //
  st_communityCommentDeleteLoading: false,
  st_communityCommentDeleteDone: false,
  st_communityCommentDeleteError: null,
  //
  createModal: false,
};
export const CREATE_MODAL_OPEN_REQUEST = "CREATE_MODAL_OPEN_REQUEST";
export const CREATE_MODAL_CLOSE_REQUEST = "CREATE_MODAL_CLOSE_REQUEST";
////////// FILE //////////
export const COMMUNITY_UPLOAD_REQUEST = "COMMUNITY_UPLOAD_REQUEST";
export const COMMUNITY_UPLOAD_SUCCESS = "COMMUNITY_UPLOAD_SUCCESS";
export const COMMUNITY_UPLOAD_FAILURE = "COMMUNITY_UPLOAD_FAILURE";
//

////////// TYPE //////////
export const COMMUNITY_TYPE_LIST_REQUEST = "COMMUNITY_TYPE_LIST_REQUEST";
export const COMMUNITY_TYPE_LIST_SUCCESS = "COMMUNITY_TYPE_LIST_SUCCESS";
export const COMMUNITY_TYPE_LIST_FAILURE = "COMMUNITY_TYPE_LIST_FAILURE";
//
export const COMMUNITY_TYPE_CREATE_REQUEST = "COMMUNITY_TYPE_CREATE_REQUEST";
export const COMMUNITY_TYPE_CREATE_SUCCESS = "COMMUNITY_TYPE_CREATE_SUCCESS";
export const COMMUNITY_TYPE_CREATE_FAILURE = "COMMUNITY_TYPE_CREATE_FAILURE";
//
export const COMMUNITY_TYPE_UPDATE_REQUEST = "COMMUNITY_TYPE_UPDATE_REQUEST";
export const COMMUNITY_TYPE_UPDATE_SUCCESS = "COMMUNITY_TYPE_UPDATE_SUCCESS";
export const COMMUNITY_TYPE_UPDATE_FAILURE = "COMMUNITY_TYPE_UPDATE_FAILURE";
//
export const COMMUNITY_TYPE_DELETE_REQUEST = "COMMUNITY_TYPE_DELETE_REQUEST";
export const COMMUNITY_TYPE_DELETE_SUCCESS = "COMMUNITY_TYPE_DELETE_SUCCESS";
export const COMMUNITY_TYPE_DELETE_FAILURE = "COMMUNITY_TYPE_DELETE_FAILURE";
//

////////// COMMUNITY //////////
export const COMMUNITY_LIST_REQUEST = "COMMUNITY_LIST_REQUEST";
export const COMMUNITY_LIST_SUCCESS = "COMMUNITY_LIST_SUCCESS";
export const COMMUNITY_LIST_FAILURE = "COMMUNITY_LIST_FAILURE";
//
export const COMMUNITY_DETAIL_REQUEST = "COMMUNITY_DETAIL_REQUEST";
export const COMMUNITY_DETAIL_SUCCESS = "COMMUNITY_DETAIL_SUCCESS";
export const COMMUNITY_DETAIL_FAILURE = "COMMUNITY_DETAIL_FAILURE";
//
export const COMMUNITY_CREATE_REQUEST = "COMMUNITY_CREATE_REQUEST";
export const COMMUNITY_CREATE_SUCCESS = "COMMUNITY_CREATE_SUCCESS";
export const COMMUNITY_CREATE_FAILURE = "COMMUNITY_CREATE_FAILURE";
//
export const COMMUNITY_UPDATE_REQUEST = "COMMUNITY_UPDATE_REQUEST";
export const COMMUNITY_UPDATE_SUCCESS = "COMMUNITY_UPDATE_SUCCESS";
export const COMMUNITY_UPDATE_FAILURE = "COMMUNITY_UPDATE_FAILURE";
//
export const COMMUNITY_DELETE_REQUEST = "COMMUNITY_DELETE_REQUEST";
export const COMMUNITY_DELETE_SUCCESS = "COMMUNITY_DELETE_SUCCESS";
export const COMMUNITY_DELETE_FAILURE = "COMMUNITY_DELETE_FAILURE";
//

////////// COMMENT //////////

export const COMMUNITY_COMMENT_DETAIL_REQUEST =
  "COMMUNITY_COMMENT_DETAIL_REQUEST";
export const COMMUNITY_COMMENT_DETAIL_SUCCESS =
  "COMMUNITY_COMMENT_DETAIL_SUCCESS";
export const COMMUNITY_COMMENT_DETAIL_FAILURE =
  "COMMUNITY_COMMENT_DETAIL_FAILURE";
//
export const COMMUNITY_COMMENT_CREATE_REQUEST =
  "COMMUNITY_COMMENT_CREATE_REQUEST";
export const COMMUNITY_COMMENT_CREATE_SUCCESS =
  "COMMUNITY_COMMENT_CREATE_SUCCESS";
export const COMMUNITY_COMMENT_CREATE_FAILURE =
  "COMMUNITY_COMMENT_CREATE_FAILURE";
//
export const COMMUNITY_COMMENT_UPDATE_REQUEST =
  "COMMUNITY_COMMENT_UPDATE_REQUEST";
export const COMMUNITY_COMMENT_UPDATE_SUCCESS =
  "COMMUNITY_COMMENT_UPDATE_SUCCESS";
export const COMMUNITY_COMMENT_UPDATE_FAILURE =
  "COMMUNITY_COMMENT_UPDATE_FAILURE";
//
export const COMMUNITY_COMMENT_DELETE_REQUEST =
  "COMMUNITY_COMMENT_DELETE_REQUEST";
export const COMMUNITY_COMMENT_DELETE_SUCCESS =
  "COMMUNITY_COMMENT_DELETE_SUCCESS";
export const COMMUNITY_COMMENT_DELETE_FAILURE =
  "COMMUNITY_COMMENT_DELETE_FAILURE";

export const FILE_INIT = "FILE_INIT";

const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      ////////////////////////////////////
      ////////// TYPE ////////////////////
      ////////////////////////////////////
      case COMMUNITY_TYPE_LIST_REQUEST: {
        draft.st_communityTypeListLoading = true;
        draft.st_communityTypeListDone = null;
        draft.st_communityTypeListError = false;
        break;
      }
      case COMMUNITY_TYPE_LIST_SUCCESS: {
        draft.st_communityTypeListLoading = false;
        draft.st_communityTypeListDone = true;
        draft.communityTypes = action.data.types;
        break;
      }
      case COMMUNITY_TYPE_LIST_FAILURE: {
        draft.st_communityTypeListLoading = false;
        draft.st_communityTypeListDone = false;
        draft.st_communityTypeListError = action.error;
        break;
      }
      //////////////////////////////////////////////
      case COMMUNITY_TYPE_CREATE_REQUEST: {
        draft.st_communityTypeCreateLoading = true;
        draft.st_communityTypeCreateDone = null;
        draft.st_communityTypeCreateError = false;
        break;
      }
      case COMMUNITY_TYPE_CREATE_SUCCESS: {
        draft.st_communityTypeListLoading = false;
        draft.st_communityTypeListDone = true;
        break;
      }
      case COMMUNITY_TYPE_CREATE_FAILURE: {
        draft.st_communityTypeCreateLoading = false;
        draft.st_communityTypeCreateDone = false;
        draft.st_communityTypeCreateError = action.error;
        break;
      }
      //////////////////////////////////////////////
      case COMMUNITY_TYPE_UPDATE_REQUEST: {
        draft.st_communityTypeUpdateLoading = true;
        draft.st_communityTypeUpdateDone = null;
        draft.st_communityTypeUpdateError = false;
        break;
      }
      case COMMUNITY_TYPE_UPDATE_SUCCESS: {
        draft.st_communityTypeUpdateLoading = false;
        draft.st_communityTypeUpdateDone = true;

        break;
      }
      case COMMUNITY_TYPE_UPDATE_FAILURE: {
        draft.st_communityTypeUpdateLoading = false;
        draft.st_communityTypeUpdateDone = false;
        draft.st_communityTypeUpdateError = action.error;
        break;
      }
      //////////////////////////////////////////////
      case COMMUNITY_TYPE_DELETE_REQUEST: {
        draft.st_communityTypeDeleteLoading = true;
        draft.st_communityTypeDeleteDone = null;
        draft.st_communityTypeDeleteError = false;
        break;
      }
      case COMMUNITY_TYPE_DELETE_SUCCESS: {
        draft.st_communityTypeDeleteLoading = false;
        draft.st_communityTypeDeleteDone = true;
        break;
      }
      case COMMUNITY_TYPE_DELETE_FAILURE: {
        draft.st_communityTypeDeleteLoading = false;
        draft.st_communityTypeDeleteDone = false;
        draft.st_communityTypeDeleteError = action.error;
        break;
      }
      //////////////////////////////////////////////

      ////////////////////////////////////
      ////////// COMMUNITY ///////////////
      ////////////////////////////////////

      case COMMUNITY_LIST_REQUEST: {
        draft.st_communityListLoading = true;
        draft.st_communityListDone = null;
        draft.st_communityListError = false;
        break;
      }
      case COMMUNITY_LIST_SUCCESS: {
        draft.st_communityListLoading = false;
        draft.st_communityListDone = true;
        draft.communityList = action.data.community;
        draft.communityMaxLength = action.data.lastPage;
        break;
      }
      case COMMUNITY_LIST_FAILURE: {
        draft.st_communityListLoading = false;
        draft.st_communityListDone = false;
        draft.st_communityListError = action.error;
        break;
      }
      //////////////////////////////////////////////
      case COMMUNITY_DETAIL_REQUEST: {
        draft.st_communityDetailLoading = true;
        draft.st_communityDetailDone = null;
        draft.st_communityDetailError = false;
        break;
      }
      case COMMUNITY_DETAIL_SUCCESS: {
        draft.st_communityDetailLoading = false;
        draft.st_communityDetailDone = true;
        draft.communityDetail = action.data.detailData;
        draft.communityComment = action.data.comments;
        break;
      }
      case COMMUNITY_DETAIL_FAILURE: {
        draft.st_communityDetailLoading = false;
        draft.st_communityDetailDone = false;
        draft.st_communityDetailError = action.error;
        break;
      }
      //////////////////////////////////////////////
      case COMMUNITY_CREATE_REQUEST: {
        draft.st_communityCreateLoading = true;
        draft.st_communityCreateDone = null;
        draft.st_communityCreateError = false;
        break;
      }
      case COMMUNITY_CREATE_SUCCESS: {
        draft.st_communityCreateLoading = false;
        draft.st_communityCreateDone = true;
        break;
      }
      case COMMUNITY_CREATE_FAILURE: {
        draft.st_communityCreateLoading = false;
        draft.st_communityCreateDone = false;
        draft.st_communityCreateError = action.error;
        break;
      }
      //////////////////////////////////////////////
      case COMMUNITY_UPDATE_REQUEST: {
        draft.st_communityUpdateLoading = true;
        draft.st_communityUpdateDone = null;
        draft.st_communityUpdateError = false;
        break;
      }
      case COMMUNITY_UPDATE_SUCCESS: {
        draft.st_communityUpdateLoading = false;
        draft.st_communityUpdateDone = true;
        break;
      }
      case COMMUNITY_UPDATE_FAILURE: {
        draft.st_communityUpdateLoading = false;
        draft.st_communityUpdateDone = false;
        draft.st_communityUpdateError = action.error;
        break;
      }
      //////////////////////////////////////////////
      case COMMUNITY_DELETE_REQUEST: {
        draft.st_communityDeleteLoading = true;
        draft.st_communityDeleteDone = null;
        draft.st_communityDeleteError = false;
        break;
      }
      case COMMUNITY_DELETE_SUCCESS: {
        draft.st_communityDeleteLoading = false;
        draft.st_communityDeleteDone = true;
        break;
      }
      case COMMUNITY_DELETE_FAILURE: {
        draft.st_communityDeleteLoading = false;
        draft.st_communityDeleteDone = false;
        draft.st_communityDeleteError = action.error;
        break;
      }
      //////////////////////////////////////////////

      ////////////////////////////////////
      ////////// COMMENT /////////////////
      ////////////////////////////////////

      case COMMUNITY_COMMENT_DETAIL_REQUEST: {
        draft.st_communityCommentDetailLoading = true;
        draft.st_communityCommentDetailDone = null;
        draft.st_communityCommentDetailError = false;
        break;
      }
      case COMMUNITY_COMMENT_DETAIL_SUCCESS: {
        draft.st_communityCommentDetailLoading = false;
        draft.st_communityCommentDetailDone = true;
        draft.communityCommentDetail = action.data.list;
        break;
      }
      case COMMUNITY_COMMENT_DETAIL_FAILURE: {
        draft.st_communityCommentDetailLoading = false;
        draft.st_communityCommentDetailDone = false;
        draft.st_communityCommentDetailError = action.error;
        break;
      }
      //////////////////////////////////////////////
      case COMMUNITY_COMMENT_CREATE_REQUEST: {
        draft.st_communityCommentCreateLoading = true;
        draft.st_communityCommentCreateDone = null;
        draft.st_communityCommentCreateError = false;
        break;
      }
      case COMMUNITY_COMMENT_CREATE_SUCCESS: {
        draft.st_communityCommentCreateLoading = false;
        draft.st_communityCommentCreateDone = true;
        break;
      }
      case COMMUNITY_COMMENT_CREATE_FAILURE: {
        draft.st_communityCommentCreateLoading = false;
        draft.st_communityCommentCreateDone = false;
        draft.st_communityCommentCreateError = action.error;
        break;
      }
      //////////////////////////////////////////////
      case COMMUNITY_COMMENT_UPDATE_REQUEST: {
        draft.st_communityCommentUpdateLoading = true;
        draft.st_communityCommentUpdateDone = null;
        draft.st_communityCommentUpdateError = false;
        break;
      }
      case COMMUNITY_COMMENT_UPDATE_SUCCESS: {
        draft.st_communityCommentUpdateLoading = false;
        draft.st_communityCommentUpdateDone = true;
        break;
      }
      case COMMUNITY_COMMENT_UPDATE_FAILURE: {
        draft.st_communityCommentUpdateLoading = false;
        draft.st_communityCommentUpdateDone = false;
        draft.st_communityCommentUpdateError = action.error;
        break;
      }
      //////////////////////////////////////////////
      case COMMUNITY_COMMENT_DELETE_REQUEST: {
        draft.st_communityCommentDeleteLoading = true;
        draft.st_communityCommentDeleteDone = null;
        draft.st_communityCommentDeleteError = false;
        break;
      }
      case COMMUNITY_COMMENT_DELETE_SUCCESS: {
        draft.st_communityCommentDeleteLoading = false;
        draft.st_communityCommentDeleteDone = true;
        break;
      }
      case COMMUNITY_COMMENT_DELETE_FAILURE: {
        draft.st_communityCommentDeleteLoading = false;
        draft.st_communityCommentDeleteDone = false;
        draft.st_communityCommentDeleteError = action.error;
        break;
      }
      //////////////////////////////////////////////
      case COMMUNITY_UPLOAD_REQUEST: {
        draft.st_communityUploadLoading = true;
        draft.st_communityUploadDone = null;
        draft.st_communityUploadError = false;
        break;
      }
      case COMMUNITY_UPLOAD_SUCCESS: {
        draft.st_communityUploadLoading = false;
        draft.st_communityUploadDone = true;
        draft.filePath = action.data.path;
        break;
      }
      case COMMUNITY_UPLOAD_FAILURE: {
        draft.st_communityUploadLoading = false;
        draft.st_communityUploadDone = false;
        draft.st_communityUploadError = action.error;
        break;
      }
      //////////////////////////////////////////////
      case FILE_INIT: {
        draft.filePath = null;
        break;
      }
      case CREATE_MODAL_OPEN_REQUEST: {
        draft.createModal = true;
        break;
      }

      case CREATE_MODAL_CLOSE_REQUEST: {
        draft.createModal = false;
        break;
      }

      default:
        break;
    }
  });

export default reducer;
