import api from '../../utils/api';
import {
  POST_TRADE_LOADING,
  POST_TRADE_SUCCESS,
  POST_TRADE_FAILURE,
  GET_STOCK_FAILURE,
  GET_STOCK_SUCCESS,
  GET_STOCK_LOADING,

} from "../types";
import {
  getPositions,
  tradeModalHide,
} from '../../actions';
import {
  SYMBOL_QUERY,
  API_KEY,
  GLOBAL_QUOTE,
} from '../../constants';
import { message } from 'antd';
import uniqid from 'uniqid';

export const getStock = ({ symbol }) => async (dispatch) => {

  dispatch({
    type: GET_STOCK_LOADING,
    payload: null,
  });

  try {
    const { data, status, statusText } = await api.get(SYMBOL_QUERY, {
      params: {
        function: 'GLOBAL_QUOTE',
        symbol: symbol,
        apikey: API_KEY,
      }
    });
    dispatch({
      type: GET_STOCK_SUCCESS,
      payload: {
        data: data ? data[GLOBAL_QUOTE] : null,
      },
    });
  } catch (e) {
    message.error(e.message);
    dispatch({
      type: GET_STOCK_FAILURE,
      payload: {
        message: e.message
      },
    });
  }
};

export const postTrade = ({ type = '', symbol, key = '', position, price, date, currency = 'USD' }) => async (dispatch) => {
  dispatch({
    type: POST_TRADE_LOADING,
    payload: null,
  });

  if (type === 'SELL') {
    setTimeout(() => dispatch(sellPositions({ symbol, position, key, price, date, currency })), 1000);
    
  } else if (type === 'BUY') {
    setTimeout(() => dispatch(buyPositions({ symbol, position, price, key, date, currency })), 1000);
  } else {
    const error = 'Invalid trade type';
    message.error(error);
    dispatch({
      type: POST_TRADE_FAILURE,
      payload: {
        message: error
      },
    });
  }
};

const buyPositions = ({ symbol, position, price, date, currency = 'USD' }) => async (dispatch) => {
  try {
    const portfolio = JSON.parse(window.localStorage.getItem('portfolio'));
    const balance = Number(window.localStorage.getItem('balance'));
    const index = portfolio.findIndex(p => p.symbol === symbol);
    portfolio[index].positions.push({ key: uniqid(), position, price, date, currency });
    window.localStorage.setItem('portfolio', JSON.stringify(portfolio));
    window.localStorage.setItem('balance', balance - price * position)
    dispatch({
      type: POST_TRADE_SUCCESS,
      payload: {
        data: portfolio,
      },
    });
    message.success(`Bought ${position} positions of ${symbol} stock successfully`);
    // getPositions({ symbol })(dispatch);
    dispatch(getPositions({ symbol }))
    return true;

  } catch (e) {
    message.error(e.message);
    dispatch({
      type: POST_TRADE_FAILURE,
      payload: {
        message: e.message
      },
    });
  }
}

const sellPositions = ({ symbol, position, price, key, currency = 'USD' }) => async (dispatch) => {

  try {
    const portfolio = JSON.parse(window.localStorage.getItem('portfolio'));
    const balance = Number(window.localStorage.getItem('balance'));
    const index = portfolio.findIndex(p => p.symbol === symbol);
    portfolio[index].positions.map(p => {
      if (p.key === key) {
        p.position = p.position - position;
        // if (price < p.price) {
        //   price += p.price - price;
        // } else if (price > p.price) {
        //   price -= price - p.price;
        // }
      }
    });
    window.localStorage.setItem('portfolio', JSON.stringify(portfolio));
    window.localStorage.setItem('balance', balance + price * position)
    dispatch({
      type: POST_TRADE_SUCCESS,
      payload: {
        data: portfolio,
      },
    });
    message.success(`Sold ${position} positions of ${symbol} stock successfully`);
    // getPositions({ symbol })(dispatch);
    dispatch(getPositions({ symbol }))
    dispatch(tradeModalHide());

  } catch (e) {
    message.error(e.message);
    dispatch({
      type: POST_TRADE_FAILURE,
      payload: {
        message: e.message
      },
    });
  }
};