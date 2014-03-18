angular.module('templates-main', ['../client/views/app.html', '../client/views/documents/canvas.html', '../client/views/documents/document.html', '../client/views/documents/documents.html', '../client/views/documents/toolbar.html', '../client/views/login/login.html']);

angular.module("../client/views/app.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../client/views/app.html",
    "<div class=\"app-cover\" ng-if=\"aboutAppVisible\">\n" +
    "  <div class=\"user-box\">\n" +
    "    <div class=\"pub-logo-128\"></div>\n" +
    "    <div class=\"app-name\">Publications</div>\n" +
    "    <div class=\"app-credits\">\n" +
    "      <p>Publications is designed and developed by Michael Kelly and Carlos Paelinck.</p>\n" +
    "      <p>Built using AngularJS, ExpressJS, PdfKit, LoDash, Mongoose and MongoDB.</p>\n" +
    "    </div>\n" +
    "    <div class=\"form-controls\">\n" +
    "      <div class=\"button-group\">\n" +
    "        <button class=\"button button-text\" ng-click=\"aboutApp()\">Close</button>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"app-content\" ui-view></div>");
}]);

angular.module("../client/views/documents/canvas.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../client/views/documents/canvas.html",
    "<div class=\"editor-view\">\n" +
    "  <br />\n" +
    "  <div class=\"pub-svg-view\">\n" +
    "    <svg ng-attr-width=\"{{ doc.width * dpi * zoomLevel }}\" \n" +
    "         ng-attr-height=\"{{ doc.height * dpi * zoomLevel }}\">\n" +
    "      <g id=\"svg-background\">\n" +
    "        <rect ng-attr-height=\"{{ doc.height * dpi * zoomLevel }}\" \n" +
    "              ng-attr-width=\"{{ doc.width * dpi * zoomLevel }}\" \n" +
    "              x=\"0\" \n" +
    "              y=\"0\"\n" +
    "              fill=\"#fff\"\n" +
    "              stroke=\"#000\"\n" +
    "              stroke-width=\"1\"\n" +
    "              fill-opacity=\"1.0\"\n" +
    "              stroke-opacity=\"0.90\"\n" +
    "              ng-click=\"svgObjectSelected(null)\" />\n" +
    "      </g>\n" +
    "      <g id=\"grid\">\n" +
    "          <path ng-repeat=\"x in xAxisRange()\"\n" +
    "                ng-attr-d=\"M{{(x * (dpi / 4.0) * zoomLevel) - 0.5}} 0 V{{(x * (dpi / 4.0) * zoomLevel) - 2.5}} {{ doc.height * dpi * zoomLevel }} Z\"\n" +
    "                ng-class=\"{ 'inch-mark' : (x % 4) === 0 }\" />\n" +
    "          <path ng-repeat=\"y in yAxisRange()\"\n" +
    "                ng-attr-d=\"M0 {{(y * (dpi / 4.0) * zoomLevel) - 0.5}} H{{ doc.width * dpi * zoomLevel }} {{(y * (dpi / 4.0) * zoomLevel) - 0.5}} Z\"\n" +
    "                ng-class=\"{ 'inch-mark' : (y % 4) === 0 }\" />\n" +
    "                \n" +
    "      </g>\n" +
    "      <g ng-repeat=\"shape in doc.shapes\">\n" +
    "        <g ng-switch=\"shape.type\">\n" +
    "          <g ng-switch-when=\"rect\">\n" +
    "            <rect ng-attr-x=\"{{ shape.x * dpi * zoomLevel }}\" \n" +
    "                  ng-attr-y=\"{{ shape.y * dpi * zoomLevel }}\" \n" +
    "                  ng-attr-rx=\"{{ shape.r * zoomLevel }}\"\n" +
    "                  ng-attr-ry=\"{{ shape.r * zoomLevel }}\"\n" +
    "                  ng-attr-height=\"{{ shape.height * dpi * zoomLevel }}\" \n" +
    "                  ng-attr-width=\"{{ shape.width * dpi * zoomLevel }}\" \n" +
    "                  ng-attr-fill=\"{{ shape.fill }}\"\n" +
    "                  ng-attr-stroke=\"{{ shape.stroke }}\"\n" +
    "                  ng-attr-stroke-width=\"{{ shape.strokeWidth * zoomLevel }}\"\n" +
    "                  ng-attr-fill-opacity=\"{{ shape.fillOpacity }}\"\n" +
    "                  ng-attr-stroke-opacity=\"{{ shape.strokeOpacity }}\"\n" +
    "                  ng-click=\"svgObjectSelected(shape)\" />\n" +
    "          </g>\n" +
    "          <g ng-switch-when=\"ellipse\">\n" +
    "            <ellipse ng-attr-cx=\"{{ (shape.x * dpi * zoomLevel) + (shape.width / 2.0 * dpi * zoomLevel) }}\" \n" +
    "                     ng-attr-cy=\"{{ (shape.y * dpi * zoomLevel) + (shape.height / 2.0 * dpi * zoomLevel) }}\" \n" +
    "                     ng-attr-rx=\"{{ shape.width / 2.0 * dpi * zoomLevel }}\" \n" +
    "                     ng-attr-ry=\"{{ shape.height / 2.0 * dpi * zoomLevel }}\" \n" +
    "                     ng-attr-fill=\"{{ shape.fill }}\"\n" +
    "                     ng-attr-stroke=\"{{ shape.stroke }}\"\n" +
    "                     ng-attr-stroke-width=\"{{ shape.strokeWidth * zoomLevel }}\"\n" +
    "                     ng-attr-fill-opacity=\"{{ shape.fillOpacity }}\"\n" +
    "                     ng-attr-stroke-opacity=\"{{ shape.strokeOpacity }}\"\n" +
    "                     ng-click=\"svgObjectSelected(shape)\" />\n" +
    "          </g>\n" +
    "        </g>\n" +
    "      </g>\n" +
    "    </svg>\n" +
    "  </div>\n" +
    "</div>");
}]);

