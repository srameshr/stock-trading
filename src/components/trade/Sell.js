import React, { Component } from 'react';
import { Modal, Form, DatePicker, Tag, Button, Input, Icon, message } from 'antd';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import moment from 'moment';
import Positions from '../positions/Positions';
import validate from '../../utils/validate';
import {
  CLOSING_PRICE
} from '../../constants'
import {
  getPositions,
  postTrade,
} from '../../actions'

class Sell extends Component {

  state = {
    price: '',
    quantity: '',
    negativePositions: false,
    sellModalVisible: false,
    position: {},
    date: new Date(),
  };

  componentDidMount() {
    const { symbol } = this.props.match.params;
    this.props.getPositions({ symbol });
  }

  sellPosition(e, position) {
    e.preventDefault();
    this.setState({
      date: moment(position.date),
      position,
    }, () => {
      this.props.onDateChange(moment(position.date).format('YYYY-MM-DD'))
      this.setState({ price: '', sellModalVisible: true })
    })
  }

  handleCancel = () => {
    this.setState({ sellModalVisible: false, position: {} });
  };

  onDateChange = (m, d) => {
    // this.setState({ price: '', quantity: '' })
    this.props.onDateChange(d);
    this.setState({ date: moment(d) })
  }

  checkNegativePositions() {
    const negativePositions = this.state.quantity > this.state.position.position;
    this.setState({ negativePositions });
    return negativePositions;
  }

  handleFormChange = (e) => {
    this.setState({ [e.currentTarget.name]: e.currentTarget.value }, () => this.checkNegativePositions());
  }

  disabledDate = (current) => {
    return current < moment(this.state.position.date);
  }

  onTradeSubmit = (e) => {
    e.preventDefault();
    const {
      success: { data },
    } = this.props.stockSeries;
    const { symbol } = this.props.match.params;
    const { quantity, position: { key } } = this.state;
    const price = this.state.price || data && data[CLOSING_PRICE];
    try {
      validate.number({ num: price, name: 'Price', type: { POSITIVE: true, EXISTS: true } });
      validate.number({ num: quantity, name: 'Quantity', type: { POSITIVE: true, EXISTS: true } })
      if (!this.checkNegativePositions()) {
        this.props.postTrade({
          type: 'SELL',
          symbol,
          price: parseFloat(price, 10),
          key,
          position: parseInt(quantity, 10),
        });
      }
    } catch (e) {
      message.error(e);
    }
  }

  renderPriceAndQuantity({ loading, data }) {
    const { negativePositions } = this.state;
    if (loading) {
      return <Icon type="loading" />
    } else if (data) {
      const { loading: postTradeLoading } = this.props.postTradeReducers;
      return (
        <React.Fragment>
          <Form.Item
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
            validateStatus={negativePositions ? 'error' : ''}
            help={negativePositions ? 'Quantity exceeded.' : ''}
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
              suffix={<Icon type="pie-chart" />}
              type="primary"
              htmlType="submit"
              loading={postTradeLoading}
              disabled={postTradeLoading}
            >
              Sell
            </Button>
          </Form.Item>
        </React.Fragment>
      )
    }
    return null;
  }


  renderSellFragment() {
    const {
      loading,
      success: { ok, data },
      failure
    } = this.props.stockSeries;
    return (
      <Form onSubmit={this.onTradeSubmit}>
        <Form.Item
          validateStatus={!loading && !data ? 'error' : ''}
          help={!loading && !data ? 'Please choose a different date or wait for one more day until the trading is available' : ''}
        >
          <DatePicker
            value={this.state.date}
            onChange={this.onDateChange}
            // defaultValue={moment().subtract(1, 'days')}
            format={'YYYY-MM-DD'}
            disabledDate={this.disabledDate}
          />
        </Form.Item>
        {this.renderPriceAndQuantity({ loading, data })}
      </Form>
    );
  }

  render() {
    const { symbol } = this.props.match.params;
    return (
      <React.Fragment>
        <div className="trade-wrapper">
          <h2>{symbol}</h2>
          <h3>Sell the positions you wish to below.</h3>
        </div>
        <Positions
          positions={this.props.getPositionsReducers}
          action={{
            title: 'Action',
            dataIndex: 'action',
            value: 'action',
            render: (text, record) => <a onClick={(e) => this.sellPosition(e, record)}>Sell</a>
          }}
        />
        <Modal
          title={`Sell ${symbol} positions`}
          visible={this.state.sellModalVisible}
          // onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={[
            <Button key="back" onClick={this.handleCancel}>
              Close
            </Button>
          ]}
        >
          {this.renderSellFragment()}
        </Modal>
      </React.Fragment>
    )
  }
}

const mapStateToProps = ({ positionsReducers, tradeReducers }) => {
  const { get: getPositionsReducers } = positionsReducers;
  const { post: postTradeReducers } = tradeReducers;
  // const { get: getStockSeriesReducers } = stockSeriesReducers;
  return { getPositionsReducers, postTradeReducers };
};
export default withRouter(connect(mapStateToProps, {
  getPositions,
  postTrade,
})(Sell));