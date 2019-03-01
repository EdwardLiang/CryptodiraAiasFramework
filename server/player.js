"use strict";
var items = require("./item.js");
var distance = require("./distance.js");
var creature = require("./creature.js");
class Player extends creature.Creature{

    constructor(x, y, z, Game){
        super(x, y, z, Game);
        this.Game = Game;
        this.shirt = null;
        this.pants = null;
        this.shoes = null;
        this.shield = null;
        this.weapon = null;
        this.id = 10;
    }

    getStyle(e){
        e.style.opacity = "0.7";
    }

    wieldItem(item){
        return () => {
            this.weapon = item; 
            return ["You wield the: " + item.name];
        }
    }
    wieldIndex(index){
        return this.wieldItem(this.items[index]);
    }

    equipIndex(index){
        return this.equipItem(this.items[index]);
    }

    equippable(index){
        let item = this.items[index];
        if(item instanceof items.Equipment){
            return true; 
        }
        else{
            return false;
        }
    }
    applyable(index){
        let item = this.items[index];
        if(item instanceof items.Applyable){
            return true; 
        }
        else{
            return false;
        }
    }

    unwield(index){
        let item = this.getItem(index);
        if(item === this.weapon){
            this.weapon = null;
        }
        else{
            return false;
        }
    }

    unequip(index){
        let item = this.getItem(index);
        if(item instanceof items.Shirt){
            this.shirt = null;
        }
        else if(item instanceof items.Pants){
            this.pants = null;
        }
        else if(item instanceof items.Shoes){
            this.shoes = null;
        }
        else if(item instanceof items.Shield){
            this.shield = null;
        }

        else{
            return false;
        }

    }

    dropItem(index){
        this.unequip(index);
        this.unwield(index);
        return super.dropItem(index);
    }

    equipItem(item){
        return () => {
            if(item instanceof items.Shirt){
                this.shirt = item; 
            }
            else if(item instanceof items.Pants){
                this.pants = item;
            }
            else if(item instanceof items.Shoes){
                this.shoes = item;
            }
            else if(item instanceof items.Shield){
                this.shield = item;
            }
            else{
                return ["That item cannot be equipped"];
            }
            return ["You put on the: " + item.name];
        }
    }

    isEquipped(item){
        if(item === this.shirt || item === this.pants || item === this.shoes || item === this.shield){
            return true;
        }
        return false;
    }
    isWielded(item){
        if(item === this.weapon){
            return true;
        }
        return false;
    }
    isWieldedIndex(index){
        return this.isWielded(this.items[index]);
    }
    isEquippedIndex(index){
        return this.isEquipped(this.items[index]);
    }

    move(diff){
        return () => {
            let player = this;
            let map = this.Game.map;
            let display = this.Game.display;
            let newX = player.x + diff.x;
            let newY = player.y + diff.y;
            let newZ = player.z + diff.z;

            if(diff.x > 0){
                this.scale = -1;
            }
            else if(diff.x < 0){
                this.scale = 1;
            }

            let mon = map.checkAttackable(newX, newY, newZ);
            if(newZ != player.z) { }
            else if(mon){
                let messages = [];
                mon.decreaseHp(1);
                messages.push("You hit the " + mon.name); 
                if(mon.hp <= 0){
                    messages.push("The " + mon.name + " is defeated!");
                    mon.defeated = true;
                    mon.die();
                }
                return messages;
            }
            else if(!map.checkMovable(newX, newY, newZ, player)) {return;}

            let newZTemp = newZ;
            let newYTemp = newY;
            let newXTemp = newX;
            let tX = player.x;
            let tY = player.y;
            let tZ = player.z;

            map.getBlock(player.x, player.y, player.z).removeCreature(this);

            player.x = newX;
            player.y = newY;
            player.z = newZ;

            player.moveToBlock(player.x, player.y, player.z);

            let items = map.getBlock(player.x, player.y, player.z).items;
            let itemsSArray = [];
            if(items.length > 0){
                for(let i = 0; i < items.length; i++){
                    itemsSArray.push(items[i].name);
                }
                return ["You see here: " + itemsSArray.join(", ")];
            }

            //viewwindow setting
            display.view.offsets[player.z].xOffset = player.x - Math.floor(display.width / 2);
            var restWidth = (display.width) - (player.x - display.view.offsets[player.z].xOffset); 
            if(player.x + restWidth >= map.levels[player.z].width){
                display.view.offsets[player.z].xOffset = map.levels[player.z].width - display.width;
            }
            if(display.view.offsets[player.z].xOffset < 0){
                display.view.offsets[player.z].xOffset = 0;
            }


            display.view.offsets[player.z].yOffset = player.y - Math.floor(display.height / 2);
            var restHeight = (display.height) - (player.y - display.view.offsets[player.z].yOffset); 

            if(player.y + restHeight >= map.levels[player.z].height){
                display.view.offsets[player.z].yOffset = map.levels[player.z].height - display.height;
            }

            if(display.view.offsets[player.z].yOffset < 0){
                display.view.offsets[player.z].yOffset = 0;
            }
        }

    }
}
module.exports = {
    Player: Player
}
