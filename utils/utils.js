const REPLACE_SPECIAL_CHARS_REGEX = /[.,\/#!$%\^&\*;:\[\]"'•|{}<>=\-_`~()]/g;
const REPLACE_POSITIONS_CHARS_REGEX = /=|"/g;

let metadata = {
    wordsCount: 0,
    fileSize: 0,
    insertionTime: 0,
    fetchTime: 0,
    fetchAvgTime: 0
};

let text;
let trie = new Trie();
let data;
let arrayOfLines = [];
let file;

function changeTab(tab) {
    switch (tab) {
        case 'file':
            changeElementVisibility('file-tab', false);
            changeElementVisibility('nodes-tab', true);
            break;
        case 'nodes':
            changeElementVisibility('file-tab', true);
            changeElementVisibility('nodes-tab', false);
            break;
    }
}

function loadPath(node) {
    let text;
    let fromSearch;
    if (node.innerText) {
        text = node.innerText;
        fromSearch = true;
        setSearchText(text);

    } else {
        text = node;
    }

    let t0 = performance.now();
    let wordNode = trie.getWord(text);
    let t1 = performance.now();
    metadata.fetchTime = (t1 - t0).toFixed(2);
    if (fromSearch) {
        search(wordNode.node);
    }
    setMetadata(metadata);
    createVisualTriePath(text, wordNode.path, node);
    changeTab('nodes');
}


function search(data = null) {
    let node;
    if (!data.char) {
        let term = getSearchText();
        loadPath(term);
        let t0 = performance.now();
        node = trie.getWord(term).node;
        let t1 = performance.now();
        metadata.fetchTime = (t1 - t0).toFixed(2);
        setMetadata(metadata);
    } else {
        node = data;
    }
    if (!node) {
        return;
    }

    let positions = node.positions
        .slice(0, -1)
        .replace(REPLACE_POSITIONS_CHARS_REGEX, '')
        .split(',')
        .map((f) => {
            let t = f.split(':');
            return {line: parseInt(t[0]), linePos: parseInt(t[1])};
        });
    updateResultsNumber(positions.length);
    wrapText(text, positions);
}

function lineNumberGenerator(i) {
    i++;
    const baseSpaceNumber = 6;
    let length = i.toString().length;
    let lineNumber = (i) + '.';
    for (let j = 0; j < baseSpaceNumber - length; j++) {
        lineNumber += ' ';
    }
    return lineNumber;
}

function checkAvgFetchTime() {
    let t0 = performance.now();
    trie.getAll();
    let t1 = performance.now();
    metadata.fetchAvgTime = (t1 - t0).toFixed(2);
    setMetadata(metadata);
}

function initTrie(arrayOfLines) {
    for (let i = 0; i < arrayOfLines.length; i++) {
        for (let j = 0; j < arrayOfLines[i].length; j++) {
            let w = arrayOfLines[i][j];
            if (w !== '') {
                trie.insert(w, i + 1, j + 1);
            }
        }
    }
}

function removeSpecialChars(text) {
    text = text.replace(REPLACE_SPECIAL_CHARS_REGEX, ' ');
    text = text.replace(/  +/g, ' ');
    text = text.toLowerCase();
    return text;
}

function loadFile(file, cb) {
    trie.clear();
    var fr = new FileReader();
    fr.onload = () => {
        let loadedText = removeSpecialChars(fr.result);
        changeNoDataSectionVisibility(true);
        enableDownloadButton();
        arrayOfLines = loadedText.split("\n").map((line) => line.trim().split(' '));
        let t0 = performance.now();
        initTrie(arrayOfLines);
        let t1 = performance.now();
        metadata.insertionTime = (t1 - t0).toFixed();
        metadata.wordsCount = loadedText.length;
        metadata.fileSize = file.size.toFixed() / 1000;
        text = loadedText;
        setMetadata(metadata);
        wrapText(loadedText);
        cb();
    };

    fr.readAsText(file);
}