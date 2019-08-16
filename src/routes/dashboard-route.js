import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import { PageHeader, Result, Button } from 'antd';
import {
  getPortfolio
} from '../actions';
import Portfolio from '../components/portfolio/Portfolio';


class DashboardRoute extends Component {

  componentDidMount() {
    this.props.getPortfolio();
  }

  renderPortfolio() {
    const { failure } = this.props.getPortfolioReducer;
    if (failure.error) {
      return (
        <Result
          status="500"
          title="500"
          subTitle="Sorry, something went wrong."
          extra={(
            <Button
              type="primary"
              onClick={this.props.getPortfolio}
            >
              Try again
            </Button>
          )}
        />
      );
    }
    return <Portfolio porfolio={this.props.getPortfolioReducer} />; 
  }

  render() {
    return (
      <React.Fragment>
        <PageHeader title="Dashboard" />
        <div className="portfolio-wrapper">
          <h2>Your Portfolio</h2>
        </div>
        {this.renderPortfolio()}
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
