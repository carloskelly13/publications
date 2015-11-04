module.exports = function(config) {
  config.set({

    basePath: './app/js/',

    frameworks: ['mocha', 'browserify'],

    files: [
      '../../node_modules/chai/chai.js',
      '../../node_modules/sinon/pkg/sinon.js',
      '../../node_modules/sinon-chai/lib/sinon-chai.js',
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
