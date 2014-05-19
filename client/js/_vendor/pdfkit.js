(function(){
var Buffer, P, modules, require, __dirname;
P = {};
modules = P.modules = {};
require = P.require = function(name) {
  if (ignored.indexOf(name) !== -1) {
    return {};
  } else if (modules[name]) {
    if (modules[name].loader) {
      modules[name].loader();
    }
    return modules[name].exports;
  } else {
    throw new Error("missing module " + name);
  }
};
__dirname = "src/pdfkit/lib";
Buffer = {};
Buffer.isBuffer = function() {
  return false;
};
var ignored = ["zlib", "flate", "./font/ttf", "./font/subset", "./image/png"];
(function(){
  var module = {exports:{}};
  var exports = module.exports;
  modules['pdfkit'] = module;
  module.loader = function(){
    module.loader = null;
    /*
PDFDocument - represents an entire PDF document
By Devon Govett
*/
var PDFDocument, PDFObject, PDFObjectStore, PDFPage, PDFReference, fs;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
fs = require('fs');
PDFObjectStore = require('./store');
PDFObject = require('./object');
PDFReference = require('./reference');
PDFPage = require('./page');
PDFDocument = (function() {
  var mixin;
  function PDFDocument(options) {
    var key, val, _ref;
    this.options = options != null ? options : {};
    this.version = 1.3;
    this.compress = true;
    this.store = new PDFObjectStore;
    this.pages = [];
    this.page = null;
    this.initColor();
    this.initFonts();
    this.initText();
    this.initImages();
    this._info = this.ref({
      Producer: 'PDFKit',
      Creator: 'PDFKit',
      CreationDate: new Date()
    });
    this.info = this._info.data;
    if (this.options.info) {
      _ref = this.options.info;
      for (key in _ref) {
        val = _ref[key];
        this.info[key] = val;
      }
      delete this.options.info;
    }
    this.addPage();
  }
  mixin = __bind(function(name) {
    var method, methods, _results;
    methods = require('./mixins/' + name);
    _results = [];
    for (name in methods) {
      method = methods[name];
      _results.push(this.prototype[name] = method);
    }
    return _results;
  }, PDFDocument);
  mixin('color');
  mixin('vector');
  mixin('fonts');
  mixin('text');
  mixin('images');
  mixin('annotations');
  PDFDocument.prototype.addPage = function(options) {
    if (options == null) {
      options = this.options;
    }
    this.page = new PDFPage(this, options);
    this.store.addPage(this.page);
    this.pages.push(this.page);
    this.x = this.page.margins.left;
    this.y = this.page.margins.top;
    return this;
  };
  PDFDocument.prototype.ref = function(data) {
    return this.store.ref(data);
  };
  PDFDocument.prototype.addContent = function(str) {
    this.page.content.add(str);
    return this;
  };
  PDFDocument.prototype.write = function(filename, fn) {
    return this.output(function(out) {
      return fs.writeFile(filename, out, 'binary', fn);
    });
  };
  PDFDocument.prototype.output = function(fn) {
    return this.finalize(__bind(function() {
      var out;
      out = [];
      this.generateHeader(out);
      return this.generateBody(out, __bind(function() {
        this.generateXRef(out);
        this.generateTrailer(out);
        return fn(out.join('\n'));
      }, this));
    }, this));
  };
  PDFDocument.prototype.finalize = function(fn) {
    var key, val, _ref;
    _ref = this.info;
    for (key in _ref) {
      val = _ref[key];
      if (typeof val === 'string') {
        this.info[key] = PDFObject.s(val);
      }
    }
    return this.embedFonts(__bind(function() {
      return this.embedImages(__bind(function() {
        var cb, done, page, _i, _len, _ref2, _results;
        done = 0;
        cb = __bind(function() {
          if (++done === this.pages.length) {
            return fn();
          }
        }, this);
        _ref2 = this.pages;
        _results = [];
        for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
          page = _ref2[_i];
          _results.push(page.finalize(cb));
        }
        return _results;
      }, this));
    }, this));
  };
  PDFDocument.prototype.generateHeader = function(out) {
    out.push("%PDF-" + this.version);
    out.push("%\xFF\xFF\xFF\xFF\n");
    return out;
  };
  PDFDocument.prototype.generateBody = function(out, fn) {
    var id, offset, proceed, ref, refs;
    offset = out.join('\n').length;
    refs = (function() {
      var _ref, _results;
      _ref = this.store.objects;
      _results = [];
      for (id in _ref) {
        ref = _ref[id];
        _results.push(ref);
      }
      return _results;
    }).call(this);
    return (proceed = __bind(function() {
      if (ref = refs.shift()) {
        return ref.object(this.compress, function(object) {
          ref.offset = offset;
          out.push(object);
          offset += object.length + 1;
          return proceed();
        });
      } else {
        this.xref_offset = offset;
        return fn();
      }
    }, this))();
  };
  PDFDocument.prototype.generateXRef = function(out) {
    var id, len, offset, ref, _ref, _results;
    len = this.store.length + 1;
    out.push("xref");
    out.push("0 " + len);
    out.push("0000000000 65535 f ");
    _ref = this.store.objects;
    _results = [];
    for (id in _ref) {
      ref = _ref[id];
      offset = ('0000000000' + ref.offset).slice(-10);
      _results.push(out.push(offset + ' 00000 n '));
    }
    return _results;
  };
  PDFDocument.prototype.generateTrailer = function(out) {
    var trailer;
    trailer = PDFObject.convert({
      Size: this.store.length,
      Root: this.store.root,
      Info: this._info
    });
    out.push('trailer');
    out.push(trailer);
    out.push('startxref');
    out.push(this.xref_offset);
    return out.push('%%EOF');
  };
  PDFDocument.prototype.toString = function() {
    return "[object PDFDocument]";
  };
  return PDFDocument;
}).call(this);
module.exports = PDFDocument;;
  }
}).call();

(function(){
  var module = {exports:{}};
  var exports = module.exports;
  modules['fs'] = module;
  module.loader = function(){
    module.loader = null;
    var fs;
fs = module.exports;
fs.preloaded = {};
fs.readFileSync = function(filename, encoding) {
  var m, str;
  if (fs.preloaded[filename]) {
    return fs.preloaded[filename];
  } else if (m = /^data:.*;base64,(.*)/.exec(filename)) {
    return str = atob(m[1]);
  } else {
    throw new Error("file not available: " + filename);
  }
};;
  }
}).call();

(function(){
  var module = {exports:{}};
  var exports = module.exports;
  modules['./object'] = module;
  module.loader = function(){
    module.loader = null;
    /*
PDFObject - converts JavaScript types into their corrisponding PDF types.
By Devon Govett
*/
var PDFObject, PDFReference;
PDFObject = (function() {
  var pad;
  function PDFObject() {}
  pad = function(str, length) {
    return (Array(length + 1).join('0') + str).slice(-length);
  };
  PDFObject.convert = function(object) {
    var e, items, key, out, val;
    if (Array.isArray(object)) {
      items = ((function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = object.length; _i < _len; _i++) {
          e = object[_i];
          _results.push(PDFObject.convert(e));
        }
        return _results;
      })()).join(' ');
      return '[' + items + ']';
    } else if (typeof object === 'string') {
      return '/' + object;
    } else if (object != null ? object.isString : void 0) {
      return '(' + object + ')';
    } else if (object instanceof PDFReference) {
      return object.toString();
    } else if (object instanceof Date) {
      return '(D:' + pad(object.getUTCFullYear(), 4) + pad(object.getUTCMonth(), 2) + pad(object.getUTCDate(), 2) + pad(object.getUTCHours(), 2) + pad(object.getUTCMinutes(), 2) + pad(object.getUTCSeconds(), 2) + 'Z)';
    } else if ({}.toString.call(object) === '[object Object]') {
      out = ['<<'];
      for (key in object) {
        val = object[key];
        out.push('/' + key + ' ' + PDFObject.convert(val));
      }
      out.push('>>');
      return out.join('\n');
    } else {
      return '' + object;
    }
  };
  PDFObject.s = function(string) {
    string = string.replace(/\\/g, '\\\\\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
    return {
      isString: true,
      toString: function() {
        return string;
      }
    };
  };
  return PDFObject;
})();
module.exports = PDFObject;
PDFReference = require('./reference');;
  }
}).call();

(function(){
  var module = {exports:{}};
  var exports = module.exports;
  modules['./reference'] = module;
  module.loader = function(){
    module.loader = null;
    /*
PDFReference - represents a reference to another object in the PDF object heirarchy
By Devon Govett
*/
var PDFObject, PDFReference, zlib;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
zlib = require('zlib');
PDFReference = (function() {
  function PDFReference(id, data) {
    this.id = id;
    this.data = data != null ? data : {};
    this.gen = 0;
    this.stream = null;
    this.finalizedStream = null;
  }
  PDFReference.prototype.object = function(compress, fn) {
    var out;
    if (this.finalizedStream == null) {
      return this.finalize(compress, __bind(function() {
        return this.object(compress, fn);
      }, this));
    }
    out = ["" + this.id + " " + this.gen + " obj"];
    out.push(PDFObject.convert(this.data));
    if (this.stream) {
      out.push("stream");
      out.push(this.finalizedStream);
      out.push("endstream");
    }
    out.push("endobj");
    return fn(out.join('\n'));
  };
  PDFReference.prototype.add = function(s) {
    var _ref;
    if ((_ref = this.stream) == null) {
      this.stream = [];
    }
    return this.stream.push(Buffer.isBuffer(s) ? s.toString('binary') : s);
  };
  PDFReference.prototype.finalize = function(compress, fn) {
    var data, i;
    if (compress == null) {
      compress = false;
    }
    if (this.stream) {
      data = this.stream.join('\n');
      if (compress && !this.data.Filter) {
        data = new Buffer((function() {
          var _ref, _results;
          _results = [];
          for (i = 0, _ref = data.length; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
            _results.push(data.charCodeAt(i));
          }
          return _results;
        })());
        return zlib.deflate(data, __bind(function(err, compressedData) {
          if (err) {
            throw err;
          }
          this.finalizedStream = compressedData.toString('binary');
          this.data.Filter = 'FlateDecode';
          this.data.Length = this.finalizedStream.length;
          return fn();
        }, this));
      } else {
        this.finalizedStream = data;
        this.data.Length = this.finalizedStream.length;
        return fn();
      }
    } else {
      this.finalizedStream = '';
      return fn();
    }
  };
  PDFReference.prototype.toString = function() {
    return "" + this.id + " " + this.gen + " R";
  };
  return PDFReference;
})();
module.exports = PDFReference;
PDFObject = require('./object');;
  }
}).call();

(function(){
  var module = {exports:{}};
  var exports = module.exports;
  modules['./store'] = module;
  module.loader = function(){
    module.loader = null;
    /*
PDFObjectStore - stores the object heirarchy for the PDF document
By Devon Govett
*/
var PDFObjectStore, PDFReference;
PDFReference = require('./reference');
PDFObjectStore = (function() {
  function PDFObjectStore() {
    this.objects = {};
    this.length = 0;
    this.root = this.ref({
      Type: 'Catalog',
      Pages: this.ref({
        Type: 'Pages',
        Count: 0,
        Kids: []
      })
    });
    this.pages = this.root.data['Pages'];
  }
  PDFObjectStore.prototype.ref = function(data) {
    return this.push(++this.length, data);
  };
  PDFObjectStore.prototype.push = function(id, data) {
    var ref;
    ref = new PDFReference(id, data);
    this.objects[id] = ref;
    return ref;
  };
  PDFObjectStore.prototype.addPage = function(page) {
    this.pages.data['Kids'].push(page.dictionary);
    return this.pages.data['Count']++;
  };
  return PDFObjectStore;
})();
module.exports = PDFObjectStore;;
  }
}).call();

