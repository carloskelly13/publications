
/**
 * Publications
 * Shape Model
 * 2014 Michael Kelly and Carlos Paelinck
 */

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var shapeSchema = new Schema({
    type: { type: String, required: true },
    width: { type: Number },
    height: { type: Number },
    x: { type: Number },
    y: { type: Number },
    r: { type: Number },
    angle: { type: Number },
    fill: { type: String },
    color: { type: String },
    stroke: { type: String },
    strokeWidth: { type: Number },
    fillOpacity: { type: Number },
    opacity: { type: Number },
    strokeOpacity: { type: Number },
    text: { type: String },
    fontSize: { type: String },
    fontFamily: { type: String },
    fontWeight: { type: String },
    fontStyle: { type: String },
    textAlign: { type: String }
});

module.exports = mongoose.model('Shape', shapeSchema);