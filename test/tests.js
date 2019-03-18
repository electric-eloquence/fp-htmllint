'use strict';

const path = require('path');

const expect = require('chai').expect;
const fs = require('fs-extra');
const {Transform} = require('stream');

process.env.ROOT_DIR = __dirname;

function reportLint(lintReports) {
  return new Transform({
    readableObjectMode: true,
    writableObjectMode: true,
    transform(file, enc, cb) {
      lintReports.push(file);
      cb();
    }
  });
}

const fp = require('fepper/tasker');
const fepper = global.fepper;
const {
  appDir,
  conf
} = fepper;
const pathPatternsOrig = conf.ui.paths.public.patterns;

function retaskFpHtmllint(lintReports) {
  delete fp.tasks['fp-htmllint:test'];

  fp.task('fp-htmllint:test', () => {
    return fp.tasks.htmllint.fn()
      .pipe(reportLint(lintReports));
  });
}

describe('fp-htmllint', function () {
  before(function () {
    fs.copySync(path.resolve(__dirname, '..', '.htmllintrc'), path.resolve(__dirname, '.htmllintrc'));
    fs.removeSync(conf.ui.paths.source.root);
    fs.copySync(`${appDir}/excludes/profiles/main/source`, conf.ui.paths.source.root);
  });

  describe('on success', function () {
    before(function () {
      fepper.tasks.jsonCompile();
      fepper.ui.build();
    });
 
    it('should lint .html files in the public patterns directory', function (done) {
      let lintReports = [];

      retaskFpHtmllint(lintReports);

      fp.runSequence(
        'fp-htmllint:test',
        () => {
          done();
        }
      );
    });
  });

  describe('on error', function () {
    require('../htmllint~extend');
 
    before(function () {
      conf.ui.paths.public.patterns = `${pathPatternsOrig}-error`;
    });

    it('should error on HTML that violates configured rules', function (done) {
      let lintReports = [];

      retaskFpHtmllint(lintReports);

      fp.runSequence(
        'fp-htmllint:test',
        () => {
          expect(lintReports[0].relative).to.equal('04-pages-error/04-pages-error.html');
          expect(lintReports[0].htmllint.success).to.be.false;
          expect(lintReports[0].htmllint.issues[0].code).to.equal('E001');
          expect(lintReports[0].htmllint.issues[0].data.attribute).to.equal('align');
          expect(lintReports[0].htmllint.issues[0].rule).to.equal('attr-bans');
          expect(lintReports[0].htmllint.issues[0].msg).to.equal('the `align` attribute is banned');
          done();
        }
      );
    });
  });
});