(function(){
  var module = {exports:{}};
  var exports = module.exports;
  modules['./page'] = module;
  module.loader = function(){
    module.loader = null;
    /*
PDFPage - represents a single page in the PDF document
By Devon Govett
*/
var PDFPage;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
PDFPage = (function() {
  var DEFAULT_MARGINS, SIZES;
  function PDFPage(document, options) {
    var dimensions;
    this.document = document;
    if (options == null) {
      options = {};
    }
    this.size = options.size || 'letter';
    this.layout = options.layout || 'portrait';
    if (typeof options.margin === 'number') {
      this.margins = {
        top: options.margin,
        left: options.margin,
        bottom: options.margin,
        right: options.margin
      };
    } else {
      this.margins = options.margins || DEFAULT_MARGINS;
    }
    dimensions = Array.isArray(this.size) ? this.size : SIZES[this.size.toUpperCase()];
    this.width = dimensions[this.layout === 'portrait' ? 0 : 1];
    this.height = dimensions[this.layout === 'portrait' ? 1 : 0];
    this.content = this.document.ref();
    this.dictionary = this.document.ref({
      Type: 'Page',
      Parent: this.document.store.pages,
      MediaBox: [0, 0, this.width, this.height],
      Contents: this.content
    });
    this.dictionary.data['Resources'] = this.document.ref({
      ProcSet: ['PDF', 'Text', 'ImageB', 'ImageC', 'ImageI']
    });
    this.resources = this.dictionary.data['Resources'].data;
    Object.defineProperties(this, {
      fonts: {
        get: __bind(function() {
          var _base, _ref;
          return (_ref = (_base = this.resources)['Font']) != null ? _ref : _base['Font'] = {};
        }, this)
      },
      xobjects: {
        get: __bind(function() {
          var _base, _ref;
          return (_ref = (_base = this.resources)['XObject']) != null ? _ref : _base['XObject'] = {};
        }, this)
      },
      ext_gstates: {
        get: __bind(function() {
          var _base, _ref;
          return (_ref = (_base = this.resources)['ExtGState']) != null ? _ref : _base['ExtGState'] = {};
        }, this)
      },
      annotations: {
        get: __bind(function() {
          var _base, _ref;
          return (_ref = (_base = this.dictionary.data)['Annots']) != null ? _ref : _base['Annots'] = [];
        }, this)
      }
    });
  }
  PDFPage.prototype.maxY = function() {
    return this.height - this.margins.bottom;
  };
  PDFPage.prototype.finalize = function(fn) {
    return this.content.finalize(this.document.compress, fn);
  };
  DEFAULT_MARGINS = {
    top: 72,
    left: 72,
    bottom: 72,
    right: 72
  };
  SIZES = {
    '4A0': [4767.87, 6740.79],
    '2A0': [3370.39, 4767.87],
    A0: [2383.94, 3370.39],
    A1: [1683.78, 2383.94],
    A2: [1190.55, 1683.78],
    A3: [841.89, 1190.55],
    A4: [595.28, 841.89],
    A5: [419.53, 595.28],
    A6: [297.64, 419.53],
    A7: [209.76, 297.64],
    A8: [147.40, 209.76],
    A9: [104.88, 147.40],
    A10: [73.70, 104.88],
    B0: [2834.65, 4008.19],
    B1: [2004.09, 2834.65],
    B2: [1417.32, 2004.09],
    B3: [1000.63, 1417.32],
    B4: [708.66, 1000.63],
    B5: [498.90, 708.66],
    B6: [354.33, 498.90],
    B7: [249.45, 354.33],
    B8: [175.75, 249.45],
    B9: [124.72, 175.75],
    B10: [87.87, 124.72],
    C0: [2599.37, 3676.54],
    C1: [1836.85, 2599.37],
    C2: [1298.27, 1836.85],
    C3: [918.43, 1298.27],
    C4: [649.13, 918.43],
    C5: [459.21, 649.13],
    C6: [323.15, 459.21],
    C7: [229.61, 323.15],
    C8: [161.57, 229.61],
    C9: [113.39, 161.57],
    C10: [79.37, 113.39],
    RA0: [2437.80, 3458.27],
    RA1: [1729.13, 2437.80],
    RA2: [1218.90, 1729.13],
    RA3: [864.57, 1218.90],
    RA4: [609.45, 864.57],
    SRA0: [2551.18, 3628.35],
    SRA1: [1814.17, 2551.18],
    SRA2: [1275.59, 1814.17],
    SRA3: [907.09, 1275.59],
    SRA4: [637.80, 907.09],
    EXECUTIVE: [521.86, 756.00],
    FOLIO: [612.00, 936.00],
    LEGAL: [612.00, 1008.00],
    LETTER: [612.00, 792.00],
    TABLOID: [792.00, 1224.00]
  };
  return PDFPage;
})();
module.exports = PDFPage;;
  }
}).call();

(function(){
  var module = {exports:{}};
  var exports = module.exports;
  modules['./mixins/color'] = module;
  module.loader = function(){
    module.loader = null;
    var namedColors;
module.exports = {
  initColor: function() {
    this._opacityRegistry = {};
    return this._opacityCount = 0;
  },
  _normalizeColor: function(color) {
    var hex, part;
    if (typeof color === 'string') {
      if (color.charAt(0) === '#') {
        if (color.length === 4) {
          color = color.replace(/#([0-9A-F])([0-9A-F])([0-9A-F])/i, "#$1$1$2$2$3$3");
        }
        hex = parseInt(color.slice(1), 16);
        color = [hex >> 16, hex >> 8 & 0xff, hex & 0xff];
      } else if (namedColors[color]) {
        color = namedColors[color];
      }
    }
    if (Array.isArray(color)) {
      if (color.length === 3) {
        color = (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = color.length; _i < _len; _i++) {
            part = color[_i];
            _results.push(part / 255);
          }
          return _results;
        })();
      } else if (color.length === 4) {
        color = (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = color.length; _i < _len; _i++) {
            part = color[_i];
            _results.push(part / 100);
          }
          return _results;
        })();
      }
      return color;
    }
    return null;
  },
  fillColor: function(color, opacity) {
    var op;
    color = this._normalizeColor(color);
    if (!color) {
      return this;
    }
    if (opacity != null) {
      this.fillOpacity(opacity);
    }
    color = color.join(' ');
    op = color.length === 4 ? 'k' : 'rg';
    return this.addContent("" + color + " " + op);
  },
  strokeColor: function(color, opacity) {
    var op;
    color = this._normalizeColor(color);
    if (!color) {
      return this;
    }
    if (opacity != null) {
      this.strokeOpacity(opacity);
    }
    color = color.join(' ');
    op = color.length === 4 ? 'K' : 'RG';
    return this.addContent("" + color + " " + op);
  },
  opacity: function(opacity) {
    return this._doOpacity(opacity, opacity);
  },
  fillOpacity: function(opacity) {
    return this._doOpacity(opacity, null);
  },
  strokeOpacity: function(opacity) {
    return this._doOpacity(null, opacity);
  },
  _doOpacity: function(fillOpacity, strokeOpacity) {
    var dictionary, id, key, name, _ref;
    if (!(fillOpacity || strokeOpacity)) {
      return;
    }
    fillOpacity = Math.max(0, Math.min(1, fillOpacity));
    strokeOpacity = Math.max(0, Math.min(1, strokeOpacity));
    key = "" + fillOpacity + "_" + strokeOpacity;
    if (this._opacityRegistry[key]) {
      _ref = this._opacityRegistry[key], dictionary = _ref[0], name = _ref[1];
    } else {
      dictionary = {
        Type: 'ExtGState'
      };
      if (fillOpacity) {
        dictionary.ca = fillOpacity;
      }
      if (strokeOpacity) {
        dictionary.CA = strokeOpacity;
      }
      dictionary = this.ref(dictionary);
      id = ++this._opacityCount;
      name = "Gs" + id;
      this._opacityRegistry[key] = [dictionary, name];
    }
    this.page.ext_gstates[name] = dictionary;
    return this.addContent("/" + name + " gs");
  }
};
namedColors = {
  aliceblue: [240, 248, 255],
  antiquewhite: [250, 235, 215],
  aqua: [0, 255, 255],
  aquamarine: [127, 255, 212],
  azure: [240, 255, 255],
  beige: [245, 245, 220],
  bisque: [255, 228, 196],
  black: [0, 0, 0],
  blanchedalmond: [255, 235, 205],
  blue: [0, 0, 255],
  blueviolet: [138, 43, 226],
  brown: [165, 42, 42],
  burlywood: [222, 184, 135],
  cadetblue: [95, 158, 160],
  chartreuse: [127, 255, 0],
  chocolate: [210, 105, 30],
  coral: [255, 127, 80],
  cornflowerblue: [100, 149, 237],
  cornsilk: [255, 248, 220],
  crimson: [220, 20, 60],
  cyan: [0, 255, 255],
  darkblue: [0, 0, 139],
  darkcyan: [0, 139, 139],
  darkgoldenrod: [184, 134, 11],
  darkgray: [169, 169, 169],
  darkgreen: [0, 100, 0],
  darkgrey: [169, 169, 169],
  darkkhaki: [189, 183, 107],
  darkmagenta: [139, 0, 139],
  darkolivegreen: [85, 107, 47],
  darkorange: [255, 140, 0],
  darkorchid: [153, 50, 204],
  darkred: [139, 0, 0],
  darksalmon: [233, 150, 122],
  darkseagreen: [143, 188, 143],
  darkslateblue: [72, 61, 139],
  darkslategray: [47, 79, 79],
  darkslategrey: [47, 79, 79],
  darkturquoise: [0, 206, 209],
  darkviolet: [148, 0, 211],
  deeppink: [255, 20, 147],
  deepskyblue: [0, 191, 255],
  dimgray: [105, 105, 105],
  dimgrey: [105, 105, 105],
  dodgerblue: [30, 144, 255],
  firebrick: [178, 34, 34],
  floralwhite: [255, 250, 240],
  forestgreen: [34, 139, 34],
  fuchsia: [255, 0, 255],
  gainsboro: [220, 220, 220],
  ghostwhite: [248, 248, 255],
  gold: [255, 215, 0],
  goldenrod: [218, 165, 32],
  gray: [128, 128, 128],
  grey: [128, 128, 128],
  green: [0, 128, 0],
  greenyellow: [173, 255, 47],
  honeydew: [240, 255, 240],
  hotpink: [255, 105, 180],
  indianred: [205, 92, 92],
  indigo: [75, 0, 130],
  ivory: [255, 255, 240],
  khaki: [240, 230, 140],
  lavender: [230, 230, 250],
  lavenderblush: [255, 240, 245],
  lawngreen: [124, 252, 0],
  lemonchiffon: [255, 250, 205],
  lightblue: [173, 216, 230],
  lightcoral: [240, 128, 128],
  lightcyan: [224, 255, 255],
  lightgoldenrodyellow: [250, 250, 210],
  lightgray: [211, 211, 211],
  lightgreen: [144, 238, 144],
  lightgrey: [211, 211, 211],
  lightpink: [255, 182, 193],
  lightsalmon: [255, 160, 122],
  lightseagreen: [32, 178, 170],
  lightskyblue: [135, 206, 250],
  lightslategray: [119, 136, 153],
  lightslategrey: [119, 136, 153],
  lightsteelblue: [176, 196, 222],
  lightyellow: [255, 255, 224],
  lime: [0, 255, 0],
  limegreen: [50, 205, 50],
  linen: [250, 240, 230],
  magenta: [255, 0, 255],
  maroon: [128, 0, 0],
  mediumaquamarine: [102, 205, 170],
  mediumblue: [0, 0, 205],
  mediumorchid: [186, 85, 211],
  mediumpurple: [147, 112, 219],
  mediumseagreen: [60, 179, 113],
  mediumslateblue: [123, 104, 238],
  mediumspringgreen: [0, 250, 154],
  mediumturquoise: [72, 209, 204],
  mediumvioletred: [199, 21, 133],
  midnightblue: [25, 25, 112],
  mintcream: [245, 255, 250],
  mistyrose: [255, 228, 225],
  moccasin: [255, 228, 181],
  navajowhite: [255, 222, 173],
  navy: [0, 0, 128],
  oldlace: [253, 245, 230],
  olive: [128, 128, 0],
  olivedrab: [107, 142, 35],
  orange: [255, 165, 0],
  orangered: [255, 69, 0],
  orchid: [218, 112, 214],
  palegoldenrod: [238, 232, 170],
  palegreen: [152, 251, 152],
  paleturquoise: [175, 238, 238],
  palevioletred: [219, 112, 147],
  papayawhip: [255, 239, 213],
  peachpuff: [255, 218, 185],
  peru: [205, 133, 63],
  pink: [255, 192, 203],
  plum: [221, 160, 221],
  powderblue: [176, 224, 230],
  purple: [128, 0, 128],
  red: [255, 0, 0],
  rosybrown: [188, 143, 143],
  royalblue: [65, 105, 225],
  saddlebrown: [139, 69, 19],
  salmon: [250, 128, 114],
  sandybrown: [244, 164, 96],
  seagreen: [46, 139, 87],
  seashell: [255, 245, 238],
  sienna: [160, 82, 45],
  silver: [192, 192, 192],
  skyblue: [135, 206, 235],
  slateblue: [106, 90, 205],
  slategray: [112, 128, 144],
  slategrey: [112, 128, 144],
  snow: [255, 250, 250],
  springgreen: [0, 255, 127],
  steelblue: [70, 130, 180],
  tan: [210, 180, 140],
  teal: [0, 128, 128],
  thistle: [216, 191, 216],
  tomato: [255, 99, 71],
  turquoise: [64, 224, 208],
  violet: [238, 130, 238],
  wheat: [245, 222, 179],
  white: [255, 255, 255],
  whitesmoke: [245, 245, 245],
  yellow: [255, 255, 0],
  yellowgreen: [154, 205, 50]
};;
  }
}).call();

