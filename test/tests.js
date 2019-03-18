'use strict';

const path = require('path');

const expect = require('chai').expect;
const fs = require('fs-extra');
const glob = require('glob');
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
const {
  appDir,
  conf,
  fepper,
  rootDir
} = global;
const pathPatternsOrig = conf.ui.paths.public.patterns;
const rcFile = `${rootDir}/.htmllintrc`;

require('../htmllint~extend');

function retaskFpHtmllint(lintReports) {
  delete fp.tasks['fp-htmllint:test'];

  fp.task('fp-htmllint:test', () => {
    return fp.tasks.htmllint.fn()
      .pipe(reportLint(lintReports));
  });
}

describe('fp-htmllint', function () {
  before(function () {
    fs.removeSync(rcFile);
    fs.removeSync(conf.ui.paths.source.root);
    fs.copySync(`${appDir}/excludes/profiles/main/source`, conf.ui.paths.source.root);
  });

  describe('on install', function () {
    it('copies the default .htmllintrc into the current working directory', function () {
      const rcFileExistsBefore = fs.existsSync(rcFile);

      require('../install.js');

      const rcFileExistsAfter = fs.existsSync(rcFile);

      expect(rcFileExistsBefore).to.be.false;
      expect(rcFileExistsAfter).to.be.true;
    });
  });

  describe('on success', function () {
    let lintReports = [];
    let globbedIndexHtml = [];

    before(function (done) {
      fepper.tasks.jsonCompile();
      fepper.ui.build();
      retaskFpHtmllint(lintReports);

      globbedIndexHtml = glob.sync(`${conf.ui.paths.public.patterns}/**/index.html`);

      fp.runSequence(
        'fp-htmllint:test',
        () => {
          done();
        }
      );
    });

    it('should lint .html files in the public patterns directory', function () {
      for (let lintReport of lintReports) {
        expect(lintReport.extname).to.equal('.html');
      }
    });

    it('should ignore index.html viewall files', function () {
      expect(globbedIndexHtml).to.have.lengthOf.at.least(1);

      for (let lintReport of lintReports) {
        expect(lintReport.basename).to.not.equal('index.html');
      }
    });

    it('should ignore index.html viewall files', function () {
      expect(fs.existsSync(`${conf.ui.paths.public.patterns}/viewall/viewall.html`)).to.be.true;

      for (let lintReport of lintReports) {
        expect(lintReport.basename).to.not.equal('viewall.html');
      }
    });

    it('should ignore markup-only.html files', function () {
      for (let lintReport of lintReports) {
        const markupOnlyHtml =
          path.resolve(lintReport.dirname, path.basename(lintReport.basename, '.html')) + '.markup-only.html';

        expect(fs.existsSync(markupOnlyHtml)).to.be.true;
        expect(lintReport.basename).to.not.contain('.markup-only.html');
      }
    });

    it('should ignore .mustache files', function () {
      for (let lintReport of lintReports) {
        const markupOnlyHtml =
          path.resolve(lintReport.dirname, path.basename(lintReport.basename, '.html')) + '.mustache';

        expect(fs.existsSync(markupOnlyHtml)).to.be.true;
        expect(lintReport.basename).to.not.contain('.mustache');
      }
    });
  });

  describe('on error', function () {
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

  describe('on customization', function () {
    before(function () {
      pref.htmllint = {
        rules: {
          'attr-bans': [],
          'indent-width': 2
        }
      };
    });

    it('should respect options set in pref.yml', function (done) {
      let lintReports = [];

      retaskFpHtmllint(lintReports);

      fp.runSequence(
        'fp-htmllint:test',
        () => {
          expect(lintReports[0].htmllint.success).to.be.true;
          done();
        }
      );
    });
  });
});
