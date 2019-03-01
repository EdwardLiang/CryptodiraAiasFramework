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
var bcrypt = require('bcrypt');
var config = require('./config.js');

app.use(flash());
app.use("/socket", express.static('node_modules'));
app.use("/resources", express.static('resources'));
app.use("/client", express.static('client'));
app.use(cookieParser('session_secret'));
app.use(bodyParser());
app.set('view engine', 'ejs');
//app.use(session({ cookie: {maxAge: 60000 }}));

var mongoDB = 'mongodb://admin:' + config.admin_db_password + '@127.0.0.1/cryptodira?authSource=admin';
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;

var db = mongoose.connection;


var connect = require('connect');
/*var MongoStore = require('connect-mongo-store')(connect);
var mongoStore = new MongoStore(db);
connect().use(connect.session({store: mongoStore, secret: 'keyboard cat'}));

mongoStore.on('connect', function(){
    console.log("mongo connection working");
});

mongoStore.on('error', function(err){
    console.log("mongo connection error", err);
});*/



var MongoStore = require("connect-mongo")(session);
var sessionStore = new MongoStore({mongooseConnection: db});

app.use(session({
    secret: 'session_secret',
    store: sessionStore,
    cookie: {maxAge: 60000},
    saveUninitialized: true,
    resave: false
    }));


var passportSocketIo = require("passport.socketio");

io.use(passportSocketIo.authorize({
    //passport: passport,
    //cookieParser: cookieParser,
    key: "connect.sid",
    secret: "session_secret",
    store: sessionStore,
    success: onAuthorizeSuccess,
    fail: onAuthorizeFail,
    resave: false
}));


app.use(passport.initialize());
app.use(passport.session());

var LocalUserSchema = new mongoose.Schema({
    username: String,
    hash: String
});

LocalUserSchema.methods.setPassword = function (password, callback){
    bcrypt.hash(password, 8, function(err, hash) {
        this.hash = hash;
        callback(this);
    }.bind(this));
};

var User = mongoose.model('userauths', LocalUserSchema);

app.get('/cryptodira.html', function(req, res, next){
    if(req.user){
        next();
    }
    else{
        res.redirect('/');
    }
},
function(req, res, next){
    res.sendFile(__dirname + '/cryptodira.html');
});

app.get('/', function(req, res, next){
    //res.sendFile(__dirname + '/login.html');
    res.render('login.ejs', {message: req.flash('error')} );
});

app.get('/signup', function(req, res, next){
    //res.sendFile(__dirname + '/signup.html');
    res.render('signup.ejs', {message: req.flash('error')} );
});
app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/',
    failureRedirect: '/signup',
    failureFlash: true}));

app.post('/login', passport.authenticate('local', { successRedirect: '/cryptodira.html',
    failureRedirect: '/', failureFlash: true }));


passport.use(new LocalStrategy(
            function(username, password, done){
                User.findOne({ username: username }, function(err, user){
                    if (err) { 
                        return done(err);
                    }
                    if (! user){
                        return done(null, false, {message: 'Incorrect username.' });
                    }
                    bcrypt.compare(password, user.hash, function(err, res){
                        if(res == true){
                            return done(null, user);
                        }
                        else{
                            return done(null, false, {message: 'Incorrect password.' });
                        }
                    });
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
                            newUser.setPassword(password, function(newUser){
                                newUser.save(function(err){
                                    if(err){
                                        throw err;
                                    }
                                    return done(null, newUser);
                                });
                            });
                        }
                    });
                });
            }));

passport.serializeUser(function(user, done){
    done(null, user.id);
});
passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        done(err, user);
    });
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
        if(Game.map.levelChanged || Game.map.blockChanged){
            client.emit('map', Game.getMapJSON());
            Game.map.levelChanged = false;
            Game.map.blockChanged = false;
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

function onAuthorizeSuccess(data, accept){
    accept();
}

function onAuthorizeFail(data, message, error, accept){
    console.log(message);
    if(error){
        accept(new Error(message));
    }
}


server.listen(8080);


