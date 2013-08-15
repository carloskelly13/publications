
/**
 * Publications JS App
 * Config Module
 * Michael Kelly and Carlos Paelinck
 */

requirejs.config({
  paths: {
    jquery: 'components/jquery/jquery',
    jqueryUI: 'components/jquery-ui/ui/jquery-ui',
    amplify: 'components/amplify/lib/amplify',
    underscore: 'components/lodash/dist/lodash.underscore',
    backbone: 'components/backbone/backbone',
    text: 'components/requirejs-text/text'
  },
  shim: {
    jqueryUI : {
      deps: ['jquery'],
      exports: '$'
    },
    amplify: {
      deps: ['jquery'],
      exports: 'amplify'
    },
    underscore: {
      exports: '_'
    },
    backbone: {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    }
  }
});

requirejs(['router']);