import React, { Component, PropTypes } from 'react'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import connectComponent from '../../utils/connectComponent'
import s from './TopicPage.css'
import TopicRow from '../../components/TopicRow'
import Reply from '../../components/Reply'
import EditorPanel from '../../components/EditorPanel'
import marked from 'marked'
import { Col, Button } from 'react-bootstrap'
import { markdown } from '../../server/common/render_helper'
import * as storage from '../../services/storage'
import { apiPrefix } from '../../config'

const title = 'React Starter Kit';

class TopicPage extends Component {

  static contextTypes = {
    setTitle: PropTypes.func.isRequired,
  };

  static propTypes = {
    topicId: PropTypes.string.isRequired,
    topic: PropTypes.shape({
      title: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired
    }).isRequired,
    replies: PropTypes.object.isRequired,
    currentPage: PropTypes.number.isRequired,
    pages: PropTypes.number.isRequired
  };

  componentWillMount() {
    this.context.setTitle(this.props.topic.title);
    const {actions} = this.props;
    actions.getTopicById(this.props.topicId);
    actions.getRepliesByTopicId(this.props.topicId);
  }

  _onReply(content) {
    if (content === '') return
    const {topic, actions} = this.props
    actions.submitReply(topic._id, content)
  }

  _onMore(nextPage) {
    const {topic, actions} = this.props
    actions.getMoreRepliesByTopicId(topic._id, nextPage)
  }

  render() {
    const isLogin = storage.isLogin()
    const {topic} = this.props
    const {replies, currentPage, pages} = this.props.replies
    return (
      <Col className="col-sm-8 col-sm-offset-2">
        <h3>{topic.title}</h3>
        <div className={s.nongshuoshu_body}>
          <div dangerouslySetInnerHTML={{ __html: markdown(topic.content) }} />
        </div>
        <Reply items={replies} onMore={this._onMore.bind(this)} currentPage={currentPage} pages={pages}/>
        <EditorPanel 
          isLogin={isLogin} 
          uploadUrl={apiPrefix.data + '/upload'}
          parentId={topic._id}
          onSubmit={this._onReply.bind(this)}/>
      </Col>
    );
  }
}

const LayoutComponent = withStyles(s)(TopicPage);
function mapStateToProps(state) {
  return {
    topic: state.home.topic || {},
    replies: state.home.replies || []
  }
}

export default connectComponent({LayoutComponent, mapStateToProps});