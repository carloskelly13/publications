
/**
 * Publications JS App
 * Document Module
 * Michael Kelly and Carlos Paelinck
 */

define(function(require) {
    var _ = require('underscore'),
        $ = require('jquery'),
        amplify = require('amplify'),
        ui = require('ui'),
        NProgress = require('nprogress'),
        Backbone = require('backbone'),
        appModule = require('app-module'),
        d3 = require('d3');

    var Document = appModule.module(),
        DocumentContext = require('contexts/document-context'),
        ShapeContext = require('contexts/shape-context'),
        User = require('user'),
        Shape = require('shape'),
        Inspector = require('inspector'),
        Modal = require('modal');

    Document.Model = Backbone.Model.extend({
        urlRoot: '/document',
        idAttribute: '_id',

        getPrintedSize: function() {
            var model = this;
            return (model.get('width') / 72.0) + '” × ' + (model.get('height') / 72.0) + '”';
        },

        getPrintedDate: function() {
            var model = this,
                format = d3.time.format('%e %b %Y');

            return format(new Date(model.get('modified')));
        }
    });

    Document.Views.Item = Backbone.View.extend({
        tagName: 'div',
        className: 'document-view-item',
        template: _.template(require('text!../templates/document-item.html')),

        events: {
            'click' : 'listItemClicked'
        },

        listItemClicked: function() {
            var view = this,
                documentEditor = new Document.Views.Editor({ model: view.model });

            appModule.documentContext.trigger('update', {
                documentModel: view.model,
                listItem: view,
                contentView: documentEditor,
                superview: $('.document-editor')
            });
        },

        render: function() {
            var view = this;
            view.$el.html(view.template({
                name: view.model.get('name'),
                printedSize: view.model.getPrintedSize(),
                date: view.model.getPrintedDate()
            }));

            return view;
        }
    });

    Document.Views.Library = Backbone.View.extend({
        tagName: 'div',
        className: 'document-library',
        template: _.template(require('text!../templates/document-library.html')),

        events: {
            'click .source-list' : 'sourceListClicked'
        },

        initialize: function() {
            var view = this;
            view.documents = [];
            view.fetchDocuments();
            appModule.documentContext = new DocumentContext.Service({ model: new DocumentContext.Model() });
        },

        createNewDocument: function() {
            var view = this,
                documentModel = new Document.Model({
                _user: view.model.id,
                name: 'Untitled Document',
                width: 432,
                height: 288,
                shapes: []
            });

            view.listenToOnce(documentModel, 'change', view.addDocument);
            documentModel.save();
        },

        fetchDocuments: function() {
            var view = this;
            _.each(view.model.get('documents'), function(documentId) {
                var documentModel = new Document.Model({ _id: documentId });
                view.listenToOnce(documentModel, 'sync', view.addDocument);
                documentModel.fetch();
            });
        },

        addDocument: function(model) {
            var view = this,
                documentView = new Document.Views.Item({ model: model });
            view.documents.push(documentView);
            view.sourceList.append(documentView.render().el);
        },

        sourceListClicked: function(event) {
            if (event.target.id.toLowerCase() === 'source-list-content'.toLowerCase())
                appModule.documentContext.trigger('clear');
        },

        render: function() {
            var view = this;
            view.$el.html(view.template());
            view.sourceList = view.$('.source-list .content');
            window.document.title = 'Publications - Documents';
            return view;
        }
    });

    Document.Views.Editor = Backbone.View.extend({
        tagName: 'div',
        className: 'content fadeInGrowAnimation',
        id: 'document-editor-content',
        template: _.template(require('text!../templates/document-editor.html')),

        events: {
            'click #doc-edit-btn' : 'editButtonClicked',
            'click #doc-pdf-btn' : 'pdfButtonClicked',
            'click #save-edit-btn' : 'saveButtonClicked',
            'click #doc-delete-btn' : 'deleteButtonClicked',
            'click #close-edit-btn' : 'closeButtonClicked',
            'change input.document-name' : 'documentNameChanged'
        },

        initialize: function() {
            var view = this;
            appModule.inspector = new Inspector.Views.Main();
            appModule.shapeContext = new ShapeContext.Service({ model: new ShapeContext.Model() });
            view.shapes = [];
            _.bindAll(view);
        },

        createShapes: function() {
            var view = this;
            view.collection = new Shape.Collection();
            view.listenTo(view.collection, 'add', view.addShape);
            view.collection.add(view.model.get('shapes'));
            return view;
        },

        saveButtonClicked: function() {
            var view = this;
            NProgress.start();
            view.model.set('shapes', view.collection.toJSON());
            view.listenToOnce(view.model, 'sync', function() { NProgress.done(); });
            view.model.save();
            view.shapes = _.sortBy(view.shapes, function(shapeView) { return shapeView.model.attributes.z; });
        },

        deleteButtonClicked: function() {
            var view = this;
            new Modal.Views.YesNo({
                yesFunction: function(sender) {
                    var documentContext = appModule.documentContext,
                        sourceListItem = documentContext.model.get('listItem'),
                        documentModel = documentContext.model.get('documentModel');

                    documentContext.trigger('clear');
                    ui.hingeAnimation(sourceListItem.$el, function() {
                        sourceListItem.remove();
                        documentModel.destroy();
                    });
                },
                noFunction: null,
                model: new Backbone.Model({
                    title: 'Delete ' + view.model.get('name'),
                    message: 'Are you sure you want to delete ' + view.model.get('name') + '? This action cannot be reversed.',
                    yesButton: 'Delete',
                    noButton: 'Cancel'
                })
            }).render();
        },

        closeButtonClicked: function() {
            var view = this,
                viewControls = view.$('.view-controls'),
                editControls = view.$('.edit-controls'),
                documentControls = $('.pub-nav .controls'),
                sourceList = $('.full-height-content.source-list'),
                documentEditor = $('.full-height-content.document-editor');

            view.saveButtonClicked();
            _.each(view.shapes, function(shape) { shape.shouldEdit(false); });
            documentEditor.css({ right: 0 });
            sourceList.css({ left: 0 });
            appModule.inspector.$el.css({ right: '-24%' });
            appModule.shapeContext.trigger('clear');
            appModule.isEditingDocument = false;
            ui.fadeOut(editControls, function() {
                ui.fadeIn(viewControls);
                ui.fadeIn(documentControls);
                view.$('input.document-name').prop('disabled', true);
                appModule.inspector.remove();
                appModule.documentContext.model.get('listItem').render();
                window.document.title = 'Publications - Documents';
            });
        },

        editButtonClicked: function() {
            var view = this,
                viewControls = view.$('.view-controls'),
                editControls = view.$('.edit-controls'),
                documentControls = $('.pub-nav .controls'),
                sourceList = $('.full-height-content.source-list'),
                documentEditor = $('.full-height-content.document-editor');

            view.clipboard = null;
            appModule.inspector.render();
            appModule.isEditingDocument = true;
            ui.fadeOut(documentControls);
            ui.fadeOut(viewControls, function() {
                documentEditor.css({ right: '23%' });
                sourceList.css({ left: '-24%' });
                appModule.inspector.$el.css({ right: 0 });
                view.$('input.document-name').prop('disabled', false);
                ui.fadeIn(editControls);
                window.document.title = 'Publications - Editing ' + view.model.get('name');
                _.each(view.shapes, function(shape) {
                    shape.shouldEdit(true);
                    appModule.inspector.layersList.addLayer(shape);
                });
            });
        },

        pdfButtonClicked: function(event) {
            var view = this,
                documentModel = appModule.documentContext.model.get('documentModel');

            if (documentModel.id)
                window.location = '/document/' + documentModel.id + '/pdf';
        },

        controlButtonClicked: function(event) {
            var view = this,
                dataAction = event.target.getAttribute('data-action'),
                shape = appModule.shapeContext.model.get('shape');

            if (_.isEqual(dataAction, 'add-shape')) {
                var shapeType = event.target.getAttribute('data-shape');
                view.collection.add(new Shape.Model({
                    type: shapeType, width: 72, height: 72,
                    x: 72, y: 72, r: 0, strokeOpacity: 1, fillOpacity: 1,
                    fill: '#1abc9c', stroke: '#16a085', strokeWidth: 1
                }));

            } else if (_.isEqual(dataAction, 'delete')) {
                shape.shape.remove();
                view.shapes = _.without(view.shapes, shape);
                view.collection.remove(shape.model);
                appModule.shapeContext.trigger('clear');
                appModule.inspector.layersList.removeLayer(shape);
                $(event.target).tooltip('hide');

            } else if (_.isEqual(dataAction, 'copy'))
                view.updateClipboard(_.clone(shape.model.toJSON()));

            else if (_.isEqual(dataAction, 'paste') && view.clipboard)
                view.collection.add(new Shape.Model(_.clone(view.clipboard)));

            else if (_.isEqual(dataAction, 'cut')) {
                view.updateClipboard(_.clone(shape.model.toJSON()));
                shape.shape.remove();
                view.shapes = _.without(view.shapes, shape);
                view.collection.remove(shape.model);
                appModule.shapeContext.trigger('clear');
            }
        },

        updateClipboard: function(jsonData) {
            var view = this;
            view.clipboard = jsonData;
            delete view.clipboard['_id'];
            view.clipboard.x += 18;
            view.clipboard.y += 18;
            // view.$('#inspector-paste-btn').prop('disabled', false);
        },

        documentNameChanged: function(event) {
            var view = this,
                documentName = event.target.value;
            if (_.isEmpty(documentName))
                event.target.value = view.model.get('name');
            else
                view.model.set({ name: documentName });
        },

        addShape: function(model) {
            var view = this,
                shapeView = null,
                layersList = appModule.inspector.layersList;

            model.set({ z: view.shapes.length });

            if (model.get('type') == 1)
                shapeView = new Shape.Views.Rectangle({ model: model, svg: view.svg }).createSVGEl().render();
            else if (model.get('type') == 2)
                shapeView = new Shape.Views.Ellipse({ model: model, svg: view.svg }).createSVGEl().render();

            if (layersList)
                layersList.addLayer(shapeView);

            if (appModule.isEditingDocument) {
                shapeView.shouldEdit(true);
                setTimeout(function() { shapeView.clicked(); }, 250);
            }

            view.shapes.push(shapeView);
        },

        documentSVGClicked: function() {
            appModule.shapeContext.trigger('clear');
        },

        drawDocumentFrameWithAxisAndGrid: function() {
            d3.select('.x.axis').remove();
            d3.select('.y.axis').remove();
            d3.select('.x.grid').remove();
            d3.select('.y.grid').remove();

            var view = this,
                svg = view.svg,
                width = view.model.get('width'),
                height = view.model.get('height');

            var xScale = d3.scale.linear()
                .domain([0, (width / 72.0)])
                .range([0, width]),
                yScale = d3.scale.linear()
                .domain([0, (height / 72.0)])
                .range([0, height]);

            var xAxis = d3.svg.axis()
                .scale(xScale)
                .ticks((width / 36.0) + 1.0)
                .orient('top'),
                yAxis = d3.svg.axis()
                .scale(yScale)
                .ticks((height / 36.0) + 1.0)
                .orient('left');

            svg.append('g')
                .attr('class', 'x axis')
                .attr('transform', 'translate(40, 20)')
                .call(xAxis);
            svg.append('g')
                .attr('class', 'y axis')
                .attr('transform', 'translate(40, 20)')
                .call(yAxis);

            svg.insert('g', '.shape-group')
                .attr('class', 'x grid')
                .attr('transform', 'translate(40, 20)')
                .call(xAxis.tickSize(-height, 0, 0).tickFormat(''));
            svg.insert('g', '.shape-group')
                .attr('class', 'y grid')
                .attr('transform', 'translate(40, 20)')
                .call(yAxis.tickSize(-width, 0, 0).tickFormat(''));
        },

        createDocumentSVG: function() {
            var view = this;

            var width = view.model.get('width'),
                height = view.model.get('height');

            var svg = d3.select('.document-svg-container').append('svg')
                .attr('class', 'document-svg')
                .attr('width', width + 80)
                .attr('height', height + 40)
                .append('g');

            svg.append('rect')
                .attr('class', 'document-svg-frame')
                .attr('width', width)
                .attr('height', height)
                .attr('x', 40)
                .attr('y', 20)
                .style('fill', '#fff')
                .on('click', view.documentSVGClicked);

            svg.append('g')
                .attr('class', 'shape-group');


            view.svg = svg;
            view.drawDocumentFrameWithAxisAndGrid();
            return view;
        },

        shapeWasSelected: function(condition) {
            var view = this;
            appModule.inspector.shapeWasSelected(condition);
            view.$('#inspector-controls .btn.contextual').prop('disabled', !condition);
        },

        render: function() {
            var view = this;
            view.$el.html(view.template(view.model.toJSON()));
            view.$('#inspector-controls .btn').on('click', view.controlButtonClicked);
            return view;
        }
    });

    return Document;
});