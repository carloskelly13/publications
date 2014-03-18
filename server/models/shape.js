
/**
 * Publications JS API
 * Shape Model
 * Michael Kelly and Carlos Paelinck
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
    stroke: { type: String },
    strokeWidth: { type: Number },
    fillOpacity: { type: Number },
    strokeOpacity: { type: Number }
});

module.exports = mongoose.model('Shape', shapeSchema);