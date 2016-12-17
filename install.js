'use strict';

const fs = require('fs');

const rootDir = `${process.cwd()}/../../..`;
const confFile = `${rootDir}/conf.yml`;
const rcFile = '.htmllintrc';

if (fs.existsSync(confFile)) {
  fs.readFile(confFile, (err, data) => {
    if (err) {
      throw err;
    }

    // app_dir should be the first config.
    let appDir = `${rootDir}/`;
    let regex = /^[^\n]*/;

    if (regex.test(data)) {
      appDir += data.match(regex)[0].trim();
    }
    else {
      appDir += 'app';
    }

    if (fs.existsSync(appDir)) {
      fs.readFile(rcFile, (err1, data1) => {
        if (err1) {
          throw err1;
        }
        fs.writeFile(`${appDir}/${rcFile}`, data1);
      });
    }
  });
}
