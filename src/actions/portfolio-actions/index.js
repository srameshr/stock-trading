// import { handleError } from "../../utils/error-handling";
import api from '../../utils/api';
import {
  GET_PORTFOLIO_LOADING,
  GET_PORTFOLIO_SUCCESS,
  GET_PORTFOLIO_FAILURE,
} from "../types";
import {
  SYMBOL_QUERY,
  API_KEY,
  GLOBAL_PRICE,
} from '../../constants';
import validate from '../../utils/validate'
import { message } from 'antd';

export const getPortfolio = () => async (dispatch) => {
  dispatch({
    type: GET_PORTFOLIO_LOADING,
    payload: null,
  });
  try {
    const portfolio = JSON.parse(window.localStorage.getItem('portfolio'));
    const values = await Promise.all(portfolio.map(async (p) => {
      const { data, status, statusText } = await api.get(SYMBOL_QUERY, {
        params: {
          function: 'GLOBAL_QUOTE',
          symbol: p.symbol,
          apikey: API_KEY,
        }
      });
      validate.api({ data, status, statusText });
      return {
        key: p.key,
        symbol: p.symbol,
        positions: p.positions.reduce((p, n) => p + n.position, 0),
        investment: p.positions.reduce((p, n) => p + n.position * n.price, 0),
        value: p.positions.reduce((p, n) => p + n.position * parseFloat(data['Global Quote'][GLOBAL_PRICE], 10), 0)
      }
    }));
    dispatch({
      type: GET_PORTFOLIO_SUCCESS,
      payload: {
        data: values
      },
    });
  } catch (e) {
    message.error(e.message)
    dispatch({
      type: GET_PORTFOLIO_FAILURE,
      payload: {
        message: e.message
      },
    });
  }
};