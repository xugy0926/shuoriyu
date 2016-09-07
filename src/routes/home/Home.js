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
import Tab from '../../components/Tab';
import TopicRow from '../../components/TopicRow';
import { Panel, Col } from 'react-bootstrap';
import connectComponent from '../../utils/connectComponent';

const title = '说日语';

class Home extends Component {

  static contextTypes = {
    setTitle: PropTypes.func.isRequired,
  };

  static propTypes = {
    
  };

  componentWillMount() {
    this.context.setTitle(title);
    const {actions} = this.props;
    actions.getHomeTabs();
  }

  onSelectedTab(key) {
    const {actions} = this.props;
    actions.getTopicsByTab(key);
  }

  render() {

    return (
      <div>
        <div className="col-sm-2">
          <Tab selectedTab={this.props.selectedTab} items={this.props.tabs || []} onSelectedTab={this.onSelectedTab.bind(this)}/>
        </div>
        <div className="col-sm-6">
          <div className="panel panel-default">
            <ul className="list-group">
              {this.props.topics.map((item, index) => 
                (<TopicRow key={item.id} index={index+1} item={item}/>))
              }
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

const LayoutComponent = Home;
function mapStateToProps(state) {
  return {
    topics: state.home.topics || [],
    tabs: state.home.tabs || [],
    selectedTab: state.home.selectedTab || ''
  }
}

export default connectComponent({LayoutComponent, mapStateToProps});
