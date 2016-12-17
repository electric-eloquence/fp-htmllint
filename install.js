'use strict';

const fs = require('fs');

const rootDir = `${process.cwd()}/../../..`;
const confFile = `${rootDir}/conf.yml`;
const rcFile = process.argv[2];

if (fs.existsSync(confFile)) {
  fs.readFile(confFile, {encoding: 'utf8'}, (err, data) => {
    if (err) {
      throw err;
    }

    let appDir = `${rootDir}/`;
    let regex = /^app_dir\s*:.*$/m;

    if (regex.test(data)) {
      let appDirConf = data.match(regex)[0].trim().split(':');
      appDir += appDirConf[1].trim();
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
