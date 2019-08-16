import React from 'react';
import formatters from '../../utils/formatters';

const PortfolioSummary = (props) => {
  const calculateValue = () => props.portfolio.reduce((p, n) => {
    return p + n.value;
  }, 0);
  return (
    <div className="portfolio-header-wrapper">
      <h4>Portfolio value: {formatters.currency(calculateValue())}</h4>
      <h4>Current balance: {formatters.currency(window.localStorage.getItem('balance'))}</h4>
    </div>
  );
}

export default PortfolioSummary;