(function(){
  var module = {exports:{}};
  var exports = module.exports;
  modules['../path'] = module;
  module.loader = function(){
    module.loader = null;
    var SVGPath;
SVGPath = (function() {
  var apply, arcToSegments, cx, cy, parameters, parse, px, py, runners, segmentToBezier, solveArc, sx, sy;
  function SVGPath() {}
  SVGPath.apply = function(doc, path) {
    var commands;
    commands = parse(path);
    return apply(commands, doc);
  };
  parameters = {
    A: 7,
    a: 7,
    C: 6,
    c: 6,
    H: 1,
    h: 1,
    L: 2,
    l: 2,
    M: 2,
    m: 2,
    Q: 4,
    q: 4,
    S: 4,
    s: 4,
    T: 2,
    t: 2,
    V: 1,
    v: 1,
    Z: 0,
    z: 0
  };
  parse = function(path) {
    var args, c, cmd, curArg, foundDecimal, params, ret, _i, _len;
    ret = [];
    args = [];
    curArg = "";
    foundDecimal = false;
    params = 0;
    for (_i = 0, _len = path.length; _i < _len; _i++) {
      c = path[_i];
      if (parameters[c] != null) {
        params = parameters[c];
        if (cmd) {
          if (curArg.length > 0) {
            args[args.length] = +curArg;
          }
          ret[ret.length] = {
            cmd: cmd,
            args: args
          };
          args = [];
          curArg = "";
          foundDecimal = false;
        }
        cmd = c;
      } else if ((c === " " || c === ",") || (c === "-" && curArg.length > 0 && curArg[curArg.length - 1] !== 'e') || (c === "." && foundDecimal)) {
        if (curArg.length === 0) {
          continue;
        }
        if (args.length === params) {
          ret[ret.length] = {
            cmd: cmd,
            args: args
          };
          args = [+curArg];
          if (cmd === "M") {
            cmd = "L";
          }
          if (cmd === "m") {
            cmd = "l";
          }
        } else {
          args[args.length] = +curArg;
        }
        foundDecimal = c === ".";
        curArg = c === '-' || c === '.' ? c : '';
      } else {
        curArg += c;
        if (c === '.') {
          foundDecimal = true;
        }
      }
    }
    if (curArg.length > 0) {
      args[args.length] = +curArg;
    }
    ret[ret.length] = {
      cmd: cmd,
      args: args
    };
    return ret;
  };
  cx = cy = px = py = sx = sy = 0;
  apply = function(commands, doc) {
    var c, i, _len, _name;
    cx = cy = px = py = sx = sy = 0;
    for (i = 0, _len = commands.length; i < _len; i++) {
      c = commands[i];
      if (typeof runners[_name = c.cmd] === "function") {
        runners[_name](doc, c.args);
      }
    }
    return cx = cy = px = py = 0;
  };
  runners = {
    M: function(doc, a) {
      cx = a[0];
      cy = a[1];
      px = py = null;
      sx = cx;
      sy = cy;
      return doc.moveTo(cx, cy);
    },
    m: function(doc, a) {
      cx += a[0];
      cy += a[1];
      px = py = null;
      sx = cx;
      sy = cy;
      return doc.moveTo(cx, cy);
    },
    C: function(doc, a) {
      cx = a[4];
      cy = a[5];
      px = a[2];
      py = a[3];
      return doc.bezierCurveTo.apply(doc, a);
    },
    c: function(doc, a) {
      doc.bezierCurveTo(a[0] + cx, a[1] + cy, a[2] + cx, a[3] + cy, a[4] + cx, a[5] + cy);
      px = cx + a[2];
      py = cy + a[3];
      cx += a[4];
      return cy += a[5];
    },
    S: function(doc, a) {
      if (px === null) {
        px = cx;
        py = cy;
      }
      doc.bezierCurveTo(cx - (px - cx), cy - (py - cy), a[0], a[1], a[2], a[3]);
      px = a[0];
      py = a[1];
      cx = a[2];
      return cy = a[3];
    },
    s: function(doc, a) {
      doc.bezierCurveTo(cx - (px - cx), cy - (py - cy), cx + a[0], cy + a[1], cx + a[2], cy + a[3]);
      px = cx + a[0];
      py = cy + a[1];
      cx += a[2];
      return cy += a[3];
    },
    Q: function(doc, a) {
      px = a[0];
      py = a[1];
      cx = a[2];
      cy = a[3];
      return doc.quadraticCurveTo(a[0], a[1], cx, cy);
    },
    q: function(doc, a) {
      doc.quadraticCurveTo(a[0] + cx, a[1] + cy, a[2] + cx, a[3] + cy);
      px = cx + a[0];
      py = cy + a[1];
      cx += a[2];
      return cy += a[3];
    },
    T: function(doc, a) {
      if (px === null) {
        px = cx;
        py = cy;
      } else {
        px = cx - (px - cx);
        py = cy - (py - cy);
      }
      doc.quadraticCurveTo(px, py, a[0], a[1]);
      px = cx - (px - cx);
      py = cy - (py - cy);
      cx = a[0];
      return cy = a[1];
    },
    t: function(doc, a) {
      if (px === null) {
        px = cx;
        py = cy;
      } else {
        px = cx - (px - cx);
        py = cy - (py - cy);
      }
      doc.quadraticCurveTo(px, py, cx + a[0], cy + a[1]);
      cx += a[0];
      return cy += a[1];
    },
    A: function(doc, a) {
      solveArc(doc, cx, cy, a);
      cx = a[5];
      return cy = a[6];
    },
    a: function(doc, a) {
      a[5] += cx;
      a[6] += cy;
      solveArc(doc, cx, cy, a);
      cx = a[5];
      return cy = a[6];
    },
    L: function(doc, a) {
      cx = a[0];
      cy = a[1];
      px = py = null;
      return doc.lineTo(cx, cy);
    },
    l: function(doc, a) {
      cx += a[0];
      cy += a[1];
      px = py = null;
      return doc.lineTo(cx, cy);
    },
    H: function(doc, a) {
      cx = a[0];
      px = py = null;
      return doc.lineTo(cx, cy);
    },
    h: function(doc, a) {
      cx += a[0];
      px = py = null;
      return doc.lineTo(cx, cy);
    },
    V: function(doc, a) {
      cy = a[0];
      px = py = null;
      return doc.lineTo(cx, cy);
    },
    v: function(doc, a) {
      cy += a[0];
      px = py = null;
      return doc.lineTo(cx, cy);
    },
    Z: function(doc) {
      doc.closePath();
      cx = sx;
      return cy = sy;
    },
    z: function(doc) {
      doc.closePath();
      cx = sx;
      return cy = sy;
    }
  };
  solveArc = function(doc, x, y, coords) {
    var bez, ex, ey, large, rot, rx, ry, seg, segs, sweep, _i, _len, _results;
    rx = coords[0], ry = coords[1], rot = coords[2], large = coords[3], sweep = coords[4], ex = coords[5], ey = coords[6];
    segs = arcToSegments(ex, ey, rx, ry, large, sweep, rot, x, y);
    _results = [];
    for (_i = 0, _len = segs.length; _i < _len; _i++) {
      seg = segs[_i];
      bez = segmentToBezier.apply(null, seg);
      _results.push(doc.bezierCurveTo.apply(doc, bez));
    }
    return _results;
  };
  arcToSegments = function(x, y, rx, ry, large, sweep, rotateX, ox, oy) {
    var a00, a01, a10, a11, cos_th, d, i, pl, result, segments, sfactor, sfactor_sq, sin_th, th, th0, th1, th2, th3, th_arc, x0, x1, xc, y0, y1, yc;
    th = rotateX * (Math.PI / 180);
    sin_th = Math.sin(th);
    cos_th = Math.cos(th);
    rx = Math.abs(rx);
    ry = Math.abs(ry);
    px = cos_th * (ox - x) * 0.5 + sin_th * (oy - y) * 0.5;
    py = cos_th * (oy - y) * 0.5 - sin_th * (ox - x) * 0.5;
    pl = (px * px) / (rx * rx) + (py * py) / (ry * ry);
    if (pl > 1) {
      pl = Math.sqrt(pl);
      rx *= pl;
      ry *= pl;
    }
    a00 = cos_th / rx;
    a01 = sin_th / rx;
    a10 = (-sin_th) / ry;
    a11 = cos_th / ry;
    x0 = a00 * ox + a01 * oy;
    y0 = a10 * ox + a11 * oy;
    x1 = a00 * x + a01 * y;
    y1 = a10 * x + a11 * y;
    d = (x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0);
    sfactor_sq = 1 / d - 0.25;
    if (sfactor_sq < 0) {
      sfactor_sq = 0;
    }
    sfactor = Math.sqrt(sfactor_sq);
    if (sweep === large) {
      sfactor = -sfactor;
    }
    xc = 0.5 * (x0 + x1) - sfactor * (y1 - y0);
    yc = 0.5 * (y0 + y1) + sfactor * (x1 - x0);
    th0 = Math.atan2(y0 - yc, x0 - xc);
    th1 = Math.atan2(y1 - yc, x1 - xc);
    th_arc = th1 - th0;
    if (th_arc < 0 && sweep === 1) {
      th_arc += 2 * Math.PI;
    } else if (th_arc > 0 && sweep === 0) {
      th_arc -= 2 * Math.PI;
    }
    segments = Math.ceil(Math.abs(th_arc / (Math.PI * 0.5 + 0.001)));
    result = [];
    for (i = 0; 0 <= segments ? i < segments : i > segments; 0 <= segments ? i++ : i--) {
      th2 = th0 + i * th_arc / segments;
      th3 = th0 + (i + 1) * th_arc / segments;
      result[i] = [xc, yc, th2, th3, rx, ry, sin_th, cos_th];
    }
    return result;
  };
  segmentToBezier = function(cx, cy, th0, th1, rx, ry, sin_th, cos_th) {
    var a00, a01, a10, a11, t, th_half, x1, x2, x3, y1, y2, y3;
    a00 = cos_th * rx;
    a01 = -sin_th * ry;
    a10 = sin_th * rx;
    a11 = cos_th * ry;
    th_half = 0.5 * (th1 - th0);
    t = (8 / 3) * Math.sin(th_half * 0.5) * Math.sin(th_half * 0.5) / Math.sin(th_half);
    x1 = cx + Math.cos(th0) - t * Math.sin(th0);
    y1 = cy + Math.sin(th0) + t * Math.cos(th0);
    x3 = cx + Math.cos(th1);
    y3 = cy + Math.sin(th1);
    x2 = x3 + t * Math.sin(th1);
    y2 = y3 - t * Math.cos(th1);
    return [a00 * x1 + a01 * y1, a10 * x1 + a11 * y1, a00 * x2 + a01 * y2, a10 * x2 + a11 * y2, a00 * x3 + a01 * y3, a10 * x3 + a11 * y3];
  };
  return SVGPath;
})();
module.exports = SVGPath;;
  }
}).call();

