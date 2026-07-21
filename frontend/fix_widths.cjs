const fs = require('fs');
const path = require('path');

const basePath = path.join(__dirname, 'src');

// Fix AdminForm.css
const adminFormCss = path.join(basePath, 'pages', 'admin', 'AdminForm.css');
if (fs.existsSync(adminFormCss)) {
    let content = fs.readFileSync(adminFormCss, 'utf8');
    content = content.replace(/width:\s*420px;/g, 'max-width: 420px; width: 100%; box-sizing: border-box;');
    fs.writeFileSync(adminFormCss, content, 'utf8');
    console.log('Fixed AdminForm.css');
}

// Fix Dashboard.css tables
const dashboardCss = path.join(basePath, 'pages', 'admin', 'Dashboard.css');
if (fs.existsSync(dashboardCss)) {
    let content = fs.readFileSync(dashboardCss, 'utf8');
    if (!content.includes('overflow-x: auto')) {
        content = content.replace(/\.admin-users-table \{/g, '.admin-users-table {\n  overflow-x: auto;\n  width: 100%;');
        fs.writeFileSync(dashboardCss, content, 'utf8');
        console.log('Fixed Dashboard.css');
    }
}

// Add global box-sizing to index.css
const indexCss = path.join(basePath, 'index.css');
if (fs.existsSync(indexCss)) {
    let content = fs.readFileSync(indexCss, 'utf8');
    if (!content.includes('box-sizing: border-box;')) { // Check if it's already in body or root
        content = `*,\n*::before,\n*::after {\n  box-sizing: border-box;\n}\n` + content;
        fs.writeFileSync(indexCss, content, 'utf8');
        console.log('Fixed index.css');
    }
}
