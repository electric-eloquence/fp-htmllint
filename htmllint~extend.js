'use strict';

const gulp = global.gulp || require('gulp');
const htmllint = require('gulp-htmllint');
const utils = require('fepper-utils');

const {
  conf,
  pref,
  rootDir
} = global;

// Set up pref.htmllint.
pref.htmllint = pref.htmllint || {};
pref.htmllint.config = pref.htmllint.config || `${rootDir}/.htmllintrc`;

gulp.task('htmllint', function () {
  return gulp.src(conf.ui.paths.public.patterns + '/*/!(index|viewall|*markup-only).html')
    .pipe(htmllint(pref.htmllint));
});

gulp.task('htmllint:help', function (cb) {
  let out = `
Fepper Htmlint Extension

Use:
    <task> [<additional args>...]

Tasks:
    fp htmllint         Lint Fepper's frontend HTML files.
    fp htmllint:help    Print fp-htmllint tasks and descriptions.
`;

  utils.info(out);
  cb();
});
