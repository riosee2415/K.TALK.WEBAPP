import produce from "../util/produce";

export const initialState = {
  messageReceiver: [],
  messageSender: [],
  messageDetail: [],
  //
  st_messageReceiverListLoading: false,
  st_messageReceiverListDone: false,
  st_messageReceiverListError: null,
  //
  st_messageSenderListLoading: false,
  st_messageSenderListDone: false,
  st_messageSenderListError: null,
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

export const MESSAGE_RECEIVER_LIST_REQUEST = "MESSAGE_RECEIVER_LIST_REQUEST";
export const MESSAGE_RECEIVER_LIST_SUCCESS = "MESSAGE_RECEIVER_LIST_SUCCESS";
export const MESSAGE_RECEIVER_LIST_FAILURE = "MESSAGE_RECEIVER_LIST_FAILURE";

export const MESSAGE_SENDER_LIST_REQUEST = "MESSAGE_SENDER_LIST_REQUEST";
export const MESSAGE_SENDER_LIST_SUCCESS = "MESSAGE_SENDER_LIST_SUCCESS";
export const MESSAGE_SENDER_LIST_FAILURE = "MESSAGE_SENDER_LIST_FAILURE";

export const MESSAGE_DETAIL_REQUEST = "MESSAGE_DETAIL_REQUEST";
export const MESSAGE_DETAIL_SUCCESS = "MESSAGE_DETAIL_SUCCESS";
export const MESSAGE_DETAIL_FAILURE = "MESSAGE_DETAIL_FAILURE";

export const MESSAGE_CREATE_REQUEST = "MESSAGE_CREATE_REQUEST";
export const MESSAGE_CREATE_SUCCESS = "MESSAGE_CREATE_SUCCESS";
export const MESSAGE_CREATE_FAILURE = "MESSAGE_CREATE_FAILURE";

export const MESSAGE_DELETE_REQUEST = "MESSAGE_DELETE_REQUEST";
export const MESSAGE_DELETE_SUCCESS = "MESSAGE_DELETE_SUCCESS";
export const MESSAGE_DELETE_FAILURE = "MESSAGE_DELETE_FAILURE";

export const MESSAGE_MANY_CREATE_REQUEST = "MESSAGE_MANY_CREATE_REQUEST";
export const MESSAGE_MANY_CREATE_SUCCESS = "MESSAGE_MANY_CREATE_SUCCESS";
export const MESSAGE_MANY_CREATE_FAILURE = "MESSAGE_MANY_CREATE_FAILURE";

export const MESSAGE_ALL_CREATE_REQUEST = "MESSAGE_ALL_CREATE_REQUEST";
export const MESSAGE_ALL_CREATE_SUCCESS = "MESSAGE_ALL_CREATE_SUCCESS";
export const MESSAGE_ALL_CREATE_FAILURE = "MESSAGE_ALL_CREATE_FAILURE";

const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case MESSAGE_RECEIVER_LIST_REQUEST: {
        draft.st_messageReceiverListLoading = true;
        draft.st_messageReceiverListDone = null;
        draft.st_messageReceiverListError = false;
        break;
      }
      case MESSAGE_RECEIVER_LIST_SUCCESS: {
        draft.st_messageReceiverListLoading = false;
        draft.st_messageReceiverListDone = true;
        draft.messageReceiver = action.data.messages;
        break;
      }
      case MESSAGE_RECEIVER_LIST_FAILURE: {
        draft.st_messageReceiverListLoading = false;
        draft.st_messageReceiverListDone = false;
        draft.st_messageReceiverListError = action.error;
        break;
      }

      //////////////////////////////////////////////

      case MESSAGE_SENDER_LIST_REQUEST: {
        draft.st_messageSenderListLoading = true;
        draft.st_messageSenderListDone = null;
        draft.st_messageSenderListError = false;
        break;
      }
      case MESSAGE_SENDER_LIST_SUCCESS: {
        draft.st_messageSenderListLoading = false;
        draft.st_messageSenderListDone = true;
        draft.messageSender = action.data.messages;
        break;
      }
      case MESSAGE_SENDER_LIST_FAILURE: {
        draft.st_messageSenderListLoading = false;
        draft.st_messageSenderListDone = false;
        draft.st_messageSenderListError = action.error;
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
