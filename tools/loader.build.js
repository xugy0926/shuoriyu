import cp from 'child_process';

/**
 * Copies static files such as robots.txt, favicon.ico to the
 * output (build) folder.
 */
async function loaderBuild() {
  await cp.spawn('./node_modules/loader-builder/bin/builder', ['./src/server/views', './src/server']);
}

export default loaderBuild;