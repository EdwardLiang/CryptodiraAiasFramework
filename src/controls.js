"use strict";
var distance = require("./distance.js");
let DIRS = {};
DIRS[72] = new distance.Distance(-1, 0, 0); //left
DIRS[74] = new distance.Distance(0, 1, 0); //down
DIRS[75] = new distance.Distance(0, -1, 0); //up
DIRS[76] = new distance.Distance(1, 0, 0); //right
DIRS[89] = new distance.Distance(-1, -1, 0); //left up
DIRS[66] = new distance.Distance(-1, 1, 0); //left down 
DIRS[78] = new distance.Distance(1, 1, 0); //right down 
DIRS[85] = new distance.Distance(1, -1, 0); //right up
DIRS[188] = new distance.Distance(0, 0, 1);
DIRS[190] = new distance.Distance(0, 0, -1);


function itemSelectorWear(e){
    if(!PlayerEventListener.equipping){
        Game.display.clearMessages();
        Game.display.showMessage("What do you wish to wear? Type index or * to open inventory.");
        PlayerEventListener.equipping = true;
        return;
    }

    let code = e.keyCode;
    if(code == 16){
        //shift
        return;
    }
    if(code == 56 && e.shiftKey){ 
        if(Game.display.inventoryVisible){
            Game.display.hideInventory();
            Game.display.showInventory(Game.player.items);
        }
        else{
            Game.display.showInventory(Game.player.items);
        }
    }
    else{
        let index = String.fromCharCode(code);
        if(!e.shiftKey){
            index = index.toLowerCase();
        }

        let hasItem = Game.player.getItem(index);
        let equippable = Game.player.equippable(index);
        let isWielded = Game.player.isWieldedIndex(index);

        if(hasItem == null){
            //item not in inventory
            Game.display.clearMessages();
            Game.display.showMessage("You don't have that item.");
        }
        else if(!equippable){
            //item in inventory
            Game.display.clearMessages();
            Game.display.showMessage("You can't wear that item.");
        }
        else if(isWielded){
            Game.display.clearMessages();
            Game.display.showMessage("You are using that item as a weapon.");
        }
        else{
            Game.engine.addEvent(Game.player.equipIndex(index)); 
            Game.map.creaturesAct();
            Game.engine.timeStep();
        }
        PlayerEventListener.equipping = false;
        if(Game.display.inventoryVisible){
            Game.display.hideInventory();
        }
    }
}

function itemSelectorWield(e){
    if(!PlayerEventListener.wielding){
        Game.display.clearMessages();
        Game.display.showMessage("What do you wish to wield? Type index or * to open inventory.");
        PlayerEventListener.wielding = true;
        return;
    }

    let code = e.keyCode;
    if(code == 16){
        //shift
        return;
    }
    if(code == 56 && e.shiftKey){ 
        if(Game.display.inventoryVisible){
            Game.display.hideInventory();
            Game.display.showInventory(Game.player.items);
        }
        else{
            Game.display.showInventory(Game.player.items);
        }
    }
    else{
        let index = String.fromCharCode(code);
        if(!e.shiftKey){
            index = index.toLowerCase();
        }

        let hasItem = Game.player.getItem(index);
        let isEquipped = Game.player.isEquippedIndex(index);

        if(hasItem == null){
            //item not in inventory
            Game.display.clearMessages();
            Game.display.showMessage("You don't have that item.");
        }
        else if(isEquipped){
            //item in inventory
            Game.display.clearMessages();
            Game.display.showMessage("You are wearing that item.");
        }
        else{
            Game.engine.addEvent(Game.player.wieldIndex(index)); 
            Game.map.creaturesAct();
            Game.engine.timeStep();
        }
        PlayerEventListener.wielding = false;
        if(Game.display.inventoryVisible){
            Game.display.hideInventory();
        }
    }
}


function itemSelectorUnequip(e){
    if(!PlayerEventListener.unequipping){
        Game.display.clearMessages();
        Game.display.showMessage("What do you wish to take off? Type index or * to open inventory.");
        PlayerEventListener.unequipping = true;
        return;
    }

    let code = e.keyCode;
    if(code == 16){
        //shift
        return;
    }
    if(code == 56 && e.shiftKey){ 
        if(Game.display.inventoryVisible){
            Game.display.hideInventory();
            Game.display.showInventory(Game.player.items);
        }
        else{
            Game.display.showInventory(Game.player.items);
        }
    }
    else{
        let index = String.fromCharCode(code);
        if(!e.shiftKey){
            index = index.toLowerCase();
        }

        let hasItem = Game.player.getItem(index);
        let isEquipped = Game.player.isEquippedIndex(index);

        if(hasItem == null){
            //item not in inventory
            Game.display.clearMessages();
            Game.display.showMessage("You don't have that item.");
        }
        else if(!isEquipped){
            //item in inventory
            Game.display.clearMessages();
            Game.display.showMessage("That item is not equipped");
        }
        else{
            Game.engine.addEvent(Game.player.unequip(index)); 
            Game.map.creaturesAct();
            Game.engine.timeStep();
        }
        PlayerEventListener.unequipping = false;
        if(Game.display.inventoryVisible){
            Game.display.hideInventory();
        }
    }
}

