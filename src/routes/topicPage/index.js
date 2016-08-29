import React from 'react';
import TopicPage from './TopicPage';
import fetch from '../../core/fetch';
import { host } from '../../config'

export default {

  path: '/topic/:id',

  async action({path}) {
    const resp = await fetch('/api/v1' + path);
    const { success, data } = await resp.json();
    if (!success || !data) throw new Error('Failed to load the topic.');
    return <TopicPage topic={data} />;
  },
};
