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