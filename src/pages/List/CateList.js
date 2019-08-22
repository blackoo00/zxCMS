/* eslint-disable react/jsx-indent */
import React, { PureComponent } from 'react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { connect } from 'dva';
import { findDOMNode } from 'react-dom';
import { Table, Input, Button, Card, Form, Modal, Upload, message, Icon } from 'antd';
import Result from '@/components/Result';
import router from 'umi/router';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; 
import styles from './BasicList.less';
import config from '@/utils/config'

const {host} = config
const {confirm} = Modal
const FormItem = Form.Item;

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

@connect(({ loading }) => ({
  loading: loading.models.list,
}))
@Form.create()
class CateList extends PureComponent {
  state = {
    list:[],
    visible: false,
    done: false
  };

  formLayout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 17 },
  };
  
  modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline','strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image'],
      [{ 'color': [] }, { 'background': [] }], 
      [{ 'align': [] }],
      ['clean'],
    ],
  }

  formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'color', 'background',
    'align',
    'link', 'image'
  ]

  componentDidMount() {
    this.init()
  }

  init = () => {
    this.getData()
  }

  pageChange = (data) => {
    this.getData(data.current)
  }

  getData = (pageNum = 1,pageSize = 10) => {
    const { dispatch } = this.props;
    const that = this
    dispatch({
      type: 'list/fetchCates',
      payload: {
        page: pageNum,
        size: pageSize,
      },
    }).then(res => {
      that.setState({
        list:res.data,
        total:res.total,
        current_page:res.current_page
      })
    })
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

  /* 编辑分类 */
  showEditModal = item => () => {
    this.setState({
      visible: true,
      current: item,
    });
  };

  /* 分类信息 */
  showModal = () => {
    this.setState({
      visible: true,
      current: undefined,
    });
  };

  /* 取消形关闭所有弹出框 */
  handleCancel = () => {
    setTimeout(() => this.addBtn.blur(), 0);
    this.setState({
      visible: false,
      imageUrl: null
    });
  }

  /* 保存分类信息 */
  handleSubmit = e => {
    const that = this;
    e.preventDefault();
    const { dispatch, form } = this.props;
    const { current = {}} = this.state

    setTimeout(() => this.addBtn.blur(), 0);
    form.validateFields((err, fieldsValue) => {
      console.log(fieldsValue)
      const data = {
        ...fieldsValue,
        url:!current.url ? fieldsValue.pic : current.url,
        id:current.id ? current.id : '',
        topic_img_id:current.id ? current.topic_img_id : ''
      }
      if (err) return;
      this.setState({
        done: true,
      });
      dispatch({
        type: current.id ? 'list/edit' : 'list/create',
        payload: { ...data },
      }).then(res => {
        that.init()
      })
    });
  };

  handleChange = info => {
      if (info.file.status === 'uploading') {
          this.setState({ loading: true });
          return;
      }
      if (info.file.status === 'done') {
          // Get this url from response in real world.
          const that = this
          getBase64(info.file.originFileObj, imageUrl => {
              console.log(info.file.response.url)
              this.setState({
                  imageUrl,
                  loading: false,
                  current:{
                    ...that.state.current,
                    url:info.file.response.url
                  }
              })
          }
          );
      }
  }

  handleChangelRemark = (value) => {
    console.log(typeof value)
    console.log(value)
    // this.setState({ remark: value })
  }

  del = item => () => {
    const {dispatch} = this.props;
    const that = this;
    confirm({
      title: '确定删除?',
      content: '会删除该分类下所有图片',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        dispatch({
          type:'list/del',
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
    const { done, visible, current = {}, loading, imageUrl,list,total,current_page, remark ='' } = this.state
    // const list = this.props.catelist;
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
        render: (text,record) => (
          <div>
            <Button type="primary" style={{ marginRight: '8px' }} onClick={this.showEditModal(record)}>
              编辑
            </Button>
            <Button type="primary" style={{ marginRight: '8px' }} onClick={() => {router.push(`/list/prod-list?cid=${record.id}&cat_name=${record.name}`)}}>图片列表</Button>
            <Button type="danger" onClick={this.del(record)}>
              删除
            </Button>
          </div>
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
          <FormItem label="标题" {...this.formLayout}>
            {getFieldDecorator('name', {
              rules: [{ required: true, message: '请输入标题' }],
              initialValue: current.name,
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem label="副标题" {...this.formLayout}>
            {getFieldDecorator('sub_name', {
              rules: [{ required: true, message: '请输入副标题' }],
              initialValue: current.sub_name,
            })(<Input placeholder="请输入" />)}
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
                action={host+"prod/up_prod_logo"}
                beforeUpload={beforeUpload}
                onChange={this.handleChange}
              >{current.id ? <img alt='' src={imageUrl ? imageUrl :current.img.url} style={{width:100}} /> : uploadButton()}
              </Upload>
            )}
          </FormItem>
          <FormItem label="描述" {...this.formLayout}>
            {getFieldDecorator('remark', {
              initialValue: current.remark ? current.remark : '',
            })(
              <ReactQuill
                theme="snow"
                // value={current.remark}
                modules={this.modules}
                formats={this.formats}
                // onChange={this.handleChangelRemark} 
                />
            )}
          </FormItem>
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
            pagination={{ current: current_page, total: total, pageSize: 10 }}
            onChange={this.pageChange}
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
      </PageHeaderWrapper>
    );
  }
}

export default CateList;
