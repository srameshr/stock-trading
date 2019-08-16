import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import { PageHeader, Tag, Icon } from 'antd';
import { Route } from "react-router-dom";
// import Positions from '../components/positions/Positions';
import Buy from '../components/trade/Buy';
import Sell from '../components/trade/Sell';
import formatters from '../utils/formatters';
import {
  getPortfolio,
  getStockSeries,
  // getPositions,
} from '../actions';
import {
  OPENING_PRICE,
  CLOSING_PRICE
} from '../constants';
import moment from 'moment';

class TradeRoute extends Component {

  state = {
    date: moment().subtract(1, 'days').format('YYYY-MM-DD')
  }

  componentDidMount() {
    // const { symbol } = this.props.match.params;
    // this.props.getPositions({ symbol });
    this.getStockSeriesForDate();
  }

  getStockSeriesForDate(date = this.state.date) {
    this.setState({ date }, () => {
      const { symbol } = this.props.match.params;
      this.props.getStockSeries({ symbol, date });
    })
  }

  renderOpenAndClosePosition = () => {
    const {
      loading,
      success: { ok, data }
    } = this.props.getStockSeriesReducers;

    if (loading) {
      return <Icon type="loading" />
    }
    if (data && ok) {
      const openHigh = data[OPENING_PRICE] > data[CLOSING_PRICE];
      const closeHigh = data[CLOSING_PRICE] > data[OPENING_PRICE];

      return [
        <Tag color={!openHigh ? 'red' : 'green'} key="1">
          <Icon type={!openHigh ? 'arrow-down' : 'arrow-up'} /> Open: {data[OPENING_PRICE]}
        </Tag>,
        <Tag color={!closeHigh ? 'red' : 'green'} key="2">
          <Icon type={!closeHigh ? 'arrow-down' : 'arrow-up'} /> Close: {data[CLOSING_PRICE]}
        </Tag>,
      ]
    }
    return null;
  }

  render() {
    const { symbol } = this.props.match.params;
    return (
      <React.Fragment>
        <PageHeader
          title={symbol}
          subTitle="Trade"
          tags={this.renderOpenAndClosePosition()}

          extra={<h3>Cash balance:{formatters.currency(window.localStorage.getItem('balance'))}</h3>}
        />
        <Route
          path="/trade/:symbol/buy"
          render={() => (
            <Buy
              stockSeries={this.props.getStockSeriesReducers}
              onDateChange={(d) => this.getStockSeriesForDate(d)}
              date={moment(this.state.date)}
              balance={parseFloat(window.localStorage.getItem('balance'), 10)}
            />
          )}
        />

        <Route
          path="/trade/:symbol/sell"
          render={() => (
            <Sell
              stockSeries={this.props.getStockSeriesReducers}
              onDateChange={(d) => this.getStockSeriesForDate(d)}
              date={moment(this.state.date)}
              balance={parseFloat(window.localStorage.getItem('balance'), 10)}
            />
          )}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({ stockSeriesReducers, positionsReducers }) => {
  const { get: getStockSeriesReducers } = stockSeriesReducers;
  const { get: getPositionsReducers } = positionsReducers;
  return { getStockSeriesReducers, getPositionsReducers };
};

export default withRouter(connect(mapStateToProps, {
  getStockSeries,
  // getPositions,
})(TradeRoute));
