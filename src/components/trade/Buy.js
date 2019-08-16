import React, { Component } from 'react';
import { Form, DatePicker, Tag, Button, Input, Icon, message, Result } from 'antd';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import moment from 'moment';
import Positions from '../../components/positions/Positions';
import validate from '../../utils/validate';
import {
  CLOSING_PRICE
} from '../../constants'
import {
  postTrade,
  getPositions,
  getStockSeries
} from '../../actions'

class Buy extends Component {

  state = {
    price: '',
    quantity: '',
    negativeBalance: false,
  };

  componentDidMount() {
    const { symbol } = this.props.match.params;
    this.props.getPositions({ symbol });
  }

  onDateChange(m, d) {
    this.setState({ price: '', quantity: '' })
    this.props.onDateChange(d);
  }

  onTradeSubmit(e, d) {
    e.preventDefault();
    const { success: { data } } = this.props.stockSeries;
    const { quantity } = this.state;
    const price = this.state.price || data && data[CLOSING_PRICE];
    const { date } = this.props;
    const { symbol } = this.props.match.params;

    try {
      validate.number({ num: price, name: 'Price', type: { POSITIVE: true, EXISTS: true } });
      validate.number({ num: quantity, name: 'Quantity', type: { POSITIVE: true, EXISTS: true } })
      if (!this.checkNegativeBalance()) {
        this.props.postTrade({
          type: 'BUY',
          symbol,
          price: parseFloat(price, 10),
          position: parseInt(quantity, 10),
        });
      }
    } catch (e) {
      message.error(e);
    }
  }

  checkNegativeBalance() {
    const { success: { data } } = this.props.stockSeries;
    const price = this.state.price || data && data[CLOSING_PRICE];
    const negativeBalance = price * this.state.quantity > this.props.balance;
    this.setState({ negativeBalance });
    return negativeBalance;
  }

  handleFormChange = (e) => {
    this.setState({ [e.currentTarget.name]: e.currentTarget.value }, () => this.checkNegativeBalance());
  }

  renderForm(data) {
    const { negativeBalance } = this.state;
    const { loading } = this.props.postTradeReducers;
    return (
      <Form layout="inline" onSubmit={this.onTradeSubmit.bind(this)}>
        <Form.Item
          validateStatus={!data ? 'error' : ''}
          help={!data ? 'Please choose a different date' : ''}
        >
          <DatePicker
            value={this.props.date}
            onChange={this.onDateChange.bind(this)}
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
                value={this.state.price || data && data[CLOSING_PRICE]}
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
      </Form>
    );
  }

  renderBuyFragment() {
    const {
      loading,
      success: { ok, data },
      failure,
    } = this.props.stockSeries;
    console.log(this.props.stockSeries)
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
      <React.Fragment>
        <div className="trade-wrapper">
          <h2>{symbol}</h2>
          {this.renderBuyFragment()}
        </div>
        <Positions
          positions={this.props.getPositionsReducers}
        />
      </React.Fragment>
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