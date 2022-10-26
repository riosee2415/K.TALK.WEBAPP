import produce from "../util/produce";

export const initailState = {
  me: null,
  currentAdminMenu: [],
  users: null,
  allUsers: null,
  teachers: null,
  teacherList: null,

  userProfilePath: null,
  emailCheckBool: null,

  createModal: false,
  updateModal: false,
  meUpdateModal: false,
  postCodeModal: false,
  classChangeModal: false,
  classPartModal: false,

  userStuList: null,
  //
  st_loginLoading: false,
  st_loginDone: false,
  st_loginError: null,
  //
  st_logoutLoading: false,
  st_logoutDone: false,
  st_logoutError: null,
  //
  st_loginAdminLoading: false,
  st_loginAdminDone: false,
  st_loginAdminError: null,
  //
  st_signUpLoading: false,
  st_signUpDone: false,
  st_signUpError: null,
  //
  st_userCreateLoading: false,
  st_userCreateDone: false,
  st_userCreateError: null,
  //
  st_userListLoading: false,
  st_userListDone: false,
  st_userListError: null,
  //
  st_userAllListLoading: false,
  st_userAllListDone: false,
  st_userAllListError: null,
  //
  st_userListUpdateLoading: false,
  st_userListUpdateDone: false,
  st_userListUpdateError: null,
  //
  st_loadMyInfoLoading: false, // 로그인 정보 가져오기 시도 중
  st_loadMyInfoDone: false,
  st_loadMyInfoError: null,
  //
  st_kakaoLoginLoading: false,
  st_kakaoLoginDone: false,
  st_kakaoLoginError: null,
  //
  st_userStuCreateLoading: false,
  st_userStuCreateDone: false,
  st_userStuCreateError: null,
  //
  st_userTeaCreateLoading: false,
  st_userTeaCreateDone: false,
  st_userTeaCreateError: null,
  //
  st_userUserUpdateLoading: false,
  st_userUserUpdateDone: false,
  st_userUserUpdateError: null,
  //
  st_userProfileUploadLoading: false,
  st_userProfileUploadDone: false,
  st_userProfileUploadError: null,
  //
  st_userTeaUpdateLoading: false,
  st_userTeaUpdateDone: false,
  st_userTeaUpdateError: null,
  //
  st_userStuUpdateLoading: false,
  st_userStuUpdateDone: false,
  st_userStuUpdateError: null,
  //
  st_userChangeLoading: false,
  st_userChangeDone: false,
  st_userChangeError: null,
  //
  st_userTeacherListLoading: false,
  st_userTeacherListDone: false,
  st_userTeacherListError: null,
  //
  st_userFindEmailByLoading: false,
  st_userFindEmailByDone: false,
  st_userFindEmailByError: null,
  //
  st_userStuListLoading: false,
  st_userStuListDone: false,
  st_userStuListError: null,
  //
  st_userTeaListLoading: false,
  st_userTeaListDone: false,
  st_userTeaListError: null,
  //
  st_userFireUpdateLoading: false,
  st_userFireUpdateDone: false,
  st_userFireUpdateError: null,
  //
  st_userAdminUpdateLoading: false,
  st_userAdminUpdateDone: false,
  st_userAdminUpdateError: null,
  //
  st_userAdminTeacherUpdateLoading: false,
  st_userAdminTeacherUpdateDone: false,
  st_userAdminTeacherUpdateError: null,
};

export const LOGIN_REQUEST = "LOGIN_REQUEST";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAILURE = "LOGIN_FAILURE";

export const LOGOUT_REQUEST = "LOGOUT_REQUEST";
export const LOGOUT_SUCCESS = "LOGOUT_SUCCESS";
export const LOGOUT_FAILURE = "LOGOUT_FAILURE";

export const LOGIN_ADMIN_REQUEST = "LOGIN_ADMIN_REQUEST";
export const LOGIN_ADMIN_SUCCESS = "LOGIN_ADMIN_SUCCESS";
export const LOGIN_ADMIN_FAILURE = "LOGIN_ADMIN_FAILURE";

