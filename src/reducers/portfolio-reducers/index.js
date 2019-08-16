import {
  GET_PORTFOLIO_LOADING,
  GET_PORTFOLIO_SUCCESS,
  GET_PORTFOLIO_FAILURE,
} from "../../actions/types";


const INITIAL_STATE = {
  get: {
    loading: false,
    success: {
      ok: false,
      data: [],
    },
    failure: {
      error: false,
      messsage: '',
    },
  },
};


export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_PORTFOLIO_LOADING:
      return {
        ...state,
        get: {
          ...state.get,
          loading: true,
          success: {
            ...state.get.success,
            ok: false,
            data: [],
          },
          failure: {
            ...state.get.failure,
            error: false,
            message: '',
          },
        },
      };

    case GET_PORTFOLIO_SUCCESS:
      return {
        ...state,
        get: {
          ...state.get,
          loading: false,
          success: {
            ...state.get.success,
            ok: true,
            data: action.payload.data,
          },
          failure: {
            ...state.get.failure,
            error: false,
            message: '',
          },
        },
      };

    case GET_PORTFOLIO_FAILURE:
      return {
        ...state,
        get: {
          ...state.get,
          loading: false,
          success: {
            ...state.get.success,
            ok: false,
            data: [],
          },
          failure: {
            ...state.get.failure,
            error: true,
            message: action.payload.message,
          },
        },
      };

    default:
      return { ...state };
  }
}
