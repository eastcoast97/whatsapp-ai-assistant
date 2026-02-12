/**
 * whatsapp-ai-assistant - Express Backend Server
 * 
 * DATA STORAGE: In-Memory Store (Development/Demo Only)
 * Data is LOST when the server restarts. Not suitable for production.
 * 
 * FOR PRODUCTION, replace the dataStore with:
 * - PostgreSQL with Prisma ORM
 * - MongoDB with Mongoose
 * - SQLite for simple apps
 *
 * INTEGRATIONS: WhatsApp Web (whatsapp-web.js), OpenAI API, Anthropic Claude API
 */

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

interface DataStore {
  [key: string]: any[];
}

const dataStore: DataStore = {
  environmentConfigurations: [], // EnvironmentConfiguration records
  databaseSchemas: [], // DatabaseSchema records
  sessionManagements: [], // SessionManagement records
  qrCodePairings: [], // QrCodePairing records
  conversations: [], // Conversation records
  connectionStatusBars: [], // ConnectionStatusBar records
  chatInterfaces: [], // ChatInterface records
  landings: [], // Landing records
  messages: [], // Integration data
};

// Helper to generate IDs (use UUID in production)
const generateId = () => Math.random().toString(36).substring(2, 15);

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API info
app.get('/api', (req: Request, res: Response) => {
  res.json({ 
    message: 'whatsapp-ai-assistant API', 
    version: '1.0.0',
    endpoints: [
      '/environment-configurations',
      '/database-schemas',
      '/session-managements',
      '/qr-code-pairings',
      '/conversations',
      '/connection-status-bars',
      '/chat-interfaces',
      '/landings',
      '/whatsapp-web-whatsapp-web-js',
      '/openai-api',
      '/anthropic-claude-api'
    ]
  });
});

// ==================== EnvironmentConfiguration Routes ====================

// GET all EnvironmentConfigurations
app.get('/api/environment-configurations', (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const start = (page - 1) * limit;
  const items = dataStore.environmentConfigurations.slice(start, start + limit);
  
  res.json({
    data: items,
    pagination: {
      page,
      limit,
      total: dataStore.environmentConfigurations.length,
      pages: Math.ceil(dataStore.environmentConfigurations.length / limit)
    }
  });
});

// GET EnvironmentConfiguration by ID
app.get('/api/environment-configurations/:id', (req: Request, res: Response) => {
  const item = dataStore.environmentConfigurations.find(i => i.id === req.params.id);
  if (!item) {
    return res.status(404).json({ error: 'EnvironmentConfiguration not found' });
  }
  res.json({ data: item });
});

// POST create EnvironmentConfiguration
app.post('/api/environment-configurations', (req: Request, res: Response) => {
  const newItem = {
    id: generateId(),
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  dataStore.environmentConfigurations.push(newItem);
  res.status(201).json({ data: newItem, message: 'EnvironmentConfiguration created successfully' });
});

// PUT update EnvironmentConfiguration
app.put('/api/environment-configurations/:id', (req: Request, res: Response) => {
  const index = dataStore.environmentConfigurations.findIndex(i => i.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'EnvironmentConfiguration not found' });
  }
  dataStore.environmentConfigurations[index] = {
    ...dataStore.environmentConfigurations[index],
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  res.json({ data: dataStore.environmentConfigurations[index], message: 'EnvironmentConfiguration updated successfully' });
});

// DELETE EnvironmentConfiguration
app.delete('/api/environment-configurations/:id', (req: Request, res: Response) => {
  const index = dataStore.environmentConfigurations.findIndex(i => i.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'EnvironmentConfiguration not found' });
  }
  dataStore.environmentConfigurations.splice(index, 1);
  res.json({ message: 'EnvironmentConfiguration deleted successfully' });
});

// ==================== DatabaseSchema Routes ====================

