// MessageList definition class

function Node(message,next){
    this.next = next;
    this.message = message;    
}
Node.prototype.setNext = function(next){
    this.next = next;
}
Node.prototype.toString = function(){
    return this.message;
}

function MessageList(){
    this.head = undefined;
    this.tail = undefined;
    this.current =  undefined;
    this.size = 0;
}
MessageList.prototype.addNode = function(message){
    node = new Node(message);
    if(typeof this.head === "undefined"){
        this.head = node;
    }
    if(typeof this.tail !== "undefined"){
        this.tail.setNext(node)
    }
    this.tail = node;
    this.size++;
    return node;
}
MessageList.prototype.getNodes = function(){
    return this.head;
}
MessageList.prototype.pop = function(){
    if(typeof this.head !== "undefined"){
        if(typeof this.head.next !== "undefined"){
            toDelete = this.head;
            this.head = this.head.next;
            if(this.size > 0){
                this.size--;
            }
            delete toDelete;
        }else{
            this.head =  undefined;
            this.tail = undefined;
            this.size = 0;
        }
    }    
}
MessageList.prototype.next = function(){
    if(typeof this.head !== "undefined"){
        if(typeof this.current === "undefined" || this.current == this.tail){
            this.current = this.head;
            return this.head;
        }else if(typeof this.current.next !== "undefined"){
            // prev =  this.current
            // this.current = prev.next
            this.current = this.current.next;
            return this.current;
        }else{
            return undefined;
        }
    }    
}
//for testing purposes
MessageList.prototype.iterate = function(){
    current  = this.head;
    while(typeof current !== "undefined"){
        console.log(current.toString());
        current = current.next;
    }
}
MessageList.prototype.clear = function(){
    this.size = 0;
    this.head =  undefined;
    this.tail = undefined;
}