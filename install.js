'use strict';

const fs = require('fs');

const appDir = '../../../app';
const rcFile = '.htmllintrc';

if (fs.existsSync(appDir)) {
  fs.readFile(rcFile, (err, data) => {
    if (err) {
      throw err;
    }
    fs.writeFile(`${appDir}/${rcFile}`, data);
  });
}
