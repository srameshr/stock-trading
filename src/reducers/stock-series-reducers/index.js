import {
  GET_STOCK_SERIES_LOADING,
  GET_STOCK_SERIES_SUCCESS,
  GET_STOCK_SERIES_FAILURE,
} from "../../actions/types";


const INITIAL_STATE = {
  get: {
    loading: false,
    success: {
      ok: false,
      data: null,
    },
    failure: {
      error: false,
      messsage: '',
    },
  },
};


export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_STOCK_SERIES_LOADING:
      return {
        ...state,
        get: {
          ...state.get,
          loading: true,
          success: {
            ...state.get.success,
            ok: false,
            data: null,
          },
          failure: {
            ...state.get.failure,
            error: false,
            message: '',
          },
        },
      };

    case GET_STOCK_SERIES_SUCCESS:
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

    case GET_STOCK_SERIES_FAILURE:
      return {
        ...state,
        get: {
          ...state.get,
          loading: false,
          success: {
            ...state.get.success,
            ok: false,
            data: null,
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
