
/**
 * Publications JS App
 * User Module
 * Michael Kelly and Carlos Paelinck
 */

define(function(require) {
    var _ = require('underscore'),
        $ = require('jquery'),
        amplify = require('amplify'),
        ui = require('ui'),
        Backbone = require('backbone'),
        appModule = require('app-module');

    var User = appModule.module();

    User.Model = Backbone.Model.extend({
        urlRoot: '/user',
        idAttribute: '_id'
    });

    return User;
});