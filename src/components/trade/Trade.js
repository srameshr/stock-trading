import React from "react";
import TradeContext from "../../context/Trade.context";
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import moment from 'moment';

import {
  getPortfolio,
  getStockSeries,
  getPositions,
} from '../../actions';

class Trade extends React.Component {
  state = {
    date: moment().subtract(1, 'days').format('YYYY-MM-DD')
  };

  componentDidMount() {
    const { symbol } = this.props.match.params;
    this.props.getPositions({ symbol });
    this.getStockSeriesForDate();
  }


  getStockSeriesForDate(date = this.state.date) {
    this.setState({ date }, () => {
      const { symbol } = this.props.match.params;
      this.props.getStockSeries({ symbol, date });
    })
  }

  render() {
    return (
      <TradeContext.Provider
        value={{
          date: moment(this.state.date),
          onDateChange: this.getStockSeriesForDate.bind(this),
          positions: this.props.getPositionsReducers,
          balance: parseFloat(window.localStorage.getItem('balance'), 10),
          stockSeries: this.props.getStockSeriesReducers,
          ...this.props
        }}
      >
        {this.props.children}
      </TradeContext.Provider>
    );
  }
}

const mapStateToProps = ({ stockSeriesReducers, positionsReducers }) => {
  const { get: getStockSeriesReducers } = stockSeriesReducers;
  const { get: getPositionsReducers } = positionsReducers;
  return { getStockSeriesReducers, getPositionsReducers };
};

export default withRouter(connect(mapStateToProps, {
  getPositions,
  getPortfolio,
  getStockSeries,
})(Trade));