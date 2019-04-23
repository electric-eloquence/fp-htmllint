'use strict';

const gulp = global.gulp || require('gulp');
const htmllint = require('gulp-htmllint');

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
