// DOM Elements
const htmlEditor = document.getElementById('html-editor');
const cssEditor = document.getElementById('css-editor');
const jsEditor = document.getElementById('js-editor');
const previewFrame = document.getElementById('preview-frame');
const tabButtons = document.querySelectorAll('.tab-btn');
const editors = document.querySelectorAll('.editor');
const themeToggle = document.getElementById('theme-toggle');
const darkTheme = document.getElementById('dark-theme');
const cssFavicon = document.getElementById('css-favicon');
const jsFavicon = document.getElementById('js-favicon');

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

// Update favicon based on active tab
function updateFavicon(lang) {
    // Hide all favicons
    cssFavicon.disabled = true;
    jsFavicon.disabled = true;
    
    // Show the appropriate favicon
    if (lang === 'css') {
        cssFavicon.disabled = false;
    } else if (lang === 'js') {
        jsFavicon.disabled = false;
    }
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
        const activeEditor = document.getElementById(`${lang}-editor`);
        activeEditor.classList.add('active');
        activeEditor.focus();
        
        // Update favicon
        updateFavicon(lang);
    });
});

// Add input event listeners to all editors
editors.forEach(editor => {
    editor.addEventListener('input', () => {
        updatePreview();
        saveContent();
    });

    // Handle tab key in editors
    editor.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const start = editor.selectionStart;
            const end = editor.selectionEnd;
            const value = editor.value;
            editor.value = value.substring(0, start) + '    ' + value.substring(end);
            editor.selectionStart = editor.selectionEnd = start + 4;
        }
    });
});

// Initialize the editor
loadSavedContent();

// Focus the active editor on load
const activeEditor = document.querySelector('.editor.active');
if (activeEditor) {
    activeEditor.focus();
}

// Set initial favicon
updateFavicon('html'); 