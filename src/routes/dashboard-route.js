import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import { PageHeader } from 'antd';
import {
    getPortfolio
} from '../actions';
import Portfolio from '../components/portfolio/Portfolio';


class DashboardRoute extends Component {

    componentDidMount() {
        this.props.getPortfolio();
    }

    render() {
        return (
            <React.Fragment>
                <PageHeader title="Dashboard" />
                <div className="portfolio-wrapper">
                    <h2>Your Portfolio</h2>
                </div>
                <Portfolio porfolio={this.props.getPortfolioReducer} />
            </React.Fragment>
        );
    }
}

const mapStateToProps = ({ portfolioReducers }) => {
    const { get: getPortfolioReducer } = portfolioReducers;
    return { getPortfolioReducer };
  };
  
  export default withRouter(connect(mapStateToProps, {
    getPortfolio,
  })(DashboardRoute));
  