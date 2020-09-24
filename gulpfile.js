// Load Gulp only with these methods
const { src, dest, task, watch, series, parallel } = require('gulp');

// CSS related plugins
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');

// JS related plugins
const uglify = require('gulp-uglify');
const babelify = require('babelify');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const stripDebug = require('gulp-strip-debug');

// Utility plugins
const twig = require('gulp-twig');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const options = require('gulp-options');
const gulpif = require('gulp-if');
const beautify = require('gulp-beautify');

// Browers related plugins
const browserSync = require('browser-sync').create();
const FINAL_URL_FOLDER = './dist/';

// Project related variables
const styleSRC = ['./src/scss/**.scss', '!./src/scss/**/_*.{scss,sass}'];
const styleURL = FINAL_URL_FOLDER + 'css/';
const mapURL = './';

const jsSRC = './src/js/';
const jsFront = 'app.js';
const jsMin = 'app.min.js';
const jsFiles = [jsFront];
const jsURL = FINAL_URL_FOLDER + 'js/';

const imgSRC = './src/images/**/*';
const imgURL = FINAL_URL_FOLDER + 'images/';

const fontsSRC = './src/fonts/**/*';
const fontsURL = FINAL_URL_FOLDER + 'fonts/';

const htmlSRC = ['./src/html/**/*.{twig,html}', '!./src/html/_*/**/*.{twig,html}'];
const htmlURL = FINAL_URL_FOLDER;

const styleWatch = './src/scss/**/*.scss';
const jsWatch = './src/js/**/*.js';
const imgWatch = './src/images/**/*.*';
const fontsWatch = './src/fonts/**/*.*';
const htmlWatch = './src/html/**/*.{twig,html}';

// Tasks
function browser_sync() {
    browserSync.init({
        server: {
            baseDir: FINAL_URL_FOLDER + ''
        }
    });
}

function reload(done) {
    browserSync.reload();
    done();
}

function css(done) {
    src(styleSRC, {allowEmpty: true})
        .pipe(sourcemaps.init())
        .pipe(sass({
            includePaths: ['node_modules'],
            errLogToConsole: true,
            outputStyle: 'compressed'
        }))
        .on('error', console.error.bind(console))
        .pipe(autoprefixer())
        .pipe(rename({ suffix: '.min' }))
        .pipe(sourcemaps.write(mapURL))
        .pipe(dest(styleURL))
        .pipe(browserSync.stream());
    done();
}

function js(done) {
    jsFiles.map(entry => {
        return browserify( { entries: [jsSRC+entry] } )
            .transform(babelify, { presets: ['@babel/preset-env'] })
            .bundle()
            .pipe(source(entry), {allowEmpty: true})
            .pipe(rename({ extname: '.min.js' }))
            .pipe(buffer())
            .pipe(gulpif(options.has('production'), stripDebug()))
            .pipe(sourcemaps.init({ loadMaps: true }))
            .pipe(gulpif(options.has('production'), uglify()))
            .pipe(sourcemaps.write('.'))
            .pipe(dest(jsURL))
            .pipe(browserSync.stream());
    });
    done();
}

function html(done) {
    src(htmlSRC)
        .pipe(twig())
        .pipe(beautify.html({ indent_size: 4 }))
        .pipe(dest(htmlURL));
    done();
}

function triggerPlumber(src_file, dest_file) {
    return src(src_file, {allowEmpty: true})
        .pipe(plumber())
        .pipe(dest(dest_file));
}

const images = () => triggerPlumber(imgSRC, imgURL);
const fonts = () => triggerPlumber(fontsSRC, fontsURL);

function watchFiles() {
    watch(styleWatch, series(css, reload));
    watch(jsWatch, series(js, reload));
    watch(imgWatch, series(images, reload));
    watch(fontsWatch, series(fonts, reload));
    watch(htmlWatch, series(html, reload));
    src(jsURL + jsMin, {allowEmpty: true})
        .pipe(notify({ message: 'Gulp is Watching your Whisky 🥃, Happy Coding!' }));
}

task("css", css);
task("js", js);
task("images", images);
task("fonts", fonts);
task("html", html);
task("default", parallel(css, js, images, fonts, html));
task("watch", parallel(browser_sync, watchFiles));