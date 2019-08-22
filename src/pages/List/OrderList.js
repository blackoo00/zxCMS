/* eslint-disable react/jsx-indent */
import React, { PureComponent } from 'react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { connect } from 'dva';
import { Table, Input, Button, Icon } from 'antd';
import Link from 'umi/link';

@connect(({ list, loading }) => ({
  orderlist: list.orderlist,
  loading: loading.models.list,
}))
class ProdList extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'list/fetchOrders',
      payload: {
        count: 5,
      },
    });
  }

  render() {
    // const {
    //     list: { list },
    //   } = this.props;
    // console.log(list)
    const list = this.props.orderlist;
    const columns = [
      {
        title: 'No',
        dataIndex: 'order_no',
        key: 'order_no',
        filterDropdown: (
          <div className="custom-filter-dropdown">
            <Input
              // eslint-disable-next-line no-return-assign
              ref={ele => (this.searchInput = ele)}
              placeholder="Search name"
              value="123"
              onChange={this.onInputChange}
              onPressEnter={this.onSearch}
            />
            <Button type="primary" onClick={this.onSearch}>
              Search
            </Button>
          </div>
        ),
        filterIcon: <Icon type="smile-o" style={{ color: true ? '#108ee9' : '#aaa' }} />,
        filterDropdownVisible: false,
      },
      {
        title: 'Icon',
        dataIndex: 'snap_img',
        render: text => <img style={{ width: '80px' }} src={text} />,
      },
      {
        title: 'Price',
        dataIndex: 'total_price',
      },
      {
        title: 'Count',
        dataIndex: 'total_count',
      },
      {
        title: 'Create Time',
        dataIndex: 'create_time',
      },
      {
        title: 'Operation',
        dataIndex: 'id',
        render: text => (
          <Link to={'order/' + text}>
            <Button type="primary">详情</Button>
          </Link>
        ),
      },
    ];
    return (
      <PageHeaderWrapper>
        <Table
          columns={columns}
          dataSource={list}
          pagination={{ current: 1, total: 2, pageSize: 5 }}
          //   onChange={this.pageChange}
          rowKey="id"
        />
      </PageHeaderWrapper>
    );
  }
}

export default ProdList;
