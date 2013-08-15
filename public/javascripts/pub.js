
/**
 * Publications JS App
 * Publications Module
 * Michael Kelly and Carlos Paelinck
 */

define(function(require) {
    var _ = require('underscore'),
        $ = require('jquery'),
        amplify = require('amplify'),
        Backbone = require('backbone'),
        appModule = require('app-module');

    var Pub = appModule.module(),
        User = require('user'),
        Document = require('document');

    Pub.Views.Index = Backbone.View.extend({
        tagName: 'div',
        className: 'pure-g-r',
        template: _.template(require('text!../templates/pub-index.html')),

        events: {
            'click #sign-in-button' : 'signInButtonClicked',
            'click #sign-out-button' : 'signOutButtonClicked'
        },

        signInButtonClicked: function() {
            var view = this,
                landingPage = view.subviews.landingPage;

            amplify.request('app#sign-in', {
                username: landingPage.$('.sign-in-form #name').val(),
                password: landingPage.$('.sign-in-form #password').val()
            }, function(data) {
                view.userDidAuthenticate(data);
                landingPage.remove();
            });
        },

        signOutButtonClicked: function() {
            var view = this,
                landingPage = view.subviews.landingPage,
                documentLibrary = view.subviews.documentLibrary;

            amplify.request('app#sign-out', {}, function(data) {
                view.$el.append(landingPage.render().el);
                documentLibrary.remove();
            });
        },

        initialize: function() {
            var view = this;
            view.subviews = {};

            view.subviews.landingPage = new Pub.Views.LandingPage();

            amplify.request({
                resourceId: 'app#user',
                success: function(data) {
                    view.userDidAuthenticate(data);
                },
                error: function(xhr) {
                    if (xhr.status === 401) {
                        view.$el.append(view.subviews.landingPage.render().el);
                    }
                }
            });

            $('body').append(view.el);
        },

        userDidAuthenticate: function(data) {
            var view = this,
                userModel = new User.Model(data),
                documentLibrary = new Document.Views.Library({
                    collection: new Document.Collection()
                });

            documentLibrary.listenTo(documentLibrary.collection, 'add', documentLibrary.addDocument);
            documentLibrary.collection.fetch();

            view.$el.append(documentLibrary.render().el);
            view.subviews.documentLibrary = documentLibrary;
        },

        render: function() {
            var view = this;
            view.$el.html(view.template());
            return view;
        }
    });

    Pub.Views.LandingPage = Backbone.View.extend({
        tagName: 'div',
        className: 'pure-u-1',
        template: _.template(require('text!../templates/pub-landing-page.html')),

        render: function() {
            var view = this;
            view.$el.html(view.template());
            view.$('#sign-in-form-container').html(new User.Views.SignInForm().render().el);
            return view;
        }
    });

    return Pub;
});