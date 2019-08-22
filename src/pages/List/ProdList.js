/* eslint-disable react/jsx-indent */
import React, { PureComponent } from 'react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { connect } from 'dva';
import { Table, Input, Button, Card, Form, Modal, Upload, message, Icon, Select } from 'antd';
import { findDOMNode } from 'react-dom';
import Result from '@/components/Result';
import router from 'umi/router';
import styles from './BasicList.less';
import config from '@/utils/config'

const {host} = config
const FormItem = Form.Item;
const SelectOption = Select.Option;
const {confirm} = Modal

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJPG = file.type === 'image/jpeg';
  if (!isJPG) {
    message.error('图片格式需是JPG!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('图片不能大于2MB!');
  }
  return isJPG && isLt2M;
}

@connect(({ routing }) => ({
  cid: routing.location.query.cid,
  cat_name: routing.location.query.cat_name
}))
@Form.create()
class ProdList extends PureComponent {
  state = { visible: false, done: false };

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };
  
  componentDidMount() {
    this.getCatList()
    this.getData()
  }


  getCatList = () => {
    const {dispatch} = this.props;
    const that = this
    dispatch({
      type:'list/getCatAll'
    }).then(res => {
      that.setState({
        cats:res
      })
    })
  }

  getData = (pageNum = 1,pageSize = 10) => {
    const { dispatch,cid } = this.props;
    const that = this
    dispatch({
      type: 'list/fetchProds',
      payload: {
        page: pageNum,
        cid: cid,
        key: '',
        size: pageSize
      },
    }).then(res => {
      that.setState({
        list:res.data,
        total:res.total,
        current_page:res.current_page
      })
    })
  }

  pageChange = (data) => {
    this.getData(data.current)
  }

  handleChange = info => {
    if (info.file.status === 'uploading') {
        this.setState({ loading: true });
        return;
    }
    if (info.file.status === 'done') {
        // Get this url from response in real world.
        getBase64(info.file.originFileObj, imageUrl => {
            console.log(info.file.response.url)
            this.setState({
                imageUrl,
                loading: false,
            })
        }
        );
    }
  }

  /* 取消形关闭所有弹出框 */
  handleCancel = () => {
    setTimeout(() => this.addBtn.blur(), 0);
    this.setState({
      visible: false,
      imageUrl: null
    });
  }

  /* 完成之后关闭所有弹出框 */
  handleDone = () => {
    setTimeout(() => this.addBtn.blur(), 0);
    this.setState({
      done: false,
      visible: false,
      imageUrl: null
    });
  };

  /* 分类信息 */
  showModal = () => {
    this.setState({
      visible: true,
      current: undefined,
    });
  };

  showEditModal = item => {
    this.setState({
      visible: true,
      current: item,
    });
  };

  /* 保存分类信息 */
  handleSubmit = e => {
    const that = this;
    e.preventDefault();
    const { dispatch, form, cid } = this.props;
    const { current = {}} = this.state

    setTimeout(() => this.addBtn.blur(), 0);
    form.validateFields((err, fieldsValue) => {
      const data = {
        ...fieldsValue,
        url:current.id ? fieldsValue.pic : fieldsValue.pic.file.response.url,
      }
      data.category_id = current.category_id ? current.category_id : cid
      if(current.id){
        data.id = current.id;
        data.category_id = current.category_id;
        data.main_img_id = current.main_img_id;
      }
      if (err) return;
      this.setState({
        done: true,
      });
      dispatch({
        type: current.id ? 'prod/edit' : 'prod/add',
        payload: { ...data },
      }).then(res => {
        that.getData()
      })
    });
  };

  chooseCat = (value,option) => {
    const that = this
    this.setState({
      current:{
        ...that.state.current,
        category_id:value
      }
    })
  }

  del = (item) => {
    const {dispatch} = this.props;
    const that = this;
    confirm({
      title: '确定删除?',
      content: '',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        dispatch({
          type:'prod/del',
          payload:{id:item.id}
        }).then(res => {
          if(res === 1){
            message.success('删除成功')
            that.getData()
          }
        })
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  render() {
    const {list,total,current_page,done,current = {},imageUrl,visible,loading, cats = []} = this.state
    const {
      form: { getFieldDecorator },
      cat_name
    } = this.props;
    const extraContent = (
      <div className={styles.extraContent}>
        {/* <Button type="primary">添加分类说明</Button> */}
      </div>
    );
    const columns = [
      {
        title: '图标',
        dataIndex: 'img',
        render: text => <img style={{ width: 100 }} alt='' src={text.url} />,
      },
      {
        title: '所属分类',
        dataIndex: 'cat_name',
      },
      {
        title: '操作',
        dataIndex: 'id',
        render: (text, record) => (
          <>
            <Button type="primary"
              style={{marginRight: 8}}
              onClick={e => {
              e.preventDefault();
              this.showEditModal(record);
            }}>编辑</Button>
            <Button type="danger"
              onClick={e => {
              e.preventDefault();
              this.del(record);
            }}>删除</Button>
          </>
        ),
      },
    ];
    const modalFooter = done
    ? { footer: null, onCancel: this.handleDone }
    : { okText: '保存', onOk: this.handleSubmit, onCancel: this.handleCancel };
    const uploadButton = () => {
      if(imageUrl){
        return(
          <img alt='' src={imageUrl} style={{width:100}} />
        )
      }
      return (
        <div>
          <Icon type={loading ? 'loading' : 'plus'} />
          <div className="ant-upload-text">分类图片</div>
        </div>
      )
    }
    const getModalContent = () => {
      if (done) {
        return (
          <Result
            type="success"
            title="操作成功"
            // description="一系列的信息描述，很短同样也可以带标点。"
            actions={
              <Button type="primary" onClick={this.handleDone}>
                知道了
              </Button>
            }
            className={styles.formResult}
          />
        );
      }
      return (
        <Form onSubmit={this.handleSubmit}>
          <FormItem label="分类" {...this.formLayout}>
            {getFieldDecorator('category_id', {
              initialValue: current.cat_name ? current.cat_name : cat_name ? cat_name :undefined,
            })(
              <Select placeholder="请选择" onChange={this.chooseCat}>
                {cats.map(item => (
                  <SelectOption key={item.id} value={item.id}>{item.name}</SelectOption>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem label="图片" {...this.formLayout}>
            {getFieldDecorator('pic', {
              rules: [{ required: true, message: '请上传图片' }],
              initialValue: current.img ? current.img.url : '',
            })(
              <Upload
                name="avatar"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                action={host+"/prod/up_prod_logo"}
                beforeUpload={beforeUpload}
                onChange={this.handleChange}
              >{current.id ? <img alt='' src={imageUrl ? imageUrl :current.img.url} style={{width:100}} /> : uploadButton()}
              </Upload>
            )}
          </FormItem>
          <FormItem label="排序" {...this.formLayout}>
            {getFieldDecorator('sort', {
              initialValue: current.sort || 0,
            })(<Input placeholder="请输入" />)}
          </FormItem>
        </Form>
      );
    };
    return (
      <PageHeaderWrapper>
        <div className={styles.standardList}>
          <Card
            bordered={false}
            title="商品列表"
            extra={extraContent}
          >
          <Button
            type="dashed"
            style={{ width: '100%', marginBottom: 8 }}
            icon="plus"
            onClick={this.showModal}
            ref={component => {
              /* eslint-disable */
              this.addBtn = findDOMNode(component);
              /* eslint-enable */
            }}
          >
            添加
          </Button>
            <Table
              columns={columns}
              dataSource={list}
              pagination={{ current: current_page, total: total, pageSize: 10 }}
              onChange={this.pageChange}
              rowKey="id"
            />
          </Card>
        </div>
        <Modal
          title={done ? null : `任务${current.id ? '编辑' : '添加'}`}
          className={styles.standardListForm}
          width={640}
          bodyStyle={done ? { padding: '72px 0' } : { padding: '28px 0 0' }}
          destroyOnClose
          visible={visible}
          {...modalFooter}
        >
          {getModalContent()}
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default ProdList;
