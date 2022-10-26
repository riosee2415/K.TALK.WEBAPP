import produce from "../util/produce";

export const initialState = {
  partList: [],

  teaPartList: [],

  partLectureList: [],
  partLecturePrice: null,
  partAdminList: [], // 관리자에서 보는 참여 목록
  partLastPage: 1,
  partUserDeleteList: [],
  partUserMoveList: [],
  partUserCurrentList: [],
  partUserLimitList: [],
  partLastDateList: [],
  partLastList: [], // 남은수업횟수

  studentLists: null, // 학생이 학생목록 조회
  //
  st_participantListLoading: false,
  st_participantListDone: false,
  st_participantListError: null,
  //
  st_participantLectureListLoading: false,
  st_participantLectureListDone: false,
  st_participantLectureListError: null,
  //
  st_participantCreateLoading: false,
  st_participantCreateDone: false,
  st_participantCreateError: null,
  //
  st_participantAdminLoading: false,
  st_participantAdminDone: false,
  st_participantAdminError: null,
  //
  st_participantDeleteLoading: false,
  st_participantDeleteDone: false,
  st_participantDeleteError: null,
  //
  st_participantUserDeleteListLoading: false,
  st_participantUserDeleteListDone: false,
  st_participantUserDeleteListError: null,
  //
  st_participantUserMoveListLoading: false,
  st_participantUserMoveListDone: false,
  st_participantUserMoveListError: null,
  //
  st_participantUserCurrentListLoading: false,
  st_participantUserCurrentListDone: false,
  st_participantUserCurrentListError: null,
  //
  st_participantUserLimitListLoading: false,
  st_participantUserLimitListDone: false,
  st_participantUserLimitListError: null,
  //
  st_participantLastDateListLoading: false,
  st_participantLastDateListDone: false,
  st_participantLastDateListError: null,
  //
  st_teacherParticipantListLoading: false,
  st_teacherParticipantListDone: false,
  st_teacherParticipantListError: null,
  //
  st_ParticipantUpdateLoading: false,
  st_ParticipantUpdateDone: false,
  st_ParticipantUpdateError: null,
  //
  st_participantStudentListLoading: false, // 학생이 학생목록 조회
  st_participantStudentListDone: false,
  st_participantStudentListError: null,
  //
  st_partLastListLoading: false, // 남은 횟수 조회
  st_partLastListDone: false,
  st_partLastListError: null,
};

export const PARTICIPANT_LIST_REQUEST = "PARTICIPANT_LIST_REQUEST";
export const PARTICIPANT_LIST_SUCCESS = "PARTICIPANT_LIST_SUCCESS";
export const PARTICIPANT_LIST_FAILURE = "PARTICIPANT_LIST_FAILURE";

export const TEACHER_PARTICIPANT_LIST_REQUEST =
  "TEACHER_PARTICIPANT_LIST_REQUEST";
export const TEACHER_PARTICIPANT_LIST_SUCCESS =
  "TEACHER_PARTICIPANT_LIST_SUCCESS";
export const TEACHER_PARTICIPANT_LIST_FAILURE =
  "TEACHER_PARTICIPANT_LIST_FAILURE";

export const PARTICIPANT_LECTURE_LIST_REQUEST =
  "PARTICIPANT_LECTURE_LIST_REQUEST";
export const PARTICIPANT_LECTURE_LIST_SUCCESS =
  "PARTICIPANT_LECTURE_LIST_SUCCESS";
export const PARTICIPANT_LECTURE_LIST_FAILURE =
  "PARTICIPANT_LECTURE_LIST_FAILURE";

export const PARTICIPANT_ADMIN_LIST_REQUEST = "PARTICIPANT_ADMIN_LIST_REQUEST";
export const PARTICIPANT_ADMIN_LIST_SUCCESS = "PARTICIPANT_ADMIN_LIST_SUCCESS";
export const PARTICIPANT_ADMIN_LIST_FAILURE = "PARTICIPANT_ADMIN_LIST_FAILURE";

export const PARTICIPANT_CREATE_REQUEST = "PARTICIPANT_CREATE_REQUEST";
export const PARTICIPANT_CREATE_SUCCESS = "PARTICIPANT_CREATE_SUCCESS";
export const PARTICIPANT_CREATE_FAILURE = "PARTICIPANT_CREATE_FAILURE";

export const PARTICIPANT_DELETE_REQUEST = "PARTICIPANT_DELETE_REQUEST";
export const PARTICIPANT_DELETE_SUCCESS = "PARTICIPANT_DELETE_SUCCESS";
export const PARTICIPANT_DELETE_FAILURE = "PARTICIPANT_DELETE_FAILURE";

