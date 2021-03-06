'use strict';

const fs = require('fs');
const path = require('path');

const utils = require('fepper-utils');

const rootDir = global.rootDir || utils.findup('fepper.command', __dirname);

/* istanbul ignore if */
if (!rootDir) {
  return;
}

const rcFile = '.htmllintrc';
const rcSource = path.resolve(__dirname, rcFile);
const rcDest = `${rootDir}/${rcFile}`;

if (!fs.existsSync(rcDest)) {
  fs.copyFileSync(rcSource, rcDest);
}
