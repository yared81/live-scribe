// DOM Elements
const htmlEditor = document.getElementById('html-editor');
const cssEditor = document.getElementById('css-editor');
const jsEditor = document.getElementById('js-editor');
const previewFrame = document.getElementById('preview-frame');
const tabButtons = document.querySelectorAll('.tab-btn');
const editors = document.querySelectorAll('.editor');

// Load saved content from localStorage
function loadSavedContent() {
    htmlEditor.value = localStorage.getItem('htmlContent') || '';
    cssEditor.value = localStorage.getItem('cssContent') || '';
    jsEditor.value = localStorage.getItem('jsContent') || '';
    updatePreview();
}

// Save content to localStorage
function saveContent() {
    localStorage.setItem('htmlContent', htmlEditor.value);
    localStorage.setItem('cssContent', cssEditor.value);
    localStorage.setItem('jsContent', jsEditor.value);
}

// Update the preview iframe
function updatePreview() {
    const html = htmlEditor.value;
    const css = cssEditor.value;
    const js = jsEditor.value;

    const previewContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>${css}</style>
        </head>
        <body>
            ${html}
            <script>${js}</script>
        </body>
        </html>
    `;

    const previewDocument = previewFrame.contentDocument || previewFrame.contentWindow.document;
    previewDocument.open();
    previewDocument.write(previewContent);
    previewDocument.close();
}

// Handle tab switching
tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons and editors
        tabButtons.forEach(btn => btn.classList.remove('active'));
        editors.forEach(editor => editor.classList.remove('active'));

        // Add active class to clicked button and corresponding editor
        button.classList.add('active');
        const lang = button.getAttribute('data-lang');
        document.getElementById(`${lang}-editor`).classList.add('active');
    });
});

// Add input event listeners to all editors
[htmlEditor, cssEditor, jsEditor].forEach(editor => {
    editor.addEventListener('input', () => {
        updatePreview();
        saveContent();
    });
});

// Initialize the editor
loadSavedContent(); 