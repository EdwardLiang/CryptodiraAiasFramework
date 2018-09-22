"use strict";
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var game = require('./server/game.js');

app.use("/socket", express.static('node_modules'));
app.use("/resources", express.static('resources'));
app.use("/client", express.static('client'));

app.get('/', function(req, res, next){
    res.sendFile(__dirname + '/cryptodira.html');
});


io.on('connection', function(client){
    console.log('Client connected');
    var Game = new game.Game();
    client.on('join', function(data){
        Game.init();
        client.emit('offsets', Game.getOffsetsJSON());
        client.emit('player', Game.getPlayerJSON());
        client.emit('map', Game.getMapJSON());
        client.emit('creatures', Game.getCreaturesJSON());
        client.emit('items', Game.getItemsJSON());
        client.emit('message', Game.getMessage());
    });
    client.on('key', function(data){
        Game.controls.handleEvent(JSON.parse(data));
        client.emit('offsets', Game.getOffsetsJSON());
        client.emit('player', Game.getPlayerJSON());
        if(Game.map.levelChanged){
            client.emit('map', Game.getMapJSON());
            Game.map.levelChanged = false;
        }
        client.emit('creatures', Game.getCreaturesJSON());
        client.emit('items', Game.getItemsJSON());
        client.emit('message', Game.getMessage());
        if(Game.getShowInventory()){
            client.emit('inventory', Game.getInventoryJSON());
        }
        else{
            client.emit('inventory', 'false');
        }
    });
    client.on('inventory', function(data){
    });
});


server.listen(8080);


