
/**
 * Publications JS App
 * User Module
 * Michael Kelly and Carlos Paelinck
 */

define(function(require) {
    var _ = require('underscore'),
        $ = require('jquery'),
        amplify = require('amplify'),
        Backbone = require('backbone'),
        appModule = require('app-module');

    var User = appModule.module();

    User.Model = Backbone.Model.extend({
        url: '/user',
        idAttribute: '_id'
    });

    User.Views.SignInForm = Backbone.View.extend({
        tagName: 'div',
        className: 'sign-in-form',
        template: _.template(require('text!../templates/user-sign-in-form.html')),

        render: function() {
            var view = this;
            view.$el.html(view.template());
            return view;
        }
    });

    User.Views.SignOutButton = Backbone.View.extend({
        tagName: 'button',
        className: '',
        id: 'sign-out-button',


        render: function() {
            var button = this;
            button.$el.attr('type', 'button');
            button.$el.html('Sign Out');
            return button;
        }
    });

    return User;
});