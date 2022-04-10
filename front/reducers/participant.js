import produce from "../util/produce";

export const initialState = {
  partList: [],
  partLectureList: [],
  partLecturePrice: null,
  partAdminList: [], // 관리자에서 보는 참여 목록
  partLastPage: 1,
  partUserDeleteList: [],
  partUserMoveList: [],
  //
  st_participantListLoading: false,
  st_participantListDone: false,
  st_participantListError: null,
  //
  st_participantLectureListLoading: false,
  st_participantLectureListDone: false,
  st_participantLectureListError: null,
  //
  st_participantCreateLoading: false,
  st_participantCreateDone: false,
  st_participantCreateError: null,
  //
  st_participantAdminLoading: false,
  st_participantAdminDone: false,
  st_participantAdminError: null,
  //
  st_participantDeleteLoading: false,
  st_participantDeleteDone: false,
  st_participantDeleteError: null,
  //
  st_participantUserDeleteListLoading: false,
  st_participantUserDeleteListDone: false,
  st_participantUserDeleteListError: null,
  //
  st_participantUserMoveListLoading: false,
  st_participantUserMoveListDone: false,
  st_participantUserMoveListError: null,
};

export const PARTICIPANT_LIST_REQUEST = "PARTICIPANT_LIST_REQUEST";
export const PARTICIPANT_LIST_SUCCESS = "PARTICIPANT_LIST_SUCCESS";
export const PARTICIPANT_LIST_FAILURE = "PARTICIPANT_LIST_FAILURE";

export const PARTICIPANT_LECTURE_LIST_REQUEST =
  "PARTICIPANT_LECTURE_LIST_REQUEST";
export const PARTICIPANT_LECTURE_LIST_SUCCESS =
  "PARTICIPANT_LECTURE_LIST_SUCCESS";
export const PARTICIPANT_LECTURE_LIST_FAILURE =
  "PARTICIPANT_LECTURE_LIST_FAILURE";

export const PARTICIPANT_ADMIN_LIST_REQUEST = "PARTICIPANT_ADMIN_LIST_REQUEST";
export const PARTICIPANT_ADMIN_LIST_SUCCESS = "PARTICIPANT_ADMIN_LIST_SUCCESS";
export const PARTICIPANT_ADMIN_LIST_FAILURE = "PARTICIPANT_ADMIN_LIST_FAILURE";

export const PARTICIPANT_CREATE_REQUEST = "PARTICIPANT_CREATE_REQUEST";
export const PARTICIPANT_CREATE_SUCCESS = "PARTICIPANT_CREATE_SUCCESS";
export const PARTICIPANT_CREATE_FAILURE = "PARTICIPANT_CREATE_FAILURE";

export const PARTICIPANT_DELETE_REQUEST = "PARTICIPANT_DELETE_REQUEST";
export const PARTICIPANT_DELETE_SUCCESS = "PARTICIPANT_DELETE_SUCCESS";
export const PARTICIPANT_DELETE_FAILURE = "PARTICIPANT_DELETE_FAILURE";

export const PARTICIPANT_USER_DELETE_LIST_REQUEST =
  "PARTICIPANT_USER_DELETE_LIST_REQUEST";
export const PARTICIPANT_USER_DELETE_LIST_SUCCESS =
  "PARTICIPANT_USER_DELETE_LIST_SUCCESS";
export const PARTICIPANT_USER_DELETE_LIST_FAILURE =
  "PARTICIPANT_USER_DELETE_LIST_FAILURE";

export const PARTICIPANT_USER_MOVE_LIST_REQUEST =
  "PARTICIPANT_USER_MOVE_LIST_REQUEST";
export const PARTICIPANT_USER_MOVE_LIST_SUCCESS =
  "PARTICIPANT_USER_MOVE_LIST_SUCCESS";
export const PARTICIPANT_USER_MOVE_LIST_FAILURE =
  "PARTICIPANT_USER_MOVE_LIST_FAILURE";

