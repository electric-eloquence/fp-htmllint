'use strict';

const findUp = require('find-up');
const fs = require('fs');
const path = require('path');

var filepath = findUp.sync('fepper.command');

if (!filepath) {
  return;
}

const rootDir = path.dirname(filepath);
const rcFile = process.argv[2];

fs.readFile(rcFile, (err1, data1) => {
  if (err1) {
    throw err1;
  }
  fs.writeFile(`${rootDir}/${rcFile}`, data1);
});
