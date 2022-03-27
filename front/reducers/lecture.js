import produce from "../util/produce";

export const initailState = {
  lectures: null,
  allLectures: null,
  maxPage: 1,
  lectureLastPage: 1,
  lectureTeacherList: null,
  lectureStudentList: null,
  lectureDetail: null,
  lectureHomeworkList: null,
  lectureHomeworkLastPage: null,
  lectureDiaryList: null,
  lectureDiaryLastPage: 1,
  lectureDiaryAdminList: null,
  lecturePath: null,
  lectureSubmitList: null,
  lectureSubmitLastPage: 1,

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
  st_lectureTeacherListLoading: false,
  st_lectureTeacherListDone: false,
  st_lectureTeacherListError: null,
  //
  st_lectureStudentListLoading: false,
  st_lectureStudentListDone: false,
  st_lectureStudentListError: null,
  //
  st_lectureDetailLoading: false,
  st_lectureDetailDone: false,
  st_lectureDetailError: null,
  //
  st_lectureDiaryListLoading: false,
  st_lectureDiaryListDone: false,
  st_lectureDiaryListError: null,
  //
  st_lectureDiaryAdminListLoading: false,
  st_lectureDiaryAdminListDone: false,
  st_lectureDiaryAdminListError: null,
  //
  st_lectureAllListLoading: false,
  st_lectureAllListDone: false,
  st_lectureAllListError: null,
  st_lectureDiaryCreateLoading: false,
  st_lectureDiaryCreateDone: false,
  st_lectureDiaryCreateError: null,
  //
  st_lectureHomeWorkListLoading: false,
  st_lectureHomeWorkListDone: false,
  st_lectureHomeWorkListError: null,
  //
  st_lectureHomeWorkCreateLoading: false,
  st_lectureHomeWorkCreateDone: false,
  st_lectureHomeWorkCreateError: null,
  //
  st_lectureFileLoading: false,
  st_lectureFileDone: false,
  st_lectureFileError: null,
  //
  st_lectureSubmitListLoading: false,
  st_lectureSubmitListDone: false,
  st_lectureSubmitListError: null,
  //
  st_lectureSubmitCreateLoading: false,
  st_lectureSubmitCreateDone: false,
  st_lectureSubmitCreateError: null,
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
export const LECTURE_DETAIL_REQUEST = "LECTURE_DETAIL_REQUEST";
export const LECTURE_DETAIL_SUCCESS = "LECTURE_DETAIL_SUCCESS";
export const LECTURE_DETAIL_FAILURE = "LECTURE_DETAIL_FAILURE";
//
export const LECTURE_DIARY_LIST_REQUEST = "LECTURE_DIARY_LIST_REQUEST";
export const LECTURE_DIARY_LIST_SUCCESS = "LECTURE_DIARY_LIST_SUCCESS";
export const LECTURE_DIARY_LIST_FAILURE = "LECTURE_DIARY_LIST_FAILURE";
//
export const LECTURE_DIARY_ADMIN_LIST_REQUEST =
  "LECTURE_DIARY_ADMIN_LIST_REQUEST";
export const LECTURE_DIARY_ADMIN_LIST_SUCCESS =
  "LECTURE_DIARY_ADMIN_LIST_SUCCESS";
export const LECTURE_DIARY_ADMIN_LIST_FAILURE =
  "LECTURE_DIARY_ADMIN_LIST_FAILURE";
//
export const LECTURE_ALL_LIST_REQUEST = "LECTURE_ALL_LIST_REQUEST";
export const LECTURE_ALL_LIST_SUCCESS = "LECTURE_ALL_LIST_SUCCESS";
export const LECTURE_ALL_LIST_FAILURE = "LECTURE_ALL_LIST_FAILURE";
//
export const LECTURE_DIARY_CREATE_REQUEST = "LECTURE_DIARY_CREATE_REQUEST";
export const LECTURE_DIARY_CREATE_SUCCESS = "LECTURE_DIARY_CREATE_SUCCESS";
export const LECTURE_DIARY_CREATE_FAILURE = "LECTURE_DIARY_CREATE_FAILURE";
//
export const LECTURE_HOMEWORK_LIST_REQUEST = "LECTURE_HOMEWORK_LIST_REQUEST";
export const LECTURE_HOMEWORK_LIST_SUCCESS = "LECTURE_HOMEWORK_LIST_SUCCESS";
export const LECTURE_HOMEWORK_LIST_FAILURE = "LECTURE_HOMEWORK_LIST_FAILURE";
//
export const LECTURE_HOMEWORK_CREATE_REQUEST =
  "LECTURE_HOMEWORK_CREATE_REQUEST";
export const LECTURE_HOMEWORK_CREATE_SUCCESS =
  "LECTURE_HOMEWORK_CREATE_SUCCESS";
export const LECTURE_HOMEWORK_CREATE_FAILURE =
  "LECTURE_HOMEWORK_CREATE_FAILURE";

export const LECTURE_FILE_REQUEST = "LECTURE_FILE_REQUEST";
export const LECTURE_FILE_SUCCESS = "LECTURE_FILE_SUCCESS";
export const LECTURE_FILE_FAILURE = "LECTURE_FILE_FAILURE";
//
export const LECTURE_SUBMIT_LIST_REQUEST = "LECTURE_SUBMIT_LIST_REQUEST";
export const LECTURE_SUBMIT_LIST_SUCCESS = "LECTURE_SUBMIT_LIST_SUCCESS";
export const LECTURE_SUBMIT_LIST_FAILURE = "LECTURE_SUBMIT_LIST_FAILURE";
//
export const LECTURE_SUBMIT_CREATE_REQUEST = "LECTURE_SUBMIT_CREATE_REQUEST";
export const LECTURE_SUBMIT_CREATE_SUCCESS = "LECTURE_SUBMIT_CREATE_SUCCESS";
export const LECTURE_SUBMIT_CREATE_FAILURE = "LECTURE_SUBMIT_CREATE_FAILURE";
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
        draft.lectureLastPage = action.data.lastPage;
        break;
      }
      case LECTURE_LIST_FAILURE: {
        draft.st_lectureListLoading = false;
        draft.st_lectureListDone = false;
        draft.st_lectureListError = action.error;
        break;
      }
      ///////////////////////////////////////////////////////
      case LECTURE_ALL_LIST_REQUEST: {
        draft.st_lectureAllListLoading = true;
        draft.st_lectureAllListDone = null;
        draft.st_lectureAllListError = false;
        break;
      }
      case LECTURE_ALL_LIST_SUCCESS: {
        draft.st_lectureAllListLoading = false;
        draft.st_lectureAllListDone = true;
        draft.allLectures = action.data;
        // draft.maxPage = action.data.lastPage;
        break;
      }
      case LECTURE_ALL_LIST_FAILURE: {
        draft.st_lectureAllListLoading = false;
        draft.st_lectureAllListDone = false;
        draft.st_lectureAllListError = action.error;
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
        draft.lectureTeacherList = action.data.list;
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
      case LECTURE_DETAIL_REQUEST: {
        draft.st_lectureDetailLoading = true;
        draft.st_lectureDetailDone = null;
        draft.st_lectureDetailError = false;
        break;
      }
      case LECTURE_DETAIL_SUCCESS: {
        draft.st_lectureDetailLoading = false;
        draft.st_lectureDetailDone = true;
        draft.lectureDetail = action.data.list;
        break;
      }
      case LECTURE_DETAIL_FAILURE: {
        draft.st_lectureDetailLoading = false;
        draft.st_lectureDetailDone = false;
        draft.st_lectureDetailError = action.error;
        break;
      }

      ///////////////////////////////////////////////////////

      case LECTURE_DIARY_LIST_REQUEST: {
        draft.st_lectureDiaryListLoading = true;
        draft.st_lectureDiaryListDone = null;
        draft.st_lectureDiaryListError = false;
        break;
      }
      case LECTURE_DIARY_LIST_SUCCESS: {
        draft.st_lectureDiaryListLoading = false;
        draft.st_lectureDiaryListDone = true;
        draft.lectureDiaryList = action.data.diarys;
        draft.lectureDiaryLastPage = action.data.lastPage;
        break;
      }

      case LECTURE_DIARY_LIST_FAILURE: {
        draft.st_lectureDiaryListLoading = false;
        draft.st_lectureDiaryListDone = false;
        draft.st_lectureDiaryListError = action.error;
        break;
      }

      ///////////////////////////////////////////////////////

      case LECTURE_DIARY_ADMIN_LIST_REQUEST: {
        draft.st_lectureDiaryAdminListLoading = true;
        draft.st_lectureDiaryAdminListDone = null;
        draft.st_lectureDiaryAdminListError = false;
        break;
      }
      case LECTURE_DIARY_ADMIN_LIST_SUCCESS: {
        draft.st_lectureDiaryAdminListLoading = false;
        draft.st_lectureDiaryAdminListDone = true;
        draft.lectureDiaryAdminList = action.data.list;
        break;
      }
      case LECTURE_DIARY_ADMIN_LIST_FAILURE: {
        draft.st_lectureDiaryAdminListLoading = false;
        draft.st_lectureDiaryAdminListDone = false;
        draft.st_lectureDiaryAdminListError = action.error;
        break;
      }

      ///////////////////////////////////////////////////////

      case LECTURE_DIARY_CREATE_REQUEST: {
        draft.st_lectureDiaryCreateLoading = true;
        draft.st_lectureDiaryCreateDone = null;
        draft.st_lectureDiaryCreateError = false;
        break;
      }
      case LECTURE_DIARY_CREATE_SUCCESS: {
        draft.st_lectureDiaryCreateLoading = false;
        draft.st_lectureDiaryCreateDone = true;
        break;
      }
      case LECTURE_DIARY_CREATE_FAILURE: {
        draft.st_lectureDiaryCreateLoading = false;
        draft.st_lectureDiaryCreateDone = false;
        draft.st_lectureDiaryCreateError = action.error;
        break;
      }

      ///////////////////////////////////////////////////////

      case LECTURE_HOMEWORK_LIST_REQUEST: {
        draft.st_lectureHomeWorkLoading = true;
        draft.st_lectureHomeWorkDone = null;
        draft.st_lectureHomeWorkError = false;
        break;
      }
      case LECTURE_HOMEWORK_LIST_SUCCESS: {
        draft.st_lectureHomeWorkLoading = false;
        draft.st_lectureHomeWorkDone = true;
        draft.lectureHomeworkList = action.data.homeworks;
        draft.lectureHomeworkLastPage = action.data.lastPage;
        break;
      }
      case LECTURE_HOMEWORK_LIST_FAILURE: {
        draft.st_lectureHomeWorkLoading = false;
        draft.st_lectureHomeWorkDone = false;
        draft.st_lectureHomeWorkError = action.error;
        break;
      }

      ///////////////////////////////////////////////////////

      case LECTURE_HOMEWORK_CREATE_REQUEST: {
        draft.st_lectureHomeWorkCreateLoading = true;
        draft.st_lectureHomeWorkCreateDone = null;
        draft.st_lectureHomeWorkCreateError = false;
        break;
      }
      case LECTURE_HOMEWORK_CREATE_SUCCESS: {
        draft.st_lectureHomeWorkCreateLoading = false;
        draft.st_lectureHomeWorkCreateDone = true;
        break;
      }
      case LECTURE_HOMEWORK_CREATE_FAILURE: {
        draft.st_lectureHomeWorkCreateLoading = false;
        draft.st_lectureHomeWorkCreateDone = false;
        draft.st_lectureHomeWorkCreateError = action.error;
        break;
      }

      ///////////////////////////////////////////////////////

      case LECTURE_FILE_REQUEST: {
        draft.st_lectureFileLoading = true;
        draft.st_lectureFileDone = null;
        draft.st_lectureFileError = false;
        break;
      }
      case LECTURE_FILE_SUCCESS: {
        draft.st_lectureFileLoading = false;
        draft.st_lectureFileDone = true;
        draft.lecturePath = action.data.path;
        break;
      }
      case LECTURE_FILE_FAILURE: {
        draft.st_lectureFileLoading = false;
        draft.st_lectureFileDone = false;
        draft.st_lectureFileError = action.error;
        break;
      }

      ///////////////////////////////////////////////////////

      case LECTURE_SUBMIT_LIST_REQUEST: {
        draft.st_lectureSubmitListLoading = true;
        draft.st_lectureSubmitListDone = null;
        draft.st_lectureSubmitListError = false;
        break;
      }
      case LECTURE_SUBMIT_LIST_SUCCESS: {
        draft.st_lectureSubmitListLoading = false;
        draft.st_lectureSubmitListDone = true;
        draft.lectureSubmitList = action.data.submits;
        draft.lectureSubmitLastPage = action.data.lastPage;
        break;
      }
      case LECTURE_SUBMIT_LIST_FAILURE: {
        draft.st_lectureSubmitListLoading = false;
        draft.st_lectureSubmitListDone = false;
        draft.st_lectureSubmitListError = action.error;
        break;
      }

      ///////////////////////////////////////////////////////

      case LECTURE_SUBMIT_CREATE_REQUEST: {
        draft.st_lectureSubmitCreateLoading = true;
        draft.st_lectureSubmitCreateDone = null;
        draft.st_lectureSubmitCreateError = false;
        break;
      }
      case LECTURE_SUBMIT_CREATE_SUCCESS: {
        draft.st_lectureSubmitCreateLoading = false;
        draft.st_lectureSubmitCreateDone = true;
        break;
      }
      case LECTURE_SUBMIT_CREATE_FAILURE: {
        draft.st_lectureSubmitCreateLoading = false;
        draft.st_lectureSubmitCreateDone = false;
        draft.st_lectureSubmitCreateError = action.error;
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
