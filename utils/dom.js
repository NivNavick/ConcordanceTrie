//html elements
let fileInput;
let searchInput;
let nodePathContainer;
let nodeTitleElement;
let searchResultsNumber;
let textContainer;
let noDataElement;
let downloadButtonsElements;

//metadata elements
let insertionTime;
let fetchTime;
let avgFetchTime;
let wordsCount;
let fileSize;


function initElements() {
    fileInput = document.getElementById('inputfile');
    searchInput = document.getElementById('search-input');
    nodePathContainer = document.getElementById('single-node-path');
    nodeTitleElement = document.getElementById('nodes-tab-title');
    searchResultsNumber = document.getElementById('search-results-number');
    textContainer = document.getElementById("output");
    noDataElement = document.getElementById('no-data');
    downloadButtonsElements = Array.from(document.getElementsByClassName('download-button'));

    insertionTime = document.getElementById('insertion-time');
    fetchTime = document.getElementById('fetch-time');
    avgFetchTime = document.getElementById('avg-fetch-time');
    wordsCount = document.getElementById('words-count');
    fileSize = document.getElementById('file-size');
}

function initEventListeners() {
    fileInput.addEventListener('change', function () {
        file = this.files[0];
        loadFile(file, () => {
            data = trie.getAll();
        });
    });

    searchInput.addEventListener('keypress', (event) => {
        console.log(event);
        if (event.code === 'Enter') {
            search(searchInput.value);
        }
    });
}

function getSearchText() {
    return searchInput.value;
}

function setSearchText(value) {
    searchInput.value = value;
}

function changeNoDataSectionVisibility(hidden) {
    noDataElement.style.display = hidden?'none':'block';
}

function wrapText(findString, positions = null) {
    let out = '';
    if (text.indexOf(findString) === -1) {
        return;
    }
    for (let i = 0; i < arrayOfLines.length; i++) {
        out += '<span class="line-number">' + lineNumberGenerator(i) + '</span>';
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
    textContainer.innerHTML = out;
}

function setMetadata(metadata) {
    insertionTime.innerText = metadata.insertionTime;
    fetchTime.innerText = metadata.fetchTime;
    avgFetchTime.innerText = metadata.fetchAvgTime;
    wordsCount.innerText = metadata.wordsCount;
    fileSize.innerText = metadata.fileSize;
}

function createVisualTriePath(text, path) {
    nodeTitleElement.innerText = text;
    nodePathContainer.innerHTML = '';
    for (let i = 1; i <= text.length; i++) {
        appendToPathContainer(createSinglePathNode(path[i]));
        if (i < text.length) {
            appendToPathContainer(createImgNode('assets/down-arrow.svg'));
        }
    }
}

function updateResultsNumber(resultsNumber) {
    searchResultsNumber.innerText = '(' + resultsNumber + ')';
}

function createSinglePathNode(trieNode) {
    let node = document.createElement("div");
    node.className = 'node-path';
    let textNode = document.createTextNode(trieNode.char);
    node.appendChild(textNode);
    return node;
}

function appendToPathContainer(node) {
    nodePathContainer.appendChild(node);
}

function createImgNode(source) {
    let img = document.createElement('img');
    img.src = source;
    return img;
}

function enableDownloadButton() {
    downloadButtonsElements.forEach(e => {
        e.style.opacity = 1;
        e.style.cursor = 'pointer';
    });
}

function changeElementVisibility(id, hidden) {
    let element = document.getElementById(id);
    element.style.display = hidden ? 'none' : 'block';
}