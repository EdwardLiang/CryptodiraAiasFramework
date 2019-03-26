"use strict";

var mapblock = require("./mapblock.js");
class Item {
    constructor(name){
        this.name = name;
        this.displayPrecedence = 3;
        this.id = 0;
        //3 bottom, 2, middle, 1 top
        //unimplemented
    }
}

class Applyable extends Item{
    constructor(name){
        super(name);
        this.id = 20; 
    }
    use(game){

    }
}
/*
class BlockMaker extends Applyable{
    constructor(name){
        super(name);
        this.id = 21; 
    }
}
*/

class BlockMaker extends Applyable{
    constructor(blockType){
        super("Block Maker");
        this.id = 22; 
        this.factory = new mapblock.BlockFactory(); 
        this.blockType = blockType;
    }
    use(game){
        //let block = new mapblock.WaterBlock(game.player.x, game.player.y);
        let blockType = this.blocktype;
        if(blockType == "NewThoughtBlock" || blockType == "NewRealityBlock" || blockType == "NewBookBlock" || blockType == "NewVirtueBlock"){
            var block = this.factory.createBlock(this.blockType, game.player.x, game.player.y, game.player.x, game.player.y, game.createLevel(50,30)); 
        }
        let level = 0;
        if(blockType == "ThoughtBlock"){
            level = 2;
        }
        else if(blockType == "RealityBlock"){
            level = 0;
        }
        else if(blockType == "BookBlock"){
            level = 1;
        }
        else if(blockType == "VirtueBlock"){
            level = 3;
        }
        else{
            var block = this.factory.createBlock(this.blockType, game.player.x, game.player.y, game.player.x, game.player.y, game.map.getLevel(level)); 
        }
        block.creature = game.player;
        game.getGameMap().setBlock(game.player.x, game.player.y, game.player.level, block);
    }
}

class MiscItem extends Item{
    constructor(name){
        super(name);
        this.id = 1;
    }
}

class Food extends Item{
    constructor(name){
        super(name);
        this.id = 2;
    }
}

class Orange extends Food{
    constructor(){
        super("orange");
        this.id = 3;
    }
}

class Peanut extends Food{
    constructor(){
        super("peanut");
        this.id = 4;
    }
}

class Battery extends MiscItem{
    constructor(){
        super("battery");
        this.id = 5;
    }
}

class Equipment extends Item{
    constructor(name){
        super(name);
        this.id = 6;
    }
}

class Shirt extends Equipment{
    constructor(name){
        super(name);
        this.id = 7;
    }
}

class BasicShirt extends Shirt{
    constructor(){
        super("basic shirt");
        this.id = 8;
    }
}

class Pants extends Equipment{
    constructor(name){
        super(name);
        this.id = 9;
    }
}

class BasicPants extends Pants{
    constructor(){
        super("basic pants");
        this.id = 10;
    }
}

class Shoes extends Equipment{
    constructor(name){
        super(name);
        this.id = 11;
    }
}

class RunningShoes extends Shoes{
    constructor(){
        super("running shoes");
        this.id = 12;
    }
}
class Shield extends Equipment{
    constructor(name){
        super(name);
        this.id = 13;
    }
}

class CryptodiraAias extends Shield{
    constructor(){
        super("Cryptodira Aias");
        this.id = 14;
    }
}

class Weapon extends Item{
    constructor(name){
        super(name);
        this.id = 15;
    }
}

class Pencil extends Weapon{
    constructor(){
        super("pencil");
        this.id = 16;
    }
}


class Ring extends Equipment{
    constructor(name){
        super(name);
        this.id = 17;
    }
}

class Book extends Item{
    constructor(name){
        super(name);
        this.id = 18;
    }
}

class Idea extends MiscItem{
    constructor(){
        super("Idea");
        this.id = 19;
    }
}


module.exports = {
    Book: Book,
    Ring: Ring,
    Pencil: Pencil,
    Weapon: Weapon,
    CryptodiraAias: CryptodiraAias,
    Shield: Shield,
    RunningShoes: RunningShoes,
    Shoes: Shoes,
    BasicPants: BasicPants,
    Pants: Pants,
    BasicShirt: BasicShirt,
    Shirt: Shirt,
    Equipment: Equipment,
    Battery: Battery,
    Peanut: Peanut,
    Orange: Orange,
    Food: Food,
    MiscItem: MiscItem,
    Applyable: Applyable,
    BlockMaker: BlockMaker,
//    WaterBlockMaker: WaterBlockMaker,
    Item: Item,
    Idea: Idea
}

