"use strict";
//var Game = require("./game.js");
//var level = require("./level.js");
class MapBlock{

    constructor(x, y){
        this.x = x;
        this.y = y;
        this.movable = true;
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

    clearItems(){
        this.items = [];
    }

    calculateIconId(){
         this.iconId = this.id;
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

    static getKey(x, y){
        return x + "," + y;
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
    }
}

class BookBlock extends StaircaseUpBlock{

    constructor(x, y, lvl, xTarget, yTarget){
        super(x, y);
        this.id = 2;
        this.lvl = lvl;
        this.xTarget = xTarget;
        this.yTarget = yTarget;
        this.lvl.setBlock(1, 1, new EvergreenBlock(1, 1));
        this.lvl.setBlock(2, 1, new StaircaseDownBlock(2, 1));

    }
}


class StaircaseDownBlock extends StaircaseBlock{
    constructor(x, y){
        super(x, y);
        this.id = 3;
    }
}

class WaterBlock extends MapBlock{
    constructor(x, y){
        super(x, y);
        this.id = 4;
    }
}

class GrassBlock extends MapBlock{
    constructor(x, y){
        super(x, y);
        this.id = 5;
    }
}

class IceBlock extends MapBlock{
    constructor(x, y){
        super(x, y);
        this.id = 6;
    }
}

class UnmovableBlock extends MapBlock{
    constructor(x, y){
        super(x, y);
        this.movable = false;
        this.id = 7;
    }
}

class SolidBlock extends UnmovableBlock{
    constructor(x, y){
        super(x, y);
        this.movable = false;
        this.id = 8;
    }
}

class WallBlock extends UnmovableBlock{
    constructor(x, y){
        super(x, y);
        this.id = 9;
    }

}
class EvergreenBlock extends MapBlock{
    constructor(x, y){
        super(x, y);
        this.id = 10;
    }
}

class DeciduousBlock extends MapBlock{
    constructor(x, y){
        super(x, y);
        this.id = 11;
    }
}

class FountainBlock extends MapBlock{
    constructor(x, y){
        super(x, y);
        this.id = 12;
    }

}

class StoneBlock extends UnmovableBlock{
    constructor(x, y){
        super(x, y);
        this.id = 13;
    }
}

class ThoughtBlock extends StaircaseUpBlock{
    constructor(x, y, lvl, xTarget, yTarget){
        super(x, y);
        this.lvl = lvl;
        this.id = 14;
        this.xTarget = xTarget;
        this.yTarget = yTarget;
    }
}

class VirtueBlock extends StaircaseUpBlock{
    constructor(x, y, lvl, xTarget, yTarget){
        super(x, y);
        this.lvl = lvl;
        this.id = 15;
        this.xTarget = xTarget;
        this.yTarget = yTarget;
    }
}

class RealityBlock extends StaircaseDownBlock{
    constructor(x, y, lvl, xTarget, yTarget){
        super(x, y);
        this.lvl = lvl;
        this.id = 16;
        this.xTarget = xTarget;
        this.yTarget = yTarget;
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
    MapBlock: MapBlock,
    ThoughtBlock: ThoughtBlock,
    VirtueBlock: VirtueBlock,
    RealityBlock: RealityBlock
}

