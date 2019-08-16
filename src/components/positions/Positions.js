import React, { Component } from 'react';
import { Table, Divider, Tag, Button } from 'antd';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import uniqid from 'uniqid';
import moment from 'moment';
import PortfolioSummary from '../portofolio-summary/PortfolioSummary';
import formatters from '../../utils/formatters';

class Positions extends Component {

  getColumns() {
    const columns = [
      {
        title: 'Date',
        dataIndex: 'date',
        key: 'date',
        sorter: (a, b) => new Date(a.date) - new Date(b.date),
        render: (date) => moment(date).format('YYYY-MM-DD')
      },
      {
        title: 'Price',
        dataIndex: 'price',
        key: 'price',
        sorter: (a, b) => a.price - b.price,
      },
      {
        title: 'Position',
        dataIndex: 'position',
        key: 'position',
        sorter: (a, b) => a.position - b.position,
        // render: (text) => formatters.currency(text),
      },
      {
        title: 'Total cost',
        dataIndex: 'value',
        key: 'value',
        sorter: (a, b) => a.value - b.value,
        render: (text, record) => formatters.currency(record.price * record.position),
      },
    ]
    if (this.props.action) {
      const { title, dataIndex, value, render } = this.props.action;
      columns.push({
        title: title || 'action',
        dataIndex: dataIndex || 'action',
        key: value || 'action',
        render: (text, record) => render(text, record)
      });
    }
    return columns;
  }

  render() {
    const {
      loading,
      success,
      failure
    } = this.props.positions;
    const positions = success.ok ? success.data : [];
    return (
      <Table
        title={() => <h4>Current positions</h4>}
        bordered
        loading={loading}
        pagination={false}
        dataSource={positions}
        columns={this.getColumns()}
      />
    );
  }
}


const mapStateToProps = ({ stockSeriesReducers }) => {
  return {};
};

export default withRouter(connect(mapStateToProps, {

})(Positions));