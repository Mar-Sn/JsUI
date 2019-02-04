const gulp = require('gulp');
const ts = require('gulp-typescript');
const minify = require('gulp-minify');
const tsProject = ts.createProject('tsconfig.json');
const uglify = require('gulp-uglify');
const pump = require('pump');
const rename = require("gulp-rename");
const connect = require('gulp-connect');
const sourcemaps = require('gulp-sourcemaps');
const del = require('del');
const sass = require('gulp-sass');

sass.compiler = require('node-sass');


gulp.task('clean', function (done) {
    return del(['target/*']);
});

gulp.task('copy-source', function (done) {
    return gulp.src("src/**/*.ts")
        .pipe(gulp.dest('target'));
});

gulp.task('copy-sass', function (done) {
    return gulp.src("css/*.scss")
        .pipe(gulp.dest('target/css/'));
});

gulp.task('compile-sass', function (done) {
    return gulp.src('target/**/*.scss')
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(gulp.dest('target/css/'));
});

gulp.task('copy-css', function (done) {
    return gulp.src("target/css/css/*.css")
        .pipe(gulp.dest('test/css/'));
});

gulp.task('scripts', function (done) {

    return gulp.src("target/**/*.ts") // or tsProject.src()
        .pipe(sourcemaps.init())
        .pipe(tsProject()).js
        .pipe(sourcemaps.write({includeContent: false}))
        .pipe(gulp.dest('target'));
});

gulp.task('scripts-test', function (done) {

    return gulp.src("test/test.ts") // or tsProject.src()
        .pipe(sourcemaps.init())
        .pipe(ts({noImplicitAny: true, module: "umd"})).js
        .pipe(sourcemaps.write({includeContent: false}))
        .pipe(gulp.dest('test'));
});


gulp.task('dep-table-dragger', function (done) {
    return gulp.src("node_modules/table-dragger/dist/**/*.js") // or tsProject.src()
        .pipe(gulp.dest('target/libs/table-dragger/'));
});

gulp.task('dep-moment-timezone', function (done) {
    return gulp.src("node_modules/moment-timezone/builds/moment-timezone.min.js")
        .pipe(gulp.dest('target/libs/moment-timezone/'));
});

gulp.task('dep-flatpickr', function (done) {
    return gulp.src("node_modules/flatpickr/dist/flatpickr.min.js")
        .pipe(gulp.dest('target/libs/flatpickr/'));
});

gulp.task('dep-trumbowyg-js', function (done) {
    return gulp.src("node_modules/trumbowyg/**/*.js")
        .pipe(gulp.dest('target/libs/trumbowyg/'));
});

gulp.task('dep-trumbowyg-css', function (done) {
    return gulp.src("node_modules/trumbowyg/**/*.css")
        .pipe(gulp.dest('target/libs/trumbowyg/'));
});

gulp.task('dep-trumbowyg-svg', function (done) {
    return gulp.src("node_modules/trumbowyg/**/*.svg")
        .pipe(gulp.dest('target/libs/trumbowyg/'));
});

gulp.task('dependencies', gulp.parallel(['dep-table-dragger', 'dep-moment-timezone', 'dep-flatpickr', 'dep-trumbowyg-js', 'dep-trumbowyg-css', 'dep-trumbowyg-svg']));


gulp.task('move-js-to-test', function () {
    return gulp.src("target/**/*.js")
        .pipe(gulp.dest('test/lib'));
});

gulp.task('move-css-to-test', function () {
    return gulp.src("target/**/*.css")
        .pipe(gulp.dest('test/lib'));
});

gulp.task('move-ts-to-test', function () {
    return gulp.src("target/**/*.ts")
        .pipe(gulp.dest('test/lib'));
});

gulp.task('move-svg-to-test', function () {
    return gulp.src("target/**/*.svg")
        .pipe(gulp.dest('test/lib'));
});


gulp.task('move-libs-to-test', function () {
    return gulp.src("target/libs")
        .pipe(gulp.dest('test/lib'));
});


gulp.task('to-test', gulp.parallel(['move-js-to-test', 'move-ts-to-test', 'move-libs-to-test', 'move-css-to-test', 'move-svg-to-test']));

gulp.task('ugly', function (cb) {
    return pump([
            gulp.src('target/*.js'),
            uglify(),
            rename({suffix: '.min'}),
            gulp.dest('target')
        ],
        cb
    );
});

gulp.task('dist', function (cb) {
    gulp.src("target/*.min.js")
        .pipe(gulp.dest('dist'));
    cb();
});

gulp.task('connect', function () {
    connect.server({
        root: './test/',
        livereload: true
    })
});


gulp.task('build', gulp.parallel(
    [gulp.series(['clean', 'copy-source', 'scripts', 'ugly', 'dependencies', 'to-test', 'scripts-test'])])
);

gulp.task('watch-scss', function () {
    gulp.watch('css/**/*.scss', gulp.series(['copy-sass', 'compile-sass', 'copy-css']));
});

gulp.task('watch', function () {
    gulp.watch('src/**/*.ts', gulp.series('build'));
    gulp.watch('test/test.ts', gulp.series('build'));
    gulp.watch('test/index.html', gulp.series('build'));
});

gulp.task('server', gulp.parallel(['connect', 'watch', 'watch-scss']));