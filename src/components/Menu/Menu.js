import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { ButtonGroup, Button, DropdownButton, SplitButton, MenuItem } from 'react-bootstrap';

class Menu extends Component {

  static propTypes = {
    menus: PropTypes.object.isRequired,
    selectedMenuKey: PropTypes.string.isRequired,
    onSelectedMenu: PropTypes.func.isRequired,
  };

  buildMenus() {
    if (this.props.menus && this.props.selectedMenuKey) {
      let nodes = [];
      this.props.menus.forEach((menu, index) => {

        if (menu.submenus && menu.submenus.length > 0) {
          nodes.push(this.buildOptionButton(index, menu));
        } else {
          nodes.push(this.buildDefaultButton(index, menu));
        }
      });
      
      return (nodes);
    } else {
      return (<div />)
    }
  }

  buildDefaultButton(index, menu) {
    return this.props.selectedMenuKey === menu.key ?
      (<Button className="active"
        key={index} 
        onClick={this.props.onSelectedMenu.bind(this, menu.key)}>
        {menu.value}
      </Button>
      ): (
      <Button
        key={index} 
        onClick={this.props.onSelectedMenu.bind(this, menu.key)}>
        {menu.value}
      </Button>
      );
  }

  buildOptionButton(index, menu) {
    let submenusNodes = [];
    const submenus = menu.submenus || [];

    if (submenus && submenus.length > 0) {
      submenus.forEach((submenu)=> {
        submenusNodes.push((<MenuItem onClick={this.props.onSelectedMenu.bind(this, menu.key, submenu.key)}>{submenu.value}</MenuItem>));
      });
    }

    return this.props.selectedMenu === menu.key ?
      (<DropdownButton title={menu.value} className="active">
        {submenusNodes}
      </DropdownButton>
      )
      :
      (<DropdownButton title={menu.value}>
        {submenusNodes}
      </DropdownButton>
      );
  }

  render() {
    return (
      <ButtonGroup vertical>
        {this.buildMenus()}
      </ButtonGroup>
    );
  }
}

export default(Menu);