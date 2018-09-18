class Display {

    constructor(){
        this.canvases = [];
        this.squares = [];
        this.td = [];

        this.div = document.createElement("div");
        let scale = Math.min((window.innerWidth - 50) / 1855, (window.innerHeight- 50) / 965);
        this.expWidth = 1855*scale;
        this.expHeight = 965*scale;
        this.div.style.width = Math.floor(1855*scale) + "px";
        this.div.style.height = Math.floor(965*scale) + "px";
        this.div.style.position = "absolute";
        document.body.appendChild(this.div);

        let canvas = document.createElement("table");
        canvas.style.position = "absolute";
        canvas.style.top = "10.4%";
        canvas.style.left = "6.4%";
        canvas.style.backgroundColor = "black";
        canvas.style.opacity = "0";
        this.inventory = canvas;
        this.inventoryVisible = false;
        this.height = 15;
        this.width = 30;
        this.levels = 4;

        let messages = document.createElement("table");
        messages.style.position = "absolute";
        messages.style.top = "5.4%";
        messages.style.left = "5.4%";
        messages.style.backgroundColor = "black";
        messages.style.opacity = "0";
        this.messages = messages;
        this.messagesVisible = false;

        this.td = new Array(this.width);
        this.squares = new Array(this.width);
        for (let i = 0; i < this.width; i++){
            this.squares[i] = new Array(this.height);
            this.td[i] = new Array(this.height);
            for (let j = 0; j < this.squares[i].length; j++){
                this.squares[i][j] = new Array(this.levels);
                this.td[i][j] = new Array(this.levels);
            }
        }

        for(let i = 0; i < this.levels; i++){
            this.generateTables(i);
        }

        this.div.appendChild(this.inventory);
        this.div.appendChild(this.messages);
    }

    parseJSON(json){
        this.squares = JSON.parse(json);
        for(let i = 0; i < this.squares.length; i++){
            for(let j = 0; j < this.squares[i].length; j++){
                for(let k = 0; k < this.squares[j].length; k++){
                    Object.assign(new DisplayBlock, this.squares[i][j][k]);
                }
            }
        }
    }

    clearMessages(){
        this.messages.innerHTML = "";
    }
    hideMessages(){
        this.clearMessages();
        this.messages.style.opacity = "0";
        this.messagesVisible = false;
    }

    clearInventory(){
        this.inventory.innerHTML = "";
    }
    hideInventory(){
        this.clearInventory();
        this.inventory.style.opacity = "0";
        this.inventoryVisible = false;
    }
    showMessage(message){
        let tr = document.createElement("tr");
        let td1 = document.createElement("td");

        this.bWidth = this.view.blockWidthPx;
        this.bHeight = this.view.blockHeightPx; 

        td1.style.fontSize = this.expWidth * this.coeffW * 0.70 + "px";
        td1.style.font = this.expWidth * this.coeffW * 0.70  + "px monospace";
        td1.style.color = "white";
        td1.innerHTML = message;
        tr.append(td1);
        this.messages.append(tr);

        this.messages.style.opacity = "0.5";
        this.messagesVisible = true;
    }

    showInventory(items){
        let th = document.createElement("caption");
        th.style.fontSize = this.expWidth * this.coeffW * 0.70  + "px";
        th.style.font = this.expWidth * this.coeffW * 0.70  + "px monospace";
        th.style.color = "white";
        th.style.textAlign = "left";
        th.innerHTML = "Inventory";
        this.inventory.append(th);

        this.inventory.style.opacity = "0.5";
        this.inventoryVisible = true;
    }

    generateTables(level){
        let canvas = document.createElement("table"); 
        canvas.style.position = "absolute";
        canvas.style.bottom =  ((9.4) - level*1) + "%";
        canvas.style.left = ((5.4) - level*.65) + "%";

        this.canvases.push(canvas);

        this.coeffH = 0.025 + level*0.0007;
        this.coeffW = 0.025 + level*0.0004;

        let bC = this.getBC(level);
        let opacity = 0.1;

        if(level == 0){
            opacity = 1;
        }
        let tb = document.createElement("tbody");
        tb.style.display = "block";
        canvas.appendChild(tb);
        for(let i = 0; i < this.height; i++){
            let tr = document.createElement("tr");
            tb.appendChild(tr);
            for (let j = 0; j < this.width; j++){
                let td = document.createElement("td");
                this.squares[j][i][level] = new DisplayBlock(j, i, level); 
                this.td[j][i][level] = td;
                td.style.width = this.expWidth * this.coeffW + "px";
                td.style.height = this.expWidth * this.coeffH + "px";
                td.style.overflow = "visible";
                td.style.content = "center";
                td.style.fontSize = this.expWidth * this.coeffW * 0.70;
                td.align = "center";
                td.style.font = this.expWidth * 0.7 * this.coeffW + "px monospace";
                td.style.textAlign = "center";
                td.style.backgroundColor = bC;
                td.style.color = "white";
                td.style.opacity = opacity;
                tr.append(td);
                //td.addEventListener("mouseover", squareInfo(td, level));
            }
        }
        this.div.appendChild(canvas);
    }

    clearBody(){
        document.body.innerHTML = "";
    }

    redraw(){
        for(let i = 0; i < this.squares.length; i++){
            for(let j = 0; j < this.squares[i].length; j++){
                for(let z = 0; z < this.squares[i][j].length; z++){
                    //this.clearBlock(i, j, z);
                    //this.clear(i, j, z, Game.player);
                    //this.level.map[i + this.view.xOffset][j + this.view.yOffset][z].clear();
                    //this.setBlock(i, j, z, this.level.map[i + this.view.offsets[z].xOffset][j + this.view.offsets[z].yOffset][z]);

                    //this.setBlock(i, j, z, Game.map.getBlock(i + this.view.offsets[z].xOffset, j + this.view.offsets[z].yOffset, z);

                    //this.setBlock(i, j, z, this.getCorrespondingMapBlock(i, j, z));
                    this.draw(i, j, z);
                }
            }
        }
        //this.adjustLayerOpacity();
        twemoji.parse(document.body);
    }

    setBlock(x, y, level, block){
        this.squares[x][y][level].icon = block.icon;
        this.squares[x][y][level].color = block.iconColor;
        this.squares[x][y][level].style = block.getStyle.bind(block);
    }
    clearBlock(x, y, level){
        this.squares[x][y][level].icon = "";
        this.squares[x][y][level].color = "white";
    }

    get container() {
        return this.canvas;   
    };

    draw(x, y, level) {
        let s = this.squares[x][y][level];
        let td = this.td[x][y][level];
        //console.log(td);
        //console.log("x: " + x + "y: " + y + "z: " + level);
        td.innerHTML = s.icon; 
        td.style.color = s.color;
        //s.getStyle(s.td);
    };

    drawIcon(x, y, level, icon) {
        let s = this.squares[getKey(x, y, level)];
        s.td.innerHTML = icon; 
    };

    drawExp(x, y, icon, color) {
    };

    setLevelOpacity(level, op){
        for(let i = 0; i < this.width; i++){
            for(let j = 0; j < this.height; j++){
                if(this.squares[i][j][level].td.style.opacity == op){
                    return;    
                }
                this.squares[i][j][level].td.style.opacity = op;
                this.draw(i, j, level);
            }
        }
    };

    getBC(level){
        let bC;
        if(level.backgroundColor){
            return level.backgroundColor;
        }
        if(level % 3 == 0){
            bC = "#" + (540 + Math.ceil(level / 3) * 5);
        }
        else if(level % 3 == 1){
            bC = "#" + (560 + Math.ceil(level / 3) * 5);
        }
        else if(level % 3 == 2){
            bC = "#" + (600 + Math.ceil(level / 3) * 5);
        }
        return bC;

    }
}

class DisplayBlock{
    constructor(x, y, level){
        this.x = x;
        this.y = y;
        this.level = level;
        this.icon = "";
        this.color = "white";
    }
    /*set style(s){
      this.sty = s;
      }
      getStyle(e){
      this.sty(e);
      }*/

}
