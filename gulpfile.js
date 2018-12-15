const gulp = require('gulp');
const ts = require('gulp-typescript');
const minify = require('gulp-minify');
const tsProject = ts.createProject('tsconfig.json');
const uglify = require('gulp-uglify');
const pump = require('pump');
const rename = require("gulp-rename");

gulp.task('scripts', function() {
    gulp.src("src/**/*.ts") // or tsProject.src()
        .pipe(tsProject())
        .pipe(gulp.dest('target'));

    gulp.src("target/*.js")
        .pipe(gulp.dest('test/lib'));

    return true;
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