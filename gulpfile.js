const gulp = require('gulp');
const ts = require('gulp-typescript');
const minify = require('gulp-minify');
const tsProject = ts.createProject('tsconfig.json');
const uglify = require('gulp-uglify');
const pump = require('pump');
const rename = require("gulp-rename");
const connect = require('gulp-connect');


gulp.task('scripts', function(done) {
    gulp.src("src/**/*.ts") // or tsProject.src()
        .pipe(tsProject())
        .pipe(gulp.dest('target'));

    gulp.src("target/*.js")
        .pipe(gulp.dest('test/lib'));

    done();
});

gulp.task('ugly', function (cb) {
    pump([
            gulp.src('target/*.js'),
            uglify(),
            rename({ suffix: '.min' }),
            gulp.dest('dist')
        ],
        cb
    );
});

gulp.task('connect', function() {
    connect.server({
        root: './test/',
        livereload: true
    })
});


gulp.task('watch', function() {
    gulp.watch('src/**/*.ts', gulp.series('scripts'));
    gulp.watch('src/**/*.ts', gulp.series('ugly'));
});


gulp.task('default', gulp.series(['scripts', 'ugly']));
gulp.task('server', gulp.parallel(['connect', 'watch']));