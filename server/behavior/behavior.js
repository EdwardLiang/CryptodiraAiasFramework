"use strict";
//var Game = require("../game.js");
var pf = require("../pathfinder.js");
var bt = require("./behaviortree.js");

class MoveBehavior extends bt.ExecuteBehaviorNode{

    constructor(direction, creature, Game){
        super();
        this.Game = Game;
        this.diff = direction;
        this.creature = creature;
    }

    execute(){

        if(this.creature.defeated){
            return;
        }
        this.success = true;
        let map = this.Game.map;
        let display = this.Game.display;
        let diff = this.diff;
        let newX = this.creature.x + diff.x;
        let newY = this.creature.y + diff.y;
        let newZ = this.creature.z + diff.z;

        for(let x = 0; x < this.creature.width; x++){
            for(let y = 0; y < this.creature.height; y++){
                //for(let z = 0; z < this.creature.zLevels; z++){
                if(!map.checkMovable(newX + x, newY + y, newZ, this.creature)) {return;}
                //}
            }
        }

        if(this.diff.x > 0){
            this.creature.scale = -1;
        }
        else if(this.diff.x < 0){
            this.creature.scale = 1;
        }

        this.creature.removeFromBlock();
        this.creature.moveToBlock(newX, newY, newZ);
    }
}

class DirectDirectionMoveBehavior extends bt.ExecuteBehaviorNode{

    constructor(creature, target, Game){
        super();
        this.Game = Game;
        this.creature = creature;
        this.target = target;
    }

    execute(){
        if(this.creature.defeated){
            return;
        }
        this.success = true;
        let map = this.Game.map;
        let display = this.Game.display;

        this.diff = pf.directPath(this.creature, this.target);
        let diff = this.diff;
        let newX = this.creature.x + diff.x;
        let newY = this.creature.y + diff.y;
        let newZ = this.creature.z + diff.z;


        for(let x = 0; x < this.creature.width; x++){
            for(let y = 0; y < this.creature.height; y++){
                //for(let z = 0; z < this.creature.zLevels; z++){
                if(!map.checkMovable(newX + x, newY + y, newZ, this.creature)) {return;}
                //}
            }
        }

        if(this.diff.x > 0){
            this.creature.scale = -1;
        }
        else if(this.diff.x < 0){
            this.creature.scale = 1;
        }

        this.creature.removeFromBlock();
        this.creature.moveToBlock(newX, newY, newZ);
        return ["The bird is seeking you"];
        //}
}
}

module.exports = {
    MoveBehavior: MoveBehavior, 
    DirectDirectionMoveBehavior: DirectDirectionMoveBehavior
}
