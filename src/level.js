"use strict";
var creature = require("./creature.js");
var mapblock = require("./mapblock.js");
class Level{

    constructor(width, height){
        this.width = width;
        this.height = height;
        this.creatures = [];
        this.items = [];

        this.blocks = new Array(width);
        for (let i = 0; i < this.blocks.length; i++){
            this.blocks[i] = new Array(height);
            for(let j = 0; j < this.blocks[i].length; j++){
                this.blocks[i][j] = new mapblock.MapBlock(i, j);
            }
        }
    }

    setBlock(x, y, block){
        this.blocks[x][y] = block;
    }

    getCreature(x, y){
        return this.blocks[x][y].creature;
    }

    checkMovable(x, y, c){
        //c for creature to check internal segments
        if( x > this.blocks.length - 1 || x < 0 || y > this.blocks[0].length - 1 || y < 0){
            return false;
        }
        if(!this.checkWater(x, y) && c instanceof creature.WaterCreature){
            return false;
        }
        if (this.blocks[x][y].checkMovable(c)){
            return true;
        }
        return false;
    }
    checkAttackable(x, y){
        if( x > this.blocks.length - 1 || x < 0 || y > this.blocks[0].length - 1 || y < 0){
            return false;
        }
        return this.blocks[x][y].checkAttackable();
    }

    checkWater(x, y){
        if( x > this.blocks.length - 1 || x < 0 || y > this.blocks[0].length - 1 || y < 0){
            return false;
        }
        return this.blocks[x][y] instanceof mapblock.WaterBlock;
    }

    setCreatureBlocks(creature, newX, newY){
        for(let x = 0; x < creature.width; x++){
            for(let y = 0; y < creature.height; y++){
                //for(let z = 0; z < creature.zLevels; z++){
                let block = this.blocks[creature.x + x][creature.y + y];
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

}
module.exports = {
    Level: Level
}
