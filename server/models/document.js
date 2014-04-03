
/**
 * Publications JS API
 * Document Model
 * Michael Kelly and Carlos Paelinck
 */

var mongoose = require('mongoose'),
    PDFDocument = require('pdfkit'),
    _ = require('lodash');

var Schema = mongoose.Schema,
    ShapeModel = require('./shape');

var documentSchema = new Schema({
    _user: { type: Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true, trim: true, unique: false },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    modified: { type: Date, 'default': Date.now },
    shapes: [ ShapeModel.schema ]
});

documentSchema.methods = {
  pdf: function() {
    var model = this,
      dpi = 72,
      doc = new PDFDocument({
      size: [model.width * dpi, model.height * dpi]
    });

    /**
     * Register Helvetica Neue Typefaces
     */
    doc.registerFont('HELVETICA_NEUE_NORMAL_NORMAL', 'client/css/typefaces/HelveticaNeue.ttf');
    doc.registerFont('HELVETICA_NEUE_BOLD_NORMAL', 'client/css/typefaces/HelveticaNeueBold.ttf');
    doc.registerFont('HELVETICA_NEUE_NORMAL_ITALIC', 'client/css/typefaces/HelveticaNeueItalic.ttf');
    doc.registerFont('HELVETICA_NEUE_BOLD_ITALIC', 'client/css/typefaces/HelveticaNeueBoldItalic.ttf');

    /**
     * Register Georgia Typefaces
     */
    doc.registerFont('GEORGIA_NORMAL_NORMAL', 'client/css/typefaces/Georgia.ttf');
    doc.registerFont('GEORGIA_BOLD_NORMAL', 'client/css/typefaces/GeorgiaBold.ttf');
    doc.registerFont('GEORGIA_NORMAL_ITALIC', 'client/css/typefaces/GeorgiaItalic.ttf');
    doc.registerFont('GEORGIA_BOLD_ITALIC', 'client/css/typefaces/GeorgiaBoldItalic.ttf');

    _.each(model.shapes, function(shape) {
      var obj;

      if (shape.type === 'rect' || shape.type === 'ellipse') {
        if (shape.type === 'rect') {
          obj = doc.roundedRect(shape.x * dpi,
            shape.y * dpi,
            shape.width * dpi,
            shape.height * dpi,
            shape.r);

        } else if (shape.type === 'ellipse') {
          obj = doc.ellipse((shape.x + (shape.width / 2.0))  * dpi,
            (shape.y + (shape.height / 2.0))  * dpi,
            (shape.width / 2.0)  * dpi,
            (shape.height / 2.0)  * dpi);
        }

        obj.lineWidth(shape.strokeWidth)
          .fillColor(shape.fill, shape.fillOpacity)
          .strokeColor(shape.stroke, shape.strokeOpacity);

        if (shape.fillOpacity > 0 && shape.strokeWidth === 0) {
          obj.fill();

        } else if (shape.fillOpacity === 0 && shape.strokeWidth > 0) {
          obj.stroke();

        } else if (shape.fillOpacity > 0 && shape.strokeWidth > 0) {
          obj.fillAndStroke();
        }

      } else if (shape.type === 'text') {
        var font = shape.fontFamily + '_' + shape.fontWeight + '_' + shape.fontStyle;
        font = font.replace(/ /g, '_');
        font = font.toUpperCase();

        doc.font(font)
          .fontSize(shape.fontSize)
          .fillColor(shape.color)
          .text(shape.text, shape.x * dpi, shape.y * dpi, {
            width: shape.width * dpi,
            height: shape.height * dpi,
            align: shape.textAlign
          });
      }

    });

    return doc;
  }
};


module.exports = mongoose.model('Document', documentSchema);