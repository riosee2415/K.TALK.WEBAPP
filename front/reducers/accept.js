import produce from "../util/produce";

export const initialState = {
  acceptList: [],
  //
  st_acceptLogLoading: false, // 메인배너 가져오기
  st_acceptLogDone: false,
  st_acceptLogError: null,
};

export const ACCEPT_LOG_REQUEST = "ACCEPT_LOG_REQUEST";
export const ACCEPT_LOG_SUCCESS = "ACCEPT_LOG_SUCCESS";
export const ACCEPT_LOG_FAILURE = "ACCEPT_LOG_FAILURE";

const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case ACCEPT_LOG_REQUEST: {
        draft.st_acceptLogLoading = true;
        draft.st_acceptLogDone = null;
        draft.st_acceptLogError = false;
        break;
      }
      case ACCEPT_LOG_SUCCESS: {
        draft.st_acceptLogLoading = false;
        draft.st_acceptLogDone = true;
        draft.acceptList = action.data;
        break;
      }
      case ACCEPT_LOG_FAILURE: {
        draft.st_acceptLogLoading = false;
        draft.st_acceptLogDone = false;
        draft.st_acceptLogError = action.error;
        break;
      }
      //////////////////////////////////////////////

      default:
        break;
    }
  });

export default reducer;
