module.exports = function (config) {
  var modifyConfig = require(config.basePath + '/karma.conf.js');
  delete config.basePath;
  modifyConfig(config);
  config.coverageReporter = {
    type: 'text-summary',
    dir: '.temp/coverage',
    file: 'coverage-summary.tmp'
  };
  config.reporters.push('coverage');
  config.plugins.push('karma-coverage');
  config.preprocessors = {
    '**/!(*.spec).js': ['coverage']
  };
  config.set(config);
};