(function(){
  var module = {exports:{}};
  var exports = module.exports;
  modules['./mixins/vector'] = module;
  module.loader = function(){
    module.loader = null;
    var KAPPA, SVGPath;
var __slice = Array.prototype.slice;
SVGPath = require('../path');
KAPPA = 4.0 * ((Math.sqrt(2) - 1.0) / 3.0);
module.exports = {
  save: function() {
    return this.addContent('q');
  },
  restore: function() {
    return this.addContent('Q');
  },
  closePath: function() {
    return this.addContent('h');
  },
  lineWidth: function(w) {
    return this.addContent("" + w + " w");
  },
  _CAP_STYLES: {
    BUTT: 0,
    ROUND: 1,
    SQUARE: 2
  },
  lineCap: function(c) {
    if (typeof c === 'string') {
      c = this._CAP_STYLES[c.toUpperCase()];
    }
    return this.addContent("" + c + " J");
  },
  _JOIN_STYLES: {
    MITER: 0,
    ROUND: 1,
    BEVEL: 2
  },
  lineJoin: function(j) {
    if (typeof j === 'string') {
      j = this._JOIN_STYLES[j.toUpperCase()];
    }
    return this.addContent("" + j + " j");
  },
  miterLimit: function(m) {
    return this.addContent("" + m + " M");
  },
  dash: function(length, options) {
    var phase, space;
    if (options == null) {
      options = {};
    }
    if (length == null) {
      return this;
    }
    space = options.space || length;
    phase = options.phase || 0;
    return this.addContent("[" + length + " " + space + "] " + phase + " d");
  },
  undash: function() {
    return this.addContent("[] 0 d");
  },
  moveTo: function(x, y) {
    y = this.page.height - y;
    return this.addContent("" + x + " " + y + " m");
  },
  lineTo: function(x, y) {
    y = this.page.height - y;
    return this.addContent("" + x + " " + y + " l");
  },
  bezierCurveTo: function(cp1x, cp1y, cp2x, cp2y, x, y) {
    cp1y = this.page.height - cp1y;
    cp2y = this.page.height - cp2y;
    y = this.page.height - y;
    return this.addContent("" + cp1x + " " + cp1y + " " + cp2x + " " + cp2y + " " + x + " " + y + " c");
  },
  quadraticCurveTo: function(cpx, cpy, x, y) {
    cpy = this.page.height - cpy;
    y = this.page.height - y;
    return this.addContent("" + cpx + " " + cpy + " " + x + " " + y + " v");
  },
  rect: function(x, y, w, h) {
    y = this.page.height - y - h;
    return this.addContent("" + x + " " + y + " " + w + " " + h + " re");
  },
  roundedRect: function(x, y, w, h, r) {
    if (r == null) {
      r = 0;
    }
    this.moveTo(x + r, y);
    this.lineTo(x + w - r, y);
    this.quadraticCurveTo(x + w, y, x + w, y + r);
    this.lineTo(x + w, y + h - r);
    this.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    this.lineTo(x + r, y + h);
    this.quadraticCurveTo(x, y + h, x, y + h - r);
    this.lineTo(x, y + r);
    return this.quadraticCurveTo(x, y, x + r, y);
  },
  ellipse: function(x, y, r1, r2) {
    var l1, l2;
    if (r2 == null) {
      r2 = r1;
    }
    l1 = r1 * KAPPA;
    l2 = r2 * KAPPA;
    this.moveTo(x + r1, y);
    this.bezierCurveTo(x + r1, y + l1, x + l2, y + r2, x, y + r2);
    this.bezierCurveTo(x - l2, y + r2, x - r1, y + l1, x - r1, y);
    this.bezierCurveTo(x - r1, y - l1, x - l2, y - r2, x, y - r2);
    this.bezierCurveTo(x + l2, y - r2, x + r1, y - l1, x + r1, y);
    return this.moveTo(x, y);
  },
  circle: function(x, y, radius) {
    return this.ellipse(x, y, radius);
  },
  polygon: function() {
    var point, points, _i, _len;
    points = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    this.moveTo.apply(this, points.shift());
    for (_i = 0, _len = points.length; _i < _len; _i++) {
      point = points[_i];
      this.lineTo.apply(this, point);
    }
    return this.closePath();
  },
  path: function(path) {
    SVGPath.apply(this, path);
    return this;
  },
  _windingRule: function(rule) {
    if (/even-?odd/.test(rule)) {
      return '*';
    }
    return '';
  },
  fill: function(color, rule) {
    if (/(even-?odd)|(non-?zero)/.test(color)) {
      rule = color;
      color = null;
    }
    if (color) {
      this.fillColor(color);
    }
    return this.addContent('f' + this._windingRule(rule));
  },
  stroke: function(color) {
    if (color) {
      this.strokeColor(color);
    }
    return this.addContent('S');
  },
  fillAndStroke: function(fillColor, strokeColor, rule) {
    var isFillRule;
    if (strokeColor == null) {
      strokeColor = fillColor;
    }
    isFillRule = /(even-?odd)|(non-?zero)/;
    if (isFillRule.test(fillColor)) {
      rule = fillColor;
      fillColor = null;
    }
    if (isFillRule.test(strokeColor)) {
      rule = strokeColor;
      strokeColor = fillColor;
    }
    if (fillColor) {
      this.fillColor(fillColor);
      this.strokeColor(strokeColor);
    }
    return this.addContent('B' + this._windingRule(rule));
  },
  clip: function(rule) {
    return this.addContent('W' + this._windingRule(rule) + ' n');
  },
  transform: function(m11, m12, m21, m22, dx, dy) {
    var v, values;
    values = ((function() {
      var _i, _len, _ref, _results;
      _ref = [m11, m12, m21, m22, dx, dy];
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        v = _ref[_i];
        _results.push(+v.toFixed(5));
      }
      return _results;
    })()).join(' ');
    return this.addContent("" + values + " cm");
  },
  translate: function(x, y) {
    return this.transform(1, 0, 0, 1, x, -y);
  },
  rotate: function(angle, options) {
    var cos, rad, sin, x, x1, y, y1;
    if (options == null) {
      options = {};
    }
    rad = angle * Math.PI / 180;
    cos = Math.cos(rad);
    sin = Math.sin(rad);
    x = y = 0;
    if (options.origin != null) {
      x = options.origin[0];
      y = this.page.height - options.origin[1];
      x1 = x * cos - y * sin;
      y1 = x * sin + y * cos;
      x -= x1;
      y -= y1;
    }
    return this.transform(cos, sin, -sin, cos, x, y);
  },
  scale: function(factor, options) {
    var x, y;
    if (options == null) {
      options = {};
    }
    x = y = 0;
    if (options.origin != null) {
      x = options.origin[0];
      y = this.page.height - options.origin[1];
      x -= factor * x;
      y -= factor * y;
    }
    return this.transform(factor, 0, 0, factor, x, y);
  }
};;
  }
}).call();

