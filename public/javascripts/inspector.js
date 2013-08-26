
/**
 * Publications JS App
 * Inspector Module
 * Michael Kelly and Carlos Paelinck
 */

define(function(require) {
    var _ = require('underscore'),
        $ = require('jquery'),
        amplify = require('amplify'),
        ui = require('ui'),
        NProgress = require('nprogress'),
        Backbone = require('backbone'),
        appModule = require('app-module'),
        d3 = require('d3');

    var Inspector = appModule.module(),
        Shape = require('shape');

    Inspector.Views.Main = Backbone.View.extend({
        tagName: 'div',
        className: 'inspector-main full-height-content',
        template: _.template(require('text!../templates/inspector-main.html')),

        initialize: function(event) {
            var view = this;
            view.clipboard = null;
            _.bindAll(this);
        },

        documentMetricsChanged: function(event) {
            var view = this,
                dataProperty = event.target.getAttribute('data-property'),
                value = parseFloat(event.target.value),
                documentModel = appModule.documentContext.model,
                offset = _.isEqual(dataProperty, 'width') ? 80.0 : 40.0;
            event.target.value = value.toFixed(2);

            var svg = d3.select('.document-svg'),
                svgFrame = d3.select('.document-svg-frame');
            svg.attr(dataProperty, (value * 72.0) + offset);
            svgFrame.attr(dataProperty, (value * 72.0));
            documentModel.get('documentModel').set(dataProperty, (value * 72.0));
            documentModel.get('contentView').drawDocumentFrameWithAxisAndGrid(true);
        },

        shapeMetricsChanged: function(event) {
            var view = this,
                dataProperty = event.target.getAttribute('data-property'),
                value = event.target.value,
                shape = appModule.shapeContext.model.get('shape');

            if (_.contains(['width', 'height'], dataProperty)) {
                value = parseFloat(value);
                if (value >= 0.125 && value <= 64.0) {
                    event.target.value = value.toFixed(2);
                    value *= 72.0;
                } else {
                    event.target.value = (shape.model.get(dataProperty) / 72.0).toFixed(2);
                    ui.shakeAnimation($(event.target));
                    return;
                }
            } else if (_.contains(['x', 'y'], dataProperty)) {
                value = parseFloat(value);
                if (value >= 0.0 && value <= 64.0) {
                    event.target.value = value.toFixed(2);
                    value *= 72.0;
                } else {
                    event.target.value = (shape.model.get(dataProperty) / 72.0).toFixed(2);
                    ui.shakeAnimation($(event.target));
                    return;
                }
            } else if (_.contains(['strokeWidth', 'r'], dataProperty)) {
                value = parseFloat(value);
                if (value >= 0 && value <= 32.0) {
                    event.target.value = value.toFixed(0);
                    value = value.toFixed(0);
                } else {
                    event.target.value = shape.model.get(dataProperty);
                    ui.shakeAnimation($(event.target));
                    return;
                }
            } else if (_.contains(['fillOpacity', 'strokeOpacity'], dataProperty)) {
                value = parseFloat(value);
                if (value >= 0 && value <= 1.0) {
                    event.target.value = value.toFixed(2);
                    value = value.toFixed(2);
                } else {
                    event.target.value = shape.model.get(dataProperty);
                    ui.shakeAnimation($(event.target));
                    return;
                }
            } else if (_.contains(['stroke', 'fill'], dataProperty) &&
                !/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value)) {
                event.target.value = shape.model.get(dataProperty);
                ui.shakeAnimation($(event.target));
                return;
            }

            shape.model.set(dataProperty, value);
            shape.render();
            shape.select();
            shape.shouldEdit(true);
        },

        shapeButtonClicked: function(event) {
            var view = this,
                dataAction = event.target.getAttribute('data-action'),
                documentEditor = appModule.documentContext.model.get('contentView'),
                shape = appModule.shapeContext.model.get('shape');

            if (_.isEqual(dataAction, 'new-shape')) {
                var shapeType = event.target.getAttribute('data-shape');
                documentEditor.collection.add(new Shape.Model({
                    type: shapeType, width: 72, height: 72,
                    x: 72, y: 72, r: 0, strokeOpacity: 1, fillOpacity: 1,
                    fill: '#95a5a6', stroke: '#7f8c8d', strokeWidth: 1
                }));
            } else if (_.isEqual(dataAction, 'remove')) {
                shape.shape.remove();
                documentEditor.shapes = _.without(documentEditor.shapes, shape);
                documentEditor.collection.remove(shape.model);
                appModule.shapeContext.trigger('clear');
            } else if (_.isEqual(dataAction, 'copy')) {
                view.updateClipboard(_.clone(shape.model.toJSON()));
            } else if (_.isEqual(dataAction, 'paste')) {
                if (view.clipboard)
                    documentEditor.collection.add(new Shape.Model(_.clone(view.clipboard)));
            } else if (_.isEqual(dataAction, 'cut')) {
                view.updateClipboard(_.clone(shape.model.toJSON()));
                shape.shape.remove();
                documentEditor.shapes = _.without(documentEditor.shapes, shape);
                documentEditor.collection.remove(shape.model);
                appModule.shapeContext.trigger('clear');
            }
        },

        updateDocumentMetrics: function(model) {
            var view = this;
            view.$('#inspector-document-width').val((model.get('width') / 72.0).toFixed(2));
            view.$('#inspector-document-height').val((model.get('height') / 72.0).toFixed(2));
        },

        updateShapeMetrics: function(model) {
            var view = this;
            if (model) {
                view.$('#inspector-shape-width').val((model.get('width') / 72.0).toFixed(2));
                view.$('#inspector-shape-height').val((model.get('height') / 72.0).toFixed(2));
                view.$('#inspector-shape-x').val((model.get('x') / 72.0).toFixed(2));
                view.$('#inspector-shape-y').val((model.get('y') / 72.0).toFixed(2));
                view.$('#inspector-shape-fill').val(model.get('fill'));
                view.$('#inspector-shape-stroke').val(model.get('stroke'));
                view.$('#inspector-shape-fill-opacity').val(model.get('fillOpacity'));
                view.$('#inspector-shape-stroke-opacity').val(model.get('strokeOpacity'));
                view.$('#inspector-shape-stroke-width').val(model.get('strokeWidth'));
                view.$('#inspector-shape-r').val(model.get('r'));
                view.$('.rectangle-only').css({ display: (model.get('type') == 1) ? 'inline-block' : 'none' });
            } else {
                view.$('.inspector-shape-input').val('');
                view.$('.rectangle-only').css({ display: 'none' });
            }
        },

        shapeWasSelected: function(sender) {
            var view = this,
                shape = appModule.shapeContext.model.get('shape');
            view.$('.inspector-shape-input').prop('disabled', !sender);
            view.$('.inspector-shape-btn.contextual').prop('disabled', !sender);

            view.updateShapeMetrics(sender ? shape.model : null);
        },

        updateClipboard: function(jsonData) {
            var view = this;
            view.clipboard = jsonData;
            delete view.clipboard['_id'];
            view.clipboard.x += 18;
            view.clipboard.y += 18;
            view.$('#inspector-paste-btn').prop('disabled', false);
        },

        render: function() {
            var view = this,
                documentLibrary = $('.document-library');
            view.$el.html(view.template());
            view.$('.inspector-shape-btn').on('click', view.shapeButtonClicked);
            view.$('.inspector-shape-input').on('change', view.shapeMetricsChanged);
            view.$('.inspector-document-input').on('change', view.documentMetricsChanged);
            view.updateDocumentMetrics(appModule.documentContext.model.get('documentModel'));
            documentLibrary.append(view.el);
            return view;
        }
    });

    return Inspector;

});