// GET all DatabaseSchemas
app.get('/api/database-schemas', (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const start = (page - 1) * limit;
  const items = dataStore.databaseSchemas.slice(start, start + limit);
  
  res.json({
    data: items,
    pagination: {
      page,
      limit,
      total: dataStore.databaseSchemas.length,
      pages: Math.ceil(dataStore.databaseSchemas.length / limit)
    }
  });
});

// GET DatabaseSchema by ID
app.get('/api/database-schemas/:id', (req: Request, res: Response) => {
  const item = dataStore.databaseSchemas.find(i => i.id === req.params.id);
  if (!item) {
    return res.status(404).json({ error: 'DatabaseSchema not found' });
  }
  res.json({ data: item });
});

// POST create DatabaseSchema
app.post('/api/database-schemas', (req: Request, res: Response) => {
  const newItem = {
    id: generateId(),
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  dataStore.databaseSchemas.push(newItem);
  res.status(201).json({ data: newItem, message: 'DatabaseSchema created successfully' });
});

// PUT update DatabaseSchema
app.put('/api/database-schemas/:id', (req: Request, res: Response) => {
  const index = dataStore.databaseSchemas.findIndex(i => i.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'DatabaseSchema not found' });
  }
  dataStore.databaseSchemas[index] = {
    ...dataStore.databaseSchemas[index],
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  res.json({ data: dataStore.databaseSchemas[index], message: 'DatabaseSchema updated successfully' });
});

// DELETE DatabaseSchema
app.delete('/api/database-schemas/:id', (req: Request, res: Response) => {
  const index = dataStore.databaseSchemas.findIndex(i => i.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'DatabaseSchema not found' });
  }
  dataStore.databaseSchemas.splice(index, 1);
  res.json({ message: 'DatabaseSchema deleted successfully' });
});

// ==================== SessionManagement Routes ====================

// GET all SessionManagements
app.get('/api/session-managements', (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const start = (page - 1) * limit;
  const items = dataStore.sessionManagements.slice(start, start + limit);
  
  res.json({
    data: items,
    pagination: {
      page,
      limit,
      total: dataStore.sessionManagements.length,
      pages: Math.ceil(dataStore.sessionManagements.length / limit)
    }
  });
});

// GET SessionManagement by ID
app.get('/api/session-managements/:id', (req: Request, res: Response) => {
  const item = dataStore.sessionManagements.find(i => i.id === req.params.id);
  if (!item) {
    return res.status(404).json({ error: 'SessionManagement not found' });
  }
  res.json({ data: item });
});

// POST create SessionManagement
app.post('/api/session-managements', (req: Request, res: Response) => {
  const newItem = {
    id: generateId(),
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  dataStore.sessionManagements.push(newItem);
  res.status(201).json({ data: newItem, message: 'SessionManagement created successfully' });
});

// PUT update SessionManagement
app.put('/api/session-managements/:id', (req: Request, res: Response) => {
  const index = dataStore.sessionManagements.findIndex(i => i.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'SessionManagement not found' });
  }
  dataStore.sessionManagements[index] = {
    ...dataStore.sessionManagements[index],
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  res.json({ data: dataStore.sessionManagements[index], message: 'SessionManagement updated successfully' });
});

// DELETE SessionManagement
app.delete('/api/session-managements/:id', (req: Request, res: Response) => {
  const index = dataStore.sessionManagements.findIndex(i => i.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'SessionManagement not found' });
  }
  dataStore.sessionManagements.splice(index, 1);
  res.json({ message: 'SessionManagement deleted successfully' });
});

// ==================== QrCodePairing Routes ====================

// GET all QrCodePairings
app.get('/api/qr-code-pairings', (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const start = (page - 1) * limit;
  const items = dataStore.qrCodePairings.slice(start, start + limit);
  
  res.json({
    data: items,
    pagination: {
      page,
      limit,
      total: dataStore.qrCodePairings.length,
      pages: Math.ceil(dataStore.qrCodePairings.length / limit)
    }
  });
});

