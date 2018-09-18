"use strict";
var distance = require("./distance.js");
function directPath(c1, c2){
    //c1 is mover 
    //c2 is target 
    let x = c2.x - c1.x;
    let y = c2.y - c1.y;
    if(x > 0){
        x = 1;
    }
    else if(x < 0){
        x = -1;
    }
    else{
        x = 0;
    }
    if(y > 0){
        y = 1;
    }
    else if(y < 0){
        y = -1;
    }
    else{
        y = 0;
    }
    if(c1.z != c2.z){
        return new distance.Distance(0, 0, 0);
    }

    return new distance.Distance(x, y, 0); 
}

module.exports = {
    directPath: directPath
}
