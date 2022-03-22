import produce from "../util/produce";

export const initailState = {
  lectures: null,
  maxPage: 1,
  lectureTearcherList: null,
  lectureStudentList: null,
  detailLectures: null,
  createModal: false,
  detailModal: false,
  updateModal: false,
  //
  st_lectureListLoading: false, // 공지사항 가져오기
  st_lectureListDone: false,
  st_lectureListError: null,
  //
  st_lectureCreateLoading: false, // 공지사항 가져오기
  st_lectureCreateDone: false,
  st_lectureCreateError: null,
  //
  st_lectureUpdateLoading: false, // 공지사항 업데이트
  st_lectureUpdateDone: false,
  st_lectureUpdateError: null,
  //
  st_lectureDeleteLoading: false, // 공지사항 삭제
  st_lectureDeleteDone: false,
  st_lectureDeleteError: null,
  //
  st_lectureStudentListLoading: false,
  st_lectureTearcherListDone: false,
  st_lectureTearcherListError: null,
  //
  st_lectureStudentListLoading: false,
  st_lectureStudentListDone: false,
  st_lectureStudentListError: null,
  //
  st_lectureDetailLectureLoading: false,
  st_lectureDetailLectureDone: false,
  st_lectureDetailLectureError: null,
  //
};

export const LECTURE_LIST_REQUEST = "LECTURE_LIST_REQUEST";
export const LECTURE_LIST_SUCCESS = "LECTURE_LIST_SUCCESS";
export const LECTURE_LIST_FAILURE = "LECTURE_LIST_FAILURE";
//
export const LECTURE_CREATE_REQUEST = "LECTURE_CREATE_REQUEST";
export const LECTURE_CREATE_SUCCESS = "LECTURE_CREATE_SUCCESS";
export const LECTURE_CREATE_FAILURE = "LECTURE_CREATE_FAILURE";
//
export const LECTURE_UPDATE_REQUEST = "LECTURE_UPDATE_REQUEST";
export const LECTURE_UPDATE_SUCCESS = "LECTURE_UPDATE_SUCCESS";
export const LECTURE_UPDATE_FAILURE = "LECTURE_UPDATE_FAILURE";
//
export const LECTURE_DELETE_REQUEST = "LECTURE_DELETE_REQUEST";
export const LECTURE_DELETE_SUCCESS = "LECTURE_DELETE_SUCCESS";
export const LECTURE_DELETE_FAILURE = "LECTURE_DELETE_FAILURE";
//
export const LECTURE_TEACHER_LIST_REQUEST = "LECTURE_TEACHER_LIST_REQUEST";
export const LECTURE_TEACHER_LIST_SUCCESS = "LECTURE_TEACHER_LIST_SUCCESS";
export const LECTURE_TEACHER_LIST_FAILURE = "LECTURE_TEACHER_LIST_FAILURE";
//
export const LECTURE_STUDENT_LIST_REQUEST = "LECTURE_STUDENT_LIST_REQUEST";
export const LECTURE_STUDENT_LIST_SUCCESS = "LECTURE_STUDENT_LIST_SUCCESS";
export const LECTURE_STUDENT_LIST_FAILURE = "LECTURE_STUDENT_LIST_FAILURE";
//
export const LECTURE_DETAIL_LECTURE_REQUEST = "LECTURE_DETAIL_LECTURE_REQUEST";
export const LECTURE_DETAIL_LECTURE_SUCCESS = "LECTURE_DETAIL_LECTURE_SUCCESS";
export const LECTURE_DETAIL_LECTURE_FAILURE = "LECTURE_DETAIL_LECTURE_FAILURE";
//
export const CREATE_MODAL_OPEN_REQUEST = "CREATE_MODAL_OPEN_REQUEST";
export const CREATE_MODAL_CLOSE_REQUEST = "CREATE_MODAL_CLOSE_REQUEST";

export const DETAIL_MODAL_OPEN_REQUEST = "DETAIL_MODAL_OPEN_REQUEST";
export const DETAIL_MODAL_CLOSE_REQUEST = "DETAIL_MODAL_CLOSE_REQUEST";

export const UPDATE_MODAL_OPEN_REQUEST = "UPDATE_MODAL_OPEN_REQUEST";
export const UPDATE_MODAL_CLOSE_REQUEST = "UPDATE_MODAL_CLOSE_REQUEST";

