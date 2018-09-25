"use strict";
//var Game = require("./game.js");
var btb = require("./behavior/behaviortreebuilder.js");

class Creature{

    constructor(x, y, level, Game){
        this.x = x;
        this.y = y;
        this.z = level;
        this.id = 0;
        this.Game = Game;
        this.width = 1;
        this.height = 1;
        //this.zLevels = 1;
        this.items = {};
        this.scale = -1;
        this.hp = 5;
        this.name = "creature";
        this.defeated = false;
        this.availableSymbols = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 
        'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
        this.behaviorTreeBuilder = new btb.RandomMoveBuilder(this, this.Game); 
        this.behaviorTree = this.behaviorTreeBuilder.behaviorTree;
    }

    get level(){
        return this.z;
    }

    getItem(index){
        if(index in this.items){
            return this.items[index];
        }
        else{
            return null;
        }
    }

    addItems(array){
        let availableSymbols = this.availableSymbols;
        for(let i = 0; i < array.length; i++){
            if(availableSymbols.length > 0){
                var letter = availableSymbols[0];
                availableSymbols.shift();
            }
            else{
                console.log("Inventory is full! Write code for this!");
                break;
            }
            this.items[letter] = array[i];
        }
    }

    dropItem(index){
        let item = this.getItem(index);
        if(index in this.items){
            this.Game.map.getOrMakeBlock(this.x,this.y,this.z).items.unshift(this.items[index]);

            delete this.items[index];
            this.availableSymbols.unshift(index);
        }
        return item;
    }

    addItem(a){
        let availableSymbols = this.availableSymbols;
        if(availableSymbols.length > 0){
            var letter = availableSymbols[0];
            availableSymbols.shift();
        }
        else{
            console.log("Inventory is full! Write code for this!");
        }
        this.items[letter] = a;
    }

    get key(){
        return this.x + "," + this.y;
    }

    draw(){
        this.Game.display.draw(this.x, this.y, icon, iconColor);
    }

    decreaseHp(amount){
        this.hp -= amount;
        if(this.hp <= 0){
            this.defeated = true;
        }
    }

    die(){
        this.Game.map.levels[this.z].creatures = this.Game.map.levels[this.z].creatures.filter(e => e !== this);
       this.removeFromBlock();

        let itemKeys = Object.keys(this.items);
        for(let i = 0; i < itemKeys.length; i++){
            this.Game.map.getOrMakeBlock(this.x,this.y,this.z).items.unshift(this.items[itemKeys[i]]);
        }
        this.items = {};
    }

    removeFromBlock(){
        for(let x = 0; x < this.width; x++){
            for(let y = 0; y < this.height; y++){
                //for(let z = 0; z < this.zLevels; z++){
                this.Game.map.getBlock(this.x + x,this.y + y,this.z).removeCreature(this);
                this.Game.map.getBlock(this.x + x,this.y + y,this.z).creatureSegment = false;
                this.Game.map.deleteIfEmpty(this.x + x, this.y + y, this.z);
                //}
            }
        }
    }

    moveToBlock(newX, newY, newZ){
        this.x = newX;
        this.y = newY;
        this.z = newZ;
        this.Game.map.levels[newZ].setCreatureBlocks(this, this.x, this.y);
    }

    move(diff){
        if(this.defeated){
            return null;
        }
    }
    set actionBuilder(a){
        this.behaviorTreeBuilder = a; 
        this.behaviorTree = this.behaviorTreeBuilder.behaviorTree;
    }
}

class WaterCreature extends Creature{}

class Dolphin extends WaterCreature{
    constructor(x, y, z, game){
        super(x, y, z, game);
        this.name = "Dolphin";
        this.id = 2;
    }

    move(diff){
        super.move(diff);
        let a = this.behaviorTree.next();
        return a.execute.bind(a);
    }

}

class Turtle extends Creature{

    constructor(x, y, z, game){
        super(x, y, z, game);
        this.name = "Turtle";
        this.id = 3;
    }

    move(diff){
        super.move(diff);
        let a = this.behaviorTree.next();
        return a.execute.bind(a);
    }

}

class Tower extends Creature{

    constructor(x,y,z, game){
        super(x, y, z, game);
        this.name = "Tower";
        this.id = 4;
    }
}

class Elephant extends Creature{

    constructor(x, y, z, game){
        super(x, y, z, game);
        this.name = "Elephant";
        this.width = 2;
        this.height = 2;
        this.zLevels = 3;
        this.id = 5;
    }

    move(diff){
        super.move(diff);
        let a = this.behaviorTree.next();
        return a.execute.bind(a);
    }

}


class Bird extends Creature{

    constructor(x, y, z, target, game){
        super(x, y, z, game);
        this.behaviorTreeBuilder = new btb.DirectMoveBuilder(this, target, this.Game); 
        this.behaviorTree = this.behaviorTreeBuilder.behaviorTree;
        this.name = "Bird";
        this.id = 6;
    }

    move(diff){
        super.move(diff);
        let a = this.behaviorTree.next();
        return a.execute.bind(a);
    }

}


class Cat extends Creature{

    constructor(x, y, z, game){
        super(x, y, z, game);
        this.behaviorTreeBuilder = new btb.MoveBoxBuilder(this, this.Game);
        this.behaviorTree = this.behaviorTreeBuilder.behaviorTree;
        this.name = "Cat";
        this.id = 7;
    }

    move(diff){

        super.move(diff);
        let a = this.behaviorTree.next();
        return a.execute.bind(a);
    }

}

class Dog extends Creature{

    constructor(x, y, z, game){
        super(x, y, z, game);
        this.behaviorTreeBuilder = new btb.MoveBoxPredicateBuilder(this, this.Game);
        this.behaviorTree = this.behaviorTreeBuilder.behaviorTree;
        this.name = "Dog";
        this.id = 8;
    }

    move(diff){
        super.move(diff);
        let a = this.behaviorTree.next();
        return a.execute.bind(a);
    }

}

class Robot extends Creature{

    constructor(x, y, z, game){
        super(x, y, z, game);
        this.behaviorTreeBuilder = new btb.MoveBoxPredicateInverseBuilder(this, this.Game);
        this.behaviorTree = this.behaviorTreeBuilder.behaviorTree;
        this.name = "Robot";
        this.id = 9;
    }

    move(diff){
        super.move(diff);
        let a = this.behaviorTree.next();
        return a.execute.bind(a);
    }

}

class Anger extends Creature{

    constructor(x, y, z, game){
        super(x, y, z, game);
        this.name = "Anger";
        this.id = 11;
    }

    move(diff){
        super.move(diff);
        let a = this.behaviorTree.next();
        return a.execute.bind(a);
    }

}


module.exports = {
    Creature: Creature,
    WaterCreature: WaterCreature,
    Dolphin: Dolphin,
    Turtle: Turtle,
    Tower: Tower, 
    Elephant: Elephant,
    Bird: Bird,
    Cat: Cat,
    Dog: Dog,
    Robot: Robot,
    Anger: Anger
}
