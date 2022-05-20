import produce from "../util/produce";

export const initialState = {
  lectureMemoList: [],
  //
  st_lectureMemoListLoading: false,
  st_lectureMemoListDone: false,
  st_lectureMemoListError: null,

  st_lectureMemoCreateLoading: false,
  st_lectureMemoCreateDone: false,
  st_lectureMemoCreateError: null,

  st_lectureMemoUpdateLoading: false,
  st_lectureMemoUpdateDone: false,
  st_lectureMemoUpdateError: null,

  st_lectureMemoDeleteLoading: false,
  st_lectureMemoDeleteDone: false,
  st_lectureMemoDeleteError: null,
};

export const LECTURE_MEMO_LIST_REQUEST = "LECTURE_MEMO_LIST_REQUEST";
export const LECTURE_MEMO_LIST_SUCCESS = "LECTURE_MEMO_LIST_SUCCESS";
export const LECTURE_MEMO_LIST_FAILURE = "LECTURE_MEMO_LIST_FAILURE";

export const LECTURE_MEMO_CREATE_REQUEST = "LECTURE_MEMO_CREATE_REQUEST";
export const LECTURE_MEMO_CREATE_SUCCESS = "LECTURE_MEMO_CREATE_SUCCESS";
export const LECTURE_MEMO_CREATE_FAILURE = "LECTURE_MEMO_CREATE_FAILURE";

export const LECTURE_MEMO_UDPATE_REQUEST = "LECTURE_MEMO_UDPATE_REQUEST";
export const LECTURE_MEMO_UDPATE_SUCCESS = "LECTURE_MEMO_UDPATE_SUCCESS";
export const LECTURE_MEMO_UDPATE_FAILURE = "LECTURE_MEMO_UDPATE_FAILURE";

export const LECTURE_MEMO_DELETE_REQUEST = "LECTURE_MEMO_DELETE_REQUEST";
export const LECTURE_MEMO_DELETE_SUCCESS = "LECTURE_MEMO_DELETE_SUCCESS";
export const LECTURE_MEMO_DELETE_FAILURE = "LECTURE_MEMO_DELETE_FAILURE";

const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case LECTURE_MEMO_LIST_REQUEST: {
        draft.st_lectureMemoListLoading = true;
        draft.st_lectureMemoListDone = null;
        draft.st_lectureMemoListError = false;
        break;
      }
      case LECTURE_MEMO_LIST_SUCCESS: {
        draft.st_lectureMemoListLoading = false;
        draft.st_lectureMemoListDone = true;
        draft.lectureMemoList = action.data.list;
        break;
      }
      case LECTURE_MEMO_LIST_FAILURE: {
        draft.st_lectureMemoListLoading = false;
        draft.st_lectureMemoListDone = false;
        draft.st_lectureMemoListError = action.error;
        break;
      }
      //////////////////////////////////////////////
      case LECTURE_MEMO_CREATE_REQUEST: {
        draft.st_lectureMemoCreateLoading = true;
        draft.st_lectureMemoCreateDone = null;
        draft.st_lectureMemoCreateError = false;
        break;
      }
      case LECTURE_MEMO_CREATE_SUCCESS: {
        draft.st_lectureMemoCreateLoading = false;
        draft.st_lectureMemoCreateDone = true;
        break;
      }
      case LECTURE_MEMO_CREATE_FAILURE: {
        draft.st_lectureMemoCreateLoading = false;
        draft.st_lectureMemoCreateDone = false;
        draft.st_lectureMemoCreateError = action.error;
        break;
      }
      //////////////////////////////////////////////
      case LECTURE_MEMO_UDPATE_REQUEST: {
        draft.st_lectureMemoUpdateLoading = true;
        draft.st_lectureMemoUpdateDone = null;
        draft.st_lectureMemoUpdateError = false;
        break;
      }
      case LECTURE_MEMO_UDPATE_SUCCESS: {
        draft.st_lectureMemoUpdateLoading = false;
        draft.st_lectureMemoUpdateDone = true;
        break;
      }
      case LECTURE_MEMO_UDPATE_FAILURE: {
        draft.st_lectureMemoUpdateLoading = false;
        draft.st_lectureMemoUpdateDone = false;
        draft.st_lectureMemoUpdateError = action.error;
        break;
      }
      //////////////////////////////////////////////
      case LECTURE_MEMO_DELETE_REQUEST: {
        draft.st_lectureMemoDeleteLoading = true;
        draft.st_lectureMemoDeleteDone = null;
        draft.st_lectureMemoDeleteError = false;
        break;
      }
      case LECTURE_MEMO_DELETE_SUCCESS: {
        draft.st_lectureMemoDeleteLoading = false;
        draft.st_lectureMemoDeleteDone = true;
        break;
      }
      case LECTURE_MEMO_DELETE_FAILURE: {
        draft.st_lectureMemoDeleteLoading = false;
        draft.st_lectureMemoDeleteDone = false;
        draft.st_lectureMemoDeleteError = action.error;
        break;
      }
      //////////////////////////////////////////////

      default:
        break;
    }
  });

export default reducer;
