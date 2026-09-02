const http = require('http');
const os = require('os');

const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', uptime: process.uptime() }));
    return;
  }

  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>IDP Platform</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      color: #f1f5f9;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .card {
      background: rgba(30, 41, 59, 0.6);
      border: 1px solid rgba(148, 163, 184, 0.15);
      border-radius: 16px;
      padding: 48px 56px;
      max-width: 520px;
      backdrop-filter: blur(10px);
      box-shadow: 0 20px 60px rgba(0,0,0,0.4);
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(34, 197, 94, 0.15);
      color: #4ade80;
      padding: 6px 14px;
      border-radius: 999px;
      font-size: 13px;
      font-weight: 600;
      margin-bottom: 24px;
    }
    .dot {
      width: 8px; height: 8px;
      background: #4ade80;
      border-radius: 50%;
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.4; }
    }
    h1 {
      font-size: 28px;
      font-weight: 700;
      margin-bottom: 8px;
      letter-spacing: -0.5px;
    }
    .subtitle {
      color: #94a3b8;
      font-size: 15px;
      margin-bottom: 32px;
    }
    .meta {
      display: grid;
      gap: 14px;
    }
    .row {
      display: flex;
      justify-content: space-between;
      padding: 12px 16px;
      background: rgba(15, 23, 42, 0.5);
      border-radius: 10px;
      font-size: 14px;
    }
    .label { color: #64748b; }
    .value { color: #e2e8f0; font-family: 'SF Mono', Consolas, monospace; }
    .footer {
      margin-top: 28px;
      padding-top: 20px;
      border-top: 1px solid rgba(148, 163, 184, 0.1);
      font-size: 13px;
      color: #64748b;
    }
    .stack {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
      margin-top: 10px;
    }
    .tag {
      background: rgba(99, 102, 241, 0.15);
      color: #a5b4fc;
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 500;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge"><span class="dot"></span> LIVE</div>
    <h1>IDP Platform</h1>
    <p class="subtitle">Deployed automatically via GitOps pipeline</p>
    <div class="meta">
      <div class="row"><span class="label">Host</span><span class="value">${os.hostname()}</span></div>
      <div class="row"><span class="label">Platform</span><span class="value">${os.platform()} / ${os.arch()}</span></div>
      <div class="row"><span class="label">Timestamp</span><span class="value">${new Date().toISOString()}</span></div>
      <div class="row"><span class="label">Uptime</span><span class="value">${Math.floor(process.uptime())}s</span></div>
    </div>
    <div class="footer">
      Built with
      <div class="stack">
        <span class="tag">Terraform</span>
        <span class="tag">Docker</span>
        <span class="tag">Kubernetes</span>
        <span class="tag">Argo CD</span>
        <span class="tag">AWS</span>
      </div>
    </div>
  </div>
</body>
</html>
  `);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});