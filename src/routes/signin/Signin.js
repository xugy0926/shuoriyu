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
import SigninComp from '../../components/Signin';
import connectComponent from '../../utils/connectComponent';

const title = '登陆';

class Signin extends Component {
  static contextTypes = {
    setTitle: PropTypes.func.isRequired,
  };

  static propTypes = {
    
  };

  componentWillMount() {
    this.context.setTitle(title);
  }

  _onSubmit(name, password) {
    const { actions } = this.props;
    this.props.actions.onSignin(name, password);
  }

  render() {
    return (
      <Col md={4} mdOffset={4}>
        <SigninComp onSubmit={this._onSubmit.bind(this)} />
      </Col>
    );
  }
}

const LayoutComponent = Signin;

function mapStateToProps(state) {
  return {
  }
}

export default connectComponent({LayoutComponent, mapStateToProps});
