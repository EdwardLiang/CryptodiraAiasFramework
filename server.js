"use strict";
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var game = require('./server/game.js');
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var config = require('./config.js');

app.use("/socket", express.static('node_modules'));
app.use("/resources", express.static('resources'));
app.use("/client", express.static('client'));
app.use(cookieParser('keyboard cat'));
app.use(bodyParser());
app.use(session({ cookie: {maxAge: 60000 }}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

var mongoDB = 'mongodb://admin:' + config.admin_db_password + '@127.0.0.1/cryptodira?authSource=admin&authMode=scram-sha1&rm.tcpNoDelay=true';
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;

var db = mongoose.connection;

var LocalUserSchema = new mongoose.Schema({
    username: String,
    salt: String,
    hash: String
});


LocalUserSchema.methods.generateHash = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

LocalUserSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password, this.hash);
};

var User = mongoose.model('userauths', LocalUserSchema);

app.get('/', function(req, res, next){
    res.sendFile(__dirname + '/cryptodira.html');
});

app.get('/login', function(req, res, next){
    res.sendFile(__dirname + '/login.html');
});

app.get('/signup', function(req, res, next){
    res.sendFile(__dirname + '/signup.html');
});
app.post('/signup', passport.authenticate('local-signup', {
                                                            successRedirect: '/login',
                                                            failureRedirect: '/signup',
                                                            failureFlash: true}));

app.post('/login', passport.authenticate('local', { successRedirect: '/',
    failureRedirect: '/login', failureFlash: true }));


passport.use(new LocalStrategy(
            function(username, password, done){
                User.findOne({ username: username }, function(err, user){
                    if (err) { 
                        return done(err);
                    }
                    if (! user){
                        return done(null, false, {message: 'Incorrect username.' });
                    }
                    if(!user.validPassword(password)) {
                        console.log(user);
                        return done(null, false, {message: 'Incorrect password.' });
                    }
                    console.log("test");
                    /*hash( password, user.salt, function(err, hash){
                        if(err) {return done(err);}
                        if(hash == user.hash) return done(null, user);
                        done(null, false, { message: 'Incorrect Password.' });
                    });*/

                    return done(null, user);
                });
            }));

passport.use('local-signup', new LocalStrategy(
            function(username, password, done){
                process.nextTick(function() {
                    User.findOne({'username' : username }, function(err, user){
                        if(err){
                            return done(err);
                        }
                        if(user){
                            return done(null, false, {message: 'That username is already taken'});
                        }
                        else{
                            var newUser = new User();
                            newUser.username = username;
                            newUser.hash = newUser.generateHash(password);
                            newUser.save(function(err){
                                if(err){
                                    throw err;
                                }
                                return done(null, newUser);
                            });
                        }
                    });
                });
            }));

passport.serializeUser(function(user, done){
    done(null, user);
});
passport.deserializeUser(function(user, done){
    done(null, user);
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


