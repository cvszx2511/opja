const http = require('http');
const fs   = require('fs');
const path = require('path');

const DB_FILE   = path.join(__dirname, 'data', 'db.json');
const HTML_FILE = path.join(__dirname, 'index.html');
const PORT      = 3000;
const EMPTY_DB  = '{"projects":[],"issues":{},"active":null}';

fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });

http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/api/db') {
    const data = fs.existsSync(DB_FILE) ? fs.readFileSync(DB_FILE, 'utf8') : EMPTY_DB;
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(data);

  } else if (req.method === 'POST' && req.url === '/api/db') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        JSON.parse(body);
        fs.writeFileSync(DB_FILE, body);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end('{"ok":true}');
      } catch {
        res.writeHead(400);
        res.end('{"error":"invalid json"}');
      }
    });

  } else if (req.method === 'GET' && (req.url === '/' || req.url === '/index.html')) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(fs.readFileSync(HTML_FILE));

  } else {
    res.writeHead(404);
    res.end('Not found');
  }
}).listen(PORT, '0.0.0.0', () => console.log(`opja listening on :${PORT}`));
