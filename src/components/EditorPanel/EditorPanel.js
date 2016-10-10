import React, { Component, PropTypes } from 'react';
import s from './EditorPanel.css';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment';
import { Panel, Input, Button, Col, Tabs, Tab, Modal, ModalHeader, ModalFooter, ModalBody, ModalTitle } from 'react-bootstrap';
import Avator from '../Avator';
import Editor from '../Editor';
import marked from 'marked';

class EditorPanel extends Component {

  static propTypes = {
    isLogin: PropTypes.bool.isRequired,
    uploadUrl: PropTypes.string.isRequired,
    parentId: PropTypes.string.isRequired,
    onSubmit: PropTypes.func.isRequired
  }

  constructor() {
    super();
    this.state = {key: 1, value: '', showDialog: false};
    this._value = '';
  }

  _onReplyInputChange = (value) => {
    this._value = value;
  }

  _onSubmit() {
    let { isLogin = false } = this.props
    if ( !isLogin) return
    
    if (this.props.onSubmit) {
      this.props.onSubmit(this._value)
    }
  }

  _onUploadImage() {
    console.log('_onuploadimage')
  }

  _handleSelect = (key) => {
    if( key === 2 ) {
      this._showPreviewDialog();
      return;
    }

    this.setState({key: key});
  }

  _showPreviewDialog = () => {
    this.setState({ showDialog: true, value: this._value });
  }

  _onHideDialog = () => {
    this.setState({ showDialog: false });
  }

  previewDialog() {
    return (
      <Modal show={ this.state.showDialog } onHide={ this._onHideDialog }>
        <ModalHeader closeButton>
          <ModalTitle>预览</ModalTitle>
        </ModalHeader>
        <ModalBody>
           <div dangerouslySetInnerHTML={{ __html: marked(this.state.value, {breaks: true}) }} />
        </ModalBody>
        <ModalFooter>
          <Button onClick={ this._onHideDialog }>确认</Button>
        </ModalFooter>
      </Modal>
    );
  }

  headerNode() {
    return (
      <div className={ s.comment_form_head, s.tabnav }>
        <a className={ s.tabnav_extra } href="http://www.appinn.com/markdown/">支持Markdown语法</a>
        <Tabs activeKey={ this.state.key } onSelect={ this._handleSelect }>
          <Tab eventKey={ 1 } title="写评论"></Tab>
          <Tab eventKey={ 2 } title="查看"></Tab>
        </Tabs>
      </div>
     );
  }

  editorNode() {
    return this.state.key === 1
    ? (<Editor
        uploadUrl={ this.props.uploadUrl }
        onReplyInputChange={ this._onReplyInputChange }
        onUploadImage={ this.props.onUploadImage }
        onSubmit={ this._onSubmit.bind(this) } />)
    : (<p />);
  }

  render() {
    let avatorImageUrl = "http://7xp9om.com1.z0.glb.clouddn.com/avator.png";

    if (this.props.isLogin) {
      return (
        <div className={ s.timeline_comment_wrapper }>
          <div className={ s.timeline_comment }>
            { this.headerNode() }
            { this.editorNode() }
          </div>
          { this.previewDialog() }
        </div>
      );
    } else {
      return (<div className={ s.signed_out_comment }><Button bsStyle="primary">登陆</Button></div>);
    }
  }
}

export default withStyles(s)(EditorPanel);