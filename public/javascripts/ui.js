
/**
 * Publications JS App
 * UI Module
 * Michael Kelly and Carlos Paelinck
 */

define(function(require) {
    var _ = require('underscore'),
        $ = require('jquery');

    $.fn.center = function() {
        var el = this;
        el.css('position','absolute');
        el.css('top', Math.max(0, (($(window).height() - $(el).outerHeight()) / 2) + $(window).scrollTop()) + 'px');
        el.css('left', Math.max(0, (($(window).width() - $(el).outerWidth()) / 2) + $(window).scrollLeft()) + 'px');
        return el;
    };

    return {
         fadeOut: function() {
            var el = arguments[0], fn = arguments[1];
            el.addClass('fadeOutAnimation');
            setTimeout(function() {
                el.removeClass('fadeOutAnimation');
                el.css({ display: 'none' });
                if (fn) fn();
            }, 250);
        },

        fadeIn: function() {
            var el = arguments[0], fn = arguments[1];
            el.css({ display: 'block' });
            el.addClass('fadeInAnimation');
            setTimeout(function() {
                el.removeClass('fadeInAnimation');
                if (fn) fn();
            }, 250);
        },

        fadeInGrowAnimation: function() {
            var el = arguments[0], fn = arguments[1];
            el.addClass('fadeInGrowAnimation');
            setTimeout(function() {
                el.removeClass('fadeInGrowAnimation');
                if (fn) fn();
            }, 250);
        },

        fadeOutGrowAnimation: function() {
            var el = arguments[0], fn = arguments[1];
            el.addClass('fadeOutGrowAnimation');
            setTimeout(function() {
                el.removeClass('fadeOutGrowAnimation');
                if (fn) fn();
            }, 250);
        },

        shakeAnimation: function() {
            var el = arguments[0], fn = arguments[1];
            el.addClass('shakeAnimation');
            setTimeout(function() {
                el.removeClass('shakeAnimation');
                if (fn) fn();
            }, 1000);
        },

        hingeAnimation: function() {
            var el = arguments[0], fn = arguments[1];
            el.addClass('animated hinge');
            setTimeout(function() {
                el.removeClass('animated hinge');
                if (fn) fn();
            }, 1000);
        }
    };

});