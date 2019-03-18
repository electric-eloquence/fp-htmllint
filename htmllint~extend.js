'use strict';

const gulp = require('gulp');
const htmllint = require('gulp-htmllint');

const {
  conf,
  pref,
  rootDir
} = global;
const pubDir = conf.ui.paths.public;

// Set up pref.htmllint.
pref.htmllint = pref.htmllint || {};
pref.htmllint.config = pref.htmllint.config || `${rootDir}/.htmllintrc`;

gulp.task('htmllint', function () {
  return gulp.src(pubDir.patterns + '/*/!(index|viewall|*markup-only).html')
    .pipe(htmllint(pref.htmllint));
});
