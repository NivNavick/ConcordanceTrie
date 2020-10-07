class TrieNode {
    constructor(data) {
        this.next = null;
        this.char = data;
        this.isWord = false;
        this.positions = '';
        this.nodes = new Trie();
    }

    addPosition(pos) {
        this.positions += '="'+pos.line + ':' + pos.linePosition + '",';
    }

    toString() {
        return 'Has Next:' + this.next !== null + '\n'
            + 'Char:' + this.char + '\n'
            + 'Is Word:' + this.isWord + '\n'
            + 'Has Descendants:' + !this.nodes.isEmpty();
    }
}