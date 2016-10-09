import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './ReplyRow.css';
import Link from '../Link';

class ReplyRow extends Component {

  static propTypes = {
    index: PropTypes.number.isRequired,
    item: PropTypes.object.isRequired
  };

  render() {
    let {item} = this.props
    return (
      <div className={ s.discussion_item }>
        <a className={ s.author }>{item.author.loginname}</a>
        <span>{item.create_at}</span>
          <p>{item.content}</p>
      </div>
    );
  }
}

export default withStyles(s)(ReplyRow);