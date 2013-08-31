
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
        tooltip = require('tooltip'),
        dropdown = require('dropdown'),
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

            if (value >= 0.0 && value <= 64.0) {
                var svg = d3.select('.document-svg'),
                    svgFrame = d3.select('.document-svg-frame');
                event.target.value = value.toFixed(2);
                svg.transition().attr(dataProperty, (value * 72.0) + offset);
                svgFrame.transition().attr(dataProperty, (value * 72.0));
                documentModel.get('documentModel').set(dataProperty, (value * 72.0));
                documentModel.get('contentView').drawDocumentFrameWithAxisAndGrid();

            } else {
                event.target.value = (parseFloat(documentModel.get('documentModel')
                    .get(dataProperty)) / 72)
                    .toFixed(2);
                ui.shakeAnimation($(event.target));
            }
        },

        shapeMetricsChanged: function(event) {
            var view = this,
                dataProperty = event.target.getAttribute('data-property'),
                dataMin = parseFloat(event.target.getAttribute('data-min')),
                dataMax = parseFloat(event.target.getAttribute('data-max')),
                dataRadix = parseFloat(event.target.getAttribute('data-radix')),
                dataMult = parseFloat(event.target.getAttribute('data-mult')),
                value = parseFloat(event.target.value),
                shape = appModule.shapeContext.model.get('shape');

            if (shape.model.validateNumber(value, dataMin, dataMax)) {
                event.target.value = value.toFixed(dataRadix);
                shape.selectionFrame.remove();
                shape.selectionFrame = null;
                shape.model.set(dataProperty, value * dataMult);
                shape.render();
                shape.select();
                shape.shouldEdit(true);

            } else {
                event.target.value = (parseFloat(shape.model.get(dataProperty)) / dataMult)
                    .toFixed(dataRadix);
                ui.shakeAnimation($(event.target));
            }
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
                    fill: '#1abc9c', stroke: '#16a085', strokeWidth: 1
                }));

            } else if (_.isEqual(dataAction, 'remove')) {
                shape.shape.remove();
                documentEditor.shapes = _.without(documentEditor.shapes, shape);
                documentEditor.collection.remove(shape.model);
                appModule.shapeContext.trigger('clear');

            } else if (_.isEqual(dataAction, 'copy'))
                view.updateClipboard(_.clone(shape.model.toJSON()));

            else if (_.isEqual(dataAction, 'paste') && view.clipboard)
                documentEditor.collection.add(new Shape.Model(_.clone(view.clipboard)));

            else if (_.isEqual(dataAction, 'cut')) {
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
                view.$('#inspector-shape-width').val((model.get('width') / 72.0).toFixed(3));
                view.$('#inspector-shape-height').val((model.get('height') / 72.0).toFixed(3));
                view.$('#inspector-shape-x').val((model.get('x') / 72.0).toFixed(3));
                view.$('#inspector-shape-y').val((model.get('y') / 72.0).toFixed(3));
                view.$('#inspector-shape-fill').css({ background: model.get('fill') });
                view.$('#inspector-shape-stroke').css({ background: model.get('stroke') });
                view.$('#inspector-shape-fill-input').val(model.get('fill'));
                view.$('#inspector-shape-stroke-input').val(model.get('stroke'));
                view.$('#inspector-shape-fill-opacity').val(model.get('fillOpacity').toFixed(2));
                view.$('#inspector-shape-stroke-opacity').val(model.get('strokeOpacity').toFixed(2));
                view.$('#inspector-shape-stroke-width').val(model.get('strokeWidth').toFixed(0));
                view.$('#inspector-shape-r').val(model.get('r').toFixed(0));
                view.$('.rectangle-only').css({ display: (model.get('type') == 1) ? 'inline-block' : 'none' });
            } else {
                view.$('.inspector-shape-input').val('');
                view.$('.inspector-color-input').val('');
                view.$('.rectangle-only').css({ display: 'none' });
                view.$('#inspector-shape-fill').css({ background: 'transparent' });
                view.$('#inspector-shape-stroke').css({ background: 'transparent' });
                if (view.colorPicker) view.closeColorPicker();
            }
        },

        shapeWasSelected: function(sender) {
            var view = this,
                shape = appModule.shapeContext.model.get('shape');
            view.$('.inspector-shape-input').prop('disabled', !sender);
            view.$('.inspector-color-input').prop('disabled', !sender);
            view.$('.color-btn').prop('disabled', !sender);
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
                documentLibrary = $('.document-library'),
                layersList = new Inspector.Views.LayersList();

            view.$el.html(view.template());
            view.$('.inspector-shape-btn').on('click', view.shapeButtonClicked);
            view.$('.color-btn').on('click', view.colorButtonClicked);
            view.$('.inspector-shape-input').on('change', view.shapeMetricsChanged);
            view.$('.inspector-document-input').on('change', view.documentMetricsChanged);
            view.updateDocumentMetrics(appModule.documentContext.model.get('documentModel'));

            view.$('fieldset#fill-fieldset').prepend(new Inspector.Views.ColorPicker({
                model: new Backbone.Model({ property: 'fill', label: 'Fill' })
            }).render().el);

            view.$('fieldset#stroke-fieldset').prepend(new Inspector.Views.ColorPicker({
                model: new Backbone.Model({ property: 'stroke', label: 'Stroke' })
            }).render().el);


            documentLibrary.append(view.el);
            view.layersList = layersList;
            // view.$('.inspector-section-layers').append(layersList.render().el);
            view.$('.inspector-shape-btn').tooltip();
            return view;
        }
    });

    Inspector.Views.ColorPicker = Backbone.View.extend({
        tagName: 'div',
        className: 'color-picker',
        template: _.template(require('text!../templates/inspector-color-picker.html')),

        initialize: function() {
            _.bindAll(this);
        },

        colorInputChanged: function(event) {
            var view = this,
                color = event.target.value,
                shape = appModule.shapeContext.model.get('shape'),
                property = view.model.get('property');

            if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)) {
                view.$('.color-btn').css({ background: color });
                shape.model.set(property, color);
                shape.render();
                shape.select();
                shape.shouldEdit(true);
            } else {
                event.target.value = shape.model.get(property);
                ui.shakeAnimation($(event.target));
            }
        },

        colorSelected: function(event) {
            var view = this,
                color = event.target.getAttribute('data-color'),
                shape = appModule.shapeContext.model.get('shape'),
                property = view.model.get('property');

            view.$('.color-btn').css({ background: color });
            view.$('#inspector-shape-' + property + '-input').val(color);
            shape.model.set(property, color);
            shape.render();
            shape.select();
            shape.shouldEdit(true);
        },

        render: function() {
            var view = this;
            view.$el.html(view.template(view.model.toJSON()));
            view.$('.colors li').on('click', view.colorSelected);
            view.$('.inspector-color-input').on('change', view.colorInputChanged);
            return view;
        }
    });

    Inspector.Views.LayersList = Backbone.View.extend({
        tagName: 'div',
        className: 'layers-list',

        addLayer: function(model) {
            console.log(model);
        },

        removeLayer: function(model) {
            console.log(model);
        },

        render: function() {
            var view = this;


            return view;
        }
    });

    return Inspector;

});