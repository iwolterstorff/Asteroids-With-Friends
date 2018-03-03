const gulp = require('gulp');

const plugins = require('gulp-load-plugins')();
// don't think the plugin loader works with hyphenated plugin names... :(
const fileCache = require('gulp-file-cache');

let cache = new fileCache();

// running 'gulp' with no options defaults to running application
gulp.task('default', ['run']);

gulp.task('lint', () => {
    return gulp.src(['**/*.js', '!node_modules/**/*.js', '!dist/**/*.js', '!src/client/lib/**/*.js'])
        .pipe(plugins.jshint({
            esversion: 6
        }))
        .pipe(plugins.jshint.reporter('jshint-stylish'));

        // Uncomment this and remove semicolon above to have JSHint fail when warnings are unresolved
        // .pipe(plugins.jshint.reporter('fail'));
});

gulp.task('build', ['build-client', 'build-server', 'test', 'todo']);

gulp.task('build-server', () => {
    return gulp.src(['src/server/**/*.*'])
        .pipe(cache.filter())
        .pipe(gulp.dest('dist/server'));
});

gulp.task('build-client', ['move-client-assets'], () => {
    return gulp.src(['src/client/**/*.js', '!src/client/lib/**/*.*'])
        .pipe(cache.filter())
        .pipe(plugins.babel({
            presets: ['env']
        }))
        .pipe(cache.cache())
        .pipe(gulp.dest('./dist/client'));
});

gulp.task('move-client-assets', () => {
    return gulp.src(['src/client/**/*.*', '!src/client/*.js'])
        .pipe(gulp.dest('./dist/client'));
});

// TODO: Add some kind of testing framework
gulp.task('test', ['lint']);

gulp.task('run', ['build'], () => {
    plugins.nodemon({
        script: './dist/server/server.js',
        watch:'src',
        ext: 'html js css',
        tasks: ['build-client', 'build-server']
    });
});

gulp.task('todo', () => {
    gulp.src(['**/*.js', '!node_modules/**/*.js', '!dist/**/*.js', '!src/client/lib/**/*.js'])
        .pipe(plugins.todo())
        .pipe(gulp.dest('./'));
});