
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

    amplify.request.define('app#user', 'ajax', {
        url: '/app/user',
        dataType: 'json',
        type: 'GET',
        decoder: function( data, status, xhr, success, error ) {
            if (status === 'success') success(data);
            else error(xhr);
        }
    });
});