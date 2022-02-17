import produce from "../util/produce";

export const initailState = {
  seo_keywords: "",
  seo_keyword: [],
  seo_desc: [],
  seo_ogImage: [],
  seo_title: [],
  previewThumbnail: "",
  //////
  titleUpdateModal: false,
  keywordUpdateModal: false,
  keywordCreateModal: false,
  //////
  st_seoListLoading: false,
  st_seoListDone: false,
  st_seoListError: null,
  //////
  st_seoTitleUpdateLoading: false,
  st_seoTitleUpdateDone: false,
  st_seoTitleUpdateError: null,
  //////
  st_seoThumbnailUpdateLoading: false,
  st_seoThumbnailUpdateDone: false,
  st_seoThumbnailUpdateError: null,
  //////
  st_seoThumbnailUpdate2Loading: false,
  st_seoThumbnailUpdate2Done: false,
  st_seoThumbnailUpdate2Error: null,
  //////
  st_seoKeywordUpdateLoading: false,
  st_seoKeywordUpdateDone: false,
  st_seoKeywordUpdateError: null,
  //////
  st_seoKeywordDeleteLoading: false,
  st_seoKeywordDeleteDone: false,
  st_seoKeywordDeleteError: null,
  //////
  st_seoKeywordCreateLoading: false,
  st_seoKeywordCreateDone: false,
  st_seoKeywordCreateError: null,
  //////
  st_seoDescUpdateLoading: false,
  st_seoDescUpdateDone: false,
  st_seoDescUpdateError: null,
};

export const SEO_LIST_REQUEST = "SEO_LIST_REQUEST";
export const SEO_LIST_SUCCESS = "SEO_LIST_SUCCESS";
export const SEO_LIST_FAILURE = "SEO_LIST_FAILURE";

export const SEO_LIST_TITLE_REQUEST = "SEO_LIST_TITLE_REQUEST";
export const SEO_LIST_TITLE_SUCCESS = "SEO_LIST_TITLE_SUCCESS";
export const SEO_LIST_TITLE_FAILURE = "SEO_LIST_TITLE_FAILURE";

export const SEO_TITLE_UPDATE_REQUEST = "SEO_TITLE_UPDATE_REQUEST";
export const SEO_TITLE_UPDATE_SUCCESS = "SEO_TITLE_UPDATE_SUCCESS";
export const SEO_TITLE_UPDATE_FAILURE = "SEO_TITLE_UPDATE_FAILURE";

export const SEO_THUMBNAIL_UPDATE_REQUEST = "SEO_THUMBNAIL_UPDATE_REQUEST";
export const SEO_THUMBNAIL_UPDATE_SUCCESS = "SEO_THUMBNAIL_UPDATE_SUCCESS";
export const SEO_THUMBNAIL_UPDATE_FAILURE = "SEO_THUMBNAIL_UPDATE_FAILURE";

export const SEO_THUMBNAIL_UPDATE2_REQUEST = "SEO_THUMBNAIL_UPDATE2_REQUEST";
export const SEO_THUMBNAIL_UPDATE2_SUCCESS = "SEO_THUMBNAIL_UPDATE2_SUCCESS";
export const SEO_THUMBNAIL_UPDATE2_FAILURE = "SEO_THUMBNAIL_UPDATE2_FAILURE";

export const SEO_KEYWORD_UPDATE_REQUEST = "SEO_KEYWORD_UPDATE_REQUEST";
export const SEO_KEYWORD_UPDATE_SUCCESS = "SEO_KEYWORD_UPDATE_SUCCESS";
export const SEO_KEYWORD_UPDATE_FAILURE = "SEO_KEYWORD_UPDATE_FAILURE";

export const SEO_KEYWORD_DELETE_REQUEST = "SEO_KEYWORD_DELETE_REQUEST";
export const SEO_KEYWORD_DELETE_SUCCESS = "SEO_KEYWORD_DELETE_SUCCESS";
export const SEO_KEYWORD_DELETE_FAILURE = "SEO_KEYWORD_DELETE_FAILURE";

export const SEO_KEYWORD_CREATE_REQUEST = "SEO_KEYWORD_CREATE_REQUEST";
export const SEO_KEYWORD_CREATE_SUCCESS = "SEO_KEYWORD_CREATE_SUCCESS";
export const SEO_KEYWORD_CREATE_FAILURE = "SEO_KEYWORD_CREATE_FAILURE";

