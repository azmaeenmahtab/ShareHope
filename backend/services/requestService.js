

const db = require('../db');

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=700&auto=format&fit=crop';
const REQUESTS_COLLECTION = 'requests';

const normalizeArrayField = (value) => {
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.map((item) => String(item).trim()).filter(Boolean);
      }
    } catch {
      // not a JSON array string
    }
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
};

const normalizeDocList = (docs = []) => {
  const list = normalizeArrayField(docs);
  return [...new Set(list.map((doc) => (doc.startsWith('📄') ? doc.trim() : `📄 ${doc.trim()}`)))];
};

const createRequestId = () => `SH-${Math.floor(10000 + Math.random() * 90000)}`;

function normalizeRequestPayload(payload = {}) {
  const name = String(payload.name || '').trim();
  const type = String(payload.type || 'Individual').trim() || 'Individual';
  const category = String(payload.category || 'Family support').trim() || 'Family support';
  const goalRaw = Number(payload.goal);
  const area = String(payload.area || '').trim();
  const desc = String(payload.desc || '').trim();
  const contactName = String(payload.contactName || '').trim();
  const contactPhone = String(payload.contactPhone || '').trim();
  const contactEmail = String(payload.contactEmail || '').trim();
  const relationship = String(payload.relationship || 'Self').trim() || 'Self';
  const submitterEmail = String(payload.submitterEmail || '').trim();
  const methods = [...new Set(normalizeArrayField(payload.methods))];
  const docs = normalizeDocList(payload.docs);
  const image = String(payload.image || '').trim() || DEFAULT_IMAGE;

  if (!name) {
    throw new Error('Please enter the title or beneficiary name');
  }

  if (!Number.isFinite(goalRaw) || goalRaw <= 0) {
    throw new Error('Please enter a valid targeted goal amount');
  }

  if (!area) {
    throw new Error('Please specify the location or area');
  }

  if (!desc || desc.length < 20) {
    throw new Error('Please provide a detailed description (at least 20 characters)');
  }

  if (!contactName) {
    throw new Error('Please enter contact person name');
  }

  if (!contactPhone) {
    throw new Error('Please enter a valid phone number');
  }

  if (!methods.length) {
    throw new Error('Select at least one preferred payment/transfer method');
  }

  return {
    id: createRequestId(),
    name,
    type,
    category,
    goal: Number(goalRaw),
    area,
    desc,
    urgent: Boolean(payload.urgent),
    methods,
    docs: docs.length ? docs : ['📄 NID copy'],
    image,
    contactName,
    contactPhone,
    contactEmail,
    relationship,
    submitterEmail: submitterEmail || undefined,
    verified: false,
    raised: Number.isFinite(Number(payload.raised)) ? Number(payload.raised) : 0,
    percent: Number(goalRaw) > 0 ? Math.min(100, Math.round(((Number.isFinite(Number(payload.raised)) ? Number(payload.raised) : 0) / Number(goalRaw)) * 100)) : 0,
    createdAt: new Date(),
  };
}

async function createRequestService(payload = {}) {
  const normalizedRequest = normalizeRequestPayload(payload);

  let database = db.getDb();
  if (!database) {
    console.log('[requestService] Database not yet initialized, attempting to connect...');
    database = await db.connectDB();
  }
  if (!database) {
    throw new Error('Database is not connected. Please try again in a moment.');
  }

  const collection = database.collection(REQUESTS_COLLECTION);


  try {
    const result = await collection.insertOne(normalizedRequest);
    return {
      ...normalizedRequest,
      _id: result.insertedId,
    };
  } catch (error) {
    throw new Error(error.message || 'Unable to save donation request');
  }
}

module.exports = {
  createRequestService,
  normalizeRequestPayload,
};
