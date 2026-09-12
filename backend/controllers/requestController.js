const { createRequestService } = require('../services/requestService');

async function createRequestController(req, res) {
  console.log('[createRequestController] Incoming request body:', req.body);
  try {
    const payload = {
      ...req.body,
      submitterEmail: req.body?.submitterEmail || req.user?.email || '',
    };

    const request = await createRequestService(payload);

    console.log('[createRequestController] Request created successfully with ID:', request.id || request._id);
    return res.status(201).json({
      success: true,
      message: 'Donation request created successfully',
      request,
    });
  } catch (error) {
    console.error('[createRequestController] Error creating request:', error.message);
    return res.status(400).json({
      success: false,
      message: error.message || 'Unable to create donation request',
    });
  }
}

module.exports = {
  createRequestController,
};

