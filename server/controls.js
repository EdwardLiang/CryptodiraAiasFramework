"use strict";
var distance = require("./distance.js");
var mapblock = require("./mapblock.js");
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

class PlayerEventListener {

    constructor(Game){
        this.player = null;
        this.map = null;
        this.engine = null;
        this.display = null;
        this.dropping = false;
        this.equipping = false;
        this.unequipping = false;
        this.wielding = false;
        this.applying = false;
        this.Game = Game
    }

    itemSelectorApply(e){
        if(!this.applying){
            this.display.clearMessages();
            this.display.showMessage("What do you wish to apply? Type index or * to open inventory.");
            this.applying = true;
            return;
        }

        let code = e.keyCode;
        if(code == 16){
            //shift
            return;
        }
        if(code == 56 && e.shiftKey){ 
            if(this.display.inventoryVisible){
                this.display.hideInventory();
                this.display.showInventory(this.player.items);
            }
            else{
                this.display.showInventory(this.player.items);
            }
        }
        else{
            let index = String.fromCharCode(code);
            if(!e.shiftKey){
                index = index.toLowerCase();
            }

            let hasItem = this.player.getItem(index);
            let applyable = this.player.applyable(index);
            let isWielded = this.player.isWieldedIndex(index);
            let isEquipped = this.player.isEquippedIndex(index);

            if(hasItem == null){
                //item not in inventory
                this.display.clearMessages();
                this.display.showMessage("You don't have that item.");
            }
            else if(!applyable){
                //item in inventory
                this.display.clearMessages();
                this.display.showMessage("You can't apply that item.");
            }
            else if(isWielded){
                this.display.clearMessages();
                this.display.showMessage("You are using that item as a weapon.");
            }
            else if(isEquipped){
                this.display.clearMessages();
                this.display.showMessage("You are wearing that item.");
            }
            else{
                this.engine.addEvent(hasItem.use(this.Game)); 
                this.map.creaturesAct();
                this.engine.timeStep();
            }
            this.applying = false;
            if(this.display.inventoryVisible){
                this.display.hideInventory();
            }
        }
    }


    itemSelectorWear(e){
        if(!this.equipping){
            this.display.clearMessages();
            this.display.showMessage("What do you wish to wear? Type index or * to open inventory.");
            this.equipping = true;
            return;
        }

        let code = e.keyCode;
        if(code == 16){
            //shift
            return;
        }
        if(code == 56 && e.shiftKey){ 
            if(this.display.inventoryVisible){
                this.display.hideInventory();
                this.display.showInventory(this.player.items);
            }
            else{
                this.display.showInventory(this.player.items);
            }
        }
        else{
            let index = String.fromCharCode(code);
            if(!e.shiftKey){
                index = index.toLowerCase();
            }

            let hasItem = this.player.getItem(index);
            let equippable = this.player.equippable(index);
            let isWielded = this.player.isWieldedIndex(index);

            if(hasItem == null){
                //item not in inventory
                this.display.clearMessages();
                this.display.showMessage("You don't have that item.");
            }
            else if(!equippable){
                //item in inventory
                this.display.clearMessages();
                this.display.showMessage("You can't wear that item.");
            }
            else if(isWielded){
                this.display.clearMessages();
                this.display.showMessage("You are using that item as a weapon.");
            }
            else{
                this.engine.addEvent(this.player.equipIndex(index)); 
                this.map.creaturesAct();
                this.engine.timeStep();
            }
            this.equipping = false;
            if(this.display.inventoryVisible){
                this.display.hideInventory();
            }
        }
    }

    itemSelectorWield(e){
        if(!this.wielding){
            this.display.clearMessages();
            this.display.showMessage("What do you wish to wield? Type index or * to open inventory.");
            this.wielding = true;
            return;
        }

        let code = e.keyCode;
        if(code == 16){
            //shift
            return;
        }
        if(code == 56 && e.shiftKey){ 
            if(this.display.inventoryVisible){
                this.display.hideInventory();
                this.display.showInventory(this.player.items);
            }
            else{
                this.display.showInventory(this.player.items);
            }
        }
        else{
            let index = String.fromCharCode(code);
            if(!e.shiftKey){
                index = index.toLowerCase();
            }

            let hasItem = this.player.getItem(index);
            let isEquipped = this.player.isEquippedIndex(index);

            if(hasItem == null){
                //item not in inventory
                this.display.clearMessages();
                this.display.showMessage("You don't have that item.");
            }
            else if(isEquipped){
                //item in inventory
                this.display.clearMessages();
                this.display.showMessage("You are wearing that item.");
            }
            else{
                this.engine.addEvent(this.player.wieldIndex(index)); 
                this.map.creaturesAct();
                this.engine.timeStep();
            }
            this.wielding = false;
            if(this.display.inventoryVisible){
                this.display.hideInventory();
            }
        }
    }

    itemSelectorUnequip(e){
        if(!this.unequipping){
            this.display.clearMessages();
            this.display.showMessage("What do you wish to take off? Type index or * to open inventory.");
            this.unequipping = true;
            return;
        }

        let code = e.keyCode;
        if(code == 16){
            //shift
            return;
        }
        if(code == 56 && e.shiftKey){ 
            if(this.display.inventoryVisible){
                this.display.hideInventory();
                this.display.showInventory(this.player.items);
            }
            else{
                this.display.showInventory(this.player.items);
            }
        }
        else{
            let index = String.fromCharCode(code);
            if(!e.shiftKey){
                index = index.toLowerCase();
            }

            let hasItem = this.player.getItem(index);
            let isEquipped = this.player.isEquippedIndex(index);

            if(hasItem == null){
                //item not in inventory
                this.display.showMessage("You don't have that item.");
            }
            else if(!isEquipped){
                //item in inventory
                this.display.showMessage("That item is not equipped");
            }
            else{
                this.engine.addEvent(this.player.unequip(index)); 
                this.map.creaturesAct();
                this.engine.timeStep();
            }
            this.unequipping = false;
            if(this.display.inventoryVisible){
                this.display.hideInventory();
            }
        }
    }


