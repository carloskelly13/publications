angular.module('templates-main', ['../client/views/app.html', '../client/views/documents/documents.html', '../client/views/login/login.html']);

angular.module("../client/views/app.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../client/views/app.html",
    "<header class=\"app-nav\" ng-if=\"authenticated\">\n" +
    "  <div class=\"pub-logo\"></div>\n" +
    "  <div class=\"dropdown app-menu-button\">\n" +
    "    <button data-toggle=\"dropdown\" class=\"button button-toolbar button-icon\" data-icon=\"&#xe01e;\"></button>\n" +
    "    <ul class=\"dropdown-menu dropdown-menu-right\" role=\"menu\">\n" +
    "      <li class=\"menu-item\" ng-click=\"aboutApp()\">About Publications</li>\n" +
    "      <li class=\"menu-item\" ng-click=\"logout()\">Log Out</li>\n" +
    "    </ul>\n" +
    "  </div>\n" +
    "</header>\n" +
    "\n" +
    "<div class=\"app-cover\" ng-if=\"aboutAppVisible\">\n" +
    "  <div class=\"user-box\">\n" +
    "    <div class=\"pub-logo-128\"></div>\n" +
    "    <div class=\"app-name\">Publications</div>\n" +
    "    <div class=\"app-credits\">\n" +
    "      <p>Publications is designed and developed by Michael Kelly and Carlos Paelinck.</p>\n" +
    "      <p>Built using AngularJS, ExpressJS, PdfKit, LoDash, Mongoose and MongoDB.</p>\n" +
    "    </div>\n" +
    "    <div class=\"form-controls\">\n" +
    "      <button class=\"button button-toolbar\" ng-click=\"aboutApp()\">Close</button>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"app-content\" ui-view></div>");
}]);

angular.module("../client/views/documents/documents.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../client/views/documents/documents.html",
    "<ul>\n" +
    "<!--   <li class=\"document-item\" ng-click=\"newDocument()\">\n" +
    "    <div class=\"new-document-icon\" data-icon=\"&#xe00b;\"></div>\n" +
    "  </li> -->\n" +
    "<!--   <li class=\"document-item\" ng-repeat=\"document in documents\">\n" +
    "    {{ document.name }}\n" +
    "  </li> -->\n" +
    "</ul>");
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
    "      <button class=\"button button-toolbar\" type=\"submit\" ng-disabled=\"loginForm.$invalid\">Log In</button>\n" +
    "      <button class=\"button button-toolbar\" type=\"button\" ng-click=\"testDrive()\">Dev Mode</button>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</form>");
}]);
