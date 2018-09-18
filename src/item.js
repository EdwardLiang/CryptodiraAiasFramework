"use strict";
class Item {
    constructor(icon, iconColor, name){
        this.icon = icon;
        this.iconColor = iconColor;
        this.name = name;
        this.displayPrecedence = 3;
        //3 bottom, 2, middle, 1 top
        //unimplemented
    }
}

class MiscItem extends Item{
    constructor(icon, iconColor, name){
        super(icon, iconColor, name);
    }
}

class Food extends Item{
    constructor(icon, iconColor, name){
        super(icon, iconColor, name);
    }
}

class Orange extends Food{
    constructor(){
        super("&#x1F34A;", "orange", "orange");
    }
}

class Peanut extends Food{
    constructor(){
        super("&#x1F95C;", "brown", "peanut");
    }
}

class Battery extends MiscItem{
    constructor(){
        super("&#x1F50B;", "green", "battery");
    }
}

class Equipment extends Item{
    constructor(icon, iconColor, name){
        super(icon, iconColor, name);
    }
}

class Shirt extends Equipment{
    constructor(icon, iconColor, name){
        super(icon, iconColor, name);
    }
}

class BasicShirt extends Shirt{
    constructor(){
        super("&#x1F455", "blue", "basic shirt");
    }
}

class Pants extends Equipment{
    constructor(icon, iconColor, name){
        super(icon, iconColor, name);
    }
}

class BasicPants extends Pants{
    constructor(){
        super("&#x1F456", "blue", "basic pants");
    }
}

class Shoes extends Equipment{
    constructor(icon, iconColor, name){
        super(icon, iconColor, name);
    }
}

class RunningShoes extends Shoes{
    constructor(){
        super("&#x1F45F", "blue", "running shoes");
    }
}
class Shield extends Equipment{
    constructor(icon, iconColor, name){
        super(icon, iconColor, name);
    }
}

class CryptodiraAias extends Shield{
    constructor(){
        super("&#x1F6E1", "blue", "Cryptodira Aias");
    }
}

class Weapon extends Item{
    constructor(icon, iconColor, name){
        super(icon, iconColor, name);
    }
}

class Pencil extends Weapon{
    constructor(){
        super("&#x270F", "blue", "pencil");
    }
}


class Ring extends Equipment{
    constructor(icon, iconColor, name){
        super(icon, iconColor, name);
    }
}

class Book extends Item{
    constructor(icon, iconColor, name){
        super(icon, iconColor, name);
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
    Item: Item
}

