import {
  TRADE_MODAL_HIDE,
  TRADE_MODAL_SHOW,
} from "../../actions/types";

const INITIAL_STATE = {
  visible: false,
};


export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case TRADE_MODAL_SHOW:
      return {
        ...state,
        visible: action.payload,
      };

    case TRADE_MODAL_HIDE:
      return {
        ...state,
        visible: action.payload,
      };

    default:
      return { ...state };
  }
}
