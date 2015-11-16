var through = require('through2'),
  vfs = require('vinyl-fs'),
  plato = require('plato'),
  processTodo = require('gulp-todo'),
  request = require('request'),
  reporter = require('reporter'),
  karma = require('karma').Server;

var platoReport = {
  sloc: '',
  jshint: '',
  maintainability: ''
};
var todos = [],
  config = {},
  url = '';

var PLUGIN_NAME = 'gulp-analyzer',
  PLUGIN_DEST = '.temp',
  DEBUG = false;

function ModuleError(message) {
  this.name = PLUGIN_NAME + '_error';
  this.message = message || 'Something went wrong';
}
ModuleError.prototype = Object.create(Error.prototype);
ModuleError.prototype.constructor = ModuleError;

function log(info, data) {
  if (DEBUG) {
    console.log(PLUGIN_NAME, info);
    if (data) {
      console.dir(data);
    }
  }
}

function runPlatoReport(callback) {
  log('running runPlatoReport');
  plato.inspect(config.src, config.dest + '/plato', {}, function (reports) {
    log('running getOverviewReport');
    var overview = plato.getOverviewReport(reports);
    if (overview && overview.summary && overview.summary.average) {
      platoReport.sloc = overview.summary.average.sloc;
      platoReport.jshint = overview.summary.average.jshint;
      platoReport.maintainability = overview.summary.average.maintainability;
      if (callback) {
        callback();
      }
    }
  });
}

function processPlatoReport() {
  log('running processPlatoReport');
  return through.obj(function (file, enc, transformDone) {
    if (file.isNull()) {
      transformDone(null, file);
    }

    if (file.isStream()) {
      this.emit('error', new ModuleError('Streams not supported!'));
    } else if (file.isBuffer()) {
      runPlatoReport(function () {
        log('running runPlatoReport callback');
        file.platoReport = platoReport;
        transformDone(null, file);
      });
    }
  });
}

function post(data) {
  log('running request.post');
  log('data before sending: ', data);
  request.post(url, {form: data}, function (err, httpResponse, body) {
    if (err) {
      return console.error('upload failed:', err);
    }
    console.log('Upload successful!  Server responded with:', body);
  });
}

function runKarma(cb) {
  log('running runKarma');
  new karma({
    basePath: process.cwd(),
    configFile: process.cwd() + '\\node_modules\\' + PLUGIN_NAME + '\\karma.conf.js',
    singleRun: true
  }, cb).start();
}

function processKarmaCoverage() {
  log('running processKarmaCoverage');
  return through.obj(function(file, encoding, transformDone) {
    runKarma(function() {
      log('running runKarma callback');
      vfs.src('.temp/coverage/**/coverage-summary.tmp')
        .pipe(through.obj(function(coverageFile, encoding, callback) {
          file.coverage = coverageFile.contents.toString();
          transformDone(null, file);
        }));
    });
  });
}

function run() {
  log('running run');
  vfs.src(config.src)
    .pipe(processTodo(config.todoSettings))
    .pipe(reporter({
      url: url,
      formatter: 'todo',
      message: 'TODO/FIXME analyzer report',
      description: '',
      tags: ['todo', 'fixme']
    }).postDelayed())
    .pipe(processPlatoReport())
    .pipe(reporter({
      url: url,
      formatter: 'plato',
      message: 'Plato analyzer report',
      description: '',
      tags: ['plato', 'maintainability', 'sloc', 'complexity']
    }).postDelayed())
    .pipe(processKarmaCoverage())
    .pipe(reporter({
      url: url,
      formatter: 'coverage',
      message: 'Coverage summary report',
      description: '',
      tags: ['coverage']
    }).postAlert())
    .on('error', function (error) {
      reporter({
        url: url,
        message: error.message,
        tags: ['fail']
      }).fail();
    });
  //.pipe(vfs.dest(config.dest));
}

module.exports = function (conf) {
  log('running exports ');
  config = conf;
  config.src = config.src ? config.src : [];
  config.dest = config.dest || PLUGIN_DEST;
  config.todoSettings = {
    fileName: 'todo_report.json',
    reporter: 'json'
  };
  if (!config.src.length) {
    this.emit('error', new ModuleError('file\'s source should be defined!'));
  }
  url = conf.url;
  if (!url.length) {
    this.emit('error', new ModuleError('url should be defined!'));
  }
  run();
};
