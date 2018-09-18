"use strict";
//TODO: More thoroughly test this.
class BehaviorTree {

    constructor(r){
        //this.root = r || new RandomSelectionNode();
        let r2 = new RepeatDecorator();
        let n = new RandomSelectionNode();
        r2.addChild(n); 
        this.root = r || r2;
        this.stack = []; 
        this.stack.push(null);
        this.currNode = this.root;
        this.lastNode = null;
        this.lastSuccess = true;
        this.realTimeDelay = 4;
        this.countForDelay = 0;
        this.dummyRealTimeNode = new ExecuteBehaviorNode();
        this.lastNodeNullPredicateFailed = false;
    }

    handleInvertDecorator(){
        if(this.lastSuccess){
            this.lastSuccess = false;
        }
        else{
            this.lastSuccess = true;
        }
        this.lastNode = this.currNode;
        this.lastNode.success = this.lastSuccess;
        this.currNode = this.stack.pop();
    }

    handleSucceedDecorator(){
        this.lastSuccess = true;
        this.lastNode = this.currNode;
        this.lastNode.success = this.lastSuccess;
        this.currNode = this.stack.pop();
    }

    next(){
        if(Game.realTime && this.countForDelay != this.realTimeDelay){
            this.countForDelay++;
            return this.dummyRealTimeNode;
        }
        else if (Game.realTime && this.countForDelay == this.realTimeDelay){
            this.countForDelay = 0;
        }
        if(this.lastNode instanceof ExecuteBehaviorNode){
            var a = this.stack.pop();
            this.lastSuccess = a.success;
            this.currNode = this.stack.pop();
        }
        while(this.currNode instanceof BehaviorNodeWithChildren || this.currNode instanceof Decorator){
            if(this.lastNode){
                this.lastSuccess = this.lastNode.success;
            }
            else if(this.lastNodeNullPredicateFailed){
                this.lastSuccess = false;
                this.lastNodeNullPredicateFailed = false;
            }
            else{
                this.lastSuccess = true;
            }
            if(this.currNode instanceof Decorator){
                if(this.currNode instanceof InvertDecorator){
                    this.handleInvertDecorator();
                }

                if(this.currNode instanceof SucceedDecorator){
                    this.handleSucceedDecorator();
                }

                if(this.currNode instanceof RepeatUntilFailDecorator){
                    if(this.lastSuccess){
                        this.stack.push(this.currNode);
                        this.currNode = this.currNode.child;  
                        this.stack.push(this.currNode);
                        return this.goDownTree();
                    }
                    else{
                        //console.log("test");
                        this.lastNode = this.currNode;
                        this.currNode = this.stack.pop();
                        //console.log(this.lastNode);
                        //console.log(this.currNode);
                    }

                }

                if(this.currNode instanceof RepeatDecorator){
                    //return this.handleRepeatDecorator();

                    this.stack.push(this.currNode);
                    //this.lastNode = this.currNode;
                    this.currNode = this.currNode.child;
                    this.stack.push(this.currNode);
                    return this.goDownTree();

                }
            }
            else if(this.currNode instanceof SequenceBehaviorNode){
                if(this.lastSuccess == false || this.currNode.selectNode(this.lastNode) === null){
                    //go up the tree if finished
                    this.lastNode = this.currNode;
                    this.currNode = this.stack.pop();
                    if(this.currNode instanceof RandomSequenceNode){
                        this.currNode.reset = true;
                    }
                    //this.lastNode = null;
                }
                else{
                    //this.stack.push(this.currNode);
                    //this.currNode = this.currNode.selectNode(this.lastNode);
                    if(this.currNode){
                        this.stack.push(this.currNode);
                    }
                    return this.goDownTree();
                }
            }
            else if(this.currNode instanceof SelectionBehaviorNode){
                if(this.lastSuccess == true || this.currNode.selectNode(this.lastNode) === null){
                    //go up the tree if finished
                    this.currNode.success = true;
                    if(this.currNode.selectNode(this.lastNode) === null){
                        this.currNode.success = false;
                    }
                    this.lastNode = this.currNode;
                    this.currNode = this.stack.pop();
                }
                else{
                    //this.currNode = this.currNode.selectNode(this.lastNode);
                    if(this.currNode){
                        this.stack.push(this.currNode);
                    }
                    return this.goDownTree();
                }
            }
        }

    }

