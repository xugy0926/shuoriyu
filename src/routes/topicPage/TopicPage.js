import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './TopicPage.css';
import TopicRow from '../../components/TopicRow';
import marked from 'marked';
import { Col } from 'react-bootstrap';

const title = 'React Starter Kit';

class TopicPage extends Component {

  static contextTypes = {
    setTitle: PropTypes.func.isRequired,
  };

  static propTypes = {
    topic: PropTypes.shape({
      title: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired
    }).isRequired,
  };

  componentWillMount() {
    this.context.setTitle(this.props.topic.title);
  }

  render() {
    return (
      <Col className="col-sm-8 col-sm-offset-2">
        <div className={s.nongshuoshu_body}>
          <div dangerouslySetInnerHTML={{ __html: marked(this.props.topic.content) }} />
        </div>
      </Col>
    );
  }
}

export default withStyles(s)(TopicPage);