import produce from "../util/produce";

export const initialState = {
  messageUserList: [],
  messageUserLastPage: 1,
  messageAdminList: [],
  messageTeacherList: [],
  messageLectureList: [],
  messageLectureLastPage: 1,
  messagePartList: [],
  messagePartLastPage: 1,
  messageAllList: [],
  messageAllLastPage: 1,
  //
  st_messageUserListLoading: false,
  st_messageUserListDone: false,
  st_messageUserListError: null,
  //
  st_messageAdminListLoading: false,
  st_messageAdminListDone: false,
  st_messageAdminListError: null,
  //
  st_messageDetailLoading: false,
  st_messageDetailDone: false,
  st_messageDetailError: null,
  //
  //
  st_messageTeacherListLoading: false,
  st_messageTeacherListDone: false,
  st_messageTeacherListError: null,
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
  //
  st_messageLectureCreateLoading: false,
  st_messageLectureCreateDone: false,
  st_messageLectureCreateError: null,
  //
  st_messageForAdminCreateLoading: false,
  st_messageForAdminCreateDone: false,
  st_messageForAdminCreateError: null,
  //
  st_messageLectureListLoading: false,
  st_messageLectureListDone: false,
  st_messageLectureListError: null,
  //
  st_messagePartListLoading: false,
  st_messagePartListDone: false,
  st_messagePartListError: null,
  //
  st_messageAllListLoading: false,
  st_messageAllListDone: false,
  st_messageAllListError: null,
};

export const MESSAGE_USER_LIST_REQUEST = "MESSAGE_USER_LIST_REQUEST";
export const MESSAGE_USER_LIST_SUCCESS = "MESSAGE_USER_LIST_SUCCESS";
export const MESSAGE_USER_LIST_FAILURE = "MESSAGE_USER_LIST_FAILURE";

export const MESSAGE_ADMIN_LIST_REQUEST = "MESSAGE_ADMIN_LIST_REQUEST";
export const MESSAGE_ADMIN_LIST_SUCCESS = "MESSAGE_ADMIN_LIST_SUCCESS";
export const MESSAGE_ADMIN_LIST_FAILURE = "MESSAGE_ADMIN_LIST_FAILURE";

export const MESSAGE_DETAIL_REQUEST = "MESSAGE_DETAIL_REQUEST";
export const MESSAGE_DETAIL_SUCCESS = "MESSAGE_DETAIL_SUCCESS";
export const MESSAGE_DETAIL_FAILURE = "MESSAGE_DETAIL_FAILURE";

export const MESSAGE_TEACHER_LIST_REQUEST = "MESSAGE_TEACHER_LIST_REQUEST";
export const MESSAGE_TEACHER_LIST_SUCCESS = "MESSAGE_TEACHER_LIST_SUCCESS";
export const MESSAGE_TEACHER_LIST_FAILURE = "MESSAGE_TEACHER_LIST_FAILURE";

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

export const MESSAGE_LECTURE_CREATE_REQUEST = "MESSAGE_LECTURE_CREATE_REQUEST";
export const MESSAGE_LECTURE_CREATE_SUCCESS = "MESSAGE_LECTURE_CREATE_SUCCESS";
export const MESSAGE_LECTURE_CREATE_FAILURE = "MESSAGE_LECTURE_CREATE_FAILURE";

export const MESSAGE_FOR_ADMIN_CREATE_REQUEST =
  "MESSAGE_FOR_ADMIN_CREATE_REQUEST";
export const MESSAGE_FOR_ADMIN_CREATE_SUCCESS =
  "MESSAGE_FOR_ADMIN_CREATE_SUCCESS";
export const MESSAGE_FOR_ADMIN_CREATE_FAILURE =
  "MESSAGE_FOR_ADMIN_CREATE_FAILURE";

export const MESSAGE_LECTURE_LIST_REQUEST = "MESSAGE_LECTURE_LIST_REQUEST";
export const MESSAGE_LECTURE_LIST_SUCCESS = "MESSAGE_LECTURE_LIST_SUCCESS";
export const MESSAGE_LECTURE_LIST_FAILURE = "MESSAGE_LECTURE_LIST_FAILURE";

export const MESSAGE_PART_LIST_REQUEST = "MESSAGE_PART_LIST_REQUEST";
export const MESSAGE_PART_LIST_SUCCESS = "MESSAGE_PART_LIST_SUCCESS";
export const MESSAGE_PART_LIST_FAILURE = "MESSAGE_PART_LIST_FAILURE";

export const MESSAGE_ALL_LIST_REQUEST = "MESSAGE_ALL_LIST_REQUEST";
export const MESSAGE_ALL_LIST_SUCCESS = "MESSAGE_ALL_LIST_SUCCESS";
export const MESSAGE_ALL_LIST_FAILURE = "MESSAGE_ALL_LIST_FAILURE";

