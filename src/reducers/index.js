import { combineReducers } from 'redux';
import portfolioReducers from './portfolio-reducers';
import stockSeriesReducers from './stock-series-reducers';
import positionsReducers from './positions-reducers';
import tradeReducers from './trade-reducers';
import tradeModalReducers from './trade-modal-reducers';
import stockReducers from './stock-reducers';
import portfolioSummayReducers from './portfolio-summary-reducers'

export default combineReducers({
  portfolioReducers,
  stockSeriesReducers,
  positionsReducers,
  tradeReducers,
  tradeModalReducers,
  stockReducers,
  portfolioSummayReducers,
});