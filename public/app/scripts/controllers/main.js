'use strict';

/**
 * @ngdoc function
 * @name publicApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the publicApp
 */
angular.module('publicApp')
    .controller('MainCtrl', function ($scope, $log, socket) {
        $scope.message = '';
        $scope.messages = [];
        var FADE_TIME = 150; // ms
        var TYPING_TIMER_LENGTH = 400; // ms
        var COLORS = [
            '#e21400', '#91580f', '#f8a700', '#f78b00',
            '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
            '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
        ];

        // Initialize variables
        var username;
        var connected = false;
        var typing = false;
        var lastTypingTime;

        function addChatMessage (data, options) {
            $scope.messages.push(data);
        }

        function sendMessage () {
            socket.emit('send:message', {
                message: $scope.message
            });

            // add the message to our model locally
            $scope.messages.push($scope.message);

            // clear message box
            $scope.message = '';
        }

        socket.emit('send:message', 'as', function () {
            console.log('emit', data);

            var args = arguments;
            $rootScope.$apply(function () {
                if (callback) {
                    callback.apply(socket, args);
                }
            });
        });

        $scope.submitMessage = function (message) {
            sendMessage(message);
            $scope.message = '';

            socket.emit('chat message', 'aa');
        };

        /*socket.on('login', function (data) {
            connected = true;
            // Display the welcome message
            var message = "Welcome to Socket.IO Chat – ";
            log(message, {
                prepend: true
            });
            addParticipantsMessage(data);
        });*/

        // Whenever the server emits 'new message', update the chat body
        socket.on('new message', function (data) {
            addChatMessage(data);
        });

        // Whenever the server emits 'user joined', log it in the chat body
        socket.on('user joined', function (data) {
            log(data.username + ' joined');
            addParticipantsMessage(data);
        });

        // Whenever the server emits 'user left', log it in the chat body
        socket.on('user left', function (data) {
            log(data.username + ' left');
            addParticipantsMessage(data);
            removeChatTyping(data);
        });

        // Whenever the server emits 'typing', show the typing message
        socket.on('typing', function (data) {
            addChatTyping(data);
        });

        // Whenever the server emits 'stop typing', kill the typing message
        socket.on('stop typing', function (data) {
            removeChatTyping(data);
        });
    });
