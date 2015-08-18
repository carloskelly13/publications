module.exports = function(config) {
  config.set({

    basePath: './js/src',

    frameworks: ['mocha', 'browserify'],

    files: [
      '../../node_modules/chai/chai.js',
      '../../config/test.globals.js',
      '**/*.spec.js'
    ],

    preprocessors: {
     '**/*.spec.js': ['browserify']
   },


   browserify: {
     debug: true,
     transform: [ 'babelify', 'reactify' ],
     plugin: ['proxyquire-universal'],
     extensions: ['.js', '.jsx']
   },

   colors: true,

   browsers: ['ChromeCanary'],

   singleRun: false
  });
};
