"use strict";
var creature = require("./creature.js");
var player = require("./player.js");
var mapblock = require("./mapblock.js");
var item = require("./item.js");

class Level{

    constructor(width, height){
        this.width = width;
        this.height = height;
        this.creatures = [];
        this.items = [];

        this.blocks = {};
    }

    getBlock(x, y){
        return this.blocks[mapblock.MapBlock.getKey(x, y)];
    }

    addCreature(creature){
        //Do not use this method to add the player to the map.
        if(!this.getCreature(creature.x, creature.y)){
            if(!(creature instanceof player.Player)){
                this.creatures.push(creature);
            }
            this.setCreatureBlocks(creature, creature.x, creature.y);
        }
        else{
            console.log("Warning! Creature overwritten!");
        }

    }

    getOrMakeBlock(x, y){
        let block = this.getBlock(x, y);
        if(!block){
            block = this.setBlock(x, y, 
                    new mapblock.MapBlock(x, y));
        }
        return block;
    }

    setBlock(x, y, block){
        this.blocks[mapblock.MapBlock.getKey(x, y)] = block;
        return this.getBlock(x, y);
    }

    getCreature(x, y){
        if(this.getBlock(x, y)){
            return this.getBlock(x, y).creature;
        }
        return false;
    }


    checkMovable(x, y, c){
        //c for creature to check internal segments
        if( x > this.width - 1 || x < 0 || y > this.height - 1 || y < 0){
            return false;
        }
        if(!this.checkWater(x, y) && c instanceof creature.WaterCreature){
            return false;
        }
        if (this.getBlock(x, y) && !this.getBlock(x, y).checkMovable(c)){
            return false;
        }
        return true;
    }
    checkAttackable(x, y){
        if( x > this.width - 1 || x < 0 || y > this.height - 1 || y < 0){
            return false;
        }
        return (this.getBlock(x, y) && this.getBlock(x, y).checkAttackable());
    }

    checkWater(x, y){
        if( x > this.width - 1 || x < 0 || y > this.height - 1 || y < 0){
            return false;
        }
        return (this.getBlock(x, y) && this.getBlock(x, y) instanceof mapblock.WaterBlock);
    }

    setCreatureBlocks(creature, newX, newY){
        for(let x = 0; x < creature.width; x++){
            for(let y = 0; y < creature.height; y++){
                //for(let z = 0; z < creature.zLevels; z++){
                //let block = this.blocks[creature.x + x][creature.y + y];
                let block = this.getOrMakeBlock(creature.x + x, creature.y + y);
                block.creature = creature;
                if(x == 0 && y == 0 && creature.scale == 1){
                    block.creatureSegment = false;
                }
                else if(x == creature.width - 1 && y == 0 && creature.scale == -1){
                    block.creatureSegment = false;
                }

                else{
                    block.creatureSegment = true;
                }
                //}
            }
        }

    }

    getJSON(){
        let blocks = {};
        //console.log(Object.keys(this.blocks));
        for(var key in this.blocks){
            let creatures = [];
            for(var c in this.blocks[key].creatures){
                creatures.push(this.blocks[key].creatures[c].getJSON());
            }
            blocks[key] = [ this.blocks[key].id, this.blocks[key].items, creatures];
        }
        return JSON.stringify(blocks);
        //console.log(blocks);
        //return JSON.stringify(this.blocks);
    }

    parseJSON(json, levelIndex, game){
        let l = JSON.parse(json);
        let level = new Level(50, 30);
        let blockFactory = mapblock.BlockFactory();
        for(var key in l){
            let type = blockFactory.idToType(l[k][0][0]);
            if(type != "ThoughtBlock" && type != "VirtueBlock" && type != "RealityBlock" && type != "BookBlock"){
                var block = blockFactory.createBlock(type, parseKey(key).x, parseKey(key).y);  
            }
            else{
                var block = blockFactory.createBlock(type, parseKey(key).x, parseKey(key).y, parseKey(key).x, parseKey(key).y, new Level(50, 30));  
            }
            block.creatures = creature.Creature.parseArray(l[k][0][2]);
            block.items = item.Item.parseArray(l[k][0][1]); 

            level[key] = block;
        }
    }

    loadLevel(file){
        var fs = require('fs'); 
        var d;
        fs.readFile('file', 'utf8', function(err, data) {
            if(err) throw err;
            d = data;
        });
        parseJSON(d);
    }
}
module.exports = {
    Level: Level
}
