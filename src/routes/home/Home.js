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
import Menu from '../../components/Menu';
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
    actions.checkToken();
    actions.getHomeMenus();
  }

  onSelectedMenu(selectedMenuKey, args2) {
    const {actions} = this.props;
    let event;
    let selectedSubmenuKey = '';

    if (typeof(args2) === 'string') {
      selectedSubmenuKey = args2 || '';
    }

    actions.getTopicsByMenu(selectedMenuKey, selectedSubmenuKey);
  }

  render() {
    return (
      <div>
        <div className="col-sm-2">
          <Menu 
            selectedMenuKey={this.props.selectedMenuKey}
            menus={this.props.menus || []} 
            onSelectedMenu={this.onSelectedMenu.bind(this)}/>
        </div>
        <div className="col-sm-6">
          <div className="panel panel-default">
            <ul className="list-group">
              {this.props.topics.map((topic, index) => 
                (<TopicRow key={topic._id} index={index+1} item={topic}/>))
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
    menus: state.home.menus || [],
    selectedMenuKey: state.home.selectedMenuKey || '',
    selectedSubmenuKey: state.home.selectedSubmenuKey || ''
  }
}

export default connectComponent({LayoutComponent, mapStateToProps});
