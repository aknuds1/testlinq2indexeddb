var tests = Object.keys(window.__karma__.files).filter(function (file) {
  return /Spec\.js$/.test(file);
});

requirejs.config({
    // Karma serves files from '/base'
    baseUrl: '/base/lib',

    paths: {
        'chai': '../node_modules/chai/chai',
        'linq2indexeddb': '../lib/Linq2IndexedDB',
        'jquery': '../lib/jquery-1.9.1',
        'underscore': '../node_modules/underscore/underscore',
        stacktrace: '../lib/stacktrace-0.4'
    },

    shim: {
        'linq2indexeddb': {
            deps: ['jquery'],
            exports: 'linq2indexedDB'
        },
        underscore: {
            exports: '_'
        },
        stacktrace: {
            exports: 'printStackTrace'
        }
    },
});

requirejs(tests, function () {
    window.__karma__.start();
}, function (error) {
    console.log("RequireJS error!");
    console.log(error.requireType);
    console.log(error.requireModules);
});