const test = require('node:test');
const assert = require('node:assert/strict');

const { createRequestService } = require('../services/requestService');

test('createRequestService validates and normalizes donation request data', async () => {
  const request = await createRequestService({
    name: 'Karim Family',
    type: 'Family',
    category: 'Medical & Health',
    goal: '50000',
    area: 'Nikunja, Dhaka',
    desc: 'This family needs urgent support for a surgery and treatment costs.',
    urgent: true,
    methods: ['bKash', 'Bank'],
    docs: ['📄 NID copy', '📄 Doctor note'],
    image: 'https://example.com/family.jpg',
    contactName: 'Rahim Karim',
    contactPhone: '01712345678',
    contactEmail: 'rahim@example.com',
    relationship: 'Family Member',
  });

  assert.equal(request.name, 'Karim Family');
  assert.equal(request.goal, 50000);
  assert.equal(request.urgent, true);
  assert.deepEqual(request.methods, ['bKash', 'Bank']);
  assert.equal(request.contactPhone, '01712345678');
  assert.ok(request.id);
});

test('createRequestService rejects invalid goal amounts', async () => {
  await assert.rejects(
    () => createRequestService({
      name: 'A',
      type: 'Individual',
      category: 'Education & Tuition',
      goal: '0',
      area: 'Dhaka',
      desc: 'Need help',
      urgent: false,
      methods: ['bKash'],
      docs: ['📄 NID copy'],
      contactName: 'A',
      contactPhone: '01712345678',
    }),
    /valid targeted goal amount/i
  );
});
