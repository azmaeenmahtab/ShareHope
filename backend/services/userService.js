const db = require('../db');

const editableFields = [
  'name',
  'phone',
  'organizationName',
  'isMuslim',
  'bio',
  'address',
  'city',
  'occupation',
  'avatarUrl',
];

const updateProfileService = async (email, payload = {}) => {
  const database = db.getDb();
  if (!database) throw new Error('Database is not connected');

  const normalizedEmail = String(email).toLowerCase().trim();
  const updates = {};

  editableFields.forEach((field) => {
    if (payload[field] !== undefined) {
      updates[field] = field === 'isMuslim' ? Boolean(payload[field]) : String(payload[field] || '').trim();
    }
  });

  if (!updates.name) throw new Error('Name is required');
  if (updates.avatarUrl && !updates.avatarUrl.startsWith('data:image/')) {
    throw new Error('Profile photo must be an image');
  }

  updates.updatedAt = new Date();
  const result = await database.collection('user').findOneAndUpdate(
    { email: normalizedEmail },
    { $set: updates },
    { returnDocument: 'after', projection: { password: 0 } }
  );

  const updatedUser = result?.value || result;
  if (!updatedUser) throw new Error('User not found');
  return updatedUser;
};

module.exports = { updateProfileService };
