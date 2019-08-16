import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Table, Divider, Input, Icon, Button, Statistic, Tag } from 'antd';
import Highlighter from 'react-highlight-words';
import uniqid from 'uniqid';
import PortfolioSummary from '../portofolio-summary/PortfolioSummary';
import formatters from '../../utils/formatters';
import {
  FILTERED_PORTFOLIO_TEXT_COLOR
} from '../../constants'

class Portfolio extends Component {

  state = {
    searchText: '',
  };

  handleSearch = (selectedKeys, confirm) => {
    confirm();
    this.setState({ searchText: selectedKeys[0] });
  };

  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: '' });
  };

  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
          className="portfolio-search-input"
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm)}
          icon="search"
          size="small"
          className="portfolio-search-button"
        >
          Search
        </Button>
        <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
          Reset
        </Button>
      </div>
    ),
    filterIcon: filtered => (
      <Icon type="search" style={{ fontSize: 16, color: filtered ? FILTERED_PORTFOLIO_TEXT_COLOR : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: text => (
      <Highlighter
        highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
        searchWords={[this.state.searchText]}
        autoEscape
        textToHighlight={text.toString()}
      />
    ),
  });


  getColumns() {
    return [
      {
        title: 'Ticker',
        dataIndex: 'symbol',
        key: 'symbol',
        sorter: (a, b) => a.symbol.length - b.symbol.length,
        ...this.getColumnSearchProps('symbol'),
      },
      {
        title: 'Positions',
        dataIndex: 'positions',
        key: 'positions',
        sorter: (a, b) => a.positions - b.positions,
      },
      {
        title: 'Investment cost',
        dataIndex: 'investment',
        key: 'investment',
        sorter: (a, b) => a.investment - b.investment,
        render: (text) => formatters.currency(text),

      },
      {
        title: 'Current value',
        dataIndex: 'value',
        key: 'value',
        sorter: (a, b) => a.value - b.value,
        render: (text, record) => {
          const { value, investment } = record;
          const percentage = ((value - investment) / (value + investment / 2)) * 100
          if (record.value > record.investment) {
            return (
              <div className="portfolio-value-wrapper">
                <span>{formatters.currency(text)}</span>
                <Tag color="green">
                  <Icon type="arrow-up" /> {percentage ? percentage.toFixed(2) : 0}%
                </Tag>
              </div>
            );
          } else if (record.value < record.investment) {
            return (
              <div className="portfolio-value-wrapper">
                <span>{formatters.currency(text)}</span>
                <Tag color="red">
                  <Icon type="arrow-down" /> {percentage ? percentage.toFixed(2) : 0}%
                </Tag>
              </div>
            );
          } else {
            return (
              <div className="portfolio-value-wrapper">
                <span>{formatters.currency(text)}</span>
                <Tag color="grey">
                  <Icon type="check" /> {percentage ? percentage.toFixed(2) : 0}%
                </Tag>
              </div>
            );
          }
        },
      },
      {
        title: 'Actions',
        key: 'action',
        render: (text, record) => {
          const disabled = record.positions <= 0;
          return (
            <div>
              <Button type="link" className="buy-stocks-action">
                <Link to={`/trade/${record.symbol}/buy`}>Buy</Link>
              </Button>
              <Divider type="vertical" />
              <Button type="link" disabled={disabled}>
                <Link to={`/trade/${record.symbol}/sell`}>Sell</Link>
              </Button>
            </div>
          )
        },
      }
    ]
  }

  render() {
    const {
      loading,
      success,
      failure
    } = this.props.porfolio;
    const portfolio = success.ok ? success.data : [];
    return (
      <Table
        title={() => <PortfolioSummary portfolio={portfolio} />}
        bordered
        loading={loading}
        pagination={false}
        dataSource={portfolio}
        columns={this.getColumns()}
        rowKey={uniqid()}
        className="portfolio-table-wrapper"
      />
    );
  }
}

export default Portfolio;