export const SIGNUP_REQUEST = "SIGNUP_REQUEST";
export const SIGNUP_SUCCESS = "SIGNUP_SUCCESS";
export const SIGNUP_FAILURE = "SIGNUP_FAILURE";

export const USER_CREATE_REQUEST = "USER_CREATE_REQUEST";
export const USER_CREATE_SUCCESS = "USER_CREATE_SUCCESS";
export const USER_CREATE_FAILURE = "USER_CREATE_FAILURE";

export const USERLIST_REQUEST = "USERLIST_REQUEST";
export const USERLIST_SUCCESS = "USERLIST_SUCCESS";
export const USERLIST_FAILURE = "USERLIST_FAILURE";

export const USER_ALL_LIST_REQUEST = "USER_ALL_LIST_REQUEST";
export const USER_ALL_LIST_SUCCESS = "USER_ALL_LIST_SUCCESS";
export const USER_ALL_LIST_FAILURE = "USER_ALL_LIST_FAILURE";

export const USER_TEACHER_LIST_REQUEST = "USER_TEACHER_LIST_REQUEST";
export const USER_TEACHER_LIST_SUCCESS = "USER_TEACHER_LIST_SUCCESS";
export const USER_TEACHER_LIST_FAILURE = "USER_TEACHER_LIST_FAILURE";

export const USERLIST_UPDATE_REQUEST = "USERLIST_UPDATE_REQUEST";
export const USERLIST_UPDATE_SUCCESS = "USERLIST_UPDATE_SUCCESS";
export const USERLIST_UPDATE_FAILURE = "USERLIST_UPDATE_FAILURE";

export const LOAD_MY_INFO_REQUEST = "LOAD_MY_INFO_REQUEST";
export const LOAD_MY_INFO_SUCCESS = "LOAD_MY_INFO_SUCCESS";
export const LOAD_MY_INFO_FAILURE = "LOAD_MY_INFO_FAILURE";

export const KAKAO_LOGIN_REQUEST = "KAKAO_LOGIN_REQUEST";
export const KAKAO_LOGIN_SUCCESS = "KAKAO_LOGIN_SUCCESS";
export const KAKAO_LOGIN_FAILURE = "KAKAO_LOGIN_FAILURE";

export const USER_STU_CREATE_REQUEST = "USER_STU_CREATE_REQUEST";
export const USER_STU_CREATE_SUCCESS = "USER_STU_CREATE_SUCCESS";
export const USER_STU_CREATE_FAILURE = "USER_STU_CREATE_FAILURE";

export const USER_TEA_CREATE_REQUEST = "USER_TEA_CREATE_REQUEST";
export const USER_TEA_CREATE_SUCCESS = "USER_TEA_CREATE_SUCCESS";
export const USER_TEA_CREATE_FAILURE = "USER_TEA_CREATE_FAILURE";

export const USER_UPDATE_REQUEST = "USER_UPDATE_REQUEST";
export const USER_UPDATE_SUCCESS = "USER_UPDATE_SUCCESS";
export const USER_UPDATE_FAILURE = "USER_UPDATE_FAILURE";

export const USER_PROFILE_UPLOAD_REQUEST = "USER_PROFILE_UPLOAD_REQUEST";
export const USER_PROFILE_UPLOAD_SUCCESS = "USER_PROFILE_UPLOAD_SUCCESS";
export const USER_PROFILE_UPLOAD_FAILURE = "USER_PROFILE_UPLOAD_FAILURE";

export const USER_TEA_UPDATE_REQUEST = "USER_TEA_UPDATE_REQUEST";
export const USER_TEA_UPDATE_SUCCESS = "USER_TEA_UPDATE_SUCCESS";
export const USER_TEA_UPDATE_FAILURE = "USER_TEA_UPDATE_FAILURE";

export const USER_STU_UPDATE_REQUEST = "USER_STU_UPDATE_REQUEST";
export const USER_STU_UPDATE_SUCCESS = "USER_STU_UPDATE_SUCCESS";
export const USER_STU_UPDATE_FAILURE = "USER_STU_UPDATE_FAILURE";

