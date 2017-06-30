const gulp = require('gulp'),
 connect = require('gulp-connect'),
 sass = require('gulp-sass'),
 babel = require('gulp-babel'),
 print = require('gulp-print'),
 imagemin = require('gulp-imagemin');

const appPath = './app';
const buildPath = `${appPath}/build`;
const sourcePath = `${appPath}/src`;
const distPath = `${appPath}/dist`;

const cssPath = `${buildPath}/css/`;
const imgPath = `${buildPath}/img/`;
const jsPath = `${buildPath}/js/`;
const fontPath = `${buildPath}/font/`;

const allHtmlPath = `${sourcePath}/**/*.html`;
const allSassPath = `${sourcePath}/css/sass/**/*.scss`;
const allCssPath = `${sourcePath}/css/**/*.min.css`;

//const allJSPath = `${sourcePath}/js/**/*.js`;
const customJSPath = `${sourcePath}/js/*.js`;
const vendorJSPath = `${sourcePath}/js/vendor/**/*.js`;

const allImgPath = `${sourcePath}/img/**/*.*`;
const pngImgPath =`${sourcePath}/img/**/*.png`;
const svgImgPath =`${sourcePath}/img/**/*.svg`;
const jpgImgPath =`${sourcePath}/img/**/*.jpg`;



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
  /*
    return gulp.src([`${allImgPath}`)
    gulp.src(['app/**', '!app/{_tmp,_tmp/**}'])
  */
  return gulp.src([`${pngImgPath}`, `${svgImgPath}`, `${jpgImgPath}`,`!${sourcePath}/img/_src/**`])
    .pipe(imagemin())
    .pipe(gulp.dest(`${imgPath}`));
});

/* Util watch for Sass Dev */
gulp.task('sass:watch', () => {
  gulp.watch(`${allSassPath}`, ['sass']);
});

/* Move vendore js to the corresponding build folder */
gulp.task('vendorJS', () =>{
  return gulp.src(`${vendorJSPath}`)
    .pipe(print(filePath => {
      return `Copying -> ${filePath}`;
    }))
    .pipe(gulp.dest(`${jsPath}`));
});

/*JS Processing and copy */
gulp.task('js', ['vendorJS'], () => {
  return gulp.src(`${customJSPath}`)
    .pipe(print(filePath => {
        return `Transpiling -> ${filePath}`;
    }))
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
 gulp.watch([`${allHtmlPath}`, `${allSassPath}`,`${customJSPath}`], ['html', 'sass','js']);
 //gulp.watch([`${allHtmlPath}`], ['html']);
});

/* CREATE A DISTIBUTION BUILD */
gulp.task('dist', ()=> {
  return gulp.src(`${buildPath}/**/*`)
   .pipe(gulp.dest(`${distPath}`));
});

gulp.task('build', ['js', 'html', 'sass', 'css', 'images','font']);

gulp.task('default', ['connect', 'watch']);
