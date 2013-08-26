
/**
 * Publications JS API
 * Document Model
 * Michael Kelly and Carlos Paelinck
 */

var express = require('express'),
    mongoose = require('mongoose'),
    PDFDocument = require('pdfkit'),
    _ = require('lodash');

var Schema = mongoose.Schema,
    ShapeModel = require('./shape');

var documentSchema = new Schema({
    _user: { type: Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true, trim: true, unique: false },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    modified: { type: Date, default: Date.now },
    shapes: [ ShapeModel.schema ]
});

documentSchema.methods = {
    pdf: function() {
        var model = this;
        var doc = new PDFDocument({
            size: [model.width, model.height]
        });

        _.each(model.shapes, function(shape) {
            var obj;

            if (_.isEqual(shape.type, 1))
                obj = doc.roundedRect(shape.x, shape.y, shape.width, shape.height, shape.r);

            else if (_.isEqual(shape.type, 2))
                obj = doc.ellipse(shape.x + (shape.width / 2.0), shape.y + (shape.height / 2.0),
                        shape.width / 2.0, shape.height / 2.0);

            console.log([shape.x + (shape.width / 2.0), shape.y + (shape.height / 2.0),
                        shape.width / 2.0, shape.height / 2.0]);

            obj.lineWidth(shape.strokeWidth)
                .fillColor(shape.fill, shape.fillOpacity)
                .strokeColor(shape.stroke, shape.strokeOpacity);

            if (shape.fillOpacity > 0 && shape.strokeOpacity === 0) obj.fill();
            else if (shape.strokeOpacity > 0 && shape.fillOpacity === 0) obj.stroke();
            else if (shape.fillOpacity > 0 && shape.strokeOpacity > 0) obj.fillAndStroke();
        });

        return doc;
    }
};


module.exports = mongoose.model('Document', documentSchema);