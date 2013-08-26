
/**
 * Publications JS API
 * Shape Model
 * Michael Kelly and Carlos Paelinck
 */

var express = require('express'),
    mongoose = require('mongoose');

var Schema = mongoose.Schema;

var shapeSchema = new Schema({
    type: { type: Number, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    r: { type: Number, required: true },
    fill: { type: String, required: true },
    stroke: { type: String, required: true },
    fillOpacity: { type: Number, required: true },
    strokeOpacity: { type: Number, required: true },
    strokeWidth: { type: Number, required: true },
});

module.exports = mongoose.model('Shape', shapeSchema);