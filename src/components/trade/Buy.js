import React, { Component } from 'react';
import { Form, DatePicker, Tag, Button, Input, Icon, message, Result } from 'antd';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import moment from 'moment';
import Positions from '../../components/positions/Positions';
import validate from '../../utils/validate';
import {
  CLOSING_PRICE,
  OPENING_PRICE,
  HIGH_PRICE,
  LOW_PRICE,
} from '../../constants'
import {
  postTrade,
  getPositions,
  getStockSeries
} from '../../actions'

import TradeContext from '../../context/Trade.context';

class Buy extends Component {

  static contextType = TradeContext;

  state = {
    price: '',
    quantity: '',
    negativeBalance: false,
  };


  onTradeSubmit = (e, d) => {
    e.preventDefault();
    const {
      success: { data },
    } = this.context.stockSeries;
    const { quantity } = this.state;
    const price = this.state.price || (data && data[CLOSING_PRICE]);
    const { date } = this.props;
    if (!this.checkNegativeBalance()) {
      this.props.onTradeSubmit({
        quantity, price, date, type: 'BUY'
      })
    }
  }

  checkNegativeBalance() {
    const { success: { data } } = this.context.stockSeries;
    const price = this.state.price || (data && data[CLOSING_PRICE]);
    const negativeBalance = price * this.state.quantity > this.context.balance;
    this.setState({ negativeBalance });
    return negativeBalance;
  }

  handleFormChange = (e) => {
    this.setState({ [e.currentTarget.name]: e.currentTarget.value }, () => this.checkNegativeBalance());
  }

  onDateChange = (m, d) => {
    this.setState({ price: '', quantity: '' });
    this.props.onDateChange(m, d)
  } 

  renderForm(data) {
    const { negativeBalance } = this.state;
    const { loading } = this.props.postTradeReducers;
    return (
      <Form layout="inline" onSubmit={this.onTradeSubmit}>
        <Form.Item
          validateStatus={!data ? 'error' : ''}
          help={!data ? 'Choose a different date and which is lesser than last trade date' : ''}
        >
          <DatePicker
            value={this.context.date || null}
            onChange={this.onDateChange}
            // defaultValue={moment().subtract(1, 'days')}
            format={'YYYY-MM-DD'}
          />
        </Form.Item>
        {data ? (
          <React.Fragment>
            <Form.Item
              validateStatus={negativeBalance ? 'error' : ''}
              help={negativeBalance ? 'Please reduce price ' : ''}
            >
              <Input
                suffix={<Icon type="dollar" />}
                placeholder="Price"
                type="number"
                name="price"
                // max={parseFloat(data && data[CLOSING_PRICE], 10)}
                value={this.state.price || (data && data[CLOSING_PRICE])}
                onChange={this.handleFormChange}
              />
            </Form.Item>
            <Form.Item
              validateStatus={negativeBalance ? 'error' : ''}
              help={negativeBalance ? 'Reduce quantity to match your cash balance' : ''}
            >
              <Input
                suffix={<Icon type="pie-chart" />}
                placeholder="Quantity"
                name="quantity"
                type="number"
                value={this.state.quantity}
                onChange={this.handleFormChange}
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                disabled={loading}
                loading={loading}
              >
                Buy
              </Button>
            </Form.Item>
          </React.Fragment>

        ) : null
        }
        {this.props.renderSummaryOnDate()}
      </Form>
    );
  }

  renderBuyFragment() {
    const {
      loading,
      success: { ok, data },
      failure,
    } = this.context.stockSeries;
    if (loading) {
      return <Icon type="loading" />
    } else if (ok) {
      return this.renderForm(data);
    } else if (failure && failure.error) {
      return (
        <Result
          status="500"
          title="500"
          subTitle="Sorry, something went wrong."
          extra={(
            <Button
              type="primary"
              onClick={() => {
                const date = moment().subtract(1, 'days').format('YYYY-MM-DD');
                const { symbol } = this.props.match.params;
                this.props.getStockSeries({ symbol, date });
              }}
            >
              Try again
            </Button>
          )}
        />
      );
    }
    return null;
  }

  render() {
    const { symbol } = this.props.match.params;
    return (

      <TradeContext.Consumer>
      {
        context => (
          <React.Fragment>
            <div className="trade-wrapper">
              <h2>{symbol}</h2>
              {this.renderBuyFragment()}
            </div>
            <Positions
              positions={this.context.getPositionsReducers}
            />
          </React.Fragment>
        )
      }
      </TradeContext.Consumer>
    )
  }
}

const mapStateToProps = ({ tradeReducers, positionsReducers }) => {
  const { post: postTradeReducers } = tradeReducers;
  const { get: getPositionsReducers } = positionsReducers;
  return { postTradeReducers, getPositionsReducers };
};

export default withRouter(connect(mapStateToProps, {
  postTrade,
  getPositions,
  getStockSeries,
})(Buy));