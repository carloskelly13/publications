
/**
 * Publications JS API
 * Document Controller
 * Michael Kelly and Carlos Paelinck
 */

var mongoose = require('mongoose'),
    _ = require('lodash');

var DocumentModel = require('../models/document');

exports.index = function(req, res) {
    var userId = req.user['_id'];

    DocumentModel.find({ userId: userId }, function(err, documents) {
        if (_.isObject(documents))
            res.json(documents);
        else
            res.json(null);
    });
};