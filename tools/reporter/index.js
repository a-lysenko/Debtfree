var DEBUG = true;

var PLUGIN_NAME = 'reporter',
  url = '',
  message = '',
  description = '',
  tags = [];

var through = require('through2'),
  request = require('request');

var formatters = ['todo', 'plato', 'coverage'];
var sizes = {
  todo: 'L',
  plato: 'M',
  coverage: 'M'
};

function ModuleError(message) {
  this.name = PLUGIN_NAME + '_error';
  this.message = message || 'Something went wrong...';
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

function post(url, data) {
  log('running request.post');
  console.log('data before sending: ', data);
  request.post(url, {form: {data: JSON.stringify(data)}}, function (err, httpResponse, body) {
    if (err) {
      return console.error('upload failed:', err);
    }
    console.log('Upload successful!  Server responded with:', body);
  });
}

function checkFormatter(formatter) {
  log('checking formatter...', formatter);
  return formatters.indexOf(formatter) > -1;
}

function prepareData(file, config) {
  log('running prepareData');
  if (checkFormatter(config.formatter)) {
    log('formatter checked');
    var formatterModule = require('./formatters/' + config.formatter + '-formatter');
    var formatted = formatterModule(file);
    log('formatted', formatted);
  }
  return {
    title: config.formatter + ' debt',
    key: config.formatter,
    message: config.message,
    description: config.description,
    items: formatted,
    tags: config.tags,
    size: config.size || getSize(config.formatter)
  };
}

function getSize(formatter) {
  return sizes[formatter];
}

function postRequest(config) {
  log('post');
  return through.obj(function (file, enc, transformDone) {
    log('through.obj inside post');
    if (file.isNull()) {
      return transformDone(null, file);
    } else if (file.isStream()) {
      throw new ModuleError('Streams not supported');
    } else if (file.isBuffer()) {
      var debt = prepareData(file, config);
      file.debt = debt;
      if (file.debts && file.debts instanceof Array) {
        file.debts.push(debt)
      } else {
        file.debts = [debt];
      }
      if (config.isDelayed) {
        log('delayed, skipping post');
      } else {
        post(config.url, file.debts);
        file.debts = [];
      }
      transformDone(null, file);
    }
  });
}

module.exports = function (conf) {
  if (!conf.url) {
    throw new ModuleError('url should be defined');
  }
  var config = JSON.parse(JSON.stringify(conf));
  return {
    fail: function () {
      post(config.url, {
        key: 'fail',
        title: 'Build fail',
        message: config.message,
        tags: config.tags,
        buildFail: true
      });
    },
    post: function () {
      config.type = 'info';
      return postRequest(config);
    },
    postAlert: function () {
      config.type = 'alert';
      return postRequest(config);
    },
    postDanger: function () {
      config.type = 'danger';
      return postRequest(config);
    },
    postDelayed: function () {
      config.isDelayed = true;
      return postRequest(config);
    }
  };
};
