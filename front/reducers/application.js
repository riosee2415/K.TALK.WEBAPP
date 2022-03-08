import produce from "../util/produce";

export const initialState = {
  //
  st_appCreateLoading: false, // 신청서 생성
  st_appCreateDone: false,
  st_appCreateError: null,
};

export const APP_CREATE_REQUEST = "APP_CREATE_REQUEST";
export const APP_CREATE_SUCCESS = "APP_CREATE_SUCCESS";
export const APP_CREATE_FAILURE = "APP_CREATE_FAILURE";

const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      //////////////////////////////////////////////

      case APP_CREATE_REQUEST: {
        draft.st_appCreateLoading = true;
        draft.st_appCreateDone = false;
        draft.st_appCreateError = null;
        break;
      }
      case APP_CREATE_SUCCESS: {
        draft.st_appCreateLoading = false;
        draft.st_appCreateDone = true;
        break;
      }
      case APP_CREATE_FAILURE: {
        draft.st_appCreateLoading = false;
        draft.st_appCreateDone = false;
        draft.st_appCreateError = action.error;
        break;
      }

      //////////////////////////////////////////////

      default:
        break;
    }
  });

export default reducer;
