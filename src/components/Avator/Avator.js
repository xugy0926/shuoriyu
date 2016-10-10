import React, { Component, PropTypes } from 'react';
import s from './Avator.css';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

class Avator extends Component {

  static propTypes = {
    url: PropTypes.string.isRequired,
  }

  render() {
    let url = this.props.url || "http://7xp9om.com1.z0.glb.clouddn.com/avator.png";

    return (
      <a>
        <img className={ s.avatar } width={48} heigh={48} src={ url }/>
      </a>
      );
  }
}

export default withStyles(s)(Avator);