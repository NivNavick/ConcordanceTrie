class Trie {
    constructor(head = null) {
        this.head = head;
        this.count = 0;
    }

    isEmpty() {
        return this.count === 0;
    }

    insert(word, i, j) {
        if (word.length === 0 || word === '') {
            return;
        }
        let c = word.charAt(0);
        let node = this.search(c);


        if (!node) {
            let i = this.checkPosition(c);
            node = this.insertAt(c, i);
        }

        if (word.length === 1) {
            node.isWord = true;
            node.addPosition({line: i, linePosition: j});
        }
        node.nodes.insert(word.slice(1), i, j);
    }

    checkPosition(element) {
        let val = element.charCodeAt(0);
        if (this.isEmpty()) {
            return 0;
        } else if (this.getIndex(0).char.charCodeAt(0) > val) {
            return 0;
        } else if (this.getIndex(this.count - 1).char.charCodeAt(0) < val) {
            return this.count;
        }

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
            let curr, prev;

            curr = this.head;

            // add the element to the
            // first index
            if (index === 0) {
                node.next = this.head;
                this.head = node;
            } else {
                curr = this.head;
                let it = 0;

                // iterate over the trie to find
                // the position to insert
                while (it < index) {
                    it++;
                    prev = curr;
                    curr = curr.next;
                }

                // adding an element
                node.next = curr;
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

    display(consoleLog = true) {
        let o = {
            data: {},
            rawData: ''
        };
        this.getAllTrie(this.head, '', o,consoleLog);
        return o;
    }

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
            this.getAllTrie(n, word + node.char, obj,consoleLog);
        }
        this.getAllTrie(node.next, word, obj,consoleLog);
    }

    getWord(word) {
        let o = {
            node: {},
            path: {}
        };
        this.getWordRoute(word, o, word.length);
        return o;
    }

    getWordRoute(word, dataObject, length) {

        if (!word || word === '') {
            return null;
        }
        let char = word.charAt(0);
        let node = this.search(char);
        dataObject.path[length - (word.length - 1)] = node;
        if (word && word.length === 1) {
            dataObject.node = node;
            return dataObject;
        }

        if (node) {
            return node.nodes.getWordRoute(word.slice(1), dataObject, length);
        }
        return null;
    }

    insertLast(element) {
        // creates a new node
        let node = new TrieNode(element);

        // to store current node
        let current;

        // if trie is Empty add the
        // element and make it head
        if (this.head === null)
            this.head = node;
        else {
            current = this.head;

            // iterate to the end of the
            // trie
            while (current.next) {
                current = current.next;
            }

            // add node
            current.next = node;
        }
        this.count++;
        return node;
    }
}