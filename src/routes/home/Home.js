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
import s from './Home.css';
import TopicRow from '../../components/TopicRow';
import { Col } from 'react-bootstrap';

const title = 'React Starter Kit';

class Home extends Component {

  static contextTypes = {
    setTitle: PropTypes.func.isRequired,
  };

  static propTypes = {
    topics: PropTypes.arrayOf(PropTypes.shape({
      title: PropTypes.string.isRequired
    })).isRequired,
  };

  componentWillMount() {
    this.context.setTitle(title);
  }

  render() {
    return (
      <Col className="col-sm-8 col-sm-offset-2">
        <ul className={s.news}>
          {this.props.topics.map((item, index) => (
            <TopicRow key={item.id} index={index+1} item={item}/>
          ))}
        </ul>
      </Col>
    );
  }
}

export default withStyles(s)(Home);
