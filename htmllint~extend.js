'use strict';

const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();

const appDir = global.appDir;
const pubDir = global.conf.ui.paths.public;
const utils = require(`${appDir}/core/lib/utils`);

gulp.task('htmllint', function () {
  return gulp.src(utils.pathResolve(pubDir.patterns) + '/*/!(index|*markup-only).html')
    .pipe(plugins.htmllint());
});
