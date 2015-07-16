var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var debug = require('gulp-debug');
var tsc = require('gulp-typescript');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var ngAnnotate = require('gulp-ng-annotate');
var sass = require('gulp-sass');
var del = require('del');
//var es = require('event-stream');
//var bowerFiles = require('main-bower-files');
//var print = require('gulp-print');
//var Q = require('q');
var tscProject = tsc.createProject('tsconfig.json', { typescript: require('typescript') });

var path = {
	tscripts: './app/**/*.ts',
	scripts: './app/components/**/*.js',
	styles: ['app/styles/*.scss'],
	index: 'app/index.html',
	partials: ['app/components/**/*.html', '!app/index.html'],
	tsdist: 'app',
	dist: 'dist'
};

gulp.task('tsc', function () {
	return gulp.src(path.tscripts)
		.pipe($.sourcemaps.init())
		.pipe(tsc(tscProject))
		.pipe($.sourcemaps.write('.'))
		.pipe(gulp.dest(path.tsdist));
});

//tsc needs to be completed before browserify
//https://github.com/gulpjs/gulp/issues/96#issuecomment-33512519
gulp.task('browserify', ['tsc'], function () {
	return browserify({ entries: './app/app.js', debug: true })
		.bundle()
		.pipe(source('app.js'))
		.pipe(ngAnnotate())
		.pipe(gulp.dest(path.dist + '/scripts'));
});

gulp.task('sass', function () {
	gulp.src(path.styles)
		.pipe($.sourcemaps.init())
		.pipe(sass())
		.pipe($.sourcemaps.write('.'))
		.pipe(gulp.dest(path.dist + '/css'));
});

gulp.task('html', function () {
	//Copy the partial html files to dist
	gulp.src(path.partials)
		.pipe(gulp.dest(path.dist + '/views'));
});

gulp.task('inject', ['browserify', 'sass', 'html'], function () {
	//Copy index.html to dist and inject css/js
	gulp.src(path.index)
		.pipe(gulp.dest(path.dist))
		.pipe($.inject(gulp.src([path.dist + '/css/*.css', path.dist + '/scripts/*.js']), { relative: true }))
		.pipe(gulp.dest(path.dist));
});


gulp.task('compile', ['tsc', 'browserify', 'sass', 'html', 'inject']);

gulp.task('watch', function () {
	gulp.watch(path.tscripts, ['browserify']);
	gulp.watch(path.styles, ['sass']);
});

gulp.task('clean', function () {
	del(path.scripts);
	del(path.dist);
});
