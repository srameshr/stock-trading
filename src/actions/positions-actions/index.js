import {
  GET_POSITIONS_LOADING,
  GET_POSITIONS_SUCCESS,
  GET_POSITIONS_FAILURE,
} from "../types";
import { message } from 'antd';

export const getPositions = ({ symbol = '' }) => async (dispatch) => {
  dispatch({
    type: GET_POSITIONS_LOADING,
    payload: null,
  });
  try {
    const portfolio = JSON.parse(window.localStorage.getItem('portfolio'));
    const ticker = portfolio.find((p => p.symbol === symbol));
    dispatch({
      type: GET_POSITIONS_SUCCESS,
      payload: {
        data: ticker ? ticker.positions : []
      },
    });
  } catch (e) {
    message.error(e.message)
    dispatch({
      type: GET_POSITIONS_FAILURE,
      payload: {
        message: e.message
      },
    });
  }
};