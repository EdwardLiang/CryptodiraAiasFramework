"use strict";
var bt = require("./behaviortree.js");
var b = require("./behavior.js");
var d = require("../distance.js");

class BehaviorTreeBuilder{
    addNodesAsChildren(node){
        node.addChild(this.behaviorTree.root);
    } 
}

class DirectMoveBuilder extends BehaviorTreeBuilder{

    constructor(creature, target, Game){
        super();
        let root = new bt.RepeatDecorator();
        let n = new bt.RandomSelectionNode();
        let mY2 = new b.DirectDirectionMoveBehavior(creature, target, Game);
        n.addChild(mY2);
        root.addChild(n); 
        this.behaviorTree = new bt.BehaviorTree(root);
    }
}

class RandomMoveBuilder extends BehaviorTreeBuilder{

    constructor(creature, Game){
        super();
        let root = new bt.RepeatDecorator();
        let n = new bt.RandomSelectionNode();
        let mX = new b.MoveBehavior(new d.Distance(1, 0, 0), creature, Game);
        let mX2 = new b.MoveBehavior(new d.Distance(-1, 0, 0), creature, Game);
        let mY = new b.MoveBehavior(new d.Distance(0, 1, 0), creature, Game);
        let mY2 = new b.MoveBehavior(new d.Distance(0, -1, 0), creature, Game);

        let mX3 = new b.MoveBehavior(new d.Distance(1, 1, 0), creature, Game);
        let mX4 = new b.MoveBehavior(new d.Distance(-1, -1, 0), creature, Game);
        let mY3 = new b.MoveBehavior(new d.Distance(1, -1, 0), creature, Game);
        let mY4 = new b.MoveBehavior(new d.Distance(-1, 1, 0), creature, Game);
        n.addChild(mX);
        n.addChild(mX2);
        n.addChild(mX3);
        n.addChild(mX4);
        n.addChild(mY);
        n.addChild(mY2);
        n.addChild(mY3);
        n.addChild(mY4);
        root.addChild(n); 
        this.behaviorTree = new bt.BehaviorTree(root);
    }
}



class RandomMoveUntilFailBuilder extends BehaviorTreeBuilder{

    constructor(creature, Game){
        super();
        let root = new bt.RepeatDecorator();
        let r2 = new bt.RepeatUntilFailDecorator();
        let n = new bt.RandomSelectionNode();
        let mX = new b.MoveBehavior(new d.Distance(1, 0, 0), creature, Game);
        let mX2 = new b.MoveBehavior(new d.Distance(-1, 0, 0), creature, Game);
        let mY = new b.MoveBehavior(new d.Distance(0, 1, 0), creature, Game);
        let mY2 = new b.MoveBehavior(new d.Distance(0, -1, 0), creature, Game);
        n.addChild(mX);
        n.addChild(mX2);
        n.addChild(mY);
        n.addChild(mY2);
        n.addChild(new bt.PredicateNode());
        r2.addChild(n); 
        root.addChild(r2);
        this.behaviorTree = new bt.BehaviorTree(root);
    }
}

class RandomMoveCancelBuilder extends BehaviorTreeBuilder{

    constructor(creature, Game){
        super();
        let root = new bt.RepeatDecorator();
        let r2 = new bt.RepeatUntilFailDecorator();
        let n = new bt.RandomSelectionNode();
        let mX = new b.MoveBehavior(new d.Distance(1, 0, 0), creature, Game);
        let mX2 = new b.MoveBehavior(new d.Distance(-1, 0, 0), creature, Game);
        let mY = new b.MoveBehavior(new d.Distance(0, 1, 0), creature, Game);
        let mY2 = new b.MoveBehavior(new d.Distance(0, -1, 0), creature, Game);
        n.addChild(mX);
        n.addChild(mX2);
        n.addChild(mY);
        n.addChild(mY2);
        n.addChild(new bt.CancelNode());
        r2.addChild(n); 
        root.addChild(r2);
        this.behaviorTree = new bt.BehaviorTree(root);
    }
}



class MoveStraightBuilder extends BehaviorTreeBuilder{

    constructor(creature, distance, Game){
        super();
        //let root = new RepeatDecorator();
        let n = new bt.SequenceBehaviorNode();
        let mX = new b.MoveBehavior(distance, creature, Game);
        let mX2 = new b.MoveBehavior(distance, creature, Game);
        let mY = new b.MoveBehavior(distance, creature, Game);
        let mY2 = new b.MoveBehavior(distance, creature, Game);
        n.addChild(mX);
        n.addChild(mX2);
        n.addChild(mY);
        n.addChild(mY2);
        //root.addChild(n); 
        this.behaviorTree = new bt.BehaviorTree(n);
    }
}

