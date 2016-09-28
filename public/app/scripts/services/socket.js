'use strict';

/**
 * @ngdoc service
 * @name publicApp.socket
 * @description
 * # socket
 * Factory in the publicApp.
 */
angular.module('publicApp')
    .factory('socket', function ($rootScope) {
        var socket = io.connect();

        return {
            on: function (eventName, callback) {
                socket.on(eventName, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        callback.apply(socket, args);
                    });
                });
            },
            emit: function (eventName, data, callback) {
                socket.emit(eventName, data, function () {
                    console.log('emit', data);

                    var args = arguments;
                    $rootScope.$apply(function () {
                        if (callback) {
                            callback.apply(socket, args);
                        }
                    });
                })
            }
        };
    });
