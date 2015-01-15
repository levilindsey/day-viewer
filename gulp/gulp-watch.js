var gulp = require('gulp');
var plugins = require('gulp-load-plugins')({lazy: false});
var config = require('./config');

gulp.task('watch', config.buildTasks, function () {
  gulp.watch(config.scriptsSrc, ['scripts']);
  gulp.watch(config.stylesSrc, ['styles']);
  gulp.watch([config.indexSrc, config.iconsSrc], ['index']);
  gulp.watch(config.mediaSrc, ['copy-media']);
  gulp.watch(config.imagesSrc, ['compress-images']);
  gulp.watch(config.deviceIconsSrc, ['copy-device-icons']);

  gulp.start('tdd');
});
