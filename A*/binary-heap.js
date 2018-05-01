'use strict';

function Heap(...nodes) {
  this.root = null;
  this.last = null;
  this.countNodes = 0;
  for (let curNodes of nodes) {
    this.add(curNodes[0], curNodes[1]);
  }
}

function Node(priority, data) {
  this.priority = priority;
  this.data = data;
  this.parent = null;
  this.childLeft = null;
  this.childRight = null;
}

Heap.prototype.getByIndex = function(index) {
  if (index === 1) {
    return this.root;
  }
  let curNode = this.root;
  let curIndex = index;
  while (curIndex !== 2 && curIndex !== 3) {
    let lowerLine = Math.pow(2, parseInt(Math.log2(curIndex)));
    if (curIndex - lowerLine > lowerLine * 2 - 1 - curIndex) {
      curNode = curNode.childRight;
      curIndex = curIndex - lowerLine;
    } else {
      curNode = curNode.childLeft;
      curIndex = curIndex - lowerLine / 2;
    }
  }
  if (curIndex === 2) {
    return curNode.childLeft;
  }
  else if (curIndex === 3) {
    return curNode.childRight;
  }
  else {
    throw new Error('Error of reading tree');
  }
}

Heap.prototype.add = function(priority, data) {
  if (!(this.countNodes)) {
    this.root = new Node(priority, data);
    this.countNodes++;
    return;
  }
  let parentOfNew = this.getByIndex(Math.floor((this.countNodes + 1) / 2));
  parentOfNew[this.countNodes % 2 ? 'childLeft' : 'childRight'] = new Node(priority, data);
  this.countNodes++;
  let curNode = this.getByIndex(this.countNodes);
  curNode.parent = parentOfNew;
  while (curNode.parent && curNode.priority < curNode.parent.priority) {
    let parent = curNode.parent;
    let tempData = parent.data;
    let tempPriority = parent.priority;
    parent.data = curNode.data;
    parent.priority = curNode.priority;
    curNode.data = tempData;
    curNode.priority = tempPriority;
    curNode = curNode.parent;
  }
}

Heap.prototype.get = function() {
  if (!(this.root)) return null;
  if (this.countNodes === 1) {
    let max = this.root.data;
    this.root = null;
    this.countNodes--;
    return max;
  }
  let max = this.root.data;
  let last = this.getByIndex(this.countNodes);
  this.root.priority = last.priority;
  this.root.data = last.data;
  last.parent[this.countNodes % 2 ? 'childRight' : 'childLeft'] = null;
  let curNode = this.root;
  let curMaxChild = curNode.childLeft ? curNode.childRight ?
    curNode.childRight.priority > curNode.childLeft.priority ?
    curNode.childLeft : curNode.childRight : curNode.childLeft : null;
  while (curNode.childLeft && curMaxChild.priority < curNode.priority) {
    let tempData = curNode.data;
    let tempPriority = curNode.priority;
    curNode.data = curMaxChild.data;
    curNode.priority = curMaxChild.priority;
    curMaxChild.data = tempData;
    curMaxChild.priority = tempPriority;
    curNode = curMaxChild;
    curMaxChild = curNode.childLeft ? curNode.childRight ?
    curNode.childRight.priority > curNode.childLeft.priority ?
    curNode.childLeft : curNode.childRight : curNode.childLeft : null;
  }
  this.last = this.getByIndex(--this.countNodes)
  return max;
}

module.exports = Heap;