// GET QrCodePairing by ID
app.get('/api/qr-code-pairings/:id', (req: Request, res: Response) => {
  const item = dataStore.qrCodePairings.find(i => i.id === req.params.id);
  if (!item) {
    return res.status(404).json({ error: 'QrCodePairing not found' });
  }
  res.json({ data: item });
});

// POST create QrCodePairing
app.post('/api/qr-code-pairings', (req: Request, res: Response) => {
  const newItem = {
    id: generateId(),
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  dataStore.qrCodePairings.push(newItem);
  res.status(201).json({ data: newItem, message: 'QrCodePairing created successfully' });
});

// PUT update QrCodePairing
app.put('/api/qr-code-pairings/:id', (req: Request, res: Response) => {
  const index = dataStore.qrCodePairings.findIndex(i => i.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'QrCodePairing not found' });
  }
  dataStore.qrCodePairings[index] = {
    ...dataStore.qrCodePairings[index],
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  res.json({ data: dataStore.qrCodePairings[index], message: 'QrCodePairing updated successfully' });
});

// DELETE QrCodePairing
app.delete('/api/qr-code-pairings/:id', (req: Request, res: Response) => {
  const index = dataStore.qrCodePairings.findIndex(i => i.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'QrCodePairing not found' });
  }
  dataStore.qrCodePairings.splice(index, 1);
  res.json({ message: 'QrCodePairing deleted successfully' });
});

// ==================== Conversation Routes ====================

// GET all Conversations
app.get('/api/conversations', (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const start = (page - 1) * limit;
  const items = dataStore.conversations.slice(start, start + limit);
  
  res.json({
    data: items,
    pagination: {
      page,
      limit,
      total: dataStore.conversations.length,
      pages: Math.ceil(dataStore.conversations.length / limit)
    }
  });
});

// GET Conversation by ID
app.get('/api/conversations/:id', (req: Request, res: Response) => {
  const item = dataStore.conversations.find(i => i.id === req.params.id);
  if (!item) {
    return res.status(404).json({ error: 'Conversation not found' });
  }
  res.json({ data: item });
});

// POST create Conversation
app.post('/api/conversations', (req: Request, res: Response) => {
  const newItem = {
    id: generateId(),
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  dataStore.conversations.push(newItem);
  res.status(201).json({ data: newItem, message: 'Conversation created successfully' });
});

// PUT update Conversation
app.put('/api/conversations/:id', (req: Request, res: Response) => {
  const index = dataStore.conversations.findIndex(i => i.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Conversation not found' });
  }
  dataStore.conversations[index] = {
    ...dataStore.conversations[index],
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  res.json({ data: dataStore.conversations[index], message: 'Conversation updated successfully' });
});

// DELETE Conversation
app.delete('/api/conversations/:id', (req: Request, res: Response) => {
  const index = dataStore.conversations.findIndex(i => i.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Conversation not found' });
  }
  dataStore.conversations.splice(index, 1);
  res.json({ message: 'Conversation deleted successfully' });
});

// ==================== ConnectionStatusBar Routes ====================

// GET all ConnectionStatusBars
app.get('/api/connection-status-bars', (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const start = (page - 1) * limit;
  const items = dataStore.connectionStatusBars.slice(start, start + limit);
  
  res.json({
    data: items,
    pagination: {
      page,
      limit,
      total: dataStore.connectionStatusBars.length,
      pages: Math.ceil(dataStore.connectionStatusBars.length / limit)
    }
  });
});

// GET ConnectionStatusBar by ID
app.get('/api/connection-status-bars/:id', (req: Request, res: Response) => {
  const item = dataStore.connectionStatusBars.find(i => i.id === req.params.id);
  if (!item) {
    return res.status(404).json({ error: 'ConnectionStatusBar not found' });
  }
  res.json({ data: item });
});

// POST create ConnectionStatusBar
app.post('/api/connection-status-bars', (req: Request, res: Response) => {
  const newItem = {
    id: generateId(),
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  dataStore.connectionStatusBars.push(newItem);
  res.status(201).json({ data: newItem, message: 'ConnectionStatusBar created successfully' });
});

// PUT update ConnectionStatusBar
app.put('/api/connection-status-bars/:id', (req: Request, res: Response) => {
  const index = dataStore.connectionStatusBars.findIndex(i => i.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'ConnectionStatusBar not found' });
  }
  dataStore.connectionStatusBars[index] = {
    ...dataStore.connectionStatusBars[index],
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  res.json({ data: dataStore.connectionStatusBars[index], message: 'ConnectionStatusBar updated successfully' });
});

// DELETE ConnectionStatusBar
app.delete('/api/connection-status-bars/:id', (req: Request, res: Response) => {
  const index = dataStore.connectionStatusBars.findIndex(i => i.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'ConnectionStatusBar not found' });
  }
  dataStore.connectionStatusBars.splice(index, 1);
  res.json({ message: 'ConnectionStatusBar deleted successfully' });
});

