var gulp = require('gulp');
var todo = require('gulp-todo');
var jshint = require('gulp-jshint');

gulp.task('default', () => {
    // Default task code goes here
});

gulp.task('lint', () => {
    return gulp.src(['**/*.js', '!node_modules/**/*.js', '!bin/**/*.js'])
        .pipe(jshint({
            esversion: 6
        }))
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'));
});

gulp.task('todo', () => {
    gulp.src('**/*.js')
        .pipe(todo())
        .pipe(gulp.dest('./'));
});