

/**
 * Publications JS App
 * Document Module
 * Michael Kelly and Carlos Paelinck
 */

define(function(require) {
    var _ = require('underscore'),
        $ = require('jquery'),
        amplify = require('amplify'),
        Backbone = require('backbone'),
        appModule = require('app-module');

    var Document = appModule.module(),
        User = require('user'),
        Shape = require('shape');

    Document.Model = Backbone.Model.extend({
        url: '/document',
        idAttribute: '_id'
    });

    Document.Collection = Backbone.Collection.extend({
        url: '/documents',
        model: Document.Model,

        parse: function(response) {
            return response;
        }
    });

    Document.Views.Item = Backbone.View.extend({

    });

    Document.Views.Library = Backbone.View.extend({
        tagName: 'div',
        className: 'pure-u-1',
        template: _.template(require('text!../templates/document-library.html')),

        initialize: function() {
            var view = this;
            view.documents = [];
        },

        addDocument: function(model) {
            var view = this;

            var shapeCollection = new Shape.Collection([], { documentId: model.id }),
                documentView = new Document.Views.Item({ model: model, collection: shapeCollection });

            shapeCollection.fetch();
            view.documents.push(documentView);

            console.log(documentView);
        },

        render: function() {
            var view = this;
            view.$el.html(view.template());
            view.$el.append(new User.Views.SignOutButton().render().el);

            return view;
        }
    });

    return Document;
});