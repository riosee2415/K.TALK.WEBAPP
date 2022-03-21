import produce from "../util/produce";

export const initailState = {
  me: null,
  currentAdminMenu: [],
  users: null,

  createModal: false,
  updateModal: false,
  postCodeModal: false,

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

export const UPDATE_MODAL_OPEN_REQUEST = "UPDATE_MODAL_OPEN_REQUEST";
export const UPDATE_MODAL_CLOSE_REQUEST = "UPDATE_MODAL_CLOSE_REQUEST";

export const CREATE_MODAL_TOGGLE = "CREATE_MODAL_TOGGLE";

export const POSTCODE_MODAL_TOGGLE = "POSTCODE_MODAL_TOGGLE";

export const CURRENT_ADMINMENU_STATUS = "CURRENT_ADMINMENU_STATUS";

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

      default:
        break;
    }
  });

export default reducer;
