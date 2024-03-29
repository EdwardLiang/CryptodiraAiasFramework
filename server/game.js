"use strict";
var display = require("./display.js");
var creature = require("./creature.js");
var engine = require("./engine.js");
var player = require("./player.js");
var gameMap = require("./gamemap.js");
var level = require("./level.js");
var mapblock = require("./mapblock.js");
var items = require("./item.js");
var btb = require("./behavior/behaviortreebuilder.js");
var controls = require("./controls.js");
//var mongoose = require('mongoose');
var config = require('../config.js');
var session = require('express-session');
var models = require("./databasemodels.js");
var mongoose = require("mongoose");

class Game {
    constructor(user){
        this.display = null;
        this.realTime = false;
        this.timer = 0;
        this.messageStayDelay = 10;
        this.simpleLayers = false;
        this.save = false;
        this.user = user.username;

        mongoose.set('bufferCommands', false);
        //mongoose.set('debug', true);
        mongoose.connection.on('connected', function () {
            console.log("mongoose connection established");
        });
        //console.log(this.mongoose);
        //this.mongoDB = 'mongodb://admin:' + config.admin_db_password + '@127.0.0.1/cryptodira?authSource=admin'; 
        //this.mongoose.connect(this.mongoDB);
        mongoose.Promise = global.Promise;
        var db = mongoose.connection;
        var connect = require('connect');
        var MongoStore = require("connect-mongo")(session);
        var sessionStore = new MongoStore({mongooseConnection: db});
        //this.levelTest();

        /*var levelSchema = new mongoose.Schema({
            user: String,
            name: String,
            dump: String
        });


        var levelModel = mongoose.model('Level', levelSchema);
        var query = {'user': this.user + "3", 'name': "asdf" };
        levelModel.find({}, function(err, level) {
            console.log("test2");
        });
        */
    }

