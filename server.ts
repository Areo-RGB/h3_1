import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import crypto from 'crypto';

// In-memory mock data stores
const appData = new Map<string, Map<string, unknown>>();
const users = new Map<string, Record<string, unknown>>();

// Helper to hash PIN
function hashPinSync(pin: string) {
  return crypto.createHash('sha256').update(pin).digest('hex');
}

// Ensure default admin user
const defaultAdminId = 'admin_001';
users.set(defaultAdminId, {
  id: defaultAdminId,
  name: 'Admin',
  email: 'admin@h03.uk',
  role: 'admin',
  pin_hash: hashPinSync('1234')
});

function segments(pathStr: string) {
  return pathStr.split('/').filter(Boolean);
}

function getCollection(name: string) {
  if (!appData.has(name)) {
    appData.set(name, new Map());
  }
  return appData.get(name)!;
}

function readData(pathStr: string): unknown {
  const parts = segments(pathStr);
  if (!parts.length) return {};
  const values = getCollection(parts[0]);
  const collectionData = Object.fromEntries(values.entries());
  let value: unknown = collectionData;
  for (const part of parts.slice(1)) {
    value = (value as Record<string, unknown>)?.[part];
  }
  return value ?? null;
}

function setNested(target: unknown, pathArr: string[], value: unknown) {
  if (!pathArr.length) return value;
  const next = target && typeof target === 'object' ? structuredClone(target) as Record<string, unknown> : {};
  let cursor = next;
  pathArr.slice(0, -1).forEach((part) => {
    if (!cursor[part] || typeof cursor[part] !== 'object') cursor[part] = {};
    cursor = cursor[part] as Record<string, unknown>;
  });
  const last = pathArr[pathArr.length - 1];
  if (value === null) delete cursor[last];
  else cursor[last] = value;
  return next;
}

function upsertData(collectionName: string, id: string, value: unknown) {
  const collection = getCollection(collectionName);
  if (value === null) {
    collection.delete(id);
  } else {
    collection.set(id, value);
  }
}

const defaultPlayers = [
  'Silas', 'Finley', 'Arvid', 'Lion', 'Jakob', 'Paul', 'Lennox', 'Levi',
  'Lasse', 'Milan', 'Lionel', 'Arturo', 'Peter', 'Tommy', 'Alex', 'Tayo'
];

defaultPlayers.forEach((name, i) => {
  const id = `user_${(i + 1).toString().padStart(3, '0')}`;
  users.set(id, {
    id,
    name,
    email: `${name.toLowerCase()}@h03.uk`,
    role: 'user',
    pin_hash: hashPinSync('1234')
  });
  upsertData('mitglieder', id, { id, name, type: 'user' });
});


function setPathData(pathStr: string, value: unknown) {
  const parts = segments(pathStr);
  if (!parts.length) throw new Error('Root replacement is not supported');
  const name = parts[0];
  if (parts.length === 1) {
    appData.delete(name);
    if (value && typeof value === 'object') {
      for (const [id, row] of Object.entries(value)) {
        upsertData(name, id, row);
      }
    }
    return value === null ? null : value || {};
  }
  const id = parts[1];
  const current = readData(`${name}/${id}`);
  const next = setNested(current, parts.slice(2), value);
  upsertData(name, id, next);
  return next;
}

