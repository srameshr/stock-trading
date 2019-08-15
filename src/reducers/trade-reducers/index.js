import {
	POST_TRADE_LOADING,
	POST_TRADE_SUCCESS,
	POST_TRADE_FAILURE,
} from "../../actions/types";


const INITIAL_STATE = {
	post: {
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
		case POST_TRADE_LOADING:
			return {
				...state,
				post: {
					...state.post,
					loading: true,
					success: {
						...state.post.success,
						ok: false,
						data: null,
					},
					errors: {
						...state.post.failure,
						error: false,
						message: '',
					},
				},
			};

		case POST_TRADE_SUCCESS:
			return {
				...state,
				post: {
					...state.post,
					loading: false,
					success: {
						...state.post.success,
						ok: true,
						data: action.payload.data,
					},
					errors: {
						...state.post.failure,
						error: false,
						message: '',
					},
				},
			};

		case POST_TRADE_FAILURE:
			return {
				...state,
				post: {
					...state.post,
					loading: false,
					success: {
						...state.post.success,
						ok: false,
						data: null,
					},
					errors: {
						...state.post.failure,
						error: true,
						message: action.payload.message,
					},
				},
			};

		default:
			return { ...state };
	}
}