    getGameMap(){
        return this.map;
    }
    getCurrentLevelJSON(){
        return this.map.getLevel(this.player.z).getJSON();
    }
    levelTest(){

        var query = {'user': this.user + "3", 'name': "asdf" };
        models.levelModel.find({}, function(err, level) {
            console.log("test2");
        });

    }
    async init(){

        //this.mongoose.connect(this.mongoDB);
        //
        //this.levelTest();
        this.map = new gameMap.GameMap(this);
        this.display = new display.Display(this);
        this.engine = new engine.Engine(this);

        var levelsLoaded = false;


        /*var l0 = new Promise((resolve, reject) =>{
            models.levelModel.findOne({user:this.user, name:"level0"}, function(err, result){
                if (err) {console.log("level database error!");}
                if(result){
                    Promise.resolve(result);
                }
            });
        });
        */

        let virtueLevel = new level.Level(50, 30, "virtueLevel");
        let mathLevel = new level.Level(50,30, "mathLevel");
        let thoughtLevel = new level.Level(50,30, "thoughtLevel");

        //var mongoDB = 'mongodb://admin:' + config.admin_db_password + '@127.0.0.1:27017/cryptodira?authSource=admin'; 
        //mongoose.createConnection(mongoDB);
        //console.log(mongoDB);
        //

        /*var levelSchema = new mongoose.Schema({
            user: String,
            name: String,
            dump: String
        });
        */


        //var levelModel = mongoose.model('Level', levelSchema);
        /*var query = {'user': this.user + "3", 'name': "asdf" };
        levelModel.findOneAndUpdate(query, {dump: "asdf"}, {upsert: true}, function(err, doc) {
            console.log
            if (err){
                console.log(err);
            }
            else{
                console.log('Successfully saved level.');
            }
            console.log("test"); 
        });
        */

        /*levelModel.find({}, function(err, level) {
            console.log("test2");
            levelsLoaded = true;
        });
        */
        var query = {user:this.user, name:"level0"};
        //await models.levelModel.findOne(query, this.level0.bind(this));
        //
        //
        let loadedLevel = level.Level.loadLevel('./server/levels/prototype.json', this);
        loadedLevel.setCreaturesZ(1);

        this.player = new player.Player(1, 1, 0, this);

        await models.levelModel.findOne(query, function(err, result){
            //console.log("triggered"); 
            //console.log(result);
            //console.log(this);
            if(err){
                console.log(err);
            }
            if(result){
                //console.log(result);
                let level0 = level.Level.parseJSON(result.dump, this, result.name);
                this.map.setLevel(level0, 0);
                this.map.addCreature(this.player);
                //console.log(level0);
            }
            else{
                let level0 = new level.Level(50, 30, "level0");
                this.map.setLevel(level0, 0);

                this.map.setBlock(4,4,0,new mapblock.SolidBlock(4,4,0));
                this.map.setBlock(4,5,0,new mapblock.EvergreenBlock(4,5,0));
                this.map.setBlock(4,6,0,new mapblock.DeciduousBlock(4,6,0));
                this.map.setBlock(10,3,0, new mapblock.BookBlock(10,3, loadedLevel, 10,3));
                this.map.setBlock(7,3,0, new mapblock.BookBlock(7,3, mathLevel, 7, 3));
                this.map.setBlock(8,3,0, new mapblock.ThoughtBlock(8,3, thoughtLevel, 8, 3));
                this.map.setBlock(9,3,0, new mapblock.VirtueBlock(9,3, virtueLevel, 9, 3));
                this.map.addItem(5,5,0, new items.Orange());
                this.map.addItem(5,6,0, new items.BlockMaker("WaterBlock"));
                this.map.addItem(6,5,0, new items.BasicShirt());
                this.map.addItem(8,5,0, new items.BasicPants());
                this.map.addItem(9,5,0, new items.RunningShoes());
                this.map.addItem(10,5,0, new items.CryptodiraAias());
                this.map.addItem(11,5,0, new items.Pencil());
                this.map.setBlock(3,13,0, new mapblock.WaterBlock(3,13,0));
                this.map.setBlock(3,14,0, new mapblock.WaterBlock(3,14,0));
                this.map.setBlock(3,15,0, new mapblock.WaterBlock(3,15,0));
                this.map.setBlock(4,13,0, new mapblock.WaterBlock(4,13,0));
                this.map.setBlock(4,14,0, new mapblock.WaterBlock(4,14,0));
                this.map.setBlock(4,15,0, new mapblock.WaterBlock(4,15,0));
                this.map.setBlock(5,13,0, new mapblock.WaterBlock(5,13,0));
                this.map.setBlock(5,14,0, new mapblock.WaterBlock(5,14,0));
                this.map.setBlock(5,15,0, new mapblock.WaterBlock(5,15,0));
                this.map.setBlock(4,4,0,new mapblock.SolidBlock(4,4,0));

                this.map.setBlock(6,6,0,new mapblock.WaterBlock(6,6,0));
                this.map.setBlock(7,7,0,new mapblock.GrassBlock(7,7,0));
                this.map.setBlock(7,8,0,new mapblock.IceBlock(7,8,0));
                this.map.setBlock(8,7,0,new mapblock.StoneBlock(8,7,0));
                this.map.setBlock(9,7,0,new mapblock.FountainBlock(9,7,0));

                this.map.setBlock(3,3,0,new mapblock.StaircaseUpBlock(3,3,0));

                //this.level.map[6][6][0].(new Orange());
                let t = new creature.Turtle(6,6,0, this);
                let t2 = new creature.Turtle(10,6,0, this);
                let t3 = new creature.Turtle(15,6,0, this);
                let f = new creature.Cat(7,7,0, this);
                let d = new creature.Dog(8,8,0, this);
                let r = new creature.Robot(9,9,0, this);
                let r2 = new creature.Robot(10,10,0, this);
                let b = new creature.Bird(13, 13, 0, this.player, this);
                let dol = new creature.Dolphin(4, 14, 0, this);
                let tow = new creature.Tower(14, 4, 0, this);
                b.addItem(new items.Peanut());
                r.addItem(new items.Battery());
                r2.actionBuilder = new btb.MoveBoxPredicateSucceedBuilder(r2, this);
                t2.actionBuilder = new btb.RandomMoveUntilFailBuilder(t2, this); 
                t3.actionBuilder = new btb.RandomMoveCancelBuilder(t3, this); 
                this.map.addCreature(t);
                this.map.addCreature(t2);
                this.map.addCreature(t3);
                this.map.addCreature(f);
                this.map.addCreature(d);
                this.map.addCreature(r);
                this.map.addCreature(r2);
                this.map.addCreature(b);
                this.map.addCreature(this.player);
                this.map.addCreature(dol);
                this.map.addCreature(tow);
                console.log(level0);
            }
            this.levelsLoaded = true;

            //console.log("test4");

        }.bind(this));

        //let level0 = (level.Level.parseJSON(models.levelModel.findOne({user:this.user, name:"level0"}).dump,this) || new level.Level(50, 30, "level0"));
        //
        /*l0.then(result => {
            console.log("asdf");
            if(result){
                let level = level.Level.parseJSON(result.dump);
                this.map.setLevel(result, 0);
            }
            else{
                this.map.setLevel(new level.Level(50, 30, "level0"));

                this.map.setBlock(4,4,0,new mapblock.SolidBlock(4,4,0));
                this.map.setBlock(4,5,0,new mapblock.EvergreenBlock(4,5,0));
                this.map.setBlock(4,6,0,new mapblock.DeciduousBlock(4,6,0));
                this.map.setBlock(10,3,0, new mapblock.BookBlock(10,3, loadedLevel, 10,3));
                this.map.setBlock(7,3,0, new mapblock.BookBlock(7,3, mathLevel, 7, 3));
                this.map.setBlock(8,3,0, new mapblock.ThoughtBlock(8,3, thoughtLevel, 8, 3));
                this.map.setBlock(9,3,0, new mapblock.VirtueBlock(9,3, virtueLevel, 9, 3));
                this.map.addItem(5,5,0, new items.Orange());
                this.map.addItem(5,6,0, new items.BlockMaker("WaterBlock"));
                this.map.addItem(6,5,0, new items.BasicShirt());
                this.map.addItem(8,5,0, new items.BasicPants());
                this.map.addItem(9,5,0, new items.RunningShoes());
                this.map.addItem(10,5,0, new items.CryptodiraAias());
                this.map.addItem(11,5,0, new items.Pencil());
                this.map.setBlock(3,13,0, new mapblock.WaterBlock(3,13,0));
                this.map.setBlock(3,14,0, new mapblock.WaterBlock(3,14,0));
                this.map.setBlock(3,15,0, new mapblock.WaterBlock(3,15,0));
                this.map.setBlock(4,13,0, new mapblock.WaterBlock(4,13,0));
                this.map.setBlock(4,14,0, new mapblock.WaterBlock(4,14,0));
                this.map.setBlock(4,15,0, new mapblock.WaterBlock(4,15,0));
                this.map.setBlock(5,13,0, new mapblock.WaterBlock(5,13,0));
                this.map.setBlock(5,14,0, new mapblock.WaterBlock(5,14,0));
                this.map.setBlock(5,15,0, new mapblock.WaterBlock(5,15,0));
                this.map.setBlock(4,4,0,new mapblock.SolidBlock(4,4,0));

                this.map.setBlock(6,6,0,new mapblock.WaterBlock(6,6,0));
                this.map.setBlock(7,7,0,new mapblock.GrassBlock(7,7,0));
                this.map.setBlock(7,8,0,new mapblock.IceBlock(7,8,0));
                this.map.setBlock(8,7,0,new mapblock.StoneBlock(8,7,0));
                this.map.setBlock(9,7,0,new mapblock.FountainBlock(9,7,0));

                this.map.setBlock(3,3,0,new mapblock.StaircaseUpBlock(3,3,0));

                //this.level.map[6][6][0].(new Orange());
                let t = new creature.Turtle(6,6,0, this);
                let t2 = new creature.Turtle(10,6,0, this);
                let t3 = new creature.Turtle(15,6,0, this);
                let f = new creature.Cat(7,7,0, this);
                let d = new creature.Dog(8,8,0, this);
                let r = new creature.Robot(9,9,0, this);
                let r2 = new creature.Robot(10,10,0, this);
                let b = new creature.Bird(13, 13, 0, this.player, this);
                let dol = new creature.Dolphin(4, 14, 0, this);
                let tow = new creature.Tower(14, 4, 0, this);
                b.addItem(new items.Peanut());
                e.addItem(new items.Peanut());
                r.addItem(new items.Battery());
                r2.actionBuilder = new btb.MoveBoxPredicateSucceedBuilder(r2, this);
                t2.actionBuilder = new btb.RandomMoveUntilFailBuilder(t2, this); 
                t3.actionBuilder = new btb.RandomMoveCancelBuilder(t3, this); 
                this.map.addCreature(t);
                this.map.addCreature(t2);
                this.map.addCreature(t3);
                this.map.addCreature(f);
                this.map.addCreature(d);
                this.map.addCreature(r);
                this.map.addCreature(r2);
                this.map.addCreature(b);
                this.map.addCreature(this.player);
                this.map.addCreature(dol);
                this.map.addCreature(tow);
            }
            levelsLoaded = true;
        }, err => { console.log(err) });
    */
                //let level1 = level.Level.parseJSON(l0.
                let level1 = new level.Level(50, 30, "level1");
                let level2 = new level.Level(50, 30, "level2");
                let level3 = new level.Level(50, 30, "level3");
                let level4 = new level.Level(50, 30, "level4");

                //let level5 = new Level(50, 30);
                //
                //this.map.setLevel(level0, 0);
                // if(!this.map.getLevel(0)){

                //}

                this.map.setLevel(level1, 1);
                this.map.setLevel(level2, 2);
                this.map.setLevel(level3, 3);
                //this.map.setLevel(level4, 4);
                //this.map.setLevel(level5, 5);


                //reality/knowledge/thought&feeling/virtue
                //maybe add physical between reality and knowledge 

                this.map.setBlock(8,6,1,new mapblock.SolidBlock(8,6,1));
                this.map.setBlock(8,7,1,new mapblock.SolidBlock(8,7,1));
                this.map.setBlock(8,8,1,new mapblock.SolidBlock(8,8,1));

                this.map.setBlock(9,6,1,new mapblock.SolidBlock(9,6,1));
                this.map.setBlock(9,7,1,new mapblock.SolidBlock(9,7,1));
                this.map.setBlock(9,8,1,new mapblock.SolidBlock(9,8,1));

                this.map.setBlock(8,6,2,new mapblock.SolidBlock(8,6,2));
                this.map.setBlock(8,7,2,new mapblock.SolidBlock(8,7,2));
                this.map.setBlock(8,8,2,new mapblock.SolidBlock(8,8,2));

                this.map.setBlock(7,6,2,new mapblock.SolidBlock(7,6,2));
                this.map.setBlock(7,7,2,new mapblock.SolidBlock(7,7,2));
                this.map.setBlock(7,8,2,new mapblock.SolidBlock(7,8,2));


                this.map.setBlock(9,6,2,new mapblock.SolidBlock(9,6,2));
                this.map.setBlock(9,7,2,new mapblock.SolidBlock(9,7,2));
                this.map.setBlock(9,8,2,new mapblock.SolidBlock(9,8,2));


                this.map.setBlock(2,2,1,new mapblock.StoneBlock(2,2,1));
                this.map.setBlock(2,2,2,new mapblock.StoneBlock(2,2,2));
                this.map.setBlock(2,2,3,new mapblock.StoneBlock(2,2,3));

                this.map.setBlock(20,15,1,new mapblock.StaircaseDownBlock(20,15,1));
                this.map.setBlock(4,4,1,new mapblock.StaircaseUpBlock(4,4,1));
                this.map.setBlock(4,5,2,new mapblock.StaircaseDownBlock(4,5,2));

                this.map.setBlock(10,10,2, new mapblock.WallBlock(10, 10, 2));

                this.map.setBlock(20,11,2, new mapblock.WallBlock(20, 11, 2));
                this.map.setBlock(20,12,2, new mapblock.WallBlock(20, 12, 2));
                this.map.setBlock(20,13,2, new mapblock.WallBlock(20, 13, 2));
                this.map.setBlock(21,10,2, new mapblock.WallBlock(21, 10, 2));
                this.map.setBlock(22,10,2, new mapblock.WallBlock(22, 10, 2));
                this.map.setBlock(23,10,2, new mapblock.WallBlock(23, 10, 2));
                this.map.setBlock(23,11,2, new mapblock.WallBlock(23, 11, 2));
                this.map.setBlock(23,12,2, new mapblock.WallBlock(23, 12, 2));
                this.map.setBlock(23,13,2, new mapblock.WallBlock(23, 13, 2));
                this.map.setBlock(20,10,2, new mapblock.WallBlock(20, 10, 2));
                this.map.setBlock(6,6,2, new mapblock.StaircaseUpBlock(6,6,2));
                this.map.setBlock(3,3,3, new mapblock.StaircaseDownBlock(3,3,3));

                //this.map.setBlock(6,6,3, new mapblock.StaircaseUpBlock(6,6,3));
                //this.map.setBlock(3,3,4, new mapblock.StaircaseDownBlock(3,3,4));

                //this.map.setBlock(6,6,4, new StaircaseUpBlock(6,6));
                //this.map.setBlock(3,3,5, new StaircaseDownBlock(3,3));
                //


                //console.log(level0);
                //console.log(loadedLevel);
                //virtueLevel.setBlock(9, 4, new mapblock.RealityBlock(9, 4, level0, 10, 10));
                thoughtLevel.setBlock(9, 4, new mapblock.BookBlock(9, 4, mathLevel, 10, 10));
                //this.map.setBlock(3,5,4, new mapblock.GrassBlock(3,5,4));
                let e = new creature.Elephant(28, 12, 1, this);
                let anger = new creature.Anger(14, 4, 2, this);
                let mN = new creature.MusicNote(14, 5, 1, this);
                let bStorm = new creature.BrainStorm(15, 5, 2, this);
                let contradiction = new creature.Contradiction(17, 5, 2, this);
                let connection = new creature.Connection(19, 5, 2, this);
                let puz = new creature.Puzzle(20, 5, 2, this);
                let syn = new creature.Synthesis(20, 6, 2, this);
                let ind = new creature.Induction(24, 6, 2, this);
                let wrath = new creature.Wrath(14, 4, 3, this);
                let lust = new creature.Lust(14, 5, 3, this);
                let add = new creature.Addition(14, 4, 1, this);
                let der = new creature.Derivative(15, 4, 1, this);

                e.addItem(new items.Peanut());
                this.map.addCreature(e);
                thoughtLevel.addCreature(anger);
                mathLevel.addCreature(mN);
                thoughtLevel.addCreature(bStorm);
                thoughtLevel.addCreature(anger);
                thoughtLevel.addCreature(contradiction);
                thoughtLevel.addCreature(connection);
                thoughtLevel.addCreature(puz);
                thoughtLevel.addCreature(syn);
                thoughtLevel.addCreature(ind);
                virtueLevel.addCreature(wrath);
                virtueLevel.addCreature(lust);

                mathLevel.addCreature(add);
                mathLevel.addCreature(der);

                this.controls = new controls.PlayerEventListener(this);

                this.controls.player = this.player;
                this.controls.map = this.map;
                this.controls.engine = this.engine;
                this.controls.display = this.display;


                //while(!levelsLoaded){
                //}

                //console.log(this.mongoose.connection.readyState);
                // }
                this.display.displayMap(this.map);
                this.map.blockChanged = false;

                //window.addEventListener("keydown", PlayerEventListener);
                /*

        if(this.realTime){
            let loop = function(){
                if(Game.timer >= Game.messageStayDelay){
                    Game.display.clearMessages();
                    Game.engine.messageQ = [];
                    Game.timer = 0;
                }
                else{
                    Game.timer++;
                }
                Game.map.creaturesAct();
                Game.engine.timeStep();
                Game.map.clearVisible();
                Game.display.redraw();

                setTimeout(loop, 100);
            }
            loop();
        }*/
            }

    makeDisplayBlocks(){
        this.map.clearVisible();
        //this.display.redraw();
        return this.display.getDisplayBlocks();
    }

    getBlocksJSON(){
        this.map.clearVisible();
        //this.display.redraw();
        return this.display.getDisplayBlocks();
    }

    getMapJSON(){
        return this.display.getMapJSON();
    }
    getOffsetsJSON(){
        return this.display.getOffsetsJSON();
    }


    getCreaturesJSON(){
        let creatures = [];
        for(let i = 0; i < this.map.levels.length; i++){
            creatures = creatures.concat(this.map.levels[i].creatures);
        }
        return this.display.getCreaturesJSON(creatures);
    }
    getItemsJSON(){
        return this.display.getItemsJSON();
    }
    getInventoryJSON(){
        return this.display.getInventoryJSON();
    }
    getShowInventory(){
        return this.display.inventoryVisible;
    }

    getPlayerJSON(){
        return this.display.getPlayerJSON();
    }

    getOffsets(){
        return this.display.getOffsetsJSON();
    }

    getMessage(){
        return this.display.getMessage();
    }
};

module.exports = {
    Game: Game
}