(function(){
  var module = {exports:{}};
  var exports = module.exports;
  modules['./font/afm'] = module;
  module.loader = function(){
    module.loader = null;
    var AFMFont, fs;
fs = require('fs');
AFMFont = (function() {
  var characters;
  AFMFont.open = function(filename) {
    return new AFMFont(filename);
  };
  function AFMFont(filename) {
    var e, i;
    this.contents = fs.readFileSync(filename, 'utf8');
    this.attributes = {};
    this.glyphWidths = {};
    this.boundingBoxes = {};
    this.parse();
    this.charWidths = (function() {
      var _results;
      _results = [];
      for (i = 0; i <= 255; i++) {
        _results.push(this.glyphWidths[characters[i]]);
      }
      return _results;
    }).call(this);
    this.bbox = (function() {
      var _i, _len, _ref, _results;
      _ref = this.attributes['FontBBox'].split(/\s+/);
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        e = _ref[_i];
        _results.push(+e);
      }
      return _results;
    }).call(this);
    this.ascender = +this.attributes['Ascender'];
    this.decender = +this.attributes['Descender'];
    this.lineGap = (this.bbox[3] - this.bbox[1]) - (this.ascender - this.decender);
  }
  AFMFont.prototype.parse = function() {
    var a, key, line, match, name, section, value, _i, _len, _ref, _results;
    section = '';
    _ref = this.contents.split('\n');
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      line = _ref[_i];
      if (match = line.match(/^Start(\w+)/)) {
        section = match[1];
        continue;
      } else if (match = line.match(/^End(\w+)/)) {
        section = '';
        continue;
      }
      switch (section) {
        case 'FontMetrics':
          match = line.match(/(^\w+)\s+(.*)/);
          key = match[1];
          value = match[2];
          if (a = this.attributes[key]) {
            if (!Array.isArray(a)) {
              a = this.attributes[key] = [a];
            }
            a.push(value);
          } else {
            this.attributes[key] = value;
          }
          break;
        case 'CharMetrics':
          if (!/^CH?\s/.test(line)) {
            continue;
          }
          name = line.match(/\bN\s+(\.?\w+)\s*;/)[1];
          this.glyphWidths[name] = +line.match(/\bWX\s+(\d+)\s*;/)[1];
      }
    }
    return _results;
  };
  characters = '.notdef       .notdef        .notdef        .notdef\n.notdef       .notdef        .notdef        .notdef\n.notdef       .notdef        .notdef        .notdef\n.notdef       .notdef        .notdef        .notdef\n.notdef       .notdef        .notdef        .notdef\n.notdef       .notdef        .notdef        .notdef\n.notdef       .notdef        .notdef        .notdef\n.notdef       .notdef        .notdef        .notdef\n\nspace         exclam         quotedbl       numbersign\ndollar        percent        ampersand      quotesingle\nparenleft     parenright     asterisk       plus\ncomma         hyphen         period         slash\nzero          one            two            three\nfour          five           six            seven\neight         nine           colon          semicolon\nless          equal          greater        question\n\nat            A              B              C\nD             E              F              G\nH             I              J              K\nL             M              N              O\nP             Q              R              S\nT             U              V              W\nX             Y              Z              bracketleft\nbackslash     bracketright   asciicircum    underscore\n\ngrave         a              b              c\nd             e              f              g\nh             i              j              k\nl             m              n              o\np             q              r              s\nt             u              v              w\nx             y              z              braceleft\nbar           braceright     asciitilde     .notdef\n\nEuro          .notdef        quotesinglbase florin\nquotedblbase  ellipsis       dagger         daggerdbl\ncircumflex    perthousand    Scaron         guilsinglleft\nOE            .notdef        Zcaron         .notdef\n.notdef       quoteleft      quoteright     quotedblleft\nquotedblright bullet         endash         emdash\ntilde         trademark      scaron         guilsinglright\noe            .notdef        zcaron         ydieresis\n\nspace         exclamdown     cent           sterling\ncurrency      yen            brokenbar      section\ndieresis      copyright      ordfeminine    guillemotleft\nlogicalnot    hyphen         registered     macron\ndegree        plusminus      twosuperior    threesuperior\nacute         mu             paragraph      periodcentered\ncedilla       onesuperior    ordmasculine   guillemotright\nonequarter    onehalf        threequarters  questiondown\n\nAgrave        Aacute         Acircumflex    Atilde\nAdieresis     Aring          AE             Ccedilla\nEgrave        Eacute         Ecircumflex    Edieresis\nIgrave        Iacute         Icircumflex    Idieresis\nEth           Ntilde         Ograve         Oacute\nOcircumflex   Otilde         Odieresis      multiply\nOslash        Ugrave         Uacute         Ucircumflex\nUdieresis     Yacute         Thorn          germandbls\n\nagrave        aacute         acircumflex    atilde\nadieresis     aring          ae             ccedilla\negrave        eacute         ecircumflex    edieresis\nigrave        iacute         icircumflex    idieresis\neth           ntilde         ograve         oacute\nocircumflex   otilde         odieresis      divide\noslash        ugrave         uacute         ucircumflex\nudieresis     yacute         thorn          ydieresis'.split(/\s+/);
  return AFMFont;
})();
module.exports = AFMFont;;
  }
}).call();

(function(){
  var module = {exports:{}};
  var exports = module.exports;
  modules['../font'] = module;
  module.loader = function(){
    module.loader = null;
    /*
PDFFont - embeds fonts in PDF documents
By Devon Govett
*/
var AFMFont, PDFFont, Subset, TTFFont, zlib;
var __indexOf = Array.prototype.indexOf || function(item) {
  for (var i = 0, l = this.length; i < l; i++) {
    if (this[i] === item) return i;
  }
  return -1;
}, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
TTFFont = require('./font/ttf');
AFMFont = require('./font/afm');
Subset = require('./font/subset');
zlib = require('zlib');
PDFFont = (function() {
  var toUnicodeCmap;
  function PDFFont(document, filename, family, id) {
    var _ref;
    this.document = document;
    this.filename = filename;
    this.family = family;
    this.id = id;
    if (_ref = this.filename, __indexOf.call(this._standardFonts, _ref) >= 0) {
      this.embedStandard();
    } else if (/\.(ttf|ttc)$/i.test(this.filename)) {
      this.ttf = TTFFont.open(this.filename, this.family);
      this.subset = new Subset(this.ttf);
      this.registerTTF();
    } else if (/\.dfont$/i.test(this.filename)) {
      this.ttf = TTFFont.fromDFont(this.filename, this.family);
      this.subset = new Subset(this.ttf);
      this.registerTTF();
    } else {
      throw new Error('Not a supported font format or standard PDF font.');
    }
  }
  PDFFont.prototype.use = function(characters) {
    var _ref;
    return (_ref = this.subset) != null ? _ref.use(characters) : void 0;
  };
  PDFFont.prototype.embed = function(fn) {
    if (this.isAFM) {
      return fn();
    }
    return this.embedTTF(fn);
  };
  PDFFont.prototype.encode = function(text) {
    var _ref;
    return ((_ref = this.subset) != null ? _ref.encodeText(text) : void 0) || text;
  };
  PDFFont.prototype.registerTTF = function() {
    var e, gid, hi, i, low, raw, _ref;
    this.scaleFactor = 1000.0 / this.ttf.head.unitsPerEm;
    this.bbox = (function() {
      var _i, _len, _ref, _results;
      _ref = this.ttf.bbox;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        e = _ref[_i];
        _results.push(Math.round(e * this.scaleFactor));
      }
      return _results;
    }).call(this);
    this.stemV = 0;
    if (this.ttf.post.exists) {
      raw = this.ttf.post.italic_angle;
      hi = raw >> 16;
      low = raw & 0xFF;
      if (hi & 0x8000 !== 0) {
        hi = -((hi ^ 0xFFFF) + 1);
      }
      this.italicAngle = +("" + hi + "." + low);
    } else {
      this.italicAngle = 0;
    }
    this.ascender = Math.round(this.ttf.ascender * this.scaleFactor);
    this.decender = Math.round(this.ttf.decender * this.scaleFactor);
    this.lineGap = Math.round(this.ttf.lineGap * this.scaleFactor);
    this.capHeight = (this.ttf.os2.exists && this.ttf.os2.capHeight) || this.ascender;
    this.xHeight = (this.ttf.os2.exists && this.ttf.os2.xHeight) || 0;
    this.familyClass = (this.ttf.os2.exists && this.ttf.os2.familyClass || 0) >> 8;
    this.isSerif = (_ref = this.familyClass) === 1 || _ref === 2 || _ref === 3 || _ref === 4 || _ref === 5 || _ref === 7;
    this.isScript = this.familyClass === 10;
    this.flags = 0;
    if (this.ttf.post.isFixedPitch) {
      this.flags |= 1 << 0;
    }
    if (this.isSerif) {
      this.flags |= 1 << 1;
    }
    if (this.isScript) {
      this.flags |= 1 << 3;
    }
    if (this.italicAngle !== 0) {
      this.flags |= 1 << 6;
    }
    this.flags |= 1 << 5;
    this.cmap = this.ttf.cmap.unicode;
    if (!this.cmap) {
      throw new Error('No unicode cmap for font');
    }
    this.hmtx = this.ttf.hmtx;
    this.charWidths = (function() {
      var _ref2, _results;
      _ref2 = this.cmap.codeMap;
      _results = [];
      for (i in _ref2) {
        gid = _ref2[i];
        if (i >= 32) {
          _results.push(Math.round(this.hmtx.widths[gid] * this.scaleFactor));
        }
      }
      return _results;
    }).call(this);
    return this.ref = this.document.ref({
      Type: 'Font',
      Subtype: 'TrueType'
    });
  };
  PDFFont.prototype.embedTTF = function(fn) {
    var data;
    data = this.subset.encode();
    return zlib.deflate(data, __bind(function(err, compressedData) {
      var charWidths, cmap, code, firstChar, glyph, key, ref, val;
      if (err) {
        throw err;
      }
      this.fontfile = this.document.ref({
        Length: compressedData.length,
        Length1: data.length,
        Filter: 'FlateDecode'
      });
      this.fontfile.add(compressedData);
      this.descriptor = this.document.ref({
        Type: 'FontDescriptor',
        FontName: this.subset.postscriptName,
        FontFile2: this.fontfile,
        FontBBox: this.bbox,
        Flags: this.flags,
        StemV: this.stemV,
        ItalicAngle: this.italicAngle,
        Ascent: this.ascender,
        Descent: this.decender,
        CapHeight: this.capHeight,
        XHeight: this.xHeight
      });
      firstChar = +Object.keys(this.subset.cmap)[0];
      charWidths = (function() {
        var _ref, _results;
        _ref = this.subset.cmap;
        _results = [];
        for (code in _ref) {
          glyph = _ref[code];
          _results.push(Math.round(this.ttf.hmtx.forGlyph(glyph).advance * this.scaleFactor));
        }
        return _results;
      }).call(this);
      cmap = this.document.ref();
      cmap.add(toUnicodeCmap(this.subset.subset));
      ref = {
        Type: 'Font',
        BaseFont: this.subset.postscriptName,
        Subtype: 'TrueType',
        FontDescriptor: this.descriptor,
        FirstChar: firstChar,
        LastChar: firstChar + charWidths.length - 1,
        Widths: this.document.ref(charWidths),
        Encoding: 'MacRomanEncoding',
        ToUnicode: cmap
      };
      for (key in ref) {
        val = ref[key];
        this.ref.data[key] = val;
      }
      return cmap.finalize(this.document.compress, fn);
    }, this));
  };
  toUnicodeCmap = function(map) {
    var code, codes, range, unicode, unicodeMap, _i, _len;
    unicodeMap = '/CIDInit /ProcSet findresource begin\n12 dict begin\nbegincmap\n/CIDSystemInfo <<\n  /Registry (Adobe)\n  /Ordering (UCS)\n  /Supplement 0\n>> def\n/CMapName /Adobe-Identity-UCS def\n/CMapType 2 def\n1 begincodespacerange\n<00><ff>\nendcodespacerange';
    codes = Object.keys(map).sort(function(a, b) {
      return a - b;
    });
    range = [];
    for (_i = 0, _len = codes.length; _i < _len; _i++) {
      code = codes[_i];
      if (range.length >= 100) {
        unicodeMap += "\n" + range.length + " beginbfchar\n" + (range.join('\n')) + "\nendbfchar";
        range = [];
      }
      unicode = ('0000' + map[code].toString(16)).slice(-4);
      code = (+code).toString(16);
      range.push("<" + code + "><" + unicode + ">");
    }
    if (range.length) {
      unicodeMap += "\n" + range.length + " beginbfchar\n" + (range.join('\n')) + "\nendbfchar\n";
    }
    return unicodeMap += 'endcmap\nCMapName currentdict /CMap defineresource pop\nend\nend';
  };
  PDFFont.prototype.embedStandard = function() {
    var font;
    this.isAFM = true;
    font = AFMFont.open(__dirname + ("/font/data/" + this.filename + ".afm"));
    this.ascender = font.ascender, this.decender = font.decender, this.bbox = font.bbox, this.lineGap = font.lineGap, this.charWidths = font.charWidths;
    return this.ref = this.document.ref({
      Type: 'Font',
      BaseFont: this.filename,
      Subtype: 'Type1'
    });
  };
  PDFFont.prototype._standardFonts = ["Courier", "Courier-Bold", "Courier-Oblique", "Courier-BoldOblique", "Helvetica", "Helvetica-Bold", "Helvetica-Oblique", "Helvetica-BoldOblique", "Times-Roman", "Times-Bold", "Times-Italic", "Times-BoldItalic", "Symbol", "ZapfDingbats"];
  PDFFont.prototype.widthOfString = function(string, size) {
    var charCode, i, scale, width, _ref;
    string = '' + string;
    width = 0;
    for (i = 0, _ref = string.length; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
      charCode = string.charCodeAt(i) - (this.isAFM ? 0 : 32);
      width += this.charWidths[charCode] || 0;
    }
    scale = size / 1000;
    return width * scale;
  };
  PDFFont.prototype.lineHeight = function(size, includeGap) {
    var gap;
    if (includeGap == null) {
      includeGap = false;
    }
    gap = includeGap ? this.lineGap : 0;
    return (this.ascender + gap - this.decender) / 1000 * size;
  };
  return PDFFont;
})();
module.exports = PDFFont;;
  }
}).call();

