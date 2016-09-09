import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

class Menu extends Component {

  static propTypes = {
    items: PropTypes.object.isRequired,
    onSelectedMenu: PropTypes.func.isRequired,
    selectedMenu: PropTypes.string.isRequired,
  };

  menusNode() {
    if (this.props.items && this.props.selectedMenu) {
      let nodes = [];
      this.props.items.forEach((item, index) => {
        nodes.push(
          this.props.selectedMenu === item.key ?
          (<a className="list-group-item active" 
            active
            key={index} 
            onClick={this.props.onSelectedMenu.bind(this, item.key)}>
            {item.value}
          </a>
          ): (
          <a className="list-group-item"
            key={index} 
            onClick={this.props.onSelectedMenu.bind(this, item.key)}>
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
        {this.menusNode()}
      </div>
    );
  }
}

export default(Menu);