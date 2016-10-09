import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import connectComponent from '../../utils/connectComponent';
import s from './TopicPage.css';
import TopicRow from '../../components/TopicRow';
import Reply from '../../components/Reply';
import marked from 'marked';
import { Col } from 'react-bootstrap';
import { markdown } from '../../server/common/render_helper';

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
    replies: PropTypes.object.isRequired
  };

  componentWillMount() {
    this.context.setTitle(this.props.topic.title);
    const {actions} = this.props;
    actions.getTopicById(this.props.topicId);
    actions.getRepliesByTopicId(this.props.topicId);
  }

  render() {
    return (
      <Col className="col-sm-8 col-sm-offset-2">
        <h3>{this.props.topic.title}</h3>
        <div className={s.nongshuoshu_body}>
          <div dangerouslySetInnerHTML={{ __html: markdown(this.props.topic.content) }} />
        </div>
        <Reply data={this.props.replies} />
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