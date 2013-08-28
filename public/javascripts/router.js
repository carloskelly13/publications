
/**
 * Publications JS App
 * Router Module
 * Michael Kelly and Carlos Paelinck
 */

define(function(require) {
    var _ = require('underscore'),
        $ = require('jquery'),
        Backbone = require('backbone'),
        appModule = require('app-module'),
        amplify = require('amplify'),
        requests = require('requests');

    var Pub = require('pub');

    var AppRouter = Backbone.Router.extend({
        routes: {
            '' : 'index',
        },

        index: function() {
            new Pub.Views.Index().render();
        }
    });

    var router = new AppRouter();
    Backbone.history.start();
});