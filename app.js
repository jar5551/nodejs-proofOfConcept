var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);


var User = function (username) {
    var _this = this;
    _this.username = username;

    getUserName = function () {
        return _this.username;
    }
};

var comoonMethods = {
    getIndexOfElementInArray: function (array, parameter, value) {
        for(var i in array) {
            if(array[i][parameter] == value) {
                return i;
            }
        }
    }
};

app.use(express.static(__dirname + '/public/app'));

var numUsers = 0;

/*app.get('/', function (req, res) {
    res.sendFile(__dirname + '/views/chat.html');
});*/

var users = [];

io.on('connection', function (socket) {
    var addedUser = false;

    var chatMethods = {
        getCommand: function (command) {
            var commandSplit = command.split(' ');

            switch (commandSplit[0]) {
                case '/name':
                    chatMethods.setName(commandSplit[1]);
                break;

                case '/help':
                    chatMethods.showHelp();
                    break;

            }
        },
        setName: function (username) {
            socket.username = username;
        },
        showHelp: function () {
            socket.broadcast.emit('new message', {
                username: 'help',
                message: '/name aby zmienic nazwe uzytkownika'
            });
        }
    };

    socket.on('new message', function (data) {
        // we tell the client to execute 'new message'

        if(data[0] === '/') {
            chatMethods.getCommand(data);
            return;
        }

        socket.broadcast.emit('new message', {
            username: socket.username,
            message: data
        });
    });

    // when the client emits 'add user', this listens and executes
    socket.on('add user', function (username) {
        if (addedUser) return;

        // we store the username in the socket session for this client
        socket.username = username;
        ++numUsers;
        addedUser = true;
        socket.emit('login', {
            numUsers: numUsers
        });
        // echo globally (all clients) that a person has connected
        socket.broadcast.emit('user joined', {
            username: socket.username,
            numUsers: numUsers
        });
    });

    // when the client emits 'typing', we broadcast it to others
    socket.on('typing', function () {
        socket.broadcast.emit('typing', {
            username: socket.username
        });
    });

    // when the client emits 'stop typing', we broadcast it to others
    socket.on('stop typing', function () {
        socket.broadcast.emit('stop typing', {
            username: socket.username
        });
    });

    // when the user disconnects.. perform this
    socket.on('disconnect', function () {
        if (addedUser) {
            --numUsers;

            // echo globally that this client has left
            socket.broadcast.emit('user left', {
                username: socket.username,
                numUsers: numUsers
            });
        }
    });
});


http.listen(3000, function () {
    console.log('listening on *:3000');
});