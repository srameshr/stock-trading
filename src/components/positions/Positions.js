import React from 'react';
import { Table } from 'antd';
import moment from 'moment';
import formatters from '../../utils/formatters';

const Positions = (props) => {

  const {
    loading,
    success,
    failure
  } = props.positions;
  const posistionsData = success.ok ? success.data : [];
  const getColumns = () => {
    const columns = [
      {
        title: 'Date',
        dataIndex: 'date',
        key: 'date',
        sorter: (a, b) => moment(a.date) - moment(b.date),
        render: (date) => moment(date).format('YYYY-MM-DD'),
        // defaultSortOrder: 'descend',
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
    if (props.action) {
      const { title, dataIndex, value, render } = props.action;
      columns.push({
        title: title || 'action',
        dataIndex: dataIndex || 'action',
        key: value || 'action',
        render: (text, record) => render(text, record)
      });
    }
    return columns;
  }

  return (
    <Table
      title={() => <h4>Current positions</h4>}
      bordered
      loading={loading}
      pagination={false}
      dataSource={posistionsData}
      columns={getColumns()}
    />
  );
}


export default Positions;