angular.module("../client/views/documents/document.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../client/views/documents/document.html",
    "<div ui-view=\"document-toolbar\"></div>\n" +
    "<div ui-view=\"document-canvas\"></div>\n" +
    "");
}]);

angular.module("../client/views/documents/documents.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../client/views/documents/documents.html",
    "<div class=\"app-nav\">\n" +
    "  <div class=\"app-nav-secondary-controls\">\n" +
    "    <div class=\"dropdown dropdown-button dropdown-left\">\n" +
    "      <button class=\"button button-text dropdown-toggle\" data-toggle=\"dropdown\">{{ user.name }}</button>\n" +
    "      <div class=\"dropdown-menu\">\n" +
    "        <div class=\"menu-item-header\">Publications</div>\n" +
    "        <div class=\"menu-item\" ng-click=\"aboutApp()\">About Publications&#8230;</div>\n" +
    "        <div class=\"menu-item\" ng-click=\"logout()\">Log Out</div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class=\"app-nav-controls\">\n" +
    "    <input class=\"input-text input-text-search\" type=\"text\" ng-model=\"search.$\" placeholder=\"&#xe01f;\">\n" +
    "  </div>\n" +
    "  <div class=\"app-nav-logo\"></div>\n" +
    "</div>\n" +
    "<div class=\"documents-list\">\n" +
    "  <table class=\"documents-table\">\n" +
    "    <thead>\n" +
    "      <tr>\n" +
    "        <td class=\"new-document-row\" colspan=\"4\" ng-click=\"newDocument()\">\n" +
    "          <span data-icon=\"&#xe2a9;\"></span>\n" +
    "        </td>\n" +
    "      </tr>\n" +
    "      <tr>\n" +
    "        <th class=\"documents-table-column-name\" data-sort=\"name\">Name</th>\n" +
    "        <th class=\"documents-table-column-date\">Date Created</th>\n" +
    "        <th class=\"documents-table-column-size\">Size</th>\n" +
    "        <th class=\"documents-table-column-controls\"></th>\n" +
    "      </tr>\n" +
    "    </thead>\n" +
    "    <tbody>\n" +
    "      \n" +
    "      <tr ng-repeat=\"doc in documents | filter: search | orderBy: 'modified' : true\"\n" +
    "          ng-init=\"doc.modifiedStr = ( doc.modified | date: 'EEEE MMMM d, yyyy' );\">\n" +
    "        <td>{{ doc.name }}</td>\n" +
    "        <td>{{ doc.modifiedStr }}</td>\n" +
    "        <td>{{ doc.width }}&#8221;&#32;&#215;&#32;{{ doc.height }}</td>\n" +
    "        <td class=\"documents-table-cell-controls\">\n" +
    "          <div class=\"button-group button-group-merge\">\n" +
    "            <button class=\"button button-text\" ng-click=\"\" ui-sref=\"pub.documents.document.views({ documentId: doc._id })\">Edit</button>\n" +
    "            <button class=\"button button-text\" ng-click=\"\">PDF</button>\n" +
    "            <button class=\"button button-text button-red\" ng-click=\"deleteDocument(doc)\">Delete</button>\n" +
    "          </div>\n" +
    "        </td>\n" +
    "      </tr>\n" +
    "    </tbody>\n" +
    "  </table>\n" +
    "</div>\n" +
    "<div ui-view>");
}]);

