import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import { PageHeader, Tag, Icon, Divider } from 'antd';
import { Route } from "react-router-dom";
// import Positions from '../components/positions/Positions';
import Buy from '../components/trade/Buy';
import Sell from '../components/trade/Sell';
import formatters from '../utils/formatters';
import {
  getStock,
} from '../actions';
import {
  GET_STOCK,
} from '../constants';
import moment from 'moment';
import Trade from '../components/trade/Trade';

class TradeRoute extends Component {

  state = {
    date: moment().subtract(1, 'days').format('YYYY-MM-DD')
  }

  componentDidMount() {
    const { symbol } = this.props.match.params;
    this.props.getStock({ symbol })
  }

  renderTodaysStockSummary = () => {
    const {
      loading,
      success: { ok, data }
    } = this.props.getStockReducers;
    const {
      GET_CLOSE,
      GET_OPEN,
      GET_HIGH,
      GET_LOW,
      GET_LATEST_TRADING_DAY,
      GET_PRICE,
    } = GET_STOCK;

    if (loading) {
      return <Icon type="loading" />
    }
    if (data && ok) {
      const openHigh = data[GET_OPEN] > data[GET_CLOSE];
      const closeHigh = data[GET_CLOSE] > data[GET_OPEN];

      return [
        <Tag color={!openHigh ? 'red' : 'green'} key="1">
          <Icon type={!openHigh ? 'arrow-down' : 'arrow-up'} /> Open: {data[GET_OPEN]}
        </Tag>,
        <Tag color={!closeHigh ? 'red' : 'green'} key="2">
          <Icon type={!closeHigh ? 'arrow-down' : 'arrow-up'} /> Close: {data[GET_CLOSE]}
        </Tag>,
        <Divider type="vertical" key="a"/>,
        <Tag color="green" key="3">
          <Icon type="arrow-up" /> Highest: {data[GET_HIGH]}
        </Tag>,
        <Tag color="red" key="4">
          <Icon type="arrow-down"/> Lowest: {data[GET_LOW]}
        </Tag>,
        <Divider type="vertical"  key="b"/>,
        <Tag color="cyan" key="5">
          <Icon type="dollar"/> Price: {data[GET_PRICE]}
        </Tag>,
        <Divider type="vertical" key="c"/>,
        <Tag color="blue" key="6">
          <Icon type="calendar" /> Last trade: {data[GET_LATEST_TRADING_DAY]}
        </Tag>,
      ];
    }
    return null;
  }

  render() {
    const { symbol } = this.props.match.params;
    return (
      <React.Fragment>
        <PageHeader
          title={symbol}
          subTitle="Today"
          tags={this.renderTodaysStockSummary()}
          extra={<h3>Cash balance:{formatters.currency(window.localStorage.getItem('balance'))}</h3>}
        />
        <Trade>
          <Route
            path="/trade/:symbol/buy"
            component={() => <Buy/>}
          />
          <Route
            path="/trade/:symbol/sell"
            render={() =>  <Sell/>}
          /> 
        </Trade>
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({ stockReducers }) => {
  const { get: getStockReducers } = stockReducers;
  return { getStockReducers };
};

export default withRouter(connect(mapStateToProps, {
  getStock,
})(TradeRoute));
