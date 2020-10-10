class Trie {
    constructor(head = null) {
        this.head = head;
        this.count = 0;
    }

    isEmpty() {
        return this.count === 0;
    }

    //insert new word
    insert(word, i, j) {
        if (word.length === 0 || word === '') {
            return;
        }
        let c = word.charAt(0);
        let node = this.search(c);

        if (!node) {
            //check correct insert index
            //in order to remain sorted
            let i = this.checkPosition(c);
            node = this.insertAt(c, i);
        }

        if (word.length === 1) {
            node.isWord = true;
            //insert new node/exists position
            node.addPosition({line: i, linePosition: j});
        }
        //insert the next char level
        node.nodes.insert(word.slice(1), i, j);
    }

    //find new element position
    checkPosition(element) {
        let val = element.charCodeAt(0);
        //if trie is empty,position should be first
        if (this.isEmpty()) {
            return 0;
        } else if (this.getIndex(0).char.charCodeAt(0) > val) {
            return 0;
        } else if (this.getIndex(this.count - 1).char.charCodeAt(0) < val) {
            //if element position should be last
            return this.count;
        }

        //if element position should be somewhere
        let i = 0;
        while (this.getIndex(i).char.charCodeAt(0) < val) {
            i++;
        }
        return i;
    }

    // insert element at index
    insertAt(element, index) {
        if (index > 0 && index > this.count)
            return false;
        else {
            // creates a new node
            let node = new TrieNode(element);
            let current, prev;

            current = this.head;

            // add the element to the
            // first index
            if (index === 0) {
                node.next = this.head;
                this.head = node;
            } else {
                current = this.head;
                let counter = 0;

                // iterate over the trie to find
                // the position to insert
                while (counter < index) {
                    counter++;
                    prev = current;
                    current = current.next;
                }

                // adding an element
                node.next = current;
                prev.next = node;
            }
            this.count++;
            return node;
        }
    }

    getIndex(i) {
        let node = this.head;
        let counter = 0;
        while (node.next && counter < i) {
            node = node.next;
            counter++;
        }
        return node;
    }

    //search by char
    search(c) {
        let tempNode = this.head;
        while (tempNode && tempNode.next) {
            if (tempNode.char === c) {
                return tempNode;
            }
            tempNode = tempNode.next;
        }
        return tempNode && tempNode.char === c ?
            tempNode : null;
    }

    clear() {
        this.head = null;
    }

    //get all trie data
    getAll() {
        let o = {
            data: {},
            rawData: ''
        };
        this.getAllTrie(this.head, '', o, false);
        return o;
    }

    //display all trie data to console
    display() {
        let o = {
            data: {},
            rawData: ''
        };
        this.getAllTrie(this.head, '', o, true);
    }

    //getting all trie data (helper)
    getAllTrie(node, word, obj, consoleLog = true) {
        if (node === null) {
            return;
        }

        if (node.isWord) {
            let w = word + node.char;
            obj.rawData += w + ':' + node.positions + '\n';
            obj.data[w] = node.positions;
            if (consoleLog) {
                console.log(w + ':' + node.positions);
            }
        }

        if (!node.nodes.isEmpty()) {
            let n = node.nodes.getIndex(0);
            //get trie child nodes
            this.getAllTrie(n, word + node.char, obj, consoleLog);
        }
        //get trie siblings nodes
        this.getAllTrie(node.next, word, obj, consoleLog);
    }

    getWord(word) {
        let o = {
            node: {},
            path: {}
        };
        this.getWordRoute(word, o, word.length);
        return o;
    }

    //getting a word with it's nodes route (helper)
    getWordRoute(word, dataObject, length) {

        if (!word || word === '') {
            return null;
        }
        let char = word.charAt(0);
        let node = this.search(char);
        if (node !== null) {
            dataObject.path[length - (word.length - 1)] = node;
        }
        if (word && word.length === 1) {
            dataObject.node = node;
            return dataObject;
        }

        if (node) {
            //getting deeper into the trie
            return node.nodes.getWordRoute(word.slice(1), dataObject, length);
        }
        return null;
    }
}