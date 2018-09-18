"use strict";
var Level = require("./level.js");
var distance = require("./distance.js");
var creature = require("./creature.js");
var mapblock = require("./mapblock.js");
//var Game = require("./game.js");

class GameMap {
    constructor(Game){
        this.Game = Game;
        //this.map = [];
        //this.creatures = [];
        //this.levels = levels;
        //this.backgroundColor = undefined;
        //this is some bad naming here.
        //this.map = new Array(width);
        /*
        for (let i = 0; i < this.map.length; i++){
            this.map[i] = new Array(height);

            for(let j = 0; j < this.map[i].length; j++){
                this.map[i][j] = new Array(levels);

                for(let z = 0; z < this.map[i][j].length; z++){
                    this.map[i][j][z] = new MapBlock(i, j, z);
                }
            }
        }*/
        this.levels = [];
    }

    setBlock(x, y, level, block){
        this.levels[level].blocks[x][y] = block;
    }

    getBlock(x, y, level){
        return this.levels[level].blocks[x][y];
    }

    setLevel(level, pos){
        this.levels[pos] = level;
    }
    //setZLevelColor(level, color){
     //   this.backgroundColor = color;
    //}

    //also checks for water types to only go onto other water blocks.
    checkMovable(x, y, level, c){
        //c for creature to check internal segments
        if(level > this.levels.length - 1 || level < 0){
            return false;
        }
        if(!this.checkWater(x, y, level) && c instanceof creature.WaterCreature){
            return false;
        }
        return this.levels[level].checkMovable(x, y, c);
    }
    checkAttackable(x, y, level){
        if(level > this.levels.length - 1 || level < 0){
            return false;
        }
        return this.levels[level].checkAttackable(x, y);
    }
    
    checkWater(x, y, level){
        if(level > this.levels.length - 1 || level < 0){
            return false;
        }
        return this.levels[level].checkWater(x, y);
    }

    getCreature(x, y, level){
        return this.levels[level].getCreature(x, y);
    }

    addCreature(creature){
        if(!this.getCreature(creature.x, creature.y, creature.level)){
            if(!(creature === this.Game.player)){
                this.levels[creature.level].creatures.push(creature);
            }
            this.levels[creature.level].setCreatureBlocks(creature, creature.x, creature.y);
        }
        else{
            console.log("Warning! Creature overwritten!");
        }
    }

    canGoUp(x, y, z){
        if (this.levels[z].blocks[x][y] instanceof mapblock.StaircaseUpBlock){
            return true;
        }
        return false;
    }

    canGoDown(x, y, z){
        if (this.levels[z].blocks[x][y] instanceof mapblock.StaircaseDownBlock){
            return true;
        }
        return false;
    }

    creaturesAct(){
        for(let j = 0; j < this.levels.length; j++){
            for(let i = 0; i < this.levels[j].creatures.length; i++){
                let dir = Math.floor(Math.random() * 8);
                let cDir = distance.CDIRS[dir];
                this.Game.engine.addEvent(this.levels[j].creatures[i].move(cDir));
            }
        }
    }

    clearVisible(){
        let display = this.Game.display;
        for(let i = 0; i < display.squares.length; i++){
            for(let j = 0; j < display.squares[i].length; j++){
                for(let z = 0; z < display.squares[i][j].length; z++){
                    //Game.level.map[i + display.view.xOffset][j + display.view.yOffset][z].clear();
                    //this.levels[z].blocks[i + display.view.xOffset][j + display.view.yOffset].clear();

                    this.getBlock(i + display.view.offsets[z].xOffset, j + display.view.offsets[z].yOffset, z).clear();
                }
            }
        }
    }
}

module.exports = {
    GameMap: GameMap
}

