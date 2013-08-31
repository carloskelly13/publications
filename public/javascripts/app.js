
/**
 * Publications JS App
 * Config Module
 * Michael Kelly and Carlos Paelinck
 */

requirejs.config({
  paths: {
    jquery: 'components/jquery/jquery',
    amplify: 'components/amplify/lib/amplify',
    underscore: 'components/lodash/dist/lodash.underscore',
    backbone: 'components/backbone/backbone',
    text: 'components/requirejs-text/text',
    d3: 'components/d3/d3',
    nprogress: 'components/nprogress/nprogress',
    dropdown: 'components/bootstrap/js/dropdown',
    tooltip: 'components/bootstrap/js/tooltip'
  },
  shim: {
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
    },
    d3: {
      exports: 'd3'
    },
    nprogress: {
      deps: ['jquery'],
      exports: 'NProgress'
    },
    dropdown: {
      exports: 'dropdown'
    },
    tooltip: {
      exports: 'tooltip'
    }
  }
});

requirejs(['router']);