'use strict';

const fs = require('fs');
const path = require('path');

const utils = require('fepper-utils');

const rootDir = utils.findup('fepper.command', process.cwd());

if (!rootDir) {
  return;
}

const rcFile = '.htmllintrc';
const rcSource = path.resolve(__dirname, rcFile);

fs.copyFileSync(rcSource, `${rootDir}/${rcFile}`);
