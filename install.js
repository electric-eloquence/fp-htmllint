'use strict';

const fs = require('fs');
const path = require('path');

const findUp = require('find-up');

const filepath = findUp.sync('fepper.command');

if (!filepath) {
  return;
}

const rcFile = process.argv[2];
const rootDir = path.dirname(filepath);

fs.readFile(rcFile, (err, data) => {
  if (err) {
    throw err;
  }

  fs.writeFile(`${rootDir}/${rcFile}`, data);
});
