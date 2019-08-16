// import { handleError } from "../../utils/error-handling";
import api from '../../utils/api';
import {
  GET_STOCK_SERIES_LOADING,
  GET_STOCK_SERIES_SUCCESS,
  GET_STOCK_SERIES_FAILURE,
  GET_STOCK_SERIES_RESET,
} from "../types";
import { message } from 'antd';

import {
  SYMBOL_QUERY,
  API_KEY,
} from '../../constants';
import axios from 'axios';

export const getStockSeries = ({ symbol = '', date = '' }) => async (dispatch) => {
  dispatch({
    type: GET_STOCK_SERIES_LOADING,
    payload: null,
  });
  try {
    const { data, status, statusText } = await api.get(SYMBOL_QUERY, {
      params: {
        function: 'TIME_SERIES_DAILY',
        symbol,
        outputsize: 'full',
        apikey: API_KEY,
      }
    });
    // const { data } = await axios.get('https://jsonblob.com/api/jsonBlob/62407daf-bf60-11e9-8bb1-598fc1653235')
    const stock = (() => {
      const series = data['Time Series (Daily)'][date];
      if (series) {
        if (series) {
          return Object.keys(series).reduce((p, n) => {
            return {
              ...p,
              [n]: parseFloat(series[n], 10)
            }
          }, {});
        }
      }
      return null;
    })();
    dispatch({
      type: GET_STOCK_SERIES_SUCCESS,
      payload: {
        data: stock
      },
    });

  } catch (e) {
    message.error(e.message)
    dispatch({
      type: GET_STOCK_SERIES_FAILURE,
      payload: {
        message: e.message
      },
    });
  }
};