import {
  GET_PORTFOLIO_SUMMARY
} from "../../actions/types";


const INITIAL_STATE = {
  get: {
    loading: false,
    success: {
      ok: false,
      data: {}
    },
    failure: {
      error: false,
      messsage: '',
    },
  },
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_PORTFOLIO_SUMMARY:
      return {
        ...state,
        get: {
          ...state.get,
          loading: false,
          success: {
            ...state.get.success,
            ok: false,
            data: action.payload,
          },
          failure: {
            ...state.get.failure,
            error: false,
            message: '',
          },
        },
      };
    
    default:
      return { ...state };
  }
}