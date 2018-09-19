"use strict";
//var Game = require("./game.js");
var engine = require("./engine.js");

class View {
    constructor(){
        this.width = 30;
        //this.width = 30;
        this.height = 15;
        this.widthPx = 1855;
        this.heightPx = 965;
        this.offsets = [];
    }
}

class Offset {

    constructor(){
        this.xOffset = 0;
        this.yOffset = 0;
    }
}

class Display {

    constructor(Game){
        this.view = new View();
        this.Game = Game;
        this.width = this.view.width;
        this.height = this.view.height;
        this.squares = [];
    }
/*
    generateTables(level){
        for(let i = 0; i < this.height; i++){
            for (let j = 0; j < this.width; j++){
                this.squares[j][i][level] = new DisplayBlock(j, i, level); 
            }
        }
    }
    */

    displayMap(map) {
        this.levels = map.levels;
        this.level = map;

        let minWidth = map.levels.reduce((min, p) => p.width < min ? p.width : min, map.levels[0].width); 
        let minHeight = map.levels.reduce((min, p) => p.height < min ? p.height : min, map.levels[0].height); 
        if(minWidth < this.view.width){
            this.width = minWidth;
        }
        if(minHeight < this.view.height){
            this.height = minHeight;
        }

        this.squares = new Array(this.width);
        for (let i = 0; i < this.width; i++){
            this.squares[i] = new Array(this.height);
            for (let j = 0; j < this.squares[i].length; j++){
                this.squares[i][j] = new Array(this.levels);
            }
        }

        for (let i = 0; i < this.levels.length; i++){
            this.view.offsets[i] = new Offset();
            //this.generateTables(i);
        }
        this.calculateBlocksAndItems();
    }

    calculateBlocksAndItems(){
        this.items = [];
        for(let i = 0; i < this.squares.length; i++){
            for(let j = 0; j < this.squares[i].length; j++){
                for(let z = 0; z < this.squares[i][j].length; z++){
                    let block = this.getCorrespondingMapBlock(i, j, z);
                    if(block.items.length > 0){
                        this.items.push({id: block.item.id, 
                            x: i - this.view.offsets[z].xOffset
                            , y: j - this.view.offsets[z].xOffset
                            , z: z});
                    }
                    block.calculateIconId();
                    this.setBlock(i, j, z, block);
                }
            }
        }

    }

    getCorrespondingMapBlock(x, y, z){
        return this.Game.map.getBlock(x + this.view.offsets[z].xOffset, y + this.view.offsets[z].yOffset, z);
    }

    setBlock(x, y, level, block){
        //this.squares[x][y][level].icon = block.icon;
        //this.squares[x][y][level].color = block.iconColor;
        //this.squares[x][y][level].style = block.getStyle.bind(block);
        this.squares[x][y][level] = block.iconId;
    }
    clearBlock(x, y, level){
        this.squares[x][y][level].icon = "";
        this.squares[x][y][level].color = "white";
    }

    getDisplayBlocks(){
        return JSON.stringify(this.squares);
    }

    getCreaturesJSON(creatures){
        //console.log(JSON.stringify(creatures, creatureReplacer));
        //console.log(creatureReplacer);
        return JSON.stringify(creatures, ['x', 'y', 'z', 'id']);
    }

    getPlayerJSON(player){
        /*return JSON.stringify(player, function(key, val){
            if(key === 'x'){
                return val - this.view.offsets[player.z].xOffset;
            }
            else if(key === 'y'){
                return val - this.view.offsets[player.z].yOffset;
            }
            else if(key === 'z' || key === 'id' || !key){
                return val;
            }
            else{
                return undefined;
            }

        }.bind(this));
        */
        return JSON.stringify(player, ['x', 'y', 'z']);
    }

    getOffsetsJSON(){
        return JSON.stringify(this.view.offsets);
    }

    getItemsJSON(){
        return JSON.stringify(this.items);
    }
}


class DisplayBlock{
    constructor(x, y, level, td){
        this.x = x;
        this.y = y;
        this.level = level;
        this.icon = "";
        this.color = "white";
    }
    sty(e) {

    }
    set style(s){
        this.sty = s;
    }
    getStyle(e){
        this.sty(e);
    }

}

module.exports = {
    DisplayBlock: DisplayBlock, 
    Display: Display,
    Offset: Offset,
    View: View
}
