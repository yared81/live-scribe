// DOM Elements
const htmlEditor = document.getElementById('html-editor');
const cssEditor = document.getElementById('css-editor');
const jsEditor = document.getElementById('js-editor');
const previewFrame = document.getElementById('preview-frame');
const tabButtons = document.querySelectorAll('.tab-btn');
const editors = document.querySelectorAll('.editor');
const themeToggle = document.getElementById('theme-toggle');
const darkTheme = document.getElementById('dark-theme');

// Theme Management
function setTheme(isDark) {
    document.body.setAttribute('data-theme', isDark ? 'dark' : 'light');
    darkTheme.disabled = !isDark;
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'light';
setTheme(savedTheme === 'dark');
themeToggle.checked = savedTheme === 'dark';

// Theme toggle event listener
themeToggle.addEventListener('change', (e) => {
    setTheme(e.target.checked);
});

// Load saved content from localStorage
function loadSavedContent() {
    htmlEditor.textContent = localStorage.getItem('htmlContent') || '';
    cssEditor.textContent = localStorage.getItem('cssContent') || '';
    jsEditor.textContent = localStorage.getItem('jsContent') || '';
    updatePreview();
    highlightCode();
}

// Save content to localStorage
function saveContent() {
    localStorage.setItem('htmlContent', htmlEditor.textContent);
    localStorage.setItem('cssContent', cssEditor.textContent);
    localStorage.setItem('jsContent', jsEditor.textContent);
}

// Update syntax highlighting
function highlightCode() {
    editors.forEach(editor => {
        Prism.highlightElement(editor);
    });
}

// Update the preview iframe
function updatePreview() {
    const html = htmlEditor.textContent;
    const css = cssEditor.textContent;
    const js = jsEditor.textContent;

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
editors.forEach(editor => {
    editor.addEventListener('input', () => {
        highlightCode();
        updatePreview();
        saveContent();
    });

    // Handle tab key in editors
    editor.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const start = editor.selectionStart;
            const end = editor.selectionEnd;
            editor.textContent = editor.textContent.substring(0, start) + '    ' + editor.textContent.substring(end);
            editor.selectionStart = editor.selectionEnd = start + 4;
        }
    });
});

// Initialize the editor
loadSavedContent(); 