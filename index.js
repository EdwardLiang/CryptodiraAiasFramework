"use strict";
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var Game = require('./src/game.js');

app.use("/socket", express.static('node_modules'));
app.use("/resources", express.static('resources'));
app.use("/display", express.static('js'));

app.get('/', function(req, res, next){
    res.sendFile(__dirname + '/index.html');
});


io.on('connection', function(client){
    console.log('Client connected');
    client.on('join', function(data){
        Game.init();
        client.emit('blocks', Game.makeDisplayBlocks());
        client.emit('creatures', Game.getCreaturesJSON());
        client.emit('player', Game.getPlayerJSON());
    });
});

server.listen(8080);


