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
    console.log('a user connected');
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
});


http.listen(3000, function () {
    console.log('listening on *:3000');
});