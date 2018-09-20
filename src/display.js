"use strict";
//var Game = require("./game.js");
var engine = require("./engine.js");
var item = require("./item.js");

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
                this.squares[i][j] = new Array(this.levels.length);
            }
        }

        for (let i = 0; i < this.levels.length; i++){
            this.view.offsets[i] = new Offset();
            //this.generateTables(i);
        }
        this.calculateBlocksItemsCreatures();
    }
    getMessage(){
        return JSON.stringify(this.message);
    }

    showMessage(message){
        this.message = message;
    }
    clearMessages(){
        this.message = null;
    }

    calculateBlocksItemsCreatures(){
        this.items = [];
        this.creatures = [];
        for(let i = 0; i < this.squares.length; i++){
            for(let j = 0; j < this.squares[i].length; j++){
                for(let z = 0; z < this.squares[i][j].length; z++){
                    let block = this.getCorrespondingMapBlock(i, j, z);
                    if(block.items.length > 0){
                        this.items.push({id: block.item.id, 
                            x: i 
                            , y: j 
                            , z: z});
                    }
                    if(block.creature && !block.creatureSegment){
                        this.creatures.push({id: block.creature.id,
                            x:i,
                            y:j,
                            z:z,
                            s:block.creature.scale});
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
        this.calculateBlocksItemsCreatures();
        return JSON.stringify(this.squares);
    }

    getCreaturesJSON(){
        //console.log(JSON.stringify(creatures, creatureReplacer));
        //console.log(creatureReplacer);
        return JSON.stringify(this.creatures);
    }

    getItemsJSON(){
        return JSON.stringify(this.items);
    }
    
    appendCategoryToList(list, cat, name){
        if(Object.keys(cat).length > 0){
            list.push(name);
        }

        for(let i in cat){
            if(this.Game.player.isEquipped(cat[i])){
                list.push(i + " - " + cat[i].name + " (worn)");
            }
            else if(this.Game.player.isWielded(cat[i])){
                list.push(i + " - " + cat[i].name + " (weapon in hand)");
            }
            else{
                list.push(i + " - " + cat[i].name);
            }
        }

    }

    showInventory(){
        this.inventoryVisible = true;
    }
    hideInventory(){
        this.inventoryVisible = false;
    }

    getInventoryJSON(){
        let items = this.Game.player.items;
        let i = []; 

        let equipment = {};
        let food = {};
        let misc = {};
        let weapon = {};

        for(let i in items){
            if(items[i] instanceof item.Equipment){
                equipment[i] = items[i];
            }
            if(items[i] instanceof item.Food){
                food[i] = items[i];
            }
            if(items[i] instanceof item.MiscItem){
                misc[i] = items[i];
            }
            if(items[i] instanceof item.Weapon){
                weapon[i] = items[i];
            }
        }
        this.appendCategoryToList(i, weapon, "Weapon");
        this.appendCategoryToList(i, equipment, "Equipment");
        this.appendCategoryToList(i, food, "Food");
        this.appendCategoryToList(i, misc, "Misc");

        return JSON.stringify(i);
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
