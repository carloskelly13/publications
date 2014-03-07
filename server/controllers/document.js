
/**
 * Publications JS API
 * Document Controller
 * Michael Kelly and Carlos Paelinck
 */

var fs = require('fs'),
  _ = require('lodash');

var DocumentModel = require('../models/document'),
  UserModel = require('../models/user');

exports.index = function(req, res) {
  if (!req.user) {
    res.json([]);
  } else {
    DocumentModel.find({ _user: req.user._id }).exec(function(err, documents) {
      res.json(documents || null);
    });
  }
};

exports.show = function(req, res) {
  var id = req.route.params.id;

  DocumentModel.findById(id, function(err, doc) {
    if (_.isObject(doc)) res.json(doc);
    else res.json(null);
  });
};

exports.update = function(req, res) {
    var documentId = req.route.params.id,
        documentData = req.body;
    delete documentData._id;

    DocumentModel.findByIdAndUpdate(documentId, documentData, { upsert: true }, function(err, doc) {
        if (_.isObject(doc)) res.json(doc);
        else res.json(null);
    });
};

exports.create = function(req, res) {
  var documentData = req.body,
    documentModel = new DocumentModel(documentData);

  UserModel.findById(documentModel._user, function(err, user) {
    user.documents.push(documentModel);
    user.save(function() {
      documentModel.save(function(err, doc) {
        if (_.isObject(doc)) res.json(doc);
        else res.json(null);
      });
    });
  });
};

exports.remove = function(req, res) {
  var id = req.route.params.id;

  UserModel.findById(req.user._id, function(err, user) {
    if (err) res.json({ success: false });
    else {
      user.documents.remove(id);
      user.save(function(err) {
        if (err) res.json({ success: false });
        DocumentModel.findById(id).remove(function(err, doc) {
          res.json({ success: true });
        });
      });
    }
  });
};

exports.pdf = function(req, res) {
    var id = req.route.params.id;

    DocumentModel.findById(id, function(err, doc) {
        if (_.isObject(doc)) {
            var fileIdName = 'tmp/' + doc.id.toString() + '.pdf';
            doc.pdf().write(fileIdName, function() {
                res.set('Content-type', 'application/pdf');
                res.download(fileIdName, 'document.pdf', function(err) {
                     if (err) console.log(err);
                     else
                         fs.unlink(fileIdName, function(err) {
                             if (err) console.log(err);
                         });
                 });
            });
        }
        else res.json(null);
    });
};