class MoveBoxBuilder extends BehaviorTreeBuilder{

    constructor(creature, Game){
        super();
        let root = new bt.RepeatDecorator();
        let n = new bt.SequenceBehaviorNode();

        let act1 = new MoveStraightBuilder(creature, new d.Distance(1,0,0), Game); 
        let act2 = new MoveStraightBuilder(creature, new d.Distance(0,1,0), Game); 
        let act3 = new MoveStraightBuilder(creature, new d.Distance(-1,0,0), Game); 
        let act4 = new MoveStraightBuilder(creature, new d.Distance(0,-1,0), Game); 
        act1.addNodesAsChildren(n);
        act2.addNodesAsChildren(n);
        act3.addNodesAsChildren(n);
        act4.addNodesAsChildren(n);
        root.addChild(n); 
        this.behaviorTree = new bt.BehaviorTree(root);
    }
}

class MoveBoxPredicateBuilder extends BehaviorTreeBuilder{

    constructor(creature, Game){
        super();
        let root = new bt.RepeatDecorator();
        let n = new bt.SequenceBehaviorNode();

        let act1 = new MoveStraightBuilder(creature, new d.Distance(1,0,0), Game); 
        let act2 = new MoveStraightBuilder(creature, new d.Distance(0,1,0), Game); 
        let act3 = new MoveStraightBuilder(creature, new d.Distance(-1,0,0), Game); 
        let act4 = new MoveStraightBuilder(creature, new d.Distance(0,-1,0), Game); 
        let p = new bt.PredicateNode();
        act1.addNodesAsChildren(n);
        act2.addNodesAsChildren(n);
        n.addChild(p);
        act3.addNodesAsChildren(n);
        act4.addNodesAsChildren(n);
        root.addChild(n); 
        this.behaviorTree = new bt.BehaviorTree(root);
    }
}

class MoveBoxPredicateInverseBuilder extends BehaviorTreeBuilder{

    constructor(creature, Game){
        super();
        let root = new bt.RepeatDecorator();
        let i = new bt.InvertDecorator();
        let n = new bt.SequenceBehaviorNode();

        let act1 = new MoveStraightBuilder(creature, new d.Distance(1,0,0), Game); 
        let act2 = new MoveStraightBuilder(creature, new d.Distance(0,1,0), Game); 
        let act3 = new MoveStraightBuilder(creature, new d.Distance(-1,0,0), Game); 
        let act4 = new MoveStraightBuilder(creature, new d.Distance(0,-1,0), Game); 
        let p = new bt.PredicateNode();
        act1.addNodesAsChildren(n);
        act2.addNodesAsChildren(n);
        i.addChild(p);
        n.addChild(i);
        act3.addNodesAsChildren(n);
        act4.addNodesAsChildren(n);
        root.addChild(n); 
        this.behaviorTree = new bt.BehaviorTree(root);
    }
}

class MoveBoxPredicateSucceedBuilder extends BehaviorTreeBuilder{

    constructor(creature, Game){
        super();
        let root = new bt.RepeatDecorator();
        let i = new bt.SucceedDecorator();
        let n = new bt.SequenceBehaviorNode();

        let act1 = new MoveStraightBuilder(creature, new d.Distance(1,0,0), Game); 
        let act2 = new MoveStraightBuilder(creature, new d.Distance(0,1,0), Game); 
        let act3 = new MoveStraightBuilder(creature, new d.Distance(-1,0,0), Game); 
        let act4 = new MoveStraightBuilder(creature, new d.Distance(0,-1,0), Game); 
        let p = new bt.PredicateNode();
        act1.addNodesAsChildren(n);
        act2.addNodesAsChildren(n);
        i.addChild(p);
        n.addChild(i);
        act3.addNodesAsChildren(n);
        act4.addNodesAsChildren(n);
        root.addChild(n); 
        this.behaviorTree = new bt.BehaviorTree(root);
    }
}

module.exports = {
    BehaviorTreeBuilder: BehaviorTreeBuilder,
    DirectMoveBuilder: DirectMoveBuilder,
    RandomMoveBuilder: RandomMoveBuilder,
    RandomMoveUntilFailBuilder: RandomMoveUntilFailBuilder,
    MoveBoxPredicateSucceedBuilder: MoveBoxPredicateSucceedBuilder,
    MoveBoxPredicateInverseBuilder: MoveBoxPredicateInverseBuilder,
    MoveBoxPredicateBuilder: MoveBoxPredicateBuilder,
    MoveBoxBuilder: MoveBoxBuilder,
    MoveStraightBuilder: MoveStraightBuilder,
    RandomMoveCancelBuilder: RandomMoveCancelBuilder 
}
