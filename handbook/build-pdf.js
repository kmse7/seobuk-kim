const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

const DOCS_DIR = path.join(__dirname, '..', 'docs');
const OUTPUT_HTML = path.join(__dirname, 'index.html');

const chapters = [
  { file: '00-quickstart.md', title: '빠른 시작', section: 'beginner' },
  { file: '01-basic-usage.md', title: '기본 사용법', section: 'beginner' },
  { file: '02-keyboard-shortcuts.md', title: '단축키 & 셸 설정', section: 'beginner' },
  { file: '03-settings.md', title: 'Settings 최적화', section: 'intermediate' },
  { file: '04-skills-and-commands.md', title: '스킬 & 커맨드', section: 'intermediate' },
  { file: '05-git-workflow.md', title: 'Git 워크플로우', section: 'intermediate' },
  { file: '06-playwright.md', title: 'Playwright 자동화', section: 'intermediate' },
  { file: '07-mcp-servers.md', title: 'MCP 서버', section: 'intermediate' },
  { file: '08-multi-agent.md', title: '멀티에이전트', section: 'advanced' },
  { file: '09-cmux.md', title: 'cmux 멀티세션', section: 'advanced' },
  { file: '10-context-engineering.md', title: '컨텍스트 엔지니어링', section: 'advanced' },
  { file: '11-cicd-setup.md', title: 'CI/CD 셋업', section: 'advanced' },
  { file: 'troubleshooting.md', title: '문제 해결', section: 'appendix' },
];

const sectionNames = {
  beginner: '입문',
  intermediate: '중급',
  advanced: '고급',
  appendix: '부록',
};

// Build TOC
let tocHtml = '';
let lastSection = '';
chapters.forEach((ch, i) => {
  if (ch.section !== lastSection) {
    if (lastSection) tocHtml += '</ul>';
    tocHtml += `<h3 class="toc-section">${sectionNames[ch.section]}</h3><ul class="toc-list">`;
    lastSection = ch.section;
  }
  tocHtml += `<li><a href="#ch${i}">${ch.title}</a></li>`;
});
tocHtml += '</ul>';

// Build chapters
let chaptersHtml = '';
chapters.forEach((ch, i) => {
  const md = fs.readFileSync(path.join(DOCS_DIR, ch.file), 'utf-8');
  const html = marked.parse(md);
  const sectionLabel = sectionNames[ch.section];
  chaptersHtml += `
    <div class="chapter" id="ch${i}">
      <div class="chapter-header">
        <span class="chapter-badge">${sectionLabel}</span>
        <span class="chapter-number">Chapter ${String(i + 1).padStart(2, '0')}</span>
      </div>
      <div class="chapter-content">
        ${html}
      </div>
    </div>`;
});

