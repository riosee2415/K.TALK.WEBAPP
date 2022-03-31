import produce from "../util/produce";

export const initialState = {
  partList: [],
  partLectureList: [],
  partAdminList: [], // 관리자에서 보는 참여 목록
  partLastPage: 1,
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
        draft.st_participantLectureListDone = false;
        draft.st_participantLectureListError = true;
        draft.partLectureList = action.data.partList;
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

      default:
        break;
    }
  });

export default reducer;