    goDownTree(){
        //console.log("going down tree");
        while(this.currNode instanceof BehaviorNodeWithChildren || this.currNode instanceof Decorator){
            //console.log(this.currNode);
            if(this.currNode instanceof BehaviorNodeWithChildren){
                if(this.currNode instanceof RandomSequenceNode || this.currNode instanceof RandomSelectionNode){
                    this.currNode.randomize();
                }
                this.currNode = this.currNode.selectNode(this.lastNode);      
                this.stack.push(this.currNode);
            }
            else{
                this.currNode = this.currNode.child;
                this.stack.push(this.currNode);
            }
        }
        if(this.currNode instanceof FinishNode || this.currNode instanceof CancelNode){
            //differentiate between the two? 
            this.stack = [];
            this.stack.push(null);
            this.stack.push(this.root);
            this.currNode = this.root;
            this.lastNode = null;
            return (new ExecuteBehaviorNode());
        }
        if(this.currNode instanceof PredicateNode){
            //runs next command immediately.
            this.currNode.evaluatePredicate();
            let x = this.currNode;
            //var lastSuccess = this.stack.pop().success;
            this.lastNode = this.stack.pop();
            this.currNode = this.stack.pop();
            if(this.currNode instanceof BehaviorNodeWithChildren && !x.success){
                //lastNode has to be set for decorators but not BehaviorNodesWithChildren
                this.lastNode = null;
                this.lastNodeNullPredicateFailed = true;
                //because null is also used in construction/reset, we need to differentiate
                //between this null and the other null.
            }
            return this.next();
        }

        if(!(this.currNode instanceof ExecuteBehaviorNode)){
            console.log(this.currNode);
            throw "Behavior selected is not executable!";
        }
        else{
            this.lastNode = this.currNode;
            return this.currNode;
        }
    }
}


class BehaviorNode {
    constructor(){
        this.success = false;
    }
}


class BehaviorNodeWithChildren extends BehaviorNode{

    constructor(){
        super();
        this.children = [];
    }
    addChild(c){
        this.children.push(c);
    } 
    selectNode(lastNode){
        if(!this.children.includes(lastNode)){
            return this.children[0];
        }
        if(this.children.length == 0){
            throw "Empty Behavior Node With Children!";
        }
        let indx = 0;
        let node = this.children[indx];
        while(node !== lastNode){
            indx++;
            node = this.children[indx]; 
        }
        if(indx + 1 >= this.children.length){
            this.success = true;
            return null;
        }
        else{
            return this.children[indx + 1];
        }
    }

}

class ExecuteBehaviorNode extends BehaviorNode{

    execute(){
    }
}

class SequenceBehaviorNode extends BehaviorNodeWithChildren{

}    

class SelectionBehaviorNode extends BehaviorNodeWithChildren{}

class RandomSequenceNode extends SequenceBehaviorNode{

    constructor(){
        this.reset = true;
    }

    randomize(){
        if(this.reset){
            this.children = shuffle(this.children); 
        }
    }
}

class RandomSelectionNode extends SelectionBehaviorNode{

    randomize(){
        this.children = shuffle(this.children); 
    }
}

class FailNode extends BehaviorNode{
}

class SucceedNode extends BehaviorNode{
    constructor(){
        super();
        this.success = true;
    }
}

class PredicateNode extends BehaviorNode{

    predicate(){
        return false;
    }

    evaluatePredicate(){
        if(this.predicate()){
            this.success = true;
        }
        else{
            this.success = false;
        }
    }
}



class FinishNode extends SucceedNode{}

class CancelNode extends FailNode{}

class Decorator extends BehaviorNode{

    addChild(node){
        this.child = node;
    }
}

class InvertDecorator extends Decorator{}

class SucceedDecorator extends Decorator{}

class RepeatDecorator extends Decorator{}

class RepeatUntilFailDecorator extends Decorator{
    constructor(){
        super();
        this.success = true;
    }
}

//class SetVariableBehavior extends BehaviorNode{}

//class GetVariableBehavior extends BehaviorNode{}

//class IsNullBehavior extends BehaviorNode{}

//class PushBehavior extends BehaviorNode{}

//class PopBehavior extends BehaviorNode{}

//class IsEmptyBehavior extends BehaviorNode{}
//

//https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
function shuffle(array){
    let counter = array.length;

    while(counter > 0){
        let index = Math.floor(Math.random() * counter);

        counter --;

        let temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}

module.exports = {
    BehaviorTree: BehaviorTree,
    BehaviorNode: BehaviorNode,
    BehaviorNodeWithChildren: BehaviorNodeWithChildren,
    ExecuteBehaviorNode: ExecuteBehaviorNode,
    SequenceBehaviorNode: SequenceBehaviorNode,
    SelectionBehaviorNode: SelectionBehaviorNode,
    RandomSequenceNode: RandomSequenceNode,
    RandomSelectionNode: RandomSelectionNode,
    FailNode: FailNode,
    SucceedNode: SucceedNode,
    PredicateNode: PredicateNode,
    FinishNode: FinishNode,
    CancelNode: CancelNode,
    Decorate: Decorator,
    InvertDecorator: InvertDecorator,
    SucceedDecorator: SucceedDecorator,
    RepeatDecorator: RepeatDecorator,
    RepeatUntilFailDecorator: RepeatUntilFailDecorator
}

