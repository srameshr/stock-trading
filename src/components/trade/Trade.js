import React, { Component } from 'react';
import { Form, DatePicker, Tag, Button, Input, Icon, message } from 'antd';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import {
	CLOSING_PRICE
} from '../../constants'
import {
	postTrade
} from '../../actions'

class Trade extends Component {

	state = {
		price: '',
		quantity: '',
		negativeBalance: false,
	};

	onDateChange(m, d) {
		this.setState({ price: '', quantity: '' })
		this.props.onDateChange(d);
	}

	onTradeSubmit(e, d) {
		e.preventDefault();
		const { success: { data } } = this.props.stockSeries;
		const { quantity, negativeBalance } = this.state;
		const price = this.state.price || data && data[CLOSING_PRICE];
		const { date } = this.props;
		if (
				negativeBalance ||
				!(parseInt(quantity, 10)) ||
				!(parseFloat(price, 10)) ||
				!(parseFloat(price, 10) > 0) ||
				!(parseInt(quantity, 10) > 0)
			) {
			message.error('Please enter positive, decimal numbers.');
			return false;
		}
		this.props.postTrade({
			price: parseFloat(price, 10),
			symbol: this.props.match.params.symbol,
			position: parseFloat(quantity, 10),
			date: date.format()
		});

	}

	checkBalance() {
		const { success: { data } } = this.props.stockSeries;
		const price = this.state.price || data && data[CLOSING_PRICE];
		if (price * this.state.quantity > this.props.balance) {
			this.setState({ negativeBalance: true });
		} else {
			this.setState({ negativeBalance: false });
		}
	}

	handleFormChange = (e) => {
		this.setState({ [e.currentTarget.name]: e.currentTarget.value }, () => this.checkBalance());
	}

	renderForm(data) {
		const { negativeBalance } = this.state;
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
				{ data ? (
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
									suffix={<Icon type="pie-chart" />}
									type="primary" htmlType="submit"
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

	render() {
		const {
			loading,
			success: { ok, data },
			failure,
		} = this.props.stockSeries;
		if (loading) {
			return <Icon type="loading" />
		} else if (ok) {
			return this.renderForm(data);
		} else if (failure && failure.error) {
			return null;
		}
		return null;
	}
}

const mapStateToProps = ({ tradeReducers }) => {
	const { post: postTradeReducers } = tradeReducers;
	return { postTradeReducers };
};

export default withRouter(connect(mapStateToProps, {
	postTrade
})(Trade));