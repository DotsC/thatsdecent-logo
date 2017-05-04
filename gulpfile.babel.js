const gulp = require('gulp'),
 connect = require('gulp-connect'),
 sass = require('gulp-sass'),
 babel = require('gulp-babel'),
 print = require('gulp-print');

const buildPath = './app/build';
const sourcePath = './app/src';

const cssPath = `${buildPath}/css/`;
const imgPath = `${buildPath}/img/`;
const jsPath = `${buildPath}/js/`;
const fontPath = `${buildPath}/font/`;


const allHtmlPath = `${sourcePath}/**/*.html`;
const allSassPath = `${sourcePath}/css/sass/**/*.scss`;
const allImgPath = `${sourcePath}/img/**/*.*`;
const allCssPath = `${sourcePath}/css/*.min.css`;
const allJSPath = `${sourcePath}/js/**/*.js`;
const allFontPath = `${sourcePath}/font/*.ttf`;


/* SASS & CSS Processing and copy */
gulp.task('sass', () => {
  return gulp.src(`${allSassPath}`)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(`${cssPath}`));
});
gulp.task('css', () => {
  return gulp.src(`${allCssPath}`)
    .pipe(gulp.dest(`${cssPath}`));
});

gulp.task('images', () => {
  return gulp.src(`${allImgPath}`)
    .pipe(gulp.dest(`${imgPath}`));
});



/* Util watch for Sass Dev */
gulp.task('sass:watch', () => {
  gulp.watch(`${allSassPath}`, ['sass']);
});

/*JS Processing and copy */
gulp.task('js', () => {
  return gulp.src(`${allJSPath}`)
    .pipe(print())
    .pipe(babel({ presets: ['es2015'] }))
    .pipe(gulp.dest(`${jsPath}`));
});

/*html Processing and copy */
gulp.task('html', () => {
  return gulp.src(`${allHtmlPath}`)
   .pipe(connect.reload())
   .pipe(gulp.dest(`${buildPath}`));
});

/*fonts Processing and copy */
gulp.task('font', () => {
  return gulp.src(`${allFontPath}`)
   .pipe(connect.reload())
   .pipe(gulp.dest(`${fontPath}`));
});


/* Connect / Watch and Defaults. */
gulp.task('connect', () => {
  connect.server({
    root: `${buildPath}`,
    livereload: true
  });
});

gulp.task('watch', () => {
 gulp.watch([`${allHtmlPath}`, `${allSassPath}`,`${allJSPath}`], ['html', 'sass','js']);
 //gulp.watch([`${allHtmlPath}`], ['html']);
});

gulp.task('build', ['js', 'html', 'sass', 'css', 'images','font']);

gulp.task('default', ['connect', 'watch']);
