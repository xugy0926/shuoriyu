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
import { Nav, Navbar, NavBrand, NavItem, NavDropdown, MenuItem} from 'react-bootstrap';
import history from '../../core/history';

class Navigation extends Component {

  static propTypes = {
    className: PropTypes.string
  }

  _onLogin() {
    history.push('/login');
  }

  _onLogout() {
    history.push('/logout');
  }

  render() { 
    return (
      <Navbar>
        <Navbar.Header>
          <Navbar.Brand>
            <Link to="/">说日语</Link>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>
            <NavItem eventKey={1} onClick={this._onLogin}>Log in</NavItem>
            <NavItem eventKey={1} onClick={this._onLogout}>Log out</NavItem>
          </Nav>
          <Nav pullRight>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default withStyles(s)(Navigation);