// ==================== ChatInterface Routes ====================

// GET all ChatInterfaces
app.get('/api/chat-interfaces', (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const start = (page - 1) * limit;
  const items = dataStore.chatInterfaces.slice(start, start + limit);
  
  res.json({
    data: items,
    pagination: {
      page,
      limit,
      total: dataStore.chatInterfaces.length,
      pages: Math.ceil(dataStore.chatInterfaces.length / limit)
    }
  });
});

// GET ChatInterface by ID
app.get('/api/chat-interfaces/:id', (req: Request, res: Response) => {
  const item = dataStore.chatInterfaces.find(i => i.id === req.params.id);
  if (!item) {
    return res.status(404).json({ error: 'ChatInterface not found' });
  }
  res.json({ data: item });
});

// POST create ChatInterface
app.post('/api/chat-interfaces', (req: Request, res: Response) => {
  const newItem = {
    id: generateId(),
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  dataStore.chatInterfaces.push(newItem);
  res.status(201).json({ data: newItem, message: 'ChatInterface created successfully' });
});

// PUT update ChatInterface
app.put('/api/chat-interfaces/:id', (req: Request, res: Response) => {
  const index = dataStore.chatInterfaces.findIndex(i => i.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'ChatInterface not found' });
  }
  dataStore.chatInterfaces[index] = {
    ...dataStore.chatInterfaces[index],
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  res.json({ data: dataStore.chatInterfaces[index], message: 'ChatInterface updated successfully' });
});

// DELETE ChatInterface
app.delete('/api/chat-interfaces/:id', (req: Request, res: Response) => {
  const index = dataStore.chatInterfaces.findIndex(i => i.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'ChatInterface not found' });
  }
  dataStore.chatInterfaces.splice(index, 1);
  res.json({ message: 'ChatInterface deleted successfully' });
});

// ==================== Landing Routes ====================

// GET all Landings
app.get('/api/landings', (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const start = (page - 1) * limit;
  const items = dataStore.landings.slice(start, start + limit);
  
  res.json({
    data: items,
    pagination: {
      page,
      limit,
      total: dataStore.landings.length,
      pages: Math.ceil(dataStore.landings.length / limit)
    }
  });
});

// GET Landing by ID
app.get('/api/landings/:id', (req: Request, res: Response) => {
  const item = dataStore.landings.find(i => i.id === req.params.id);
  if (!item) {
    return res.status(404).json({ error: 'Landing not found' });
  }
  res.json({ data: item });
});

