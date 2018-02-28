const gulp = require('gulp');

const plugins = require('gulp-load-plugins')();

gulp.task('default', () => {
    // Default task code goes here
});

gulp.task('lint', () => {
    return gulp.src(['**/*.js', '!node_modules/**/*.js', '!bin/**/*.js', '!src/client/lib/**/*.js'])
        .pipe(plugins.jshint({
            esversion: 6
        }))
        .pipe(plugins.jshint.reporter('jshint-stylish'));

        // Uncomment this and remove semicolon above to have JSLint fail when warnings are unresolved
        // .pipe(plugins.jshint.reporter('fail'));
});

gulp.task('run', ['lint'], () => {
    plugins.nodemon({
        delay: 10,
        script: './server/server.js',
        ext: 'html js css'
    })
        .on('restart', () => {
            plugins.util.log('server restarted');
        });
});

gulp.task('todo', () => {
    gulp.src('**/*.js')
        .pipe(plugins.todo())
        .pipe(gulp.dest('./'));
});