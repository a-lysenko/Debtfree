var gulp = require('gulp');
var reporter = require('reporter');
var ga = require('gulp-analyzer');
var todo = require('gulp-todo');
var jshint = require('gulp-jshint');

gulp.task('rep', function() {
	ga({
		src: ['app/components/**/*.js', 'app/components/**/!(*.spec).js'],
		url: 'http://localhost:9000/api/external/add-debts'
	});
});

gulp.task('err', function() {
	gulp.src(['app/components/**/*.js', 'app/components/**/!(*.spec).js']).
		pipe(jshint()).
		pipe(jshint.reporter('fail')).
		on('error', onError);
});

// Convenience handler for error-level errors.
function onError(error) {
	console.log('ERROR!!!');
	handleError.call(this, error);
}

// Handle an error based on its severity level.
// Log all levels, and exit the process for fatal levels.
function handleError(error) {
	console.log('handleError');
	reporter({
		url: 'http://localhost:9000/api/external/add-debt',
		message: error.message,
		tags: ['fail']
	}).fail();
}