angular.module("../client/views/documents/toolbar.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../client/views/documents/toolbar.html",
    "<div class=\"app-nav\">\n" +
    "  <div class=\"app-nav-secondary-controls\">\n" +
    "    <span class=\"document-name\">\n" +
    "      <strong>{{ doc.name }}</strong>\n" +
    "      &mdash;&#32;{{ doc.width }}&#8221;&#32;&#215;&#32;{{ doc.height }}&#8221;\n" +
    "    </span>\n" +
    "  </div>\n" +
    "  <div class=\"app-nav-controls\">\n" +
    "    <div class=\"button-group button-group-icons button-group-editor\">\n" +
    "      <div class=\"dropdown dropdown-button dropdown-icon\">\n" +
    "        <button class=\"button button-icon dropdown-toggle\" data-icon=\"&#xe2ab;\" data-toggle=\"dropdown\"></button>\n" +
    "        <div class=\"dropdown-menu\">\n" +
    "          <div class=\"menu-item-header\">Add Object</div>\n" +
    "          <div class=\"menu-item\" ng-click=\"addObject('rect')\">Rectangle</div>\n" +
    "          <div class=\"menu-item\" ng-click=\"addObject('ellipse')\">Ellipse</div>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "      <div class=\"dropdown dropdown-button dropdown-icon\">\n" +
    "        <button class=\"button button-icon dropdown-toggle\" data-toggle=\"dropdown\" data-icon=\"&#xe06b;\" ng-disabled=\"!selectedObj\"></button>\n" +
    "        <div class=\"dropdown-menu\" ng-click=\"$event.stopPropagation();\">\n" +
    "          <div class=\"menu-item-header\">Object Metrics</div>\n" +
    "          <table class=\"inspector-table\">\n" +
    "            <tr>\n" +
    "              <td class=\"inspector-column-label\">width</td>\n" +
    "              <td class=\"inspector-column-input\"><input id=\"obj-width\" class=\"input-text\" ng-model=\"selectedObj.width\" type=\"number\" min=\"0.1\" max=\"64\" step=\"0.1\"></td>\n" +
    "              <td class=\"inspector-column-unit\">\n" +
    "                <ng-pluralize count=\"selectedObj.width\" when=\"{ '1': 'inch', 'other': 'inches' }\"></ng-pluralize>\n" +
    "              </td>\n" +
    "            </tr>\n" +
    "            <tr>\n" +
    "              <td class=\"inspector-column-label\">height</td>\n" +
    "              <td class=\"inspector-column-input\"><input id=\"obj-height\" class=\"input-text\" ng-model=\"selectedObj.height\" type=\"number\" min=\"0.1\" max=\"64\" step=\"0.1\"></td>\n" +
    "              <td class=\"inspector-column-unit\">\n" +
    "                <ng-pluralize count=\"selectedObj.height\" when=\"{ '1': 'inch', 'other': 'inches' }\"></ng-pluralize>\n" +
    "              </td>\n" +
    "            </tr>\n" +
    "            <tr>\n" +
    "              <td class=\"inspector-column-label\">x</td>\n" +
    "              <td class=\"inspector-column-input\"><input id=\"obj-x\" class=\"input-text\" ng-model=\"selectedObj.x\" type=\"number\" min=\"-1.0\" max=\"64\" step=\"0.1\"></td>\n" +
    "              <td class=\"inspector-column-unit\">\n" +
    "                <ng-pluralize count=\"selectedObj.x\" when=\"{ '1': 'inch', 'other': 'inches' }\"></ng-pluralize>\n" +
    "              </td>\n" +
    "            </tr>\n" +
    "            <tr>\n" +
    "              <td class=\"inspector-column-label\">y</td>\n" +
    "              <td class=\"inspector-column-input\"><input id=\"obj-y\" class=\"input-text\" ng-model=\"selectedObj.y\" type=\"number\" min=\"-1.0\" max=\"64\" step=\"0.1\"></td>\n" +
    "              <td class=\"inspector-column-unit\">\n" +
    "                <ng-pluralize count=\"selectedObj.y\" when=\"{ '1': 'inch', 'other': 'inches' }\"></ng-pluralize>\n" +
    "              </td>\n" +
    "            </tr>\n" +
    "            <tr>\n" +
    "              <td class=\"inspector-column-label\">border</td>\n" +
    "              <td class=\"inspector-column-input\"><input id=\"obj-stroke-width\" class=\"input-text\" ng-model=\"selectedObj.strokeWidth\" type=\"number\" min=\"0\" max=\"64\" step=\"1\"></td>\n" +
    "              <td class=\"inspector-column-unit\">\n" +
    "                <ng-pluralize count=\"selectedObj.strokeWidth\" when=\"{ '1': 'pixel', 'other': 'pixels' }\"></ng-pluralize>\n" +
    "              </td>\n" +
    "            </tr>\n" +
    "            <tr ng-if=\"selectedObj.type === 'rect'\">\n" +
    "              <td class=\"inspector-column-label\">radius</td>\n" +
    "              <td class=\"inspector-column-input\"><input id=\"obj-radius\" class=\"input-text\" ng-model=\"selectedObj.r\" type=\"number\" min=\"0\" max=\"64\" step=\"1\"></td>\n" +
    "              <td class=\"inspector-column-unit\">\n" +
    "                <ng-pluralize count=\"selectedObj.r\" when=\"{ '1': 'pixel', 'other': 'pixels' }\"></ng-pluralize>\n" +
    "              </td>\n" +
    "            </tr>\n" +
    "          </table>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "      <div class=\"dropdown dropdown-button\">\n" +
    "        <button class=\"button button-icon dropdown-toggle\" data-toggle=\"dropdown\" data-icon=\"&#xe065;\" ng-disabled=\"!selectedObj\"></button>\n" +
    "        <div class=\"dropdown-menu\" ng-click=\"$event.stopPropagation();\">\n" +
    "          <div class=\"menu-item-header\">Color</div>\n" +
    "          <table class=\"inspector-table\">\n" +
    "            <tr>\n" +
    "              <td class=\"inspector-column-label\">fill</td>\n" +
    "              <td class=\"inspector-column-input inspector-column-input-left\"><input class=\"input-text\" ng-model=\"selectedObj.fill\" type=\"text\" hex-color-input></td>\n" +
    "            </tr>\n" +
    "            <tr>\n" +
    "              <td class=\"inspector-column-label\">border</td>\n" +
    "              <td class=\"inspector-column-input inspector-column-input-left\"><input class=\"input-text\" ng-model=\"selectedObj.stroke\" type=\"text\" hex-color-input></td>\n" +
    "            </tr>\n" +
    "          </table>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "      <div class=\"separator\"></div>\n" +
    "      <button class=\"button button-icon\" data-icon=\"&#xe02d;\" ng-disabled=\"!selectedObj\"></button>\n" +
    "      <button class=\"button button-icon\" data-icon=\"&#xe277;\" ng-disabled=\"!selectedObj\"></button>\n" +
    "      <button class=\"button button-icon\" data-icon=\"&#xe249;\" ng-disabled=\"!selectedObj\"></button>\n" +
    "      <div class=\"separator\"></div>\n" +
    "      <button class=\"button button-icon\" data-icon=\"&#xe054;\" ng-disabled=\"!selectedObj\"></button>\n" +
    "      <button class=\"button button-icon\" data-icon=\"&#xe055;\" ng-disabled=\"!selectedObj\"></button>\n" +
    "      <div class=\"dropdown dropdown-button\">\n" +
    "        <button class=\"button button-icon dropdown-toggle\" data-toggle=\"dropdown\" data-icon=\"&#xe060;\"></button>\n" +
    "        <div class=\"dropdown-menu\">\n" +
    "          <div class=\"menu-item-header\">Layers</div>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "      <div class=\"separator\"></div>\n" +
    "      <button class=\"button button-icon\" data-icon=\"&#xe4e3;\" ng-disabled=\"selectedObj.type !== 'text'\"></button>\n" +
    "      <div class=\"separator\"></div>\n" +
    "      <div class=\"dropdown dropdown-button\">\n" +
    "        <button class=\"button button-icon dropdown-toggle\" data-toggle=\"dropdown\" data-icon=\"&#xe26b;\"></button>\n" +
    "        <div class=\"dropdown-menu dropdown-menu-small\">\n" +
    "          <div class=\"menu-item-header\">Zoom</div>\n" +
    "          <div ng-repeat=\"level in zoomLevels\" \n" +
    "            class=\"menu-item\"\n" +
    "            ng-click=\"setZoomLevel(level)\"\n" +
    "            ng-class=\"{ 'selected' : zoomLevel === level }\">\n" +
    "            {{level * 100}}%\n" +
    "          </div>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "      <div class=\"dropdown dropdown-button\">\n" +
    "        <button class=\"button button-icon dropdown-toggle\" data-toggle=\"dropdown\" data-icon=\"&#xe26c;\"></button>\n" +
    "        <div class=\"dropdown-menu\">\n" +
    "          <div class=\"menu-item-header\">Document Options</div>\n" +
    "          <div class=\"menu-item\" ng-click=\"updateDocument()\">Save Document</div>\n" +
    "          <div class=\"menu-item\">Rename Document&#8230;</div>\n" +
    "          <div class=\"menu-item\">Document Metrics&#8230;</div>\n" +
    "          <div class=\"menu-item\">Download PDF</div>\n" +
    "          <div class=\"menu-item\" ng-click=\"showAllDocuments()\">Show all Documents</div>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class=\"app-nav-logo\" ng-click=\"aboutApp()\"></div>\n" +
    "</div>");
}]);

