'use strict';

process.env.ROOT_DIR = __dirname;

const path = require('path');
const {Transform} = require('stream');

const {expect} = require('chai');
const fs = require('fs-extra');
const glob = require('glob');
const slash = require('slash');

const fp = require('fepper/tasker');
const {
  appDir,
  conf,
  fepper,
  pref,
  rootDir
} = global;
const patternsDir = conf.ui.paths.public.patterns;
const sourceDir = conf.ui.paths.source.root;
const rcFile = `${rootDir}/.htmllintrc`;

require('../htmllint~extend');

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

function retaskFpHtmllint(lintReports) {
  delete fp.tasks['fp-htmllint:test'];

  fp.task('fp-htmllint:test', () => {
    return fp.tasks.htmllint.fn()
      .pipe(reportLint(lintReports));
  });
}

describe('fp-htmllint', function () {
  before(function () {
    fs.removeSync(sourceDir);
    fs.copySync(`${appDir}/excludes/profiles/main/source`, sourceDir);
  });

  describe('on install', function () {
    before(function () {
      fs.removeSync(rcFile);
    });

    it('copies the default .htmllintrc into the current working directory', function () {
      const rcFileExistsBefore = fs.existsSync(rcFile);

      require('../install');

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

      globbedIndexHtml = glob.sync(`${patternsDir}/**/index.html`);

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
      expect(fs.existsSync(`${patternsDir}/viewall/viewall.html`)).to.be.true;

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
      conf.ui.paths.public.patterns = `${patternsDir}-error`;
    });

    it('should error on HTML that violates configured rules', function (done) {
      let lintReports = [];

      retaskFpHtmllint(lintReports);

      fp.runSequence(
        'fp-htmllint:test',
        () => {
          expect(slash(lintReports[0].relative)).to.equal('04-pages-error/04-pages-error.html');
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
      conf.ui.paths.public.patterns = `${patternsDir}-error`;
    });

    it('should respect options set in pref.yml', function (done) {
      let lintReports = [];
      pref.htmllint = {
        rules: {
          'attr-bans': [],
          'indent-width': 2
        }
      };

      retaskFpHtmllint(lintReports);

      fp.runSequence(
        'fp-htmllint:test',
        () => {
          expect(lintReports[0].htmllint.success).to.be.true;
          done();
        }
      );
    });

    it('should fail on error if set to do so', function () {
      pref.htmllint = {
        failOnError: true
      };
      delete fp.tasks['fp-htmllint:test'];

      fp.task('fp-htmllint:test', () => {
        return fp.tasks.htmllint.fn()
          .on('error', (err) => {
            expect(err).to.be.an.instanceof(Error);
            expect(err.message).to.equal('1 error(s) occurred');
            expect(err.plugin).to.equal('gulp-htmllint');
          });
      });

      fp.tasks['fp-htmllint:test'].fn();
    });
  });
});
