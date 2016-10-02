import path from 'path';
import gaze from 'gaze';
import replace from 'replace';
import Promise from 'bluebird';
import del from 'del';
import fs from './lib/fs';

/**
 * Copies static files such as robots.txt, favicon.ico to the
 * output (build) folder.
 */
async function copyres() {
  const ncp = Promise.promisify(require('ncp'));

  await del(['./upload/*'], { dot: true });
  await fs.makeDir('./upload');
  await fs.createFile('./build/logs/cheese.log');

  try {
    await Promise.all([
      ncp('build/public/upload', './upload'),
    ]);
  } catch(e) {

  }
}

export default copyres;
