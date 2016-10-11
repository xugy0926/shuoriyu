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
import s from './TopicRow.css';
import Link from '../Link';

class TopicRow extends Component {

  static propTypes = {
    index: PropTypes.number.isRequired,
    item: PropTypes.object.isRequired
  };

  render() {
    let to = `/topic/${this.props.item._id}`;
    console.log('topic row. to = ' + to)
    return (
      <li className="list-group-item">
         <Link to={to}>{this.props.item.title}</Link>
      </li>
    );
  }
}

export default withStyles(s)(TopicRow);
