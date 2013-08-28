
/**
 * Publications JS App
 * Publications Module
 * Michael Kelly and Carlos Paelinck
 */

define(function(require) {
    var _ = require('underscore'),
        $ = require('jquery'),
        amplify = require('amplify'),
        ui = require('ui'),
        Backbone = require('backbone'),
        NProgress = require('nprogress'),
        appModule = require('app-module');

    var Pub = appModule.module(),
        Modal = require('modal'),
        User = require('user'),
        Document = require('document');

    Pub.Views.Index = Backbone.View.extend({
        tagName: 'div',
        className: 'pub-index',
        template: _.template(require('text!../templates/pub-index.html')),

        events: {
            'click #sign-in-btn' : 'signInButtonClicked',
            'click #sign-out-btn' : 'signOutButtonClicked',
            'click #create-account-modal-btn' : 'createAccountModalButtonClicked',
            'click #new-doc-btn' : 'newDocumentButtonClicked'
        },

        signInButtonClicked: function() {
            var view = this,
                landingPage = view.subviews.landingPage,
                signInForm = view.$('.sign-in-form');

            amplify.request({
                resourceId: 'app#sign-in',
                data: {
                    username: $('#sign-in-name').val(),
                    password: $('#sign-in-password').val()
                },
                success: function(data) {
                    NProgress.start();
                    window.localStorage.publicationsUserId = data._id;
                    ui.fadeOut(landingPage.$el, function() {
                        NProgress.done();
                        landingPage.remove();
                        view.userDidAuthenticate(new User.Model(data));
                        $('#sign-in-name').val('');
                        $('#sign-in-password').val('');
                    });
                },
                error: function() {
                    ui.shakeAnimation(signInForm);
                    $('#sign-in-password').val('');
                }
            });
        },

        signOutButtonClicked: function() {
            var view = this,
                landingPage = view.subviews.landingPage,
                documentLibrary = view.subviews.documentLibrary;

            NProgress.start();
            amplify.request('app#sign-out', {}, function(data) {
                view.$el.append(landingPage.render().el);
                window.localStorage.publicationsUserId = null;

                ui.fadeOut(view.authNavbarControls, function() {
                    ui.fadeIn(view.unauthNavbarControls);
                });

                ui.fadeOut(documentLibrary.$el, function() {
                    ui.fadeIn(landingPage.$el);
                    documentLibrary.remove();
                    NProgress.done();
                });
            });
        },

        createAccountModalButtonClicked: function() {
            new Modal.Views.CreateAccount().render();
        },

        newDocumentButtonClicked: function() {
            var view = this;
            view.subviews.documentLibrary.createNewDocument();
        },

        initialize: function() {
            var view = this;
            view.subviews = {};
            view.subviews.landingPage = new Pub.Views.LandingPage();
            $('body').append(view.el);
        },

        userDidAuthenticate: function(model) {
            var view = this,
                documentLibrary = new Document.Views.Library({ model: model });

            view.$el.append(documentLibrary.render().el);
            view.subviews.documentLibrary = documentLibrary;

            ui.fadeOut(view.unauthNavbarControls, function() {
                ui.fadeIn(view.authNavbarControls);
                documentLibrary.$('.source-list').css({ left: '0' });
            });
        },

        showLandingPage: function() {
            var view = this;
            window.localStorage.publicationsUserId = null;
            view.$el.append(view.subviews.landingPage.render().el);
            ui.fadeIn(view.unauthNavbarControls);
        },

        render: function() {
            var view = this;
            view.$el.html(view.template());
            view.authNavbarControls = view.$('.controls .auth');
            view.unauthNavbarControls = view.$('.controls .unauth');

            var userId = window.localStorage.publicationsUserId;

            if (userId) {
                var userModel = new User.Model({ _id: userId });
                view.listenToOnce(userModel, 'sync', view.userDidAuthenticate);
                userModel.fetch({
                    error: function() {
                        view.showLandingPage();
                    }
                });
            } else
                view.showLandingPage();

            return view;
        }
    });

    Pub.Views.LandingPage = Backbone.View.extend({
        tagName: 'div',
        className: 'landing-page',
        template: _.template(require('text!../templates/pub-landing-page.html')),

        render: function() {
            var view = this;
            view.$el.html(view.template());
            return view;
        }
    });

    return Pub;
});