function itemSelectorDrop(e){
    if(!PlayerEventListener.dropping){
        Game.display.clearMessages();
        Game.display.showMessage("What do you wish to drop? Type index or * to open inventory.");
        PlayerEventListener.dropping = true;
        return;
    }

    let code = e.keyCode;
    if(code == 16){
        //shift
        return;
    }
    if(code == 56 && e.shiftKey){ 
        if(Game.display.inventoryVisible){
            Game.display.hideInventory();
            Game.display.showInventory(Game.player.items);
        }
        else{
            Game.display.showInventory(Game.player.items);
        }
    }
    else{
        let index = String.fromCharCode(code);
        if(!e.shiftKey){
            index = index.toLowerCase();
        }

        let item = Game.player.dropItem(index);
        if(item != null){
            Game.engine.addEvent(dropItem(item)); 
            Game.map.creaturesAct();
            Game.engine.timeStep();
        }
        else{
            Game.display.clearMessages();
            Game.display.showMessage("You don't have that item.");
        }
        PlayerEventListener.dropping = false;
        if(Game.display.inventoryVisible){
            Game.display.hideInventory();
        }
    }
}

function dropItem(item){
    return () => {
        return ["You dropped the: " + item.name];
    }

}

function refreshInventory(){
    if(Game.display.inventoryVisible){
        Game.display.hideInventory();
        Game.display.showInventory(Game.player.items);
    }
}


let PlayerEventListener = {

    player: null,
    map: null,
    engine: null,
    display: null,
    dropping: false,
    equipping: false,
    unequipping: false,
    wielding: false,

    handleEvent(e){

        let pickUp = function(){
            let player = PlayerEventListener.player;
            let display = PlayerEventListener.display;
            let mapBlock = Game.map.getBlock(player.x, player.y, player.z);
            player.addItems(mapBlock.items);
            let items = mapBlock.items;
            let itemsSArray = [];
            if(items.length > 0){
                for(let i = 0; i < items.length; i++){
                    itemsSArray.push(items[i].name);
                }
                mapBlock.clearItems();

                refreshInventory();
                return ["You pick up: " + itemsSArray.join(", ")];
            }
            else{
                return ["There's nothing to pick up here"];
            }

        };

        let code = e.keyCode;


        if(code == 32 && this.engine.messageQ.length > 0){

            this.display.clearMessages();
            if(this.engine.messageQ.length > 1){
                var message = this.engine.messageQ.shift() + " --more--";
            }
            else{
                var message = this.engine.messageQ.shift();
            }
            this.display.showMessage(message);
            return;
        }
        else if(this.engine.messageQ.length > 0){
            return;
        }

        if(code == 32 && !(this.engine.messageQ.length > 0)){
            if(this.display.inventoryVisible){
                this.display.hideInventory();
            }
        }

        if(code == 87 && !e.shiftKey){
            //w (wield)
            itemSelectorWield(e);
            return;
        }
        else if(this.wielding){
            itemSelectorWield(e);
            return;
        }


        if(code == 84 && e.shiftKey){
            //T (take off)
            itemSelectorUnequip(e);
            return;
        }
        else if(this.unequipping){
            itemSelectorUnequip(e);
            return;
        }


        if(code == 87 && e.shiftKey){
            //W (wear)
            itemSelectorWear(e);
            return;
        }
        else if(this.equipping){
            itemSelectorWear(e);
            return;
        }

        if(code == 68 && !e.shiftKey){
            itemSelectorDrop(e);
            return;
        }
        else if(this.dropping){
            itemSelectorDrop(e);
            return;
        }

        if(code == 73 && !e.shiftKey){
            //show items(i)
            if(this.display.inventoryVisible){
                this.display.hideInventory();
            }
            else{
                this.display.showInventory(this.player.items);
            }
        }

        if(code == 188 && !e.shiftKey){
            //pickup (,)
            this.engine.addEvent(pickUp.bind(this));
            if(!Game.realTime){
                this.map.creaturesAct();
                this.engine.timeStep();
            }
            return;
        }
        if(code == 190 && !e.shiftKey){
            this.map.creaturesAct();
            this.engine.timeStep();
            return;
        }

        if(!(code in DIRS)){return;}

        let diff = DIRS[code];

        if(code == 190 && !e.shiftKey){
            return;
        }
        if(code == 188 && e.shiftKey){
            if(!this.map.canGoUp(this.player.x, this.player.y, this.player.z)){
                return;
            }
            let block = this.map.getBlock(this.player.x, this.player.y, this.player.z);
            if(block instanceof BookBlock){
                this.map.setLevel(block.lvl, 1);
                diff = new Distance(0, 0, 1);
            }
        }
        if(code == 190 && e.shiftKey){
            if(!this.map.canGoDown(this.player.x, this.player.y, this.player.z)){
                return;
            }
        }

        this.engine.addEvent(PlayerEventListener.player.move(diff));
        if(!this.realTime){
            this.map.creaturesAct();
            this.engine.timeStep();
        }
    }

}

module.exports = {
    PlayerEventListener: PlayerEventListener
}
