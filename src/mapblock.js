"use strict";
//var Game = require("./game.js");
//var level = require("./level.js");
class MapBlock{

    constructor(x, y){
        this.x = x;
        this.y = y;
        this.movable = true;
        this.icon = "";
        this.originalIcon = "";
        this.iconColor = "white";
        this.items = [];
        //this.resident = null;
        this.creatures = [];
        this.player = false;
        this.noImg = false;
        this.creatureSegment = false;
        this.id = 0;
        this.iconId = 0;
    }

    get item(){
        return this.items[0];
    }

    checkMovable(c) {
        if(this.creatures[0] === c){
            return true; 
        }
        else{
            return this.movable;
        }
    }

    checkAttackable(){
        //temp. Probably defer to creature again to check later.
        if(this.creatures.length > 0){
            return this.creatures[0];
        }
    }

    clear() {
        this.icon = "";
        this.iconColor = "white";
        this.calculateIcon();
    }

    clearItems(){
        this.items = [];
    }

    calculateIcon(){
        if(this.creatures.length > 0 && !this.creatureSegment){
            this.icon = this.creatures[0].icon;
            this.iconColor = this.creatures[0].iconColor;
            this.noImg = true;
        }
        else if(this.items.length > 0){
            this.icon = this.items[0].icon;
            this.iconColor = this.items[0].iconColor;
            this.noImg = true;
        }
        else{
            this.icon = this.originalIcon;
            this.noImg = false;
        }
    }
    calculateIconId(){
        /*if(this.creatures.length > 0 && !this.creatureSegment){
            this.iconId = this.creatures[0].id;
        }
        else if(this.items.length > 0){
            this.iconId = this.items[0].id;
        }
        else{*/
        this.iconId = this.id;
        //}
    }
    set creature(c){
        if(c != null){
            this.creatures.unshift(c);
            this.movable = false;
        }
        else if(this.creatures.length == 0){
            this.movable = true;
        }
    } 
    removeCreature(c){
        this.creatures = this.creatures.filter(e => e !== c);
        if(this.creatures.length == 0){
            this.movable = true;
        }
    }
    get creature(){
        return this.creatures[0];
    }

    setIcon(icon, color){
        this.icon = icon;
        this.iconColor = color;
    }

    getStyle(e){
        if(this.creatures.length > 0){
            if(!this.creatureSegment){
                this.creatures[0].getTopLeftStyle(e);
            }
            this.creatures[0].getStyle(e);
        }
        //if(this.creatures[0] === Game.player){
        //   e.style.opacity = "0.7";
        //}
    }
}

class StaircaseBlock extends MapBlock{
    constructor(x, y){
        super(x, y);
    }
}

class StaircaseUpBlock extends StaircaseBlock{
    constructor(x, y){
        super(x, y);
        this.id = 1;
        //this.icon = "<";
    }

    /*calculateIcon(){
      this.icon = "<";
      this.iconColor = "white";
      super.calculateIcon();
      }*/
    getStyle(e){
        super.getStyle(e);
        if(!this.noImg){
            let image = document.createElement("img");
            image.style.width = "60%";
            image.src = "./resources/aiga-stairs.png";

            //centerImage(image);
            e.appendChild(image);
        }
    }

}

class BookBlock extends StaircaseUpBlock{

    constructor(x, y){
        super(x, y);
        this.icon = "&#x1F4D6;";
        this.originalIcon = "&#x1F4D6;";
        this.iconColor = "blue";
        this.id = 2;
        //this.lvl = new level.Level(50, 30);
        //this.lvl.setBlock(1, 1, new EvergreenBlock(1, 1));
        //this.lvl.setBlock(2, 1, new StaircaseDownBlock(7, 3));

    }
    getStyle(e){
        //super writes staircaseup image. super.super doesn't work,
        //so this method is copied from MapBlock
        if(this.creatures.length > 0){
            if(!this.creatureSegment){
                this.creatures[0].getTopLeftStyle(e);
            }
            this.creatures[0].getStyle(e);
        }
        // if(this.creatures[0] === Game.player){
        //    e.style.opacity = "0.7";
        //}

    }
}


class StaircaseDownBlock extends StaircaseBlock{
    constructor(x, y){
        super(x, y);
        this.id = 3;
        //this.icon = ">";
    }

    /*calculateIcon(){
      this.icon = ">";
      this.iconColor = "white";
      super.calculateIcon();
      }*/
    getStyle(e){
        super.getStyle(e);
        if(!this.noImg){
            let image = document.createElement("img");
            image.style.width = "60%";
            image.src = "./resources/aiga-stairs.png";
            image.style.transform = "scaleX(-1)";
            //centerImage(image);

            e.appendChild(image);
        }
    }


}

