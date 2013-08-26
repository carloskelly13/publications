
/**
 * Publications JS App
 * Document Context Module
 * Michael Kelly and Carlos Paelinck
 */

define(function(require) {
    var _ = require('underscore'),
        $ = require('jquery'),
        ui = require('ui'),
        NProgress = require('nprogress'),
        amplify = require('amplify'),
        Backbone = require('backbone');

    var DocumentContext = {};

    DocumentContext.Model = Backbone.Model.extend({
        defaults: {
            documentModel: null,
            listItem: null,
            contentView: null
        }
    });

    DocumentContext.Service = Backbone.View.extend({
        initialize: function() {
            var service = this;
            service.listenTo(service, 'update', service.updateContext);
            service.listenTo(service, 'clear', service.clearContext);
        },

        updateContext: function(sender) {
            var service = this,
                documentModel = service.model.get('documentModel'),
                contentView = service.model.get('contentView'),
                listItem = service.model.get('listItem');

            if (_.isObject(documentModel)) {
                if (documentModel === sender.documentModel) return;

                listItem.$el.removeClass('active');
                contentView.$el.addClass('fadeOutGrowAnimation');
                setTimeout(function() {
                    contentView.remove();
                    sender.superview.append(sender.contentView.render().el);
                    sender.contentView.createDocumentSVG().createShapes();
                }, 250);
            } else {
                sender.superview.append(sender.contentView.render().el);
                sender.contentView.createDocumentSVG().createShapes();
            }

            sender.listItem.$el.addClass('active');
            service.model.set({
                documentModel: sender.documentModel,
                listItem: sender.listItem,
                contentView: sender.contentView
            });
        },

        clearContext: function() {
            var service = this,
                contentView = service.model.get('contentView'),
                listItem = service.model.get('listItem');

            if (_.isObject(contentView)) {
                contentView.$el.addClass('fadeOutGrowAnimation');
                setTimeout(function() { contentView.remove(); }, 250);
                listItem.$el.removeClass('active');

                service.model.set({
                    documentModel: null,
                    listItem: null,
                    contentView: null
                });
            }
        }
    });

    return DocumentContext;
});