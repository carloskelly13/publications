
/**
 * Publications JS App
 * Amplify Definition Module
 * Michael Kelly and Carlos Paelinck
 */

 define(function(require) {
    var $ = require('jquery'),
        amplify = require('amplify');

    amplify.request.define('app#sign-in', 'ajax', {
        url: '/app/signin',
        dataType: 'json',
        type: 'POST'
    });

    amplify.request.define('app#sign-out', 'ajax', {
        url: '/app/signout',
        dataType: 'json',
        type: 'GET'
    });
});