"use strict";
var Level = require("./level.js");
var distance = require("./distance.js");
var creature = require("./creature.js");
var mapblock = require("./mapblock.js");

class GameMap {
    constructor(Game){
        this.Game = Game;
        this.levels = [];
        this.levelChanged = false;
        this.blockChanged = false;
    }

    setBlock(x, y, level, block){
        this.levels[level].setBlock(x, y, block);
        this.blockChanged = true;
    }

    getBlock(x, y, level){
        return this.levels[level].getBlock(x, y);
    }

    getOrMakeBlock(x, y, level){
        return this.levels[level].getOrMakeBlock(x, y);
    }

    createAndSetLevel(pos){
        this.setLevel(new Level.level(50,30), pos);
    }
    createLevel(width, height){
        return new Level.level(width, height);
    }

    setLevel(level, pos){
        this.levels[pos] = level;
    }
    getLevel(z){
        return this.levels[z];
    }

    addItem(x, y, level, item){
        let block = this.levels[level].getOrMakeBlock(x, y).items.push(item);
    }

    deleteIfEmpty(x, y, z){
        let block = this.getBlock(x, y, z);
        if(block && block.id == 0 && block.creatures.length == 0 && block.items.length == 0){
            delete this.levels[z].blocks[mapblock.MapBlock.getKey(x, y)];
        }
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
            this.levels[creature.level].addCreature(creature);
        }
        else{
            console.log("Warning! Creature overwritten!");
        }
    }

    canGoUp(x, y, z){
        if (this.levels[z].getBlock(x, y) instanceof mapblock.StaircaseUpBlock){
            return true;
        }
        return false;
    }

    canGoDown(x, y, z){
        if (this.levels[z].getBlock(x, y) instanceof mapblock.StaircaseDownBlock){
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

}
module.exports = {
    GameMap: GameMap
}

