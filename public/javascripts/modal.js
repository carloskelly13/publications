
/**
 * Publications JS App
 * Modal Module
 * Michael Kelly and Carlos Paelinck
 */

define(function(require) {
    var _ = require('underscore'),
        $ = require('jquery'),
        amplify = require('amplify'),
        Backbone = require('backbone'),
        ui = require('ui'),
        appModule = require('app-module');

    var Modal = appModule.module(),
        User = require('user');

    Modal.Model = Backbone.Model.extend();

    Modal.Views.Cover = Backbone.View.extend({
        className: 'modal-cover',
        tagName: 'div'
    });

    Modal.Views.Base = Backbone.View.extend({
        className: 'modal-view fadeInGrowAnimation',
        tagName: 'div',

        close: function() {
            var view = this;

            $('.pub-index').removeClass('modal-active');
            ui.fadeOut(view.modalCover.$el);
            ui.fadeOutGrowAnimation(view.$el, function() {
                view.remove();
                view.modalCover.remove();
                view.modalWillClose();

            });
        },

        modalDidShow: function() {},

        modalWillClose: function() {},

        render: function() {
            var view = this,
                modalContainer = $('.modal-container'),
                modalCover = new Modal.Views.Cover();

            modalContainer.append(modalCover.render().el);
            modalContainer.append(this.el);
            ui.fadeIn(modalCover.$el);
            $('.pub-index').addClass('modal-active');

            view.modalContainer = modalContainer;
            view.modalCover = modalCover;
            view.modalDidShow();
            view.$el.center();
            return view;
        }
    });

    Modal.Views.CreateAccount = Modal.Views.Base.extend({
        id: 'modal-create-account',
        template: _.template(require('text!../templates/modal-create-account.html')),

        events: {
            'click #close-button' : 'close',
            'click #create-account-button' : 'createAccountButtonClicked'
        },

        userModelDidSync: function(model) {
            var view = this,
                email = $('#create-account-email'),
                password = $('#create-account-password'),
                passwordConfirm = $('#create-account-password-confirm');

            if (_.contains(model.attributes, 'MongoError')) {
                view.$el.removeClass('fadeInGrowAnimation');
                ui.shakeAnimation(view.$el);

                if (model.attributes.code === 11000) {
                    email.addClass('invalid');
                    email.val('');
                    password.val('');
                    passwordConfirm.val('');
                    email.attr('placeholder', 'An account with this email exists.');
                } else {
                    email.addClass('invalid');
                    password.addClass('invalid');
                    passwordConfirm.addClass('invalid');
                    email.val('');
                    password.val('');
                    passwordConfirm.val('');
                }
            } else {
                view.close();
                setTimeout(function() { new Modal.Views.AccountCreated().render(); }, 250);
            }
        },

        createAccountButtonClicked: function() {
            var view = this,
                email = $('#create-account-email'),
                password = $('#create-account-password'),
                passwordConfirm = $('#create-account-password-confirm'),
                shouldCreateAccount = true;

            var emailRegExp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                passwordRegExp = /^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*\d).*$/;

            if (emailRegExp.test(email.val()))
                email.removeClass('invalid');
            else {
                email.addClass('invalid');
                shouldCreateAccount = false;
            }
            if (passwordRegExp.test(password.val()))
                password.removeClass('invalid');
            else {
                password.addClass('invalid');
                shouldCreateAccount = false;
            }
            if (password.val() == passwordConfirm.val() && passwordRegExp.test(passwordConfirm.val()))
                passwordConfirm.removeClass('invalid');
            else {
                passwordConfirm.addClass('invalid');
                shouldCreateAccount = false;
            }

            if (shouldCreateAccount) {
                var newUser = new User.Model({
                    name: email.val(),
                    password: password.val(),
                });

                view.listenToOnce(newUser, 'sync', view.userModelDidSync);
                newUser.save();
            } else {
                view.$el.removeClass('fadeInGrowAnimation');
                ui.shakeAnimation(view.$el);
            }
        },

        modalDidShow: function() {
            var view = this;
            view.$el.append(view.template());
            return view;
        }
    });

    Modal.Views.AccountCreated = Modal.Views.Base.extend({
        id: 'modal-account-created',
        template: _.template(require('text!../templates/modal-account-created.html')),

        events: {
            'click #close-button' : 'close'
        },

        modalDidShow: function() {
            var view = this;
            view.$el.append(view.template());
            return view;
        }
    });

    Modal.Views.YesNo = Modal.Views.Base.extend({
        id: 'modal-yes-no',
        template: _.template(require('text!../templates/modal-yes-no.html')),

        events: {
            'click #yes-button' : 'yesButtonClicked',
            'click #no-button' : 'noButtonClicked'
        },

        yesButtonClicked: function() {
            var view = this;
            if (_.isFunction(view.options.yesFunction))
                view.options.yesFunction(view);
            view.close();
        },

        noButtonClicked: function() {
            var view = this;
            if (_.isFunction(view.options.noFunction))
                view.options.noFunction(view);
            view.close();
        },

        modalDidShow: function() {
            var view = this;
            view.$el.append(view.template(view.model.toJSON()));
            return view;
        }
    });

    Modal.Views.About = Modal.Views.Base.extend({
        id: 'modal-about',
        template: _.template(require('text!../templates/modal-about.html')),

        events: {
            'click #close-button' : 'close'
        },

        modalDidShow: function() {
            var view = this;
            view.$el.append(view.template());
            return view;
        }
    });

    return Modal;
});