(function(){
  var module = {exports:{}};
  var exports = module.exports;
  modules['./mixins/fonts'] = module;
  module.loader = function(){
    module.loader = null;
    var PDFFont;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
PDFFont = require('../font');
module.exports = {
  initFonts: function() {
    this._fontFamilies = {};
    this._fontCount = 0;
    this._fontSize = 12;
    this._font = null;
    this._registeredFonts = {};
    return this.font('Helvetica');
  },
  font: function(filename, family, size) {
    var id, _ref;
    if (typeof family === 'number') {
      size = family;
      family = null;
    }
    if (this._registeredFonts[filename]) {
      _ref = this._registeredFonts[filename], filename = _ref.filename, family = _ref.family;
    }
    if (size != null) {
      this.fontSize(size);
    }
    if (family == null) {
      family = filename;
    }
    if (this._fontFamilies[family]) {
      this._font = this._fontFamilies[family];
      return this;
    }
    id = 'F' + (++this._fontCount);
    this._font = new PDFFont(this, filename, family, id);
    this._fontFamilies[family] = this._font;
    return this;
  },
  fontSize: function(_fontSize) {
    this._fontSize = _fontSize;
    return this;
  },
  widthOfString: function(string) {
    return this._font.widthOfString(string, this._fontSize);
  },
  currentLineHeight: function(includeGap) {
    if (includeGap == null) {
      includeGap = false;
    }
    return this._font.lineHeight(this._fontSize, includeGap);
  },
  registerFont: function(name, path, family) {
    return this._registeredFonts[name] = {
      filename: path,
      family: family
    };
  },
  embedFonts: function(fn) {
    var family, font, fonts, proceed;
    fonts = (function() {
      var _ref, _results;
      _ref = this._fontFamilies;
      _results = [];
      for (family in _ref) {
        font = _ref[family];
        _results.push(font);
      }
      return _results;
    }).call(this);
    return (proceed = __bind(function() {
      if (fonts.length === 0) {
        return fn();
      }
      return fonts.shift().embed(proceed);
    }, this))();
  }
};;
  }
}).call();

(function(){
  var module = {exports:{}};
  var exports = module.exports;
  modules['./mixins/text'] = module;
  module.loader = function(){
    module.loader = null;
    var WORD_RE;
WORD_RE = /([^ \t\r\n]+[ \t\r]*)|\n/g;
module.exports = {
  initText: function() {
    this.x = 0;
    this.y = 0;
    this._lineGap = 0;
    this._textState = {
      mode: 0,
      wordSpacing: 0,
      characterSpacing: 0
    };
    return this._wrapState = {};
  },
  lineGap: function(_lineGap) {
    this._lineGap = _lineGap;
    return this;
  },
  text: function(text, x, y, options) {
    var margins, match, matches, _i, _len, _ref, _ref2, _ref3;
    if (x == null) {
      x = {};
    }
    if (options == null) {
      options = {};
    }
    if (typeof x === 'object') {
      options = x;
      x = null;
    }
    text = '' + text;
    if ((x != null) || (y != null)) {
      this.x = x || this.x;
      this.y = y || this.y;
    } else {
      margins = this.page.margins;
      if ((_ref = options.width) == null) {
        options.width = this.page.width - this.x - margins.right;
      }
      if ((_ref2 = options.height) == null) {
        options.height = this.page.height - this.y - margins.bottom;
      }
    }
    options.columns || (options.columns = 1);
    if ((_ref3 = options.columnGap) == null) {
      options.columnGap = 18;
    }
    if (options.wordSpacing) {
      text = text.replace(/\s+/g, ' ');
    }
    if (options.width) {
      this._wrap(text, options);
    } else if ((matches = text.split('\n')).length > 1) {
      for (_i = 0, _len = matches.length; _i < _len; _i++) {
        match = matches[_i];
        this._line(match, options);
      }
    } else {
      this._line(text, options);
    }
    return this;
  },
  moveDown: function(lines) {
    if (lines == null) {
      lines = 1;
    }
    this.y += this.currentLineHeight(true) * lines + this._lineGap;
    return this;
  },
  moveUp: function(lines) {
    if (lines == null) {
      lines = 1;
    }
    this.y -= this.currentLineHeight(true) * lines + this._lineGap;
    return this;
  },
  list: function(array, ox, oy) {
    var gap, item, x, y, _i, _len;
    gap = Math.round((this._font.ascender / 1000 * this._fontSize) / 2);
    this.x = x = ox || this.x;
    this.y = y = oy || this.y;
    for (_i = 0, _len = array.length; _i < _len; _i++) {
      item = array[_i];
      this.circle(x + 3, this.y + gap + 3, 3);
      this.text(item, x + 15);
      this.y += 3;
    }
    this.x = x;
    return this.fill();
  },
  _line: function(text, options) {
    var lineGap, paragraphGap, wrap;
    wrap = this._wrapState;
    paragraphGap = (wrap.firstLine && this.y !== wrap.startY && options.paragraphGap) || 0;
    lineGap = options.lineGap || this._lineGap || 0;
    this._fragment(text, this.x, this.y + paragraphGap, options);
    return this.y += this.currentLineHeight(true) + lineGap + paragraphGap;
  },
  _fragment: function(text, x, y, options) {
    var align, characterSpacing, i, indent, lineWidth, mode, state, textWidth, wordSpacing, words, wrap, _base, _name, _ref;
    if (options == null) {
      options = {};
    }
    text = '' + text;
    if (text.length === 0) {
      return;
    }
    state = this._textState;
    wrap = this._wrapState;
    align = options.align || 'left';
    indent = (wrap.firstLine && options.indent) || 0;
    wordSpacing = options.wordSpacing || 0;
    characterSpacing = options.characterSpacing || 0;
    if (options.width) {
      lineWidth = wrap.lineWidth - indent - wrap.extraSpace;
      switch (align) {
        case 'right':
          x += lineWidth - this.widthOfString(text);
          break;
        case 'center':
          x += lineWidth / 2 - this.widthOfString(text) / 2;
          break;
        case 'justify':
          if (wrap.lastLine) {
            break;
          }
          words = text.match(WORD_RE);
          if (!words) {
            break;
          }
          textWidth = this.widthOfString(text.replace(/\s+/g, ''));
          wordSpacing = (lineWidth - textWidth) / (words.length - 1) - this.widthOfString(' ');
      }
    }
    x += indent;
    if (options.eachLine) {
      options.eachLine.apply(this, [text, x, y]);
    }
    y = this.page.height - y - (this._font.ascender / 1000 * this._fontSize);
    if ((_ref = (_base = this.page.fonts)[_name = this._font.id]) == null) {
      _base[_name] = this._font.ref;
    }
    this._font.use(text);
    text = this._font.encode(text);
    text = ((function() {
      var _ref2, _results;
      _results = [];
      for (i = 0, _ref2 = text.length; 0 <= _ref2 ? i < _ref2 : i > _ref2; 0 <= _ref2 ? i++ : i--) {
        _results.push(text.charCodeAt(i).toString(16));
      }
      return _results;
    })()).join('');
    this.addContent("BT");
    this.addContent("" + x + " " + y + " Td");
    this.addContent("/" + this._font.id + " " + this._fontSize + " Tf");
    mode = options.fill && options.stroke ? 2 : options.stroke ? 1 : 0;
    if (mode !== state.mode) {
      this.addContent("" + mode + " Tr");
    }
    if (wordSpacing !== state.wordSpacing) {
      this.addContent(wordSpacing + ' Tw');
    }
    if (characterSpacing !== state.characterSpacing) {
      this.addContent(characterSpacing + ' Tc');
    }
    this.addContent("<" + text + "> Tj");
    this.addContent("ET");
    state.mode = mode;
    return state.wordSpacing = wordSpacing;
  },
  _wrap: function(text, options) {
    var buffer, i, indent, lastLine, len, nextY, spaceLeft, w, width, word, wordWidths, words, wrap, _len, _ref;
    wrap = this._wrapState;
    width = this.widthOfString.bind(this);
    indent = options.indent || 0;
    if (wrap.continuedY) {
      this.y = wrap.continuedY;
      this.x += wrap.continuedX;
      wrap.lastLine = false;
    } else {
      wrap.column = 1;
      wrap.startY = this.y;
      wrap.lineWidth = (options.width - (options.columnGap * (options.columns - 1))) / options.columns;
      wrap.firstLine = true;
      wrap.lastLine = false;
      wrap.continuedX = 0;
      wrap.continuedY = 0;
      wrap.maxY = this.y + options.height - this.currentLineHeight();
    }
    words = text.match(WORD_RE) || [];
    wrap.extraSpace = (options.wordSpacing || 0) * (words.length - 1) + (options.characterSpacing || 0) * (text.length - 1);
    spaceLeft = wrap.lineWidth - indent - wrap.extraSpace - wrap.continuedX;
    wordWidths = {};
    len = words.length;
    buffer = '';
    for (i = 0, _len = words.length; i < _len; i++) {
      word = words[i];
      w = (_ref = wordWidths[word]) != null ? _ref : wordWidths[word] = width(word);
      if (wrap.lastLine) {
        wrap.firstLine = true;
        wrap.lastLine = false;
      }
      if (w > spaceLeft || word === '\n') {
        if (word === '\n') {
          wrap.lastLine = true;
          w += indent;
        }
        lastLine = buffer.trim();
        this._line(lastLine, options);
        this.x -= wrap.continuedX;
        wrap.continuedX = 0;
        wrap.firstLine = false;
        nextY = this.y + this.currentLineHeight(true);
        if (this.y > wrap.maxY || (wrap.lastLine && nextY > wrap.maxY)) {
          this._nextSection(options);
        }
        spaceLeft = wrap.lineWidth - w - wrap.extraSpace;
        buffer = word === '\n' ? '' : word;
      } else {
        spaceLeft -= w;
        buffer += word;
      }
    }
    wrap.lastLine = true;
    wrap.continuedY = this.y;
    this._line(buffer.trim(), options);
    this.x -= wrap.continuedX;
    if (options.continued) {
      return wrap.continuedX += width(buffer);
    } else {
      return this._wrapState = {};
    }
  },
  _nextSection: function(options) {
    var wrap;
    wrap = this._wrapState;
    if (++wrap.column > options.columns) {
      this.addPage();
      wrap.column = 1;
      wrap.startY = this.page.margins.top;
      return wrap.maxY = this.page.maxY();
    } else {
      this.x += wrap.lineWidth + options.columnGap;
      return this.y = wrap.startY;
    }
  }
};;
  }
}).call();

