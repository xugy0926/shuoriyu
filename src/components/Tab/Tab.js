import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

class Tab extends Component {

  static propTypes = {
    items: PropTypes.object.isRequired,
    onSelectedTab: PropTypes.func.isRequired
  };

  tabsNode() {
    if (this.props.items) {
      let nodes = [];
      this.props.items.forEach((item, index) => {
        nodes.push((
          <a className="list-group-item" key={index} onClick={this.props.onSelectedTab.bind(this, item.key)}>{item.value}</a>
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