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
        
    if (language === 'html') {
        return code
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/(".*?")/g, '<span class="string">$1</span>')
            .replace(/(&lt;\/?[a-z][^&]*&gt;)/gi, '<span class="tag">$1</span>');
    }
        
    if (language === 'css') {
        return code
            .replace(/(".*?")/g, '<span class="string">$1</span>')
            .replace(/([a-zA-Z-]+)(?=:)/g, '<span class="property">$1</span>')
            .replace(/(:.*?;)/g, '<span class="value">$1</span>')
            .replace(/(\/\*.*?\*\/)/g, '<span class="comment">$1</span>');
    }
    
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

function extractTitle(html) {
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    return titleMatch ? titleMatch[1].trim() : 'Live Preview';
}

function loadSavedContent() {
    htmlEditor.value = localStorage.getItem('htmlContent') || '';
    cssEditor.value = localStorage.getItem('cssContent') || '';
    jsEditor.value = localStorage.getItem('jsContent') || '';
    updatePreview();
}

function saveContent() {
    localStorage.setItem('htmlContent', htmlEditor.value);
    localStorage.setItem('cssContent', cssEditor.value);
    localStorage.setItem('jsContent', jsEditor.value);
}

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
    
    const previewTitle = extractTitle(html);
    document.querySelector('.preview-header h2').textContent = previewTitle;
}

function updateFavicon(lang) {
    cssFavicon.disabled = true;
    jsFavicon.disabled = true;
        
    if (lang === 'css') {
        cssFavicon.disabled = false;
    } else if (lang === 'js') {
        jsFavicon.disabled = false;
    }
}

tabButtons.forEach(button => {
    button.addEventListener('click', () => {        
        tabButtons.forEach(btn => btn.classList.remove('active'));
        editors.forEach(editor => editor.classList.remove('active'));
        
        button.classList.add('active');
        const lang = button.getAttribute('data-lang');
        const activeEditor = document.getElementById(`${lang}-editor`);
        activeEditor.classList.add('active');
        activeEditor.focus();
                
        updateFavicon(lang);
    });
});

editors.forEach(editor => {
    editor.addEventListener('input', () => {
        updatePreview();
        saveContent();
    });
    
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

loadSavedContent();

const activeEditor = document.querySelector('.editor.active');
if (activeEditor) {
    activeEditor.focus();
}

updateFavicon('html'); 