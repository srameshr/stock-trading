import {
  GET_POSITIONS_LOADING,
	GET_POSITIONS_SUCCESS,
	GET_POSITIONS_FAILURE,
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
    case GET_POSITIONS_LOADING:
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
					errors: {
						...state.get.failure,
						error: false,
						message: '',
					},
				},
		};

	case GET_POSITIONS_SUCCESS:
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
					errors: {
						...state.get.failure,
						error: false,
						message: '',
					},
				},
		};

	case GET_POSITIONS_FAILURE:
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
					errors: {
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
