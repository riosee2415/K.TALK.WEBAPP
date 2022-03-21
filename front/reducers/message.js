import produce from "../util/produce";

export const initialState = {
  messageList: [],
  messageDetail: [],
  //
  st_messageListLoading: false,
  st_messageListDone: false,
  st_messageListError: null,
  //
  st_messageDetailLoading: false,
  st_messageDetailDone: false,
  st_messageDetailError: null,
  //
  st_messageCreateLoading: false,
  st_messageCreateDone: false,
  st_messageCreateError: null,
  //
  st_messageDeleteLoading: false,
  st_messageDeleteDone: false,
  st_messageDeleteError: null,
  //
  st_messageManyCreateLoading: false,
  st_messageManyCreateDone: false,
  st_messageManyCreateError: null,
  //
  st_messageAllCreateLoading: false,
  st_messageAllCreateDone: false,
  st_messageAllCreateError: null,
};

export const MESSAGE_LIST_REQUEST = "MESSAGE_LIST_REQUEST";
export const MESSAGE_LIST_SUCCESS = "MESSAGE_LIST_SUCCESS";
export const MESSAGE_LIST_FAILURE = "MESSAGE_LIST_FAILURE";

export const MESSAGE_DETAIL_REQUEST = "MESSAGE__DETAIL_REQUEST";
export const MESSAGE_DETAIL_SUCCESS = "MESSAGE__DETAIL_SUCCESS";
export const MESSAGE_DETAIL_FAILURE = "MESSAGE__DETAIL_FAILURE";

export const MESSAGE_CREATE_REQUEST = "MESSAGE__CREATE_REQUEST";
export const MESSAGE_CREATE_SUCCESS = "MESSAGE__CREATE_SUCCESS";
export const MESSAGE_CREATE_FAILURE = "MESSAGE__CREATE_FAILURE";

export const MESSAGE_DELETE_REQUEST = "MESSAGE__DELETE_REQUEST";
export const MESSAGE_DELETE_SUCCESS = "MESSAGE__DELETE_SUCCESS";
export const MESSAGE_DELETE_FAILURE = "MESSAGE__DELETE_FAILURE";

export const MESSAGE_MANY_CREATE_REQUEST = "MESSAGE__MANY_CREATE_REQUEST";
export const MESSAGE_MANY_CREATE_SUCCESS = "MESSAGE__MANY_CREATE_SUCCESS";
export const MESSAGE_MANY_CREATE_FAILURE = "MESSAGE__MANY_CREATE_FAILURE";

export const MESSAGE_ALL_CREATE_REQUEST = "MESSAGE_ALL_CREATE_REQUEST";
export const MESSAGE_ALL_CREATE_SUCCESS = "MESSAGE_ALL_CREATE_SUCCESS";
export const MESSAGE_ALL_CREATE_FAILURE = "MESSAGE_ALL_CREATE_FAILURE";

const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case MESSAGE_LIST_REQUEST: {
        draft.st_messageListLoading = true;
        draft.st_messageListDone = null;
        draft.st_messageListError = false;
        break;
      }
      case MESSAGE_LIST_SUCCESS: {
        draft.st_messageListLoading = false;
        draft.st_messageListDone = true;
        draft.messageList = action.data.messages;
        break;
      }
      case MESSAGE_LIST_FAILURE: {
        draft.st_messageListLoading = false;
        draft.st_messageListDone = false;
        draft.st_messageListError = action.error;
        break;
      }

      //////////////////////////////////////////////

      case MESSAGE_DETAIL_REQUEST: {
        draft.st_messageDetailLoading = true;
        draft.st_messageDetailDone = null;
        draft.st_messageDetailError = false;
        break;
      }
      case MESSAGE_DETAIL_SUCCESS: {
        draft.st_messageDetailLoading = false;
        draft.st_messageDetailDone = true;
        draft.messageDetail = action.data.message;
        break;
      }
      case MESSAGE_DETAIL_FAILURE: {
        draft.st_messageDetailLoading = false;
        draft.st_messageDetailDone = false;
        draft.st_messageDetailError = action.error;
        break;
      }

      //////////////////////////////////////////////

      case MESSAGE_CREATE_REQUEST: {
        draft.st_messageCreateLoading = true;
        draft.st_messageCreateDone = null;
        draft.st_messageCreateError = false;
        break;
      }
      case MESSAGE_CREATE_SUCCESS: {
        draft.st_messageCreateLoading = false;
        draft.st_messageCreateDone = true;
        break;
      }
      case MESSAGE_CREATE_FAILURE: {
        draft.st_messageCreateLoading = false;
        draft.st_messageCreateDone = false;
        draft.st_messageCreateError = action.error;
        break;
      }

      //////////////////////////////////////////////

      case MESSAGE_DELETE_REQUEST: {
        draft.st_messageDeleteLoading = true;
        draft.st_messageDeleteDone = null;
        draft.st_messageDeleteError = false;
        break;
      }
      case MESSAGE_DELETE_SUCCESS: {
        draft.st_messageDeleteLoading = false;
        draft.st_messageDeleteDone = true;
        break;
      }
      case MESSAGE_DELETE_FAILURE: {
        draft.st_messageDeleteLoading = false;
        draft.st_messageDeleteDone = false;
        draft.st_messageDeleteError = action.error;
        break;
      }

      //////////////////////////////////////////////

      case MESSAGE_MANY_CREATE_REQUEST: {
        draft.st_messageManyCreateLoading = true;
        draft.st_messageManyCreateDone = null;
        draft.st_messageManyCreateError = false;
        break;
      }
      case MESSAGE_MANY_CREATE_SUCCESS: {
        draft.st_messageManyCreateLoading = false;
        draft.st_messageManyCreateDone = true;
        break;
      }
      case MESSAGE_MANY_CREATE_FAILURE: {
        draft.st_messageManyCreateLoading = false;
        draft.st_messageManyCreateDone = false;
        draft.st_messageManyCreateError = action.error;
        break;
      }

      //////////////////////////////////////////////

      case MESSAGE_ALL_CREATE_REQUEST: {
        draft.st_messageAllCreateLoading = true;
        draft.st_messageAllCreateDone = null;
        draft.st_messageAllCreateError = false;
        break;
      }
      case MESSAGE_ALL_CREATE_SUCCESS: {
        draft.st_messageAllCreateLoading = false;
        draft.st_messageAllCreateDone = true;
        break;
      }
      case MESSAGE_ALL_CREATE_FAILURE: {
        draft.st_messageAllCreateLoading = false;
        draft.st_messageAllCreateDone = false;
        draft.st_messageAllCreateError = action.error;
        break;
      }

      //////////////////////////////////////////////

      default:
        break;
    }
  });

export default reducer;