const reducer = (state = initailState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case LECTURE_LIST_REQUEST: {
        draft.st_lectureListLoading = true;
        draft.st_lectureListDone = null;
        draft.st_lectureListError = false;
        break;
      }
      case LECTURE_LIST_SUCCESS: {
        draft.st_lectureListLoading = false;
        draft.st_lectureListDone = true;
        draft.lectures = action.data;
        // draft.maxPage = action.data.lastPage;
        break;
      }
      case LECTURE_LIST_FAILURE: {
        draft.st_lectureListLoading = false;
        draft.st_lectureListDone = false;
        draft.st_lectureListError = action.error;
        break;
      }
      ///////////////////////////////////////////////////////
      case LECTURE_CREATE_REQUEST: {
        draft.st_lectureCreateLoading = true;
        draft.st_lectureCreateDone = null;
        draft.st_lectureCreateError = false;
        break;
      }
      case LECTURE_CREATE_SUCCESS: {
        draft.st_lectureCreateLoading = false;
        draft.st_lectureCreateDone = true;
        break;
      }
      case LECTURE_CREATE_FAILURE: {
        draft.st_lectureCreateLoading = false;
        draft.st_lectureCreateDone = false;
        draft.st_lectureCreateError = action.error;
        break;
      }
      ///////////////////////////////////////////////////////
      case LECTURE_UPDATE_REQUEST: {
        draft.st_lectureUpdateLoading = true;
        draft.st_lectureUpdateDone = null;
        draft.st_lectureUpdateError = false;
        break;
      }
      case LECTURE_UPDATE_SUCCESS: {
        draft.st_lectureUpdateLoading = false;
        draft.st_lectureUpdateDone = true;
        break;
      }
      case LECTURE_UPDATE_FAILURE: {
        draft.st_lectureUpdateLoading = false;
        draft.st_lectureUpdateDone = false;
        draft.st_lectureUpdateError = action.error;
        break;
      }
      ///////////////////////////////////////////////////////
      case LECTURE_DELETE_REQUEST: {
        draft.st_lectureDeleteLoading = true;
        draft.st_lectureDeleteDone = null;
        draft.st_lectureDeleteError = false;
        break;
      }
      case LECTURE_DELETE_SUCCESS: {
        draft.st_lectureDeleteLoading = false;
        draft.st_lectureDeleteDone = true;
        break;
      }
      case LECTURE_DELETE_FAILURE: {
        draft.st_lectureDeleteLoading = false;
        draft.st_lectureDeleteDone = false;
        draft.st_lectureDeleteError = action.error;
        break;
      }

      ///////////////////////////////////////////////////////
      case LECTURE_TEACHER_LIST_REQUEST: {
        draft.st_lectureTeacherListLoading = true;
        draft.st_lectureTeacherListDone = null;
        draft.st_lectureTeacherListError = false;
        break;
      }
      case LECTURE_TEACHER_LIST_SUCCESS: {
        draft.st_lectureTeacherListLoading = false;
        draft.st_lectureTeacherListDone = true;
        draft.lectureTearcherList = action.data.list;
        break;
      }
      case LECTURE_TEACHER_LIST_FAILURE: {
        draft.st_lectureTeacherListLoading = false;
        draft.st_lectureTeacherListDone = false;
        draft.st_lectureTeacherListError = action.error;
        break;
      }

      ///////////////////////////////////////////////////////
      case LECTURE_STUDENT_LIST_REQUEST: {
        draft.st_lectureStudentListLoading = true;
        draft.st_lectureStudentListDone = null;
        draft.st_lectureStudentListError = false;
        break;
      }
      case LECTURE_STUDENT_LIST_SUCCESS: {
        draft.st_lectureStudentListLoading = false;
        draft.st_lectureStudentListDone = true;
        draft.lectureStudentList = action.data;
        break;
      }
      case LECTURE_STUDENT_LIST_FAILURE: {
        draft.st_lectureStudentListLoading = false;
        draft.st_lectureStudentListDone = false;
        draft.st_lectureStudentListError = action.error;
        break;
      }

      ///////////////////////////////////////////////////////
      case LECTURE_DETAIL_LECTURE_REQUEST: {
        draft.st_lectureDetailLectureLoading = true;
        draft.st_lectureDetailLectureDone = null;
        draft.st_lectureDetailLectureError = false;
        break;
      }
      case LECTURE_DETAIL_LECTURE_SUCCESS: {
        draft.st_lectureDetailLectureLoading = false;
        draft.st_lectureDetailLectureDone = true;
        draft.detailLectures = action.data.list;
        break;
      }
      case LECTURE_DETAIL_LECTURE_FAILURE: {
        draft.st_lectureDetailLectureLoading = false;
        draft.st_lectureDetailLectureDone = false;
        draft.st_lectureDetailLectureError = action.error;
        break;
      }

      ///////////////////////////////////////////////////////
      ///////////////////////////////////////////////////////
      ///////////////////////////////////////////////////////

      case CREATE_MODAL_OPEN_REQUEST:
        draft.createModal = true;
        break;

      case CREATE_MODAL_CLOSE_REQUEST:
        draft.createModal = false;
        break;
      ///////////////////////////////////////////////////////

      case DETAIL_MODAL_OPEN_REQUEST:
        draft.detailModal = true;
        break;

      case DETAIL_MODAL_CLOSE_REQUEST:
        draft.detailModal = false;
        break;
      ///////////////////////////////////////////////////////

      case UPDATE_MODAL_OPEN_REQUEST:
        draft.updateModal = true;
        break;

      case UPDATE_MODAL_CLOSE_REQUEST:
        draft.updateModal = false;
        break;
      ///////////////////////////////////////////////////////

      default:
        break;
    }
  });

export default reducer;
