const fs = require('fs');
const path = require('path');

function appendToFile(filePath, content) {
    if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        if (!fileContent.includes(content.trim().split('\n')[0])) {
            fs.appendFileSync(filePath, '\n' + content + '\n');
            console.log(`Appended to ${filePath}`);
        } else {
            console.log(`Content already exists in ${filePath}`);
        }
    } else {
        console.log(`File not found: ${filePath}`);
    }
}

const basePath = path.join(__dirname, 'src');

// 1. Hero.css
appendToFile(path.join(basePath, 'components', 'Hero', 'Hero.css'), `
@media (max-width: 1024px) {
    .hero-content {
        width: 80%;
        margin-left: 40px;
    }
    .hero-content h1 {
        font-size: 60px;
        line-height: 70px;
    }
}

@media (max-width: 768px) {
    .hero-content {
        width: 90%;
        margin-left: 20px;
        text-align: center;
    }
    .line {
        margin: 0 auto 20px auto;
    }
    .hero-content h1 {
        font-size: 40px;
        line-height: 50px;
        margin-bottom: 20px;
    }
    .hero-content p {
        font-size: 18px;
        line-height: 28px;
        width: 100%;
        margin-bottom: 30px;
    }
    .hero {
        height: auto;
        min-height: 80vh;
    }
    .overlay {
        padding: 60px 0;
    }
}
`);

// 2. Features.css
appendToFile(path.join(basePath, 'components', 'Features', 'Features.css'), `
@media (max-width: 1024px) {
    .features {
        grid-template-columns: repeat(2, 1fr);
    }
    .feature:nth-child(2) {
        border-right: none;
    }
    .feature:nth-child(3) {
        border-top: 1px solid rgba(255,255,255,.2);
    }
    .feature:nth-child(4) {
        border-top: 1px solid rgba(255,255,255,.2);
    }
}

@media (max-width: 600px) {
    .features {
        grid-template-columns: 1fr;
        padding: 30px 20px;
    }
    .feature {
        border-right: none !important;
        border-bottom: 1px solid rgba(255,255,255,.2);
    }
    .feature:last-child {
        border-bottom: none;
    }
    .feature:nth-child(3), .feature:nth-child(4) {
        border-top: none;
    }
}
`);

// 3. Statistics.css
appendToFile(path.join(basePath, 'components', 'Statistics', 'Statistics.css'), `
@media (max-width: 1024px) {
    .statistics-container {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 600px) {
    .statistics-container {
        grid-template-columns: 1fr;
    }
    .statistics {
        padding: 60px 30px;
    }
    .statistics-header h2 {
        font-size: 32px;
        margin-bottom: 40px;
    }
}
`);

// 4. Projects.css
appendToFile(path.join(basePath, 'components', 'Projects', 'Projects.css'), `
@media (max-width: 768px) {
    .projects-page {
        padding: 40px 20px;
    }
    .projects-inner h1 {
        font-size: 32px;
    }
}
`);

// 5. About.css
appendToFile(path.join(basePath, 'components', 'About', 'About.css'), `
@media (max-width: 1024px) {
    .about {
        flex-direction: column;
        padding: 60px 40px;
    }
    .about-image {
        width: 100%;
        margin-bottom: 40px;
    }
    .about-text {
        width: 100%;
        margin-left: 0;
    }
}

@media (max-width: 768px) {
    .about {
        padding: 50px 20px;
    }
    .about-text h2 {
        font-size: 32px;
    }
}
`);

// 6. Services.css
appendToFile(path.join(basePath, 'components', 'Services', 'Services.css'), `
@media (max-width: 600px) {
    .services-title h2 {
        font-size: 28px;
    }
    .services-title p {
        font-size: 16px;
        line-height: 28px;
    }
    .services {
        padding: 50px 20px;
    }
}
`);

// 7. Navbar.css (Enhance existing media queries by appending to the end)
appendToFile(path.join(basePath, 'components', 'Navbar', 'Navbar.css'), `
@media (max-width: 720px) {
    .logo-text h2 {
        font-size: 24px;
    }
    .logo-text span {
        font-size: 11px;
    }
    .logo-icon {
        width: 35px;
    }
}
`);

// 8. AuthPages.css
appendToFile(path.join(basePath, 'pages', 'AuthPages.css'), `
@media (max-width: 600px) {
    .auth-card {
        padding: 24px 20px;
    }
    .auth-card h2 {
        font-size: 24px;
    }
    .auth-page {
        padding: 20px 15px;
    }
}
`);

// 9. Dashboard.css for all roles
const dashboards = [
    'admin/Dashboard.css', 
    'client/Dashboard.css', 
    'employee/Dashboard.css', 
    'engineer/Dashboard.css', 
    'hr/Dashboard.css'
];

dashboards.forEach(d => {
    appendToFile(path.join(basePath, 'pages', d), `
@media (max-width: 1024px) {
    .dashboard-container {
        flex-direction: column;
    }
    .dashboard-main {
        padding: 20px;
        width: 100%;
        box-sizing: border-box;
    }
}
@media (max-width: 768px) {
    .dashboard-main {
        padding: 15px 10px;
    }
}
`);
});

// 10. Sidebar.css
appendToFile(path.join(basePath, 'components', 'Admin', 'Sidebar', 'Sidebar.css'), `
@media (max-width: 1024px) {
    .sidebar {
        width: 100%;
        min-height: auto;
        position: relative;
        display: flex;
        flex-direction: row;
        overflow-x: auto;
        padding: 10px;
    }
    .sidebar-menu {
        display: flex;
        flex-direction: row;
        margin-top: 0;
        gap: 10px;
    }
    .sidebar-title {
        display: none;
    }
}
`);
