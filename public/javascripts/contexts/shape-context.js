
/**
 * Publications JS App
 * Shape Context Module
 * Michael Kelly and Carlos Paelinck
 */

define(function(require) {
    var _ = require('underscore'),
        $ = require('jquery'),
        ui = require('ui'),
        NProgress = require('nprogress'),
        amplify = require('amplify'),
        appModule = require('app-module'),
        Backbone = require('backbone');

    var ShapeContext = {};

    ShapeContext.Model = Backbone.Model.extend({
        defaults: {
            shape: null
        }
    });

    ShapeContext.Service = Backbone.View.extend({
        initialize: function() {
            var service = this;
            service.listenTo(service, 'update', service.updateContext);
            service.listenTo(service, 'clear', service.clearContext);
        },

        updateContext: function(sender) {
            var service = this;
                currentShape = service.model.get('shape');

            if (_.isEqual(currentShape, sender)) return;
            else if (currentShape) service.trigger('clear');

            sender.select();
            service.model.set({ shape: sender });
            appModule.inspector.shapeWasSelected(true);
        },

        clearContext: function() {
            var service = this,
                currentContext = service.model.get('shape');

            if (!currentContext) return;
            currentContext.deselect();
            service.model.set({ shape: null });
            appModule.inspector.shapeWasSelected(false);
        }
    });

    return ShapeContext;
});