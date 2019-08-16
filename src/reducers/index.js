import { combineReducers } from 'redux';
import portfolioReducers from './portfolio-reducers';
import stockSeriesReducers from './stock-series-reducers';
import positionsReducers from './positions-reducers';
import tradeReducers from './trade-reducers';
import tradeModalReducers from './trade-modal-reducers';

export default combineReducers({
  portfolioReducers,
  stockSeriesReducers,
  positionsReducers,
  tradeReducers,
  tradeModalReducers,
});