angular.module("../client/views/login/login.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../client/views/login/login.html",
    "<form ng-submit=\"login()\" name=\"loginForm\" role=\"form\" class=\"form form-vertical\">\n" +
    "  <div class=\"login-box\">\n" +
    "    <div class=\"pub-logo-72\"></div>\n" +
    "    <div class=\"message\">Log in to Publications</div>\n" +
    "    <fieldset class=\"fieldset-text\">\n" +
    "      <label for=\"username\">Email Address</label>\n" +
    "      <input class=\"input-text\" type=\"text\" ng-model=\"username\" name=\"username\" id=\"username\" required>\n" +
    "    </fieldset>\n" +
    "    <fieldset class=\"fieldset-text\">\n" +
    "      <label for=\"password\">Password</label>\n" +
    "      <input class=\"input-text\" type=\"password\" ng-model=\"password\" name=\"password\" id=\"password\" required>\n" +
    "    </fieldset>\n" +
    "    <div class=\"form-controls\">\n" +
    "      <div class=\"button-group\">\n" +
    "        <button class=\"button button-text\" type=\"button\" ng-click=\"testDrive()\">Dev Mode</button>\n" +
    "        <button class=\"button button-text\" type=\"submit\" ng-disabled=\"loginForm.$invalid\">Log In</button>\n" +
    "      </div>\n" +
    "\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</form>");
}]);
