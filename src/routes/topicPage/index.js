import React from 'react';
import TopicPage from './TopicPage';
import fetch from '../../core/fetch';
import { host } from '../../config';
import * as topicService from '../../services/topicService';

export default {

  path: '/topic/:tid',

  async action(context, {tid}) {
    const data = await topicService.getTopicById(tid);
    return <TopicPage topic={data} />;
  },
};