    itemSelectorDrop(e){
        if(!this.dropping){
            this.display.clearMessages();
            this.display.showMessage("What do you wish to drop? Type index or * to open inventory.");
            this.dropping = true;
            return;
        }

        let code = e.keyCode;
        if(code == 16){
            //shift
            return;
        }
        if(code == 56 && e.shiftKey){ 
            if(this.display.inventoryVisible){
                this.display.hideInventory();
                this.display.showInventory(this.player.items);
            }
            else{
                this.display.showInventory(this.player.items);
            }
        }
        else{
            let index = String.fromCharCode(code);
            if(!e.shiftKey){
                index = index.toLowerCase();
            }

            let item = this.player.dropItem(index);
            if(item != null){
                this.engine.addEvent(this.dropItem(item)); 
                this.map.creaturesAct();
                this.engine.timeStep();
            }
            else{
                this.display.clearMessages();
                this.display.showMessage("You don't have that item.");
            }
            this.dropping = false;
            if(this.display.inventoryVisible){
                this.display.hideInventory();
            }
        }
    }



    dropItem(item){
        return () => {
            return ["You dropped the: " + item.name];
        }

    }

    pickUp(){
        return () => {
            let player = this.player;
            let display = this.display;
            let mapBlock = this.map.getBlock(player.x, player.y, player.z);
            player.addItems(mapBlock.items);
            let items = mapBlock.items;
            let itemsSArray = [];
            if(items.length > 0){
                for(let i = 0; i < items.length; i++){
                    itemsSArray.push(items[i].name);
                }
                mapBlock.clearItems();

                return ["You pick up: " + itemsSArray.join(", ")];
            }
            else{
                return ["There's nothing to pick up here"];
            }
        }

    }

    handleEvent(e){

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

        if(code == 65 && !e.shiftKey){
            //a (apply)
            this.itemSelectorApply(e);
            return;
        }
        else if(this.applying){
            this.itemSelectorApply(e);
            return;
        }


        if(code == 87 && !e.shiftKey){
            //w (wield)
            this.itemSelectorWield(e);
            return;
        }
        else if(this.wielding){
            this.itemSelectorWield(e);
            return;
        }


        if(code == 84 && e.shiftKey){
            //T (take off)
            this.itemSelectorUnequip(e);
            return;
        }
        else if(this.unequipping){
            this.itemSelectorUnequip(e);
            return;
        }


        if(code == 87 && e.shiftKey){
            //W (wear)
            this.itemSelectorWear(e);
            return;
        }
        else if(this.equipping){
            this.itemSelectorWear(e);
            return;
        }

        if(code == 68 && !e.shiftKey){
            this.itemSelectorDrop(e);
            return;
        }
        else if(this.dropping){
            this.itemSelectorDrop(e);
            return;
        }

        if(code == 73 && !e.shiftKey){
            //show items(i)
            if(this.display.inventoryVisible){
                this.display.hideInventory();
            }
            else{
                this.display.showInventory();
            }
        }

        if(code == 188 && !e.shiftKey){
            //pickup (,)
            this.engine.addEvent(this.pickUp().bind(this));
            //if(!this.Game.realTime){
            this.map.creaturesAct();
            this.engine.timeStep();
            //}
            return;
        }
        if(code == 190 && !e.shiftKey){
            this.map.creaturesAct();
            this.engine.timeStep();
            return;
        }
        if(code == 80){
            //p
            this.Game.save = true;
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
            if(block instanceof mapblock.BookBlock){
                this.map.setLevel(block.lvl, 1);
                diff = new distance.Distance(block.xTarget - this.player.x, 
                        block.yTarget - this.player.y, 1 - this.player.z);
                this.map.levelChanged = true;
            }
            if(block instanceof mapblock.ThoughtBlock){
                this.map.setLevel(block.lvl, 2);
                diff = new distance.Distance(block.xTarget - this.player.x
                        , block.yTarget - this.player.y, 2 - this.player.z);
                this.map.levelChanged = true;
            }
            if(block instanceof mapblock.VirtueBlock){
                this.map.setLevel(block.lvl, 3);
                diff = new distance.Distance(block.xTarget - this.player.x
                        , block.yTarget - this.player.y, 3 - this.player.z);
                this.map.levelChanged = true;
            }


        }
        if(code == 190 && e.shiftKey){
            if(!this.map.canGoDown(this.player.x, this.player.y, this.player.z)){
                return;
            }
            let block = this.map.getBlock(this.player.x, this.player.y, this.player.z);
            if(block instanceof mapblock.RealityBlock){
                this.map.setLevel(block.lvl, 0);
                diff = new distance.Distance(block.xTarget - this.player.x, 
                        block.yTarget - this.player.y, 0 - this.player.z);
                this.map.levelChanged = true;
            }

        }
        
        this.engine.addEvent(this.player.move(diff));
        if(!this.realTime){
            this.map.creaturesAct();
            this.engine.timeStep();
        }
    }

}

module.exports = {
    PlayerEventListener: PlayerEventListener
}
