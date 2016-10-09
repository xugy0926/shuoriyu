import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Reply.css';
import Link from '../Link';
import ReplyRow from '../ReplyRow';
import connectComponent from '../../utils/connectComponent';

class Reply extends Component {

  static propTypes = {
    data: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props)
  }

  render() {
    const {replies=[]} = this.props.data
    if(replies.length > 0) {
      return (
        <div>
          {replies.map((item, index) => (<ReplyRow item={item} index={index+1} />))}
        </div>
      );      
    } else {
      return (<p>无评论</p>)
    }
  }
}

export default withStyles(s)(Reply);