
/**
 * Publications JS App
 * App Module
 * Michael Kelly and Carlos Paelinck
 */

define(function(require) {
    var _ = require('underscore'),
        Backbone = require('backbone'),
        AppModel = Backbone.Model.extend({});

    return {
        module: function(props) {
            return _.extend({ Views: {} }, Backbone.Events, props);
        },

        app: _.extend({ model: new AppModel() }, Backbone.Events)
    };
});