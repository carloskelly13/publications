
/**
 * Publications
 * Document Model
 * 2014 Michael Kelly and Carlos Paelinck
 */

var mongoose = require('mongoose'),
  PDFDocument = require('pdfkit'),
  _ = require('lodash')

var Schema = mongoose.Schema,
  ShapeModel = require('./shape')

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
      doc = new PDFDocument({ size: [model.width * dpi, model.height * dpi] })

    doc.registerFont('SOURCE_SANS_PRO_400', 'client/css/typefaces/SourceSansPro-Regular.ttf');
    doc.registerFont('SOURCE_SANS_PRO_500', 'client/css/typefaces/SourceSansPro-Semibold.ttf');
    doc.registerFont('SOURCE_SANS_PRO_600', 'client/css/typefaces/SourceSansPro-Bold.ttf');

    doc.registerFont('SOURCE_SERIF_PRO_400', 'client/css/typefaces/SourceSerifPro-Regular.ttf');
    doc.registerFont('SOURCE_SERIF_PRO_500', 'client/css/typefaces/SourceSerifPro-Semibold.ttf');
    doc.registerFont('SOURCE_SERIF_PRO_600', 'client/css/typefaces/SourceSerifPro-Bold.ttf');

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

        if (shape.fillOpacity > 0 && shape.strokeWidth === 0) {
          obj.fillColor(shape.fill, shape.fillOpacity)
            .fill();

        } else if (shape.fillOpacity === 0 && shape.strokeWidth > 0) {
          obj.strokeColor(shape.stroke, shape.strokeOpacity)
            .lineWidth(shape.strokeWidth)
            .lineCap('square')
            .lineJoin('miter')
            .stroke();

        } else if (shape.fillOpacity > 0 && shape.strokeWidth > 0) {
          obj.fillColor(shape.fill, shape.fillOpacity)
            .strokeColor(shape.stroke, shape.strokeOpacity)
            .lineWidth(shape.strokeWidth)
            .lineCap('square')
            .lineJoin('miter')
            .fillAndStroke();
        }

      } else if (shape.type === 'text') {
        var font = shape.fontFamily + '_' + shape.fontWeight;
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