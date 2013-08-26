
/**
 * Publications JS App
 * Shape Module
 * Michael Kelly and Carlos Paelinck
 */

define(function(require) {
    var _ = require('underscore'),
        $ = require('jquery'),
        amplify = require('amplify'),
        Backbone = require('backbone'),
        appModule = require('app-module');

    var Shape = appModule.module();

    Shape.Model = Backbone.Model.extend({
        idAttribute: '_id'
    });

    Shape.Collection = Backbone.Collection.extend({
        model: Shape.Model
    });

    Shape.Views.Base = Backbone.View.extend({
        select: function() {
            var view = this,
                fill = d3.rgb(view.model.get('fill')),
                stroke = d3.rgb(view.model.get('stroke'));

            view.shape.style('fill', fill.darker(0.75));
            view.shape.style('stroke', stroke.darker(0.75));
            view.shape.call(d3.behavior.drag().origin(Object).on('drag', view.drag));
        },

        deselect: function() {
            var view = this,
                fill = d3.rgb(view.model.get('fill')),
                stroke = d3.rgb(view.model.get('stroke'));

            view.shape.style('fill', fill);
            view.shape.style('stroke', stroke);
            view.shape.call(d3.behavior.drag().origin(Object).on('drag', null));
        },

        clicked: function() {
            var view = this;
            appModule.shapeContext.trigger('update', view);
        },

        shouldEdit: function(sender) {
            var view = this;
            if (sender) view.shape.on('click', view.clicked);
            else view.shape.on('click', null);
        },

        initialize: function() {
            _.bindAll(this);
        }
    });

    Shape.Views.Rectangle = Shape.Views.Base.extend({
        drag: function() {
            var view = this,
                dragTarget = view.shape,
                x = d3.event.dx + parseInt(dragTarget.attr('x'), 10),
                y = d3.event.dy + parseInt(dragTarget.attr('y'), 10);
            dragTarget.attr('x', x);
            dragTarget.attr('y', y);
            view.model.set('x', x - 40.0);
            view.model.set('y', y - 20.0);
            appModule.inspector.updateShapeMetrics(view.model);
        },

        createSVGEl: function() {
            var view = this,
                svg = view.options.svg;

            var shape = svg.append('rect');
            view.shape = shape;
            return view;
        },

        render: function() {
            var view = this;

            view.shape.attr('width', view.model.get('width'))
                .attr('height', view.model.get('height'))
                .attr('x', view.model.get('x') + 40.0)
                .attr('y', view.model.get('y') + 20.0)
                .attr('rx', view.model.get('r'))
                .attr('ry', view.model.get('r'))
                .attr('cid', view.cid)
                .style('fill', view.model.get('fill'))
                .style('stroke', view.model.get('stroke'))
                .style('fill-opacity', view.model.get('fillOpacity'))
                .style('stroke-opacity', view.model.get('strokeOpacity'))
                .style('stroke-width', view.model.get('strokeWidth'));

            return view;
        }
    });

    Shape.Views.Ellipse = Shape.Views.Base.extend({
        drag: function() {
            var view = this,
                dragTarget = view.shape,
                cx = d3.event.dx + parseInt(dragTarget.attr('cx'), 10),
                cy = d3.event.dy + parseInt(dragTarget.attr('cy'), 10);
            dragTarget.attr('cx', cx);
            dragTarget.attr('cy', cy);
            view.model.set('x', cx - (view.model.get('width') / 2.0) - 40.0);
            view.model.set('y', cy - (view.model.get('height') / 2.0) - 20.0);
            appModule.inspector.updateShapeMetrics(view.model);
        },

        createSVGEl: function() {
            var view = this,
                svg = view.options.svg;

            var shape = svg.append('ellipse');
            view.shape = shape;
            return view;
        },

        render: function() {
            var view = this;

            view.shape.attr('rx', (view.model.get('width') / 2.0))
                .attr('ry', (view.model.get('height') / 2.0))
                .attr('cx', view.model.get('x') + (view.model.get('width') / 2.0) + 40.0)
                .attr('cy', view.model.get('y') + (view.model.get('height') / 2.0) + 20.0)
                .attr('cid', view.cid)
                .style('fill', view.model.get('fill'))
                .style('stroke', view.model.get('stroke'))
                .style('fill-opacity', view.model.get('fillOpacity'))
                .style('stroke-opacity', view.model.get('strokeOpacity'))
                .style('stroke-width', view.model.get('strokeWidth'));

            return view;
        }
    });

    return Shape;
});