
/**
 * Publications JS App
 * Shape Module
 * Michael Kelly and Carlos Paelinck
 */

define(function(require) {
    var _ = require('underscore'),
        $ = require('jquery'),
        amplify = require('amplify'),
        Backbone = require('backbone'),
        appModule = require('app-module');

    var Shape = appModule.module();

    Shape.Model = Backbone.Model.extend({
        url: '/shape',
        idAttribute: '_id'
    });

    Shape.Collection = Backbone.Collection.extend({
        model: Shape.Model,

        initialize: function(models, options) {
            this.documentId = options.documentId;
        },

        url: function() {
            return '/shapes/' + this.documentId;
        },

        parse: function(response) {
            return response;
        }
    });

    Shape.View = Backbone.View.extend({

    });

    return Shape;
});