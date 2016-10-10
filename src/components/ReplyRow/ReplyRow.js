import React, { Component, PropTypes } from 'react'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './ReplyRow.css'
import Link from '../Link'
import moment from 'moment'
import { Panel } from 'react-bootstrap'

moment.locale('zh-cn')

class ReplyRow extends Component {

  static propTypes = {
    index: PropTypes.number.isRequired,
    item: PropTypes.object.isRequired
  };

  _title(item) {
    return (
      <div>
        <strong><a className={ s.author }>{item.author.loginname}</a></strong>
        <span className={s.time}>{moment(item.create_at).fromNow()}</span>
      </div>
      );
  }

  render() {
    let {item} = this.props
    return (
      <Panel header={this._title(item)}>
        <p>{item.content}</p>
      </Panel>
    );
  }
}

export default withStyles(s)(ReplyRow);