import React, { Component } from 'react';
import {compose} from "redux";
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import { message, Icon, Tag, Divider } from 'antd';
import TradeContext from '../context/Trade.context';
import validate from '../utils/validate';
import {
  postTrade,
} from '../actions'
import {
  CLOSING_PRICE,
  OPENING_PRICE,
  HIGH_PRICE,
  LOW_PRICE,
} from '../constants'

const withTradeDefaults = (TradeComponent) => {
  class WrappedComponent extends Component {
    static contextType = TradeContext;

    onDateChange = (momentDate, dateInFormatValue) => {
      if (!momentDate && !dateInFormatValue) {
        return false;
      }
      this.context.onDateChange(dateInFormatValue);
    }

    onTradeSubmit = ({ price, quantity, date, type, key = '' }) => {
      try {
        const { symbol } = this.props.match.params;
        validate.number({ num: price, name: 'Price', type: { POSITIVE: true, EXISTS: true } });
        validate.number({ num: quantity, name: 'Quantity', type: { POSITIVE: true, EXISTS: true } })
        this.props.postTrade({
          type,
          symbol,
          price: parseFloat(price, 10),
          position: parseInt(quantity, 10),
          date,
          key,
        });
      } catch (e) {
        message.error(e);
      }
    }

    renderSummaryOnDate = () => {
      const {
        success: { data }
      } = this.context.stockSeries;
      if (data) {
        const open = data[OPENING_PRICE];
        const close = data[CLOSING_PRICE];
        const high = data[HIGH_PRICE];
        const low = data[LOW_PRICE];
        const openHigh = open > close;
        const closeHigh = close > open;
        return (
          <div className="flex-center summay-on-date-wrapper">
            <Tag color={!openHigh ? 'red' : 'green'} key="1">
              <Icon type={!openHigh ? 'arrow-down' : 'arrow-up'} /> Open: {open}
            </Tag>
            <Tag color={!closeHigh ? 'red' : 'green'} key="2">
              <Icon type={!closeHigh ? 'arrow-down' : 'arrow-up'} /> Close: {close}
            </Tag>
            <Divider type="vertical" />
            <Tag color="green">
              <Icon type="arrow-up"/> High: {high}
            </Tag>
            <Tag color="green">
              <Icon type="arrow-down" /> Low: {low}
            </Tag>
          </div>
        )
      }
      return null;
    }
    
    render() {
      return (
        <TradeComponent
          {...this.props}
          onDateChange={this.onDateChange}
          onTradeSubmit={this.onTradeSubmit}
          renderSummaryOnDate={this.renderSummaryOnDate}
        />
      );
    }
  }
  return WrappedComponent;
}

const mapStateToProps = ({}) => {
  return {  };
};

const composedWithTradeDefaults = compose(
  withRouter,
  connect(mapStateToProps, { postTrade }),
  withTradeDefaults,
);


export default composedWithTradeDefaults;
