import React, { PropTypes, Component } from 'react';
import s from './Editor.css';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment';
import { Input, Button } from 'react-bootstrap';
import Request from 'superagent';

class Editor extends Component {

  static propTypes = {
    uploadUrl: PropTypes.string.isRequired,
    onReplyInputChange: PropTypes.func.isRequired,
    onUploadImage: PropTypes.func,
    onSubmit: PropTypes.func.isRequired
  }

  _onChange = (e) => {
    this.props.onReplyInputChange(e.target.value);
  }

  _onSumbit = (e) => {
    if (this.props.onSubmit) {
      this.props.onSubmit(this.refs.inputArea.value)
      this.refs.inputArea.value = '';
    }
  }

  _onSelectedImageChange = () => {
    var files = this.refs.upImage.files;

    var maxFiles = (this.props.multiple) ? files.length : 1;
    if (maxFiles < 1) return null;

    for(let i = 0; i < maxFiles; i++) {
      this.upload(files[i], this.props.onUploadImage || null);
    }
  }

  _onClickSelectImage = () => {
    this.refs.upImage.click();
  }

  upload(file, callback) {
    Request.post(this.props.uploadUrl || '')
      .set('Accept', 'application/json')
      .attach('file', file)
      .end(function (err, res) {
        if(err) return;
        if(res.body && res.body.success) {
          let name = '';
          let url = res.body.url;
          let templateImage = `![${name}](${url})`
          this.refs.inputArea.value = this.refs.inputArea.value + templateImage;
          this.props.onReplyInputChange(this.refs.inputArea.value);
        }
      }.bind(this));
  }

  loggedInNode() {
    return (
      <label className={ s.prepend_icon }>
        <textarea className={ s.editor_textarea } ref="inputArea" onChange={ this._onChange }/>
        <input className="hidden" type="file" ref="upImage" accept="image" onChange={ this._onSelectedImageChange } />
        <span className={ s.input_hint }>
        <strong>Hint:</strong> Please enter between 80 - 300 characters. Attach files by <a onClick={ this._onClickSelectImage }>selecting them.</a>
        </span>
        <div className={ s.submit_div }>
        <Button className={ s.right } bsStyle="primary" onClick={ this._onSumbit }>提交</Button>
        </div>
      </label>);
  }

  render() {
    return this.loggedInNode();
  }
}


export default withStyles(s)(Editor);