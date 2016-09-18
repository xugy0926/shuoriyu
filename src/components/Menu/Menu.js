import React, { Component, PropTypes } from 'react';
import s from './Menu.css';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

class Menu extends Component {

  static propTypes = {
    menus: PropTypes.object.isRequired,
    selectedMenuKey: PropTypes.string.isRequired,
    selectedSubmenuKey: PropTypes.string.isRequired,
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
      (<li>
        <a className={s.active} key={index} onClick={this.props.onSelectedMenu.bind(this, menu.key)}>{menu.value}</a>
      </li>
      ): (
      <li>
        <a key={index} onClick={this.props.onSelectedMenu.bind(this, menu.key)}>{menu.value}</a>
      </li>
      );
  }

  buildOptionButton(index, menu) {
    let submenusNodes = [];
    const submenus = menu.submenus || [];

    if (submenus && submenus.length > 0) {
      submenus.forEach((submenu)=> {
        submenusNodes.push( this.props.selectedSubmenuKey === submenu.key ? (
          <li>
            <a className={s.active} onClick={this.props.onSelectedMenu.bind(this, menu.key, submenu.key)}>
              {submenu.value}
            </a>
          </li>)
        : (
          <li>
            <a onClick={this.props.onSelectedMenu.bind(this, menu.key, submenu.key)}>
              {submenu.value}
            </a>
          </li>));
      });
    }

    return (<li>
        <a>{menu.value}</a>
        <ul>
        {submenusNodes}
        </ul>
      </li>
      );
  }

  render() {
    return (
      <ul className={s.level1}>
        {this.buildMenus()}
      </ul>
    );
  }
}

export default withStyles(s)(Menu);