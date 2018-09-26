"use strict";
class Item {
    constructor(name){
        this.name = name;
        this.displayPrecedence = 3;
        this.id = 0;
        //3 bottom, 2, middle, 1 top
        //unimplemented
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
    Item: Item,
    Idea: Idea
}

