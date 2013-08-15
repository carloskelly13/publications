
/**
 * Publications JS API
 * Shape Model
 * Michael Kelly and Carlos Paelinck
 */

var express = require('express'),
    mongoose = require('mongoose');

var Schema = mongoose.Schema;

var shapeSchema = new Schema({
    _document: { type: Schema.Types.ObjectId, ref: 'Document' },
    type: { type: Number, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    z: { type: Number, required: true },
    color: { type: String, required: true },
    strokeColor: { type: String, required: true },
    strokeWidth: { type: String, required: true },
});

module.exports = mongoose.model('Shape', shapeSchema);