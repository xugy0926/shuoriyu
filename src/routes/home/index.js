/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import Home from './Home';
import fetch from '../../core/fetch';

var getTabs = async function() {
	const resp = await fetch('api/v1/tabs');
	const { success, tabs } = await resp.json();
	if ( !success || !tabs) throw new Error('Failed to load the tabs.');

	return tabs;
};


export default {

  path: '/',

  async action() {
    let tabs = await getTabs();
    return <Home tabs={tabs} />;
  },

};