// POST create Landing
app.post('/api/landings', (req: Request, res: Response) => {
  const newItem = {
    id: generateId(),
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  dataStore.landings.push(newItem);
  res.status(201).json({ data: newItem, message: 'Landing created successfully' });
});

// PUT update Landing
app.put('/api/landings/:id', (req: Request, res: Response) => {
  const index = dataStore.landings.findIndex(i => i.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Landing not found' });
  }
  dataStore.landings[index] = {
    ...dataStore.landings[index],
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  res.json({ data: dataStore.landings[index], message: 'Landing updated successfully' });
});

// DELETE Landing
app.delete('/api/landings/:id', (req: Request, res: Response) => {
  const index = dataStore.landings.findIndex(i => i.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Landing not found' });
  }
  dataStore.landings.splice(index, 1);
  res.json({ message: 'Landing deleted successfully' });
});


// ==================== WhatsApp Web Integration ====================
import { Client, LocalAuth, Message as WAMessage } from 'whatsapp-web.js';
import * as QRCode from 'qrcode';
import { Server as SocketIOServer } from 'socket.io';
import http from 'http';

const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

// WhatsApp client with session persistence
const waClient = new Client({
  authStrategy: new LocalAuth({
    dataPath: process.env.SESSION_DATA_PATH || './.wwebjs_auth'
  }),
  puppeteer: {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }
});

let whatsappReady = false;
let currentQR: string | null = null;

// QR Code event: generate scannable QR and push to frontend
waClient.on('qr', async (qr: string) => {
  console.log('[WhatsApp] QR code received');
  try {
    currentQR = await QRCode.toDataURL(qr, { width: 256 });
    io.emit('whatsapp:qr', currentQR);
  } catch (err) {
    console.error('[WhatsApp] QR generation error:', err);
  }
});

// Authenticated event
waClient.on('authenticated', () => {
  console.log('[WhatsApp] Authenticated successfully');
  currentQR = null;
  io.emit('whatsapp:authenticated');
});

// Ready event: client is fully connected
waClient.on('ready', () => {
  console.log('[WhatsApp] Client is ready');
  whatsappReady = true;
  io.emit('whatsapp:ready');
});

// Incoming message event
waClient.on('message', async (msg: WAMessage) => {
  const messageData = {
    id: msg.id._serialized,
    from: msg.from,
    body: msg.body,
    timestamp: msg.timestamp,
    isGroupMsg: msg.from.includes('@g.us'),
  };
  
  console.log('[WhatsApp] Message from', msg.from, ':', msg.body);
  
  // Store the message
  dataStore.messages.push({
    id: generateId(),
    ...messageData,
    direction: 'incoming',
    createdAt: new Date().toISOString()
  });
  
  // Emit to frontend
  io.emit('whatsapp:message', messageData);
  
  // AUTO-REPLY HOOK: Add your AI/custom reply logic here
  // Example: const reply = await generateAIReply(msg.body);
  //          await msg.reply(reply);
});

// Disconnected event
waClient.on('disconnected', (reason: string) => {
  console.log('[WhatsApp] Disconnected:', reason);
  whatsappReady = false;
  io.emit('whatsapp:disconnected', reason);
});

// Socket.IO connection handler
io.on('connection', (socket) => {
  console.log('[Socket.IO] Client connected:', socket.id);
  
  // Send current state
  socket.emit('whatsapp:status', { ready: whatsappReady, hasQR: !!currentQR });
  if (currentQR) {
    socket.emit('whatsapp:qr', currentQR);
  }
  
  socket.on('disconnect', () => {
    console.log('[Socket.IO] Client disconnected:', socket.id);
  });
});

// REST endpoints for WhatsApp
app.get('/api/whatsapp/status', (req: Request, res: Response) => {
  res.json({ ready: whatsappReady, hasQR: !!currentQR });
});

app.get('/api/whatsapp/qr', (req: Request, res: Response) => {
  if (currentQR) {
    res.json({ qr: currentQR });
  } else if (whatsappReady) {
    res.json({ message: 'Already connected, no QR needed' });
  } else {
    res.status(404).json({ error: 'No QR code available. Initializing...' });
  }
});

app.post('/api/whatsapp/send', async (req: Request, res: Response) => {
  if (!whatsappReady) {
    return res.status(503).json({ error: 'WhatsApp client not ready' });
  }
  const { to, message } = req.body;
  if (!to || !message) {
    return res.status(400).json({ error: 'Missing "to" and "message" fields' });
  }
  try {
    const chatId = to.includes('@') ? to : to + '@c.us';
    await waClient.sendMessage(chatId, message);
    
    dataStore.messages.push({
      id: generateId(),
      from: 'me',
      to: chatId,
      body: message,
      direction: 'outgoing',
      timestamp: Math.floor(Date.now() / 1000),
      createdAt: new Date().toISOString()
    });
    
    res.json({ success: true, message: 'Message sent' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to send message', details: err.message });
  }
});

app.get('/api/whatsapp/messages', (req: Request, res: Response) => {
  const { from, limit = '50' } = req.query;
  let messages = dataStore.messages || [];
  if (from) {
    messages = messages.filter((m: any) => m.from === from || m.to === from);
  }
  res.json({ data: messages.slice(-parseInt(limit as string)) });
});

// Initialize WhatsApp client
waClient.initialize().catch(err => {
  console.error('[WhatsApp] Initialization error:', err);
});


// ==================== OpenAI Integration ====================
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const AI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

app.post('/api/ai/chat', async (req: Request, res: Response) => {
  const { message, conversationHistory = [], systemPrompt } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Missing "message" field' });
  }
  try {
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt || 'You are a helpful assistant.' },
      ...conversationHistory.map((m: any) => ({ role: m.role, content: m.content })),
      { role: 'user', content: message },
    ];
    
    const completion = await openai.chat.completions.create({
      model: AI_MODEL,
      messages,
      max_tokens: 1024,
    });
    
    const reply = completion.choices[0]?.message?.content || '';
    
    dataStore.conversations.push({
      id: generateId(),
      userMessage: message,
      aiReply: reply,
      model: AI_MODEL,
      tokens: completion.usage?.total_tokens,
      createdAt: new Date().toISOString(),
    });
    
    res.json({ reply, usage: completion.usage });
  } catch (err: any) {
    console.error('[OpenAI] Error:', err.message);
    res.status(500).json({ error: 'AI request failed', details: err.message });
  }
});

app.post('/api/ai/stream', async (req: Request, res: Response) => {
  const { message, conversationHistory = [], systemPrompt } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Missing "message" field' });
  }
  
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  
  try {
    const stream = await openai.chat.completions.create({
      model: AI_MODEL,
      messages: [
        { role: 'system', content: systemPrompt || 'You are a helpful assistant.' },
        ...conversationHistory.map((m: any) => ({ role: m.role, content: m.content })),
        { role: 'user', content: message },
      ],
      stream: true,
    });
    
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        res.write('data: ' + JSON.stringify({ content }) + '\n\n');
      }
    }
    res.write('data: [DONE]\n\n');
    res.end();
  } catch (err: any) {
    res.write('data: ' + JSON.stringify({ error: err.message }) + '\n\n');
    res.end();
  }
});


// ==================== Anthropic Claude Integration ====================
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

app.post('/api/ai/chat', async (req: Request, res: Response) => {
  const { message, conversationHistory = [], systemPrompt } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Missing "message" field' });
  }
  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: systemPrompt || 'You are a helpful assistant.',
      messages: [
        ...conversationHistory.map((m: any) => ({ role: m.role, content: m.content })),
        { role: 'user', content: message },
      ],
    });
    
    const reply = response.content[0]?.type === 'text' ? response.content[0].text : '';
    res.json({ reply, usage: response.usage });
  } catch (err: any) {
    res.status(500).json({ error: 'AI request failed', details: err.message });
  }
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Using http.createServer for Socket.IO support
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📚 API docs: http://localhost:${PORT}/api`);
  console.log(`🔌 WebSocket ready for real-time connections`);
});
