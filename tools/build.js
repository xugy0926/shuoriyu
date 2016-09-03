/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import run from './run';
import clean from './clean';
import copy from './copy';
import bundle from './bundle';
import render from './render';
import copyres from './copyres';
import loaderBuild from './loader.build';

/**
 * Compiles the project from source files into a distributable
 * format and copies it to the output (build) folder.
 */
async function build() {
  await run(clean);
  await run(loaderBuild);
  await run(copy);
    // [begin][add] 首要先把数据保存一下
  await run(copyres);
  // [end][add]
  await run(bundle);

  if (process.argv.includes('--static')) {
    await run(render);
  }
}

export default build;
