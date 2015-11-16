module.exports = function (file) {
  var platoReport = file.platoReport;
  var sloc = {
    title: 'sloc: ' + platoReport.sloc,
    description: 'SLOC'
  };
  var jshint = {
    title: 'jshint: ' + platoReport.jshint,
    description: 'jshint'
  };
  var maintainability = {
    title: 'maintainability: ' + platoReport.maintainability,
    description: 'maintainability index'
  };
  return [sloc, jshint, maintainability];
};
