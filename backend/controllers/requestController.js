const { createRequestService, getAllRequestsService } = require('../services/requestService');

async function createRequestController(req, res) {
  console.log('[createRequestController] Incoming request body:', req.body);
  try {
    const payload = {
      ...req.body,
      submitterEmail: req.body?.submitterEmail || req.user?.email || '',
      submitterId: req.user?.id || '',
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

async function getAllRequestsController(req, res) {
  try {
    const requests = await getAllRequestsService();
    console.log(`[getAllRequestsController] Fetched ${requests.length} requests`);
    return res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    console.error('[getAllRequestsController] Error:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'Unable to fetch donation requests',
    });
  }
}

module.exports = {
  createRequestController,
  getAllRequestsController,
};