export const PARTICIPANT_USER_DELETE_LIST_REQUEST =
  "PARTICIPANT_USER_DELETE_LIST_REQUEST";
export const PARTICIPANT_USER_DELETE_LIST_SUCCESS =
  "PARTICIPANT_USER_DELETE_LIST_SUCCESS";
export const PARTICIPANT_USER_DELETE_LIST_FAILURE =
  "PARTICIPANT_USER_DELETE_LIST_FAILURE";

export const PARTICIPANT_USER_MOVE_LIST_REQUEST =
  "PARTICIPANT_USER_MOVE_LIST_REQUEST";
export const PARTICIPANT_USER_MOVE_LIST_SUCCESS =
  "PARTICIPANT_USER_MOVE_LIST_SUCCESS";
export const PARTICIPANT_USER_MOVE_LIST_FAILURE =
  "PARTICIPANT_USER_MOVE_LIST_FAILURE";

export const PARTICIPANT_USER_CURRENT_LIST_REQUEST =
  "PARTICIPANT_USER_CURRENT_LIST_REQUEST";
export const PARTICIPANT_USER_CURRENT_LIST_SUCCESS =
  "PARTICIPANT_USER_CURRENT_LIST_SUCCESS";
export const PARTICIPANT_USER_CURRENT_LIST_FAILURE =
  "PARTICIPANT_USER_CURRENT_LIST_FAILURE";

export const PARTICIPANT_USER_LIMIT_LIST_REQUEST =
  "PARTICIPANT_USER_LIMIT_LIST_REQUEST";
export const PARTICIPANT_USER_LIMIT_LIST_SUCCESS =
  "PARTICIPANT_USER_LIMIT_LIST_SUCCESS";
export const PARTICIPANT_USER_LIMIT_LIST_FAILURE =
  "PARTICIPANT_USER_LIMIT_LIST_FAILURE";

export const PARTICIPANT_LASTDATE_LIST_REQUEST =
  "PARTICIPANT_LASTDATE_LIST_REQUEST";
export const PARTICIPANT_LASTDATE_LIST_SUCCESS =
  "PARTICIPANT_LASTDATE_LIST_SUCCESS";
export const PARTICIPANT_LASTDATE_LIST_FAILURE =
  "PARTICIPANT_LASTDATE_LIST_FAILURE";

export const PARTICIPANT_UPDATE_REQUEST = "PARTICIPANT_UPDATE_REQUEST";
export const PARTICIPANT_UPDATE_SUCCESS = "PARTICIPANT_UPDATE_SUCCESS";
export const PARTICIPANT_UPDATE_FAILURE = "PARTICIPANT_UPDATE_FAILURE";

export const PARTICIPANT_STUDENT_LIST_REQUEST =
  "PARTICIPANT_STUDENT_LIST_REQUEST";
export const PARTICIPANT_STUDENT_LIST_SUCCESS =
  "PARTICIPANT_STUDENT_LIST_SUCCESS";
export const PARTICIPANT_STUDENT_LIST_FAILURE =
  "PARTICIPANT_STUDENT_LIST_FAILURE";

