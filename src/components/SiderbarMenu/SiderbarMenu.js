import React, { Component, PropTypes } from 'react';
import s from './siderbarmenu.css';
import classNames from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

class Menu extends Component {

  static propTypes = {
    menus: PropTypes.object.isRequired,
    selectedMenuKey: PropTypes.string.isRequired,
    selectedSubmenuKey: PropTypes.string.isRequired,
    onSelectedMenu: PropTypes.func.isRequired,
  };

  constructor() {
    super();
    this.state = {
      hide: true,
      clickMore: false
    }
  }

  _onSelectedMenu(menuKey, submenuKey) {
    this.setState({hide: true});
    this.props.onSelectedMenu(menuKey, submenuKey);
  }

  _handleMore() {
    this.setState({hide: !this.state.hide});
  }

  _handleOverlay() {
    this.setState({hide: !this.state.hide});
  }

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
        <a className={s.active} key={index} onClick={this._onSelectedMenu.bind(this, menu.key)}>{menu.value}</a>
      </li>
      ): (
      <li>
        <a key={index} onClick={this._onSelectedMenu.bind(this, menu.key)}>{menu.value}</a>
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
            <a className={s.active} onClick={this._onSelectedMenu.bind(this, menu.key, submenu.key)}>
              {submenu.value}
            </a>
          </li>)
        : (
          <li>
            <a onClick={this._onSelectedMenu.bind(this, menu.key, submenu.key)}>
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
    let menuStyle;
    let overlayStyle;
    if (!this.state.hide) {
      menuStyle = classNames(s.siderbarmenu, s.siderbarmenuopen);
      overlayStyle = classNames(s.siderbarmenuoverlay, s.siderbarmenuoverlayopen);
    } else {
      menuStyle = classNames(s.siderbarmenu);
      overlayStyle = classNames(s.siderbarmenuoverlay);
    }

    return (
      <div>
        <div className={s.more} onClick={this._handleMore.bind(this)}>
          <span>M</span>
        </div>
        <div className={menuStyle} ref="siderbarmenu">
          <ul className={s.level1}>
            {this.buildMenus()}
          </ul>
        </div>
        <div className={overlayStyle} onClick={this._handleOverlay.bind(this)}></div>
      </div>
    );
  }
}

export default withStyles(s)(Menu);