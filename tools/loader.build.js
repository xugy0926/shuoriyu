import cp from 'child_process';

/**
 * Copies static files such as robots.txt, favicon.ico to the
 * output (build) folder.
 */
async function loaderBuild() {
  let server;
  server = cp.spawn('./node_modules/loader-builder/bin/builder', ['./src/server/views', './src/server']);
  server.kill();
}

export default loaderBuild;