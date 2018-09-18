"use strict";
//var Game = require("./game.js");
var btb = require("./behavior/behaviortreebuilder.js");

class Creature{

    constructor(x, y, level, icon, iconColor, Game){
        this.Game = Game;
        this.x = x;
        this.y = y;
        this.z = level;
        this.width = 1;
        this.height = 1;
        //this.zLevels = 1;
        this.items = {};
        this.icon = icon;
        this.iconColor = iconColor;
        this.scale = -1;
        this.hp = 5;
        this.name = "creature";
        this.defeated = false;
        this.availableSymbols = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
        this.behaviorTreeBuilder = new btb.RandomMoveBuilder(this, this.Game); 
        this.behaviorTree = this.behaviorTreeBuilder.behaviorTree;
    }

    get level(){
        return this.z;
    }

    getTopLeftStyle(e){
        e.style.transform = "scaleX(" + this.scale + ")";
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
            this.Game.map.getBlock(this.x,this.y,this.z).items.unshift(this.items[index]);

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
        //Game.level.map[this.x][this.y][this.z].removeCreature(this);

        /*for(let x = 0; x < this.width; x++){
            for(let y = 0; y < this.height; y++){
                for(let z = 0; z < this.zLevels; z++){
                    Game.map.getBlock(this.x,this.y,this.z).removeCreature(this);
                    Game.level.map[this.x + x][this.y + y][this.z + z].creatureSegment = false;
                }
            }
        }*/
        this.removeFromBlock();

        let itemKeys = Object.keys(this.items);
        for(let i = 0; i < itemKeys.length; i++){
            this.Game.map.getBlock(this.x,this.y,this.z).items.unshift(this.items[itemKeys[i]]);
        }
        this.items = {};
        //Game.level.map[this.x][this.y][this.z].
    }

    removeFromBlock(){
        for(let x = 0; x < this.width; x++){
            for(let y = 0; y < this.height; y++){
                //for(let z = 0; z < this.zLevels; z++){
                this.Game.map.getBlock(this.x + x,this.y + y,this.z).removeCreature(this);
                this.Game.map.getBlock(this.x + x,this.y + y,this.z).creatureSegment = false;
                //}
            }
        }
    }

    moveToBlock(newX, newY, newZ){
        this.x = newX;
        this.y = newY;
        this.z = newZ;
        this.Game.map.levels[newZ].setCreatureBlocks(this, this.x, this.y);
        /*for(let x = 0; x < this.width; x++){
          for(let y = 0; y < this.height; y++){
          for(let z = 0; z < this.zLevels; z++){

          let block = Game.map.getBlock(this.x + x, this.y + y, this.z);
          block.creature = this;
          if(x == 0 && y == 0 && this.scale == 1){
          block.creatureSegment = false;
          }
          else if(x == this.width - 1 && y == 0 && this.scale == -1){
          block.creatureSegment = false;
          }
          else{
          block.creatureSegment = true;
          }
          }
          }
          }*/
    }

    move(diff){
        if(this.defeated){
            return null;
        }
    }
    set actionBuilder(a){
        //set behaviorTreeBuilder
        this.behaviorTreeBuilder = a; 
        this.behaviorTree = this.behaviorTreeBuilder.behaviorTree;
    }
    getStyle(e){

    }
}

class WaterCreature extends Creature{}

class Dolphin extends WaterCreature{
    constructor(x, y, z, game){
        super(x, y, z, "&#x1F42C;", "blue", game);
        this.name = "Dolphin";
    }

    move(diff){
        super.move(diff);
        let a = this.behaviorTree.next();
        return a.execute.bind(a);
    }

}

class Turtle extends Creature{

    constructor(x, y, z, game){
        super(x, y, z, "&#x1F422;", "green", game);
        this.name = "Turtle";
    }

    move(diff){
        super.move(diff);
        let a = this.behaviorTree.next();
        return a.execute.bind(a);
    }

}

class Tower extends Creature{

    constructor(x,y,z, game){
        super(x, y, z, "", "grey", game);
        this.name = "Tower";
    }
    getStyle(e){
        super.getStyle(e);
        let image = document.createElement("img");
        image.src = "./resources/tower.png";
        image.style.height = "80%";
        e.appendChild(image);
    }
}

class Elephant extends Creature{

    constructor(x, y, z, game){
        super(x, y, z, "&#x1F418;", "grey", game);
        this.icon = "";
        this.name = "Elephant";
        this.width = 2;
        this.height = 2;
        this.zLevels = 3;
    }

    move(diff){
        super.move(diff);
        let a = this.behaviorTree.next();
        return a.execute.bind(a);
    }

    getStyle(e){
        super.getStyle(e);
        //if(Game.player.z >= this.z){
         //   e.style.opacity = "0.6";
        //}
    }

    getTopLeftStyle(e){
        super.getTopLeftStyle(e);
        let div = document.createElement("div");
        div.innerHTML = "&#x1F418;";
        //let height = Game.display.view.blockHeightPx;
        //let width = Game.display.view.blockWidthPx;

        let height = this.Game.display.expWidth * 0.025;
        let width = this.Game.display.expWidth * 0.025;
        //let size = Math.min(Math.floor(width * 0.8), Math.floor(height * 0.8)) * 2;
        let size = this.Game.display.expWidth * 0.8 * 0.025 * 2;
        div.style.height = height;
        div.style.maxWidth = width;
        div.style.fontSize = size;
        if(this.scale == -1){
            div.style.left = size / 2;
        }
        div.setAttribute("style","display:block;max-width:" + width + "px;height:" + height 
                + "px;font-size:" + size + "px");

        //centerImage(image);
        e.appendChild(div);

    }

}


class Bird extends Creature{

    constructor(x, y, z, target, game){
        super(x, y, z, "&#x1F426;", "blue", game);
        this.behaviorTreeBuilder = new btb.DirectMoveBuilder(this, target, this.Game); 
        this.behaviorTree = this.behaviorTreeBuilder.behaviorTree;
        this.name = "Bird";
    }

    move(diff){
        super.move(diff);
        let a = this.behaviorTree.next();
        return a.execute.bind(a);
    }

}


class Cat extends Creature{

    constructor(x, y, z, game){
        super(x, y, z, "&#x1F408;", "orange", game);
        //this.act = new MoveStraightAct(this, new Distance(1,0,0)); 
        this.behaviorTreeBuilder = new btb.MoveBoxBuilder(this, this.Game);
        this.behaviorTree = this.behaviorTreeBuilder.behaviorTree;
        this.name = "Cat";
    }

    move(diff){

        super.move(diff);
        let a = this.behaviorTree.next();
        return a.execute.bind(a);
    }

}

class Dog extends Creature{

    constructor(x, y, z, game){
        super(x, y, z, "&#x1F415;", "white", game);
        //this.act = new MoveStraightAct(this, new Distance(1,0,0)); 
        this.behaviorTreeBuilder = new btb.MoveBoxPredicateBuilder(this, this.Game);
        this.behaviorTree = this.behaviorTreeBuilder.behaviorTree;
        this.name = "Dog";
    }

    move(diff){
        super.move(diff);
        let a = this.behaviorTree.next();
        return a.execute.bind(a);
    }

}

class Robot extends Creature{

    constructor(x, y, z, game){
        super(x, y, z, "&#x1F916;", "grey", game);
        //this.act = new MoveStraightAct(this, new Distance(1,0,0)); 
        this.behaviorTreeBuilder = new btb.MoveBoxPredicateInverseBuilder(this, this.Game);
        this.behaviorTree = this.behaviorTreeBuilder.behaviorTree;
        this.name = "Robot";
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
    Robot: Robot
}