const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case MESSAGE_USER_LIST_REQUEST: {
        draft.st_messageUserListLoading = true;
        draft.st_messageUserListDone = null;
        draft.st_messageUserListError = false;
        break;
      }
      case MESSAGE_USER_LIST_SUCCESS: {
        draft.st_messageUserListLoading = false;
        draft.st_messageUserListDone = true;
        draft.messageUserList = action.data.message;
        draft.messageUserLastPage = action.data.lastPage;
        break;
      }
      case MESSAGE_USER_LIST_FAILURE: {
        draft.st_messageUserListLoading = false;
        draft.st_messageUserListDone = false;
        draft.st_messageUserListError = action.error;
        break;
      }

      //////////////////////////////////////////////

      case MESSAGE_ADMIN_LIST_REQUEST: {
        draft.st_messageAdminListLoading = true;
        draft.st_messageAdminListDone = null;
        draft.st_messageAdminListError = false;
        break;
      }
      case MESSAGE_ADMIN_LIST_SUCCESS: {
        draft.st_messageAdminListLoading = false;
        draft.st_messageAdminListDone = true;
        draft.messageAdminList = action.data.messages;
        break;
      }
      case MESSAGE_ADMIN_LIST_FAILURE: {
        draft.st_messageAdminListLoading = false;
        draft.st_messageAdminListDone = false;
        draft.st_messageAdminListError = action.error;
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

      case MESSAGE_TEACHER_LIST_REQUEST: {
        draft.st_messageTeacherListLoading = true;
        draft.st_messageTeacherListDone = null;
        draft.st_messageTeacherListError = false;
        break;
      }
      case MESSAGE_TEACHER_LIST_SUCCESS: {
        draft.st_messageTeacherListLoading = false;
        draft.st_messageTeacherListDone = true;
        draft.messageTeacherList = action.data;
        break;
      }
      case MESSAGE_TEACHER_LIST_FAILURE: {
        draft.st_messageTeacherListLoading = false;
        draft.st_messageTeacherListDone = false;
        draft.st_messageTeacherListError = action.error;
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

      case MESSAGE_LECTURE_CREATE_REQUEST: {
        draft.st_messageLectureCreateLoading = true;
        draft.st_messageLectureCreateDone = null;
        draft.st_messageLectureCreateError = false;
        break;
      }
      case MESSAGE_LECTURE_CREATE_SUCCESS: {
        draft.st_messageLectureCreateLoading = false;
        draft.st_messageLectureCreateDone = true;
        break;
      }
      case MESSAGE_LECTURE_CREATE_FAILURE: {
        draft.st_messageLectureCreateLoading = false;
        draft.st_messageLectureCreateDone = false;
        draft.st_messageLectureCreateError = action.error;
        break;
      }

      //////////////////////////////////////////////

      case MESSAGE_FOR_ADMIN_CREATE_REQUEST: {
        draft.st_messageForAdminCreateLoading = true;
        draft.st_messageForAdminCreateDone = null;
        draft.st_messageForAdminCreateError = false;
        break;
      }
      case MESSAGE_FOR_ADMIN_CREATE_SUCCESS: {
        draft.st_messageForAdminCreateLoading = false;
        draft.st_messageForAdminCreateDone = true;
        break;
      }
      case MESSAGE_FOR_ADMIN_CREATE_FAILURE: {
        draft.st_messageForAdminCreateLoading = false;
        draft.st_messageForAdminCreateDone = false;
        draft.st_messageForAdminCreateError = action.error;
        break;
      }

      //////////////////////////////////////////////

      case MESSAGE_LECTURE_LIST_REQUEST: {
        draft.st_messageLectureListLoading = true;
        draft.st_messageLectureListDone = null;
        draft.st_messageLectureListError = false;
        break;
      }
      case MESSAGE_LECTURE_LIST_SUCCESS: {
        draft.st_messageLectureListLoading = false;
        draft.st_messageLectureListDone = true;
        draft.messageLectureList = action.data.messages;
        draft.messageLectureLastPage = action.data.lastPage;
        break;
      }
      case MESSAGE_LECTURE_LIST_FAILURE: {
        draft.st_messageLectureListLoading = false;
        draft.st_messageLectureListDone = false;
        draft.st_messageLectureListError = action.error;
        break;
      }

      //////////////////////////////////////////////

      case MESSAGE_PART_LIST_REQUEST: {
        draft.st_messagePartListLoading = true;
        draft.st_messagePartListDone = null;
        draft.st_messagePartListError = false;
        break;
      }
      case MESSAGE_PART_LIST_SUCCESS: {
        draft.st_messagePartListLoading = false;
        draft.st_messagePartListDone = true;
        draft.messagePartList = action.data.message;
        draft.messagePartLastPage = action.data.lastPage;
        break;
      }
      case MESSAGE_PART_LIST_FAILURE: {
        draft.st_messagePartListLoading = false;
        draft.st_messagePartListDone = false;
        draft.st_messagePartListError = action.error;
        break;
      }

      //////////////////////////////////////////////

      case MESSAGE_ALL_LIST_REQUEST: {
        draft.st_messageAllListLoading = true;
        draft.st_messageAllListDone = null;
        draft.st_messageAllListError = false;
        break;
      }
      case MESSAGE_ALL_LIST_SUCCESS: {
        draft.st_messageAllListLoading = false;
        draft.st_messageAllListDone = true;
        draft.messageAllList = action.data.message;
        draft.messagePartLastPage = action.data.lastPage;
        break;
      }
      case MESSAGE_ALL_LIST_FAILURE: {
        draft.st_messageAllListLoading = false;
        draft.st_messageAllListDone = false;
        draft.st_messageAllListError = action.error;
        break;
      }

      //////////////////////////////////////////////

      default:
        break;
    }
  });

export default reducer;
