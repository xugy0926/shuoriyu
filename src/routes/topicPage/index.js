import React from 'react';
import TopicPage from './TopicPage';
import fetch from '../../core/fetch';
import { host } from '../../config'

export default {

  path: '/topic/:id',

  async action({path}) {
  	console.log('path = ' + path);
    const resp = await fetch( 'http://' + host + '/api/v1' + path);
    const { success, data } = await resp.json();
    if (!success || !data) throw new Error('Failed to load the topic.');
    return <TopicPage topic={data} />;
  },
};
