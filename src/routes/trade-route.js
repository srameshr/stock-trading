import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import { PageHeader, Tag, Icon } from 'antd';
import { Route } from "react-router-dom";
import Positions from '../components/positions/Positions';
import Trade from '../components/trade/Trade';
import {
	getPortfolio,
	getStockSeries,
	getPositions,
} from '../actions';
import {
	OPENING_PRICE,
	CLOSING_PRICE
} from '../constants';
import moment from 'moment';

class TradeRoute extends Component {

	state = {
		date: moment().subtract(2, 'days').format('YYYY-MM-DD')
	}

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

	renderOpenAndClosePosition = () => {
		const {
			loading,
			success: { ok, data }
		} = this.props.getStockSeriesReducers;

		if (loading) {
			return <Icon type="loading" />
		}
		if (data) {
			return [
				<Tag color={data[OPENING_PRICE] > data[CLOSING_PRICE] ? 'green' : 'red'} key="1">
					<Icon type="arrow-up"/> Open: {data[OPENING_PRICE]}
				</Tag>,
				<Tag color={data[CLOSING_PRICE] > data[OPENING_PRICE] ? 'green' : 'red'} key="2">
					<Icon type="arrow-down"/> Close: {data[CLOSING_PRICE]}
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
					extra={<h3>Cash balance:{parseFloat(window.localStorage.getItem('balance'), 10).toFixed(2)}</h3>}
				/>
				<Route
					path="/trade/:symbol"
					render={() => (
						<div className="trade-wrapper">
							<h2>{symbol}</h2>
							<Trade
								stockSeries={this.props.getStockSeriesReducers}
								onDateChange={(d) => this.getStockSeriesForDate(d)}
								date={moment(this.state.date)}
								balance={parseFloat(window.localStorage.getItem('balance'), 10)}
							/>
						</div>
					)}
				/>
				<Route
					path="/trade/:symbol"
					component={() => <Positions positions={this.props.getPositionsReducers} />}
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
	getPositions,
})(TradeRoute));
