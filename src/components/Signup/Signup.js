import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Button } from 'react-bootstrap';
import FieldGroupComp from '../FieldGroup';
import AlertMessageComp from '../AlertMessage';

class Signup extends Component {

  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
  };

  constructor() {
    super();
    this.state = {
      errorMsg: '',
      name: '',
      email: '',
      password: '',
      rePassword: ''
    };
  }

  _onSignup() {
    if (this.state.name === '' || this.state.email === '' || this.state.password === '' || this.state.rePassword === '') {
      this.setState({errorMsg: '不能为空'});
      return;
    }

    this.props.onSubmit(this.state.name, this.state.email, this.state.password, this.state.rePassword);
  }

  _onNameChange(e) {
    this.setState({name: e.target.value});
  }

  _onEmailChange(e) {
    this.setState({email: e.target.value});
  }

  _onPasswordChange(e) {
    this.setState({password: e.target.value});
  }

  _onRePasswordChange(e) {
    this.setState({rePassword: e.target.value});
  }

  render() {
    let errorMsgNode = null;

    if (this.state.errorMsg !== '') {
      errorMsgNode = (
        <AlertMessageComp 
          message={this.state.errorMsg}
        />
        );
    }

    return (
        <form>
          {errorMsgNode}
          <FieldGroupComp
            id="nameText"
            ref="nameText"
            type="text"
            label=""
            placeholder="账号"
            onChange={this._onNameChange.bind(this)}
          />
          <FieldGroupComp
            id="emailText"
            ref="emailText"
            type="email"
            label=""
            placeholder="邮箱"
            onChange={this._onEmailChange.bind(this)}
          />
          <FieldGroupComp
            id="passwordText"
            ref="passwordText"
            type="password"
            label=""
            placeholder="密码"
            onChange={this._onPasswordChange.bind(this)}
          />
          <FieldGroupComp
            id="re-passwordText"
            ref="re-passwordText"
            type="password"
            label=""
            placeholder="密码"
            onChange={this._onRePasswordChange.bind(this)}
          />
          <Button onClick={this._onSignup.bind(this)}>
            注册
          </Button>
        </form>
    );
  }
}

export default(Signup);