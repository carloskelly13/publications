
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
            'click #about-btn' : 'aboutButtonClicked',
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
                    window.localStorage.publicationsUserId = data._id;
                    landingPage.remove();
                    view.userDidAuthenticate(new User.Model(data));
                    $('#sign-in-name').val('');
                    $('#sign-in-password').val('');
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

            amplify.request('app#sign-out', {}, function(data) {
                window.localStorage.publicationsUserId = null;

                ui.fadeOut(view.authNavbarControls);
                ui.fadeOut(documentLibrary.$el, function() {
                    view.showLandingPage();
                    documentLibrary.remove();
                });
            });
        },

        aboutButtonClicked: function() {
            new Modal.Views.About().render();
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

            ui.fadeIn(view.authNavbarControls, function() {
                documentLibrary.$('.source-list').css({ left: '0' });
            });
        },

        showLandingPage: function() {
            var view = this;
            window.localStorage.publicationsUserId = null;
            view.$el.append(view.subviews.landingPage.render().el);
            window.document.title = 'Publications';
        },

        render: function() {
            var view = this;
            view.$el.html(view.template());
            view.authNavbarControls = view.$('.pub-nav');

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

        initialize: function() {
            _.bindAll(this);
        },

        render: function() {
            var view = this;
            view.$el.html(view.template());
            return view;
        }
    });

    return Pub;
});