export const USER_CLASS_CHANGE_REQUEST = "USER_CLASS_CHANGE_REQUEST";
export const USER_CLASS_CHANGE_SUCCESS = "USER_CLASS_CHANGE_SUCCESS";
export const USER_CLASS_CHANGE_FAILURE = "USER_CLASS_CHANGE_FAILURE";

export const USER_FIND_EMAIL_BY_REQUEST = "USER_FIND_EMAIL_BY_REQUEST";
export const USER_FIND_EMAIL_BY_SUCCESS = "USER_FIND_EMAIL_BY_SUCCESS";
export const USER_FIND_EMAIL_BY_FAILURE = "USER_FIND_EMAIL_BY_FAILURE";

export const USER_STU_LIST_REQUEST = "USER_STU_LIST_REQUEST";
export const USER_STU_LIST_SUCCESS = "USER_STU_LIST_SUCCESS";
export const USER_STU_LIST_FAILURE = "USER_STU_LIST_FAILURE";

export const USER_TEA_LIST_REQUEST = "USER_TEA_LIST_REQUEST";
export const USER_TEA_LIST_SUCCESS = "USER_TEA_LIST_SUCCESS";
export const USER_TEA_LIST_FAILURE = "USER_TEA_LIST_FAILURE";

export const USER_FIRE_UPDATE_REQUEST = "USER_FIRE_UPDATE_REQUEST";
export const USER_FIRE_UPDATE_SUCCESS = "USER_FIRE_UPDATE_SUCCESS";
export const USER_FIRE_UPDATE_FAILURE = "USER_FIRE_UPDATE_FAILURE";

export const USER_ADMIN_UPDATE_REQUEST = "USER_ADMIN_UPDATE_REQUEST";
export const USER_ADMIN_UPDATE_SUCCESS = "USER_ADMIN_UPDATE_SUCCESS";
export const USER_ADMIN_UPDATE_FAILURE = "USER_ADMIN_UPDATE_FAILURE";

export const USER_ADMIN_TEACHER_UPDATE_REQUEST =
  "USER_ADMIN_TEACHER_UPDATE_REQUEST";
export const USER_ADMIN_TEACHER_UPDATE_SUCCESS =
  "USER_ADMIN_TEACHER_UPDATE_SUCCESS";
export const USER_ADMIN_TEACHER_UPDATE_FAILURE =
  "USER_ADMIN_TEACHER_UPDATE_FAILURE";

export const UPDATE_MODAL_OPEN_REQUEST = "UPDATE_MODAL_OPEN_REQUEST";
export const UPDATE_MODAL_CLOSE_REQUEST = "UPDATE_MODAL_CLOSE_REQUEST";

export const CHANGE_CLASS_OPEN_REQUEST = "CHANGE_CLASS_OPEN_REQUEST";
export const CHANGE_CLASS_CLOSE_REQUEST = "CHANGE_CLASS_CLOSE_REQUEST";

export const CLASS_PART_OPEN_REQUEST = "CLASS_PART_OPEN_REQUEST";
export const CLASS_PART_CLOSE_REQUEST = "CLASS_PART_CLOSE_REQUEST";

export const CREATE_MODAL_TOGGLE = "CREATE_MODAL_TOGGLE";

export const POSTCODE_MODAL_TOGGLE = "POSTCODE_MODAL_TOGGLE";

export const ME_UPDATE_MODAL_TOGGLE = "ME_UPDATE_MODAL_TOGGLE";

export const CURRENT_ADMINMENU_STATUS = "CURRENT_ADMINMENU_STATUS";

export const USER_PROFILE_IMAGE_PATH = "USER_PROFILE_IMAGE_PATH";

