'use strict';

const gulp = require('gulp');
const htmllint = require('gulp-htmllint');

const pubDir = global.conf.ui.paths.public;
const rootDir = global.rootDir;

gulp.task('htmllint', function () {
  return gulp.src(pubDir.patterns + '/*/!(index|*markup-only).html')
    .pipe(htmllint({config: `${rootDir}/.htmllintrc`}));
});
