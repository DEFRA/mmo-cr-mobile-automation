/**
 * Lightweight HTTP proxy controller for simulating offline/online.
 *
 * Run this as a sidecar alongside your Appium tests.
 * Your iOS Simulator must be configured to route traffic through this proxy.
 *
 * Usage:
 *   npm run proxy:controller                  → starts the proxy on port 8080, API on 8081
 *   POST http://localhost:8081/block           → block all traffic (simulate offline)
 *   POST http://localhost:8081/allow           → allow all traffic (simulate online)
 *   GET  http://localhost:8081/status          → check current state
 *
 * Simulator proxy setup (one-time, per Mac):
 *   The iOS Simulator shares the host Mac's network stack, so pointing the
 *   host's Wi-Fi proxy at this server routes Simulator traffic through it too:
 *     networksetup -setwebproxy "Wi-Fi" 127.0.0.1 8080
 *     networksetup -setsecurewebproxy "Wi-Fi" 127.0.0.1 8080
 *
 *   To restore normal networking afterwards:
 *     networksetup -setwebproxystate "Wi-Fi" off
 *     networksetup -setsecurewebproxystate "Wi-Fi" off
 *
 *   This only works for the local `test:ios` run (real, local Simulator).
 *   It cannot reach BrowserStack's cloud devices (test:ios:browserstack),
 *   since those devices are not on your local network.
 */

import http, { type IncomingMessage, type ServerResponse } from 'node:http';
import net from 'node:net';

let isBlocking = false;

// ─── Forward Proxy (port 8080) ──────────────────────────────────
const proxy = http.createServer((req: IncomingMessage, res: ServerResponse) => {
    if (isBlocking) {
        res.writeHead(503, { 'Content-Type': 'text/plain' });
        res.end('Service Unavailable — simulated offline');
        return;
    }

    if (!req.url) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Bad Request — missing URL');
        return;
    }

    // Forward the request
    const url = new URL(req.url);
    const options = {
        hostname: url.hostname,
        port: url.port || 80,
        path: url.pathname + url.search,
        method: req.method,
        headers: req.headers,
    };

    const proxyReq = http.request(options, (proxyRes) => {
        res.writeHead(proxyRes.statusCode ?? 502, proxyRes.headers);
        proxyRes.pipe(res);
    });

    proxyReq.on('error', (err) => {
        res.writeHead(502, { 'Content-Type': 'text/plain' });
        res.end(`Proxy error: ${err.message}`);
    });

    req.pipe(proxyReq);
});

// Handle CONNECT for HTTPS
proxy.on('connect', (req, clientSocket: net.Socket, head: Buffer) => {
    if (isBlocking) {
        clientSocket.write('HTTP/1.1 503 Service Unavailable\r\n\r\n');
        clientSocket.end();
        return;
    }

    const [host, port] = (req.url ?? '').split(':');
    const serverSocket = net.connect(Number(port) || 443, host, () => {
        clientSocket.write('HTTP/1.1 200 Connection Established\r\n\r\n');
        serverSocket.write(head);
        serverSocket.pipe(clientSocket);
        clientSocket.pipe(serverSocket);
    });

    serverSocket.on('error', () => {
        clientSocket.write('HTTP/1.1 502 Bad Gateway\r\n\r\n');
        clientSocket.end();
    });
});

// ─── Control API (port 8081) ────────────────────────────────────
const api = http.createServer((req: IncomingMessage, res: ServerResponse) => {
    res.setHeader('Content-Type', 'application/json');

    if (req.method === 'POST' && req.url === '/block') {
        isBlocking = true;
        console.log('🚫 BLOCKING all traffic (offline mode)');
        res.end(JSON.stringify({ status: 'blocking', message: 'All traffic blocked' }));
    } else if (req.method === 'POST' && req.url === '/allow') {
        isBlocking = false;
        console.log('✅ ALLOWING all traffic (online mode)');
        res.end(JSON.stringify({ status: 'allowing', message: 'All traffic allowed' }));
    } else if (req.method === 'GET' && req.url === '/status') {
        res.end(JSON.stringify({ blocking: isBlocking }));
    } else {
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'Not found' }));
    }
});

// ─── Start ──────────────────────────────────────────────────────
const PROXY_PORT = Number(process.env.PROXY_PORT) || 8080;
const API_PORT = Number(process.env.PROXY_API_PORT) || 8081;

proxy.listen(PROXY_PORT, () => {
    console.log(`🔀 Forward proxy listening on port ${PROXY_PORT}`);
});

api.listen(API_PORT, () => {
    console.log(`🎛️  Control API listening on port ${API_PORT}`);
    console.log(`   POST /block  → simulate offline`);
    console.log(`   POST /allow  → simulate online`);
    console.log(`   GET  /status → check state`);
});
