/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Col } from 'react-bootstrap';
import SignupComp from '../../components/Signup';
import connectComponent from '../../utils/connectComponent';

const title = '注册';

class Signup extends Component {
  static contextTypes = {
    setTitle: PropTypes.func.isRequired,
  };

  static propTypes = {
    
  };

  componentWillMount() {
    this.context.setTitle(title);
  }

  _onSubmit(name, password, rePassword, code) {
    alert('onSignup....');
    const { actions } = this.props;
    this.props.actions.onSignup(name, password, rePassword, code);
  }

  render() {
    return (
      <Col md={4} mdOffset={4}>
        <SignupComp onSubmit={this._onSubmit.bind(this)} />
      </Col>
    );
  }
}

const LayoutComponent = Signup;
function mapStateToProps(state) {
  return {
  }
}

export default connectComponent({LayoutComponent, mapStateToProps});
