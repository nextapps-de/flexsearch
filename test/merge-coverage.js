const libCoverage = require('istanbul-lib-coverage');
const { createReporter } = require('istanbul-api');

const coverage_1 = require('./.nyc_output/coverage.json');
const coverage_2 = require('./.nyc_output/coverage2.json');

const normalizeJestCoverage = (obj) => {
  const result = obj;
  Object.entries(result).forEach(([k, v]) => {
    if (v.data) result[k] = v.data;
  });
  return result;
};

const map = libCoverage.createCoverageMap();
map.merge(normalizeJestCoverage(coverage_1));
map.merge(normalizeJestCoverage(coverage_2));

const reporter = createReporter();
reporter.addAll(['html', 'json', 'lcov', 'text']);
reporter.write(map);
