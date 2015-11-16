module.exports = function (file) {
  var coverageReport = file.coverage;
  coverageReport = coverageReport.replace(/=*/g, '');
  var statements = /(Statements)\s*\:\s*(\d*\.\d*\%)/.exec(coverageReport);
  var branches = /(Branches)\s*\:\s*(\d*\.\d*\%)/.exec(coverageReport);
  var functions = /(Functions)\s*\:\s*(\d*\.\d*\%)/.exec(coverageReport);
  var lines = /(Lines)\s*\:\s*(\d*\.\d*\%)/.exec(coverageReport);
  statements = {
    title: 'statements: ' + statements[2]
  };
  branches = {
    title: 'branches: ' + branches[2]
  };
  functions = {
    title: 'functions: ' + functions[2]
  };
  lines = {
    title: 'lines: ' + lines[2]
  };
  return [statements, branches, functions, lines];
};
