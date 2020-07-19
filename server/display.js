"use strict";
var engine = require("./engine.js");
var item = require("./item.js");

class View {
    constructor(){
        this.width = 30;
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
        console.log("display map");
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
        }
        this.calculateItemsCreatures();
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

    inDisplayRange(x, y, z){
        if(z > this.levels.length){
            return false;
        }
        if(x - this.view.offsets[z].xOffset < 0 || x - this.view.offsets[z].xOffset > this.width - 1){
            return false;
        }
        if(y - this.view.offsets[z].yOffset < 0 || y - this.view.offsets[z].yOffset > this.height - 1){
            return false;
        }
        return true;
    }

    calculateItemsCreatures(){
        this.items = [];
        this.creatures = [];

        for(let z = 0; z < this.levels.length; z++){
            for(let key in this.levels[z].blocks){
                let block = this.levels[z].blocks[key];
                if(this.inDisplayRange(block.x, block.y, z)){
                    if(block.items.length > 0){
                        this.items.push({id: block.item.id, 
                            x: block.x
                                , y: block.y 
                                , z: z});
                    }
                    if(block.creature && !block.creatureSegment){
                        this.creatures.push({id: block.creature.id,
                            x:block.x,
                            y:block.y,
                            z:z,
                            s:block.creature.scale});
                        //console.log(block.creature);
                    }
                }
            }
        }
    }

    getCorrespondingMapBlock(x, y, z){
        return this.Game.map.getBlock(x + this.view.offsets[z].xOffset, y + this.view.offsets[z].yOffset, z);
    }

    setBlock(x, y, level, block){
        this.squares[x][y][level] = block.iconId;
    }

    getMapJSON(){
        let width = this.Game.map.width;
        let height = this.Game.map.height;
        let blocks = new Array(this.levels.length); 

        for(let z = 0; z < this.levels.length; z++){
            blocks[z] = new Array(this.levels[z].width);

            for(let x = 0; x < blocks[z].length; x++){
                blocks[z][x] = new Array(this.levels[z].height);

                for(let y = 0; y < blocks[z][x].length; y++){
                    let block = this.Game.map.getBlock(x, y, z);
                    if(block){
                        blocks[z][x][y] = block.id; 
                    }
                    else{
                        blocks[z][x][y] = 0; 
                    }
                }
            }
        }
        return JSON.stringify(blocks);
    }

    getOffsetsJSON(){
        return JSON.stringify(this.view.offsets);
    }

    getCreaturesJSON(){
        //console.log(JSON.stringify(creatures, creatureReplacer));
        //console.log(creatureReplacer);
        return JSON.stringify(this.creatures);
    }

    getPlayerJSON(){
        return JSON.stringify(this.Game.player, ['x', 'y', 'z']);
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
        let applyable = {};

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
            if(items[i] instanceof item.Applyable){
                applyable[i] = items[i];
            }
            if(items[i] instanceof item.Weapon){
                weapon[i] = items[i];
            }
        }
        this.appendCategoryToList(i, weapon, "Weapon");
        this.appendCategoryToList(i, equipment, "Equipment");
        this.appendCategoryToList(i, food, "Food");
        this.appendCategoryToList(i, misc, "Misc");
        this.appendCategoryToList(i, applyable, "Applyable");

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
