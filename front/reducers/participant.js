import produce from "../util/produce";

export const initialState = {
  acceptList: [],
  //
  st_participantListLoading: false, // 메인배너 가져오기
  st_participantListDone: false,
  st_participantListError: null,
  //
  st_participantAdminLoading: false, // 메인배너 가져오기
  st_participantAdminDone: false,
  st_participantAdminError: null,
};

export const PARTICIPANT_LIST_REQUEST = "PARTICIPANT_LIST_REQUEST";
export const PARTICIPANT_LIST_SUCCESS = "PARTICIPANT_LIST_SUCCESS";
export const PARTICIPANT_LIST_FAILURE = "PARTICIPANT_LIST_FAILURE";

export const PARTICIPANT_ADMIN_REQUEST = "PARTICIPANT_ADMIN_REQUEST";
export const PARTICIPANT_ADMIN_SUCCESS = "PARTICIPANT_ADMIN_SUCCESS";
export const PARTICIPANT_ADMIN_FAILURE = "PARTICIPANT_ADMIN_FAILURE";

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
        draft.st_acceptLogLoading = false;
        draft.st_acceptLogDone = true;
        draft.acceptList = action.data;
        break;
      }
      case PARTICIPANT_LIST_FAILURE: {
        draft.st_participantListLoading = false;
        draft.st_participantListDone = false;
        draft.st_participantListError = action.error;
        break;
      }
      //////////////////////////////////////////////

      default:
        break;
    }
  });

export default reducer;
