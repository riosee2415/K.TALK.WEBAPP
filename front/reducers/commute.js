import produce from "../util/produce";

export const initialState = {
  commuteList: [],
  commuteLastPage: 1,
  //
  st_commuteListLoading: false, // 메인배너 가져오기
  st_commuteListDone: false,
  st_commuteListError: null,
  //
  st_commuteCreateLoading: false, // 메인배너 가져오기
  st_commuteCreateDone: false,
  st_commuteCreateError: null,
};

export const COMMUTE_LIST_REQUEST = "COMMUTE_LIST_REQUEST";
export const COMMUTE_LIST_SUCCESS = "COMMUTE_LIST_SUCCESS";
export const COMMUTE_LIST_FAILURE = "COMMUTE_LIST_FAILURE";

export const COMMUTE_CREATE_REQUEST = "COMMUTE_CREATE_REQUEST";
export const COMMUTE_CREATE_SUCCESS = "COMMUTE_CREATE_SUCCESS";
export const COMMUTE_CREATE_FAILURE = "COMMUTE_CREATE_FAILURE";

const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case COMMUTE_LIST_REQUEST: {
        draft.st_commuteListLoading = true;
        draft.st_commuteListDone = null;
        draft.st_commuteListError = false;
        break;
      }
      case COMMUTE_LIST_SUCCESS: {
        draft.st_commuteListLoading = false;
        draft.st_commuteListDone = true;
        draft.commuteList = action.data.commute;
        draft.commuteLastPage = action.data.lastPage;
        break;
      }
      case COMMUTE_LIST_FAILURE: {
        draft.st_commuteListLoading = false;
        draft.st_commuteListDone = false;
        draft.st_commuteListError = action.error;
        break;
      }

      //////////////////////////////////////////////

      case COMMUTE_CREATE_REQUEST: {
        draft.st_commuteCreateLoading = true;
        draft.st_commuteCreateDone = null;
        draft.st_commuteCreateError = false;
        break;
      }
      case COMMUTE_CREATE_SUCCESS: {
        draft.st_commuteCreateLoading = false;
        draft.st_commuteCreateDone = true;
        break;
      }
      case COMMUTE_CREATE_FAILURE: {
        draft.st_commuteCreateLoading = false;
        draft.st_commuteCreateDone = false;
        draft.st_commuteCreateError = action.error;
        break;
      }
      //////////////////////////////////////////////

      default:
        break;
    }
  });

export default reducer;
