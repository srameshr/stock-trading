import { combineReducers } from 'redux';
import portfolioReducers from './portfolio-reducers';
import stockSeriesReducers from './stock-series-reducers';
import positionsReducers from './positions-reducers';
import tradeReducers from './trade-reducers';

export default combineReducers({
    portfolioReducers,
    stockSeriesReducers,
    positionsReducers,
    tradeReducers,
});