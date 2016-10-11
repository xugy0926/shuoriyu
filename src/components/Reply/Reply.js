import React, { Component, PropTypes } from 'react'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from './Reply.css'
import Link from '../Link'
import ReplyRow from '../ReplyRow'
import connectComponent from '../../utils/connectComponent'
import { Button } from 'react-bootstrap'

class Reply extends Component {

  static propTypes = {
    items: PropTypes.array,
    onMore: PropTypes.func.isRequired,
    currentPage: PropTypes.number,
    pages: PropTypes.number
  }

  constructor(props) {
    super(props)
  }

  _onMore() {
    const {currentPage, pages, onMore} = this.props
    const nextPage = currentPage + 1
    
    if(nextPage <= pages && onMore) {
      onMore(nextPage)
    }
  }

  _moreNode() {
    const {currentPage, pages} = this.props
    const nextPage = currentPage + 1

    if(nextPage <= pages) {
      return (<Button className={ s.more } onClick={ this._onMore.bind(this) }>更多</Button>)
    } else {
      return ''
    }
  }

  render() {
    const {items=[]} = this.props
    if(items.length > 0) {
      return (
        <div>
          {items.map((item, index) => (<ReplyRow key={item._id} item={item} index={index+1} />))}
          {this._moreNode()}
        </div>
      );      
    } else {
      return (<p>无评论</p>)
    }
  }
}

export default withStyles(s)(Reply);