class WaterBlock extends MapBlock{
    constructor(x, y){
        super(x, y);
        this.icon = " ";
        this.iconColor = "black";
        this.id = 4;
    }
    getStyle(e){
        super.getStyle(e);
        e.style.backgroundColor = "blue";
        if(!this.noImg){
            let image = document.createElement("img");
            image.style.width = "80%";
            image.src = "./resources/water-black.png";

            //centerImage(image);
            e.appendChild(image);
        }

    }

}

class GrassBlock extends MapBlock{
    constructor(x, y){
        super(x, y);
        this.icon = " ";
        this.iconColor = "black";
        this.id = 5;
    }
    getStyle(e){
        super.getStyle(e);
        e.style.backgroundColor = "green";
        if(!this.noImg){
            let image = document.createElement("img");
            image.style.width = "80%";
            image.src = "./resources/grass.png";
            e.appendChild(image);
        }
    }
}

class IceBlock extends MapBlock{
    constructor(x, y){
        super(x, y);
        this.icon = " ";
        this.iconColor = "black";
        this.id = 6;
    }
    getStyle(e){
        super.getStyle(e);
        e.style.backgroundColor = "white";
    }
}

class UnmovableBlock extends MapBlock{
    constructor(x, y){
        super(x, y);
        this.movable = false;
        this.icon = " ";
        this.iconColor = "black";
        this.id = 7;
    }
}

class SolidBlock extends UnmovableBlock{
    constructor(x, y){
        super(x, y);
        this.movable = false;
        this.icon = " ";
        this.iconColor = "black";
        this.id = 8;
    }
    getStyle(e){
        e.style.opacity = "0.0";
    }
}

class WallBlock extends UnmovableBlock{
    constructor(x, y){
        super(x, y);
        this.icon = "&#128857;";
        this.iconColor = "AA3311";
        this.id = 9;
    }
    getStyle(e){

    }
    calculateIcon(){
        this.icon = "&#128857;";
        this.iconColor = "#AA3311";
        super.calculateIcon();
    }

}
class EvergreenBlock extends MapBlock{
    constructor(x, y){
        super(x, y);
        this.icon = "&#x1F332;";
        this.originalIcon = "&#x1F332;";
        this.iconColor = "green";
        this.id = 10;
    }
    calculateIcon(){
        this.icon = "&#x1F332;";
        this.iconColor = "green";
        super.calculateIcon();
    }
    getStyle(e){
        super.getStyle(e);
        e.style.backgroundColor = "green";
    }
}

class DeciduousBlock extends MapBlock{
    constructor(x, y){
        super(x, y);
        this.icon = "&#x1F333;";
        this.originalIcon = "&#x1F333;";
        this.iconColor = "green";
        this.id = 11;
    }
    calculateIcon(){
        this.icon = "&#x1F333;";
        this.iconColor = "green";
        super.calculateIcon();
    }
    getStyle(e){
        super.getStyle(e);
        e.style.backgroundColor = "green";
    }
}

class FountainBlock extends MapBlock{
    constructor(x, y){
        super(x, y);
        this.icon = "&#x26F2;";
        this.originalIcon = "&#x26F2;";
        this.iconColor = "blue";
        this.id = 12;
    }
    calculateIcon(){
        this.icon = "&#x26F2;";
        this.iconColor = "blue";
        super.calculateIcon();
    }
}

class StoneBlock extends UnmovableBlock{
    constructor(x, y){
        super(x, y);
        this.icon = " ";
        this.iconColor = "black";
        this.id = 13;
    }
    getStyle(e){
        super.getStyle();
        e.style.backgroundColor = "#585858";
        let image = document.createElement("img");
        image.style.width = "100%";
        image.src = "./resources/rock2.png";
        e.appendChild(image);
    }
}

module.exports = {
    StoneBlock: StoneBlock,
    FountainBlock: FountainBlock,
    DeciduousBlock: DeciduousBlock,
    EvergreenBlock: EvergreenBlock,
    WallBlock: WallBlock,
    SolidBlock: SolidBlock,
    UnmovableBlock: UnmovableBlock,
    IceBlock: IceBlock,
    GrassBlock: GrassBlock,
    StaircaseDownBlock: StaircaseDownBlock,
    StaircaseUpBlock: StaircaseUpBlock,
    StaircaseBlock: StaircaseBlock,
    WaterBlock: WaterBlock,
    BookBlock: BookBlock,
    MapBlock: MapBlock
}