async function startServer() {
  const app = express();
  app.use(express.json());
  const PORT = 3000;

  // ==== API ROUTES ====
  
  // Data API
  app.get('/api/data', (req, res) => {
    try {
      const pathStr = (req.query.path as string) || '';
      res.json(readData(pathStr));
    } catch (err: unknown) {
      res.status(500).json({ error: err instanceof Error ? err.message : 'Unknown error' });
    }
  });

  app.post('/api/data', (req, res) => {
    try {
      const body = req.body;
      if (body.op === 'get') {
        res.json(readData(body.path || ''));
        return;
      }
      if (body.op === 'set') {
        res.json(setPathData(body.path, body.value));
        return;
      }
      if (body.op === 'remove') {
        res.json(setPathData(body.path, null));
        return;
      }
      if (body.op === 'update') {
        const updates = body.path
          ? Object.fromEntries(
              Object.entries(body.value || {}).map(([key, value]) => [`${body.path}/${key}`, value]),
            )
          : body.value || {};
        for (const [pathStr, value] of Object.entries(updates)) {
          setPathData(pathStr, value);
        }
        res.json(true);
        return;
      }
      res.status(400).json({ error: 'Unknown operation' });
    } catch (err: unknown) {
      res.status(500).json({ error: err instanceof Error ? err.message : 'Unknown error' });
    }
  });

  // Auth API
  app.get('/api/auth', (req, res) => {
    const userList = Array.from(users.values()).map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      type: u.role,
      forwardingEmail: u.forwardingEmail,
      forwardingVerified: Boolean(u.forwardingVerified)
    })).sort((a, b) => (String(a.name) || '').localeCompare(String(b.name) || ''));
    res.json(userList);
  });

  app.post('/api/auth', (req, res) => {
    const body = req.body;
    
    if (body.action === 'login') {
      if (!body.identifier || !/^\\d{4}$/.test(body.pin || '')) {
        res.status(400).json({ error: 'Invalid login' });
        return;
      }
      const identifier = String(body.identifier).trim().toLowerCase();
      const pinHash = hashPinSync(String(body.pin));
      
      const user = Array.from(users.values()).find(u => 
        String(u.email || '').toLowerCase() === identifier || 
        String(u.name || '').toLowerCase() === identifier || 
        String(u.id || '').toLowerCase() === identifier
      );
      
      if (!user || user.pin_hash !== pinHash) {
        res.status(401).json({ error: 'Invalid name, email, or PIN' });
        return;
      }
      
      res.json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          type: user.role,
          forwardingEmail: user.forwardingEmail,
          forwardingVerified: Boolean(user.forwardingVerified),
          password: body.pin
        }
      });
      return;
    }

    if (body.action === 'create-user') {
      const admin = users.get(body.adminId);
      if (!admin || admin.role !== 'admin' || admin.pin_hash !== hashPinSync(body.adminPin)) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      if (!body.name || !/^\\d{4}$/.test(body.pin || '')) {
        res.status(401).json({ error: 'Invalid name or PIN' });
        return;
      }
      const id = `user_${crypto.randomUUID()}`;
      const name = String(body.name).trim();
      const email = `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}@h03.uk`;
      
      users.set(id, {
        id,
        name,
        email,
        role: 'user',
        pin_hash: hashPinSync(body.pin)
      });
      
      upsertData('mitglieder', id, { id, name, type: 'user' });
      
      res.status(201).json({ user: { id, name, email, type: 'user', forwardingVerified: false } });
      return;
    }
    
    if (body.action === 'seed-users') {
      const admin = users.get(body.adminId);
      if (!admin || admin.role !== 'admin') {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      let created = 0;
      for (const entry of body.users) {
        const id = String(entry.id || '');
        const name = String(entry.name || '').trim();
        if (!id || !name) continue;
        if (!users.has(id)) {
          const email = `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}@h03.uk`;
          users.set(id, {
            id,
            name,
            email,
            role: entry.type === 'admin' ? 'admin' : 'user',
            pin_hash: hashPinSync('1234')
          });
          upsertData('mitglieder', id, { id, name, type: entry.type === 'admin' ? 'admin' : 'user' });
          created += 1;
        }
      }
      res.json({ ok: true, created });
      return;
    }
    
    if (body.action === 'regenerate-pin') {
      const requester = users.get(String(body.requesterId));
      if (!requester || requester.pin_hash !== hashPinSync(String(body.currentPin))) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      const target = users.get(String(body.userId));
      if (!target) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      if (requester.role !== 'admin' && requester.id !== target.id) {
        res.status(403).json({ error: 'Users may only regenerate their own PIN' });
        return;
      }
      if (!/^\\d{4}$/.test(body.newPin || '')) {
        res.status(400).json({ error: 'Invalid PIN' });
        return;
      }
      
      target.pin_hash = hashPinSync(String(body.newPin));
      users.set(target.id as string, target);
      res.json({ ok: true, pin: body.newPin });
      return;
    }

    res.status(400).json({ error: 'Unknown action' });
  });

  // Email Forward API (stubbed since it relied on Cloudflare features)
  app.post('/api/email-forward', (req, res) => {
    res.json({ ok: true });
  });

  // ==== VITE MIDDLEWARE ====
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
