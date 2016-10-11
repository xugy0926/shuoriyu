/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component, PropTypes } from 'react';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Navigation.css';
import Link from '../Link';
import { Nav, Navbar, NavItem, NavDropdown, MenuItem} from 'react-bootstrap';
import { Header, Brand, Toggle, Collapse } from 'react-bootstrap/lib/Navbar'
import history from '../../core/history';
import connectComponent from '../../utils/connectComponent';

class Navigation extends Component {

  static propTypes = {
  }

  _onSignin() {
    history.push('/signin');
  }

  _onSignup() {
    history.push('/signup');
  }

  _onSignout() {
    const { actions } = this.props;
    actions.onSignout();
  }

  render() {
    const {secret, active} = this.props;
    let userNode = null;
    if (secret && secret._id && active) {
      userNode = (<Nav pullRight>
                    <NavDropdown id="1" eventKey={1} title={secret.name}>
                      <MenuItem eventKey={1.1} onClick={this._onSignout.bind(this)}>退出</MenuItem>
                    </NavDropdown>
                  </Nav>);
    } else {
       userNode = (<Nav pullRight>
                    <NavItem onClick={this._onSignin.bind(this)}>登录</NavItem>
                    <NavItem onClick={this._onSignup.bind(this)}>注册</NavItem>
                  </Nav>);
    }

    return (
      <Navbar>
        <Header>
          <Brand>
            <Link to="/">说日语</Link>
          </Brand>
          <Toggle />
        </Header>
        <Collapse>
          <Nav>
          </Nav>
          {userNode}
        </Collapse>
      </Navbar>
    );
  }
}

const LayoutComponent = withStyles(s)(Navigation);
function mapStateToProps(state) {
  return {
    active: state.auth.active || false,
    secret: state.auth.secret || {}
  }
}

export default connectComponent({LayoutComponent, mapStateToProps});
