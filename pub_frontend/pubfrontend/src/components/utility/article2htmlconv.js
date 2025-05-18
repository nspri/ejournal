export function cleanDocument(rawText) {
    const lines = rawText.split('\n').map(line => line.trim()).filter(line => line !== '');

    let html = '';
    let inList = false;
    let inOrderedList = false;

    for (let line of lines) {
        // Chapter Heading
        if (/^Chapter\s+\d+/.test(line)) {
            html += `<h1>${line}</h1>\n`;
            continue;
        }

        // Section Heading
        if (/^\d+(\.\d+)+\s+/.test(line)) {
            html += `<h2>${line}</h2>\n`;
            continue;
        }

        // Ordered list item
        if (/^\d+\.\s+/.test(line)) {
            if (!inOrderedList) {
                html += `<ol>\n`;
                inOrderedList = true;
            }
            html += `  <li>${line.replace(/^\d+\.\s+/, '')}</li>\n`;
            continue;
        } else if (inOrderedList) {
            html += `</ol>\n`;
            inOrderedList = false;
        }

        // Bullet list item
        if (/^[•\-*]\s+/.test(line)) {
            if (!inList) {
                html += `<ul>\n`;
                inList = true;
            }
            html += `  <li>${line.replace(/^[•\-*]\s+/, '')}</li>\n`;
            continue;
        } else if (inList) {
            html += `</ul>\n`;
            inList = false;
        }

        // Default paragraph
        html += `<p>${line}</p>\n`;
    }

    // Close any still-open list
    if (inList) html += '</ul>\n';
    if (inOrderedList) html += '</ol>\n';

    return html;
}
