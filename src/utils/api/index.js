import axios from 'axios';
import {
  API,
  API_KEY
} from '../../constants';
import { messaage } from 'antd';

const api = axios.create({
  baseURL: API,
  params: {
    apikey: API_KEY,
  },
  transformResponse: [function (data) {
    // Do whatever you want to transform the data
    const { Note } = JSON.parse(data);
    if (Note) {
      throw new Error("API Limit reached. Please try  in a while.")
    }
    return JSON.parse(data);
  }],
});

export default api;