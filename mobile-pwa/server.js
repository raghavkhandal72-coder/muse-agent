'use strict';

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

// Locate modules resiliently
let Validator, Processor, Store;
try {
  const mod = require('../demo-app/src/index');
  Validator = mod.Validator;
  Processor = mod.Processor;
  Store = mod.Store;
} catch (e) {
  try {
    const mod = require('../src/index');
    Validator = mod.Validator;
    Processor = mod.Processor;
    Store = mod.Store;
  } catch (err) {
    console.error('Failed to load demo-app/src/index:', err);
  }
}

let ReaDoctor;
try {
  ReaDoctor = require('../rea-inspector/lib/doctor');
} catch (e) {
  try {
    ReaDoctor = require('../../rea-inspector/lib/doctor');
  } catch (err) {
    console.error('Failed to load doctor:', err);
  }
}

const store = new Store();
const PUBLIC_DIR = path.join(__dirname, 'public');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.json': 'application/json',
  '.js': 'application/javascript',
  '.svg': 'image/svg+xml',
  '.css': 'text/css'
};

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => {
      data += chunk;
      if (data.length > 1e6) {
        req.destroy();
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      if (!data) return resolve({});
      try {
        resolve(JSON.parse(data));
      } catch (err) {
        reject(new Error('Invalid JSON format'));
      }
    });
  });
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  });
  res.end(JSON.stringify(payload));
}

function createServer() {
  return http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const pathname = url.pathname;

    if (req.method === 'GET') {
      if (pathname === '/' || pathname === '/index.html') {
        const content = fs.readFileSync(path.join(PUBLIC_DIR, 'index.html'));
        res.writeHead(200, { 'Content-Type': MIME_TYPES['.html'] });
        return res.end(content);
      }

      const filePath = path.join(PUBLIC_DIR, pathname);
      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const ext = path.extname(filePath);
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';
        res.writeHead(200, { 'Content-Type': contentType });
        return res.end(fs.readFileSync(filePath));
      }

      if (pathname === '/api/doctor') {
        const report = ReaDoctor.runDiagnostics();
        return sendJson(res, 200, report);
      }
    }

    if (req.method === 'POST') {
      try {
        const body = await parseBody(req);

        switch (pathname) {
          case '/api/hash': {
            if (typeof body.text !== 'string') {
              return sendJson(res, 400, { error: 'String "text" is required' });
            }
            const hash = Processor.hash(body.text);
            return sendJson(res, 200, { hash });
          }

          case '/api/encrypt': {
            if (!body.text || !body.key) {
              return sendJson(res, 400, { error: '"text" and "key" are required' });
            }
            const result = Processor.encrypt(body.text, body.key);
            return sendJson(res, 200, result);
          }

          case '/api/decrypt': {
            if (!body.payload || !body.key) {
              return sendJson(res, 400, { error: '"payload" object and "key" are required' });
            }
            const decrypted = Processor.decrypt(body.payload, body.key);
            return sendJson(res, 200, { decrypted });
          }

          case '/api/sanitize': {
            const raw = body.text || '';
            const sanitized = Validator.sanitize(raw);
            return sendJson(res, 200, { sanitized });
          }

          case '/api/store/set': {
            if (!body.key || typeof body.value === 'undefined') {
              return sendJson(res, 400, { error: '"key" and "value" are required' });
            }
            const record = store.set(body.key, body.value);
            return sendJson(res, 200, { success: true, record, audit: store.getAuditTrail() });
          }

          case '/api/store/get': {
            if (!body.key) {
              return sendJson(res, 400, { error: '"key" is required' });
            }
            const value = store.get(body.key);
            return sendJson(res, 200, { key: body.key, value, exists: store.has(body.key) });
          }

          default:
            return sendJson(res, 404, { error: 'API Route Not Found' });
        }
      } catch (err) {
        return sendJson(res, 500, { error: err.message });
      }
    }

    sendJson(res, 404, { error: 'Not Found' });
  });
}

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  const server = createServer();
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`PWA Web Server running at http://0.0.0.0:${PORT}`);
  });
}

module.exports = { createServer };
