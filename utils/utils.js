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


function downloadPlainText(filename, data) {
    if (!data) {
        return;
    }
    let element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(data.rawData.replace(/="/g, '"')));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

function downloadCSV(filename, data) {
    if (!data) {
        return;
    }
    let element = document.createElement('a');
    let csvContent = 'Word,Positions\r\n';

    for (const [key, value] of Object.entries(data.data)) {
        csvContent += key + ',' + value + '\r\n';
    }
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

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

function changeElementVisibility(id, hidden) {
    let element = document.getElementById(id);
    element.style.display = hidden ? 'none' : 'block';
}

function loadPath(node) {
    let text;
    let path;
    let fromSearch;
    if (node.innerText) {
        text = node.innerText;
        fromSearch = true;
        document.getElementById('search-input').value = text;

    } else {
        text = node;
    }


    let t0 = performance.now();
    let wordNode = trie.getWord(text);
    let t1 = performance.now();
    metadata.fetchTime = (t1 - t0).toFixed(2);
    path = wordNode.path;
    if (fromSearch) {
        search(wordNode.node);
    }
    setMetadata(metadata);
    let element = document.getElementById('single-node-path');
    let titleElement = document.getElementById('nodes-tab-title');
    titleElement.innerText = text;
    element.innerHTML = '';
    for (let i = 1; i <= text.length; i++) {
        let node = document.createElement("div");
        node.className = 'node-path';
        let textNode = document.createTextNode(path[i].char);         // Create a text node
        node.appendChild(textNode);
        element.appendChild(node);
        if (i < text.length) {
            let img = document.createElement('img');
            img.src = 'assets/down-arrow.svg';
            element.appendChild(img);
        }
    }
    changeTab('nodes');
}


function search(data = null) {
    let node;
    if (!data.char) {
        let term = document.getElementById('search-input').value;
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
        .replace(/=|"/g, '')
        .split(',')
        .map((f) => {
            let t = f.split(':');
            return {line: parseInt(t[0]), linePos: parseInt(t[1])};
        });

    document.getElementById('search-results-number').innerText = '(' + positions.length + ')';
    wrapp(text, positions);
}

function wrapp(findString, positions = null) {
    if (positions) {
        //  positions = po
    }
    let target = document.getElementById("output");
    let out = '';
    if (text.indexOf(findString) === -1) {
        return;
    }
    for (let i = 0; i < arrayOfLines.length; i++) {
        let words = arrayOfLines[i];
        let offset = 0;
        for (let j = 0; j < words.length; j++) {

            if (words[j] === '') {
                offset++;
                continue;
            }

            let classes = 'text-wrapping';

            if (positions) {
                let f = positions.filter((pos) => pos.line - 1 === i && pos.linePos - 1 === j - offset);
                if (f.length > 0) {
                    classes += ' highlightTerm';
                    positions = positions.filter(pos => pos !== f[0]);
                }
            }

            out += '<span  onclick="loadPath(this)" class="' + classes + '">' + words[j] + '</span> ';
        }
        out += '</br>';
    }
    target.innerHTML = out;
}

function setMetadata(metadata) {
    document.getElementById('insertion-time').innerText = metadata.insertionTime;
    document.getElementById('fetch-time').innerText = metadata.fetchTime;
    document.getElementById('avg-fetch-time').innerText = metadata.fetchAvgTime;
    document.getElementById('words-count').innerText = metadata.wordsCount;
    document.getElementById('file-size').innerText = metadata.fileSize;
}

function checkAvgFetchTime() {
    let t0 = performance.now();
    trie.getAll();
    let t1 = performance.now();
    metadata.fetchAvgTime = (t1 - t0).toFixed(2);
    setMetadata(metadata);
}

function loadFile(file, cb) {
    trie.clear();
    var fr = new FileReader();
    fr.onload = () => {
        let temp = fr.result.replace(/[.,\/#!$%\^&\*;:\[\]"'{}<>=\-_`~()]/g, "");
        temp.replace(/\s{2,}/g, " ");
        temp = temp.toLowerCase();
        document.getElementById('no-data').style.display = 'none';
        Array.from(document.getElementsByClassName('download-button')).forEach(e => {
            e.style.opacity = 1;
            e.style.cursor = 'pointer';
        });
        arrayOfLines = temp.split("\n").map((line) => line.trim().split(' '));

        let t0 = performance.now();
        for (let i = 0; i < arrayOfLines.length; i++) {
            for (let j = 0; j < arrayOfLines[i].length; j++) {
                let w = arrayOfLines[i][j];
                if (w !== '') {
                    trie.insert(w, i + 1, j + 1);
                }
            }
        }
        let t1 = performance.now();
        metadata.insertionTime = (t1 - t0).toFixed();
        metadata.wordsCount = temp.length;
        metadata.fileSize = file.size.toFixed() / 1000;
        text = temp;
        setMetadata(metadata);
        wrapp(temp);
        console.log(trie);
        cb();
    };

    fr.readAsText(file);
}