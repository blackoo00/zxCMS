/* eslint-disable react/jsx-indent */
import React, { PureComponent } from 'react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { connect } from 'dva';
import { findDOMNode } from 'react-dom';
import { Table, Input, Button, Card, Form, Modal, Upload, message, Icon } from 'antd';
import Result from '@/components/Result';
import Link from 'umi/link';
import styles from './BasicList.less';

const FormItem = Form.Item;

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

@connect(({ list, loading }) => ({
  catelist: list.catelist,
  loading: loading.models.list,
}))
@Form.create()
class CateList extends PureComponent {
  state = {
    visible: false,
    done: false,
    imgsVisible: false,
    imgsLoading: false,
    imgs:[]
  };

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'list/fetchCates',
      payload: {
        page: 1,
        key: '',
      },
    });
  }

  /* 完成之后关闭所有弹出框 */
  handleDone = () => {
    setTimeout(() => this.addBtn.blur(), 0);
    this.setState({
      done: false,
      visible: false,
      imgsVisible: false
    });
  };

  /* 分类信息 */
  showModal = () => {
    this.setState({
      visible: true,
      current: undefined,
    });
  };

  /* 显示产品图片列表弹出框 */
  showImgsModal = cid => () => {
    const {dispatch} = this.props
    const that = this
    this.setState({
      imgsVisible: true,
      current: undefined,
      imgsLoading: true
    });
    dispatch({
      type:'list/fetchProds',
      payload: cid
    }).then(res => {
      that.setState({
        imgsLoading:false,
        imgs:res
      })
    })
  }

  /* 取消形关闭所有弹出框 */
  handleCancel = () => {
    setTimeout(() => this.addBtn.blur(), 0);
    this.setState({
      visible: false,
      imgsVisible: false,
    });
  }

  /* 保存分类信息 */
  handleSubmit = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    const { current } = this.state;
    const id = current ? current.id : '';

    setTimeout(() => this.addBtn.blur(), 0);
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.setState({
        done: true,
      });
      // dispatch({
      //   type: 'list/submit',
      //   payload: { id, ...fieldsValue },
      // });
    });
  };
  
  handlePreview = () => {

  }

  render() {
    const { done, visible, current = {}, loading, imgsVisible, imgsLoading,imgs } = this.state
    const list = this.props.catelist;
    const {
      form: { getFieldDecorator },
    } = this.props;
    const columns = [
      {
        title: '标题',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '副标题',
        dataIndex: 'sub_name',
        key: 'sub_name',
      },
      {
        title: '图片',
        dataIndex: 'img',
        render: text => <img style={{ width: '80px' }} src={text.url} />,
      },
      {
        title: '操作',
        dataIndex: 'id',
        render: text => (
          <div>
            <Button type="primary" style={{ marginRight: '8px' }}>
              编辑
            </Button>
            <Button type="primary" onClick={this.showImgsModal(text)}>图片列表</Button>
          </div>
        ),
      },
    ];
    const modalFooter = done
      ? { footer: null, onCancel: this.handleDone }
      : { okText: '保存', onOk: this.handleSubmit, onCancel: this.handleCancel };
    const modalFooter2 = done
      ? { footer: null, onCancel: this.handleDone }
      : { okText: '保存', onOk: this.handleSubmit, onCancel: this.handleCancel };
    const uploadButton = (
      <div>
        <Icon type={loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">分类图片</div>
      </div>
    );
    /* 渲染图片列表弹出框 */
    const getImgsModalContent = () => {
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
      if(imgsLoading){
        return (
          <div style={{textAlign:'center'}}>
            <Icon type='loading' style={{ fontSize: '50px' }}  />
            <div>加载中...</div>
          </div>
        )
      }
      console.log(imgs)
      return (
        <>
          {imgs.map(item => (
            <Upload
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              action="http://a.cn/api/cms/prod/up_prod_logo"
              beforeUpload={beforeUpload}
              onChange={this.handleChange}
              onPreview={this.handlePreview}
            > <img src={item.main_img_url} alt='avatar' style={{width:100}}/>
            </Upload>
          ))}
          <Upload
            name="avatar"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            action="http://a.cn/api/cms/prod/up_prod_logo"
            beforeUpload={beforeUpload}
            onChange={this.handleChange}
          >{uploadButton}
          </Upload>
        </>
      );
    };
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
          <FormItem label="标题" {...this.formLayout}>
            {getFieldDecorator('name', {
              rules: [{ required: true, message: '请输入标题' }],
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem label="副标题" {...this.formLayout}>
            {getFieldDecorator('sub_name', {
              rules: [{ required: true, message: '请输入副标题' }],
            })(<Input placeholder="请输入" />)}
          </FormItem>
          {/* <FormItem label="图片" {...this.formLayout}>
            {getFieldDecorator('pic', {
              rules: [{ required: true, message: '请上传图片' }],
            })(
              <Upload
                name="avatar"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                action="http://a.cn/api/cms/prod/up_prod_logo"
                beforeUpload={beforeUpload}
                onChange={this.handleChange}
              >{uploadButton}
              </Upload>
            )}
          </FormItem> */}
        </Form>
      );
    };
    return (
      <PageHeaderWrapper>
        <Card
          bordered={false}
          title="商品分类"
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
            pagination={{ current: 1, total: 2, pageSize: 5 }}
            //   onChange={this.pageChange}
            rowKey="id"
          />
        </Card>
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
        <Modal
          title={`图片列表`}
          className={styles.standardListForm}
          width={700}
          bodyStyle={done ? { padding: '72px 0' } : { padding: '28px 28px 0', display:'flex', flexWrap: 'wrap' }}
          destroyOnClose
          visible={imgsVisible}
          {...modalFooter2}
        >
          {getImgsModalContent()}
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default CateList;