(function(){
  var module = {exports:{}};
  var exports = module.exports;
  modules['./data'] = module;
  module.loader = function(){
    module.loader = null;
    var Data;
Data = (function() {
  function Data(data) {
    this.data = data != null ? data : [];
    this.pos = 0;
    this.length = this.data.length;
  }
  Data.prototype.readByte = function() {
    return this.data[this.pos++];
  };
  Data.prototype.writeByte = function(byte) {
    return this.data[this.pos++] = byte;
  };
  Data.prototype.byteAt = function(index) {
    return this.data[index];
  };
  Data.prototype.readBool = function() {
    return !!this.readByte();
  };
  Data.prototype.writeBool = function(val) {
    return this.writeByte(val ? 1 : 0);
  };
  Data.prototype.readUInt32 = function() {
    var b1, b2, b3, b4;
    b1 = this.readByte() << 24;
    b2 = this.readByte() << 16;
    b3 = this.readByte() << 8;
    b4 = this.readByte();
    return b1 | b2 | b3 | b4;
  };
  Data.prototype.writeUInt32 = function(val) {
    this.writeByte((val >>> 24) & 0xff);
    this.writeByte((val >> 16) & 0xff);
    this.writeByte((val >> 8) & 0xff);
    return this.writeByte(val & 0xff);
  };
  Data.prototype.readInt32 = function() {
    var int;
    int = this.readUInt32();
    if (int >= 0x80000000) {
      return int - 0x100000000;
    } else {
      return int;
    }
  };
  Data.prototype.writeInt32 = function(val) {
    if (val < 0) {
      val += 0x100000000;
    }
    return this.writeUInt32(val);
  };
  Data.prototype.readUInt16 = function() {
    var b1, b2;
    b1 = this.readByte() << 8;
    b2 = this.readByte();
    return b1 | b2;
  };
  Data.prototype.writeUInt16 = function(val) {
    this.writeByte((val >> 8) & 0xff);
    return this.writeByte(val & 0xff);
  };
  Data.prototype.readInt16 = function() {
    var int;
    int = this.readUInt16();
    if (int >= 0x8000) {
      return int - 0x10000;
    } else {
      return int;
    }
  };
  Data.prototype.writeInt16 = function(val) {
    if (val < 0) {
      val += 0x10000;
    }
    return this.writeUInt16(val);
  };
  Data.prototype.readString = function(length) {
    var i, ret;
    ret = [];
    for (i = 0; 0 <= length ? i < length : i > length; 0 <= length ? i++ : i--) {
      ret[i] = String.fromCharCode(this.readByte());
    }
    return ret.join('');
  };
  Data.prototype.writeString = function(val) {
    var i, _ref, _results;
    _results = [];
    for (i = 0, _ref = val.length; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
      _results.push(this.writeByte(val.charCodeAt(i)));
    }
    return _results;
  };
  Data.prototype.stringAt = function(pos, length) {
    this.pos = pos;
    return this.readString(length);
  };
  Data.prototype.readShort = function() {
    return this.readInt16();
  };
  Data.prototype.writeShort = function(val) {
    return this.writeInt16(val);
  };
  Data.prototype.readLongLong = function() {
    var b1, b2, b3, b4, b5, b6, b7, b8;
    b1 = this.readByte();
    b2 = this.readByte();
    b3 = this.readByte();
    b4 = this.readByte();
    b5 = this.readByte();
    b6 = this.readByte();
    b7 = this.readByte();
    b8 = this.readByte();
    if (b1 & 0x80) {
      return ((b1 ^ 0xff) * 0x100000000000000 + (b2 ^ 0xff) * 0x1000000000000 + (b3 ^ 0xff) * 0x10000000000 + (b4 ^ 0xff) * 0x100000000 + (b5 ^ 0xff) * 0x1000000 + (b6 ^ 0xff) * 0x10000 + (b7 ^ 0xff) * 0x100 + (b8 ^ 0xff) + 1) * -1;
    }
    return b1 * 0x100000000000000 + b2 * 0x1000000000000 + b3 * 0x10000000000 + b4 * 0x100000000 + b5 * 0x1000000 + b6 * 0x10000 + b7 * 0x100 + b8;
  };
  Data.prototype.writeLongLong = function(val) {
    var high, low;
    high = Math.floor(val / 0x100000000);
    low = val & 0xffffffff;
    this.writeByte((high >> 24) & 0xff);
    this.writeByte((high >> 16) & 0xff);
    this.writeByte((high >> 8) & 0xff);
    this.writeByte(high & 0xff);
    this.writeByte((low >> 24) & 0xff);
    this.writeByte((low >> 16) & 0xff);
    this.writeByte((low >> 8) & 0xff);
    return this.writeByte(low & 0xff);
  };
  Data.prototype.readInt = function() {
    return this.readInt32();
  };
  Data.prototype.writeInt = function(val) {
    return this.writeInt32(val);
  };
  Data.prototype.slice = function(start, end) {
    return this.data.slice(start, end);
  };
  Data.prototype.read = function(bytes) {
    var buf, i;
    buf = [];
    for (i = 0; 0 <= bytes ? i < bytes : i > bytes; 0 <= bytes ? i++ : i--) {
      buf.push(this.readByte());
    }
    return buf;
  };
  Data.prototype.write = function(bytes) {
    var byte, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = bytes.length; _i < _len; _i++) {
      byte = bytes[_i];
      _results.push(this.writeByte(byte));
    }
    return _results;
  };
  return Data;
})();
module.exports = Data;;
  }
}).call();

(function(){
  var module = {exports:{}};
  var exports = module.exports;
  modules['./image/jpeg'] = module;
  module.loader = function(){
    module.loader = null;
    var Data, JPEG, fs;
var __indexOf = Array.prototype.indexOf || function(item) {
  for (var i = 0, l = this.length; i < l; i++) {
    if (this[i] === item) return i;
  }
  return -1;
};
fs = require('fs');
Data = '../data';
JPEG = (function() {
  function JPEG(data) {
    var channels, len, marker, markers;
    this.data = data;
    len = data.length;
    if (data.readUInt16() !== 0xFFD8) {
      throw "SOI not found in JPEG";
    }
    markers = [0xFFC0, 0xFFC1, 0xFFC2, 0xFFC3, 0xFFC4, 0xFFC5, 0xFFC6, 0xFFC7, 0xFFC8, 0xFFC9, 0xFFCA, 0xFFCB, 0xFFCC, 0xFFCD, 0xFFCE, 0xFFCF];
    while (data.pos < len) {
      marker = data.readUInt16();
      if (__indexOf.call(markers, marker) >= 0) {
        break;
      }
      data.pos += data.readUInt16();
    }
    if (__indexOf.call(markers, marker) < 0) {
      throw "Invalid JPEG.";
    }
    data.pos += 2;
    this.bits = data.readByte();
    this.height = data.readShort();
    this.width = data.readShort();
    channels = data.readByte();
    this.colorSpace = (function() {
      switch (channels) {
        case 1:
          return 'DeviceGray';
        case 3:
          return 'DeviceRGB';
        case 4:
          return 'DeviceCMYK';
      }
    })();
    this.imgData = this.data;
  }
  JPEG.prototype.object = function(document, fn) {
    var obj;
    obj = document.ref({
      Type: 'XObject',
      Subtype: 'Image',
      BitsPerComponent: this.bits,
      Width: this.width,
      Height: this.height,
      Length: this.data.length,
      ColorSpace: this.colorSpace,
      Filter: 'DCTDecode'
    });
    if (this.colorSpace === 'DeviceCMYK') {
      obj.data['Decode'] = [1.0, 0.0, 1.0, 0.0, 1.0, 0.0, 1.0, 0.0];
    }
    obj.add(this.data.data);
    return fn(obj);
  };
  return JPEG;
})();
module.exports = JPEG;;
  }
}).call();

(function(){
  var module = {exports:{}};
  var exports = module.exports;
  modules['../image'] = module;
  module.loader = function(){
    module.loader = null;
    /*
PDFImage - embeds images in PDF documents
By Devon Govett
*/
var Data, JPEG, PDFImage, PNG, fs;
fs = require('fs');
Data = require('./data');
JPEG = require('./image/jpeg');
PNG = require('./image/png');
PDFImage = (function() {
  function PDFImage() {}
  PDFImage.open = function(filename) {
    var data, firstByte;
    this.contents = fs.readFileSync(filename);
    if (!this.contents) {
      return;
    }
    this.data = new Data(this.contents);
    this.filter = null;
    data = this.data;
    firstByte = data.byteAt(0);
    if (firstByte === 0xFF && data.byteAt(1) === 0xD8) {
      return new JPEG(data);
    } else if (firstByte === 0x89 && data.stringAt(1, 3) === "PNG") {
      return new PNG(data);
    } else {
      throw new Error('Unknown image format.');
    }
  };
  return PDFImage;
})();
module.exports = PDFImage;;
  }
}).call();

