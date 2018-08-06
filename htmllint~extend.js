'use strict';

const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();

const appDir = global.appDir;
const pubDir = global.conf.ui.paths.public;
const workDir = global.workDir;

gulp.task('htmllint', function () {
  return gulp.src(pubDir.patterns + '/*/!(index|*markup-only).html')
    .pipe(plugins.htmllint({config: `${workDir}/.htmllintrc`}));
});