export const PART_LAST_LIST_REQUEST = "PART_LAST_LIST_REQUEST";
export const PART_LAST_LIST_SUCCESS = "PART_LAST_LIST_SUCCESS";
export const PART_LAST_LIST_FAILURE = "PART_LAST_LIST_FAILURE";

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
        draft.st_participantListLoading = false;
        draft.st_participantListDone = true;
        draft.partList = action.data.partList;
        draft.partLastPage = action.data.lastPage;
        break;
      }
      case PARTICIPANT_LIST_FAILURE: {
        draft.st_participantListLoading = false;
        draft.st_participantListDone = false;
        draft.st_participantListError = action.error;
        break;
      }

      //////////////////////////////////////////////
      case TEACHER_PARTICIPANT_LIST_REQUEST: {
        draft.st_teacherParticipantListLoading = true;
        draft.st_teacherParticipantListDone = null;
        draft.st_teacherParticipantListError = false;
        break;
      }
      case TEACHER_PARTICIPANT_LIST_SUCCESS: {
        draft.st_teacherParticipantListLoading = false;
        draft.st_teacherParticipantListDone = true;
        draft.teaPartList = action.data.list;
        break;
      }
      case TEACHER_PARTICIPANT_LIST_FAILURE: {
        draft.st_teacherParticipantListLoading = false;
        draft.st_teacherParticipantListDone = false;
        draft.st_teacherParticipantListError = action.error;
        break;
      }

      //////////////////////////////////////////////

      case PARTICIPANT_LECTURE_LIST_REQUEST: {
        draft.st_participantLectureListLoading = true;
        draft.st_participantLectureListDone = null;
        draft.st_participantLectureListError = false;
        break;
      }
      case PARTICIPANT_LECTURE_LIST_SUCCESS: {
        draft.st_participantLectureListLoading = false;
        draft.st_participantLectureListDone = true;
        draft.partLectureList = action.data.partList;
        draft.partLecturePrice = action.data.price;
        break;
      }
      case PARTICIPANT_LECTURE_LIST_FAILURE: {
        draft.st_participantLectureListLoading = false;
        draft.st_participantLectureListDone = false;
        draft.st_participantLectureListError = action.error;
        break;
      }

      //////////////////////////////////////////////

      case PARTICIPANT_ADMIN_LIST_REQUEST: {
        draft.st_participantAdminLoading = true;
        draft.st_participantAdminDone = null;
        draft.st_participantAdminError = false;
        break;
      }

      case PARTICIPANT_ADMIN_LIST_SUCCESS: {
        draft.st_participantAdminLoading = false;
        draft.st_participantAdminDone = true;
        draft.partAdminList = action.data;
        break;
      }
      case PARTICIPANT_ADMIN_LIST_FAILURE: {
        draft.st_participantAdminLoading = false;
        draft.st_participantAdminDone = false;
        draft.st_participantAdminError = action.error;
        break;
      }

      //////////////////////////////////////////////

      case PARTICIPANT_CREATE_REQUEST: {
        draft.st_participantCreateLoading = true;
        draft.st_participantCreateDone = null;
        draft.st_participantCreateError = false;
        break;
      }
      case PARTICIPANT_CREATE_SUCCESS: {
        draft.st_participantCreateDone = true;
        draft.st_participantCreateLoading = false;
        break;
      }
      case PARTICIPANT_CREATE_FAILURE: {
        draft.st_participantCreateLoading = false;
        draft.st_participantCreateDone = false;
        draft.st_participantCreateError = action.error;
        break;
      }

      //////////////////////////////////////////////

      case PARTICIPANT_DELETE_REQUEST: {
        draft.st_participantDeleteLoading = true;
        draft.st_participantDeleteDone = false;
        draft.st_participantDeleteError = null;
        break;
      }
      case PARTICIPANT_DELETE_SUCCESS: {
        draft.st_participantDeleteLoading = false;
        draft.st_participantDeleteDone = true;
        draft.st_participantDeleteError = null;

        break;
      }
      case PARTICIPANT_DELETE_FAILURE: {
        draft.st_participantDeleteLoading = false;
        draft.st_participantDeleteDone = false;
        draft.st_participantDeleteError = action.error;
        break;
      }

      //////////////////////////////////////////////

      case PARTICIPANT_USER_DELETE_LIST_REQUEST: {
        draft.st_participantUserDeleteListLoading = true;
        draft.st_participantUserDeleteListDone = null;
        draft.st_participantUserDeleteListError = false;
        break;
      }
      case PARTICIPANT_USER_DELETE_LIST_SUCCESS: {
        draft.st_participantUserDeleteListDone = true;
        draft.st_participantUserDeleteListLoading = false;
        draft.partUserDeleteList = action.data.list;
        break;
      }
      case PARTICIPANT_USER_DELETE_LIST_FAILURE: {
        draft.st_participantUserDeleteListLoading = false;
        draft.st_participantUserDeleteListDone = false;
        draft.st_participantUserDeleteListError = action.error;
        break;
      }

      //////////////////////////////////////////////

      case PARTICIPANT_USER_MOVE_LIST_REQUEST: {
        draft.st_participantUserMoveListLoading = true;
        draft.st_participantUserMoveListDone = false;
        draft.st_participantUserMoveListError = null;
        break;
      }
      case PARTICIPANT_USER_MOVE_LIST_SUCCESS: {
        draft.st_participantUserMoveListDone = true;
        draft.st_participantUserMoveListLoading = false;
        draft.partUserMoveList = action.data.list;
        break;
      }
      case PARTICIPANT_USER_MOVE_LIST_FAILURE: {
        draft.st_participantUserMoveListLoading = false;
        draft.st_participantUserMoveListDone = false;
        draft.st_participantUserMoveListError = action.error;
        break;
      }

      //////////////////////////////////////////////

      case PARTICIPANT_USER_CURRENT_LIST_REQUEST: {
        draft.st_participantUserCurrentListLoading = true;
        draft.st_participantUserCurrentListDone = false;
        draft.st_participantUserCurrentListError = null;
        break;
      }
      case PARTICIPANT_USER_CURRENT_LIST_SUCCESS: {
        draft.st_participantUserCurrentListLoading = true;
        draft.st_participantUserCurrentListDone = false;
        draft.partUserCurrentList = action.data;
        break;
      }
      case PARTICIPANT_USER_CURRENT_LIST_FAILURE: {
        draft.st_participantUserCurrentListLoading = false;
        draft.st_participantUserCurrentListDone = false;
        draft.st_participantUserCurrentListError = action.error;
        break;
      }

      //////////////////////////////////////////////

      case PARTICIPANT_USER_LIMIT_LIST_REQUEST: {
        draft.st_participantUserLimitListLoading = true;
        draft.st_participantUserLimitListDone = false;
        draft.st_participantUserLimitListError = null;
        break;
      }
      case PARTICIPANT_USER_LIMIT_LIST_SUCCESS: {
        draft.st_participantUserLimitListDone = true;
        draft.st_participantUserLimitListLoading = false;
        draft.st_participantUserLimitListError = null;
        draft.partUserLimitList = action.data.list;
        break;
      }
      case PARTICIPANT_USER_LIMIT_LIST_FAILURE: {
        draft.st_participantUserLimitListLoading = false;
        draft.st_participantUserLimitListDone = false;
        draft.st_participantUserLimitListError = action.error;
        break;
      }

      //////////////////////////////////////////////

      case PARTICIPANT_LASTDATE_LIST_REQUEST: {
        draft.st_participantLastDateListLoading = true;
        draft.st_participantLastDateListDone = null;
        draft.st_participantLastDateListError = false;
        break;
      }
      case PARTICIPANT_LASTDATE_LIST_SUCCESS: {
        draft.st_participantLastDateListDone = true;
        draft.st_participantLastDateListLoading = false;
        draft.partLastDateList = action.data.list;
        break;
      }
      case PARTICIPANT_LASTDATE_LIST_FAILURE: {
        draft.st_participantLastDateListLoading = false;
        draft.st_participantLastDateListDone = false;
        draft.st_participantLastDateListError = action.error;
        break;
      }

      //////////////////////////////////////////////

      case PARTICIPANT_UPDATE_REQUEST: {
        draft.st_participantUpdateLoading = true;
        draft.st_participantUpdateDone = null;
        draft.st_participantUpdateError = false;
        break;
      }
      case PARTICIPANT_UPDATE_SUCCESS: {
        draft.st_participantUpdateLoading = false;
        draft.st_participantUpdateDone = true;
        break;
      }
      case PARTICIPANT_UPDATE_FAILURE: {
        draft.st_participantUpdateLoading = false;
        draft.st_participantUpdateDone = false;
        draft.st_participantUpdateError = action.error;
        break;
      }

      //////////////////////////////////////////////

      case PARTICIPANT_STUDENT_LIST_REQUEST: {
        draft.st_participantStudentListLoading = true;
        draft.st_participantStudentListDone = false;
        draft.st_participantStudentListError = null;
        break;
      }
      case PARTICIPANT_STUDENT_LIST_SUCCESS: {
        draft.st_participantStudentListLoading = false;
        draft.st_participantStudentListDone = true;
        draft.st_participantStudentListError = null;
        draft.studentLists = action.data.list;
        break;
      }
      case PARTICIPANT_STUDENT_LIST_FAILURE: {
        draft.st_participantStudentListLoading = false;
        draft.st_participantStudentListDone = false;
        draft.st_participantStudentListError = action.error;
        break;
      }

      //////////////////////////////////////////////

      case PART_LAST_LIST_REQUEST: {
        draft.st_partLastListLoading = true;
        draft.st_partLastListDone = false;
        draft.st_partLastListError = null;
        break;
      }
      case PART_LAST_LIST_SUCCESS: {
        draft.st_partLastListLoading = false;
        draft.st_partLastListDone = true;
        draft.st_partLastListError = null;
        draft.partLastList = action.data;
        break;
      }
      case PART_LAST_LIST_FAILURE: {
        draft.st_partLastListLoading = false;
        draft.st_partLastListDone = false;
        draft.st_partLastListError = action.error;
        break;
      }

      //////////////////////////////////////////////

      default:
        break;
    }
  });

export default reducer;
