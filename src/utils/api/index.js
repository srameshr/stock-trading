import axios from 'axios';
import {
  API,
  API_KEY
} from '../../constants';
import { cacheAdapterEnhancer } from 'axios-extensions';

const api = axios.create({
	// cache will be enabled by default
	adapter: cacheAdapterEnhancer(axios.defaults.adapter),
  baseURL: API,
  params: {
    apikey: API_KEY,
  },
  transformResponse: [function (data) {
    // Do whatever you want to transform the data
    const response = data instanceof Object ? data : JSON.parse(data);
    const { Note } = response;
    if (Note) {
      throw new Error("API Limit reached. Please try  in a while.")
    }
    return response;
  }],
});

export default api;