function downloadPlainText(filename, data) {
    if (!data) {
        return;
    }
    let element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(data.rawData));
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
    let text = node.innerText;
    let path = list.getWord(text).path;
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
            img.src = './assets/down-arrow.svg';
            element.appendChild(img);
        }
    }
    changeTab('nodes');
}


function wrapp(findString) {
    let target = document.getElementById("output");
    let out = '';
    let text = target.innerHTML;
    if (text.indexOf(findString) === -1) {
        return;
    }
    let parts = text.split(/\r?\n/);
    for (let i = 0; i < parts.length; i++) {
        let words = parts[i].split(' ');
        for (let j = 0; j < words.length; j++) {
            out += '<span  onclick="loadPath(this)" class="text-wrapping">' + words[j] + '</span> ';
        }
        out += '</br>';
    }
    target.innerHTML = out;
    $(() => {
        $('[data-toggle="popover"]').popover()
    })
}

function loadFile(file, cb) {
    list.clear();
    var fr = new FileReader();
    fr.onload = () => {

        let temp = fr.result.replace(/[.,\/#!$%\^&\*;:\[\]"'{}<>=\-_`~()]/g, "");
        temp.replace(/\s{2,}/g, " ");
        temp = temp.toLowerCase();
        document.getElementById('output')
            .textContent = temp;
        document.getElementById('no-data').style.display = 'none';
        Array.from(document.getElementsByClassName('download-button')).forEach(e => {
            e.style.opacity = 1;
            e.style.cursor = 'pointer';
        });
        let arrayOfLines = temp.split("\n").map((line) => line.trim().split(' '));

        for (let i = 0; i < arrayOfLines.length; i++) {
            for (let j = 0; j < arrayOfLines[i].length; j++) {
                let w = arrayOfLines[i][j];
                if (w !== '') {
                    list.insert(w, i + 1, j + 1);
                }
            }
        }
        wrapp(temp);
        console.log(list);
        cb();
    };

    fr.readAsText(file);
};