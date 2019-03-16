'use strict';

const fs = require('fs');
const path = require('path');

const utils = require('fepper-utils');

const filepath = utils.findup('fepper.command', __dirname);

if (!filepath) {
  return;
}

const rcFile = process.argv[2];
const rcSource = path.resolve(__dirname, rcFile);
const rootDir = path.dirname(filepath);

fs.copyFileSync(rcSource, `${rootDir}/${rcFile}`);
