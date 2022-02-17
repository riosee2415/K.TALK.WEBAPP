import produce from "../util/produce";

export const initailState = {
  imageURL: "",
  imageDone: false,
};

export const EDITOR_UPLOAD_REQUEST = "EDITOR_UPLOAD_REQUEST";
export const EDITOR_UPLOAD_SUCCESS = "EDITOR_UPLOAD_SUCCESS";
export const EDITOR_UPLOAD_FAILURE = "EDITOR_UPLOAD_FAILURE";

const reducer = (state = initailState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case EDITOR_UPLOAD_REQUEST:
        draft.imageDone = false;
        break;
      case EDITOR_UPLOAD_SUCCESS:
        draft.imageDone = true;
        draft.imageURL = action.data.path;
        break;
      case EDITOR_UPLOAD_FAILURE:
        draft.imageURL = "";
        draft.imageDone = false;
        break;

      default:
        break;
    }
  });

export default reducer;
