const htmlEditor = document.getElementById('html-editor');
const cssEditor = document.getElementById('css-editor');
const jsEditor = document.getElementById('js-editor');
const previewFrame = document.getElementById('preview-frame');
const tabButtons = document.querySelectorAll('.tab-btn');
const editors = document.querySelectorAll('.editor');
const themeToggle = document.getElementById('theme-toggle');
const cssFavicon = document.getElementById('css-favicon');
const jsFavicon = document.getElementById('js-favicon');

function setTheme(isDark) {
    document.body.setAttribute('data-theme', isDark ? 'dark' : 'light');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

const savedTheme = localStorage.getItem('theme') || 'light';
setTheme(savedTheme === 'dark');
themeToggle.checked = savedTheme === 'dark';


themeToggle.addEventListener('change', (e) => {
    setTheme(e.target.checked);
    updatePreview();
});


function highlightSyntax(code, language) {
    if (!code) return code;
    
    // HTML highlighting
    if (language === 'html') {
        return code
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/(".*?")/g, '<span class="string">$1</span>')
            .replace(/(&lt;\/?[a-z][^&]*&gt;)/gi, '<span class="tag">$1</span>');
    }
    
    // CSS highlighting
    if (language === 'css') {
        return code
            .replace(/(".*?")/g, '<span class="string">$1</span>')
            .replace(/([a-zA-Z-]+)(?=:)/g, '<span class="property">$1</span>')
            .replace(/(:.*?;)/g, '<span class="value">$1</span>')
            .replace(/(\/\*.*?\*\/)/g, '<span class="comment">$1</span>');
    }
    
    // JavaScript highlighting
    if (language === 'js') {
        return code
            .replace(/(".*?")/g, '<span class="string">$1</span>')
            .replace(/\b(function|return|if|else|for|while|const|let|var)\b/g, '<span class="keyword">$1</span>')
            .replace(/\b(true|false|null|undefined)\b/g, '<span class="boolean">$1</span>')
            .replace(/\b(\d+)\b/g, '<span class="number">$1</span>')
            .replace(/(\/\/.*$)/gm, '<span class="comment">$1</span>');
    }
    
    return code;
}

// Extract title from HTML content
function extractTitle(html) {
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    return titleMatch ? titleMatch[1].trim() : 'Live Preview';
}

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
    const isDark = document.body.getAttribute('data-theme') === 'dark';

    const previewContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {
                    color: ${isDark ? '#e0e0e0' : '#2c2c2c'};
                    background-color: ${isDark ? '#1e1e1e' : '#ffffff'};
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    padding: 20px;
                }
                a {
                    color: ${isDark ? '#66b3ff' : '#0066cc'};
                }
                h1, h2, h3, h4, h5, h6 {
                    color: ${isDark ? '#ffffff' : '#1a1a1a'};
                }
                ${css}
            </style>
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

    // Update preview panel title
    const previewTitle = extractTitle(html);
    document.querySelector('.preview-header h2').textContent = previewTitle;
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