const { createRequestService } = require('../services/requestService');

async function createRequestController(req, res) {
  try {
    const request = await createRequestService(req.body || {});

    return res.status(201).json({
      success: true,
      message: 'Donation request created successfully',
      request,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Unable to create donation request',
    });
  }
}

module.exports = {
  createRequestController,
};