(function(){
  var module = {exports:{}};
  var exports = module.exports;
  modules['./mixins/images'] = module;
  module.loader = function(){
    module.loader = null;
    var PDFImage;
var __indexOf = Array.prototype.indexOf || function(item) {
  for (var i = 0, l = this.length; i < l; i++) {
    if (this[i] === item) return i;
  }
  return -1;
}, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
PDFImage = require('../image');
module.exports = {
  initImages: function() {
    this._imageRegistry = {};
    return this._imageCount = 0;
  },
  image: function(src, x, y, options) {
    var bh, bp, bw, h, hp, image, ip, label, pages, w, wp, _ref, _ref2, _ref3, _ref4, _ref5;
    if (options == null) {
      options = {};
    }
    if (typeof x === 'object') {
      options = x;
      x = null;
    }
    x = (_ref = x != null ? x : options.x) != null ? _ref : this.x;
    y = (_ref2 = y != null ? y : options.y) != null ? _ref2 : this.y;
    if (this._imageRegistry[src]) {
      _ref3 = this._imageRegistry[src], image = _ref3[0], label = _ref3[1], pages = _ref3[2];
      if (_ref4 = this.page, __indexOf.call(pages, _ref4) < 0) {
        pages.push(this.page);
      }
    } else {
      image = PDFImage.open(src);
      label = "I" + (++this._imageCount);
      this._imageRegistry[src] = [image, label, [this.page]];
    }
    w = options.width || image.width;
    h = options.height || image.height;
    if (options.width && !options.height) {
      wp = w / image.width;
      w = image.width * wp;
      h = image.height * wp;
    } else if (options.height && !options.width) {
      hp = h / image.height;
      w = image.width * hp;
      h = image.height * hp;
    } else if (options.scale) {
      w = image.width * options.scale;
      h = image.height * options.scale;
    } else if (options.fit) {
      _ref5 = options.fit, bw = _ref5[0], bh = _ref5[1];
      bp = bw / bh;
      ip = image.width / image.height;
      if (ip > bp) {
        w = bw;
        h = bw / ip;
      } else {
        h = bh;
        w = bh * ip;
      }
    }
    if (this.y === y) {
      this.y += h;
    }
    y = this.page.height - y - h;
    this.save();
    this.addContent("" + w + " 0 0 " + h + " " + x + " " + y + " cm");
    this.addContent("/" + label + " Do");
    this.restore();
    return this;
  },
  embedImages: function(fn) {
    var images, item, proceed, src;
    images = (function() {
      var _ref, _results;
      _ref = this._imageRegistry;
      _results = [];
      for (src in _ref) {
        item = _ref[src];
        _results.push(item);
      }
      return _results;
    }).call(this);
    return (proceed = __bind(function() {
      var image, label, pages, _ref;
      if (images.length) {
        _ref = images.shift(), image = _ref[0], label = _ref[1], pages = _ref[2];
        return image.object(this, function(obj) {
          var page, _base, _i, _len, _ref2;
          for (_i = 0, _len = pages.length; _i < _len; _i++) {
            page = pages[_i];
            if ((_ref2 = (_base = page.xobjects)[label]) == null) {
              _base[label] = obj;
            }
          }
          return proceed();
        });
      } else {
        return fn();
      }
    }, this))();
  }
};;
  }
}).call();

(function(){
  var module = {exports:{}};
  var exports = module.exports;
  modules['../object'] = module;
  module.loader = function(){
    module.loader = null;
    /*
PDFObject - converts JavaScript types into their corrisponding PDF types.
By Devon Govett
*/
var PDFObject, PDFReference;
PDFObject = (function() {
  var pad;
  function PDFObject() {}
  pad = function(str, length) {
    return (Array(length + 1).join('0') + str).slice(-length);
  };
  PDFObject.convert = function(object) {
    var e, items, key, out, val;
    if (Array.isArray(object)) {
      items = ((function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = object.length; _i < _len; _i++) {
          e = object[_i];
          _results.push(PDFObject.convert(e));
        }
        return _results;
      })()).join(' ');
      return '[' + items + ']';
    } else if (typeof object === 'string') {
      return '/' + object;
    } else if (object != null ? object.isString : void 0) {
      return '(' + object + ')';
    } else if (object instanceof PDFReference) {
      return object.toString();
    } else if (object instanceof Date) {
      return '(D:' + pad(object.getUTCFullYear(), 4) + pad(object.getUTCMonth(), 2) + pad(object.getUTCDate(), 2) + pad(object.getUTCHours(), 2) + pad(object.getUTCMinutes(), 2) + pad(object.getUTCSeconds(), 2) + 'Z)';
    } else if ({}.toString.call(object) === '[object Object]') {
      out = ['<<'];
      for (key in object) {
        val = object[key];
        out.push('/' + key + ' ' + PDFObject.convert(val));
      }
      out.push('>>');
      return out.join('\n');
    } else {
      return '' + object;
    }
  };
  PDFObject.s = function(string) {
    string = string.replace(/\\/g, '\\\\\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
    return {
      isString: true,
      toString: function() {
        return string;
      }
    };
  };
  return PDFObject;
})();
module.exports = PDFObject;
PDFReference = require('./reference');;
  }
}).call();

(function(){
  var module = {exports:{}};
  var exports = module.exports;
  modules['./mixins/annotations'] = module;
  module.loader = function(){
    module.loader = null;
    var PDFObject;
var __slice = Array.prototype.slice;
PDFObject = require('../object');
module.exports = {
  annotate: function(x, y, w, h, options) {
    var key, val, _ref;
    options.Type = 'Annot';
    options.Rect = this._convertRect(x, y, w, h);
    options.Border = [0, 0, 0];
    if (options.Subtype !== 'Link') {
      if ((_ref = options.C) == null) {
        options.C = this._normalizeColor(options.color || [0, 0, 0]);
      }
    }
    delete options.color;
    if (typeof options.Dest === 'string') {
      options.Dest = PDFObject.s(options.Dest);
    }
    for (key in options) {
      val = options[key];
      options[key[0].toUpperCase() + key.slice(1)] = val;
    }
    this.page.annotations.push(this.ref(options));
    return this;
  },
  note: function(x, y, w, h, contents, options) {
    var _ref;
    if (options == null) {
      options = {};
    }
    options.Subtype = 'Text';
    options.Contents = PDFObject.s(contents);
    options.Name = 'Comment';
    if ((_ref = options.color) == null) {
      options.color = [243, 223, 92];
    }
    return this.annotate(x, y, w, h, options);
  },
  link: function(x, y, w, h, url, options) {
    if (options == null) {
      options = {};
    }
    options.Subtype = 'Link';
    options.A = this.ref({
      S: 'URI',
      URI: PDFObject.s(url)
    });
    return this.annotate(x, y, w, h, options);
  },
  _markup: function(x, y, w, h, options) {
    var x1, x2, y1, y2, _ref;
    if (options == null) {
      options = {};
    }
    _ref = this._convertRect(x, y, w, h), x1 = _ref[0], y1 = _ref[1], x2 = _ref[2], y2 = _ref[3];
    options.QuadPoints = [x1, y2, x2, y2, x1, y1, x2, y1];
    options.Contents = PDFObject.s('');
    return this.annotate(x, y, w, h, options);
  },
  highlight: function(x, y, w, h, options) {
    var _ref;
    if (options == null) {
      options = {};
    }
    options.Subtype = 'Highlight';
    if ((_ref = options.color) == null) {
      options.color = [241, 238, 148];
    }
    return this._markup(x, y, w, h, options);
  },
  underline: function(x, y, w, h, options) {
    if (options == null) {
      options = {};
    }
    options.Subtype = 'Underline';
    return this._markup(x, y, w, h, options);
  },
  strike: function(x, y, w, h, options) {
    if (options == null) {
      options = {};
    }
    options.Subtype = 'StrikeOut';
    return this._markup(x, y, w, h, options);
  },
  lineAnnotation: function(x1, y1, x2, y2, options) {
    if (options == null) {
      options = {};
    }
    options.Subtype = 'Line';
    options.Contents = PDFObject.s('');
    options.L = [x1, this.page.height - y1, x2, this.page.height - y2];
    return this.annotate(x1, y1, x2, y2, options);
  },
  rectAnnotation: function(x, y, w, h, options) {
    if (options == null) {
      options = {};
    }
    options.Subtype = 'Square';
    options.Contents = PDFObject.s('');
    return this.annotate(x, y, w, h, options);
  },
  ellipseAnnotation: function(x, y, w, h, options) {
    if (options == null) {
      options = {};
    }
    options.Subtype = 'Circle';
    options.Contents = PDFObject.s('');
    return this.annotate(x, y, w, h, options);
  },
  textAnnotation: function(x, y, w, h, text, options) {
    if (options == null) {
      options = {};
    }
    options.Subtype = 'FreeText';
    options.Contents = PDFObject.s(text);
    options.DA = PDFObject.s('');
    return this.annotate(x, y, w, h, options);
  },
  _convertRect: function() {
    var rect;
    rect = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    rect[1] = this.page.height - rect[1] - rect[3];
    rect[2] += rect[0];
    rect[3] += rect[1];
    return rect;
  }
};;
  }
}).call();
(function(){
  var module = {exports:{}};
  var exports = module.exports;
  modules['font_metrics/Courier-Bold Courier-BoldOblique Courier-Oblique Courier Helvetica-Bold Helvetica-BoldOblique Helvetica-Oblique Helvetica Symbol Times-Bold Times-BoldItalic Times-Italic Times-Roman ZapfDingbats'] = module;
  module.loader = function(){
    module.loader = null;
    ;
  }
}).call();
(function(){
  var module = {exports:{}};
  var exports = module.exports;
  modules['font_metrics/Helvetica'] = module;
  module.loader = function(){
    module.loader = null;
    module.exports = {"ascender":718,"decender":-207,"bbox":[-166,-225,1000,931,0],"lineGap":231,"charWidths":[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,278,278,355,556,556,889,667,191,333,333,389,584,278,333,278,278,556,556,556,556,556,556,556,556,556,556,278,278,584,584,584,556,1015,667,667,722,722,667,611,778,722,278,500,667,556,833,722,778,667,778,722,667,611,722,667,944,667,667,611,278,278,278,469,556,333,556,556,500,556,556,278,556,556,222,222,500,222,833,556,556,556,556,333,500,278,556,500,722,500,500,500,334,260,334,584,null,556,null,222,556,333,1000,556,556,333,1000,667,333,1000,null,611,null,null,222,222,333,333,350,556,1000,333,1000,500,333,944,null,500,500,278,333,556,556,556,556,260,556,333,737,370,556,584,333,737,333,400,584,333,333,333,556,537,278,333,333,365,556,834,834,834,611,667,667,667,667,667,667,1000,722,667,667,667,667,278,278,278,278,722,722,778,778,778,778,778,584,778,722,722,722,722,667,667,611,556,556,556,556,556,556,889,500,556,556,556,556,278,278,278,278,556,556,556,556,556,556,556,584,611,556,556,556,556,500,556,500]};
  }
}).call();
var Data, Doc, Font, PDFDocument;
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
}, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
Doc = require('pdfkit');
PDFDocument = (function() {
  __extends(PDFDocument, Doc);
  function PDFDocument(options) {
    PDFDocument.__super__.constructor.call(this, options);
    this.compress = false;
  }
  PDFDocument.prototype.b64encode = function(string) {
    if (window.btoa) {
      return btoa(string);
    } else if (window.Base64) {
      return Base64.encode(str);
    } else {
      throw new Error("You must provide a base64 implementation on IE");
    }
  };
  PDFDocument.prototype.dataURI = function(fn) {
    return this.output(__bind(function(data) {
      return fn('data:application/pdf;base64,' + this.b64encode(data));
    }, this));
  };
  return PDFDocument;
})();
PDFDocument.wwwHelpers = P;
Font = require('../font');
Font.prototype.embedStandard = function() {
  var font;
  this.isAFM = true;
  font = require("font_metrics/" + this.filename);
  this.ascender = font.ascender, this.decender = font.decender, this.bbox = font.bbox, this.lineGap = font.lineGap, this.charWidths = font.charWidths;
  return this.ref = this.document.ref({
    Type: 'Font',
    BaseFont: this.filename,
    Subtype: 'Type1'
  });
};
Data = modules['./data'].exports;
Data.prototype.readByte = function() {
  return this.data.charCodeAt(this.pos++);
};
Data.prototype.writeByte = function(byte) {
  return this.data[this.pos++] = String.fromCharCode(byte);
};
Data.prototype.byteAt = function(index) {
  return this.data.charCodeAt(index);
};
if (typeof module !== "undefined") {
  module.exports = PDFDocument;
} else {
  window.PDFDocument = PDFDocument;
}
})();
