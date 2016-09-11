import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Button, Alert } from 'react-bootstrap';
import FieldGroupComp from '../FieldGroup';
import AlertMessageComp from '../AlertMessage';

class Signin extends Component {

  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
  };

  constructor() {
    super();
    this.state = {
      errorMsg: '',
      name: '',
      password: ''
    };
  }

  _onSignin() {
    if (this.state.name === '' || this.state.password === '') {
      this.setState({errorMsg: '不能为空'});
      return;
    }

    this.props.onSubmit(this.state.name, this.state.password, this.state.rePassword);
  }

  _onNameChange(e) {
    this.setState({name: e.target.value});
  }

  _onPasswordChange(e) {
    this.setState({password: e.target.value});
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
            id="passwordText"
            ref="passwordText"
            type="password"
            label=""
            placeholder="密码"
            onChange={this._onPasswordChange.bind(this)}
          />
          <Button onClick={this._onSignin.bind(this)}>
            登陆
          </Button>
        </form>
    );
  }
}

export default(Signin);