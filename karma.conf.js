module.exports = function (config) {
    var vendors = [
        'app/bower_components/angular/angular.js',
        'app/bower_components/angular-route/angular-route.js',
        'app/bower_components/angular-mocks/angular-mocks.js',
        'app/bower_components/angular-bootstrap/ui-bootstrap.js',
        'app/bower_components/angular-bootstrap/ui-bootstrap-tpls.js'
    ];

    var source = [
        'app/components/**/appPourFlower.js',
        'app/components/**/appRoutes.js',
        'app/components/**/common.js',
        'app/components/**/dateManipulation.js',
        'app/components/**/modal.js',

        'app/components/**/!(*.spec).js',
        'app/components/**/*.spec.js'
    ];

    config.set({

        basePath: '',

        files: [].concat(vendors, source),

        autoWatch: true,

        frameworks: ['jasmine'],

        browsers: ['Chrome'],

        reporters: ['dots', 'coverage'],

        // 'karma-firefox-launcher',
        plugins: [
            'karma-chrome-launcher',
            'karma-jasmine',
            'karma-coverage'
        ],

        junitReporter: {
            outputFile: 'test_out/unit.xml',
            suite: 'unit'
        },

        preprocessors: {
            'app/components/**/!(*.spec).js': ['coverage']
        },

        // optionally, configure the reporter
        coverageReporter: {
            type : 'lcov',
            dir : 'coverage/'
        }
    });
};
