'use strict';

const gulp = require('gulp');
const htmllint = require('gulp-htmllint');

const pubDir = global.conf.ui.paths.public;
const rootDir = global.rootDir;

// Set up pref.htmllint.
pref.htmllint = pref.htmllint || {};
pref.htmllint.config = pref.htmllint.config || `${rootDir}/.htmllintrc`

gulp.task('htmllint', function () {
  return gulp.src(pubDir.patterns + '/*/!(index|viewall|*markup-only).html')
    .pipe(htmllint(pref.htmllint));
});
