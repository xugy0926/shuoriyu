import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

class Tab extends Component {

  static propTypes = {
    items: PropTypes.object.isRequired,
    onSelectedTab: PropTypes.func.isRequired,
    selectedTab: PropTypes.string.isRequired,
  };

  tabsNode() {
    if (this.props.items && this.props.selectedTab) {
      let nodes = [];
      this.props.items.forEach((item, index) => {
        nodes.push(
          this.props.selectedTab === item.key ?
          (<a className="list-group-item active" 
            active
            key={index} 
            onClick={this.props.onSelectedTab.bind(this, item.key)}>
            {item.value}
          </a>
          ): (
          <a className="list-group-item"
            key={index} 
            onClick={this.props.onSelectedTab.bind(this, item.key)}>
            {item.value}
          </a>
          ));
      });

      return (nodes);
    } else {
      return (<div />)
    }
  }

  render() {
    return (
      <div className="list-group">
        {this.tabsNode()}
      </div>
    );
  }
}

export default(Tab);