const reducer = (state = initailState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case LOAD_MY_INFO_REQUEST:
        console.log("GET SERVER SIDE PROPS ACTION");

        draft.st_loadMyInfoLoading = true;
        draft.st_loadMyInfoError = null;
        draft.st_loadMyInfoDone = false;
        break;

      case LOAD_MY_INFO_SUCCESS:
        draft.st_loadMyInfoLoading = false;
        draft.st_loadMyInfoDone = true;
        draft.me = action.data;
        break;

      case LOAD_MY_INFO_FAILURE:
        draft.st_loadMyInfoLoading = false;
        draft.st_loadMyInfoDone = false;
        draft.st_loadMyInfoError = action.error;
        break;

      ///////////////////////////////////////////////////////

      case LOGIN_REQUEST: {
        draft.st_loginLoading = true;
        draft.st_loginDone = null;
        draft.st_loginError = false;
        break;
      }
      case LOGIN_SUCCESS: {
        draft.st_loginLoading = false;
        draft.st_loginDone = true;
        draft.me = action.data;
        break;
      }
      case LOGIN_FAILURE: {
        draft.st_loginLoading = false;
        draft.st_loginDone = false;
        draft.st_loginError = action.error;
        break;
      }

      case LOGOUT_REQUEST: {
        draft.st_logoutLoading = true;
        draft.st_logoutDone = null;
        draft.st_logoutError = false;
        break;
      }
      case LOGOUT_SUCCESS: {
        draft.st_logoutLoading = false;
        draft.st_logoutDone = true;
        break;
      }
      case LOGOUT_FAILURE: {
        draft.st_logoutLoading = false;
        draft.st_logoutDone = false;
        draft.st_logoutError = action.error;
        break;
      }
      //////////////////////////////////////////////
      case LOGIN_ADMIN_REQUEST: {
        draft.st_loginAdminLoading = true;
        draft.st_loginAdminDone = null;
        draft.st_loginAdminError = false;
        break;
      }
      case LOGIN_ADMIN_SUCCESS: {
        draft.st_loginAdminLoading = false;
        draft.st_loginAdminDone = true;
        draft.me = action.data;
        break;
      }
      case LOGIN_ADMIN_FAILURE: {
        draft.st_loginAdminLoading = false;
        draft.st_loginAdminDone = false;
        draft.st_loginAdminError = action.error;
        break;
      }
      //////////////////////////////////////////////

      case SIGNUP_REQUEST: {
        draft.st_signUpLoading = true;
        draft.st_signUpDone = null;
        draft.st_signUpError = false;
        break;
      }
      case SIGNUP_SUCCESS: {
        draft.st_signUpLoading = false;
        draft.st_signUpDone = true;
        break;
      }
      case SIGNUP_FAILURE: {
        draft.st_signUpLoading = false;
        draft.st_signUpDone = false;
        draft.st_signUpError = action.error;
        break;
      }
      //////////////////////////////////////////////

      case USER_CREATE_REQUEST: {
        draft.st_userCreateLoading = true;
        draft.st_userCreateDone = null;
        draft.st_userCreateError = false;
        break;
      }
      case USER_CREATE_SUCCESS: {
        draft.st_userCreateLoading = false;
        draft.st_userCreateDone = true;
        break;
      }
      case USER_CREATE_FAILURE: {
        draft.st_userCreateLoading = false;
        draft.st_userCreateDone = false;
        draft.st_userCreateError = action.error;
        break;
      }
      //////////////////////////////////////////////

      case USERLIST_REQUEST: {
        draft.st_userListLoading = true;
        draft.st_userListDone = null;
        draft.st_userListError = false;
        break;
      }
      case USERLIST_SUCCESS: {
        draft.st_userListLoading = false;
        draft.st_userListDone = true;
        draft.users = action.data;
        break;
      }
      case USERLIST_FAILURE: {
        draft.st_userListLoading = false;
        draft.st_userListDone = false;
        draft.st_userListError = action.error;
        break;
      }
      //////////////////////////////////////////////

      case USER_ALL_LIST_REQUEST: {
        draft.st_userAllListLoading = true;
        draft.st_userAllListDone = false;
        draft.st_userAllListError = null;
        break;
      }
      case USER_ALL_LIST_SUCCESS: {
        draft.st_userAllListLoading = false;
        draft.st_userAllListDone = true;
        draft.st_userAllListError = null;
        draft.allUsers = action.data;
        break;
      }
      case USER_ALL_LIST_FAILURE: {
        draft.st_userAllListLoading = false;
        draft.st_userAllListDone = false;
        draft.st_userAllListError = action.error;
        break;
      }
      //////////////////////////////////////////////
      case USER_TEACHER_LIST_REQUEST: {
        draft.st_userTeacherListLoading = true;
        draft.st_userTeacherListDone = null;
        draft.st_userTeacherListError = false;
        break;
      }
      case USER_TEACHER_LIST_SUCCESS: {
        draft.st_userTeacherListLoading = false;
        draft.st_userTeacherListDone = true;
        draft.teachers = action.data;
        break;
      }
      case USER_TEACHER_LIST_FAILURE: {
        draft.st_userTeacherListLoading = false;
        draft.st_userTeacherListDone = false;
        draft.st_userTeacherListError = action.error;
        break;
      }
      //////////////////////////////////////////////

      case USERLIST_UPDATE_REQUEST: {
        draft.st_userListUpdateLoading = true;
        draft.st_userListUpdateDone = null;
        draft.st_userListUpdateError = false;
        break;
      }
      case USERLIST_UPDATE_SUCCESS: {
        draft.st_userListUpdateLoading = false;
        draft.st_userListUpdateDone = true;
        break;
      }
      case USERLIST_UPDATE_FAILURE: {
        draft.st_userListUpdateLoading = false;
        draft.st_userListUpdateDone = false;
        draft.st_userListUpdateError = action.error;
        break;
      }
      //////////////////////////////////////////////

      case KAKAO_LOGIN_REQUEST: {
        draft.st_kakaoLoginLoading = true;
        draft.st_kakaoLoginDone = null;
        draft.st_kakaoLoginError = false;
        break;
      }
      case KAKAO_LOGIN_SUCCESS: {
        draft.st_kakaoLoginLoading = false;
        draft.st_kakaoLoginDone = true;
        draft.st_kakaoLoginError = null;
        break;
      }
      case KAKAO_LOGIN_FAILURE: {
        draft.st_kakaoLoginLoading = false;
        draft.st_kakaoLoginDone = false;
        draft.st_kakaoLoginError = action.error;
        break;
      }
      //////////////////////////////////////////////

      case USER_STU_CREATE_REQUEST: {
        draft.st_userStuCreateLoading = true;
        draft.st_userStuCreateDone = null;
        draft.st_userStuCreateError = false;
        break;
      }
      case USER_STU_CREATE_SUCCESS: {
        draft.st_userStuCreateLoading = false;
        draft.st_userStuCreateDone = true;
        draft.st_userStuCreateError = null;
        break;
      }
      case USER_STU_CREATE_FAILURE: {
        draft.st_userStuCreateLoading = false;
        draft.st_userStuCreateDone = false;
        draft.st_userStuCreateError = action.error;
        break;
      }
      //////////////////////////////////////////////

      case USER_TEA_CREATE_REQUEST: {
        draft.st_userTeaCreateLoading = true;
        draft.st_userTeaCreateDone = null;
        draft.st_userTeaCreateError = false;
        break;
      }
      case USER_TEA_CREATE_SUCCESS: {
        draft.st_userTeaCreateLoading = false;
        draft.st_userTeaCreateDone = true;
        draft.st_userTeaCreateError = null;
        break;
      }
      case USER_TEA_CREATE_FAILURE: {
        draft.st_userTeaCreateLoading = false;
        draft.st_userTeaCreateDone = false;
        draft.st_userTeaCreateError = action.error;
        break;
      }
      //////////////////////////////////////////////

      case USER_UPDATE_REQUEST: {
        draft.st_userUserUpdateLoading = true;
        draft.st_userUserUpdateDone = null;
        draft.st_userUserUpdateError = false;
        break;
      }
      case USER_UPDATE_SUCCESS: {
        draft.st_userUserUpdateLoading = false;
        draft.st_userUserUpdateDone = true;
        draft.st_userUserUpdateError = null;
        break;
      }
      case USER_UPDATE_FAILURE: {
        draft.st_userUserUpdateLoading = false;
        draft.st_userUserUpdateDone = false;
        draft.st_userUserUpdateError = action.error;
        break;
      }
      //////////////////////////////////////////////

      case USER_PROFILE_UPLOAD_REQUEST: {
        draft.st_userProfileUploadLoading = true;
        draft.st_userProfileUploadDone = null;
        draft.st_userProfileUploadError = false;
        break;
      }
      case USER_PROFILE_UPLOAD_SUCCESS: {
        draft.st_userProfileUploadLoading = false;
        draft.st_userProfileUploadDone = true;
        draft.st_userProfileUploadError = null;
        draft.userProfilePath = action.data.path;
        break;
      }
      case USER_PROFILE_UPLOAD_FAILURE: {
        draft.st_userProfileUploadLoading = false;
        draft.st_userProfileUploadDone = false;
        draft.st_userProfileUploadError = action.error;
        break;
      }

      //////////////////////////////////////////////

      case USER_TEA_UPDATE_REQUEST: {
        draft.st_userTeaUpdateLoading = true;
        draft.st_userTeaUpdateDone = null;
        draft.st_userTeaUpdateError = false;
        break;
      }
      case USER_TEA_UPDATE_SUCCESS: {
        draft.st_userTeaUpdateLoading = false;
        draft.st_userTeaUpdateDone = true;
        draft.st_userTeaUpdateError = null;
        break;
      }
      case USER_TEA_UPDATE_FAILURE: {
        draft.st_userTeaUpdateLoading = false;
        draft.st_userTeaUpdateDone = false;
        draft.st_userTeaUpdateError = action.error;
        break;
      }

      //////////////////////////////////////////////

      case USER_STU_UPDATE_REQUEST: {
        draft.st_userStuUpdateLoading = true;
        draft.st_userStuUpdateDone = null;
        draft.st_userStuUpdateError = false;
        break;
      }
      case USER_STU_UPDATE_SUCCESS: {
        draft.st_userStuUpdateLoading = false;
        draft.st_userStuUpdateDone = true;
        draft.st_userStuUpdateError = null;
        break;
      }
      case USER_STU_UPDATE_FAILURE: {
        draft.st_userStuUpdateLoading = false;
        draft.st_userStuUpdateDone = false;
        draft.st_userStuUpdateError = action.error;
        break;
      }

      //////////////////////////////////////////////

      case USER_CLASS_CHANGE_REQUEST: {
        draft.st_userChangeLoading = true;
        draft.st_userChangeDone = false;
        draft.st_userChangeError = null;
        break;
      }
      case USER_CLASS_CHANGE_SUCCESS: {
        draft.st_userChangeLoading = false;
        draft.st_userChangeDone = true;
        draft.st_userChangeError = null;
        break;
      }
      case USER_CLASS_CHANGE_FAILURE: {
        draft.st_userChangeLoading = false;
        draft.st_userChangeDone = false;
        draft.st_userChangeError = action.error;
        break;
      }

      //////////////////////////////////////////////

      case USER_FIND_EMAIL_BY_REQUEST: {
        draft.st_userFindEmailByLoading = true;
        draft.st_userFindEmailByDone = null;
        draft.st_userFindEmailByError = false;
        break;
      }
      case USER_FIND_EMAIL_BY_SUCCESS: {
        draft.st_userFindEmailByLoading = false;
        draft.st_userFindEmailByDone = true;
        draft.emailCheckBool = action.data;
        break;
      }
      case USER_FIND_EMAIL_BY_FAILURE: {
        draft.st_userFindEmailByLoading = false;
        draft.st_userFindEmailByDone = false;
        draft.st_userFindEmailByError = action.error;
        break;
      }

      //////////////////////////////////////////////

      case USER_STU_LIST_REQUEST: {
        draft.st_userStuListLoading = true;
        draft.st_userStuListDone = null;
        draft.st_userStuListError = false;
        break;
      }
      case USER_STU_LIST_SUCCESS: {
        draft.st_userStuListLoading = false;
        draft.st_userStuListDone = true;
        draft.userStuList = action.data;
        break;
      }
      case USER_STU_LIST_FAILURE: {
        draft.st_userStuListLoading = false;
        draft.st_userStuListDone = false;
        draft.st_userStuListError = action.error;
        break;
      }

      //////////////////////////////////////////////

      case USER_FIRE_UPDATE_REQUEST: {
        draft.st_userFireUpdateLoading = true;
        draft.st_userFireUpdateDone = null;
        draft.st_userFireUpdateError = false;
        break;
      }
      case USER_FIRE_UPDATE_SUCCESS: {
        draft.st_userFireUpdateLoading = false;
        draft.st_userFireUpdateDone = true;
        break;
      }
      case USER_FIRE_UPDATE_FAILURE: {
        draft.st_userFireUpdateLoading = false;
        draft.st_userFireUpdateDone = false;
        draft.st_userFireUpdateError = action.error;
        break;
      }

      //////////////////////////////////////////////

      case USER_TEA_LIST_REQUEST: {
        draft.st_userTeaListLoading = true;
        draft.st_userTeaListDone = null;
        draft.st_userTeaListError = false;
        break;
      }
      case USER_TEA_LIST_SUCCESS: {
        draft.st_userTeaListLoading = false;
        draft.st_userTeaListDone = true;
        draft.teacherList = action.data.teachers;
        break;
      }
      case USER_TEA_LIST_FAILURE: {
        draft.st_userTeaListLoading = false;
        draft.st_userTeaListDone = false;
        draft.st_userTeaListError = action.error;
        break;
      }

      //////////////////////////////////////////////

      case USER_ADMIN_TEACHER_UPDATE_REQUEST: {
        draft.st_userAdminTeacherUpdateLoading = true;
        draft.st_userAdminTeacherUpdateDone = null;
        draft.st_userAdminTeacherUpdateError = false;
        break;
      }
      case USER_ADMIN_TEACHER_UPDATE_SUCCESS: {
        draft.st_userAdminTeacherUpdateLoading = false;
        draft.st_userAdminTeacherUpdateDone = true;
        break;
      }
      case USER_ADMIN_TEACHER_UPDATE_FAILURE: {
        draft.st_userAdminTeacherUpdateLoading = false;
        draft.st_userAdminTeacherUpdateDone = false;
        draft.st_userAdminTeacherUpdateError = action.error;
        break;
      }

      //////////////////////////////////////////////

      case USER_ADMIN_UPDATE_REQUEST: {
        draft.st_userAdminUpdateLoading = true;
        draft.st_userAdminUpdateDone = null;
        draft.st_userAdminUpdateError = false;
        break;
      }
      case USER_ADMIN_UPDATE_SUCCESS: {
        draft.st_userAdminUpdateLoading = false;
        draft.st_userAdminUpdateDone = true;
        break;
      }
      case USER_ADMIN_UPDATE_FAILURE: {
        draft.st_userAdminUpdateLoading = false;
        draft.st_userAdminUpdateDone = false;
        draft.st_userAdminUpdateError = action.error;
        break;
      }

      //////////////////////////////////////////////

      //////////////////////////////////////////////

      case CURRENT_ADMINMENU_STATUS: {
        const exist = draft.currentAdminMenu.filter(
          (data) => data === action.data.key
        );

        if (exist.length > 0) {
          draft.currentAdminMenu = draft.currentAdminMenu.filter(
            (data) => data !== action.data.key
          );
        } else {
          draft.currentAdminMenu = [...draft.currentAdminMenu, action.data.key];
        }

        break;
      }

      //////////////////////////////////////////////

      case CHANGE_CLASS_OPEN_REQUEST:
        draft.classChangeModal = true;
        break;

      case CHANGE_CLASS_CLOSE_REQUEST:
        draft.classChangeModal = false;
        break;

      case CLASS_PART_OPEN_REQUEST:
        draft.classPartModal = true;
        break;

      case CLASS_PART_CLOSE_REQUEST:
        draft.classPartModal = false;
        break;

      case UPDATE_MODAL_OPEN_REQUEST:
        draft.updateModal = true;
        break;

      case UPDATE_MODAL_CLOSE_REQUEST:
        draft.updateModal = false;
        break;

      case CREATE_MODAL_TOGGLE:
        draft.createModal = !draft.createModal;
        break;

      case POSTCODE_MODAL_TOGGLE:
        draft.postCodeModal = !draft.postCodeModal;
        break;

      case ME_UPDATE_MODAL_TOGGLE:
        draft.meUpdateModal = !draft.meUpdateModal;
        break;

      case USER_PROFILE_IMAGE_PATH:
        draft.userProfilePath = action.data;
        break;

      default:
        break;
    }
  });

export default reducer;