const fullHtml = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Claude Code 핸드북 — seobuk-kim</title>
<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css">
<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"><\/script>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

  :root {
    --navy: #0f172a;
    --navy-light: #1e293b;
    --accent: #3b82f6;
    --accent-light: #60a5fa;
    --bg: #ffffff;
    --bg-alt: #f8fafc;
    --text: #1e293b;
    --text-muted: #64748b;
    --border: #e2e8f0;
  }

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    font-family: 'Inter', -apple-system, sans-serif;
    color: var(--text);
    line-height: 1.7;
    font-size: 11pt;
  }

  /* Cover */
  .cover {
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: linear-gradient(135deg, var(--navy) 0%, #1e3a5f 100%);
    color: white;
    text-align: center;
    page-break-after: always;
  }
  .cover-icon { font-size: 64px; margin-bottom: 24px; }
  .cover h1 { font-size: 42pt; font-weight: 800; letter-spacing: -1px; margin-bottom: 8px; }
  .cover .subtitle { font-size: 16pt; font-weight: 300; color: var(--accent-light); margin-bottom: 48px; }
  .cover .meta { font-size: 10pt; color: #94a3b8; }
  .cover .meta span { margin: 0 12px; }
  .cover .badge { display: inline-block; background: var(--accent); color: white; padding: 6px 16px; border-radius: 20px; font-size: 10pt; font-weight: 500; margin-bottom: 48px; }

  /* TOC */
  .toc {
    padding: 60px 80px;
    page-break-after: always;
  }
  .toc h2 { font-size: 24pt; font-weight: 700; color: var(--navy); margin-bottom: 32px; border-bottom: 3px solid var(--accent); padding-bottom: 12px; }
  .toc-section { font-size: 11pt; font-weight: 600; color: var(--accent); margin: 20px 0 8px; text-transform: uppercase; letter-spacing: 1px; }
  .toc-list { list-style: none; padding: 0; }
  .toc-list li { padding: 6px 0; border-bottom: 1px solid var(--border); }
  .toc-list a { color: var(--text); text-decoration: none; font-weight: 400; }
  .toc-list a:hover { color: var(--accent); }

  /* Chapters */
  .chapter {
    padding: 40px 60px;
    page-break-before: always;
  }
  .chapter-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    padding-bottom: 12px;
    border-bottom: 2px solid var(--border);
  }
  .chapter-badge {
    background: var(--accent);
    color: white;
    padding: 3px 12px;
    border-radius: 12px;
    font-size: 9pt;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .chapter-number { color: var(--text-muted); font-size: 9pt; font-weight: 500; }
  .chapter-content h1 { font-size: 22pt; font-weight: 700; color: var(--navy); margin: 0 0 20px; }
  .chapter-content h2 { font-size: 16pt; font-weight: 600; color: var(--navy); margin: 28px 0 12px; padding-top: 16px; border-top: 1px solid var(--border); }
  .chapter-content h3 { font-size: 13pt; font-weight: 600; color: var(--navy-light); margin: 20px 0 8px; }
  .chapter-content h4 { font-size: 11pt; font-weight: 600; color: var(--text); margin: 16px 0 6px; }
  .chapter-content p { margin: 8px 0; }
  .chapter-content ul, .chapter-content ol { margin: 8px 0 8px 24px; }
  .chapter-content li { margin: 4px 0; }
  .chapter-content a { color: var(--accent); text-decoration: none; }

  /* Code */
  .chapter-content pre {
    background: #0d1117;
    color: #c9d1d9;
    padding: 16px 20px;
    border-radius: 8px;
    overflow-x: auto;
    font-family: 'JetBrains Mono', monospace;
    font-size: 9.5pt;
    line-height: 1.5;
    margin: 12px 0;
  }
  .chapter-content code {
    font-family: 'JetBrains Mono', monospace;
    font-size: 9.5pt;
  }
  .chapter-content p code, .chapter-content li code {
    background: #f1f5f9;
    padding: 1px 6px;
    border-radius: 4px;
    color: #be185d;
    font-size: 9pt;
  }

  /* Tables */
  .chapter-content table {
    width: 100%;
    border-collapse: collapse;
    margin: 12px 0;
    font-size: 10pt;
  }
  .chapter-content th {
    background: var(--navy);
    color: white;
    padding: 8px 12px;
    text-align: left;
    font-weight: 600;
    font-size: 9pt;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .chapter-content td {
    padding: 8px 12px;
    border-bottom: 1px solid var(--border);
  }
  .chapter-content tr:nth-child(even) td { background: var(--bg-alt); }

  /* Blockquote */
  .chapter-content blockquote {
    border-left: 3px solid var(--accent);
    padding: 8px 16px;
    margin: 12px 0;
    background: #eff6ff;
    border-radius: 0 6px 6px 0;
    color: var(--navy-light);
  }

  /* Print */
  @media print {
    body { font-size: 10pt; }
    .chapter { padding: 30px 50px; }
    .chapter-content pre { font-size: 8.5pt; }
    a { color: var(--text) !important; }
  }

  @page {
    size: A4;
    margin: 20mm 15mm 25mm 15mm;
  }
</style>
</head>
<body>

<!-- Cover -->
<div class="cover">
  <div class="cover-icon">⚡</div>
  <h1>Claude Code 핸드북</h1>
  <div class="subtitle">seobuk-kim framework</div>
  <div class="badge">v1.0 — Full-Stack Development Framework</div>
  <div class="meta">
    <span>Seobuk Corp.</span>
    <span>|</span>
    <span>${new Date().toISOString().split('T')[0]}</span>
    <span>|</span>
    <span>14 Chapters</span>
  </div>
</div>

<!-- TOC -->
<div class="toc">
  <h2>목차</h2>
  ${tocHtml}
</div>

<!-- Chapters -->
${chaptersHtml}

<script>hljs.highlightAll();<\/script>
</body>
</html>`;

fs.writeFileSync(OUTPUT_HTML, fullHtml, 'utf-8');
console.log(`✅ HTML 생성 완료: ${OUTPUT_HTML}`);
console.log(`📄 챕터 ${chapters.length}개 포함`);