const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case PARTICIPANT_LIST_REQUEST: {
        draft.st_participantListLoading = true;
        draft.st_participantListDone = null;
        draft.st_participantListError = false;
        break;
      }
      case PARTICIPANT_LIST_SUCCESS: {
        draft.st_participantListLoading = false;
        draft.st_participantListDone = true;
        draft.partList = action.data.partList;
        draft.partLastPage = action.data.lastPage;
        break;
      }
      case PARTICIPANT_LIST_FAILURE: {
        draft.st_participantListLoading = false;
        draft.st_participantListDone = false;
        draft.st_participantListError = action.error;
        break;
      }

      //////////////////////////////////////////////

      case PARTICIPANT_LECTURE_LIST_REQUEST: {
        draft.st_participantLectureListLoading = true;
        draft.st_participantLectureListDone = null;
        draft.st_participantLectureListError = false;
        break;
      }
      case PARTICIPANT_LECTURE_LIST_SUCCESS: {
        draft.st_participantLectureListLoading = false;
        draft.st_participantLectureListDone = true;
        draft.partLectureList = action.data.partList;
        draft.partLecturePrice = action.data.price;
        break;
      }
      case PARTICIPANT_LECTURE_LIST_FAILURE: {
        draft.st_participantLectureListLoading = false;
        draft.st_participantLectureListDone = false;
        draft.st_participantLectureListError = action.error;
        break;
      }

      //////////////////////////////////////////////

      case PARTICIPANT_ADMIN_LIST_REQUEST: {
        draft.st_participantAdminLoading = true;
        draft.st_participantAdminDone = null;
        draft.st_participantAdminError = false;
        break;
      }

      case PARTICIPANT_ADMIN_LIST_SUCCESS: {
        draft.st_participantAdminLoading = false;
        draft.st_participantAdminDone = true;
        draft.partAdminList = action.data.partList;
        break;
      }
      case PARTICIPANT_ADMIN_LIST_FAILURE: {
        draft.st_participantAdminLoading = false;
        draft.st_participantAdminDone = false;
        draft.st_participantAdminError = action.error;
        break;
      }

      //////////////////////////////////////////////

      case PARTICIPANT_CREATE_REQUEST: {
        draft.st_participantCreateLoading = true;
        draft.st_participantCreateDone = null;
        draft.st_participantCreateError = false;
        break;
      }
      case PARTICIPANT_CREATE_SUCCESS: {
        draft.st_participantCreateDone = true;
        draft.st_participantCreateLoading = false;
        break;
      }
      case PARTICIPANT_CREATE_FAILURE: {
        draft.st_participantCreateLoading = false;
        draft.st_participantCreateDone = false;
        draft.st_participantCreateError = action.error;
        break;
      }

      //////////////////////////////////////////////

      case PARTICIPANT_DELETE_REQUEST: {
        draft.st_participantDeleteLoading = true;
        draft.st_participantDeleteDone = null;
        draft.st_participantDeleteError = false;
        break;
      }
      case PARTICIPANT_DELETE_SUCCESS: {
        draft.st_participantDeleteDone = true;
        draft.st_participantDeleteLoading = false;
        break;
      }
      case PARTICIPANT_DELETE_FAILURE: {
        draft.st_participantDeleteLoading = false;
        draft.st_participantDeleteDone = false;
        draft.st_participantDeleteError = action.error;
        break;
      }

      //////////////////////////////////////////////

      case PARTICIPANT_USER_DELETE_LIST_REQUEST: {
        draft.st_participantUserDeleteListLoading = true;
        draft.st_participantUserDeleteListDone = null;
        draft.st_participantUserDeleteListError = false;
        break;
      }
      case PARTICIPANT_USER_DELETE_LIST_SUCCESS: {
        draft.st_participantUserDeleteListDone = true;
        draft.st_participantUserDeleteListLoading = false;
        draft.partUserDeleteList = action.data.list;
        break;
      }
      case PARTICIPANT_USER_DELETE_LIST_FAILURE: {
        draft.st_participantUserDeleteListLoading = false;
        draft.st_participantUserDeleteListDone = false;
        draft.st_participantUserDeleteListError = action.error;
        break;
      }

      //////////////////////////////////////////////

      case PARTICIPANT_USER_MOVE_LIST_REQUEST: {
        draft.st_participantUserMoveListLoading = true;
        draft.st_participantUserMoveListDone = null;
        draft.st_participantUserMoveListError = false;
        break;
      }
      case PARTICIPANT_USER_MOVE_LIST_SUCCESS: {
        draft.st_participantUserMoveListDone = true;
        draft.st_participantUserMoveListLoading = false;
        draft.partUserMoveList = action.data.list;
        break;
      }
      case PARTICIPANT_USER_MOVE_LIST_FAILURE: {
        draft.st_participantUserMoveListLoading = false;
        draft.st_participantUserMoveListDone = false;
        draft.st_participantUserMoveListError = action.error;
        break;
      }

      //////////////////////////////////////////////

      default:
        break;
    }
  });

export default reducer;