export const SEO_DESC_UPDATE_REQUEST = "SEO_DESC_UPDATE_REQUEST";
export const SEO_DESC_UPDATE_SUCCESS = "SEO_DESC_UPDATE_SUCCESS";
export const SEO_DESC_UPDATE_FAILURE = "SEO_DESC_UPDATE_FAILURE";

export const SEO_TITLE_UPDATE_TOGGLE = "SEO_TITLE_UPDATE_TOGGLE";
export const SEO_KEYWORD_UPDATE_TOGGLE = "SEO_KEYWORD_UPDATE_TOGGLE";
export const SEO_KEYWORD_CREATE_TOGGLE = "SEO_KEYWORD_CREATE_TOGGLE";

const reducer = (state = initailState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SEO_LIST_REQUEST:
        draft.st_seoListLoading = true;
        draft.st_seoListDone = false;
        draft.st_seoListError = null;
        break;

      case SEO_LIST_SUCCESS:
        draft.st_seoListLoading = false;
        draft.st_seoListDone = true;
        draft.st_seoListError = null;

        const preData = action.data.seos.filter((v) => v.type === "키워드");

        let _preData = "";
        preData.map((data, idx) => {
          if (idx !== preData.length - 1) {
            _preData += `${data.content}, `;
          } else {
            _preData += `${data.content}`;
          }
        });

        draft.seo_keywords = _preData;

        draft.seo_desc = action.data.seos.filter(
          (v) => v.type === "홈페이지설명"
        );
        draft.seo_ogImage = action.data.seos.filter((v) => v.type === "이미지");
        draft.seo_keyword = action.data.seos.filter((v) => v.type === "키워드");

        if (draft.seo_ogImage.length === 0) {
          draft.previewThumbnail = "https://via.placeholder.com/800x400";
        } else {
          draft.previewThumbnail = draft.seo_ogImage[0].content;
        }

        draft.seo_title = action.data.seos.filter((v) => v.type === "타이틀");
        break;

      case SEO_LIST_FAILURE:
        draft.st_seoListLoading = false;
        draft.st_seoListDone = false;
        draft.st_seoListError = action.data;
        break;
      /////////////////////////////////////////////

      case SEO_TITLE_UPDATE_REQUEST:
        draft.st_seoTitleUpdateLoading = true;
        draft.st_seoTitleUpdateDone = false;
        draft.st_seoTitleUpdateError = null;
        break;

      case SEO_TITLE_UPDATE_SUCCESS:
        draft.st_seoTitleUpdateLoading = false;
        draft.st_seoTitleUpdateDone = true;
        draft.st_seoTitleUpdateError = null;
        break;

      case SEO_TITLE_UPDATE_FAILURE:
        draft.st_seoTitleUpdateLoading = false;
        draft.st_seoTitleUpdateDone = false;
        draft.st_seoTitleUpdateError = true;
        break;
      /////////////////////////////////////////////

      case SEO_THUMBNAIL_UPDATE_REQUEST:
        draft.st_seoThumbnailUpdateLoading = true;
        draft.st_seoThumbnailUpdateDone = false;
        draft.st_seoThumbnailUpdateError = null;
        break;

      case SEO_THUMBNAIL_UPDATE_SUCCESS:
        draft.st_seoThumbnailUpdateLoading = false;
        draft.st_seoThumbnailUpdateDone = true;
        draft.st_seoThumbnailUpdateError = null;
        draft.previewThumbnail = action.data.path;
        break;

      case SEO_THUMBNAIL_UPDATE_FAILURE:
        draft.st_seoThumbnailUpdateLoading = false;
        draft.st_seoThumbnailUpdateDone = false;
        draft.st_seoThumbnailUpdateError = true;
        break;
      /////////////////////////////////////////////

      case SEO_THUMBNAIL_UPDATE2_REQUEST:
        draft.st_seoThumbnailUpdate2Loading = true;
        draft.st_seoThumbnailUpdate2Done = false;
        draft.st_seoThumbnailUpdate2Error = null;
        break;

      case SEO_THUMBNAIL_UPDATE2_SUCCESS:
        draft.st_seoThumbnailUpdate2Loading = false;
        draft.st_seoThumbnailUpdate2Done = true;
        draft.st_seoThumbnailUpdate2Error = null;

        draft.st_seoThumbnailUpdateLoading = false;
        draft.st_seoThumbnailUpdateDone = false;
        draft.st_seoThumbnailUpdateError = null;
        break;

      case SEO_THUMBNAIL_UPDATE2_FAILURE:
        draft.st_seoThumbnailUpdate2Loading = false;
        draft.st_seoThumbnailUpdate2Done = false;
        draft.st_seoThumbnailUpdate2Error = true;
        break;
      /////////////////////////////////////////////

      case SEO_KEYWORD_UPDATE_REQUEST:
        draft.st_seoKeywordUpdateLoading = true;
        draft.st_seoKeywordUpdateDone = false;
        draft.st_seoKeywordUpdateError = null;
        break;

      case SEO_KEYWORD_UPDATE_SUCCESS:
        draft.st_seoKeywordUpdateLoading = false;
        draft.st_seoKeywordUpdateDone = true;
        draft.st_seoKeywordUpdateError = null;
        break;

      case SEO_KEYWORD_UPDATE_FAILURE:
        draft.st_seoKeywordUpdateLoading = false;
        draft.st_seoKeywordUpdateDone = false;
        draft.st_seoKeywordUpdateError = true;
        break;
      /////////////////////////////////////////////

      case SEO_KEYWORD_DELETE_REQUEST:
        draft.st_seoKeywordDeleteLoading = true;
        draft.st_seoKeywordDeleteDone = false;
        draft.st_seoKeywordDeleteError = null;
        break;

      case SEO_KEYWORD_DELETE_SUCCESS:
        draft.st_seoKeywordDeleteLoading = false;
        draft.st_seoKeywordDeleteDone = true;
        draft.st_seoKeywordDeleteError = null;
        break;

      case SEO_KEYWORD_DELETE_FAILURE:
        draft.st_seoKeywordDeleteLoading = false;
        draft.st_seoKeywordDeleteDone = false;
        draft.st_seoKeywordDeleteError = true;
        break;
      /////////////////////////////////////////////

      case SEO_KEYWORD_CREATE_REQUEST:
        draft.st_seoKeywordCreateLoading = true;
        draft.st_seoKeywordCreateDone = false;
        draft.st_seoKeywordCreateError = null;
        break;

      case SEO_KEYWORD_CREATE_SUCCESS:
        draft.st_seoKeywordCreateLoading = false;
        draft.st_seoKeywordCreateDone = true;
        draft.st_seoKeywordCreateError = null;
        break;

      case SEO_KEYWORD_CREATE_FAILURE:
        draft.st_seoKeywordCreateLoading = false;
        draft.st_seoKeywordCreateDone = false;
        draft.st_seoKeywordCreateError = true;
        break;
      /////////////////////////////////////////////

      case SEO_DESC_UPDATE_REQUEST:
        draft.st_seoDescUpdateLoading = true;
        draft.st_seoDescUpdateDone = false;
        draft.st_seoDescUpdateError = null;
        break;

      case SEO_DESC_UPDATE_SUCCESS:
        draft.st_seoDescUpdateLoading = false;
        draft.st_seoDescUpdateDone = true;
        draft.st_seoDescUpdateError = null;
        break;

      case SEO_DESC_UPDATE_FAILURE:
        draft.st_seoDescUpdateLoading = false;
        draft.st_seoDescUpdateDone = false;
        draft.st_seoDescUpdateError = true;
        break;
      /////////////////////////////////////////////

      case SEO_TITLE_UPDATE_TOGGLE:
        draft.titleUpdateModal = !draft.titleUpdateModal;
        break;
      /////////////////////////////////////////////

      case SEO_KEYWORD_UPDATE_TOGGLE:
        draft.keywordUpdateModal = !draft.keywordUpdateModal;
        break;
      /////////////////////////////////////////////

      case SEO_KEYWORD_CREATE_TOGGLE:
        draft.keywordCreateModal = !draft.keywordCreateModal;
        break;
      /////////////////////////////////////////////

      default:
        break;
    }
  });

export default reducer;
