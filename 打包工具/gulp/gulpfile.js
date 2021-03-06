var gulp = require('gulp');
var jshint = require('gulp-jshint');
var cleanHTML = require('gulp-htmlclean')
var cleanCSS = require('gulp-clean-css')
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var del = require('del');

var paths = {
  html: {
    src: 'src/*.html',
    dest: 'build/'
  },
  styles: {
    src: 'src/css/*.css',
    dest: 'build/'
  },
  scripts: {
    src: 'src/js/*.js',
    dest: 'build/'
  },
  images: {
    src: 'src/imgs/*',
    dest: 'build/imgs/'
  }
};

function clean() {
  return del([ 'build' ]); // 删除 build 目录
}

// 压缩 HTML
function html() {
  return gulp.src(paths.html.src)
    .pipe(cleanHTML())
    .pipe(gulp.dest(paths.html.dest));
}

// 压缩 CSS
function styles() {
  return gulp.src(paths.styles.src)
    .pipe(cleanCSS())
    .pipe(rename({
      basename: 'build',
      suffix: ''
    }))
    .pipe(gulp.dest(paths.styles.dest));
}

// 压缩 JS
function scripts() {
  return gulp.src(paths.scripts.src, { sourcemaps: true })
    .pipe(jshint())
    .pipe(uglify())
    .pipe(rename({
      basename: 'build',
      suffix: ''
    }))
    .pipe(gulp.dest(paths.scripts.dest));
}

// 压缩图片
function images() {
  return gulp.src(paths.images.src, {
    since: gulp.lastRun(images), // 过滤没有更新的图片，使其不参与编译
  })
  .pipe(imagemin([
    imagemin.gifsicle({interlaced: true}),
    imagemin.jpegtran({progressive: true}),
    imagemin.optipng({optimizationLevel: 5}),
    imagemin.svgo({
      plugins: [
        {removeViewBox: true},
        {cleanupIDs: false}
      ]
    })
  ]))
  .pipe(gulp.dest(paths.images.dest));
}

// 监听文件是否更改
function watch() {
  gulp.watch(paths.styles.src, styles);
  gulp.watch(paths.scripts.src, scripts);
  gulp.watch(paths.images.src, images);
}

// 进行串操作（首先移除指定文件夹）
var build = gulp.series(clean, gulp.parallel([html, styles, scripts, images]));

exports.clean = clean;
exports.html = html;
exports.styles = styles;
exports.scripts = scripts;
exports.images = images;
exports.watch = watch;
exports.build = build;

exports.default = build;