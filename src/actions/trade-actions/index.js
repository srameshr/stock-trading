import {
	POST_TRADE_LOADING,
	POST_TRADE_SUCCESS,
	POST_TRADE_FAILURE,
} from "../types";
import {
  getPositions
} from '../../actions';
import { message } from 'antd';
import uniqid from 'uniqid';;

export const postTrade = ({ symbol, position, price, date, currency = 'USD' }) => async (dispatch) => {
  dispatch({
    type: POST_TRADE_LOADING,
    payload: null,
  });

  try {
    const portfolio = JSON.parse(window.localStorage.getItem('portfolio'));
    const balance = Number(window.localStorage.getItem('balance'));
    const index = portfolio.findIndex(p => p.symbol === symbol);
    portfolio[index].positions.push({ key: uniqid(), position, price, date, currency });
    window.localStorage.setItem('portfolio', JSON.stringify(portfolio));
    window.localStorage.setItem('balance', balance - price)
    dispatch({
      type: POST_TRADE_SUCCESS,
      payload: {
          data: portfolio,
      },
    });
    message.success(`Bought ${position} positions of ${symbol} stock successfully`);
    // getPositions({ symbol })(dispatch);
    dispatch(getPositions({ symbol }))
    
  } catch (e) {
    message.error(e);
    dispatch({
      type: POST_TRADE_FAILURE,
      payload: {
        message: e.message
      },
    });
  }
};