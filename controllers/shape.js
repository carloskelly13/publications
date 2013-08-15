
/**
 * Publications JS API
 * Shape Controller
 * Michael Kelly and Carlos Paelinck
 */

var mongoose = require('mongoose'),
    _ = require('lodash');

var ShapeModel = require('../models/shape');

exports.index = function(req, res) {
    var documentId = req.route.params.id;

    ShapeModel.find({ _document: documentId }, function(err, shapes) {
        if (_.isObject(shapes))
            res.json(shapes);
        else
            res.json(null);
    });
};