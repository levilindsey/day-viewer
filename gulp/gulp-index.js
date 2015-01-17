var gulp = require('gulp');
var plugins = require('gulp-load-plugins')({lazy: false});
var config = require('./config');

gulp.task('index', function () {
  return gulp.src(config.indexSrc)
    .pipe(plugins.plumber())

    // Template with Lo-dash
    .pipe(plugins.template({}))

    .pipe(gulp.dest(config.distPath));
});

// ---  --- //

function fileContentsTransform(filePath, file) {
  return file.contents.toString('utf8')
}
